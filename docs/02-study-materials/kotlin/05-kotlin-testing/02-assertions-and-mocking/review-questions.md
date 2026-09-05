---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- Mocking a plain Kotlin class with Mockito either fails outright or needs an extra plugin, while
  MockK handles it with no extra configuration. Per [MockK Basics](./mockk-basics.md), what
  Kotlin-specific fact about classes causes this friction for Mockito specifically?

  <details>
  <summary>Answer</summary>

  Kotlin classes and functions are final by default, but most mocking libraries (Mockito included)
  historically work by generating a runtime subclass of the mocked class — which requires the class
  to be open. MockK is built specifically to mock final classes natively, since it was designed
  for Kotlin's actual defaults rather than adapted from a Java-first tool that assumed classes are
  open unless marked otherwise.
  </details>

- `every { userRepository.findById(1) } returns User(...)` and `verify { emailService.sendConfirmation(userId
  = 1) }` are both MockK calls but check fundamentally different things. Per
  [Stubbing & Verifying with MockK](./stubbing-and-verifying-with-mockk.md), what's the actual
  distinction between what `every` and `verify` each do?

  <details>
  <summary>Answer</summary>

  `every` stubs what a mock's method should *return* when called — setting up behavior before the
  code under test runs. `verify` asserts that a specific interaction *actually happened* after the
  code under test ran — confirming behavior, not configuring it. A `Unit`-returning function like
  sending an email has nothing meaningful to stub with `every`, but can still be verified with
  `verify`.
  </details>

- A relaxed mock silently returns a default value for an unstubbed method call instead of throwing.
  Per [Stubbing & Verifying with MockK](./stubbing-and-verifying-with-mockk.md), what specific kind
  of bug can this mask that a strict mock would catch immediately?

  <details>
  <summary>Answer</summary>

  Code with a typo that calls a different, similarly-named method than the one intended won't be
  caught by a relaxed mock — the wrong call just silently succeeds with a default return value. A
  strict mock throws immediately on any unstubbed call, which would surface that exact mistake
  right away instead of letting it pass unnoticed.
  </details>

- `result shouldBe 5` and `assertEquals(5, result)` check the same thing. Per
  [Kotest Assertions](./kotest-assertions.md), what's the practical readability risk specifically
  associated with the JUnit form's argument order that the Kotest form avoids structurally?

  <details>
  <summary>Answer</summary>

  `assertEquals(expected, actual)` has a specific, easy-to-get-backwards argument order — swapping
  them still compiles and often still passes when the assertion succeeds, but produces a confusing
  "expected X but was Y" message reversed from reality when it fails. `result shouldBe 5` reads
  left-to-right as a natural sentence, with the value being checked always on the left, structurally
  removing the argument-order ambiguity.
  </details>

- `assertSoftly { user.name shouldBe "Jane"; user.email shouldBe "jane@example.com"; user.isActive
  shouldBe true }` is used instead of three separate plain assertions in sequence. Per
  [Kotest Assertions](./kotest-assertions.md), what does this change about what a single test run
  reveals when more than one of those checks actually fails?

  <details>
  <summary>Answer</summary>

  A normal test stops at the first failed assertion — later assertions in the same test never even
  run, so only one problem surfaces per run. `assertSoftly` runs every assertion in the block
  regardless of earlier failures and reports all of them together, so a single test run reveals
  every actual problem at once instead of requiring several rounds of fix-and-rerun to discover
  each one in turn.
  </details>

