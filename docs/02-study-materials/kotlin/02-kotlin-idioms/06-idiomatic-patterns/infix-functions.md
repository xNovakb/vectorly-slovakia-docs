---
sidebar_position: 2
title: Infix Functions
---

# Infix Functions

An `infix` function can be called without the dot and parentheses — `a to b` instead of
`a.to(b)` — genuinely improving readability for a narrow class of two-operand operations, and
genuinely overused when reached for beyond that.

## Defining one

```kotlin
infix fun Int.times(str: String): String = str.repeat(this)

val result = 3 times "ab"    // "ababab"
```

Requirements for a function to be `infix`-eligible: it must be a member function or extension
function, take **exactly one** parameter, and have no default value for that parameter.

## The standard library's own infix functions

```kotlin
val pair = "key" to "value"           // Pair("key", "value") — infix `to`
val inRange = 5 in 1..10                // "in" as membership check
val bitwise = 0b1010 and 0b0110           // bitwise AND on Int
```

`to` is the most commonly seen infix function in everyday Kotlin — it's how `mapOf("a" to 1, "b" to
2)` reads as naturally as it does; without `infix`, this would need to be
`mapOf(Pair("a", 1), Pair("b", 2))` or `"a".to(1)`, both noticeably less readable.

## When infix genuinely improves readability

```kotlin
infix fun Duration.after(instant: Instant): Instant = instant.plus(this)

val deadline = 3.days after startDate
```

```kotlin
infix fun String.startsWithIgnoreCase(prefix: String): Boolean =
    this.lowercase().startsWith(prefix.lowercase())

if (filename startsWithIgnoreCase "IMG_") { ... }
```

These read close to natural English — genuinely the sweet spot for infix notation: a binary
operation between two values, where the function name itself reads like a preposition or verb
connecting them.

## When infix notation gets overused

```kotlin
❌ infix fun Order.processWithDiscount(discount: Discount): Order { ... }
   val result = order processWithDiscount discount    // reads awkwardly, not like natural language

✅ fun Order.processWithDiscount(discount: Discount): Order { ... }
   val result = order.processWithDiscount(discount)      // clearer as a normal method call
```

:::note
Infix notation reads well specifically when the function name is short and reads like a natural
connector between two values (`to`, `and`, `after`, `startsWithIgnoreCase`). A longer,
verb-phrase-shaped function name dropping its dot and parentheses usually reads *worse*, not
better — the technique earns its keep on genuinely operator-like or preposition-like functions,
not as a blanket style choice for every two-argument function.
:::

## A realistic custom infix use case: building test assertions

```kotlin
infix fun <T> T.shouldEqual(expected: T) {
    if (this != expected) throw AssertionError("Expected $expected but got $this")
}

result shouldEqual 42
```

This exact pattern — infix functions for assertion-style DSLs — is genuinely common in Kotlin
testing libraries (Kotest's `shouldBe` is the real-world version of this) precisely because
assertion code reading like natural language is a real readability win in test code specifically.

## Infix vs. regular function call — quick guide

```text
Use infix when:
  - Exactly one parameter, no defaults
  - The call reads naturally as "receiver VERB argument" or "receiver PREPOSITION argument"
  - It's genuinely operator-like (to, and, or a small custom DSL vocabulary)

Prefer a regular call when:
  - The function name is a longer phrase or doesn't read as a natural connector
  - Multiple parameters would be needed (infix only ever supports exactly one)
  - Clarity matters more than brevity for an occasional, non-DSL utility function
```
