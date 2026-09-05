---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- An `async { throw RuntimeException("Boom") }` doesn't crash the program immediately, but a
  `launch { throw RuntimeException("Boom") }` does. Per
  [Exception Handling in Coroutines](./exception-handling-in-coroutines.md), why does this
  asymmetry exist, and where does `async`'s exception actually surface?

  <details>
  <summary>Answer</summary>

  `launch`'s uncaught exception propagates immediately to the parent, by default cancelling it.
  `async`'s exception is held until something calls `.await()` on its `Deferred` — it surfaces
  right there at the `.await()` call site, not when it originally occurred, and may never surface
  at all if `.await()` is never called.
  </details>

- A `CoroutineExceptionHandler` is attached to a *child* coroutine's context rather than the
  top-level scope, and it never fires when that child throws. Per
  [Exception Handling in Coroutines](./exception-handling-in-coroutines.md), why is a handler on a
  child effectively ignored?

  <details>
  <summary>Answer</summary>

  Uncaught exceptions propagate up to the parent before any handler on the child gets a meaningful
  chance to act on them — the handler needs to be installed on the top-level (root) scope to
  actually catch anything, not scattered onto individual child coroutines expecting each to handle
  its own.
  </details>

- Two `async` calls fetching independent, unrelated data are wrapped in `supervisorScope`, but a
  third case — `async { fetchUser(id) }` followed by `async { fetchOrders(user.await().id) }` — is
  also wrapped the same way. Per [Supervisor Jobs](./supervisor-jobs.md), why is the second case a
  misuse of `supervisorScope`?

  <details>
  <summary>Answer</summary>

  The two steps genuinely depend on each other — fetching orders needs the user's id, so if
  fetching the user fails, fetching orders fails anyway, just less predictably, while
  `supervisorScope`'s independence guarantee lets other "independent" siblings keep running
  pointlessly. `SupervisorJob`/`supervisorScope` is meant for genuinely independent siblings, not
  as a blanket way to avoid thinking about failure propagation between dependent steps.
  </details>

- A test contains `delay(10_000L)` inside `runTest { }`, and the test still completes in
  milliseconds of real time. Per [Testing Coroutines](./testing-coroutines.md), what mechanism
  makes this possible, and does the coroutine under test still behave as if 10 seconds actually
  passed?

  <details>
  <summary>Answer</summary>

  `runTest` provides a `TestDispatcher` that controls virtual time rather than relying on the real
  clock — `delay` fast-forwards virtual time instead of actually pausing, so the test runs almost
  instantly in wall-clock terms. The coroutine's *behavior* relative to time (timeouts, ordering
  relative to other delayed work) still works correctly, since virtual time genuinely did advance
  by the requested amount.
  </details>

- A `UserViewModel` hardcodes `Dispatchers.Default` internally instead of accepting an injectable
  `CoroutineDispatcher` parameter. Per [Testing Coroutines](./testing-coroutines.md), why does this
  specifically break virtual-time testing for that class?

  <details>
  <summary>Answer</summary>

  For virtual time to work correctly, the code under test needs to run on the *same* test
  dispatcher/scheduler the test itself uses — a hardcoded `Dispatchers.Default` runs on real
  threads with real time, disconnected from the test's `TestDispatcher`/`testScheduler` entirely.
  Accepting an injectable dispatcher (defaulting to a real one in production) is what lets a test
  substitute a `StandardTestDispatcher(testScheduler)` and get virtual time to actually apply.
  </details>

