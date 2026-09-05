---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- `@ParameterizedTest @ValueSource(ints = [2, 4, 6, 8])` and `checkAll<List<Int>> { ... }` both
  reduce test-writing repetition, but represent genuinely different testing philosophies. Per
  [Parameterized Tests](./parameterized-tests.md) and
  [Property-Based Testing with Kotest](./property-based-testing-with-kotest.md), what's the
  fundamental difference in *where the inputs come from*?

  <details>
  <summary>Answer</summary>

  Parameterized tests run the same logic against inputs the author explicitly hand-picked and
  listed. Property-based testing generates potentially hundreds of random inputs automatically,
  checking that a general property holds across all of them — catching edge cases (an empty list,
  very large values) a human might never have thought to hand-pick.
  </details>

- A property-based test on `list.reversed().reversed() shouldBe list` fails on a large, unwieldy
  randomly-generated input. Per [Property-Based Testing with Kotest](./property-based-testing-with-kotest.md),
  what does Kotest do automatically that makes debugging this failure more tractable?

  <details>
  <summary>Answer</summary>

  Kotest shrinks the failing case — it automatically searches for a smaller, simpler input that
  still triggers the same failure, rather than leaving the developer to debug against the original
  large, complex generated case. Debugging a 2-element failing case is far more tractable than
  debugging one with a large arbitrary list.
  </details>

- `checkAll(Arb.int(1..100)) { number -> isValidAge(number) shouldBe true }` restricts the
  generator's range instead of using Kotest's fully generic default `Int` generator. Per
  [Property-Based Testing with Kotest](./property-based-testing-with-kotest.md), why would using
  the unrestricted default generator here actually be the wrong choice?

  <details>
  <summary>Answer</summary>

  The unrestricted default generator would produce values across the entire `Int` range, including
  negative numbers and values far outside anything a real age could be — testing "is this a valid
  age" against inputs that aren't realistic ages at all doesn't actually test the intended logic
  meaningfully. `Arb.int(1..100)` constrains generation to realistic-looking inputs specifically
  relevant to what's being tested.
  </details>

- `userFixture(isActive = false)` is preferred over constructing a full `User(...)` with every
  field specified inline. Per [Test Fixtures & Builders](./test-fixtures-and-builders.md), what
  does the fixture version communicate to a reader that the fully-inline version doesn't?

  <details>
  <summary>Answer</summary>

  It communicates that `isActive = false` is the one fact that actually matters to this specific
  test — every other field takes an unremarkable, sensible default the reader doesn't need to
  mentally filter out. A fully-inline construction with every field specified obscures which
  field is actually relevant to the behavior under test among all the unrelated noise.
  </details>

- Test fixture functions are placed under `src/test/kotlin/.../fixtures/` rather than
  `src/main/kotlin/`. Per [Test Fixtures & Builders](./test-fixtures-and-builders.md), why does
  this placement matter beyond simple organizational tidiness?

  <details>
  <summary>Answer</summary>

  Fixtures exist purely to make test-writing convenient and have no reason to ship as part of the
  actual production build — placing them in the test source set specifically (rather than main)
  keeps test-only code from leaking into the production artifact at all, not just keeping the
  codebase tidy.
  </details>

