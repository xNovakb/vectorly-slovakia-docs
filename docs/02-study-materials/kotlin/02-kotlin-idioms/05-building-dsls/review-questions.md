---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [DSL Basics](./dsl-basics.md) says a Kotlin DSL is "regular Kotlin code," built from two existing
  language features combined deliberately. What are those two features, and which one alone would
  only get you `repeat3 { println("Hello") }`-style calls without the `text(...)`-inside-`html {
  }` readability?

  <details>
  <summary>Answer</summary>

  Trailing lambda syntax and receiver types (a function type with a receiver, like `Html.() ->
  Unit`). Trailing lambda syntax alone just moves a lambda outside parentheses — it's the receiver
  type specifically that lets `text(...)` be called with no qualifier inside the block, as if the
  code were written directly inside the `Html` class.
  </details>

- `table { row { row { } } }` compiles without `@DslMarker` but shouldn't, per
  [Type-Safe Builders](./type-safe-builders.md). What is the inner `row { }` actually calling, and
  why does the compiler allow it silently?

  <details>
  <summary>Answer</summary>

  It's silently calling the *outer* `Table`'s `row()` function from inside a `Row` block, not
  creating a nested row inside the row. Without a guard, Kotlin's implicit-receiver resolution can
  see both the current `Row` receiver and the outer `Table` receiver simultaneously, so nothing
  stops an inner scope from reaching an outer one with the same-named function.
  </details>

- After adding `@DslMarker` to both `Table` and `Row`, the same nested `row { }` becomes a compile
  error. Per [Type-Safe Builders](./type-safe-builders.md), does this make the outer receiver
  completely unreachable from inside the inner block?

  <details>
  <summary>Answer</summary>

  No — it just requires being explicit about it, via a label like `this@table.row { }`.
  `@DslMarker` restricts *implicit* receiver resolution to only the nearest enclosing receiver in
  the same marker group; the outer receiver is still reachable, just no longer accidentally
  reachable.
  </details>

- `operator fun plus` on `Vector2` and a hypothetical `operator fun Order.plus(discount:
  Discount)` are both valid Kotlin. Per [Operator Overloading](./operator-overloading.md), why is
  the first considered good practice and the second called out as a readability problem?

  <details>
  <summary>Answer</summary>

  `Vector2 + Vector2` reads close to its actual domain meaning (vector addition) — readers bring
  real expectations about what `+` means, and this matches them. `Order + Discount` repurposes the
  `+` symbol for "apply a discount," a meaning with no real conceptual connection to addition —
  `order.applyDiscount(discount)` says the same thing unambiguously, while `order + discount`
  forces the reader to guess.
  </details>

- Why does `grid[3, 4] = 7` actually call a function named `set`, not something named after the
  `[]` syntax itself, per [Operator Overloading](./operator-overloading.md) — and how does this
  connect to how `List`'s own indexing works?

  <details>
  <summary>Answer</summary>

  `[]` is pure syntax sugar over specially-named `operator` functions — `grid[3, 4] = 7` compiles
  to a call to `grid.set(3, 4, 7)`, and reading `grid[3, 4]` compiles to `grid.get(3, 4)`. This is
  exactly the same mechanism `List`/`MutableList` use for their own `[]` support — `operator fun
  get`/`set` are ordinary standard-library functions on those types, not compiler-exclusive magic.
  </details>

