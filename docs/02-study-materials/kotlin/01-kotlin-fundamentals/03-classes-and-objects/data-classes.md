---
sidebar_position: 2
title: Data Classes
---

# Data Classes

A **data class** is a class whose main purpose is holding data — Kotlin auto-generates the
methods almost every such class needs, that would otherwise be tedious, repetitive boilerplate.

## The basic declaration

```kotlin
data class User(val name: String, val email: String)
```

This one line gives you, for free:

```kotlin
val user1 = User("Jane", "jane@example.com")
val user2 = User("Jane", "jane@example.com")

println(user1 == user2)          // true — equals() compares property values, not reference identity
println(user1)                    // User(name=Jane, email=jane@example.com) — a real toString()
println(user1.hashCode())           // a hashCode() consistent with equals()

val renamed = user1.copy(name = "Janet")   // copy() — a new instance with one field changed
println(renamed)                             // User(name=Janet, email=jane@example.com)
```

A plain (non-data) class would give you reference-identity `equals` (`user1 == user2` would be
`false` even with identical fields), a useless default `toString()` (something like
`User@1a2b3c4d`), and no `copy()` at all — writing all of this by hand for every simple data
holder is exactly the boilerplate data classes eliminate.

## Destructuring

```kotlin
val user = User("Jane", "jane@example.com")
val (name, email) = user

println(name)     // "Jane"
println(email)      // "jane@example.com"
```

Destructuring works because a data class automatically generates `component1()`, `component2()`,
etc. — one per constructor property, in declaration order. This is also what makes destructuring
work cleanly in a loop:

```kotlin
val users = listOf(User("Jane", "jane@example.com"), User("Bob", "bob@example.com"))
for ((name, email) in users) {
    println("$name: $email")
}
```

## `copy()` for immutable updates

```kotlin
data class Order(val id: Int, val status: String, val total: Double)

val order = Order(1, "pending", 99.99)
val shipped = order.copy(status = "shipped")     // only status changes, id/total carry over
```

`copy()` is the idiomatic way to "update" an immutable data class — instead of mutating the
original, you get a new instance with just the specified fields changed. This pattern is
especially natural once a data class is used as a DTO in a web layer, covered concretely in
[Data Classes as DTOs](/study-materials/kotlin/kotlin-spring-boot/data-access/kotlin-entities-and-jpa-gotchas)
in the Kotlin + Spring Boot topic.

## What data classes require, and their real limits

```kotlin
data class Point(val x: Int, val y: Int)    // ✅ at least one constructor parameter required

// data class Empty()                         ❌ compile error — needs at least one property
```

:::note
Data classes and inheritance don't mix well — a data class can extend another class, but it
can't be extended by one, and inheriting equality semantics across a hierarchy tends to produce
confusing, easy-to-get-wrong `equals()` behavior. If you need a hierarchy of related types, a
[sealed class hierarchy](/study-materials/kotlin/kotlin-idioms/classes-advanced/sealed-classes-and-when)
(in the Kotlin Idioms & Advanced Features topic) is usually the better-suited tool than trying to
extend a data class.
:::

## When NOT to reach for a data class

A class with real behavior/invariants to protect (not just a data holder), or one that needs
reference identity semantics (two instances should be considered different even with identical
field values — rare, but it happens, e.g. some entity-tracking scenarios) is a sign a plain class
(see [Classes & Constructors](./classes-and-constructors.md)) is the better fit, not a data class.
