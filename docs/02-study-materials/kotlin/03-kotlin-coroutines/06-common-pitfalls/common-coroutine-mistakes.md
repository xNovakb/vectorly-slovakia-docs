---
sidebar_position: 1
title: Common Coroutine Mistakes
---

# Common Coroutine Mistakes

A roundup of the mistakes that show up repeatedly once people start writing real coroutine code —
most trace back to a misunderstanding of one of the earlier pages in this topic.

## `GlobalScope` overuse

```kotlin
❌ fun refreshData() {
    GlobalScope.launch {
        fetchLatestData()
    }
}
```

`GlobalScope` launches a coroutine with no parent, no bounded lifetime, and no connection to
structured concurrency at all (see
[Structured Concurrency Explained](../02-structured-concurrency/structured-concurrency-explained.md))
— it lives until the whole application process ends or it completes on its own, cannot be
cancelled as a group with anything else, and its exceptions aren't scoped to anything meaningful.

```kotlin
✅ class DataRepository(private val scope: CoroutineScope) {
    fun refreshData() {
        scope.launch {
            fetchLatestData()
        }
    }
}
```

Tie coroutines to a scope with an actual, bounded lifetime instead — a class's own scope,
cancelled when that class is done being used. `GlobalScope` has a few legitimate niche uses
(genuinely process-lifetime background work), but reaching for it as a default is almost always
the wrong call.

## Forgetting `suspend` on a function that needs it

```kotlin
❌ fun fetchUser(id: Int): User {
    return apiClient.getUser(id)    // compile error if getUser() is itself a suspend function
}
```

```kotlin
✅ suspend fun fetchUser(id: Int): User {
    return apiClient.getUser(id)
}
```

Straightforward once seen, but a common early stumbling block — see
[Suspend Functions](../01-basics/suspend-functions.md) for why this is a compile-time restriction,
not just a style guideline.

## Launching a coroutine and not waiting for the result you actually needed

```kotlin
❌ fun processOrder(order: Order): ProcessedOrder {
    var result: ProcessedOrder? = null
    launch {
        result = expensiveProcessing(order)    // this hasn't necessarily finished yet...
    }
    return result!!    // ...so this can crash, or silently return a stale/null value
}
```

```kotlin
✅ suspend fun processOrder(order: Order): ProcessedOrder {
    return expensiveProcessing(order)    // or async { }.await() if concurrency is actually needed
}
```

`launch` doesn't wait for anything and returns no value — trying to read a result that was
supposed to come from inside a `launch` block, immediately after starting it, is a race condition
by construction. If you need a value back, the function needs to be `suspend` and either directly
await the async work or use [`async`](../01-basics/launch-vs-async.md) properly.

## Using `Dispatchers.Main` (or nothing) for blocking work

Covered in depth in [Blocking Calls in Coroutines](./blocking-calls-in-coroutines.md) — worth its
own dedicated page given how common and how disruptive this specific mistake is.

## Not handling cancellation in cleanup code

```kotlin
❌ launch {
    try {
        doWork()
    } catch (e: Exception) {
        retry()    // this also catches CancellationException — retries even when actually cancelled!
    }
}
```

```kotlin
✅ launch {
    try {
        doWork()
    } catch (e: CancellationException) {
        throw e    // let cancellation propagate — don't treat it as a retriable failure
    } catch (e: Exception) {
        retry()
    }
}
```

A broad `catch (e: Exception)` also catches `CancellationException` (see
[Cancellation](../02-structured-concurrency/cancellation.md)) unless explicitly excluded —
swallowing it breaks cancellation for the coroutine and anything relying on it propagating.

## Ignoring the `Job` returned by `launch` when you actually need to manage its lifecycle

```kotlin
❌ launch { longRunningTask() }    // no reference kept — can't cancel it later if needed

✅ val job = launch { longRunningTask() }
   // later, if needed:
   job.cancel()
```

Fine to discard the `Job` for genuinely fire-and-forget work whose lifetime is already bound to
its parent scope — but a common mistake when the coroutine's lifetime actually needs independent
management (e.g. cancelling one specific background task without cancelling everything else in
the scope).
