---
sidebar_position: 1
title: Kotest Assertions
---

# Kotest Assertions

[Kotest](https://kotest.io/) provides a fluent, Kotlin-idiomatic assertion library — usable on its
own with plain JUnit5 test classes, even without adopting Kotest's own test-runner style.

## Fluent matchers vs. plain JUnit assertions

```kotlin
// Plain JUnit
assertEquals(5, result)
assertTrue(list.contains("apple"))
assertTrue(text.startsWith("Hello"))

// Kotest
result shouldBe 5
list shouldContain "apple"
text shouldStartWith "Hello"
```

`shouldBe` reads left-to-right as a natural sentence — "result should be 5" — using Kotlin's infix
function syntax (see the Kotlin Idioms topic's coverage of infix functions) rather than a
`assertX(expected, actual)` call where the argument order is easy to get backwards.

## Common matchers

```kotlin
result shouldBe expected
result shouldNotBe unexpected

list shouldContain "apple"
list shouldHaveSize 3
list shouldBeEmpty()

text shouldStartWith "Hello"
text shouldContain "world"
text shouldMatch Regex("[a-z]+")

number shouldBeGreaterThan 0
number shouldBeInRange 1..100

nullableValue shouldNotBeNull()
nullableValue.shouldBeNull()
```

## Exception assertions

```kotlin
val exception = shouldThrow<IllegalArgumentException> {
    validateAge(-1)
}
exception.message shouldBe "Age cannot be negative"
```

Similar shape to JUnit5's `assertThrows`, but returns the caught exception directly for further
assertions on it — chaining a message check onto the same expression rather than needing a
separate `assertEquals` afterward.

## Why the failure messages are the real payoff

```text title="Plain JUnit failure"
org.opentest4j.AssertionFailedError:
Expected :5
Actual   :4

title="Kotest failure"
io.kotest.assertions.AssertionFailedError:
expected: 5 but was: 4
```

For simple cases the difference is minor, but Kotest's matchers scale better for structured data:

```kotlin
user shouldBe User(id = 1, name = "Jane", email = "jane@example.com")
```

```text title="Kotest's structural diff on failure"
expected: User(id=1, name="Jane", email="jane@example.com")
but was:  User(id=1, name="Jane", email="jane@wrong.com")

Field differences:
  email: expected "jane@example.com" but was "jane@wrong.com"
```

Pinpointing exactly *which field* differs (rather than just printing both full objects and making
you compare them by eye) is a genuinely practical time-saver once test data gets more complex than
a single primitive value.

## Soft assertions — collecting multiple failures at once

```kotlin
assertSoftly {
    user.name shouldBe "Jane"
    user.email shouldBe "jane@example.com"
    user.isActive shouldBe true
}
```

Normally, a test stops at the **first** failed assertion — later assertions in the same test never
even run, so a single test run only ever reveals one problem at a time. `assertSoftly` runs every
assertion inside the block regardless of earlier failures, and reports **all** failures together —
useful when checking several independent fields of one object, so a single test run surfaces every
actual problem instead of requiring several rounds of "fix one, rerun, find the next."

## Using Kotest matchers with plain JUnit5

```kotlin
import org.junit.jupiter.api.Test
import io.kotest.matchers.shouldBe

class CalculatorTest {
    @Test
    fun `adds two numbers`() {
        Calculator().add(2, 3) shouldBe 5   // Kotest matcher, plain JUnit5 test runner
    }
}
```

The matcher library and the test runner are genuinely separate concerns — a project can adopt
Kotest's assertions without switching its whole test framework away from JUnit5, a low-friction way
to try it incrementally.
