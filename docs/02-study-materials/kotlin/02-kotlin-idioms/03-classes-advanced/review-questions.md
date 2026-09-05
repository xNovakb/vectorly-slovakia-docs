---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A `when` over a `sealed class` doesn't need an `else` branch; a `when` over a plain `open class`
  hierarchy does. Per [Sealed Classes & when](./sealed-classes-and-when.md), why can the compiler
  make that exception specifically for sealed hierarchies?

  <details>
  <summary>Answer</summary>

  A sealed class restricts its subtypes to a known, closed set declared in the same file or module
  — the compiler can enumerate every possible subtype at compile time and verify a `when` handles
  all of them. A regular open class can be subclassed from anywhere, so the compiler has no way to
  know the complete set of possibilities and can't offer the same exhaustiveness guarantee.
  </details>

- `AccountId` and `Money` are both `@JvmInline value class` wrappers around primitives. Per
  [Inline & Value Classes](./inline-value-classes.md), why does wrapping them this way catch an
  argument-order mistake that using plain `String`/`Long` wouldn't, and at what point is that
  mistake caught?

  <details>
  <summary>Answer</summary>

  Even though `AccountId` and `Money` each just wrap a primitive underneath, they're genuinely
  distinct types to the compiler — passing a `Money` where an `AccountId` is expected becomes a
  type mismatch. This is caught at **compile time**, before the code ever runs, unlike a plain
  `String` mix-up which compiles fine and only shows up as a bug in behavior (or not at all,
  silently).
  </details>

- Why does `LoudDog(private val dog: SoundMaker) : SoundMaker by dog` not need to write `override
  fun makeSound() = dog.makeSound()` itself, per [Delegation](./delegation.md), and how does this
  relate to "composition over inheritance"?

  <details>
  <summary>Answer</summary>

  The `by dog` clause tells the compiler to auto-generate forwarding implementations for every
  method on `SoundMaker`, delegating to `dog`. This is composition (`LoudDog` *has* a `SoundMaker`,
  isn't a subclass of one) made as ergonomic as inheritance would have been, without inheriting
  from `Dog` at all and without hand-writing the forwarding boilerplate.
  </details>

- `val expensiveValue: String by lazy { ... }` and `var tracked: Int by LoggingDelegate(0)` both
  use the `by` keyword for property delegation. Per [Delegation](./delegation.md), what convention
  does a custom delegate class need to follow to work this way, and is `by lazy` special
  compiler-supported syntax or just an ordinary implementation of that convention?

  <details>
  <summary>Answer</summary>

  A delegate class needs to implement `operator fun getValue(...)` (and `setValue` for a `var`)
  following the specific shape shown in the `LoggingDelegate` example. `by lazy` isn't special
  compiler magic — it's simply the standard library's own implementation of that same
  `getValue`/`setValue` convention, meaning any class following the convention can serve as a
  property delegate, not just the built-in ones.
  </details>

- Both [Sealed Classes & when](./sealed-classes-and-when.md) and
  [Inline & Value Classes](./inline-value-classes.md) are about the type system catching mistakes
  at compile time rather than at runtime. What's the actual difference in *what kind* of mistake
  each one is designed to catch?

  <details>
  <summary>Answer</summary>

  Sealed classes catch "forgot to handle a case" — a `when` block that doesn't account for every
  possible subtype fails to compile. Value classes catch "mixed up two semantically different
  values of the same underlying primitive type" — passing an `AccountId` where a `Money` is
  expected fails to compile, even though both are just wrapping a primitive underneath. Different
  bug classes, same underlying strategy of using the type system to convert a runtime bug into a
  compile error.
  </details>

