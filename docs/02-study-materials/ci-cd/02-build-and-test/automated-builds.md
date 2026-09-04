---
sidebar_position: 1
title: Automated Builds
---

# Automated Builds

The first thing most pipelines do: take source code and turn it into something runnable —
compiling, bundling, or otherwise transforming it, exactly the same way it would happen on a
developer's own machine, just automated and consistent.

## Why automate something a developer can already do locally

```bash
npm install
npm run build
```

Running this locally proves it works **on your machine**, with your specific installed versions,
your local environment quirks, possibly uncommitted local changes. An automated build runs in a
clean, consistent environment every time — the same "works on my machine" problem
[containers](/study-materials/docker/basics/what-is-a-container) solve for running an app, CI
solves for *building* it.

## A build step should be deterministic

Given the same input (the same commit), a build should produce the same output every time. Things
that break this:

```text
❌ Depending on "latest" versions of dependencies resolving differently over time
❌ Depending on the current date/time in a way that affects output
❌ Relying on files that happen to exist on one machine but aren't checked into the repo
```

A non-deterministic build is a common source of "it built fine yesterday, fails today with no
code change" — pinning dependency versions (a lockfile like `package-lock.json`) is the single
most common fix.

## What "build" means varies a lot by stack

```text
Compiled language (Go, Rust, Java):  source → compiled binary/bytecode
Bundled frontend (React, Vue):        source → optimized JS/CSS bundle
Static site (this docs site):          markdown/content → static HTML/CSS/JS
Container image:                        Dockerfile → OCI image (see the Docker topic)
Interpreted language (plain Python):     often no separate "build" step at all — just install deps
```

Regardless of stack, the pipeline concept is the same: a defined, automated, reproducible step
that turns source into something ready for the next stage (see
[The Pipeline Concept](../01-basics/the-pipeline-concept.md)).

## Build caching

```yaml title="Caching dependencies between runs (conceptual)"
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-${{ hashFiles('package-lock.json') }}
```

Re-downloading and reinstalling every dependency on every single pipeline run is slow and often
unnecessary if nothing changed — see
[Caching in CI](../04-pipeline-design/caching-in-ci.md) for how this works and why the cache key
matters.

## Failing fast on a broken build

```yaml
jobs:
  build:
    steps:
      - run: npm run build    # if this fails, the job stops here
  test:
    needs: build                # only runs if build succeeded
    steps:
      - run: npm test
```

A build failure should stop the pipeline immediately rather than continuing on to run tests
against code that doesn't even compile — wasted time and a confusing failure (a test failure that's
actually just a build failure in disguise) otherwise.
