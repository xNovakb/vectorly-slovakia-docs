---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [Comparing CI Platforms](./comparing-ci-platforms.md) says Jenkins is traditionally self-hosted
  only, while GitHub Actions, GitLab CI, and CircleCI default to hosted. How does
  [Self-Hosted vs. Managed Runners](./self-hosted-vs-managed-runners.md) explain why Jenkins still
  persists in enterprises despite that?

  <details>
  <summary>Answer</summary>

  Self-hosted runners give full control over hardware, access to private network resources, and
  no per-minute vendor billing — exactly the requirements (infrastructure control, compliance,
  internal-network access) that make Jenkins's self-hosted-only model a fit for strict enterprise
  environments, at the cost of the team owning setup and maintenance.
  </details>

- [GitHub Actions Basics](./github-actions-basics.md) pins actions with `@v4`. Why does this
  matter for the same reason version-pinning matters for a Docker base image?

  <details>
  <summary>Answer</summary>

  An unpinned or "latest" reference can resolve to different code over time — pinning an exact
  version means the same action always runs the same way, avoiding an unreproducible pipeline the
  same way pinning a Docker base image avoids an unreproducible build.
  </details>

- Why does [Self-Hosted vs. Managed Runners](./self-hosted-vs-managed-runners.md) specifically
  warn against self-hosted runners on repos accepting public pull requests, in a way that doesn't
  apply to managed runners?

  <details>
  <summary>Answer</summary>

  A managed runner is single-use and torn down immediately after each job, so a malicious PR's code
  has nothing persistent to reach; a self-hosted runner is a real, possibly long-lived machine with
  network access and other jobs' secrets, so a malicious PR running on it has a genuine blast
  radius beyond that one job.
  </details>

- [GitHub Actions Basics](./github-actions-basics.md) distinguishes `uses:` from `run:`. Which one
  would you reach for to check out the repository's code, and which for a project-specific shell
  command, and why does that split exist at all?

  <details>
  <summary>Answer</summary>

  `uses:` for checkout (a pre-built, reusable action like `actions/checkout` someone else already
  wrote), `run:` for a plain shell command specific to the project (like `npm test`) — the split
  exists so common, repeatable automation doesn't need to be hand-written in every workflow.
  </details>

- [Comparing CI Platforms](./comparing-ci-platforms.md) frames the hosted-vs-self-hosted choice as
  a platform-level default. Per [Self-Hosted vs. Managed Runners](./self-hosted-vs-managed-runners.md),
  is that choice actually locked to the platform, or independent of it?

  <details>
  <summary>Answer</summary>

  Independent — even GitHub Actions, GitLab CI, and CircleCI (all hosted by default) support
  registering self-hosted runners; the hosted/self-hosted decision is a real, separate choice
  within any of these platforms, not something the platform choice alone determines.
  </details>

- Why does [Self-Hosted vs. Managed Runners](./self-hosted-vs-managed-runners.md) caution that the
  cost-crossover point favoring self-hosted "is easy to overestimate," tying back to
  [Comparing CI Platforms](./comparing-ci-platforms.md)'s pricing-model comparison?

  <details>
  <summary>Answer</summary>

  Hosted platforms bill per compute-minute, which looks expensive at high sustained usage in
  theory, but self-hosting's real ongoing operational cost (setup, patching, scaling, security)
  is easy to underestimate before a team has actually lived with maintaining it — the naive
  minute-for-minute cost comparison misses that hidden cost.
  </details>
