---
sidebar_position: 1
title: Review Questions
---

# Review Questions

Synthesis questions across the whole topic. Answer out loud, connecting subfolders — that's the
point of this page, not repeating any single page's own questions.

- A container-escape vulnerability is exploited inside a rootful Docker container and, separately,
  inside a rootless Podman container. Why is the practical worst case different between the two,
  tracing back to the single architectural choice Basics and Docker vs. Podman both build on?

  <details>
  <summary>Answer</summary>

  Docker's daemon traditionally runs as root, so a container escape there has a path to real root
  on the host. A rootless Podman container has no privileged daemon in the picture at all — the
  blast radius is bounded by whatever the regular host user running it could already do. Both
  outcomes trace back to the same root cause: daemon (and traditionally root-owned) vs.
  daemonless-and-rootless-by-default.
  </details>

- Why does Podman need systemd for persistent service management while Docker doesn't need
  anything extra for `--restart unless-stopped` to work — and how does this connect to the "no
  single point of failure" property also covered in Architecture Differences?

  <details>
  <summary>Answer</summary>

  Docker's own daemon is already a persistent background process that can supervise and restart
  containers per policy. Podman has no daemon, so it has nothing built-in to do that job —
  systemd fills the gap instead. The lack of a daemon is the same fact that removes the single
  point of failure: nothing central exists that all containers depend on, but that also means
  nothing central exists to supervise them either, unless something else (systemd) takes on that
  role.
  </details>

- A team wants to test a multi-container setup locally in a way that closely mirrors how it will
  actually run on Kubernetes later. Which Podman-specific concept from Basics makes this possible,
  which command from Using Podman turns that into real deployable artifacts, and why does Docker
  Compose not offer an equivalent path?

  <details>
  <summary>Answer</summary>

  The pod concept (containers sharing one network namespace, modeled directly on Kubernetes pods)
  from Basics; `podman generate kube` from Using Podman turns a running pod into real Kubernetes
  YAML. Docker Compose's bridge-network model achieves a similar practical outcome for
  multi-container communication but isn't structured around the Kubernetes pod abstraction at all,
  so there's no first-party equivalent — only third-party translators like `kompose`.
  </details>

- `alias docker=podman` is set up, and a team's build/run/exec workflow keeps working unchanged.
  Name one thing that alias would silently fail to fix, and explain why it's a fundamentally
  different kind of gap than a missing CLI flag.

  <details>
  <summary>Answer</summary>

  Any tool that talks directly to a Docker daemon socket rather than going through the `docker`
  CLI (some IDE integrations, certain CI runner internals) — this isn't a missing flag or slightly
  different syntax the alias could paper over, it's a dependency on an entire API surface
  (`podman system service`) that Podman only exposes as an explicit opt-in, not automatically the
  way Docker's daemon socket simply exists once installed.
  </details>

- This org currently runs Docker in production and doesn't target Kubernetes. If that changed —
  say, a new client project needs rootless CI runners executing untrusted code, deployed to
  Kubernetes — which two Podman differentiators from When to Choose Which would suddenly become
  load-bearing, and why does neither apply to the *current* setup?

  <details>
  <summary>Answer</summary>

  Rootless-by-default (for the untrusted-code threat model) and Kubernetes pod alignment (for the
  actual deployment target) would both become directly relevant. Neither applies today because the
  current setup runs trusted, org-owned services on a single VPS with plain Docker Compose — no
  untrusted code execution and no Kubernetes target, which is exactly why When to Choose Which
  frames this Podman topic as general knowledge rather than a planned migration.
  </details>

- Why does the fact that Docker and Podman consume the *same* OCI images and largely the same
  Dockerfile/Compose syntax mean a team's choice between them is rarely "pick one forever," in a
  way that wouldn't be true if the two used genuinely incompatible image formats?

  <details>
  <summary>Answer</summary>

  Because the artifacts (images, Dockerfiles, Compose files) are portable between the two engines,
  switching which engine *runs* them doesn't require rewriting those artifacts — a team can use
  Podman locally for its rootless benefit while CI/production stays on Docker, or vice versa,
  without the underlying content needing to differ. If the image formats were incompatible, that
  same split would require maintaining two parallel sets of build artifacts instead of one shared
  set run by either engine.
  </details>

