---
sidebar_position: 3
title: Null Safety
---

# Null Safety

The single most-cited reason teams adopt Kotlin: nullability is part of the **type system**
itself, not a runtime surprise a `NullPointerException` reveals after the fact.

## Nullable vs. non-null types

```kotlin
var name: String = "Jane"       // non-null — the compiler guarantees this is never null
name = null                       // compile error, not a runtime crash

var nickname: String? = "Janey"    // nullable — explicitly opted into, marked with ?
nickname = null                       // fine — the type says this is allowed
```

Every type is non-null by default; nullability has to be **explicitly declared** with `?`. This
inverts Java's default, where every reference type can silently be null unless you add your own
discipline (or an annotation like `@Nullable`) to say otherwise.

## Safe call (`?.`)

```kotlin
val nickname: String? = null

val length = nickname?.length     // returns null instead of throwing, if nickname is null
println(length)                     // prints: null
```

```kotlin
// chaining safe calls — short-circuits to null at the first null link
val city: String? = user?.address?.city
```

`?.` calls the method/property only if the receiver isn't null; if it is, the whole expression
evaluates to `null` instead of throwing — no `if (x != null)` boilerplate needed for a simple
"do this if it's there" case.

## Elvis operator (`?:`)

```kotlin
val nickname: String? = null
val displayName = nickname ?: "Anonymous"    // use "Anonymous" if nickname is null

val length = nickname?.length ?: 0             // combine with a safe call: default to 0 if null
```

`?:` provides a fallback value for the null case — reads naturally as "or, if that's null, use
this instead." Combining `?.` and `?:` (`nickname?.length ?: 0`) is one of the most common Kotlin
idioms for "get this value, or a sensible default if it's missing."

## Not-null assertion (`!!`) — and why it's a code smell

```kotlin
val nickname: String? = null
val length = nickname!!.length    // throws NullPointerException immediately if nickname is null
```

`!!` tells the compiler "trust me, this isn't actually null" — and if you're wrong, it throws
exactly the `NullPointerException` Kotlin's whole null-safety system exists to prevent.

:::warning
`!!` is almost always a sign the code should be restructured — a safe call with a sensible
fallback (`?:`), an early return, or fixing the actual source of the unwanted nullability is
nearly always better than asserting past it. Reach for `!!` only when you have a genuine
external guarantee the compiler can't see (e.g. a value you just checked with `if (x != null)`
in a way the compiler's smart-cast, below, can't follow) — not as a routine way to silence a
compiler warning.
:::

## Smart casts

```kotlin
fun printLength(text: String?) {
    if (text != null) {
        println(text.length)    // no ?. or !! needed here — the compiler KNOWS text isn't null
    }
}
```

Inside the `if (text != null)` block, the compiler automatically treats `text` as the non-null
type `String` rather than `String?` — this is a **smart cast**, and it's exactly what makes
`!!` unnecessary in most real code: an explicit null check followed by normal code, not an
assertion, is the idiomatic pattern.

```kotlin
// smart casts don't work across function calls, since the value could change between the
// check and the use — this specific case genuinely needs a different approach:
class Config { var value: String? = null }

fun printValue(config: Config) {
    if (config.value != null) {
        // println(config.value.length)   // ❌ still an error — config.value is a mutable
                                            //    property, could change between the check and here
        val value = config.value
        if (value != null) {
            println(value.length)          // ✅ a local val CAN be smart-cast
        }
    }
}
```

## Platform types — where Kotlin can't help

Calling into Java code without nullability annotations, Kotlin can't know whether a given
reference can be null — see
[Platform Types & Java Interop](../06-interop-and-tooling/platform-types-and-java-interop.md) for
exactly how this gap is handled at the Kotlin/Java boundary.
