---
sidebar_position: 1
title: Generics Basics
---

# Generics Basics

Generics let a function or class work with a **type parameter** instead of one fixed type — the
same code works for `List<Int>`, `List<String>`, `List<User>`, without duplicating it per type.

## Generic functions

```kotlin
fun <T> firstOrDefault(list: List<T>, default: T): T {
    return if (list.isNotEmpty()) list[0] else default
}

firstOrDefault(listOf(1, 2, 3), 0)          // 4 -> Int version
firstOrDefault(listOf("a", "b"), "none")      // String version, same function
```

`<T>` declares the type parameter; the compiler infers the concrete type (`Int`, `String`) from
the arguments at each call site — you don't have to write `firstOrDefault<Int>(...)` explicitly
unless inference genuinely can't figure it out on its own.

## Generic classes

```kotlin
class Box<T>(private var content: T) {
    fun get(): T = content
    fun set(value: T) { content = value }
}

val intBox = Box(42)
val stringBox = Box("hello")
```

`Box<T>` is one class definition that becomes `Box<Int>`, `Box<String>`, etc. at each usage —
each instance is still strongly typed (you can't `intBox.set("oops")`, that's a compile error).

## Bounded type parameters

```kotlin
fun <T : Comparable<T>> max(a: T, b: T): T {
    return if (a > b) a else b
}

max(3, 7)          // works — Int implements Comparable<Int>
max("a", "b")        // works — String implements Comparable<String>
```

`<T : Comparable<T>>` restricts `T` to only types that implement `Comparable<T>` — without this
bound, the function body couldn't use `>` at all, since a fully unconstrained `T` has no
guaranteed operations beyond what `Any` provides.

## Multiple bounds

```kotlin
fun <T> process(item: T) where T : Comparable<T>, T : java.io.Serializable {
    // item is guaranteed to satisfy BOTH constraints
}
```

`where` lets a type parameter be bounded by more than one requirement simultaneously — genuinely
useful, though less common day-to-day than a single bound.

## Why generics over `Any`

```kotlin
❌ fun firstOrDefault(list: List<Any>, default: Any): Any { ... }
   val x: Int = firstOrDefault(listOf(1, 2, 3), 0) as Int   // manual cast required, unsafe

✅ fun <T> firstOrDefault(list: List<T>, default: T): T { ... }
   val x: Int = firstOrDefault(listOf(1, 2, 3), 0)             // no cast, type-checked
```

Using `Any` loses type information entirely — the caller has to cast the result back to the real
type, with no compile-time guarantee the cast is even correct. Generics preserve the actual type
all the way through, catching a type mismatch at compile time instead of a `ClassCastException` at
runtime.

## What's next

This page covers generics as most languages have them. Kotlin's own twist —
[declaration-site variance](./variance-in-out.md) (`in`/`out`) — genuinely differs from how Java
handles the same problem, and [reified type parameters](./reified-type-parameters.md) solve a
limitation generics normally have on the JVM that most languages simply live with.
