---
sidebar_position: 3
title: Thread Safety in Coroutines
---

# Thread Safety in Coroutines

A genuinely common misconception worth addressing directly: **coroutines do not automatically make
shared mutable state safe.** Multiple coroutines running concurrently on a multi-threaded
dispatcher can race on shared state exactly the way multiple threads can, because — on a
dispatcher like `Dispatchers.Default` or `Dispatchers.IO` — they may genuinely be running on
different threads at the same time.

## The race condition, concretely

```kotlin
var counter = 0

suspend fun incrementUnsafely() = coroutineScope {
    repeat(10_000) {
        launch(Dispatchers.Default) {
            counter++    // NOT atomic — read, increment, write, as three separate steps
        }
    }
}
// counter almost certainly ends up LESS than 10,000 — some increments get lost
```

:::warning
`counter++` looks like a single operation but is actually read-modify-write — three steps. If two
coroutines interleave between the read and the write, one increment gets silently lost. This is
the exact same class of bug as a classic multi-threaded race condition — coroutines change *how*
concurrency is expressed, not the fundamental rules of shared mutable state.
:::

## Fix 1: `Mutex` — mutual exclusion, the coroutine-native way

```kotlin
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

val mutex = Mutex()
var counter = 0

suspend fun incrementSafely() {
    mutex.withLock {
        counter++
    }
}
```

`Mutex` is coroutine-aware — unlike a traditional `synchronized` block, locking it **suspends**
the coroutine (giving the thread back) rather than blocking the thread while waiting for the
lock. Using `synchronized` inside coroutine code works in the sense that it compiles, but it
blocks the underlying thread while waiting, defeating a real part of the point of using coroutines
in the first place.

## Fix 2: atomic types

```kotlin
import java.util.concurrent.atomic.AtomicInteger

val counter = AtomicInteger(0)

suspend fun incrementAtomically() {
    counter.incrementAndGet()    // genuinely atomic, no suspension or locking needed at all
}
```

For simple cases (a single counter, a single reference), an atomic type from `java.util.concurrent`
is often simpler and faster than a `Mutex` — no suspension overhead, since the operation itself is
already atomic at the hardware level.

## Fix 3: avoid shared mutable state entirely — usually the best fix

```kotlin
// ❌ shared mutable state, needs explicit synchronization
var total = 0
items.forEach { launch { total += process(it) } }

// ✅ each coroutine returns its own result, combined afterward — nothing shared, nothing to race
val results = items.map { async { process(it) } }.awaitAll()
val total = results.sum()
```

The most robust fix is often architectural, not a locking primitive at all — have each coroutine
compute and return its own independent result, and combine results afterward in one place, rather
than having many coroutines mutate one shared variable concurrently. This sidesteps the whole
category of bug rather than carefully managing access to it.

## Confining state to a single coroutine/thread — another valid approach

```kotlin
val stateActor = CoroutineScope(Dispatchers.Default.limitedParallelism(1))
```

Restricting a dispatcher to a single thread (or using an actor-style pattern) means only one
coroutine at a time can touch a given piece of state, by construction — a different way of
sidestepping races rather than locking around them.

## The takeaway

"I'm using coroutines" says nothing about whether shared mutable state is safe — that's a
completely separate question, governed by the same rules as any concurrent system. See
[Dispatchers](./dispatchers.md) for why this specifically matters more on multi-threaded
dispatchers (`Default`, `IO`) than on something confined to a single thread.
