---
sidebar_position: 10
title: Git & CI/CD Workflow
---

# Git & CI/CD Workflow

Professional Git workflow for this repo (solo-dev / B2B consulting setup). Aligns with `main` + `develop` branch model, manual CI/CD trigger, squash rebasing, Conventional Commits.

## Branching strategy

**`main`** — production. Live at `docs.vectorly-slovakia.sk`. Every push triggers GitHub Actions: build container, deploy live. Kept 100% stable.

**`develop`** — staging/integration. New chapters, structural updates, TypeScript config changes. Pushes here do **not** auto-deploy — sandbox.

**`feature/*`, `fix/*`** — short-lived branches off `develop` for a specific change (e.g. `feature/mbm-group-docs`, `fix/broken-link`).

## Direct-to-`main` exception: docs-only changes

Pure documentation edits (`docs/`, `blog/`, typo fixes, content updates — no config/build/dependency changes) may be pushed straight to `main` without going through `develop`. Low blast radius, fast iteration for content work.

Anything touching code, config, dependencies, or build tooling (`docusaurus.config.ts`, `package.json`, `src/`, `.github/workflows/`, `Dockerfile`, etc.) must go through `develop` → feature branch → PR → squash merge. Never pushed directly to `main`.

Enforce via GitHub branch protection on `main`: require PR + review for everyone, but allow a docs-only CODEOWNERS/path exception if you want it automated — otherwise this is a process rule you self-enforce.

## CI/CD trigger

`.github/workflows/deploy.yml` triggers on:

```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch: # manual trigger from Actions tab
```

`push` to `main` → auto-deploy. `workflow_dispatch` → manual redeploy without new commit (e.g. re-run after server hiccup).

## Commit messages: Conventional Commits

```
feat(mbm-group): add initial access topology and credentials guide
fix(study): correct Neo4j Cypher query syntax in graph notes
docs(internal): update server backup recovery runbook
```

## Merging: squash & rebase

Keep `main`/`develop` history linear, one meaningful commit per feature. No `typo` / `fix bug` / `test again` commits in permanent history.

### Step-by-step

```bash
# 1. Branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/neo4j-notes

# 2. Commit with Conventional Commits
git add .
git commit -m "feat(study): add advanced graph indexing notes"

# 3. Rebase + squash local commits before push
git fetch origin develop
git rebase -i origin/develop
# mark extra commits as 'squash', save, exit

# 4. Push
git push origin feature/neo4j-notes --force-with-lease

# 5. Open PR into develop, "Squash and merge"
# 6. When ready to ship: PR develop -> main, "Squash and merge"
#    -> triggers deploy.yml automatically
```

Docs-only fast path (see exception above) skips steps 1 and 5-6's `develop` hop:

```bash
git checkout main
git pull origin main
git checkout -b fix/broken-link
# edit docs
git add .
git commit -m "fix(docs): correct broken link in intro"
git push origin fix/broken-link
# open PR straight into main, squash merge -> auto-deploys
```
