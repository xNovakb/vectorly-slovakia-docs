---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [What Are Coroutines](./what-are-coroutines.md) says a suspended coroutine "gives the thread back
  entirely." Per [Suspend Functions](./suspend-functions.md), what compiler-enforced mechanism is
  what actually makes suspension possible in the first place?

  <details>
  <summary>Answer</summary>

  The `suspend` modifier — the Kotlin compiler transforms a suspend function into a state machine
  via Continuation Passing Style, where each suspension point becomes a state the function can
  pause at and resume from later, with local variables preserved on the heap rather than needing a
  reserved OS thread stack.
  </details>

- `fetchUser(1)` calling `delay(100L)` compiles fine inside another `suspend fun`, but fails to
  compile inside a plain `fun`. Per [Suspend Functions](./suspend-functions.md), why is this a
  compile error rather than something caught only at runtime?

  <details>
  <summary>Answer</summary>

  `suspend` is part of the function's type, and the compiler tracks at every call site whether it's
  currently inside a suspending context — it refuses to compile a call to a suspend function from
  non-suspending code. This is meaningfully stronger than a convention or documentation-based
  approach in other languages, where calling async code incorrectly might only surface as a runtime
  problem.
  </details>

- `val user1 = fetchUser(1); val user2 = fetchUser(2)` inside a `suspend fun` runs sequentially,
  not concurrently. Per [Suspend Functions](./suspend-functions.md) and
  [Launch vs. Async](./launch-vs-async.md), why doesn't `suspend` alone give you concurrency, and
  what actually would?

  <details>
  <summary>Answer</summary>

  `suspend` only means "capable of suspending" — it says nothing about running independently of
  other code. Calling two suspend functions one after another still waits for the first to finish
  before starting the second. Actual concurrency requires explicitly starting separate coroutines,
  e.g. wrapping each call in its own `async { }` before calling `.await()` on either.
  </details>

- `async { riskyOperation() }` is called but `.await()` is never invoked on the result. Per
  [Launch vs. Async](./launch-vs-async.md), what happens to an exception thrown inside that block,
  and why is `launch` described as "the more honest choice" when the result isn't needed?

  <details>
  <summary>Answer</summary>

  `async`'s exception is held until something calls `.await()` — if that never happens, the
  exception may never surface at all, silently swallowed. `launch`'s uncaught exception propagates
  immediately to the parent instead, which is a more predictable failure mode when there's no
  result value to actually retrieve in the first place.
  </details>

- Two `async { fetchUser(id) }` calls are started, then `.await()` is called on each immediately
  after starting it (rather than after both are started). Per
  [Launch vs. Async](./launch-vs-async.md), does this still run the two fetches concurrently?

  <details>
  <summary>Answer</summary>

  No — calling `.await()` right after starting the first `async` suspends until that one completes
  before the second `async` is even started, accidentally serializing them again. Both `async`
  calls need to be started *before* calling `.await()` on either one for them to actually run
  concurrently.
  </details>

