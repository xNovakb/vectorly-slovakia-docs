---
sidebar_position: 2
title: Caching in CI
---

# Caching in CI

Every fresh pipeline job typically starts from a clean environment (see
[Stages & Jobs](./stages-and-jobs.md)) — great for reproducibility, but it means re-downloading
and reinstalling the same dependencies on every single run unless something explicitly caches
them.

## What's worth caching

```text
- Package manager dependencies (node_modules, ~/.m2 for Maven, ~/.cargo for Rust)
- Build outputs that are expensive to regenerate but don't change often
- Downloaded base images or toolchains
```

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-${{ hashFiles('package-lock.json') }}
    restore-keys: |
      npm-
```

## Cache keys — the mechanism that makes this safe

A cache is only useful if it's invalidated exactly when it should be — reusing a stale cache
silently is worse than not caching at all, since it can mask a real dependency change. The `key`
is what controls this:

```yaml
key: npm-${{ hashFiles('package-lock.json') }}
```

Hashing the lockfile means the cache key **changes automatically** the moment dependencies
actually change — a new key means a cache miss, forcing a fresh install, exactly when it should.
This is conceptually the same idea as [Docker's layer caching](/study-materials/docker/images-and-dockerfiles/image-layers-and-caching)
— a cache keyed on its actual inputs, so it's reused only when those inputs are genuinely
unchanged.

## `restore-keys` — a fallback for partial cache hits

```yaml
key: npm-${{ hashFiles('package-lock.json') }}
restore-keys: |
  npm-
```

If no cache exactly matches the current key (lockfile changed), `restore-keys` lets the pipeline
fall back to the most recent cache with a matching **prefix** — still useful as a starting point
(most dependencies likely didn't change, even if the lockfile did), rather than starting from a
completely empty cache.

## Cache scoping — per-branch vs. shared

Most platforms scope caches to some degree by branch, to avoid one branch's changes polluting
another's cache in a way that produces incorrect results:

```text
- A cache created on a feature branch is often usable by PRs targeting that branch's base,
  but not automatically shared globally across every unrelated branch
- The default branch's cache is commonly used as a fallback base for new branches, since it's
  usually the most representative "current" dependency state
```

The exact scoping rules genuinely vary by platform — worth checking specifically, since assuming
the wrong scoping behavior can either waste cache potential (too narrow) or cause subtle
cross-branch contamination (too broad).

## Caching build outputs, not just dependencies

```yaml
- uses: actions/cache@v4
  with:
    path: .next/cache          # example: a framework's own incremental build cache
    key: nextjs-${{ hashFiles('**/*.js', '**/*.ts') }}
```

Some build tools maintain their own incremental-build cache (only rebuilding what actually
changed) — persisting that cache directory between CI runs, not just dependency installs, can cut
build time substantially for large codebases, on top of dependency caching alone.

## When caching backfires

:::warning
An overly broad cache key (or one that never changes) can serve genuinely stale, incorrect
artifacts — a build that "should" reflect a dependency update but doesn't, because the cache key
didn't actually change when it should have. When debugging a CI result that seems to ignore a real
change, an incorrectly-scoped cache is a common, easy-to-overlook suspect.
:::
