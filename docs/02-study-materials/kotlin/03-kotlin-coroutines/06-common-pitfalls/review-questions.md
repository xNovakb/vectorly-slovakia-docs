---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- `GlobalScope.launch { fetchLatestData() }` is flagged as a mistake in
  [Common Coroutine Mistakes](./common-coroutine-mistakes.md). Tying this back to
  [Structured Concurrency Explained](../02-structured-concurrency/structured-concurrency-explained.md),
  what specifically is missing that a scope tied to a class's own lifecycle would provide?

  <details>
  <summary>Answer</summary>

  `GlobalScope` has no parent and no bounded lifetime — it isn't part of the structured-concurrency
  tree at all, so it can't be cancelled as a group with anything else and lives until the whole
  process ends or it finishes on its own. A class-owned scope ties the coroutine's lifetime to
  something real and boundable, cancelled automatically when that class is done being used.
  </details>

- `Thread.sleep(5000L)` and `delay(1000L)` are both called inside a `launch { }` block. Per
  [Blocking Calls in Coroutines](./blocking-calls-in-coroutines.md), why does only one of them
  actually free up the underlying thread, even though both "look like" pausing for some duration?

  <details>
  <summary>Answer</summary>

  `delay` is a genuine suspending function — it suspends the coroutine and gives the thread back to
  run other work. `Thread.sleep` is a blocking call that occupies and blocks the real OS thread for
  its entire duration, exactly as it would outside any coroutine — coroutines don't make a blocking
  call non-blocking just by being called from inside one.
  </details>

- `catch (e: Exception) { retry() }` wraps a `doWork()` call inside a coroutine, and the coroutine
  retries even when it was actually cancelled. Per
  [Common Coroutine Mistakes](./common-coroutine-mistakes.md), why does a broad `catch (e:
  Exception)` cause this, and what's the fix?

  <details>
  <summary>Answer</summary>

  `CancellationException` is itself an `Exception`, so a broad catch block also catches it unless
  explicitly excluded — retrying after catching it treats a legitimate cancellation as a retriable
  failure. The fix is catching `CancellationException` separately first and re-throwing it, before
  a broader `catch (e: Exception)` handles genuine failures.
  </details>

- Per [Blocking Calls in Coroutines](./blocking-calls-in-coroutines.md), a blocking JDBC call
  running on `Dispatchers.Default` can starve completely unrelated coroutines. Per
  [Dispatchers](../03-dispatchers-and-threading/dispatchers.md) and
  [Coroutines vs. Threads vs. Reactive](./coroutines-vs-threads-vs-reactive.md), why does moving
  that specific call to `Dispatchers.IO` fix the problem without needing to change the coroutine
  model entirely?

  <details>
  <summary>Answer</summary>

  `Dispatchers.IO`'s thread pool is deliberately sized much larger than `Default`'s CPU-core-sized
  pool, specifically to absorb many concurrent blocking calls without exhausting it. Wrapping just
  the blocking portion in `withContext(Dispatchers.IO)` isolates the problem to a pool built to
  tolerate it, while the CPU-bound parts of the same coroutine stay on `Default` where they belong
  — no need to abandon coroutines for threads or reactive streams to solve this specific issue.
  </details>

- Per [Coroutines vs. Threads vs. Reactive](./coroutines-vs-threads-vs-reactive.md), a team
  already using RxJava throughout a codebase is considering adopting Kotlin coroutines. Why doesn't
  this require an all-or-nothing rewrite?

  <details>
  <summary>Answer</summary>

  Bridging libraries (`kotlinx-coroutines-reactive`) exist specifically to convert between
  `Flow` and RxJava's `Observable` in both directions — a codebase can run both concurrency models
  side by side during a gradual migration, rather than needing to convert every reactive stream to
  coroutines at once.
  </details>

