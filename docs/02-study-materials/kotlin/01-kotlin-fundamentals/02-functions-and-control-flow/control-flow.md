---
sidebar_position: 2
title: Control Flow
---

# Control Flow

## `if` as an expression, not just a statement

```kotlin
// Statement style (works, but not idiomatic Kotlin for this case)
var max: Int
if (a > b) {
    max = a
} else {
    max = b
}
```

```kotlin
// Expression style — idiomatic Kotlin
val max = if (a > b) a else b
```

In Kotlin, `if` **produces a value** — there's no separate ternary operator (`? :`) the way Java
has one, because `if`/`else` as an expression already covers that exact use case. This isn't just
shorter syntax; it nudges code toward "compute a value" instead of "mutate a variable across
branches," which tends to produce fewer bugs from a forgotten branch.

## `when` as an expression

```kotlin
val description = when (score) {
    in 90..100 -> "Excellent"
    in 70..89 -> "Good"
    in 50..69 -> "Passing"
    else -> "Failing"
}
```

`when` is Kotlin's replacement for Java's `switch` — but far more capable: it matches ranges,
types, arbitrary boolean conditions, and multiple values per branch, not just constants.

```kotlin
fun describe(x: Any): String = when (x) {
    is Int -> "an integer: $x"          // type check + smart cast, see Null Safety
    is String -> "a string of length ${x.length}"
    0, 1 -> "zero or one"                  // multiple values, one branch
    else -> "something else"
}
```

An `else` branch is **required** on a `when` expression (used as a value) unless the compiler can
prove every case is covered — exactly the property [Sealed Classes](/study-materials/kotlin/kotlin-idioms/classes-advanced/sealed-classes-and-when)
(in the Kotlin Idioms & Advanced Features topic) exploits to make `when` exhaustive without an
`else` at all.

## Ranges

```kotlin
val range = 1..10                  // inclusive: 1, 2, ..., 10
val exclusive = 1 until 10           // exclusive of the end: 1, 2, ..., 9
val stepped = 1..10 step 2             // 1, 3, 5, 7, 9
val reversed = 10 downTo 1               // 10, 9, ..., 1

if (age in 18..65) { /* ... */ }           // ranges work directly in boolean checks too
```

## `for` loops

```kotlin
for (i in 1..5) {
    println(i)
}

val names = listOf("Jane", "Bob", "Alice")
for (name in names) {
    println(name)
}

for ((index, name) in names.withIndex()) {    // index + value together
    println("$index: $name")
}
```

Kotlin has no classic C-style `for (int i = 0; i < n; i++)` loop at all — ranges and iterables
cover that need more safely (no off-by-one index errors to make in the loop header itself).

## `while` and `do-while`

```kotlin
var count = 0
while (count < 5) {
    println(count)
    count++
}

do {
    println(count)
    count--
} while (count > 0)
```

Behave exactly as in Java — the main departure from familiar control flow in Kotlin is really
`if`/`when` as expressions, not the loop constructs themselves.
