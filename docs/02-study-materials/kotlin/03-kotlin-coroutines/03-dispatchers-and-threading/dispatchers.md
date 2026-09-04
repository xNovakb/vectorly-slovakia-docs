---
sidebar_position: 1
title: Dispatchers
---

# Dispatchers

A **dispatcher** decides which thread (or thread pool) a coroutine actually runs on. Coroutines
themselves are thread-agnostic — the dispatcher is what connects the lightweight coroutine
abstraction (see [What Are Coroutines](../01-basics/what-are-coroutines.md)) to real OS threads.

## The standard dispatchers

```kotlin
launch(Dispatchers.Default) { /* CPU-intensive work */ }
launch(Dispatchers.IO) { /* blocking I/O */ }
launch(Dispatchers.Main) { /* UI thread — Android/desktop UI frameworks */ }
launch(Dispatchers.Unconfined) { /* rarely what you want — see below */ }
```

### `Dispatchers.Default` — CPU-bound work

A thread pool sized to the number of available CPU cores. Appropriate for genuinely
CPU-intensive work: sorting large collections, complex calculations, parsing large amounts of
data — anything actually keeping a core busy rather than waiting on something external.

### `Dispatchers.IO` — blocking I/O

A larger thread pool (can grow well beyond the CPU core count), designed specifically for
blocking calls: file I/O, blocking network calls, blocking database drivers. Because these threads
mostly *wait* rather than compute, having more of them than CPU cores makes sense — they're not
competing for CPU time the way `Default`'s workload does.

### `Dispatchers.Main` — the UI thread

Available in UI frameworks (Android, and some desktop UI toolkits via extension libraries) —
dispatches to the single thread UI updates are required to happen on. Not meaningful in a
plain backend/server context with no UI thread at all.

### `Dispatchers.Unconfined` — special-purpose, rarely the right default

```kotlin
launch(Dispatchers.Unconfined) {
    println(Thread.currentThread().name)   // starts here...
    delay(100)
    println(Thread.currentThread().name)   // ...but may resume on a totally different thread
}
```

Doesn't confine execution to any particular thread — starts on the caller's thread, but after
suspension can resume on whatever thread the suspending function happens to resume it on. Useful
for a few specific advanced/testing scenarios, but its unpredictable threading behavior makes it a
poor default choice for regular application code.

## Choosing the right one — a quick reference

```text
Sorting a large list, image processing, complex math       -> Dispatchers.Default
Reading a file, a blocking JDBC call, blocking HTTP client  -> Dispatchers.IO
Updating UI elements (Android/desktop)                        -> Dispatchers.Main
Everything else / most business logic with no blocking calls    -> whatever dispatcher you're
                                                                     already on (often no explicit
                                                                     dispatcher needed at all)
```

## Specifying a dispatcher when launching

```kotlin
CoroutineScope(Dispatchers.IO).launch {
    val data = readFile("data.txt")    // blocking call, appropriately on Dispatchers.IO
}
```

See [Context Switching](./context-switching.md) for switching dispatchers **mid-coroutine**
(rather than fixing one dispatcher for the whole coroutine's lifetime) — the more common real-world
pattern, since a single coroutine often needs to do both CPU work and I/O at different points.

## A custom thread pool, when the defaults don't fit

```kotlin
val customDispatcher = Executors.newFixedThreadPool(4).asCoroutineDispatcher()
```

Rare in typical application code, but available when a specific, isolated thread pool is
genuinely needed (e.g. isolating one particular kind of blocking work from `Dispatchers.IO`'s
shared pool so it can't starve other I/O work).
