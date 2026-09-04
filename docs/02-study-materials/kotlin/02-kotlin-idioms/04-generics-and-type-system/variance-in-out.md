---
sidebar_position: 2
title: "Variance: in and out"
---

# Variance: in and out

Variance answers a specific question: if `Dog` is a subtype of `Animal`, is `Box<Dog>` a subtype
of `Box<Animal>`? The answer isn't automatically "yes" — and Kotlin lets you declare the answer
explicitly, right where the generic type itself is defined.

## The problem variance solves

```kotlin
class Box<T>(var content: T)

fun printAnimal(box: Box<Animal>) {
    println(box.content)
}

val dogBox = Box<Dog>(Dog())
printAnimal(dogBox)    // ❌ compile error by default — Box<Dog> is NOT a Box<Animal>
```

By default, generic types are **invariant** — `Box<Dog>` and `Box<Animal>` are treated as entirely
unrelated types, even though `Dog` is an `Animal`. This is deliberate: `Box<T>` here is mutable
(`set`), and allowing `Box<Dog>` to be used as a `Box<Animal>` would let someone call
`box.content = Cat()` on what's actually a `Box<Dog>` — a real type-safety hole.

## `out` — covariance, for read-only producers

```kotlin
class ReadOnlyBox<out T>(val content: T)

fun printAnimal(box: ReadOnlyBox<Animal>) {
    println(box.content)
}

val dogBox = ReadOnlyBox<Dog>(Dog())
printAnimal(dogBox)    // ✅ works — ReadOnlyBox<Dog> IS treated as a ReadOnlyBox<Animal>
```

`out T` declares that `T` only ever appears in **output** positions (return types, `val`
properties) — the class only ever *produces* `T`, never *consumes* it. Given that guarantee, the
compiler allows the subtyping relationship: since a `ReadOnlyBox<Dog>` can only ever hand you a
`Dog` (which is always safe to treat as an `Animal`), it's safe to use it wherever a
`ReadOnlyBox<Animal>` is expected. `List<T>` in Kotlin is declared `out` for exactly this reason —
it's read-only.

## `in` — contravariance, for write-only consumers

```kotlin
class Consumer<in T> {
    fun consume(item: T) {
        println("Consuming: $item")
    }
}

val animalConsumer: Consumer<Animal> = Consumer()
val dogConsumer: Consumer<Dog> = animalConsumer    // ✅ works — the REVERSE subtyping direction
```

`in T` declares that `T` only ever appears in **input** positions (function parameters) — the
class only ever *consumes* `T`, never produces it. This flips the subtyping relationship: a
`Consumer<Animal>` (which can consume any `Animal`, including a `Dog`) is safely usable wherever a
`Consumer<Dog>` is needed — it can handle everything a `Consumer<Dog>` could and more.

## Why Kotlin's approach genuinely differs from Java's

Java handles this with **use-site** variance (wildcards at the call site: `List<? extends Animal>`,
`List<? super Dog>`) — every caller has to remember and correctly annotate variance at every usage.
Kotlin uses **declaration-site** variance — `out`/`in` is declared **once**, on the class/interface
definition itself, and every usage automatically gets the correct variance behavior with no
wildcards needed at the call site at all.

```java
// Java: variance annotated at every use site
List<? extends Animal> animals = dogList;
```

```kotlin
// Kotlin: variance declared once, on List's own definition — just works everywhere
val animals: List<Animal> = dogList
```

This is a genuine ergonomic win — Kotlin's standard library types (`List` as `out`, function
parameter types as `in`) already have sensible variance built in, so most everyday code benefits
from this without ever needing to write `in`/`out` at all; it mainly matters when **designing your
own** generic classes.

## A mnemonic

```text
out  = "goes OUT of the box"    = producer  = covariant     = List<out T>
in   = "goes IN to the box"      = consumer  = contravariant  = Comparator<in T>
```

`Comparator<in T>` is a real standard-library example: a `Comparator<Animal>` can compare any two
`Animal`s, including two `Dog`s — so it's safely usable wherever a `Comparator<Dog>` is expected,
the contravariant direction.
