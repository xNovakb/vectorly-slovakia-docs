---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [Continuous Delivery vs. Deployment](./continuous-delivery-vs-deployment.md) introduces feature
  flags as a way to decouple deploy from release. How does that same idea make a bad *feature*
  distinct from a bad *deploy*, tying into [Rollbacks](./rollbacks.md)?

  <details>
  <summary>Answer</summary>

  If a feature ships disabled behind a flag, reverting a broken feature is just flipping the flag
  off (instant) rather than necessarily rolling back the whole deploy — the two failure modes get
  separate, independently fast fixes.
  </details>

- Blue-green and canary deployments both aim to reduce rollout risk, but
  [Blue-Green & Canary](./blue-green-and-canary.md) says neither replaces good rollback
  capability. Why not?

  <details>
  <summary>Answer</summary>

  Both strategies reduce risk *during* the rollout itself (limiting exposure or making the switch
  instant), but neither is a plan for what happens once a problem is actually caught — that's a
  separate concern, covered by rollback capability specifically.
  </details>

- [Rollbacks](./rollbacks.md) describes two approaches: redeploying a previous artifact vs.
  reverting the commit and letting CI rebuild. Which one depends directly on
  [Artifacts](../02-build-and-test/artifacts.md) being retained with enough history to still be
  deployable?

  <details>
  <summary>Answer</summary>

  Redeploying a previous artifact — it only works if that earlier build's output (an image tag, a
  compiled binary) still exists somewhere and hasn't already been cleaned up by a short retention
  policy.
  </details>

- Why can blue-green's "instant rollback" claim still leave a team exposed if a bad database
  migration shipped alongside the code change, per [Rollbacks](./rollbacks.md)?

  <details>
  <summary>Answer</summary>

  Flipping traffic back to blue only reverts the application code; an incompatible schema change
  already applied to the database isn't undone by a routing switch, and can make things worse if
  the old code isn't compatible with the new schema.
  </details>

- Canary deployments require real traffic-splitting infrastructure and sensitive monitoring, per
  [Blue-Green & Canary](./blue-green-and-canary.md). What's the actual cost/benefit tradeoff versus
  blue-green's simpler all-at-once switch?

  <details>
  <summary>Answer</summary>

  Canary trades routing/monitoring complexity and slower full rollout for limiting a genuine
  problem's exposure to a small fraction of users first; blue-green trades running two full
  duplicate environments for a simpler, instant, binary switch with no gradual exposure control.
  </details>

- A team chooses Continuous Delivery over Continuous Deployment for regulatory reasons, per
  [Continuous Delivery vs. Deployment](./continuous-delivery-vs-deployment.md). Does that change
  anything about how [Rollbacks](./rollbacks.md) or [Blue-Green & Canary](./blue-green-and-canary.md)
  apply to them?

  <details>
  <summary>Answer</summary>

  No — the manual approval gate only affects when a change reaches production, not how the
  rollout happens once it's approved, or what happens if that rollout goes wrong; both pages'
  guidance applies regardless of which delivery model got the change to that point.
  </details>
