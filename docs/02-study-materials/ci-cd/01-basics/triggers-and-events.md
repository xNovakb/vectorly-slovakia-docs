---
sidebar_position: 3
title: Triggers & Events
---

# Triggers & Events

A pipeline doesn't run on its own — something has to start it. A **trigger** is the event that
kicks off a pipeline run.

## Common trigger types

```yaml title="Push to a specific branch"
on:
  push:
    branches: [main]
```

```yaml title="A pull request being opened or updated"
on:
  pull_request:
    branches: [main]
```

```yaml title="A schedule (cron syntax)"
on:
  schedule:
    - cron: "0 3 * * *"    # every day at 3am
```

```yaml title="Manual trigger, no code change needed"
on:
  workflow_dispatch:
```

```yaml title="A new tag being pushed (common for releases)"
on:
  push:
    tags: ["v*"]
```

## Push vs. pull-request triggers — a meaningful difference

- **Push-triggered** — runs against the code exactly as it exists on that branch. Typically used
  for the branch that actually deploys (e.g. `main`).
- **Pull-request-triggered** — runs against the *merge result* of the PR's branch into its target
  — catching integration problems the PR's own branch alone wouldn't reveal, before merging
  happens at all. This is the trigger behind the "checks must pass before merging" pattern most
  teams use for code review gates.

## Scheduled triggers — beyond just responding to code changes

A scheduled pipeline runs independent of any code change — useful for things that need to happen
periodically regardless of whether anything changed:

```text
- Nightly full test suite runs (broader/slower than what runs on every push)
- Dependency vulnerability scans
- Scheduled backups or cleanup jobs
- Periodic link-checking on a docs site
```

## Manual triggers — a deliberate human action

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: "Which environment to deploy to"
        required: true
        default: "staging"
```

A manual trigger can accept inputs, turning a pipeline into something closer to a self-service
tool — "redeploy the current build to staging" as a button click, rather than requiring a new
commit just to re-run something.

## Combining multiple triggers

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:
```

Very common: run automatically on every push and PR, but *also* leave a manual trigger available
for cases like re-running a deploy without a new commit (e.g. after a transient infrastructure
failure, not a code problem).

## Filtering what actually triggers a run

```yaml
on:
  push:
    branches: [main]
    paths:
      - "src/**"
      - "package.json"
```

Path filters prevent irrelevant changes (a README typo fix) from triggering a full, possibly slow
pipeline unnecessarily — a meaningful cost/time saver on a large codebase where not every commit
touches code the pipeline actually needs to rebuild or retest.
