---
sidebar_position: 3
title: Objects & Companion Objects
---

# Objects & Companion Objects

Kotlin has no `static` keyword at all — three related `object` constructs cover everything Java
uses `static` for, plus genuine singletons as a first-class language feature.

## `object` declarations — built-in singletons

```kotlin
object AppConfig {
    val version = "1.0.0"
    var debugMode = false

    fun printInfo() {
        println("App version: $version, debug: $debugMode")
    }
}

AppConfig.printInfo()          // no instantiation needed — there's exactly one instance, ever
AppConfig.debugMode = true
```

An `object` declaration defines a class **and** creates its single instance simultaneously, lazily
initialized on first access, thread-safe by construction — no manual singleton pattern (private
constructor + static instance field + getInstance() method) needed the way Java requires.

## Companion objects — the closest thing to Java `static`

```kotlin
class User private constructor(val name: String, val email: String) {
    companion object {
        fun create(name: String, email: String): User {
            require(email.contains("@")) { "Invalid email" }
            return User(name, email)
        }

        const val DEFAULT_DOMAIN = "example.com"
    }
}

val user = User.create("Jane", "jane@example.com")    // called like a static method
println(User.DEFAULT_DOMAIN)                              // accessed like a static field
```

A `companion object` is a real object *associated with* a class (accessed via the class name
directly, `User.create(...)` rather than `User.Companion.create(...)`) — commonly used for factory
functions (as above), constants, and utility functions logically tied to that specific class.

## Why a factory function in a companion object, not a public constructor

```kotlin
class User private constructor(val name: String, val email: String) {
    companion object {
        fun create(name: String, email: String): User? {
            if (!email.contains("@")) return null    // validation can fail gracefully, unlike a constructor
            return User(name, email)
        }
    }
}
```

A constructor can't return `null` or a different subtype — a companion-object factory function
can, giving genuine flexibility a constructor structurally cannot: returning `null` on invalid
input, caching/reusing instances, or returning a different implementation based on the arguments.

## Object expressions — anonymous objects

```kotlin
val clickListener = object {
    fun onClick() = println("Clicked!")
}

interface Comparator2<T> {
    fun compare(a: T, b: T): Int
}

val byLength = object : Comparator2<String> {
    override fun compare(a: String, b: String) = a.length - b.length
}
```

An **object expression** creates a one-off, anonymous instance right where it's used — Kotlin's
equivalent of Java's anonymous inner classes, most often reached for when implementing a
single-use interface implementation inline rather than defining a whole named class for it.

## Summary: the three forms

```text
object Name { ... }                — a named singleton, one instance ever, accessed by name
class X { companion object { ... } } — static-like members tied to a specific class
object : SomeInterface { ... }        — an anonymous, one-off instance (an "object expression")
```

All three compile down to real JVM classes under the hood — this is purely Kotlin syntax making
patterns Java requires manual boilerplate for (singleton, static members, anonymous classes) into
first-class, concise language features.
