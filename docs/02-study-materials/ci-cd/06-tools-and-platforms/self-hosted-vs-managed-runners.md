---
sidebar_position: 3
title: Self-Hosted vs. Managed Runners
---

# Self-Hosted vs. Managed Runners

Regardless of which [platform](./comparing-ci-platforms.md) is in use, the actual machine
executing a pipeline's steps is either provided by the platform (**managed**) or provided and
maintained by the team itself (**self-hosted**) — a real, consequential choice independent of
which CI tool sits on top.

## Managed (hosted) runners

```yaml
jobs:
  build:
    runs-on: ubuntu-latest    # GitHub provides and maintains this machine
```

The platform spins up a fresh virtual machine per job, pre-loaded with common tools, and tears it
down afterward. No infrastructure to maintain at all.

- **Pros**: zero setup/maintenance burden, automatically scales (more concurrent jobs just get
  more machines, up to plan limits), each job gets a genuinely clean environment every time.
- **Cons**: limited control over exact hardware/OS specifics, usage-based cost that scales with
  compute time, no access to resources that only exist on your own private network.

## Self-hosted runners

```yaml
jobs:
  build:
    runs-on: self-hosted     # a machine YOU registered and maintain
```

A machine (physical or virtual) that the team owns, configured to register itself with the CI
platform and pick up jobs.

- **Pros**: full control over hardware (GPUs, specific architectures), access to private
  network resources a hosted runner could never reach (an internal database, an on-prem service),
  no per-minute compute billing from the CI vendor.
- **Cons**: the team owns setup, patching, scaling, and security of that machine entirely —
  genuinely real operational burden, not free.

## The real security consideration with self-hosted runners

:::danger
A self-hosted runner that executes code from **public pull requests** is a genuine security risk:
a malicious PR can run arbitrary code on that runner, potentially reaching whatever else that
runner (or its network) can access — including secrets configured for other jobs on the same
runner. Most platforms explicitly warn against using self-hosted runners for public/open-source
repositories without additional isolation (ephemeral, single-use runners; strict network
segmentation) for exactly this reason. This risk doesn't really exist for hosted runners, since
they're single-use and torn down immediately after each job.
:::

## When self-hosted genuinely makes sense

```text
- Need for specific hardware hosted runners don't offer (GPUs for ML workloads, specific
  CPU architectures)
- Need to reach private network resources (an internal service, an on-prem database) that a
  hosted runner outside that network fundamentally can't reach
- Cost, at genuinely large and sustained scale — self-hosting can become cheaper than
  per-minute hosted billing once usage is consistently high enough, though this crossover
  point is easy to overestimate before actually measuring it
- Compliance/regulatory requirements mandating code never runs on infrastructure outside the
  organization's own control
```

## When managed runners are simply the right default

For most projects, especially ones without a specific hardware/network/compliance need, managed
runners are the practical default — the operational cost of running and securing self-hosted
infrastructure is real and ongoing, and it's easy to underestimate until a team has actually lived
with maintaining it. Reach for self-hosted when a specific, concrete requirement demands it, not
as a default cost-optimization before usage has actually justified it.
