---
sidebar_position: 1
title: Review Questions
---

# Review Questions

Synthesis questions across the whole topic. Answer out loud, connecting subfolders — that's the
point of this page, not repeating any single page's own questions.

- Trace one commit end-to-end: it's pushed, triggers a pipeline, passes build and test, produces
  an artifact, and gets promoted through dev, staging, and production. Name the subfolder
  responsible for each of those steps.

  <details>
  <summary>Answer</summary>

  Trigger and pipeline definition — Basics; build and test — Build & Test; the artifact hand-off
  mechanism — Build & Test; promotion through environments — Secrets & Environments (Environment
  Promotion); the actual production rollout mechanics (blue-green/canary) and what happens if it
  goes wrong — Deployment Strategies.
  </details>

- Continuous Delivery and full Continuous Deployment differ by one gate. Does that gate change
  anything about how Blue-Green & Canary or Rollbacks apply once a deploy actually happens?

  <details>
  <summary>Answer</summary>

  No — the manual-approval distinction only affects *when* a change reaches production; once it's
  approved (or auto-deployed), the rollout strategy and rollback plan work identically either way.
  </details>

- Both Caching in CI (Pipeline Design) and Environment Promotion (Secrets & Environments) rely on
  the same underlying idea about reproducibility. What is it, and how does each subfolder apply it
  differently?

  <details>
  <summary>Answer</summary>

  Both depend on determinism: caching keys off the lockfile so a cache is reused only when inputs
  are genuinely unchanged; environment promotion builds once and promotes the same artifact so
  what's tested in staging is bit-for-bit what reaches production — both avoid silently drifting
  outputs from what should be identical inputs.
  </details>

- A rollback needs to happen fast during a live incident. Which two subfolders' concepts does
  "redeploy the previous artifact" actually depend on to even be possible?

  <details>
  <summary>Answer</summary>

  Build & Test's Artifacts (a previous build's output has to still exist and be retained) and
  Deployment Strategies' Rollbacks (the actual decision and mechanism to redeploy it) — without
  sufficient artifact retention, the fast rollback path doesn't exist at all.
  </details>

- Why does a self-hosted runner (Tools & Platforms) running a job that touches a secret (Secrets &
  Environments) create a genuinely different risk profile than the same job on a managed runner?

  <details>
  <summary>Answer</summary>

  A managed runner is single-use and torn down after each job, so a compromised job can't reach
  anything beyond that run; a self-hosted runner is a real, possibly persistent machine — if
  compromised (e.g. via a malicious public PR), it can potentially reach secrets configured for
  other jobs on that same runner, or whatever else its network access allows.
  </details>

- Matrix builds and test sharding (Pipeline Design) both trade compute cost for wall-clock speed.
  Connect this to Comparing CI Platforms' pricing-model discussion: what does aggressive
  parallelization actually cost on a usage-billed hosted platform?

  <details>
  <summary>Answer</summary>

  Hosted platforms typically bill by compute time/concurrency, so running e.g. 9 parallel matrix
  jobs instead of 1 sequential job is genuinely ~9x the compute for that run — parallelization
  buys speed at a real, direct dollar cost on a hosted platform, not just an abstract tradeoff.
  </details>

- Least-privilege credentials (Secrets & Environments) and self-hosted runners (Tools & Platforms)
  both deal with "blast radius if something goes wrong." State the parallel between them.

  <details>
  <summary>Answer</summary>

  A narrowly-scoped credential limits what a leaked secret can actually do; an isolated,
  single-use runner (or careful self-hosted network segmentation) limits what a compromised build
  job can actually reach — both are about containing damage after something already went wrong,
  not just preventing the initial breach.
  </details>

- Feature flags (Deployment Strategies) let code deploy without being released. How does this
  interact with Continuous Deployment specifically — does it make full automation to production
  riskier or safer?

  <details>
  <summary>Answer</summary>

  Safer — feature flags let a team deploy every passing commit straight to production (satisfying
  Continuous Deployment) while still controlling *when* users actually see a new feature,
  decoupling the automated, frequent deploy from the deliberate, controlled release.
  </details>

- A pipeline's build stage caches dependencies (Pipeline Design), and its deploy stage requires a
  scoped deploy credential (Secrets & Environments). Both stages run in "fresh, isolated
  environments" per Stages & Jobs — how does each subfolder's mechanism survive that isolation?

  <details>
  <summary>Answer</summary>

  Caching persists a specific directory between separate runs via an external cache store keyed on
  content hash, independent of any one job's ephemeral environment; secrets are injected at
  runtime from the platform's secret store into whichever job's environment references them —
  neither relies on state surviving inside the job's own filesystem across runs.
  </details>

- Why would a team choosing Jenkins specifically for compliance reasons (Tools & Platforms) also
  likely lean toward Continuous Delivery over Continuous Deployment (Deployment Strategies)?

  <details>
  <summary>Answer</summary>

  Both choices are typically driven by the same underlying regulatory pressure — a compliance
  regime mandating infrastructure control (favoring self-hosted Jenkins) often also mandates a
  documented human sign-off before production changes (favoring Continuous Delivery's manual
  gate) — they're two symptoms of the same constraint, not independent decisions.
  </details>

- Canary deployments (Deployment Strategies) gradually increase traffic to a new version. What
  would happen if the environment promotion chain (Secrets & Environments) allowed staging and
  production to share database credentials, and a canary release exposed a bug that corrupted
  data?

  <details>
  <summary>Answer</summary>

  Shared credentials would mean a staging-originated or canary-related mistake isn't contained to
  its intended scope — the whole point of environment promotion keeping environments' secrets
  separate is exactly to prevent a lower-stakes environment's problem from reaching production
  data, which a canary's gradual exposure alone doesn't protect against if the underlying
  credentials aren't actually separated.
  </details>

- Path-filtered triggers (Basics) and test sharding (Pipeline Design) both aim at the same
  underlying goal from a different angle. What is it?

  <details>
  <summary>Answer</summary>

  Not wasting time/compute on work that isn't needed — path filters skip running a pipeline at all
  when the change couldn't affect it, while sharding is about running necessary work faster once
  it does need to happen; both are forms of using pipeline resources deliberately rather than
  running everything, every time, at full cost.
  </details>

- If a bad database migration ships alongside a canary release, which subfolder's specific
  caveat explains why "just roll back the code" (Deployment Strategies) might not actually fix
  things?

  <details>
  <summary>Answer</summary>

  Rollbacks' own caveat: a rollback that only reverts application code but leaves an incompatible
  database migration in place can make things worse, not better — this is why backward-compatible
  migrations are called out as a deliberate practice to keep rollbacks genuinely safe.
  </details>
