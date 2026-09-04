---
sidebar_position: 1
title: What Is a Container
---

# What Is a Container

A **container** is an isolated process — or group of processes — running on the host machine's own
kernel, made to *look and feel* like a separate, self-contained system, without actually being a
separate operating system.

## The mechanism, briefly

Two Linux kernel features do the actual work:

- **Namespaces** — give a process its own isolated view of things that are normally global: its
  own process list (it can't see the host's other processes), its own filesystem mount points, its
  own network interfaces, its own hostname. The process *believes* it's alone on the machine.
- **Cgroups** (control groups) — limit and account for resources a process (or group of processes)
  can use: CPU, memory, disk I/O. Prevents one container from starving everything else on the
  host.

Docker (and Podman — see the [Podman](/study-materials/podman/basics/what-is-podman) topic) doesn't reinvent either of
these — it's tooling that makes namespaces and cgroups convenient to use, packaged with an image
format and a CLI.

## What this means in practice

```bash
docker run -it ubuntu bash
```

Inside that shell, `ps aux` shows only processes running *in that container* — not the host's real
process list. `hostname` shows a container-generated ID, not the host machine's actual hostname.
The filesystem looks like a fresh Ubuntu install, even though there's no separate Ubuntu kernel
running anywhere — it's still the host's kernel underneath, just with an isolated filesystem view
layered on top (see [Images vs. Containers](./images-vs-containers.md)).

## Why this matters over just running the app directly on the host

- **Consistency** — "works on my machine" stops being about the machine at all, if the machine is
  itself just running the same container image everywhere: dev laptop, CI, production server.
- **Isolation** — one app's dependencies (a specific Node version, specific system libraries)
  can't silently conflict with another app's on the same host, because each container has its own
  isolated filesystem.
- **Resource boundaries** — a runaway process in one container is limited by cgroups, rather than
  able to consume the entire host's memory and starve every other service on the same machine.

## Not a VM

A container looking like a self-contained system doesn't mean it *is* one — see
[Containers vs. VMs](./containers-vs-vms.md) for exactly what's shared with the host and what
isn't, and why that difference is what makes containers so much lighter to start and run.
