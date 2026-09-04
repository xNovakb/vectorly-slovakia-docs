---
sidebar_position: 2
title: Suspend Functions
---

# Suspend Functions

The `suspend` modifier is what makes a function capable of suspending — pausing its execution
without blocking the thread, and resuming later, possibly on a different thread.

## Declaring one

```kotlin
suspend fun fetchUser(id: Int): User {
    delay(100L)                 // pretend this is a network call
    return User(id, "Jane")
}
```

Nothing about the function body looks unusual — it's the `suspend` keyword on the signature that
makes this callable from, and able to call, other suspending code. Calling `delay` (itself a
suspend function) inside a non-`suspend` function is a **compile error**, not a runtime warning.

## The core rule: suspend functions can only be called from a suspending context

```kotlin
fun regularFunction() {
    fetchUser(1)    // ❌ compile error: suspend function 'fetchUser' should be called only from
                       //    a coroutine or another suspend function
}

suspend fun anotherSuspendFunction() {
    fetchUser(1)    // ✅ fine — this function is itself suspend
}

fun main() = runBlocking {
    fetchUser(1)    // ✅ fine — runBlocking provides a coroutine (suspending) context
}
```

This is enforced by the Kotlin compiler itself, not a coding convention someone has to remember
and follow — you genuinely cannot accidentally call a suspend function from ordinary, non-coroutine
code and have it silently compile.

## Why this is a compile-time guarantee, not just documentation

In many other languages, "this function does async work" is something you learn from
documentation, a naming convention, or a runtime error — nothing stops you from calling it
incorrectly until you actually do and something breaks. Kotlin's `suspend` modifier is part of the
function's **type** — the compiler tracks, at every call site, whether you're currently inside a
suspending context, and refuses to compile if you're not. This is a meaningfully stronger
guarantee than convention-based approaches in other ecosystems.

## What actually happens under the hood, briefly

The Kotlin compiler transforms a suspend function into a state machine (via **Continuation
Passing Style**) — each suspension point becomes a state the function can be paused at and later
resumed from, with its local variables preserved. You don't write or think about this
transformation directly — it's invisible in day-to-day coroutine code — but it's *why* a
suspended coroutine's state can be cheaply held on the heap instead of needing a reserved OS
thread stack (see [What Are Coroutines](./what-are-coroutines.md) for why that matters at scale).

## Suspend functions are not automatically concurrent

```kotlin
suspend fun fetchTwoUsers(): Pair<User, User> {
    val user1 = fetchUser(1)    // waits for this to finish...
    val user2 = fetchUser(2)    // ...before starting this
    return user1 to user2
}
```

Calling two suspend functions one after another still runs them **sequentially** — `suspend`
means "capable of suspending," not "runs concurrently with everything else." Actually running
work concurrently requires explicitly starting separate coroutines — see
[Launch vs. Async](./launch-vs-async.md).

## A suspend function calling a regular (non-suspend) function is completely normal

```kotlin
suspend fun processData(): String {
    val raw = fetchRawData()      // suspend function
    return formatData(raw)          // ordinary function — no problem calling this from suspend code
}
```

The restriction only goes one direction: a suspend function can freely call regular functions; a
regular function cannot call a suspend function.
