---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A multi-stage Dockerfile builds with `node:22` in a `builder` stage, but the final stage is
  `FROM node:22-alpine` and only `COPY --from=builder`s the `dist` and `node_modules` folders. Per
  [Dockerfile Best Practices](./dockerfile-best-practices.md), why does the final image not contain
  the build toolchain at all?

  <details>
  <summary>Answer</summary>

  Each `FROM` starts a genuinely new stage with its own layers; `COPY --from=builder` only pulls
  specific named files/directories out of the earlier stage into the new one. Everything else from
  the `builder` stage — its compilers, dev dependencies, source files — is simply never copied
  forward and doesn't exist in the final image.
  </details>

- Why does a `HEALTHCHECK` catch a problem that `restart: unless-stopped` alone cannot, given how
  [Health Checks & Restart Policies](./health-checks-and-restart-policies.md) distinguishes
  "crashed" from "unhealthy"?

  <details>
  <summary>Answer</summary>

  A restart policy only reacts to the container's process actually exiting. A deadlocked or hung
  process that never exits — just stops responding — gives Docker no crash to react to at all;
  `HEALTHCHECK` is what detects that "running" and "actually working" have diverged, since it
  probes the app's real behavior on a schedule instead of just watching whether the process died.
  </details>

- Why is `FROM node:latest` a production risk in a way that only shows up "months later," per
  [Dockerfile Best Practices](./dockerfile-best-practices.md)?

  <details>
  <summary>Answer</summary>

  `latest` is just a tag that keeps getting re-pointed at newer builds over time — a Dockerfile
  pinned to `node:latest` can silently pull a different Node major version on a rebuild long after
  the Dockerfile was written, with no code change on your side to explain a sudden break.
  </details>

- This org's `docs-app` and `astro-app` containers both use a multi-stage build (Node.js builder →
  Nginx runner) and publish no `ports:`. Which two production practices from this subfolder does
  that combination actually put into practice, per
  [This Org's Container Setup](./this-orgs-container-setup.md)?

  <details>
  <summary>Answer</summary>

  Multi-stage builds (shipping only the built static output and a minimal Nginx runtime, not the
  Node.js build toolchain) and deliberately not publishing a port — the container is reachable
  only through Caddy on the shared network, by construction rather than by a firewall rule that
  could be misconfigured.
  </details>

- Why does `start_period` matter specifically for a `HEALTHCHECK`, and what would happen to a
  slow-starting app without it?

  <details>
  <summary>Answer</summary>

  `start_period` is a grace period during which failed checks don't count toward `retries` — a
  slow-starting app could otherwise be marked unhealthy (or even restarted, on platforms that act
  on health status) before it's actually finished booting, purely because the healthcheck started
  probing before the app was ready to answer it.
  </details>

