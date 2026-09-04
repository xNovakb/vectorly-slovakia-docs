---
sidebar_position: 3
title: Lambdas & Higher-Order Functions
---

# Lambdas & Higher-Order Functions

A **higher-order function** is a function that takes another function as a parameter, returns
one, or both. Kotlin treats functions as genuine first-class values — this is the mechanism behind
most of Kotlin's more expressive, functional-feeling code.

## Lambda syntax

```kotlin
val square: (Int) -> Int = { x -> x * x }
println(square(5))    // 25

val add: (Int, Int) -> Int = { a, b -> a + b }
println(add(2, 3))     // 5
```

The type `(Int) -> Int` reads as "a function taking an `Int`, returning an `Int`" — function
types are written this way wherever a lambda's shape needs declaring (a parameter type, a
`val`'s type, a return type).

## `it` — the implicit single parameter

```kotlin
val square: (Int) -> Int = { it * it }    // single-parameter lambdas can skip naming the parameter

val numbers = listOf(1, 2, 3, 4)
val doubled = numbers.map { it * 2 }        // `it` refers to each element
```

`it` is purely a convenience for the extremely common case of a single-parameter lambda — for
anything with more than one parameter, or where `it` would be unclear, name the parameter(s)
explicitly instead.

## Passing functions as parameters

```kotlin
fun calculate(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    return operation(a, b)
}

val sum = calculate(3, 4) { x, y -> x + y }       // 7
val product = calculate(3, 4) { x, y -> x * y }     // 12
```

## Trailing lambda syntax

```kotlin
// If the LAST parameter is a function type, the lambda can move outside the parentheses:
calculate(3, 4) { x, y -> x + y }

// equivalent, but less idiomatic:
calculate(3, 4, { x, y -> x + y })

// and if it's the ONLY parameter, the parentheses can be dropped entirely:
numbers.forEach { println(it) }
```

This is exactly the syntax that makes Kotlin's standard-library functions (`map`, `filter`,
`forEach` — see [Functional Operations](../04-collections-and-functional-style/functional-operations.md))
read almost like built-in language syntax rather than ordinary function calls — and it's the same
mechanism behind Kotlin's DSL-building capability, covered in depth in
[Building DSLs](/study-materials/kotlin/kotlin-idioms/building-dsls/dsl-basics) in the Kotlin
Idioms & Advanced Features topic.

## Functions returning functions

```kotlin
fun multiplier(factor: Int): (Int) -> Int {
    return { number -> number * factor }
}

val triple = multiplier(3)
println(triple(5))    // 15
```

`multiplier` returns a new function, one that "remembers" the `factor` it was created with — a
**closure**, capturing a variable from its enclosing scope rather than just its own parameters.

## Function references

```kotlin
fun isEven(n: Int): Boolean = n % 2 == 0

val numbers = listOf(1, 2, 3, 4, 5, 6)
val evens = numbers.filter(::isEven)       // pass an existing function directly, via ::
val evensLambda = numbers.filter { isEven(it) }   // equivalent, but more verbose
```

`::functionName` references an existing named function as a value, without needing to wrap it in
a lambda — useful when a function already does exactly what's needed, with nothing to add.
