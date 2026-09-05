---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- `class User(val name: String, val email: String)` and `data class User(val name: String, val
  email: String)` look almost identical. Per [Data Classes](./data-classes.md), what specifically
  does the second one generate that the first doesn't, and why does that matter for `user1 ==
  user2`?

  <details>
  <summary>Answer</summary>

  The `data` modifier auto-generates `equals()`, `hashCode()`, `toString()`, `copy()`, and
  `componentN()` functions based on the constructor properties. Without `data`, `==` on the plain
  class falls back to reference-identity equality, so two instances with identical field values
  would compare as `false`; with `data`, `equals()` compares actual property values, so they
  compare as `true`.
  </details>

- Why does [Classes & Constructors](./classes-and-constructors.md) say a constructor parameter
  without `val`/`var` is "not a property," and what actually breaks if you try to access it from
  outside an `init` block or method?

  <details>
  <summary>Answer</summary>

  Without `val`/`var`, the parameter is just a regular constructor argument scoped to the
  constructor/`init` logic itself — it isn't stored as a field on the instance at all, so there's
  nothing to access afterward. Something like `Logger(prefix)`'s `prefix` has to be explicitly
  captured into a real property (like `fullPrefix`) if it needs to survive past construction.
  </details>

- A factory function in a companion object can return `null` on invalid input; a regular
  constructor cannot. Per [Objects & Companion Objects](./objects-and-companion-objects.md), why
  is this the concrete reason to reach for `private constructor` + companion factory instead of a
  plain public constructor?

  <details>
  <summary>Answer</summary>

  A constructor is structurally required to either fully construct an instance or throw — it has
  no way to signal "this input was invalid, here's `null` instead." A companion-object factory
  function is just an ordinary function, free to return `null`, a cached instance, or even a
  different subtype based on the arguments, which a constructor's fixed contract can't express.
  </details>

- Why does [Data Classes](./data-classes.md) recommend a sealed class hierarchy over trying to
  extend a data class for a family of related types, tying back to what
  [Classes & Constructors](./classes-and-constructors.md) says about custom `equals` semantics?

  <details>
  <summary>Answer</summary>

  A data class's generated `equals()`/`hashCode()` are based on its own declared properties —
  inheriting that generated equality across a class hierarchy tends to produce confusing,
  easy-to-get-wrong comparisons (e.g. a subclass adding fields that the parent's generated
  `equals()` doesn't know about). A sealed hierarchy models "one of several related types" without
  relying on inherited data-class equality at all.
  </details>

- `AppConfig.printInfo()` (an `object` declaration) and `User.create(...)` (a companion object
  factory) are both called without an explicit `new`/constructor call. Per
  [Objects & Companion Objects](./objects-and-companion-objects.md), what's the actual difference
  between what each one represents?

  <details>
  <summary>Answer</summary>

  `AppConfig` is a standalone singleton — there's exactly one `AppConfig` instance ever, not tied
  to any other class. `User.create` is a member of a companion object *associated with* the `User`
  class specifically — it's Kotlin's closest equivalent to a Java static method, existing to
  provide class-level functionality (factories, constants) for `User`, not a singleton in its own
  right.
  </details>

