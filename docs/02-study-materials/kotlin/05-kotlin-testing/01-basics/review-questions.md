---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A test named `` `should return 404 when user not found` `` reads clearly in a CI failure report,
  while `shouldReturn404WhenUserNotFound` requires mentally parsing camelCase. Per
  [Kotlin-Specific Test Idioms](./kotlin-specific-test-idioms.md), what Kotlin language feature
  makes the first form possible, and why is this convention scoped specifically to test code?

  <details>
  <summary>Answer</summary>

  Backtick-quoted function names, a genuine Kotlin language feature allowing spaces and
  punctuation in identifiers when wrapped in backticks. It's scoped to tests because the "function
  name" there is really a human-readable spec read by people, not an API called by name from other
  code — the same convention in regular application code would be a readability regression, and
  backtick names can't be called normally from Java interop code at all.
  </details>

- `@Nested inner class WhenCartHasItems` requires the Kotlin `inner` modifier specifically, not
  just a plain nested class. Per [JUnit5 in Kotlin](./junit5-in-kotlin.md), what would break
  without `inner`?

  <details>
  <summary>Answer</summary>

  A plain (non-`inner`) nested class in Kotlin can't access members of its enclosing class instance
  — `inner` is what gives the nested test class a reference to the outer class's instance, which
  `@Nested` test classes commonly need (shared setup state, fields from the outer test class).
  Without `inner`, the nested class would have no access to that outer context at all.
  </details>

- Given/When/Then is described as "purely a comment/naming convention," not a JUnit feature. Per
  [Test Organization](./test-organization.md), what's the actual practical value it provides if no
  library or annotation enforces it?

  <details>
  <summary>Answer</summary>

  It forces a consistent shape onto every test — set up state, perform one action, assert the
  outcome — which makes an unfamiliar test fast to parse, and makes a test doing too much (multiple
  distinct "whens") visually obvious to the person reading or reviewing it, even though nothing
  technically checks or enforces the structure.
  </details>

- `data class Point(val x: Int, val y: Int)` used in `assertEquals(Point(4, 6), result)` produces
  a failure message showing both objects' actual field values. Per
  [Kotlin-Specific Test Idioms](./kotlin-specific-test-idioms.md), why does this work automatically
  for a data class but wouldn't for a plain class with no custom `equals()`/`toString()`?

  <details>
  <summary>Answer</summary>

  A data class auto-generates structural `equals()` (comparing actual field values, not reference
  identity) and a real `toString()` showing field values — a plain class without these would
  compare by reference identity (always failing unless it's literally the same instance) and print
  an opaque reference like `Point@1a2b3c4d` in the failure message, revealing nothing about which
  field actually differs.
  </details>

- Splitting `./gradlew test` from `./gradlew integrationTest` into separate Gradle source
  sets/tasks is described as applying a CI/CD principle to a Kotlin project specifically. Per
  [Test Organization](./test-organization.md), what's the actual benefit of running these on
  different triggers rather than always running both together?

  <details>
  <summary>Answer</summary>

  Fast unit tests can run on every single change (immediate feedback), while slower integration
  tests run less frequently — running the full slow suite on every change would be impractical at
  the same cadence as the fast suite. Separating them structurally at the Gradle level is what
  makes it possible to actually trigger them differently in CI, not just a naming preference.
  </details>

