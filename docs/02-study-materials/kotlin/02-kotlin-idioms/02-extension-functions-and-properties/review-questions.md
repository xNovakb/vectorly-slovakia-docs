---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- In the `Animal`/`Dog` example from [Extension Functions](./extension-functions.md), `val animal:
  Animal = Dog()` followed by `animal.speak()` prints `"..."` instead of `"Woof!"`. Why doesn't
  this behave like normal polymorphism?

  <details>
  <summary>Answer</summary>

  Extension functions are resolved based on the variable's declared (static) type at compile time,
  not the object's actual runtime type — `animal` is declared as `Animal`, so `Animal.speak()`
  gets called regardless of what the object actually is underneath. A real member-function override
  would use dynamic dispatch and correctly call `Dog`'s version; extensions don't participate in
  that mechanism at all.
  </details>

- `var String.customTag: String = ""` fails to compile. Per
  [Extension Properties](./extension-properties.md), what's the structural reason, and how does
  the `StringBuilder.lastChar` mutable extension property example get around it?

  <details>
  <summary>Answer</summary>

  Extension properties have no backing field — there's nowhere on the original class for that
  storage to live, since you're not actually modifying its memory layout. The `StringBuilder`
  example works because its setter mutates the *receiver's own existing mutable state* (the
  character buffer `StringBuilder` already provides) rather than trying to store a new field on
  the extension itself.
  </details>

- `String.() -> Unit` and `(String) -> Unit` both eventually work with a `String`. Per
  [Scoped Extensions & Receivers](./scoped-extensions-and-receivers.md), what's the concrete
  difference in how you'd write code inside a lambda of each type?

  <details>
  <summary>Answer</summary>

  With `(String) -> Unit`, the string is an ordinary parameter — you'd reference it explicitly
  (`it.length`, or a named parameter). With `String.() -> Unit`, the string is bound as `this`
  inside the lambda, so you can call its members directly with no qualifier at all (`length`
  instead of `it.length`) — exactly the mechanism that makes `apply`-style configuration blocks
  read the way they do.
  </details>

- [Scoped Extensions & Receivers](./scoped-extensions-and-receivers.md) says its `myApply` example
  is "approximately the real standard library implementation of `apply`." What specifically makes
  that true?

  <details>
  <summary>Answer</summary>

  `myApply`'s parameter type `block: T.() -> Unit` means the lambda passed to it runs with `this`
  bound to the receiver `T` — exactly why, inside a real `apply { }` block, you can reference the
  receiver's own members directly without a qualifier. The real `apply` in the standard library
  uses this identical function-type-with-receiver mechanism.
  </details>

- When should you reach for an extension function instead of adding a real member function to a
  class, per [Extension Functions](./extension-functions.md) — and which of those criteria rules
  extensions out for something needing private-state access?

  <details>
  <summary>Answer</summary>

  Extensions fit when you don't own the class, the function is a pure self-contained operation, or
  you want to add utility behavior without bloating the original class. A real member function is
  the right fit instead when the function needs polymorphic (overridable) behavior or needs access
  to the class's private members — an extension function has no access to a class's private state
  at all, since it isn't actually part of the class.
  </details>

