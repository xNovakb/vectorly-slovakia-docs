---
sidebar_position: 2
title: Inline & Value Classes
---

# Inline & Value Classes

A `value class` wraps a single value in a type-safe wrapper that, in most cases, has **zero
runtime overhead** compared to using the raw underlying type directly — the wrapper exists at
compile time for type safety, but is often erased at runtime.

## The problem this solves

```kotlin
❌ fun transferMoney(fromAccountId: String, toAccountId: String, amount: String) { ... }

transferMoney(amount, toAccountId, fromAccountId)   // compiles fine — arguments swapped, silently wrong
```

Using plain `String` for three semantically different things (two account IDs and an amount)
means the compiler can't catch an argument-order mistake — they're all just `String` as far as the
type system is concerned.

## Wrapping with a value class

```kotlin
@JvmInline
value class AccountId(val value: String)

@JvmInline
value class Money(val cents: Long)

fun transferMoney(fromAccountId: AccountId, toAccountId: AccountId, amount: Money) { ... }
```

```kotlin
transferMoney(amount, toAccountId, fromAccountId)   // ❌ now a COMPILE ERROR — types don't match
transferMoney(fromAccountId, toAccountId, amount)     // ✅ correct, and now enforced by the compiler
```

The exact same argument-order mistake is now caught at compile time, because `AccountId` and
`Money` are distinct types, even though each just wraps a primitive underneath.

## Why "zero overhead" — what actually happens at runtime

```kotlin
@JvmInline
value class AccountId(val value: String)

fun printId(id: AccountId) = println(id.value)
```

In most contexts, the compiler **inlines** the wrapper away entirely — at the bytecode level,
`AccountId` mostly doesn't exist as a separate boxed object; it behaves like the raw `String` was
passed directly. You get the compile-time type safety of a distinct wrapper type, without the
runtime cost (extra allocation, extra indirection) a regular wrapper class would normally have.

:::note
This inlining isn't guaranteed in every single context — value classes used in nullable positions,
as type parameters, or through certain reflection paths *can* still get boxed at runtime, same as
Kotlin's primitive types (`Int`, etc.) can. The zero-overhead property is the common case and the
main motivation, not an absolute, unconditional guarantee for every possible usage.
:::

## When this genuinely helps vs. adds noise

```text
Genuinely helps:
  - IDs that are easy to mix up (UserId vs. OrderId, both wrapping String/Long)
  - Units of measurement (Meters vs. Feet, Cents vs. Dollars) where mixing them is a real bug class
  - Any raw primitive whose MEANING matters more than its representation

Often just noise:
  - A one-off wrapper used in exactly one place, never at risk of being confused with anything else
  - Wrapping something already strongly typed and unambiguous
```

The value proposition is specifically about preventing **mix-ups between similarly-shaped
primitives** — reach for it when that's a real risk in the codebase, not as a reflexive wrapper
around every single primitive value.

## Adding validation or behavior

```kotlin
@JvmInline
value class Email(val address: String) {
    init {
        require(address.contains("@")) { "Invalid email: $address" }
    }

    val domain: String get() = address.substringAfter("@")
}
```

A value class can still have an `init` block (enforcing invariants at construction) and its own
functions/properties — it's a genuine type with behavior, not just a bare type alias. This is the
real distinction from `typealias`, which creates no new type at all, just an alternate name for an
existing one — a `typealias` provides zero type-safety benefit for exactly this argument-mix-up
problem, since the compiler still treats it as the original type underneath.
