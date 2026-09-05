---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [let, run, with](./let-run-with.md) and [apply, also](./apply-also.md) split the five scope
  functions into two groups. What's the actual dividing line between the two groups, per
  [Choosing the Right Scope Function](./choosing-the-right-scope-function.md)?

  <details>
  <summary>Answer</summary>

  Whether the function returns a newly computed value (`let`, `run`, `with`) or the original
  receiver object itself (`apply`, `also`). That single question — "do I need the object back, or
  a computed result?" — is the first branch of the decision guide's own flowchart.
  </details>

- `user?.let { u -> sendWelcomeEmail(u.email) }` and `with(user) { "$name is $age" }` both operate
  on a `User` object. Per [let, run, with](./let-run-with.md), why is `let` the natural choice for
  the first case but `with` isn't typically reached for on a nullable receiver?

  <details>
  <summary>Answer</summary>

  `let` combined with `?.` short-circuits to not running the block at all if the receiver is null —
  exactly what's needed for a nullable value. `with` takes its argument as a plain, non-nullable
  parameter and isn't an extension function called via `?.`, so it doesn't have that same
  null-safety short-circuiting built in; it reads best when the object is already known to exist.
  </details>

- Why does `apply` read naturally with implicit `this` for configuring an object's properties,
  while `also` is preferred with explicit `it` for a side effect like logging, per
  [apply, also](./apply-also.md) — given that both return the same object?

  <details>
  <summary>Answer</summary>

  It's a readability convention, not a technical difference: `apply`'s implicit `this` reads
  naturally when the block is *setting properties on the receiver itself* (as if writing code
  inside that class), while `also`'s explicit `it` makes clear the block is *doing something with*
  the object externally, without editing its own properties — logging or validating, not
  configuring.
  </details>

- `someValue.let { it + 1 }` is called out as a case where a scope function shouldn't be used at
  all. Per [Choosing the Right Scope Function](./choosing-the-right-scope-function.md), what's the
  actual harm in writing this, beyond it just being unnecessary?

  <details>
  <summary>Answer</summary>

  It adds a layer of indirection (a lambda, a scope) for zero real benefit over `someValue + 1` —
  scope functions earn their place for null-safety chains, object configuration, or grouping
  related calls; using one reflexively on a single trivial expression makes the reader stop and
  parse structure that isn't actually doing anything, working against the readability idiom is
  meant to provide.
  </details>

- Why does nesting two `let` blocks with the same implicit `it` create a genuine readability
  problem, per [Choosing the Right Scope Function](./choosing-the-right-scope-function.md), and
  what's the fix that doesn't require abandoning scope functions entirely?

  <details>
  <summary>Answer</summary>

  Once nested, it becomes genuinely hard to tell at a glance which `it` a given reference belongs
  to, since both blocks use the same implicit name for a different receiver. The fix is naming the
  parameter explicitly at each level (`let { o -> ... }`) instead of relying on implicit `it`, or
  avoiding the nesting altogether with a named intermediate variable.
  </details>

