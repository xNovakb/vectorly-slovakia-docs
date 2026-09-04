---
sidebar_position: 1
title: Architecture Differences
---

# Architecture Differences

A consolidated look at what actually differs, having covered each piece individually earlier in
this topic.

## Side by side

| | Docker | Podman |
|---|---|---|
| Architecture | Client-server: CLI talks to a background daemon (`dockerd`) | Daemonless: CLI directly manages containers as its own child processes |
| Default privilege model | Daemon traditionally runs as root; `docker` group ≈ root access | Rootless by default — no special group, no elevated access needed |
| Single point of failure | Yes — daemon crash affects every container it manages | No — no shared daemon process to crash |
| Multi-container grouping | Bridge networks + Compose (containers keep separate IPs, reach each other by service name) | Native "pod" concept — containers share one network namespace, mirroring Kubernetes pods |
| Kubernetes YAML generation | Not built in (needs a separate tool like `kompose`) | Built in (`podman generate kube`) |
| Persistent service management | Daemon's own restart policies | Delegates to systemd (`podman generate systemd`) |
| CLI | `docker ...` | `podman ...` — deliberately near-identical syntax |
| Image format | OCI-compliant | OCI-compliant — the same images work with both |

## Why "daemon vs. daemonless" is the root of most other differences

Nearly every other row in that table traces back to this one architectural choice:

- Rootless-by-default exists *because* there's no root daemon to grant access through.
- No single point of failure exists *because* there's no shared process everything depends on.
- Needing systemd for persistence exists *because* there's no daemon already doing that
  supervision job.
- The pod concept isn't strictly a consequence of daemonlessness, but it reflects the same
  underlying design philosophy — model container grouping the way an orchestrator (Kubernetes)
  already does, rather than inventing Docker's own separate abstraction (Compose's bridge
  networks).

## What's genuinely equivalent, not just similar

- **Image format** — both build and consume standard OCI images. An image built with `docker
  build` runs fine under `podman run`, and vice versa — this isn't a compatibility shim, it's the
  same open standard both tools target.
- **Dockerfile syntax** — Podman reads a plain `Dockerfile` directly, no separate `Podmanfile`
  format exists.
- **Most day-to-day CLI commands** — see
  [Podman CLI Basics](../02-using-podman/podman-cli-basics.md) for the extent of this.

## What genuinely isn't a drop-in swap

- Anything that assumes a **daemon socket** exists (some tooling built around Docker's API,
  Docker-specific orchestration integrations) doesn't automatically work against Podman without
  Podman's own daemon-compatible API layer (`podman system service`) being enabled and pointed at
  explicitly.
- Rootless-specific edge cases (privileged ports, some advanced networking/volume permission
  scenarios) — see [Rootless by Default](../01-basics/rootless-by-default.md)'s "Real limits"
  section.

[Compatibility & Migration](./compatibility-and-migration.md) covers exactly how far the
compatibility goes in practice, and [When to Choose Which](./when-to-choose-which.md) turns this
comparison into an actual decision guide.
