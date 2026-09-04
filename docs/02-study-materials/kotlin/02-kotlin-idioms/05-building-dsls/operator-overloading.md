---
sidebar_position: 3
title: Operator Overloading
---

# Operator Overloading

Kotlin lets a class define what standard operators (`+`, `*`, `[]`, `()`, and more) mean for its
own instances, by implementing specially-named functions marked `operator`. Used well, this is
what makes many Kotlin DSLs and value types (like `Money` or `Vector` types) read naturally;
used poorly, it can make code actively harder to understand.

## Arithmetic operators

```kotlin
data class Vector2(val x: Double, val y: Double) {
    operator fun plus(other: Vector2) = Vector2(x + other.x, y + other.y)
    operator fun times(scalar: Double) = Vector2(x * scalar, y * scalar)
}

val a = Vector2(1.0, 2.0)
val b = Vector2(3.0, 4.0)
println(a + b)       // Vector2(x=4.0, y=6.0)
println(a * 2.0)       // Vector2(x=2.0, y=4.0)
```

`operator fun plus` is what `a + b` actually calls under the hood — the `+` is pure syntax sugar
for `a.plus(b)`. Every arithmetic operator (`plus`, `minus`, `times`, `div`, `rem`) follows this
same convention.

## `get` and `set` — for custom indexing

```kotlin
class Grid(private val width: Int, private val height: Int) {
    private val cells = Array(width * height) { 0 }

    operator fun get(x: Int, y: Int): Int = cells[y * width + x]
    operator fun set(x: Int, y: Int, value: Int) { cells[y * width + x] = value }
}

val grid = Grid(10, 10)
grid[3, 4] = 7          // calls set(3, 4, 7)
println(grid[3, 4])      // calls get(3, 4) -> 7
```

This is exactly how `List`/`MutableList`'s own `[]` indexing works internally — `operator fun get`
and `operator fun set` are standard library functions on those types too, not compiler magic
exclusive to built-in collections.

## `invoke` — making an object callable like a function

```kotlin
class Multiplier(val factor: Int) {
    operator fun invoke(value: Int): Int = value * factor
}

val double = Multiplier(2)
println(double(5))    // 10 — calls double.invoke(5)
```

`invoke` lets an *instance* be called with function-call syntax directly — genuinely useful for
building configurable, reusable "function-like" objects, and the exact mechanism behind how a
class can be used as if it were a lambda in certain APIs.

## `contains` — powering the `in` operator

```kotlin
data class DateRange(val start: LocalDate, val end: LocalDate) {
    operator fun contains(date: LocalDate) = date in start..end
}

val range = DateRange(LocalDate.of(2026, 1, 1), LocalDate.of(2026, 12, 31))
println(LocalDate.of(2026, 6, 15) in range)    // true — calls range.contains(...)
```

## When operator overloading aids readability vs. when it doesn't

```kotlin
✅ val total = price1 + price2                 // "+" for two Money values reads naturally
✅ if (userId in allowedIds) { ... }              // "in" for membership reads naturally
✅ matrix[row, col] = value                         // custom indexing reads naturally

❌ operator fun Order.plus(discount: Discount): Order = this.applyDiscount(discount)
   val discounted = order + discount              // "+" for "apply a discount"? not obviously what + means here
```

:::warning
Operator overloading should make code read closer to its actual domain meaning (vector/matrix math,
money arithmetic, range membership) — not repurpose an operator's *symbol* for an operation with no
real conceptual connection to what that symbol conventionally means. `order + discount` is
ambiguous in a way `order.applyDiscount(discount)` simply isn't; readers bring real expectations
about what `+` typically does, and violating that expectation for the sake of "concise-looking"
code is a genuine readability cost, not a stylistic nicety.
:::

## The full list of overloadable operators, briefly

```text
+  -  *  /  %          → plus, minus, times, div, rem
+=  -=  *=  /=  %=       → plusAssign, minusAssign, etc. (for mutable in-place operations)
==  !=                     → equals (usually via data class's auto-generated version)
<  >  <=  >=                 → compareTo
[]                              → get / set
()                                → invoke
in                                  → contains
..                                    → rangeTo
```

Most of these are used far less often than `plus`/`get`/`invoke` in everyday code — knowing they
exist matters more for reading library code that uses them than for reaching for all of them in
your own.
