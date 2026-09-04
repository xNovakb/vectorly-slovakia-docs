---
sidebar_position: 1
title: Exceptions in Kotlin
---

# Exceptions in Kotlin

## Basic try/catch/finally

```kotlin
fun parseAge(input: String): Int {
    try {
        return input.toInt()
    } catch (e: NumberFormatException) {
        println("Invalid age: $input")
        return -1
    } finally {
        println("Parse attempt finished")    // always runs, success or failure
    }
}
```

Structurally identical to Java — the real, deliberate difference is what Kotlin **doesn't** have.

## No checked exceptions — a genuine, deliberate difference

```kotlin
fun readFile(path: String): String {
    return File(path).readText()    // can throw IOException — no `throws` clause required, no
                                       // compile error if the caller doesn't catch it
}
```

Java forces a method to declare checked exceptions (`throws IOException`) and forces callers to
either catch or re-declare them, enforced by the compiler. Kotlin has **no checked exceptions at
all** — every exception is effectively "unchecked" from the compiler's point of view, whether it's
a `RuntimeException` or not.

This is a deliberate Kotlin design decision, not an oversight: in practice, checked exceptions
tended to produce either genuinely handled errors *or* a huge amount of `catch (Exception e) {}`
boilerplate written purely to satisfy the compiler, providing little real safety while adding real
noise. Kotlin's designers judged that tradeoff wasn't worth it.

## `try` as an expression

```kotlin
val age = try {
    input.toInt()
} catch (e: NumberFormatException) {
    0    // fallback value if parsing fails
}
```

Like `if` and `when` (see [Control Flow](../02-functions-and-control-flow/control-flow.md)),
`try` can be used as an expression, producing a value from whichever branch actually ran —
`age` here gets either the parsed value or the fallback, in one expression instead of a separate
`var` declared before the block and reassigned inside it.

## `require`, `check`, and `error` — idiomatic validation

```kotlin
fun withdraw(amount: Double, balance: Double) {
    require(amount > 0) { "Amount must be positive, got $amount" }      // throws IllegalArgumentException
    check(amount <= balance) { "Insufficient funds" }                     // throws IllegalStateException
}

fun processStatus(status: String): String = when (status) {
    "active" -> "Running"
    "stopped" -> "Halted"
    else -> error("Unknown status: $status")                               // throws IllegalStateException
}
```

- **`require`** — for validating *arguments/input* (the caller did something wrong).
- **`check`** — for validating *internal state* (something the code itself expected to be true
  isn't — a logic bug, not a caller mistake).
- **`error`** — shorthand for unconditionally throwing `IllegalStateException`, often used as the
  `else` branch of an otherwise-exhaustive `when` to make an "impossible" case fail loudly instead
  of silently falling through.

These read far more clearly at the call site than a bare `if (...) throw IllegalArgumentException(...)`,
and are genuinely idiomatic — reach for them over a manual `if`/`throw` in nearly every case.

## Multi-catch — not directly supported, handled differently

```kotlin
try {
    riskyOperation()
} catch (e: Exception) {
    when (e) {
        is IOException -> handleIoError(e)
        is NumberFormatException -> handleParseError(e)
        else -> throw e    // re-throw anything not explicitly handled
    }
}
```

Kotlin has no `catch (IOException | NumberFormatException e)` multi-catch syntax the way Java
does — catching a broad type and using `when (e) { is X -> ...; is Y -> ... }` inside is the
idiomatic equivalent.

## Where to go from here

[The Result Type](./the-result-type.md) covers an alternative to exceptions entirely for
functions where "this can fail" is a normal, expected outcome rather than an exceptional one.
