---
sidebar_position: 3
title: Parallelization
---

# Parallelization

[Stages & Jobs](./stages-and-jobs.md) covered *why* independent jobs run concurrently by default
once they have no dependency relationship — this page covers deliberately designing a pipeline to
exploit that, including splitting up work that would otherwise be one large sequential job.

## Splitting a slow test suite

```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - run: npm test -- --shard=${{ matrix.shard }}/4
```

A single 20-minute test suite split into 4 parallel shards (each running roughly a quarter of the
tests) can finish in closer to 5-6 minutes wall-clock time, at the cost of running on 4x the
compute simultaneously — a direct time-for-resources tradeoff, not free speed.

## Matrix builds — testing across multiple configurations at once

```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, windows-latest, macos-latest]
    steps:
      - run: npm test
```

This runs the **full combination** — 3 Node versions × 3 operating systems = 9 parallel jobs — a
concise way to verify compatibility across every combination a library or app actually needs to
support, without writing out 9 separate near-identical job definitions by hand.

```mermaid
graph LR
    subgraph "Matrix: 3 versions × 3 OSes = 9 parallel jobs"
        A[Node 18, Ubuntu]
        B[Node 18, Windows]
        C[Node 18, macOS]
        D[Node 20, Ubuntu]
        E[Node 20, Windows]
        F[Node 20, macOS]
        G[Node 22, Ubuntu]
        H[Node 22, Windows]
        I[Node 22, macOS]
    end
```

## The real limits — this isn't free speed

- **Shared resource contention** — if every parallel job hits the same external database, API rate
  limit, or shared test fixture, running more of them concurrently can cause failures that have
  nothing to do with the actual code being tested, just contention between the parallel jobs
  themselves.
- **Diminishing returns** — splitting a 2-minute job into 4 pieces doesn't meaningfully help; each
  piece still pays its own environment-setup overhead (checkout, dependency install), which can
  end up dominating the actual work time for small enough slices.
- **Cost** — most CI platforms bill by compute time/concurrency in some form. Running 9 parallel
  jobs instead of 1 sequential one is genuinely 9x the compute for that run, even though wall-clock
  time drops — a real cost tradeoff worth being deliberate about, not an unambiguous win.

## A practical approach

Parallelize the genuinely slow, independent parts (a large test suite, a matrix of real
compatibility targets that must actually be verified) — don't reflexively split every job into
the maximum possible parallelism, since past a certain point the setup overhead and shared-resource
contention start eating into or reversing the time savings.
