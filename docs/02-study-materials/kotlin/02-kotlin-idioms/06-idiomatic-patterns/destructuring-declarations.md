---
sidebar_position: 1
title: Destructuring Declarations
---

# Destructuring Declarations

Destructuring unpacks an object into multiple variables in one statement — familiar syntax if
you've used it in JavaScript/Python, but in Kotlin it's powered by a specific, extensible
convention rather than special-cased to a few built-in types.

## The basic syntax

```kotlin
data class Point(val x: Int, val y: Int)

val point = Point(3, 4)
val (x, y) = point

println("x=$x, y=$y")    // x=3, y=4
```

## Why this works for data classes specifically

```kotlin
data class Point(val x: Int, val y: Int)
// the compiler auto-generates:
// operator fun component1() = x
// operator fun component2() = y
```

`data class` automatically generates `componentN()` functions for each constructor property —
destructuring `val (x, y) = point` is really just sugar for
`val x = point.component1(); val y = point.component2()`. This is exactly why destructuring works
for data classes without any extra work, and why it *doesn't* work for a plain (non-`data`) class
with no `componentN()` functions defined.

## Making a regular class destructurable

```kotlin
class Point(val x: Int, val y: Int) {
    operator fun component1() = x
    operator fun component2() = y
}
```

Any class — not just `data class` — becomes destructurable simply by defining its own
`operator fun componentN()` functions, following the same convention
[operator overloading](../05-building-dsls/operator-overloading.md) covers generally. This is
exactly how `Map.Entry` supports `for ((key, value) in map)` — `Map.Entry` defines `component1()`
returning the key and `component2()` returning the value.

## Destructuring in loops

```kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
for ((key, value) in map) {
    println("$key -> $value")
}
```

```kotlin
val pairs = listOf(1 to "one", 2 to "two")
for ((number, word) in pairs) {
    println("$number is $word")
}
```

## Destructuring in lambda parameters

```kotlin
val points = listOf(Point(1, 2), Point(3, 4))
points.forEach { (x, y) -> println("($x, $y)") }
```

## Skipping components you don't need

```kotlin
data class UserRecord(val id: String, val name: String, val email: String, val createdAt: Long)

val (id, name, _, createdAt) = userRecord    // underscore skips `email`
```

## A genuine pitfall: destructuring is **positional**, not named

:::warning
Unlike named-field destructuring in some other languages, Kotlin's destructuring matches
`componentN()` functions purely by **position**, not by property name. Reordering a data class's
constructor parameters silently changes what each destructured variable actually receives at every
call site that destructures it — with no compile error, since the types might still happen to
match.
:::

```kotlin
data class User(val name: String, val email: String)
// later, someone reorders the constructor:
data class User(val email: String, val name: String)

val (name, email) = user    // ❌ now silently swapped! `name` actually holds the email, and vice versa
```

If both fields are the same type (`String` and `String` here), this compiles cleanly and fails
silently — a genuine argument for either keeping destructured data classes' field order stable, or
preferring explicit `.name`/`.email` property access over destructuring when field order isn't
tightly controlled.
