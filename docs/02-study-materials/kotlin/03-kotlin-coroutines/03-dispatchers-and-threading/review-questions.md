---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A blocking JDBC call is run directly inside `launch(Dispatchers.Default)` with no
  `withContext`. Per [Dispatchers](./dispatchers.md) and
  [Thread Safety in Coroutines](./thread-safety-in-coroutines.md)'s broader theme, why can this
  starve *unrelated* coroutines, not just slow down the one making the call?

  <details>
  <summary>Answer</summary>

  `Dispatchers.Default` has a thread pool deliberately sized to the number of CPU cores, meant for
  CPU-bound work. A blocking call occupies one of those limited threads for its entire duration;
  enough of them running concurrently can exhaust the whole pool, leaving no thread available for
  any other coroutine — including ones with nothing to do with the blocking call — that needs
  `Default` to make progress.
  </details>

- `withContext(Dispatchers.IO) { fetchData() }` and `launch(Dispatchers.IO) { fetchData() }` both
  reference `Dispatchers.IO`. Per [Context Switching](./context-switching.md), what's the actual
  behavioral difference between the two?

  <details>
  <summary>Answer</summary>

  `withContext` is sequential — it's still the same coroutine, suspending until the block completes
  and returning its result before continuing. `launch` starts an independent, concurrent coroutine
  that doesn't wait and has no return value — `withContext` is for moving part of one logical flow
  to a different dispatcher, not a tool for running things at the same time.
  </details>

- 10,000 coroutines each run `counter++` concurrently on `Dispatchers.Default`, and the final
  `counter` ends up less than 10,000. Per
  [Thread Safety in Coroutines](./thread-safety-in-coroutines.md), why does using coroutines here
  not automatically prevent this, and what's actually happening at the instruction level?

  <details>
  <summary>Answer</summary>

  Coroutines don't make shared mutable state safe by themselves — on a multi-threaded dispatcher,
  multiple coroutines can genuinely run on different threads at the same time, racing exactly like
  threads would. `counter++` is actually three separate steps (read, increment, write); if two
  coroutines interleave between the read and the write, one increment gets silently lost.
  </details>

- `Mutex.withLock { }` and Java's `synchronized` both provide mutual exclusion, but
  [Thread Safety in Coroutines](./thread-safety-in-coroutines.md) recommends `Mutex` specifically
  for coroutine code. What's the concrete difference in what each one does to the thread while
  waiting for the lock?

  <details>
  <summary>Answer</summary>

  `Mutex` is coroutine-aware — waiting for the lock suspends the coroutine, giving the thread back
  to run other coroutines in the meantime. `synchronized` blocks the underlying thread while
  waiting, which compiles and technically works, but defeats a real part of the point of using
  coroutines: threads sitting blocked instead of being freed up for other work.
  </details>

- Per [Thread Safety in Coroutines](./thread-safety-in-coroutines.md), rewriting a shared-counter
  pattern as `items.map { async { process(it) } }.awaitAll()` followed by `.sum()` is called "the
  most robust fix" rather than adding a `Mutex`. Why does this specific restructuring eliminate the
  race condition entirely rather than just guard against it?

  <details>
  <summary>Answer</summary>

  Each coroutine computes and returns its own independent result instead of mutating one shared
  variable — there's no shared mutable state at all for concurrent access to race over, so there's
  nothing left to protect with a lock. This sidesteps the whole category of bug architecturally,
  rather than carefully managing safe access to state that's still shared.
  </details>

