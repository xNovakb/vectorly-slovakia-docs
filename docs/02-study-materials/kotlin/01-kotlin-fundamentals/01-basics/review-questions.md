---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [What Is Kotlin](./what-is-kotlin.md) calls null safety "the single most-cited reason teams
  migrate." How does [Null Safety](./null-safety.md)'s `?`/non-null default actually deliver that,
  compared to Java's default where every reference type can silently be null?

  <details>
  <summary>Answer</summary>

  Every Kotlin type is non-null unless explicitly marked `?` — the compiler rejects assigning
  `null` to a non-null type at compile time, turning a whole category of `NullPointerException`
  into a compile error instead of a runtime surprise. Java's opposite default means every
  reference can silently be null unless the developer adds their own discipline to prevent it.
  </details>

- `val list = mutableListOf(1, 2, 3)` followed by `list.add(4)` compiles fine. Per
  [Variables & Types](./variables-and-types.md), why doesn't `val` prevent this, and what does
  `val` actually guarantee?

  <details>
  <summary>Answer</summary>

  `val` only prevents *reassigning* the reference itself (`list = mutableListOf()` would be a
  compile error) — it says nothing about whether the object the reference points to can be
  mutated. `list.add(4)` mutates the underlying `MutableList` object, not the `list` reference,
  so it's completely allowed.
  </details>

- Why does a nullable `Int?` have to be boxed on the JVM while a non-null `Int` usually isn't, per
  [Variables & Types](./variables-and-types.md), and how does that connect to
  [Null Safety](./null-safety.md)'s type-system-level nullability tracking?

  <details>
  <summary>Answer</summary>

  A JVM primitive `int` has no representation for "no value" at all — `null` requires an object
  reference. Since Kotlin's type system tracks nullability precisely, the compiler knows exactly
  when a value could be null (`Int?`) and boxes only those cases, keeping the common non-null case
  as an unboxed primitive for performance.
  </details>

- A local `val` can be smart-cast after a null check, but a mutable class property accessed the
  same way cannot. Using the `Config`/`printValue` example from
  [Null Safety](./null-safety.md), explain why the compiler treats these differently.

  <details>
  <summary>Answer</summary>

  A local `val` cannot change between the null check and its use, so the compiler can safely treat
  it as non-null for the rest of that scope. A mutable property (`var`) could theoretically be
  changed by other code between the check and the use (even on another thread), so the compiler
  can't guarantee it's still non-null — it requires capturing it into a local `val` first.
  </details>

- Why is `!!` described as "almost always a sign the code should be restructured" rather than a
  normal null-safety tool, given what [Null Safety](./null-safety.md) says it actually does at
  runtime?

  <details>
  <summary>Answer</summary>

  `!!` throws exactly the `NullPointerException` Kotlin's whole null-safety system exists to
  prevent, if the value turns out to be null — it's an escape hatch that reintroduces the runtime
  risk the type system was designed to eliminate at compile time, rather than a legitimate way to
  handle nullability.
  </details>

