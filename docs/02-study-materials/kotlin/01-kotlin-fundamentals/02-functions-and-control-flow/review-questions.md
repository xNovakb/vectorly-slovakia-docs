---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [Control Flow](./control-flow.md) says Kotlin has no separate ternary operator because `if`
  already produces a value. How does this same "expression, not just statement" idea show up again
  in [Functions Basics](./functions-basics.md)'s single-expression functions?

  <details>
  <summary>Answer</summary>

  A single-expression function (`fun square(x: Int) = x * x`) works because the function body is
  itself just an expression whose value becomes the return value — the exact same principle as
  `val max = if (a > b) a else b`, where a branching construct evaluates to a value instead of
  requiring separate statements to assign into a variable.
  </details>

- A `when` expression used as a value normally requires an `else` branch. Per
  [Control Flow](./control-flow.md), under what condition can that requirement be dropped, and why
  does the compiler allow it?

  <details>
  <summary>Answer</summary>

  It can be dropped when the compiler can prove every case is already covered — the canonical
  example being a `when` over a sealed class hierarchy, where the compiler knows the complete set
  of subtypes and can verify exhaustiveness without a catch-all branch.
  </details>

- `calculate(3, 4) { x, y -> x + y }` and `numbers.forEach { println(it) }` both drop parentheses
  around the lambda argument. Per [Lambdas & Higher-Order Functions](./lambdas-and-higher-order-functions.md),
  why does the second example drop them *entirely* while the first only moves the lambda outside?

  <details>
  <summary>Answer</summary>

  Trailing lambda syntax lets a lambda that's the *last* parameter move outside the parentheses —
  `calculate` still has two other parameters (`3, 4`), so parentheses remain for those. `forEach`
  takes the lambda as its *only* parameter, so once it's moved outside, the parentheses have
  nothing left inside them and can be omitted entirely.
  </details>

- Why does `fun multiplier(factor: Int): (Int) -> Int` returning `{ number -> number * factor }`
  still work correctly after `multiplier` itself has returned, per
  [Lambdas & Higher-Order Functions](./lambdas-and-higher-order-functions.md)?

  <details>
  <summary>Answer</summary>

  The returned lambda is a closure — it captures `factor` from its enclosing scope rather than
  only referencing its own parameters. That captured value stays alive as part of the closure even
  after `multiplier`'s own function call has completed, which is exactly what lets `triple(5)`
  still know `factor` was `3`.
  </details>

- Why does Kotlin have no classic C-style `for (int i = 0; i < n; i++)` loop at all, per
  [Control Flow](./control-flow.md), and how does `numbers.filter(::isEven)` from
  [Lambdas & Higher-Order Functions](./lambdas-and-higher-order-functions.md) reflect the same
  underlying design preference?

  <details>
  <summary>Answer</summary>

  Ranges and iterables cover the same need as a C-style loop without the off-by-one index errors
  a manually-written loop header can introduce — Kotlin favors expressing *what* to iterate over
  rather than *how* to manage an index variable. Function references (`::isEven`) reflect the same
  preference at the function level: passing an existing named function directly rather than
  manually wrapping it in a lambda that just calls it.
  </details>

