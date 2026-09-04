---
sidebar_position: 1
title: Exception Handling in Coroutines
---

# Exception Handling in Coroutines

Exceptions in coroutines follow the same structured-concurrency rules covered in
[Structured Concurrency Explained](../02-structured-concurrency/structured-concurrency-explained.md)
— an unhandled exception doesn't just affect the coroutine it happened in, it propagates through
the parent/child relationship, with real, sometimes surprising consequences.

## `try`/`catch` works normally within a coroutine

```kotlin
launch {
    try {
        riskyOperation()
    } catch (e: Exception) {
        println("Caught: ${e.message}")
    }
}
```

Nothing unusual here — ordinary `try`/`catch` around suspend calls behaves exactly as it looks
like it should.

## An *uncaught* exception in `launch` propagates to the parent, immediately

```kotlin
fun main() = runBlocking {
    launch {
        throw RuntimeException("Boom")    // uncaught — propagates immediately
    }
    delay(1000L)
    println("This may never print")        // parent scope gets cancelled by the child's failure
}
```

By default (see [Structured Concurrency Explained](../02-structured-concurrency/structured-concurrency-explained.md)),
an uncaught exception in a child coroutine cancels its parent scope, which in turn cancels every
sibling coroutine too — "fail together" is the default behavior, not an opt-in.

## `async`'s exceptions are different — held until `.await()`

```kotlin
val deferred = async {
    throw RuntimeException("Boom")
}
delay(1000L)
println("This DOES print — async doesn't propagate immediately")
deferred.await()    // the exception is thrown HERE, not when it originally occurred
```

This is a genuinely important asymmetry with `launch` — see
[Launch vs. Async](../01-basics/launch-vs-async.md) — an `async` coroutine's exception is held
until something actually calls `.await()` on its `Deferred`. If `.await()` is never called, the
exception may never surface at all (though it can still affect the parent scope depending on
context — see below).

## `CoroutineExceptionHandler` — a last-resort, top-level handler

```kotlin
val handler = CoroutineExceptionHandler { _, exception ->
    println("Caught unhandled exception: ${exception.message}")
}

val scope = CoroutineScope(Dispatchers.Default + handler)
scope.launch {
    throw RuntimeException("Boom")
}
```

Installed via the `CoroutineContext`, this catches exceptions that would otherwise crash the
program (or be silently lost) — but only for **root** coroutines (top-level `launch` calls on a
scope), and only for `launch`, not `async` (whose exceptions are deferred to `.await()` instead,
where ordinary `try`/`catch` around the `.await()` call is the right tool).

:::note
A `CoroutineExceptionHandler` installed on a *child* coroutine's context is effectively ignored —
because uncaught exceptions propagate up to the parent before any handler on the child gets a
meaningful chance to act, the handler needs to be on the top-level scope, not scattered onto
individual child coroutines expecting each to handle its own.
:::

## Practical guidance

```text
launch:  wrap the risky code in try/catch INSIDE the coroutine if you can recover locally;
         use CoroutineExceptionHandler on the top-level scope as a last-resort catch-all
async:   wrap the .await() call in try/catch — that's where the exception actually surfaces
```

Getting this wrong — expecting `async`'s exception to behave like `launch`'s, or vice versa — is
one of the more common sources of "why didn't my exception get caught" confusion when first
working with coroutines.
