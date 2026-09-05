---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- `val (x, y) = point` works for a `data class Point` with zero extra code. Per
  [Destructuring Declarations](./destructuring-declarations.md), what does `data class`
  automatically generate that makes this possible, and why does the same syntax fail on a plain
  (non-`data`) class?

  <details>
  <summary>Answer</summary>

  `data class` auto-generates `component1()`, `component2()`, etc. — one per constructor property
  — and destructuring is really just sugar for calling those in sequence. A plain class has no
  `componentN()` functions generated for it at all, so there's nothing for the destructuring syntax
  to call; it only works if those operator functions are defined, by hand or by `data`.
  </details>

- A `data class User(val name: String, val email: String)` has its constructor parameters
  reordered later to `(val email: String, val name: String)`. Per
  [Destructuring Declarations](./destructuring-declarations.md)'s warning, why does `val (name,
  email) = user` fail *silently* rather than with a compile error?

  <details>
  <summary>Answer</summary>

  Destructuring matches `componentN()` functions purely by position, not by the variable names used
  at the destructuring site — `name` and `email` are still both `String`, so the types still match
  after reordering. The compiler has no way to know the destructured variable names were meant to
  correspond to specific property names, so it happily compiles code that now silently swaps the
  two values.
  </details>

- `3 times "ab"` and `order processWithDiscount discount` are both syntactically valid infix
  calls. Per [Infix Functions](./infix-functions.md), why is the first considered a good use of
  `infix` and the second called out as overuse?

  <details>
  <summary>Answer</summary>

  `times` reads like a natural connector between two values ("3 times ab"), the sweet spot for
  infix notation. `processWithDiscount` is a longer verb-phrase name that doesn't read as a natural
  preposition or short verb connecting receiver and argument — dropping the dot and parentheses
  here makes the call read awkwardly rather than more naturally, the opposite of infix's intended
  benefit.
  </details>

- Why must every `infix`-eligible function take **exactly one** parameter with no default value,
  per [Infix Functions](./infix-functions.md), and how does this rule out ever writing `order
  processWithDiscount discount andTax taxRate` as a single infix chain?

  <details>
  <summary>Answer</summary>

  Infix notation's whole syntax (`receiver functionName argument`) only has room for one argument
  positionally — there's no syntactic slot for a second parameter or for skipping a defaulted one.
  A function needing multiple parameters structurally can't be `infix` at all, which is exactly why
  a multi-argument operation has to fall back to regular dot-and-parentheses call syntax.
  </details>

- `File(...).bufferedReader().use { ... }` and manually calling `.close()` at the end of a
  function both aim to release a resource. Per
  [The Standard Library You Should Know](./the-standard-library-you-should-know.md), what specific
  failure mode does `use` protect against that manual `.close()` doesn't?

  <details>
  <summary>Answer</summary>

  `use` calls `.close()` automatically once the block finishes, including when the block throws an
  exception partway through. A manual `.close()` placed at the end of a function is simply never
  reached if an exception is thrown or the function returns early somewhere before that line,
  silently leaking the resource — `use` guarantees cleanup regardless of how the block exits.
  </details>

