---
sidebar_position: 1
title: Sealed Classes & when
---

# Sealed Classes & when

A **sealed class** (or `sealed interface`) restricts a type hierarchy to a known, closed set of
subtypes — every possible subtype must be declared in the same file or module. This is one of the
most genuinely useful Kotlin idioms for modeling "one of these specific things, and nothing else."

## Defining a sealed hierarchy

```kotlin
sealed class ApiResult<out T>
data class Success<T>(val data: T) : ApiResult<T>()
data class Error(val message: String, val code: Int) : ApiResult<Nothing>()
object Loading : ApiResult<Nothing>()
```

This models exactly three possible states for an API call's result — nothing else can extend
`ApiResult` from outside this file, unlike a regular open class which anyone, anywhere, could
subclass.

## Exhaustive `when` — the real payoff

```kotlin
fun render(result: ApiResult<User>) = when (result) {
    is Success -> showUser(result.data)
    is Error -> showError(result.message)
    is Loading -> showSpinner()
    // no `else` branch needed — the compiler knows these are the ONLY possible subtypes
}
```

Because the compiler knows the **complete** set of subtypes, a `when` expression over a sealed
class doesn't need an `else` branch to be exhaustive — and critically, if a new subtype is added
to the hierarchy later, **every** `when` block matching on it fails to compile until updated for
the new case.

:::note
This compile-time exhaustiveness check is the actual value sealed classes provide over a regular
open class or an enum with a manually-checked type field. Adding a new case to a regular class
hierarchy silently compiles fine everywhere that forgot to handle it — a runtime bug waiting to
happen. A sealed class turns that same mistake into a compile error, at every call site that needs
updating.
:::

## Sealed class vs. enum — genuinely different tools

```kotlin
enum class Direction { NORTH, SOUTH, EAST, WEST }    // fixed set of simple, stateless values

sealed class NetworkState {
    object Connected : NetworkState()
    data class Disconnected(val reason: String) : NetworkState()   // carries data!
}
```

An `enum` entry can't hold different data shapes per case — every entry is structurally identical.
A sealed class subtype can be a `data class` carrying its own distinct fields (like `Error`'s
`message`/`code` above), an `object` for a stateless singleton case, or even another `sealed
class` nested further. Use an enum for a genuinely fixed set of interchangeable constants; use a
sealed class when different cases need to carry meaningfully different data.

## `sealed interface` — the same idea, interface-shaped

```kotlin
sealed interface Shape
data class Circle(val radius: Double) : Shape
data class Rectangle(val width: Double, val height: Double) : Shape
```

Useful when the restricted hierarchy needs to also implement another interface, or when multiple
sealed hierarchies need to share a common subtype (a class can implement multiple interfaces, but
only extend one class) — otherwise `sealed class` and `sealed interface` accomplish the same
exhaustiveness guarantee.

## A realistic use case: modeling UI state

```kotlin
sealed class ScreenState {
    object Loading : ScreenState()
    data class Content(val items: List<Item>) : ScreenState()
    data class Error(val throwable: Throwable) : ScreenState()
    object Empty : ScreenState()
}

fun render(state: ScreenState) = when (state) {
    is ScreenState.Loading -> showSpinner()
    is ScreenState.Content -> if (state.items.isEmpty()) showEmpty() else showList(state.items)
    is ScreenState.Error -> showError(state.throwable)
    is ScreenState.Empty -> showEmpty()
}
```

This exact pattern — a sealed class modeling every possible screen/API/parse state, matched
exhaustively — is one of the highest-value idioms in everyday Kotlin, precisely because it makes
"forgot to handle a case" a compile-time error instead of a bug found in production.

See [Inline & Value Classes](./inline-value-classes.md) for a different, complementary use of
Kotlin's type system — zero-overhead type-safe wrappers rather than restricted hierarchies.
