---
sidebar_position: 3
title: Scoped Extensions & Receivers
---

# Scoped Extensions & Receivers

Combining [extension functions](./extension-functions.md) with lambdas produces something more
powerful than either alone: a **function type with a receiver** — the exact mechanism behind
Kotlin's `apply`/`run` (see [let, run, with](../01-scope-functions/let-run-with.md) and
[apply, also](../01-scope-functions/apply-also.md)) and the foundation of type-safe DSLs (see
[Building DSLs](../05-building-dsls/dsl-basics.md)).

## A function type with a receiver

```kotlin
val greet: String.() -> Unit = {
    println("Hello, $this!")
}

"World".greet()    // prints "Hello, World!"
```

`String.() -> Unit` is a function type where the function body has `this` bound to a `String` —
different from a plain `(String) -> Unit`, where the string would be an ordinary parameter, not a
receiver you can call other `String` members on directly.

## Passing one as a parameter — this is how `apply` actually works

```kotlin
fun <T> T.myApply(block: T.() -> Unit): T {
    this.block()
    return this
}
```

This is (approximately) the real standard library implementation of `apply`. `block: T.() -> Unit`
means the lambda passed to `myApply` runs with `this` bound to the receiver — exactly why, inside
an `apply { }` block, you can reference the receiver's own members directly without an explicit
qualifier.

## Building your own scoped-extension function

```kotlin
class HttpRequestBuilder {
    var url: String = ""
    var method: String = "GET"
    val headers = mutableMapOf<String, String>()
}

fun buildRequest(block: HttpRequestBuilder.() -> Unit): HttpRequestBuilder {
    val builder = HttpRequestBuilder()
    builder.block()
    return builder
}
```

```kotlin
val request = buildRequest {
    url = "https://api.example.com/users"
    method = "POST"
    headers["Authorization"] = "Bearer abc123"
}
```

Inside the trailing lambda, `url`, `method`, and `headers` are accessed as if they were locally
in scope — because they effectively are, through the implicit `this: HttpRequestBuilder` receiver
the lambda runs with. This exact pattern — a function taking a `SomeType.() -> Unit` lambda,
constructing and configuring an instance inside it — is the single most common building block
behind Kotlin DSLs.

## `it` vs. implicit `this` — the practical difference this creates

```kotlin
// plain lambda parameter — must reference explicitly
inline fun configure(block: (Config) -> Unit) {
    val config = Config()
    block(config)
}
configure { it.name = "test" }

// receiver lambda — referenced implicitly, reads like a mini-DSL
inline fun configureScoped(block: Config.() -> Unit) {
    val config = Config()
    config.block()
}
configureScoped { name = "test" }
```

Both accomplish the same thing functionally — the receiver form just reads more naturally for
configuration-shaped code, which is exactly why `apply`, Kotlin's own builder-style APIs, and
custom DSLs all lean on it specifically rather than a plain lambda parameter.

## Where this leads next

[Building DSLs](../05-building-dsls/dsl-basics.md) picks this mechanism up directly and builds a
full worked example (an HTML-like DSL) on top of it, including
[Type-Safe Builders](../05-building-dsls/type-safe-builders.md)'s `@DslMarker` annotation — which
exists specifically to prevent confusing *which* receiver an unqualified call resolves to once
these scoped-extension blocks start nesting.
