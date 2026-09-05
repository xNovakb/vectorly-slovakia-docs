---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [Managing Secrets in CI](./managing-secrets-in-ci.md) protects a secret's *value*.
  [Least-Privilege Credentials](./least-privilege-credentials.md) says that's not enough on its
  own. What's the difference between the two concerns?

  <details>
  <summary>Answer</summary>

  Protecting the value keeps the secret from being readable/leaked in the first place; least
  privilege limits the *blast radius* if it leaks anyway — a well-protected but overly-broad
  credential still turns any leak into a much larger incident than a narrowly-scoped one would.
  </details>

- [Environment Promotion](./environment-promotion.md) says staging and production should have
  entirely separate secret values. Why does this matter even if both secrets are equally well
  protected by the CI platform's secret store?

  <details>
  <summary>Answer</summary>

  A shared or overlapping credential means a staging-scoped leak (lower stakes, less-hardened
  environment) could grant access to production — separate secrets per environment contain that
  exposure to the environment it actually leaked from.
  </details>

- Why does [Managing Secrets in CI](./managing-secrets-in-ci.md)'s log-masking warning specifically
  call out a secret that's been base64-encoded or split across log lines, rather than just saying
  "masking works"?

  <details>
  <summary>Answer</summary>

  Masking generally only catches the exact secret string appearing verbatim; a transformed or
  split value doesn't match that literal pattern, so it can leak through even with masking active —
  the safety net isn't absolute.
  </details>

- [Environment Promotion](./environment-promotion.md) advocates building once and promoting the
  same artifact through dev, staging, and production. How does this connect to
  [Automated Builds](../02-build-and-test/automated-builds.md)'s point about build determinism?

  <details>
  <summary>Answer</summary>

  Rebuilding separately per environment reintroduces the risk that what's tested in staging isn't
  bit-for-bit identical to what deploys to production — the same non-determinism problem covered
  for builds generally, just at the scale of "which environment actually got a different build."
  </details>

- [Least-Privilege Credentials](./least-privilege-credentials.md) prefers short-lived, rotatable
  credentials over long-lived static ones. How does that relate to
  [Managing Secrets in CI](./managing-secrets-in-ci.md)'s point about rotation?

  <details>
  <summary>Answer</summary>

  Both are about shrinking the exposure window of a leaked credential — routine rotation limits
  how long a static secret stays dangerous if leaked, while a short-lived/auto-expiring credential
  takes this further, making a leaked credential useless after a bounded window regardless of when
  the leak is even discovered.
  </details>

- Why does [Environment Promotion](./environment-promotion.md) put a manual approval gate
  specifically before the production step, and not before staging?

  <details>
  <summary>Answer</summary>

  Staging is a lower-stakes environment used to build confidence automatically; production is
  where real users are affected, so the one genuinely consequential decision (release to real
  users) stays a deliberate human call, while everything building up to it can run automatically.
  </details>
