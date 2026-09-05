---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- `alias docker=podman` makes most existing scripts "just work." Per
  [Podman CLI Basics](./podman-cli-basics.md), which three commands would still fail under that
  alias, and why do they have no Docker equivalent at all?

  <details>
  <summary>Answer</summary>

  `podman pod create`, `podman generate kube`, and `podman generate systemd` — none of them alias
  to a working `docker` command because they're built around concepts (pods, direct systemd
  integration) that simply don't exist in Docker's own model, not just renamed equivalents of
  something Docker already has.
  </details>

- A team runs `podman-compose up -d` against an existing `docker-compose.yml` with no changes.
  Per [Podman Compose](./podman-compose.md), why does this mostly just work, and in what sense is
  `podman-compose` a genuinely different kind of thing than `docker compose`?

  <details>
  <summary>Answer</summary>

  It works because `podman-compose` reads the same Compose YAML format and translates it into
  equivalent `podman` commands. Unlike `docker compose`, which is now a first-party part of the
  Docker CLI itself, `podman-compose` is a separate, community-maintained tool — a real
  distinction even though the end-user experience is close.
  </details>

- Why does a rootless Podman container started by hand from a terminal simply disappear when that
  terminal's shell exits, in a way a Docker container with `--restart unless-stopped` wouldn't —
  and what does [Podman & systemd](./podman-and-systemd.md) use to fix this?

  <details>
  <summary>Answer</summary>

  Docker's daemon is already a persistent background process supervising containers and applying
  restart policies; Podman has no daemon to do that job. `podman generate systemd` produces a
  systemd unit so systemd itself takes over that supervision role instead.
  </details>

- A generated systemd unit is installed with `systemctl --user enable --now`, but the container
  stops the moment the user logs out. What single command fixes that, and why does it specifically
  matter for a *rootless* Podman setup?

  <details>
  <summary>Answer</summary>

  `loginctl enable-linger <user>` — by default, user-level systemd services (which is what a
  rootless Podman container managed this way runs as) stop on logout; enable-linger keeps them
  running without an active login session, the rootless equivalent of a root daemon's containers
  surviving independently of any SSH session.
  </details>

- Why does `podman generate kube` from a pod produce something Docker Compose genuinely has no
  built-in equivalent for, rather than just a different syntax for the same capability?

  <details>
  <summary>Answer</summary>

  It generates real, usable Kubernetes manifests directly from a pod that's modeled on Kubernetes
  pods from the start — Docker Compose's bridge-network model isn't structured that way at all, so
  converting a Compose file to Kubernetes normally needs a separate third-party tool (like
  `kompose`) rather than a first-class feature of the tool itself.
  </details>

