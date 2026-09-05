---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [Automated Builds](./automated-builds.md) says a build should be deterministic. Name one thing
  that breaks determinism, and how [Caching in CI](../04-pipeline-design/caching-in-ci.md)'s cache
  key design avoids the same class of problem for caches specifically.

  <details>
  <summary>Answer</summary>

  Depending on "latest" dependency versions resolving differently over time breaks build
  determinism; a cache key hashed from the lockfile changes automatically the moment dependencies
  actually change, so a cache never gets reused across a real dependency change the way an
  unpinned build might silently drift.
  </details>

- [Running Tests in CI](./running-tests-in-ci.md) says CI checks a test command's exit code, not
  its output. Why does this make a misconfigured test runner a genuine (if uncommon) risk?

  <details>
  <summary>Answer</summary>

  A test runner that exits `0` even when tests actually failed (one that only prints failures
  without failing the process) will make CI report success on a genuinely broken build — CI has no
  semantic understanding of the printed results, only the numeric exit code.
  </details>

- Why does a build failure need to stop the pipeline immediately instead of continuing on to the
  test stage, per [Automated Builds](./automated-builds.md)?

  <details>
  <summary>Answer</summary>

  Running tests against code that doesn't even compile wastes time and produces a confusing
  failure — a test failure that's actually just a build failure in disguise.
  </details>

- [Artifacts](./artifacts.md) distinguishes a pipeline artifact from a registry/package
  repository. Which one would you use for a Docker image meant to be pulled by production
  infrastructure, and why?

  <details>
  <summary>Answer</summary>

  A registry — a pipeline artifact is short-lived and scoped to one pipeline run, mainly for
  handing off between stages of that same run, while a registry is long-lived, versioned, and
  independently pullable by anything, which is what production deployment actually needs.
  </details>

- Test reports (uploaded as artifacts) and [Running Tests in CI](./running-tests-in-ci.md)'s
  flaky-test warning are connected — how does having structured, retained test reports make a
  flaky test easier to actually diagnose and fix rather than just re-run away?

  <details>
  <summary>Answer</summary>

  A structured report shows which specific tests failed and how long they took across multiple
  runs, making an inconsistent pass/fail pattern (the signature of flakiness) visible over time,
  instead of just seeing one run's raw log output and re-running blind.
  </details>

- Why does [Artifacts](./artifacts.md) call jobs running in "fresh, isolated environments"
  relevant to why artifacts need to exist as a concept at all?

  <details>
  <summary>Answer</summary>

  If nothing from one stage's environment is automatically available in the next, something has to
  explicitly carry a build's output (like a compiled bundle) from the build stage to the deploy
  stage — that explicit hand-off is exactly what an artifact is for.
  </details>

- Unit, integration, and end-to-end tests get different CI treatment per
  [Running Tests in CI](./running-tests-in-ci.md). What's the underlying tradeoff that drives
  running the slowest suites less often than on every single push?

  <details>
  <summary>Answer</summary>

  Speed of feedback vs. thoroughness — running every suite on every push doesn't scale as a
  codebase grows, so fast unit tests run on every push while slower integration/e2e suites are
  reserved for less frequent triggers, trading some immediacy for keeping the common case fast.
  </details>
