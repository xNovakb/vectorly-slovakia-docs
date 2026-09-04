---
sidebar_position: 2
title: Multi-Container Apps
---

# Multi-Container Apps

A realistic app is rarely one container — a typical shape splits concerns across several,
composed together.

## A more complete example

```yaml title="docker-compose.yml"
services:
  api:
    build: ./api
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache

  worker:
    build: ./api          # same image as api, different command — a background job processor
    command: node worker.js
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres:16
    volumes:
      - pg-data:/var/lib/postgresql/data

  cache:
    image: redis:7

volumes:
  pg-data:
```

Notice `api` and `worker` connect to the database using the hostname `db`, not an IP address or
`localhost` — Compose's automatic networking (see
[Compose Basics](./compose-basics.md)) resolves service names to the right container
automatically, the same built-in DNS mechanism covered in
[Ports & Network Modes](../04-networking-and-storage/ports-and-network-modes.md) for custom
Docker networks generally.

## `depends_on` — what it actually guarantees, and what it doesn't

```yaml
services:
  api:
    depends_on:
      - db
```

`depends_on` controls **start order** — Docker starts `db` before starting `api`. It does **not**
wait for `db` to actually be *ready* to accept connections, only for its container process to have
started. A database container can take a few seconds after starting before it's actually accepting
connections — `api` might start and immediately fail to connect if it doesn't handle that gap
itself.

```yaml
services:
  api:
    depends_on:
      db:
        condition: service_healthy    # wait for db's actual healthcheck to pass, not just "started"
  db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5
```

`condition: service_healthy` is the real fix — it waits for the dependency's own
[healthcheck](../06-production-practices/health-checks-and-restart-policies.md) to report healthy,
not just "the process started." Without this, a well-written app usually needs its own
retry-on-connect logic anyway, since "container started" and "ready to serve traffic" are
genuinely different moments.

## Scaling one service

```bash
docker compose up -d --scale worker=3
```

Runs three instances of the `worker` service simultaneously — useful for a background job
processor that benefits from parallelism. Doesn't make sense for every service (a service bound to
a fixed host port with `ports:` can't have multiple instances competing for the same host port
without additional configuration).

## Overriding config per environment

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Compose merges multiple files in order — a common pattern is a base `docker-compose.yml` with
shared config, plus a `docker-compose.prod.yml` (or `.dev.yml`) overriding just what differs per
environment (different `environment:` values, different `ports:`, whether volumes are bind-mounted
for live-reload).
