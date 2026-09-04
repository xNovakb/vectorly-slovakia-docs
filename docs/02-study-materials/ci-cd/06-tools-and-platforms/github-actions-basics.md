---
sidebar_position: 1
title: GitHub Actions Basics
---

# GitHub Actions Basics

A concrete look at one specific, widely-used CI/CD platform — everything covered abstractly
earlier in this topic (pipelines, jobs, triggers, artifacts) maps directly onto GitHub Actions'
own vocabulary and file format.

## Where a workflow lives

```text
.github/workflows/ci.yml
.github/workflows/deploy.yml
```

Every workflow is a YAML file under `.github/workflows/` in the repository — multiple workflow
files can coexist, each triggered independently (see
[Triggers & Events](../01-basics/triggers-and-events.md)).

## The core vocabulary

```yaml title=".github/workflows/ci.yml"
name: CI

on:
  push:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install
      - run: npm test
```

- **`on`** — the trigger (see [Triggers & Events](../01-basics/triggers-and-events.md)).
- **`jobs`** — one or more jobs, each running on its own fresh runner (see
  [Stages & Jobs](../04-pipeline-design/stages-and-jobs.md)).
- **`runs-on`** — which runner environment this job needs (`ubuntu-latest`,
  `windows-latest`, `macos-latest`, or a self-hosted runner — see
  [Self-Hosted vs. Managed Runners](./self-hosted-vs-managed-runners.md)).
- **`steps`** — the sequence of commands/actions within one job, run in order.
- **`uses`** vs. **`run`** — two different kinds of step, covered next.

## `uses` — a reusable, packaged action

```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with:
    node-version: 22
```

An **action** is a pre-built, reusable unit of automation — someone else (GitHub itself, or the
community) already wrote and published it, and `uses:` just references it by name and version
(`@v4` pins a specific version, the same version-pinning caution covered for
[base images](/study-materials/docker/production-practices/dockerfile-best-practices) applies
here too). `actions/checkout` is nearly universal — it's what actually pulls the repository's code
onto the runner before any other step can use it.

## `run` — a plain shell command

```yaml
- run: npm install
- run: npm test
- run: |
    echo "Multi-line commands work too"
    echo "Each line runs in the same shell session"
```

No action needed for a simple shell command — `run:` just executes it directly on the runner,
exactly like typing it into a terminal (see
[What Is a Shell](/study-materials/linux-shell/basics/what-is-a-shell) in the Linux & Shell topic
for what's actually happening underneath).

## Runners

A **runner** is the actual machine that executes a job's steps — GitHub provides managed runners
(`ubuntu-latest` etc.) with common tools pre-installed, or a repository/org can register its own
**self-hosted** runner instead. See
[Self-Hosted vs. Managed Runners](./self-hosted-vs-managed-runners.md) for that tradeoff in depth.

## Referencing secrets

```yaml
- run: curl -H "Authorization: Bearer ${{ secrets.DEPLOY_TOKEN }}" https://api.example.com/deploy
```

`${{ secrets.NAME }}` pulls a value from the repository's (or organization's) configured secret
store — see [Managing Secrets in CI](../05-secrets-and-environments/managing-secrets-in-ci.md) for
the general principle this implements.
