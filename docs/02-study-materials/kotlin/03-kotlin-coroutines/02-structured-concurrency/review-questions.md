---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A tight `while (i < 1000) { i++ }` loop with no suspending call inside it doesn't respond to
  `job.cancel()`. Per [Cancellation](./cancellation.md), why not, and what's the mechanism that
  normally makes cancellation take effect?

  <details>
  <summary>Answer</summary>

  Suspending functions like `delay`/`yield` check for cancellation automatically at their
  suspension points and throw `CancellationException` if cancelled — that's the actual mechanism
  cancellation relies on. A loop with no suspension point inside it never reaches a place where
  that check happens, so cancellation is requested but never actually takes effect until the loop
  finishes on its own.
  </details>

- `job.cancel()` on a parent automatically cancels every coroutine nested within it, all the way
  down. Per [CoroutineScope & CoroutineContext](./coroutine-scope-and-context.md) and
  [Structured Concurrency Explained](./structured-concurrency-explained.md), what structural fact
  about how `launch`/`async` calls relate to their enclosing scope makes this automatic rather than
  something you have to implement yourself?

  <details>
  <summary>Answer</summary>

  Every `launch`/`async` call creates a child coroutine of the scope it was called in, and a
  coroutine builder called from inside another coroutine creates a scope that's itself a child of
  that coroutine — this nesting means a parent scope genuinely knows about every coroutine launched
  directly or transitively within it, so cancelling the parent's `Job` propagates down through that
  same structure automatically.
  </details>

- `runBlocking { launch { ... } }` and `suspend fun doWork() = coroutineScope { launch { ... } }`
  both create a scope. Per [CoroutineScope & CoroutineContext](./coroutine-scope-and-context.md),
  what's the concrete difference in what each one does to the calling thread?

  <details>
  <summary>Answer</summary>

  `runBlocking` genuinely blocks the current thread until everything inside it completes —
  appropriate at a real blocking/suspending boundary like `main()` or a test. `coroutineScope` is
  itself a suspend function — it doesn't block anything, it suspends the calling coroutine until
  its children complete, keeping the thread free to do other work in the meantime.
  </details>

- One child coroutine throws an unhandled exception while a sibling is still running under a
  regular (non-supervisor) parent scope. Per
  [Structured Concurrency Explained](./structured-concurrency-explained.md), what happens to the
  sibling, and why is this described as the deliberate default rather than an edge case?

  <details>
  <summary>Answer</summary>

  The exception propagates up and cancels the parent scope, which in turn cancels every other
  child, including the still-running sibling — "fail together" is the default. This is deliberate:
  if part of a structured unit of work fails, silently continuing to run the rest without knowing
  about the failure is rarely the actually-wanted behavior.
  </details>

- `CancellationException` is caught inside a `try`/`catch` for cleanup purposes but then swallowed
  instead of re-thrown. Per [Cancellation](./cancellation.md), what breaks as a result, and why is
  this different from catching a normal exception for recovery?

  <details>
  <summary>Answer</summary>

  Swallowing it breaks cancellation for anything downstream expecting it to propagate — coroutine
  machinery relies on `CancellationException` actually reaching its normal destinations to
  correctly mark coroutines as cancelled and stop cascading cancellation through children. Catching
  it to run cleanup logic is fine and common, but it must always be re-thrown afterward, unlike a
  normal exception which recovery code might legitimately stop from propagating further.
  </details>

