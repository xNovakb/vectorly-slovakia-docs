---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [The Result Type](./the-result-type.md) lists three strategies for signaling failure: throwing,
  a nullable return, and `Result<T>`. Using `findUser(id: Int): User?` as the example, explain why
  a nullable return fits that specific case better than either of the other two.

  <details>
  <summary>Answer</summary>

  "Not found" here is a normal, expected outcome with no further explanation needed — there's no
  failure *reason* to describe, so `Result<T>`'s ability to carry failure details is unnecessary
  overhead, and throwing would treat a routine "no match" as an exceptional error it isn't. A
  nullable return communicates exactly "this may simply have no value" with nothing extra.
  </details>

- Why does Kotlin having no checked exceptions mean `readFile(path: String): String` can throw
  `IOException` with zero compiler enforcement on callers, per
  [Exceptions in Kotlin](./exceptions-in-kotlin.md) — and why was this a deliberate design choice,
  not an oversight?

  <details>
  <summary>Answer</summary>

  With no checked exceptions, Kotlin doesn't require a `throws` clause or force callers to catch or
  re-declare anything — every exception is effectively unchecked from the compiler's perspective.
  This was deliberate because checked exceptions in practice tended to produce either genuinely
  handled errors or a large amount of empty `catch (Exception e) {}` blocks written purely to
  satisfy the compiler, providing little real safety for real added noise.
  </details>

- A base exception class is marked `sealed`, per [Custom Exceptions](./custom-exceptions.md)'s
  `OrderException` example. What does that let a `when` block handling it skip, and why does the
  compiler allow skipping it?

  <details>
  <summary>Answer</summary>

  It lets the `when` skip an `else` branch entirely. The compiler can enumerate every possible
  subtype of a sealed class at compile time, so it can verify a `when` over that hierarchy handles
  every case — and will flag an error if a new subtype is added later without updating the `when`.
  </details>

- `runCatching { input.toInt() }` and a manual `try { input.toInt() } catch (e:
  NumberFormatException) { ... }` can produce equivalent outcomes. Per
  [The Result Type](./the-result-type.md) and [Exceptions in Kotlin](./exceptions-in-kotlin.md),
  what does `runCatching` actually do differently under the hood?

  <details>
  <summary>Answer</summary>

  `runCatching` runs the block and converts a normal return into `Result.success`, or a thrown
  exception into `Result.failure` — internally it's still using a try/catch mechanism, but it
  packages the outcome as an explicit `Result<T>` value instead of requiring the caller to write
  their own try/catch and decide how to branch on success vs. failure.
  </details>

- Per [Custom Exceptions](./custom-exceptions.md), why does wrapping a caught `SQLException` in a
  `DataAccessException(message, cause)` matter specifically for debugging, compared to just
  extracting `e.message` into a new exception's message string?

  <details>
  <summary>Answer</summary>

  Passing the original exception as `cause` preserves its full original stack trace as part of the
  new exception, so the actual point of failure is still visible for debugging. Extracting just the
  message string loses everything about *where* and *how* the original exception occurred, leaving
  only a human-readable description with no trace to follow.
  </details>

