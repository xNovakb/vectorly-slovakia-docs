---
sidebar_position: 2
title: Building & Tagging Images
---

# Building & Tagging Images

## Building

```bash
docker build -t my-app:latest .
```

- `-t my-app:latest` — tags the resulting image with a name (`my-app`) and a tag (`latest`).
- `.` — the **build context**: the directory sent to the Docker daemon, which the Dockerfile's
  `COPY`/`ADD` instructions can reference. Everything in this directory (minus what
  `.dockerignore` excludes) gets sent, even files the Dockerfile never actually copies — a large
  build context slows every build down, which is another reason `.dockerignore` matters (see
  [Dockerfile Basics](./dockerfile-basics.md)).

```bash
docker build -f Dockerfile.prod -t my-app:latest .    # use a differently-named Dockerfile
```

## Tags — what they actually are

A tag is just a human-friendly label pointing at a specific image (identified internally by a
content hash). Nothing stops the *same* tag from later pointing at a *different* image — pushing
a new build tagged `latest` doesn't create a new tag, it moves the existing `latest` label to
point at the new image.

```bash
docker build -t my-app:1.2.0 .
docker build -t my-app:latest .          # separate tag, can point at the same or a different build
docker tag my-app:1.2.0 my-app:stable      # add another tag to an image that already exists
```

:::warning
`latest` is just a tag, not automatically "the newest version" in any enforced sense — a build
tagged `latest` from a week ago is still `latest` until something re-tags it. Relying on `latest`
in production is a common source of "which version is actually running" confusion; a specific
version tag (or better, a content-addressed digest) is safer for anything beyond local dev.
:::

## Pushing to a registry

```bash
docker tag my-app:1.2.0 ghcr.io/example/my-app:1.2.0     # tag for a specific registry
docker push ghcr.io/example/my-app:1.2.0                    # upload it
```

A registry (Docker Hub, GitHub Container Registry, a private one) is where images actually live
so other machines — a production server, a CI runner — can `docker pull` them instead of
rebuilding from source every time.

```bash
docker pull ghcr.io/example/my-app:1.2.0
```

## A realistic build → tag → push sequence

```bash
docker build -t my-app:1.2.0 .
docker tag my-app:1.2.0 ghcr.io/example/my-app:1.2.0
docker tag my-app:1.2.0 ghcr.io/example/my-app:latest
docker push ghcr.io/example/my-app:1.2.0
docker push ghcr.io/example/my-app:latest
```

## Inspecting what's built

```bash
docker images                       # every image on this machine
docker image inspect my-app:1.2.0     # full metadata: layers, env, exposed ports, entrypoint
docker history my-app:1.2.0            # each layer, and its size — useful for finding what's bloating an image
```
