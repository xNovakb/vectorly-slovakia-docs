---
sidebar_position: 1
title: Classes & Constructors
---

# Classes & Constructors

## Primary constructor

```kotlin
class User(val name: String, val email: String)
```

This one line declares a class **and** its constructor **and** two read-only properties — no
separate field declarations, no separate constructor body, no boilerplate getters. `val`/`var` in
the constructor parameter list is what turns a parameter into a real property.

```kotlin
val user = User("Jane", "jane@example.com")
println(user.name)    // "Jane" — a real property, not just a constructor parameter
```

Without `val`/`var`, a constructor parameter is just a regular parameter, not a property:

```kotlin
class Logger(prefix: String) {    // prefix is NOT a property — only usable inside init/methods
    val fullPrefix = "[$prefix]"    // has to be captured into a real property explicitly if needed later
}
```

## `init` blocks

```kotlin
class User(val name: String, val email: String) {
    init {
        require(email.contains("@")) { "Invalid email: $email" }
        println("Created user: $name")
    }
}
```

`init` blocks run as part of construction, in the order they appear relative to property
declarations — useful for validation or setup logic that can't fit into the constructor parameter
list itself. `require`/`check` (throwing `IllegalArgumentException`/`IllegalStateException`) are
the idiomatic way to validate constructor arguments.

## Secondary constructors

```kotlin
class User(val name: String, val email: String) {
    var isGuest: Boolean = false

    constructor(name: String) : this(name, "no-email@example.com") {
        isGuest = true
    }
}

val registered = User("Jane", "jane@example.com")
val guest = User("Anonymous")    // uses the secondary constructor
```

Every secondary constructor must ultimately delegate to the primary constructor (`: this(...)`) —
Kotlin doesn't allow a class to have fully independent construction paths that skip primary
constructor logic. In practice, default parameters (see
[Functions Basics](../02-functions-and-control-flow/functions-basics.md)) cover the same need more
often than not, making secondary constructors less common in idiomatic Kotlin than in Java.

## Custom getters and setters

```kotlin
class Rectangle(val width: Double, val height: Double) {
    val area: Double
        get() = width * height          // computed property, no backing field at all
}

class Person(name: String) {
    var name: String = name
        set(value) {
            field = value.trim()          // `field` refers to the actual backing storage
        }
}
```

`area` here isn't stored — it's recomputed every time it's read, from `width`/`height`. `field`
inside a custom setter is a special identifier referring to the property's actual backing storage,
distinct from the property name itself (using `name = value` inside `name`'s own setter would
recurse infinitely).

## Class members: properties and methods together

```kotlin
class BankAccount(private val owner: String, private var balance: Double) {
    fun deposit(amount: Double) {
        require(amount > 0) { "Deposit must be positive" }
        balance += amount
    }

    fun withdraw(amount: Double) {
        check(amount <= balance) { "Insufficient funds" }
        balance -= amount
    }

    fun getBalance(): Double = balance
}
```

`private` on a constructor parameter/property restricts it to the class itself, same visibility
meaning as Java — Kotlin's default visibility (with nothing specified) is `public`, unlike Java's
package-private default.

See [Data Classes](./data-classes.md) next for the specific, extremely common case of a class
that's mainly just a holder for data.
