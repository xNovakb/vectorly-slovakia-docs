---
sidebar_position: 1
title: Dockerfile Basics
---

# Dockerfile Basics

A **Dockerfile** is a plain-text recipe for building an image — a sequence of instructions, each
one adding a layer (see [Image Layers & Caching](./image-layers-and-caching.md)).

## The core instructions

```dockerfile title="Dockerfile"
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
```

- **`FROM`** — the base image everything else builds on top of. Almost every Dockerfile starts
  here; `node:22-alpine` means "start from an existing image that already has Node 22 installed,
  on the minimal Alpine Linux base."
- **`WORKDIR`** — sets the working directory for every instruction after it — like `cd`, but baked
  into the image build.
- **`COPY`** — copies files from the build context (your local project) into the image.
- **`RUN`** — executes a command *during the build*, and commits the result as a new layer (e.g.
  installing dependencies).
- **`EXPOSE`** — documents which port the container listens on. Purely informational — it doesn't
  actually publish the port (see
  [Ports & Network Modes](../04-networking-and-storage/ports-and-network-modes.md) for what does).
- **`CMD`** — the default command run when a container starts from this image. Overridable at
  `docker run` time; not run during the build itself.

## `COPY package*.json ./` before `COPY . .` — why the split

This ordering isn't arbitrary — it's a deliberate use of layer caching:

```dockerfile
COPY package*.json ./
RUN npm install
COPY . .
```

If only application code changes (not `package.json`), Docker can reuse the cached `npm install`
layer instead of re-running it — because the layer's cache key is based on its inputs, and
`package*.json` didn't change. Reversing the order (`COPY . .` before `npm install`) invalidates
the install-layer cache on *every* code change, since the entire app is now part of that layer's
input. See [Image Layers & Caching](./image-layers-and-caching.md) for exactly why this works.

## `CMD` vs. `RUN` — a common mix-up

```dockerfile
RUN npm install        # runs ONCE, during the build — its output becomes part of the image
CMD ["node", "server.js"]   # runs EVERY TIME a container starts from this image
```

Putting `npm install` in `CMD` instead of `RUN` would mean the install happens on every container
start instead of once at build time — slower, and defeats the purpose of baking dependencies into
the image in the first place.

## `.dockerignore`

```text title=".dockerignore"
node_modules
.git
.env
*.log
```

Same idea as `.gitignore` — excludes files from the build context sent to the Docker daemon.
Without it, a stray local `node_modules` can get copied into the image (bloating it, and
potentially shipping platform-specific binaries built for your machine, not the image's OS) or
just slow the build down sending unnecessary files.

## Building from this Dockerfile

```bash
docker build -t my-app:latest .
```

Covered in full in [Building & Tagging Images](./building-and-tagging-images.md).
