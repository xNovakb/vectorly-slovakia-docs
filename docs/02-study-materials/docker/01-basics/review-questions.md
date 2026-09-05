---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [What Is a Container](./what-is-a-container.md) says a container shares the host's kernel via
  namespaces and cgroups. How does that fact alone explain the startup-time row in
  [Containers vs. VMs](./containers-vs-vms.md)'s comparison table?

  <details>
  <summary>Answer</summary>

  A container never boots a kernel — it's an isolated view over a kernel that's already running,
  so starting one is just creating namespaces and a writable layer. A VM has to boot an entire
  separate OS, kernel included, which is inherently a much slower process.
  </details>

- You run `docker run --name web nginx` twice in a row without changing anything. What actually
  happens, and how does that connect to the image/container distinction in
  [Images vs. Containers](./images-vs-containers.md)?

  <details>
  <summary>Answer</summary>

  The second command errors, since the container name `web` is already in use — `docker run`
  always creates a brand-new container instance from the image, and two containers can't share a
  name. The image itself is unaffected either way; it's just the read-only template both attempts
  tried to instantiate from.
  </details>

- `docker restart web` and `docker rm web && docker run --name web nginx` both end with a
  container named `web` running again. Why do they behave completely differently for anything the
  container wrote to disk?

  <details>
  <summary>Answer</summary>

  `restart` reuses the same container and its existing writable layer, so anything it wrote is
  still there. Removing and re-running creates an entirely new container with a fresh writable
  layer on top of the same image — any data that lived only in the old writable layer is gone.
  </details>

- Why does a container's isolation mechanism (namespaces/cgroups) mean a Linux container can never
  run a Windows-only binary, in a way a VM isn't limited by?

  <details>
  <summary>Answer</summary>

  A container shares the host's actual kernel rather than bringing its own — it has no kernel of
  its own to run a different OS's binaries against. A VM boots a genuinely separate OS and kernel,
  so it can run a different OS (and thus different binaries) than the host, at the cost of much
  more overhead.
  </details>

- Why does this org run multiple isolated sites as Docker containers on one VPS rather than one VM
  per site, given what Containers vs. VMs says about density and isolation for *trusted* workloads?

  <details>
  <summary>Answer</summary>

  Each site is a trusted workload the org itself controls, not untrusted third-party code, so the
  weaker (but still real) isolation containers provide is an acceptable tradeoff for the much
  higher density and near-instant startup — running a full separate VM per site would cost far
  more RAM/disk for no meaningful security gain in that specific threat model.
  </details>
