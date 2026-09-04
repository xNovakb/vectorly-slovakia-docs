---
sidebar_position: 1
title: Dockerfile Best Practices
---

# Dockerfile Best Practices

Patterns that separate a Dockerfile that merely works from one that's small, fast to build, and
safe to run in production.

## Multi-stage builds

The single highest-impact technique: build in one stage (with all the compilers, dev dependencies,
build tools you need), then copy only the *output* into a clean, minimal final stage.

```dockerfile title="Single-stage — ships the entire build toolchain"
FROM node:22
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["node", "dist/server.js"]
```

```dockerfile title="Multi-stage — ships only what's needed at runtime"
FROM node:22 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]
```

The final image contains only the `alpine`-based runtime and the built output — none of the
dev dependencies, build tools, or source files from the `builder` stage. This regularly cuts final
image size by 5-10x for compiled/bundled apps, with zero change to what the app actually does at
runtime.

## Minimizing layers and image size

```dockerfile
❌ RUN apt-get update
   RUN apt-get install -y curl
   RUN rm -rf /var/lib/apt/lists/*

✅ RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
```

Each `RUN` is a separate layer (see
[Image Layers & Caching](../02-images-and-dockerfiles/image-layers-and-caching.md)) — splitting a
cleanup step (`rm -rf /var/lib/apt/lists/*`) into its own `RUN` doesn't actually shrink the image,
because the files still exist in the *earlier* layer; only combining install-and-cleanup into one
`RUN` (one layer) actually removes them from the final image.

## Don't run as root inside the container

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install

USER node          # switch to a non-root user for everything from here on
CMD ["node", "server.js"]
```

By default, a container's process runs as root **inside the container** — not the same as root on
the host, but still a meaningfully larger attack surface than a non-root process, especially
combined with a container-escape vulnerability. Many official images (like `node`) already ship a
non-root user (`node`) ready to switch to with `USER`.

## Pin base image versions

```dockerfile
❌ FROM node:latest
✅ FROM node:22.11.0-alpine
```

`node:latest` silently changes over time — a rebuild months later can pull in a completely
different Node major version with no code change on your side, a classic source of "it worked
yesterday" builds. Same `latest`-tag caution as covered in
[Building & Tagging Images](../02-images-and-dockerfiles/building-and-tagging-images.md), applied
to base images specifically.

## Order instructions by change frequency

Covered in depth in
[Image Layers & Caching](../02-images-and-dockerfiles/image-layers-and-caching.md) — put
rarely-changing instructions (`FROM`, dependency installation) early, frequently-changing ones
(`COPY . .` for app code) last, so the build cache actually gets used on most rebuilds.

## Use `.dockerignore` aggressively

```text title=".dockerignore"
node_modules
.git
.env
*.md
Dockerfile
.dockerignore
```

Beyond just build speed (see
[Dockerfile Basics](../02-images-and-dockerfiles/dockerfile-basics.md)), this prevents accidentally
shipping `.git` history, local `.env` files, or other files never meant to leave your machine
inside the final image.
