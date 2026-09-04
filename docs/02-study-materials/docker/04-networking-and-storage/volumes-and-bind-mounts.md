---
sidebar_position: 2
title: Volumes & Bind Mounts
---

# Volumes & Bind Mounts

Two different ways to give a container access to data that lives outside its own writable layer —
similar surface, genuinely different use cases.

## Named volumes — Docker-managed storage

```bash
docker volume create app-data
docker run -v app-data:/var/lib/postgresql/data postgres
```

Docker manages where the volume actually lives on disk (typically under
`/var/lib/docker/volumes/`) — you don't need to know or care about the exact host path. The volume
persists independently of any container, and can be attached to a new container even after the
original one is removed.

```bash
docker volume ls                    # list all volumes
docker volume inspect app-data        # where it actually lives on disk, and what's using it
docker volume rm app-data               # delete it — only if nothing is currently using it
```

## Bind mounts — a specific host path, directly

```bash
docker run -v /home/deploy/app-config:/etc/app/config nginx
docker run -v "$(pwd)":/app node:22    # common in local dev: mount the current project directory
```

Maps a **specific, known path on the host** directly into the container. Unlike a named volume,
you (not Docker) choose exactly where on the host filesystem the data lives — useful when you
specifically need to access or edit those files directly from the host, not just from inside the
container.

## Named volume vs. bind mount, side by side

| | Named volume | Bind mount |
|---|---|---|
| Host path | Docker-managed, opaque | You choose the exact path |
| Portable across hosts | Yes (the volume name is what matters) | No (assumes that exact host path exists) |
| Good for | Production data (databases, uploaded files) | Local development (live-editing source code), config files with a known host location |
| Editable directly from the host | Awkward — you'd need to find Docker's internal path | Trivial — it's just a normal path on the host |

## The local-dev pattern: bind-mounting source code

```bash
docker run -v "$(pwd)":/app -p 3000:3000 node:22 npm run dev
```

Mounting the project directory means changes made in your editor (on the host) are immediately
visible inside the container, without rebuilding the image — this is how most local dev setups
get live-reload working with a containerized app, and is specifically a **development** pattern,
not something used in the production setup covered in
[This Org's Container Setup](../06-production-practices/this-orgs-container-setup.md) (production
containers run the actual built image, not a live-mounted source tree).

## Anonymous volumes — a subtler third option

```dockerfile
VOLUME /var/lib/mysql
```

A `VOLUME` instruction in a Dockerfile creates an anonymous volume automatically at container
start if nothing else is mounted at that path — commonly seen in official database images to
ensure data doesn't silently live only in the ephemeral writable layer, even if the person running
the container forgot to mount a named volume themselves.

:::warning
Removing a container with `docker rm` does **not** remove volumes it had mounted, by default —
including anonymous ones, unless you pass `-v` to `docker rm`. This is usually the right default
(data outlives the container), but anonymous volumes from repeatedly recreated containers can
quietly accumulate disk usage over time if never cleaned up (`docker volume prune` removes unused
ones).
:::
