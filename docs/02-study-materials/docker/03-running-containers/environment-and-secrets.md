---
sidebar_position: 3
title: Environment & Secrets
---

# Environment & Secrets

Passing configuration into a container without baking it into the image — the same environment
variable mechanism covered generally in
[Environment Variables & PATH](/study-materials/linux-shell/practical-shell/environment-variables-and-path)
in the Linux & Shell topic, applied specifically to containers.

## Setting environment variables

```bash
docker run -e NODE_ENV=production -e PORT=3000 my-app
```

```bash title=".env"
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://user:pass@db:5432/mydb
```

```bash
docker run --env-file .env my-app
```

`--env-file` reads a plain `KEY=VALUE` file — much more manageable than a long list of `-e` flags
once there are more than a couple of variables.

## Why environment variables, not baked into the image

```dockerfile
❌ ENV DATABASE_URL=postgres://user:realpassword@db:5432/mydb   # baked into the image, in every layer, forever
```

Anything set with `ENV` in a Dockerfile becomes part of the **image itself** — visible to anyone
who can `docker inspect` or pull that image, and permanently embedded in its layer history even if
a *later* layer overwrites it. Passing config at `docker run` time instead keeps the image generic
and reusable across environments (dev, staging, production) without rebuilding it, and keeps
secrets out of the image entirely.

:::danger
Never put a real secret (password, API key, token) in a Dockerfile's `ENV` or `ARG` instruction,
or in `RUN` commands that echo it. Docker images are commonly pushed to registries, and even a
value later overwritten by another layer is still recoverable from the image's layer history —
this is the exact same secret-hygiene principle as never committing a secret to git — this repo's
own conventions treat git history as forever and never store real credentials in it — just applied
to image layers instead of commits.
:::

## Secrets specifically — beyond plain env vars

Plain environment variables are visible to anything that can inspect the container
(`docker inspect`, `/proc/<pid>/environ` from inside the container) — acceptable for most
non-sensitive config, but not ideal for genuinely sensitive secrets in a production setup.

```bash
# Docker Compose secrets — mounted as files, not environment variables
docker compose config    # shows the resolved configuration, useful for confirming what's actually set
```

```yaml title="docker-compose.yml"
services:
  app:
    image: my-app
    secrets:
      - db_password

secrets:
  db_password:
    file: ./db_password.txt
```

This mounts the secret as a **file** inside the container (typically under `/run/secrets/`)
instead of an environment variable — a meaningfully smaller exposure surface, since it doesn't
show up in `docker inspect`'s environment listing or get inherited by child processes the way env
vars automatically do.

## A practical layering of config

```text
Dockerfile ENV       — safe defaults, never secrets (e.g. ENV PORT=3000)
docker run -e / --env-file  — per-environment, non-sensitive config (NODE_ENV, feature flags)
Compose secrets / a real secrets manager  — anything actually sensitive (passwords, API keys, tokens)
```

The same layering principle CI/CD pipelines use for deploy secrets (see
[`/internal-operations/git-workflow`](/internal-operations/git-workflow) for how this org's own
GitHub Actions workflow handles its deploy key) — never in the artifact itself, always injected at
runtime from something outside version control.
