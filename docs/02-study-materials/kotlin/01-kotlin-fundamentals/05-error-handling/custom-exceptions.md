---
sidebar_position: 3
title: Custom Exceptions
---

# Custom Exceptions

## Defining your own exception type

```kotlin
class InsufficientFundsException(message: String) : Exception(message)

fun withdraw(amount: Double, balance: Double) {
    if (amount > balance) {
        throw InsufficientFundsException("Cannot withdraw $amount, balance is only $balance")
    }
}
```

A custom exception is just a class extending `Exception` (or a subtype of it) — Kotlin's
constructor syntax (see [Classes & Constructors](../03-classes-and-objects/classes-and-constructors.md))
makes this a one-liner in the common case of just needing a custom message.

## Adding fields beyond just a message

```kotlin
class InsufficientFundsException(
    val requested: Double,
    val available: Double
) : Exception("Cannot withdraw $requested, only $available available")

try {
    throw InsufficientFundsException(requested = 500.0, available = 200.0)
} catch (e: InsufficientFundsException) {
    println("Short by ${e.requested - e.available}")    // structured data, not just parsing the message string
}
```

Attaching real fields (not just a formatted message) lets calling code react programmatically to
*why* something failed, rather than needing to parse a human-readable string to extract details —
a meaningfully more robust pattern than encoding everything into the exception message alone.

## Choosing what to extend

```kotlin
class ValidationException(message: String) : IllegalArgumentException(message)     // "caller passed bad input"
class ConfigurationException(message: String) : IllegalStateException(message)       // "internal state is wrong"
class NotFoundException(message: String) : RuntimeException(message)                  // a genuinely new category
```

Extending an existing, semantically appropriate exception type (`IllegalArgumentException`,
`IllegalStateException`) rather than always extending the generic `Exception`/`RuntimeException`
lets existing catch blocks written for that broader category still catch your custom type too —
useful when your exception genuinely *is* a more specific case of an existing, well-understood
category, rather than a fully novel kind of failure.

## Exception hierarchies for a domain

```kotlin
sealed class OrderException(message: String) : Exception(message)

class OrderNotFoundException(id: Int) : OrderException("Order $id not found")
class OrderAlreadyShippedException(id: Int) : OrderException("Order $id already shipped, cannot modify")
class InvalidOrderStateException(id: Int, state: String) : OrderException("Order $id in invalid state: $state")
```

```kotlin
fun handleOrderError(e: OrderException) {
    when (e) {
        is OrderNotFoundException -> println("404: ${e.message}")
        is OrderAlreadyShippedException -> println("409: ${e.message}")
        is InvalidOrderStateException -> println("400: ${e.message}")
        // no `else` needed — sealed means the compiler knows this `when` is exhaustive
    }
}
```

Marking the base exception `sealed` (covered in depth in
[Sealed Classes & Interfaces](/study-materials/kotlin/kotlin-idioms/classes-advanced/sealed-classes-and-when)
in the Kotlin Idioms & Advanced Features topic) means a `when` handling every subtype doesn't need
an `else` branch at all — the compiler verifies every possible `OrderException` subtype is
actually handled, and flags it if a new subtype is added later without updating this `when`.

## Preserving the original cause

```kotlin
class DataAccessException(message: String, cause: Throwable) : Exception(message, cause)

try {
    database.query("...")
} catch (e: SQLException) {
    throw DataAccessException("Failed to load user data", e)    // original SQLException preserved as `cause`
}
```

Wrapping a lower-level exception (a raw `SQLException`) in a more meaningful, domain-specific one
is a common and useful pattern — but always pass the original exception as `cause`, not just its
message. This keeps the full original stack trace available for debugging, rather than losing it
the moment it's re-wrapped.
