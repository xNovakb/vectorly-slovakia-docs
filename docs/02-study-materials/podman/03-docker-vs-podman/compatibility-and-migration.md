---
sidebar_position: 2
title: Compatibility & Migration
---

# Compatibility & Migration

How far "Podman is a drop-in replacement for Docker" actually holds, and where it genuinely
doesn't — the practical question behind
[Architecture Differences](./architecture-differences.md)'s more abstract comparison.

## What migrates with zero changes

```bash
alias docker=podman
```

For the large majority of everyday use — building images from a `Dockerfile`, running containers,
`docker ps`/`logs`/`exec`, even most `docker-compose.yml` files via
[podman-compose](../02-using-podman/podman-compose.md) — this literal alias is often enough.
Existing shell scripts, CI steps, and documentation that reference `docker` commands typically keep
working unmodified.

```bash
# Existing scripts using this pattern need no changes at all:
docker build -t my-app .
docker run -d --name web my-app
docker logs -f web
```

## What needs a second look before migrating

**Anything talking to the Docker daemon's API directly** (not just the `docker` CLI) — some CI
runners, IDE integrations, and third-party tools assume a Docker-compatible socket exists at a
known path.

```bash
podman system service --time=0 unix:///run/user/1000/podman/podman.sock
```

Podman *can* expose a Docker-API-compatible socket this way, letting API-based tooling work
against it — but this is an explicit opt-in step, not automatic, unlike Docker's daemon socket
which simply exists once Docker is installed and running.

**Privileged ports, if running rootless** (see
[Rootless by Default](../01-basics/rootless-by-default.md)) — binding to port 80/443 directly
needs either running rootful, or the `net.ipv4.ip_unprivileged_port_start` kernel setting adjusted.

**Volume permission edge cases** — because rootless Podman maps container UIDs through user
namespaces (see [Rootless by Default](../01-basics/rootless-by-default.md)), a bind-mounted
directory's ownership can behave differently than under Docker's traditional root-daemon model,
particularly with images that hardcode specific UID/GID expectations for mounted data.

## A realistic migration checklist

```text
1. Install Podman, try `alias docker=podman` against existing scripts/Compose files.
2. Run the actual test suite / CI pipeline against Podman, don't just eyeball it.
3. Check for anything talking to a Docker socket directly (not just the docker CLI) —
   IDE Docker integrations, some CI runner internals, certain GUI tools.
4. If running rootless and binding low ports, adjust the kernel setting or accept rootful
   for those specific services.
5. Check bind-mounted volume permissions specifically, if any image assumes a fixed UID/GID.
```

## Why most teams don't need a "big bang" migration

Because both tools consume the same OCI images and largely the same Dockerfile/Compose syntax,
switching is rarely an all-or-nothing decision — a team can run Podman locally for development
(getting the rootless security benefit day to day) while production still runs Docker, or vice
versa, without the image format or Dockerfiles themselves needing to differ at all. The
[Docker topic](/study-materials/docker/basics/what-is-a-container)'s content — Dockerfiles, image layers, Compose files — is
equally applicable regardless of which engine actually runs them.
