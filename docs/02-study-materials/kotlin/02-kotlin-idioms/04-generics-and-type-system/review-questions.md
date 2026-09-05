---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- `Box<Dog>` is not automatically treated as a `Box<Animal>` by default, but `ReadOnlyBox<Dog>` is
  treated as a `ReadOnlyBox<Animal>`. Per [Variance: in and out](./variance-in-out.md), what's the
  structural difference between the two classes that makes this safe for one but not the other?

  <details>
  <summary>Answer</summary>

  `Box<T>` is mutable (has a `set`), so allowing `Box<Dog>` to be used as `Box<Animal>` would let
  someone assign a `Cat` into what's actually backed by a `Dog`-only box — a real type-safety hole.
  `ReadOnlyBox<T>` only ever *produces* `T` (declared `out`), never accepts one as input, so there's
  no way to put something unsafe into it — the compiler can safely allow the covariant relationship.
  </details>

- Why does `value is T` fail to compile inside a plain generic function `fun <T> isOfType(value:
  Any): Boolean`, per [Reified Type Parameters](./reified-type-parameters.md), and what two
  keywords together fix it?

  <details>
  <summary>Answer</summary>

  Generic type information is erased at runtime on the JVM — by the time the function actually
  runs, there's no `T` left to check against, only `Any`. Marking the function `inline` and the
  type parameter `reified` fixes it, because an inline function's body is copied into every call
  site at compile time, letting the compiler substitute the real concrete type directly before the
  code ever runs.
  </details>

- Why can `reified` only be used on an `inline` function's type parameter, per
  [Reified Type Parameters](./reified-type-parameters.md) — what would break if it were allowed on
  a normal, non-inlined generic function?

  <details>
  <summary>Answer</summary>

  A normal (non-inline) function is compiled exactly once, generically, with no specific call site
  to substitute a concrete type into — it genuinely has no way to know what `T` will be for every
  future caller. `reified` only works because inlining duplicates the function body at each call
  site, where the actual type argument is already known at compile time.
  </details>

- Java's `List<? extends Animal>` requires the wildcard at every call site; Kotlin's `List<Animal>`
  doesn't need one anywhere. Per [Variance: in and out](./variance-in-out.md), what's the actual
  mechanism difference that eliminates the need for that repetition?

  <details>
  <summary>Answer</summary>

  Kotlin uses declaration-site variance — `out`/`in` is declared once on `List`'s own definition
  (as `out`), so every usage automatically inherits the correct variance behavior. Java uses
  use-site variance, where every caller has to remember to annotate the wildcard themselves at each
  point of use, since the class definition itself carries no variance information.
  </details>

- `fun <T : Comparable<T>> max(a: T, b: T): T` uses `>` inside its body. Per
  [Generics Basics](./generics-basics.md), why would removing the `: Comparable<T>` bound break
  this function, given that `T` is still a valid generic type parameter without it?

  <details>
  <summary>Answer</summary>

  An unconstrained type parameter has no guaranteed operations beyond what `Any` provides, and
  `Any` has no `>` operator. The `Comparable<T>` bound is what guarantees every concrete type
  substituted for `T` actually supports comparison, which is what lets the function body use `>`
  at all — without the bound, the compiler has no basis to allow that operation.
  </details>

