---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [What Is Podman](./what-is-podman.md) says Podman has no daemon. How does
  [Rootless by Default](./rootless-by-default.md) turn that architectural fact into a concrete
  security benefit?

  <details>
  <summary>Answer</summary>

  With no daemon, there's no root-privileged background process a `podman` command has to talk
  through — so a regular user's `podman run` never needs elevated access at all, unlike Docker's
  daemon (traditionally root) that a user's CLI commands go through a socket to reach.
  </details>

- Inside a rootless Podman container, a process believes it's running as UID 0 (root). Per
  [Rootless by Default](./rootless-by-default.md), what is it actually running as on the host, and
  what mechanism creates that gap?

  <details>
  <summary>Answer</summary>

  It's actually running as the regular host user that started it (e.g. UID 1000) — Linux user
  namespaces map that real host UID to what looks like UID 0 *inside* the container's own isolated
  view, without granting any real root privilege on the host.
  </details>

- Two containers, `web` and `sidecar`, are both added to the same pod with
  `podman pod create` + `--pod`. Per [The Pod Concept](./the-pod-concept.md), how do they reach
  each other, and how is that mechanism genuinely different from how two containers on a Docker
  Compose network reach each other?

  <details>
  <summary>Answer</summary>

  Pod-mates share one network namespace and literally one IP, so `web` reaches `sidecar` over
  plain `localhost:<port>`. Containers on a Docker Compose network each keep their own separate IP
  and reach each other via service-name DNS resolution over a shared bridge network — a similar
  outcome, but a genuinely different underlying mechanism.
  </details>

- Why is "no daemon" the reason a crashed `podman` command doesn't take down every other running
  container, in a way a crashed Docker daemon would?

  <details>
  <summary>Answer</summary>

  Podman has no shared central process that every container depends on — each `podman` invocation
  directly manages containers as its own child processes. A crash only ever affects the one
  command that was running; Docker's daemon-managed containers all depend on that one daemon
  process staying up.
  </details>

- Binding a rootless Podman container directly to port 80 fails by default. Why, and what are the
  two ways around it mentioned in [Rootless by Default](./rootless-by-default.md)?

  <details>
  <summary>Answer</summary>

  Ports below 1024 are privileged by default and require real root to bind. The two workarounds
  are running the container as root anyway (rootful), or lowering the kernel's
  `net.ipv4.ip_unprivileged_port_start` setting so unprivileged processes can bind lower ports.
  </details>

