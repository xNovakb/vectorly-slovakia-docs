---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [Stages & Jobs](./stages-and-jobs.md) shows `test` and `lint` both depending only on `build`,
  running simultaneously. What has to be true about `test` and `lint` for a CI platform to run
  them in parallel automatically?

  <details>
  <summary>Answer</summary>

  They must have no dependency relationship on each other (neither declares `needs:` on the
  other) — a CI platform builds the actual dependency graph and runs anything with no relationship
  between them concurrently, without needing to explicitly request parallelism.
  </details>

- [Parallelization](./parallelization.md) says splitting a 2-minute job into 4 shards doesn't help
  much. Why not, given what [Stages & Jobs](./stages-and-jobs.md) says about separate jobs running
  in fresh, isolated environments?

  <details>
  <summary>Answer</summary>

  Each separate job pays its own environment-setup cost (checkout, dependency install) — for a
  genuinely short job, that fixed overhead can dominate or exceed the actual work time being
  saved, eating into or reversing the parallelism benefit.
  </details>

- How does [Caching in CI](./caching-in-ci.md)'s warning about an overly broad cache key connect
  to [Automated Builds](../02-build-and-test/automated-builds.md)'s definition of a deterministic
  build?

  <details>
  <summary>Answer</summary>

  A stale cache served under an incorrectly-scoped key produces a build that doesn't actually
  reflect its real inputs (a dependency update it should include but doesn't) — the same kind of
  silent, non-reproducible drift that breaks build determinism, just caused by the cache layer
  instead of the build step itself.
  </details>

- A matrix build runs 3 Node versions × 3 operating systems = 9 parallel jobs. Per
  [Parallelization](./parallelization.md), what's the real cost of this, separate from wall-clock
  time?

  <details>
  <summary>Answer</summary>

  Compute cost — running 9 parallel jobs is genuinely 9x the compute of one sequential job for
  that run, even though wall-clock time drops; most platforms bill by compute time/concurrency, so
  this is a real tradeoff, not free speed.
  </details>

- [Stages & Jobs](./stages-and-jobs.md) says splitting too finely can add overhead that outweighs
  parallelism's benefit. Restate that same idea using [Parallelization](./parallelization.md)'s
  own vocabulary for it.

  <details>
  <summary>Answer</summary>

  Diminishing returns — each additional split still pays its own setup cost, so past a point,
  splitting further stops meaningfully shortening the pipeline and can even lengthen it.
  </details>

- Why does `restore-keys` in [Caching in CI](./caching-in-ci.md) matter specifically for a project
  whose lockfile changes somewhat often, versus one whose dependencies rarely change?

  <details>
  <summary>Answer</summary>

  With frequent lockfile changes, an exact cache-key match misses often; `restore-keys` falls back
  to the most recent cache with a matching prefix, so most dependencies (which likely didn't
  change) are still reused instead of starting from a completely empty cache every time.
  </details>

- A fan-out/fan-in pipeline shape (one build feeding parallel test/lint/type-check, then a single
  deploy waiting on all three) appears in both [Stages & Jobs](./stages-and-jobs.md) and
  implicitly in [Parallelization](./parallelization.md). What determines the total time of the
  fan-out phase?

  <details>
  <summary>Answer</summary>

  The slowest single check in that fan-out, not the sum of all of them — since they run
  concurrently, the phase can't finish faster than its slowest member.
  </details>
