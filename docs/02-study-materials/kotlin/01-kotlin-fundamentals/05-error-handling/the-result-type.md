---
sidebar_position: 2
title: The Result Type
---

# The Result Type

Kotlin's standard library includes `Result<T>` — a type explicitly representing "either a success
value or a failure," as an alternative to throwing an exception for outcomes that are a normal,
expected part of a function's behavior rather than truly exceptional.

## Three strategies for signaling failure

```kotlin
// 1. Throw an exception — for genuinely exceptional, unexpected failures
fun parseAge(input: String): Int {
    return input.toInt()    // throws NumberFormatException on bad input
}

// 2. Return a nullable type — for "this might simply not have a value," no error info needed
fun findUser(id: Int): User? {
    return users.find { it.id == id }    // null just means "not found," not an error
}

// 3. Return a Result<T> — for "this can fail, and I want to describe WHY, without throwing"
fun parseAgeResult(input: String): Result<Int> {
    return runCatching { input.toInt() }
}
```

Each fits a different situation — see the comparison at the end of this page for when to reach
for which.

## Creating and using a `Result`

```kotlin
fun divide(a: Int, b: Int): Result<Int> {
    return if (b == 0) {
        Result.failure(ArithmeticException("Division by zero"))
    } else {
        Result.success(a / b)
    }
}

val result = divide(10, 2)

result
    .onSuccess { println("Result: $it") }
    .onFailure { println("Failed: ${it.message}") }

val value = result.getOrNull()          // 5, or null if it failed
val valueOrDefault = result.getOrDefault(-1)   // 5, or -1 if it failed
val valueOrThrow = result.getOrThrow()           // 5, or re-throws the original exception
```

## `runCatching` — wrapping code that might throw

```kotlin
fun fetchConfig(path: String): Result<String> = runCatching {
    File(path).readText()    // if this throws, runCatching catches it and wraps it as Result.failure
}
```

`runCatching` is the most common way to *produce* a `Result` — it runs the given block, and
converts a normal return into `Result.success` or a thrown exception into `Result.failure`,
without needing an explicit try/catch (see [Exceptions in Kotlin](./exceptions-in-kotlin.md)).

## Chaining transformations on a `Result`

```kotlin
val result = runCatching { "42".toInt() }
    .map { it * 2 }               // transforms the success value, if there is one
    .recover { -1 }                 // provides a fallback if it failed, turning failure into success

println(result.getOrThrow())    // 84
```

`map` and `recover` let you build a pipeline of operations on a `Result` without unwrapping it
early — similar in spirit to chaining on a nullable with `?.`/`?:` (see
[Null Safety](../01-basics/null-safety.md)), but carrying the actual failure reason along instead
of just null.

## Choosing between exceptions, nullable, and `Result`

| Approach | Best for |
|---|---|
| Throw an exception | Genuinely unexpected failures the caller likely can't meaningfully recover from locally (a bug, a broken invariant) |
| Nullable return (`T?`) | "This may simply have no value" — no failure *reason* needs describing, absence is a normal outcome |
| `Result<T>` | An operation that can fail in an *expected*, describable way, where the caller should decide how to react without a `try/catch` — especially useful across function boundaries or when composing multiple fallible steps |

`Result<T>` isn't a wholesale replacement for exceptions — Kotlin still uses unchecked exceptions
throughout its own standard library and the broader JVM ecosystem it interops with (see
[Kotlin/Java Interop](../06-interop-and-tooling/kotlin-java-interop.md)). It's a tool for the
specific case where making failure an explicit, typed part of a function's return value is
genuinely clearer than a thrown exception would be.
