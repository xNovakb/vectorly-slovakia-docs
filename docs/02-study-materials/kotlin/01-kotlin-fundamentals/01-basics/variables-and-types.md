---
sidebar_position: 2
title: Variables & Types
---

# Variables & Types

## `val` vs. `var`

```kotlin
val name = "Jane"       // read-only reference — cannot be reassigned
var count = 0             // mutable reference — can be reassigned

count = 1                   // fine
name = "Bob"                  // compile error: val cannot be reassigned
```

`val` doesn't necessarily mean the underlying object is immutable — it means the *reference*
can't be reassigned to point at something else:

```kotlin
val list = mutableListOf(1, 2, 3)
list.add(4)          // fine — mutating the object list points to
list = mutableListOf()  // compile error — can't reassign the val itself
```

Default to `val` unless you have a specific reason to need reassignment — this is a genuinely
idiomatic Kotlin habit, not just a style preference, since it makes code easier to reason about
(a `val` can't have changed by the time you read it later in the same function).

## Basic types

```kotlin
val age: Int = 30
val price: Double = 19.99
val initial: Char = 'J'
val isActive: Boolean = true
val name: String = "Jane"
val bigNumber: Long = 10_000_000_000L
```

Unlike Java, Kotlin has **no primitive types visible in source code** — `Int`, `Boolean`, etc. are
all real types with methods, and the compiler decides whether to represent them as JVM primitives
or boxed objects under the hood, based on context (a nullable `Int?` must be boxed, since JVM
primitives can't be null — see [Null Safety](./null-safety.md)).

## Type inference

```kotlin
val name = "Jane"        // inferred as String, no annotation needed
val age = 30                // inferred as Int
val price = 19.99             // inferred as Double

val explicit: String = "Jane"   // explicit annotation, allowed but usually unnecessary
```

Type inference isn't "no types" — it's the compiler determining the type at compile time, exactly
as strictly checked as if you'd written it explicitly. An annotation is worth adding when the
inferred type wouldn't be obvious to a reader, or on a public API's function signature for
clarity, but is otherwise usually just noise.

## String templates

```kotlin
val name = "Jane"
val age = 30

println("Hello, $name! You are $age years old.")     // simple variable reference
println("Next year you'll be ${age + 1}.")               // expression inside ${}
println("Name in caps: ${name.uppercase()}")               // method calls work too
```

String templates replace Java's clunky `"Hello, " + name + "!"` concatenation — `$variable` for a
simple reference, `${expression}` for anything more complex than a bare variable name.

## `Any`, `Unit`, and `Nothing` — the three special types

```kotlin
fun printSomething(): Unit {    // Unit = "returns nothing meaningful", like Java's void
    println("hi")
}                                  // Unit is the default return type, usually omitted entirely

fun describe(x: Any): String {    // Any = the root of Kotlin's type hierarchy (like Java's Object)
    return x.toString()
}

fun fail(): Nothing {              // Nothing = a function that never returns normally
    throw IllegalStateException()   // (always throws, or loops forever) — useful for exhaustiveness
}
```

`Nothing` shows up more than it might seem — it's the return type Kotlin infers for a branch that
always throws, which is exactly what lets the compiler still treat a `when` expression as
exhaustive even when one branch just throws instead of returning a value (see
[Control Flow](../02-functions-and-control-flow/control-flow.md)).
