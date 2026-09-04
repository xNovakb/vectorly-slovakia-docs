---
sidebar_position: 3
title: When to Choose Which
---

# When to Choose Which

Not a "better" vs. "worse" question — a tradeoff between two genuinely different architectural
choices (see [Architecture Differences](./architecture-differences.md)), each with situations
where it clearly wins.

## Reasons to reach for Docker

```text
- Ecosystem maturity and sheer breadth of tooling/tutorials assuming Docker specifically
- A team/CI environment already standardized on it, with working tooling built around
  Docker's daemon API (Docker Desktop, various IDE integrations, some CI runner internals)
- Docker Compose's `docker compose` is a first-party, actively maintained part of the Docker CLI
  itself — no separate tool to track
- Broadest cross-platform desktop experience (Docker Desktop on macOS/Windows) — Podman's
  Windows/macOS story has historically been less polished, though it has improved
```

## Reasons to reach for Podman

```text
- Rootless-by-default matters for your threat model — multi-tenant build servers, CI runners
  executing untrusted code, or any environment where "container access ≈ root access" is a
  real concern (see Rootless by Default)
- No daemon to be a single point of failure, or to require running as a privileged background
  service at all
- Kubernetes is the actual deployment target — the pod concept and `podman generate kube` give
  a genuinely tighter local-to-cluster development loop (see The Pod Concept and Podman Compose)
- Preference for systemd-native service management over a second, container-specific
  supervision mechanism (see Podman & systemd)
- Environments (some enterprise Linux distributions) where Podman is the natively
  supported/preferred container engine
```

## This isn't usually a permanent, exclusive choice

Because both consume the same OCI images and largely the same Dockerfile/Compose syntax (see
[Compatibility & Migration](./compatibility-and-migration.md)), the practical decision is often
narrower than "pick one forever":

```text
- Use Podman locally for development (rootless security benefit, no daemon to manage)
  while CI/production stays on Docker, if that's what's already working there.
- Use Docker where its specific ecosystem tooling is genuinely needed, Podman where
  rootless operation or Kubernetes-alignment specifically matters.
```

## For this org specifically

The current production setup (see
[This Org's Container Setup](/study-materials/docker/production-practices/this-orgs-container-setup)
in the Docker topic) runs Docker, on a single VPS, not targeting Kubernetes — none of Podman's
strongest differentiators (rootless multi-tenant isolation, Kubernetes pod alignment) are
currently load-bearing requirements here. This Podman topic exists as general knowledge and a
fair comparison, not because a migration is planned or needed — Docker remains the right tool for
the setup actually in production today.
