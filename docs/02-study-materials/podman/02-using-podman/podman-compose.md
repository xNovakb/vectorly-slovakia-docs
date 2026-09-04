---
sidebar_position: 2
title: Podman Compose
---

# Podman Compose

Podman's answer to [Docker Compose](/study-materials/docker/docker-compose/compose-basics) — plus
one genuinely Podman-specific trick: generating real Kubernetes YAML directly from a running setup.

## `podman-compose` — a separate tool, same file format

```bash
podman-compose up -d
podman-compose down
podman-compose logs -f web
```

`podman-compose` is a **separate, community-maintained tool** (not built into `podman` itself the
way `docker compose` is now built into the Docker CLI) that reads the same
`docker-compose.yml` format and translates it into the equivalent `podman` commands. In practice,
most existing Compose files work with little or no modification — the same YAML shape covered in
[Compose Basics](/study-materials/docker/docker-compose/compose-basics) and
[Multi-Container Apps](/study-materials/docker/docker-compose/multi-container-apps) applies here
too.

```bash
# Newer Podman versions also support native compose support directly:
podman compose up -d
```

Recent Podman releases have started adding **native** `podman compose` support (delegating to
`podman-compose` or a compatible implementation if installed) — worth checking your installed
version's docs, since this area has been actively converging with Docker's `docker compose`
behavior.

## Generating Kubernetes YAML — the genuinely different capability

```bash
podman pod create --name my-app-pod -p 8080:8080
podman run -d --pod my-app-pod --name web my-web-image
podman run -d --pod my-app-pod --name sidecar my-sidecar-image

podman generate kube my-app-pod > my-app-pod.yaml
```

This produces **real, usable Kubernetes YAML** describing that pod and its containers — not an
approximation, actual manifests that `kubectl apply` can consume. Docker Compose has no equivalent
command; converting a Compose file to Kubernetes manifests normally requires a separate third-party
tool (like `kompose`), whereas this is a first-class Podman feature, a direct consequence of the
[pod concept](../01-basics/the-pod-concept.md) being modeled on Kubernetes pods from the start.

```bash
podman play kube my-app-pod.yaml     # the reverse: run a Kubernetes YAML file locally, via Podman
```

`podman play kube` can also go the other direction — take a Kubernetes manifest and run it locally
as pods/containers, useful for testing Kubernetes-bound configuration without an actual cluster.

## When this genuinely matters

If a team's actual deployment target is Kubernetes, developing and testing locally with Podman's
pod model — and being able to generate real manifests directly from what was tested locally — is a
meaningfully tighter loop than developing against Docker Compose's bridge-network model and hoping
the eventual Kubernetes translation behaves equivalently. For a team not targeting Kubernetes at
all, this specific advantage doesn't really apply — see
[When to Choose Which](../03-docker-vs-podman/when-to-choose-which.md) for the fuller picture.
