---
sidebar_position: 2
title: Functional Operations
---

# Functional Operations

Kotlin's standard library gives collections a rich set of functional-style operations — building
directly on lambdas and higher-order functions (see
[Lambdas & Higher-Order Functions](../02-functions-and-control-flow/lambdas-and-higher-order-functions.md))
to let you describe *what* transformation you want rather than manually writing loops for it.

## `map` — transform each element

```kotlin
val numbers = listOf(1, 2, 3, 4)
val doubled = numbers.map { it * 2 }        // [2, 4, 6, 8]

val names = listOf("jane", "bob")
val capitalized = names.map { it.replaceFirstChar(Char::uppercase) }   // ["Jane", "Bob"]
```

## `filter` — keep elements matching a condition

```kotlin
val numbers = listOf(1, 2, 3, 4, 5, 6)
val evens = numbers.filter { it % 2 == 0 }     // [2, 4, 6]
val odds = numbers.filterNot { it % 2 == 0 }     // [1, 3, 5]
```

## `reduce` and `fold` — combine into a single value

```kotlin
val numbers = listOf(1, 2, 3, 4)

val sum = numbers.reduce { acc, n -> acc + n }        // 10 — starts with the first element
val sumWithStart = numbers.fold(100) { acc, n -> acc + n }   // 110 — starts with an explicit initial value
```

`fold` and `reduce` do the same job, but `fold` requires an explicit starting value (and can
therefore produce a *different type* than the collection's elements — e.g. folding numbers into a
`String`), while `reduce` uses the collection's own first element as the start and fails on an
empty collection (`reduce` on an empty list throws; `fold` doesn't, since it already has a
starting value regardless).

## `sortedBy` and friends

```kotlin
data class Person(val name: String, val age: Int)

val people = listOf(Person("Bob", 30), Person("Jane", 25))

val byAge = people.sortedBy { it.age }              // ascending by age
val byAgeDesc = people.sortedByDescending { it.age }  // descending by age
val byName = people.sortedBy { it.name }                // alphabetical
```

## Chaining operations

```kotlin
val result = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    .filter { it % 2 == 0 }      // [2, 4, 6, 8, 10]
    .map { it * it }               // [4, 16, 36, 64, 100]
    .filter { it > 20 }              // [36, 64, 100]
    .sum()                             // 200
```

Chaining reads top-to-bottom as a pipeline of transformations — genuinely easier to follow than
the equivalent nested/manual loop version, and this exact chaining style is what
[Sequences](./sequences.md) (next page) optimizes further for larger collections.

## Other common operations

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

println(numbers.any { it > 3 })       // true — at least one matches
println(numbers.all { it > 0 })         // true — every element matches
println(numbers.none { it > 10 })         // true — no element matches
println(numbers.count { it % 2 == 0 })      // 2
println(numbers.groupBy { it % 2 == 0 })      // {false=[1, 3, 5], true=[2, 4]}
println(numbers.associateWith { it * it })      // {1=1, 2=4, 3=9, 4=16, 5=25}
```

## Why this matters beyond conciseness

Beyond being shorter than a hand-written loop, each of these names its *intent* directly —
`filter` says "I'm keeping some elements," `map` says "I'm transforming each element," in a way a
generic `for` loop with an `if` inside doesn't communicate at a glance. Reading a chain of these
tells you what the code is *doing* before you have to trace through loop mechanics to figure it
out yourself.
