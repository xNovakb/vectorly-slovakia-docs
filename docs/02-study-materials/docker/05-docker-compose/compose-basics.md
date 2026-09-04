---
sidebar_position: 1
title: Compose Basics
---

# Compose Basics

Running one container is a single `docker run` command. Running an app made of several
containers — a web app, a database, a reverse proxy — quickly turns into a long list of commands
to remember and run in the right order. **Docker Compose** replaces that with one declarative YAML
file.

## A minimal `docker-compose.yml`

```yaml title="docker-compose.yml"
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:16
    volumes:
      - pg-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=devpassword

volumes:
  pg-data:
```

Each entry under `services:` is roughly one `docker run` command's worth of configuration,
declared instead of typed out — `build: .` is a `docker build` + `docker run` combined, `image:`
alone just pulls and runs an existing image.

## The core commands

```bash
docker compose up            # build (if needed) and start every service, attached to the logs
docker compose up -d           # same, but detached (background)
docker compose down              # stop and remove every service's containers
docker compose down -v             # also remove volumes — DESTROYS any data in them
docker compose ps                    # list this project's containers and their status
docker compose logs -f web             # follow logs for just one service
```

:::warning
`docker compose down -v` removes volumes along with the containers — for a project with a database
service, this deletes its data (see
[Data Persistence](../04-networking-and-storage/data-persistence.md)). Plain `docker compose down`
(no `-v`) is the safe default; only add `-v` when you specifically mean to wipe everything.
:::

## Rebuilding after a code change

```bash
docker compose up -d --build      # rebuild images before starting, then (re)start
```

This is the exact command behind this org's own deploy step — see
[Compose in This Org's Deploy](./compose-in-this-orgs-deploy.md) for how it's used for real.

## Why declarative beats a shell script of `docker run` commands

- **One source of truth** — the whole app's shape (services, networking, volumes, env) lives in
  one reviewable file, not scattered across imperative commands or someone's memory.
- **Consistent networking** — every service in one `docker-compose.yml` is automatically placed on
  a shared network, reachable by service name, without manually creating and attaching a custom
  network the way plain `docker run` requires (see
  [Ports & Network Modes](../04-networking-and-storage/ports-and-network-modes.md)).
- **Reproducible** — anyone with the repo and Docker installed can bring up the exact same set of
  services with one command, no tribal knowledge of "run these five `docker run` commands in this
  order" required.

## `docker-compose` vs. `docker compose`

```bash
docker-compose up      # older, standalone Python tool (v1), now deprecated
docker compose up        # modern, built into the Docker CLI itself (v2) — the current standard
```

The space-separated `docker compose` (no hyphen) is the current, actively maintained version,
built directly into Docker itself rather than a separate tool to install — worth knowing since
both forms still show up in older tutorials and existing scripts.
