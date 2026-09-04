---
sidebar_position: 1
title: Parameterized Tests
---

# Parameterized Tests

Running the same test logic against multiple inputs, without copy-pasting the test method once
per input — both JUnit5 and Kotest offer this, in noticeably different styles.

## The problem this solves

```kotlin
❌ @Test
   fun `isEven returns true for 2`() { assertTrue(isEven(2)) }
   @Test
   fun `isEven returns true for 4`() { assertTrue(isEven(4)) }
   @Test
   fun `isEven returns false for 3`() { assertFalse(isEven(3)) }
   // ...and so on, one test method per case
```

Each of these tests the exact same logic with a different input — genuinely repetitive, and a pain
to extend (adding a new case means writing a whole new method).

## JUnit5's `@ParameterizedTest`

```kotlin
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource

@ParameterizedTest
@ValueSource(ints = [2, 4, 6, 8])
fun `isEven returns true for even numbers`(number: Int) {
    assertTrue(isEven(number))
}
```

This one test method runs **four times**, once per value in `@ValueSource` — each run reported
separately in the test output, so a failure on one specific input is immediately identifiable.

## Testing input/expected-output pairs with `@MethodSource`

```kotlin
@ParameterizedTest
@MethodSource("discountCases")
fun `calculates discount correctly`(subtotal: Int, hasLoyalty: Boolean, expected: Int) {
    assertEquals(expected, calculateDiscount(subtotal, hasLoyalty))
}

companion object {
    @JvmStatic
    fun discountCases() = listOf(
        Arguments.of(100, true, 90),     // loyalty discount applied
        Arguments.of(100, false, 100),    // no discount
        Arguments.of(0, true, 0)            // zero subtotal, no discount to apply
    )
}
```

`@MethodSource` supplies a full set of argument tuples rather than single values — the natural
fit when a test needs multiple related inputs (subtotal, loyalty status) mapped to one expected
output per case. `@JvmStatic` is required here since JUnit needs to call this method without an
instance — a Kotlin-specific detail (companion object members aren't truly static on the JVM
without it) worth knowing before hitting a confusing runtime error.

## Kotest's table-driven alternative

```kotlin
import io.kotest.data.forAll
import io.kotest.data.row

class DiscountTest : StringSpec({
    "calculates discount correctly" {
        forAll(
            row(100, true, 90),
            row(100, false, 100),
            row(0, true, 0)
        ) { subtotal, hasLoyalty, expected ->
            calculateDiscount(subtotal, hasLoyalty) shouldBe expected
        }
    }
})
```

Same idea as `@MethodSource`, different syntax — `row(...)` reads as a literal table of test
cases, arguably more visually scannable as an actual table than a list of `Arguments.of(...)`
calls. Which to use often comes down to whether the rest of the codebase already leans on plain
JUnit5 (see [JUnit5 in Kotlin](../01-basics/junit5-in-kotlin.md)) or Kotest's own test-spec style.

## When parameterization is the wrong tool

```kotlin
❌ @ParameterizedTest
   @MethodSource("everyEdgeCaseEverImagined")   // 40 rows covering unrelated behaviors
```

Parameterized tests work best when every case exercises the **same logical behavior** with
different data. If the cases actually test genuinely different behaviors (not just different
inputs to one behavior), separate, clearly-named test methods communicate intent better than one
sprawling parameterized test whose 40 rows blur together in a report.

## Generating inputs instead of hand-listing them

For cases where hand-picking specific inputs isn't enough — wanting to check a property holds
across a *wide range* of inputs, not just a handful chosen by hand — see
[Property-Based Testing with Kotest](./property-based-testing-with-kotest.md), a genuinely
different approach to the same general problem.
