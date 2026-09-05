---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [Kotlin/Java Interop](./kotlin-java-interop.md) says calling between Kotlin and Java is
  "genuinely seamless, not a compatibility shim." What single fact about both languages makes that
  true, rather than needing an adapter layer?

  <details>
  <summary>Answer</summary>

  Both Kotlin and Java compile down to the same JVM bytecode — at runtime there's no meaningful
  difference between a class that started as Kotlin source and one that started as Java source, so
  calling between them is just normal bytecode-level method calls, with no translation layer
  needed.
  </details>

- A Java method with no nullability annotations returns a value Kotlin can't verify is non-null.
  Per [Platform Types & Java Interop](./platform-types-and-java-interop.md), what type does Kotlin
  infer, and why does treating it as non-null carry real risk?

  <details>
  <summary>Answer</summary>

  Kotlin infers a platform type (shown as `String!` in tooling) — it genuinely doesn't know
  whether the value can be null, since unannotated Java carries no nullability information at all.
  Treating it as non-null trusts the caller's judgment with no compiler backup; if that judgment is
  wrong, it throws exactly the `NullPointerException` Kotlin's null-safety system otherwise
  prevents at compile time.
  </details>

- Why does a Kotlin function with a default parameter need `@JvmOverloads` to be callable from Java
  with fewer arguments, per [Kotlin/Java Interop](./kotlin-java-interop.md), when
  [Functions Basics](../02-functions-and-control-flow/functions-basics.md) shows default parameters
  working fine from Kotlin without any extra annotation?

  <details>
  <summary>Answer</summary>

  Default parameters are a purely Kotlin-compiler feature — Kotlin callers can omit them because
  the Kotlin compiler itself fills in the default at the call site. Java has no concept of default
  parameters at all, so without `@JvmOverloads` generating actual overloaded methods, Java code
  would be forced to always pass every parameter explicitly.
  </details>

- [Gradle & Kotlin Projects](./gradle-and-kotlin-projects.md) distinguishes `implementation` from
  `api` dependency configurations. For a typical application (not a library other projects depend
  on), why does that distinction "rarely matter in practice"?

  <details>
  <summary>Answer</summary>

  The difference only matters for what gets exposed to something else's compile-time classpath
  when *your* project is itself a dependency of another project — an application isn't consumed as
  a library by anyone else, so there's no downstream classpath for `api`'s wider exposure to
  actually affect; `implementation` covers the application's own needs either way.
  </details>

- A Kotlin project's build script is a `build.gradle.kts` file rather than a Groovy
  `build.gradle`. Per [Gradle & Kotlin Projects](./gradle-and-kotlin-projects.md), what concrete
  IDE benefit does that specifically bring, and why does it exist only because the project is
  already a Kotlin project?

  <details>
  <summary>Answer</summary>

  Because the build script is itself written in Kotlin, it gets the same IDE support (autocomplete,
  type checking) as the application code — a benefit that only makes sense in a Kotlin project
  precisely because the tooling that understands Kotlin syntax is already present and configured
  for the rest of the codebase.
  </details>

