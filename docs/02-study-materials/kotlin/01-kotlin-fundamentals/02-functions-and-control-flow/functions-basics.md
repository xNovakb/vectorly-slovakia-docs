---
sidebar_position: 1
title: Functions Basics
---

# Functions Basics

## Basic syntax

```kotlin
fun add(a: Int, b: Int): Int {
    return a + b
}

fun greet(name: String) {    // no return type = returns Unit (see Variables & Types)
    println("Hello, $name!")
}
```

## Single-expression functions

```kotlin
fun add(a: Int, b: Int): Int = a + b       // no braces, no explicit `return`
fun square(x: Int) = x * x                   // return type inferred as Int
```

When a function's body is a single expression, `= expression` replaces the `{ return ... }` block
entirely — genuinely common in idiomatic Kotlin for short functions, not just a cute shortcut.
The return type can even be omitted, inferred from the expression, though an explicit type is
still good practice on a public API.

## Default parameters

```kotlin
fun greet(name: String, greeting: String = "Hello") {
    println("$greeting, $name!")
}

greet("Jane")                    // "Hello, Jane!"
greet("Jane", "Hi")               // "Hi, Jane!"
```

Default parameters eliminate a huge amount of Java's method-overloading boilerplate (writing three
overloads of the same method just to support optional parameters) — one function definition
covers every call shape that just omits trailing defaulted parameters.

## Named arguments

```kotlin
fun createUser(name: String, email: String, isAdmin: Boolean = false) { /* ... */ }

createUser(name = "Jane", email = "jane@example.com", isAdmin = true)
createUser(email = "jane@example.com", name = "Jane")    // order doesn't matter with named args
```

Especially valuable combined with default parameters — you can set a parameter deep in the list
without needing to repeat every default before it:

```kotlin
fun connect(host: String, port: Int = 443, timeout: Int = 30, retries: Int = 3) { /* ... */ }

connect("example.com", retries = 5)    // skip port/timeout, only override retries
```

## Varargs

```kotlin
fun sum(vararg numbers: Int): Int = numbers.sum()

sum(1, 2, 3)              // 6
sum(1, 2, 3, 4, 5)          // 15

val nums = intArrayOf(1, 2, 3)
sum(*nums)                    // spread operator (*) to pass an array as varargs
```

## Functions as top-level declarations

```kotlin title="Utils.kt"
fun formatCurrency(amount: Double): String = "$${"%.2f".format(amount)}"
```

Unlike Java, a Kotlin function doesn't need to live inside a class at all — a plain top-level
function in a `.kt` file is completely valid, and common for utility functions that don't
naturally belong to any particular type. [Extension Functions](/study-materials/kotlin/kotlin-idioms/extension-functions-and-properties/extension-functions)
(in the Kotlin Idioms & Advanced Features topic) build on this same idea further.

## Where this leads next

[Control Flow](./control-flow.md) covers `if`/`when` as *expressions* — a related idea that makes
Kotlin functions often even more concise than the single-expression form shown here alone.
