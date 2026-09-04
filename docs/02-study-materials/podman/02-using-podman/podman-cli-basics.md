---
sidebar_position: 1
title: Podman CLI Basics
---

# Podman CLI Basics

The practical payoff of Podman's deliberate CLI compatibility (see
[What Is Podman](../01-basics/what-is-podman.md)): nearly everything from the
[Docker](/study-materials/docker/basics/what-is-a-container) topic transfers directly, command for command.

## The same core commands

```bash
podman run -d --name web nginx
podman ps
podman ps -a
podman stop web
podman start web
podman rm web
podman logs -f web
podman exec -it web sh
podman build -t my-app .
podman images
podman pull nginx
```

Every one of these behaves the same as its `docker` equivalent covered throughout the
[Docker](/study-materials/docker/basics/what-is-a-container) topic — [Container Lifecycle](/study-materials/docker/running-containers/container-lifecycle),
[Exec, Logs & Inspect](/study-materials/docker/running-containers/exec-logs-and-inspect), and
[Dockerfile Basics](/study-materials/docker/images-and-dockerfiles/dockerfile-basics) all apply
here without modification — Podman even reads a plain `Dockerfile` by default, no separate format
needed.

## The literal `alias` trick

```bash
alias docker=podman
```

Because the command surface is so closely matched, many setups genuinely just alias `docker` to
`podman` and existing scripts, CI configs, and muscle memory keep working with no changes at all
— see [Compatibility & Migration](../03-docker-vs-podman/compatibility-and-migration.md) for
exactly how far this compatibility goes, and where it doesn't.

## Where the CLI actually differs

```bash
podman pod create --name my-app-pod      # no Docker equivalent — see The Pod Concept
podman generate kube my-app-pod            # generate Kubernetes YAML from a running pod — no Docker equivalent
podman generate systemd --name web           # generate a systemd unit for a container — see Podman & systemd
```

These three are genuinely Podman-specific — they don't exist as `docker` subcommands at all,
because they're built around concepts (pods, direct systemd integration) that don't exist in
Docker's own model.

## Rootless is simply the default — nothing extra to type

```bash
podman run -d nginx      # already rootless, by default, no flags needed
```

Unlike needing to specifically opt into Docker's rootless mode, there's no separate "rootless
Podman" command or flag — see [Rootless by Default](../01-basics/rootless-by-default.md) for why
this is the normal, unremarkable way Podman runs.

## Checking what's actually different under the hood

```bash
podman info          # shows the runtime details — no "Docker daemon" section at all, since there isn't one
```

`podman info` reports on Podman's own runtime state directly (no daemon to query) — a good quick
way to confirm you're actually talking to Podman and see the rootless/rootful state, storage
driver, and OCI runtime in use (typically `crun` or `runc`).
