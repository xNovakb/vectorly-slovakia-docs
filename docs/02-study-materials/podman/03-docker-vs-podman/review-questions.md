---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [Architecture Differences](./architecture-differences.md) says most of the table's rows trace
  back to one root cause. Name three separate rows that all follow from "daemon vs. daemonless,"
  and explain the causal link for each.

  <details>
  <summary>Answer</summary>

  Rootless-by-default: exists because there's no root daemon to grant access through. No single
  point of failure: exists because there's no shared process every container depends on. Needing
  systemd for persistent services: exists because there's no daemon already supervising and
  restarting containers the way Docker's does.
  </details>

- A team runs `alias docker=podman` and their CI pipeline passes. Per
  [Compatibility & Migration](./compatibility-and-migration.md), what category of tooling would
  this test *not* catch a problem with, even if it's actually broken?

  <details>
  <summary>Answer</summary>

  Anything talking to the Docker daemon's API directly rather than going through the `docker` CLI
  — some IDE Docker integrations, certain CI runner internals, GUI tools — since those assume a
  Docker-compatible socket exists at a known path, which Podman only provides via an explicit
  opt-in (`podman system service`), not automatically the way plain CLI commands do.
  </details>

- Why does [Architecture Differences](./architecture-differences.md) call the OCI image format
  "genuinely equivalent, not just similar" between Docker and Podman, while calling some CLI
  behaviors around sockets and rootless volume permissions "not a drop-in swap"?

  <details>
  <summary>Answer</summary>

  Both tools build and consume the exact same open OCI image standard — an image built with
  `docker build` runs unmodified under `podman run`, no compatibility shim involved. The
  socket/rootless cases are different: they depend on *how* each tool exposes access (a daemon
  socket that simply exists under Docker vs. an explicit opt-in under Podman; UID mapping through
  user namespaces under rootless Podman but not under a root daemon), which are genuine behavioral
  differences, not just surface API differences.
  </details>

- Per [When to Choose Which](./when-to-choose-which.md), a team targeting Kubernetes as its actual
  deployment platform has a specific reason to prefer Podman during local development. What is it,
  and which earlier-topic capability does it depend on?

  <details>
  <summary>Answer</summary>

  Podman's pod model mirrors Kubernetes pods directly, and `podman generate kube` can produce real
  Kubernetes manifests from a pod tested locally — a tighter local-to-cluster loop than developing
  against Docker Compose's bridge-network model and hoping the eventual Kubernetes translation
  behaves the same way. This depends on the pod concept from Basics and the `podman generate kube`
  capability from Using Podman.
  </details>

- This org's actual production setup runs Docker on a single VPS, not targeting Kubernetes. Per
  [When to Choose Which](./when-to-choose-which.md), does that mean Podman is simply the wrong
  tool for this org, or something narrower?

  <details>
  <summary>Answer</summary>

  Something narrower — Podman's two strongest differentiators (rootless multi-tenant isolation and
  Kubernetes pod alignment) simply aren't load-bearing requirements for a single-VPS Docker
  Compose setup not targeting Kubernetes. That's a statement about which tool fits this specific
  setup today, not a general claim that Podman is worse — the same org could reasonably use Podman
  locally for its rootless benefit while still deploying with Docker.
  </details>

