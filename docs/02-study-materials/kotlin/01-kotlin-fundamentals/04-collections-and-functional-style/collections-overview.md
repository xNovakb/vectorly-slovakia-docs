---
sidebar_position: 1
title: Collections Overview
---

# Collections Overview

## The three core collection types

```kotlin
val list = listOf(1, 2, 3)           // ordered, allows duplicates
val set = setOf(1, 2, 3)               // unordered, no duplicates
val map = mapOf("a" to 1, "b" to 2)      // key-value pairs
```

All three build on the standard JVM collection types underneath (`ArrayList`, `HashSet`,
`HashMap` by default) — Kotlin's contribution is the API surface layered on top, not a reinvented
storage mechanism.

## Mutable vs. read-only interfaces — a genuine Kotlin design choice

```kotlin
val readOnly: List<Int> = listOf(1, 2, 3)
// readOnly.add(4)                        ❌ compile error — List has no add() at all

val mutable: MutableList<Int> = mutableListOf(1, 2, 3)
mutable.add(4)                              // ✅ fine — MutableList extends List, adds mutating methods
```

This is a real, deliberate API design decision, not just a naming convention: `List` (and
`Set`/`Map`) genuinely have no mutating methods in their interface at all — `MutableList` is a
*separate* interface that extends `List` and adds them. A function that only needs to read a
collection should take a plain `List` parameter, signaling to callers (and the compiler) that it
won't modify what's passed in:

```kotlin
fun printAll(items: List<String>) {    // caller knows this function can't mutate their list
    items.forEach { println(it) }
}
```

:::note
This is **not** true immutability the way a `val` isn't true immutability for the object it
references (see [Variables & Types](../01-basics/variables-and-types.md)) — a `List` reference
could still point at an object that's actually a `MutableList` underneath, and something else
holding a reference to that same underlying `MutableList` could still mutate it. `List` prevents
mutation *through that specific reference*, not a guarantee the underlying collection can never
change at all.
:::

## Creating collections

```kotlin
val empty = emptyList<String>()
val fromValues = listOf("a", "b", "c")
val fromRange = (1..5).toList()

val mutableEmpty = mutableListOf<String>()
val mutableFromValues = mutableListOf("a", "b", "c")
```

## Common operations

```kotlin
val list = listOf(1, 2, 3, 4, 5)

println(list.size)              // 5
println(list.first())             // 1
println(list.last())               // 5
println(list.contains(3))            // true
println(list[2])                       // 3 — index access
println(list.isEmpty())                  // false
println(list.getOrNull(10))                // null — safe indexed access, no exception
```

## Maps specifically

```kotlin
val ages = mapOf("Jane" to 30, "Bob" to 25)

println(ages["Jane"])            // 30
println(ages["Unknown"])           // null — missing key returns null, doesn't throw
println(ages.getOrDefault("Unknown", 0))   // 0

for ((name, age) in ages) {          // destructuring works here too, see Data Classes
    println("$name is $age")
}
```

`to` here is actually an infix function creating a `Pair` — `"Jane" to 30` is equivalent to
`Pair("Jane", 30)`, just more readable when building a map literal.

## Where this leads

[Functional Operations](./functional-operations.md) covers transforming collections
(`map`/`filter`/`reduce`) — the part of Kotlin collections that most changes how code actually
gets written, day to day.
