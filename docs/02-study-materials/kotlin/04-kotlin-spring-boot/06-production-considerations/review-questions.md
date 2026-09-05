---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A Docker `HEALTHCHECK` for a Spring Boot container calls `/actuator/health`. Per
  [Actuator & Observability](./actuator-and-observability.md), why is this a meaningfully better
  check than one that only confirms the process is still running?

  <details>
  <summary>Answer</summary>

  `/actuator/health` automatically aggregates status from real dependencies (database connectivity,
  disk space, and any custom `HealthIndicator` beans) into one overall `UP`/`DOWN` status — a
  genuinely broken dependency like a down payment provider can make the whole app report `DOWN`,
  which is exactly the "process running but not actually working" distinction the Docker topic's
  health-check guidance calls for, not just a static liveness ping.
  </details>

- Fetching 100 orders, then lazily loading each order's items individually, produces 101 queries.
  Per [Performance Tuning Basics](./performance-tuning-basics.md), why is this bug specifically
  dangerous in terms of *when* it gets noticed?

  <details>
  <summary>Answer</summary>

  It's invisible with small local test datasets — 100 extra fast queries against a tiny local
  database barely register — and only becomes painfully obvious at production scale, where those
  same 100 extra queries run against a loaded production database and get multiplied across
  concurrent requests. The bug exists identically in dev and prod; only its cost differs enough to
  actually be noticed.
  </details>

- A layered JAR splits a Spring Boot fat JAR into separate Docker image layers by how often each
  changes. Per [Packaging & Deploying a Spring Boot App](./packaging-and-deploying-a-spring-boot-app.md),
  which Docker-topic concept does this directly reuse, and what specifically speeds up as a result?

  <details>
  <summary>Answer</summary>

  It reuses image layer caching from the Docker topic — dependencies (which rarely change) go in
  an earlier layer, application code (which changes often) goes in a later one. A code-only change
  then only invalidates the small final `application` layer, not the entire multi-hundred-megabyte
  dependency layer, meaningfully speeding up both rebuilds and registry pushes.
  </details>

- Increasing HikariCP's `maximum-pool-size` from a formula-based value to an arbitrarily large
  round number doesn't make the app faster, and can make it slower. Per
  [Performance Tuning Basics](./performance-tuning-basics.md), why does more connections not
  automatically mean better throughput?

  <details>
  <summary>Answer</summary>

  Each connection consumes real database-side resources, and an oversized pool causes excessive
  contention on the database side plus context-switching overhead — past a certain point, more
  connections actively hurts performance rather than helping it. HikariCP's own guidance recommends
  sizing from a formula close to `(core_count * 2) + effective_spindle_count`, not guessing a large
  number on the assumption that bigger is always better.
  </details>

- A Spring Boot app's fat JAR is built with `./gradlew bootJar` and copied into a single-stage
  Dockerfile using the full JDK image at runtime. Per
  [Packaging & Deploying a Spring Boot App](./packaging-and-deploying-a-spring-boot-app.md) and the
  Docker topic's multi-stage build pattern, what's wasted by not using a multi-stage build here?

  <details>
  <summary>Answer</summary>

  The full JDK (compiler, build tools) is only needed to *produce* the JAR, not to run it — running
  only needs a JRE. A single-stage build ships the entire build toolchain and Gradle's dependency
  cache in the final image for no runtime benefit, meaningfully bloating the image compared to a
  multi-stage build that discards the `builder` stage's JDK entirely and ships only a JRE-based
  final image.
  </details>

