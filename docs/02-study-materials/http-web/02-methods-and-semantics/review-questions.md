---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- Why is it more natural to make a `GET` with query params idempotent and safe than an equivalent
  action sent as a `POST` body?

  <details>
  <summary>Answer</summary>

  `GET` is safe and idempotent *by convention* — browsers, caches, and proxies already treat it
  that way (cacheable, retryable). A `POST` carrying the same intent doesn't inherit any of those
  guarantees automatically, since `POST` is conventionally neither safe nor idempotent.
  </details>

- A crawler follows every link (`GET`) on a site, including one that happens to delete a record.
  Which two properties does that endpoint violate, and why does violating them matter for both
  crawlers and browser prefetching?

  <details>
  <summary>Answer</summary>

  Safety and idempotency — a `GET` that deletes something breaks the "no side effects" contract
  that crawlers and browser prefetching both rely on when treating `GET` as harmless to call
  speculatively and repeatedly.
  </details>

- Why is `PUT` idempotent but `POST` isn't, tying back to what each method actually *means*
  semantically rather than just what it happens to do in some server's code?

  <details>
  <summary>Answer</summary>

  `PUT`'s semantics are "replace with exactly this" — sending the same replacement twice leaves
  the resource in the same final state either time. `POST`'s semantics are "create or trigger an
  action" — sending it twice creates two separate things, because there's no "replace" concept to
  converge on.
  </details>

- An API exposes deletion as `GET /users/42/delete` instead of `DELETE /users/42`. Name every
  guarantee from this subfolder that design breaks.

  <details>
  <summary>Answer</summary>

  Safety (crawlers and browsers can no longer treat `GET` as harmless), and by extension caching
  and prefetching (an unsafe action shouldn't be reachable through a cacheable, speculatively
  fetched method).
  </details>

- Sending a partial update via `PUT` (instead of `PATCH`) can silently wipe fields. How does that
  connect back to what "idempotent" actually means for `PUT`?

  <details>
  <summary>Answer</summary>

  `PUT` means "this is now the whole resource" — omitted fields are implicitly reset. That's
  consistent with, not contrary to, `PUT` being idempotent: sending that same partial body twice
  still lands on the same (now-incomplete) final state both times.
  </details>
