---
sidebar_position: 1
title: Conventional Commits
---

# Conventional Commits

[Conventional Commits](https://www.conventionalcommits.org/) is a standard format for commit
messages: `<type>(<scope>): <description>`. This repo uses it — see the commit history for real
examples, or [`/internal-operations/git-workflow`](/internal-operations/git-workflow) for the
policy.

## Format

```
<type>(<scope>): <short summary>

<optional longer body>

<optional footer>
```

- **type** — what kind of change (see table below)
- **scope** — optional, the area affected (a folder, module, or feature name)
- **summary** — imperative mood, lowercase, no trailing period: "add", not "added" or "Adds"

## Common types

| Type | Use for |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `refactor` | Code change that's neither a fix nor a feature (no behavior change) |
| `test` | Adding or fixing tests |
| `chore` | Build process, tooling, dependency bumps — nothing user-facing |
| `style` | Formatting only (whitespace, semicolons) — no logic change |

## Real examples from this repo

```
feat(mbm-group): add initial access topology and credentials guide
fix(study): correct Neo4j Cypher query syntax in graph notes
docs(internal): update server backup recovery runbook
fix(docs): correct broken link in intro
```

## Why bother

- **Changelog automation** — tools like `standard-version` or `semantic-release` read commit types
  to auto-generate a changelog and pick the next version number.
- **Semver automation** — by convention: `fix` → patch bump, `feat` → minor bump, a
  `BREAKING CHANGE:` footer → major bump.
- **Skimmable history** — `git log --oneline` becomes a readable summary of *what kind* of work
  happened, not just "fix", "update", "wip" over and over.

## Breaking changes

Add a footer (not part of the summary line):

```
feat(api): change login endpoint response shape

BREAKING CHANGE: `token` field renamed to `accessToken` in the login response.
```

## Common mistake

Don't write the type/scope and then repeat it in prose:

```
❌ fix: fix bug where login fails
✅ fix(auth): reject empty password on login instead of 500ing
```

The type already says "this is a fix" — spend the summary explaining *what* changed instead.

## Check yourself

- What does a `BREAKING CHANGE:` footer trigger under semver automation?

  <details>
  <summary>Answer</summary>

  A major version bump (as opposed to `fix` → patch, `feat` → minor).
  </details>

- What's wrong with a message like `fix: fix bug where login fails`?

  <details>
  <summary>Answer</summary>

  It repeats the type ("fix") in the summary text instead of using that space to explain what
  specifically changed.
  </details>

- What two things does a Conventional Commits type enable automating?

  <details>
  <summary>Answer</summary>

  Changelog generation and semver version bumps, both driven by reading the commit type.
  </details>
