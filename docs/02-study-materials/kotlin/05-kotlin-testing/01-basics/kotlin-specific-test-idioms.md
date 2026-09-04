---
sidebar_position: 2
title: Kotlin-Specific Test Idioms
---

# Kotlin-Specific Test Idioms

A few patterns that aren't Kotlin *requirements*, but consistently make test code more readable —
worth adopting deliberately rather than writing Kotlin tests the way you'd write Java ones.

## Backtick-quoted test names

```kotlin
❌ @Test
   fun shouldReturn404WhenUserNotFound() { ... }

✅ @Test
   fun `should return 404 when user not found`() { ... }
```

Kotlin allows function names containing spaces and punctuation when wrapped in backticks — a
genuine language feature, not a testing-library trick. For test functions specifically, this
means the test name can be a **plain-English sentence** describing the behavior under test,
instead of a camelCase approximation of one. The payoff shows up directly in test failure reports:

```text
❌ CalculatorTest > shouldReturnZeroWhenBothInputsAreZero() FAILED
✅ CalculatorTest > `should return zero when both inputs are zero`() FAILED
```

The second one is readable at a glance by someone who's never seen the test before — exactly the
person who benefits most, reading a CI failure notification at 2am.

:::note
This is specific to **test** code — backtick function names in regular application code are
usually a readability regression, not an improvement (and can't be called normally from Java
interop code at all). The convention is deliberately scoped to tests, where the "function name" is
really a human-readable spec, not an API other code calls by name.
:::

## Data classes as test fixtures

```kotlin
data class UserFixture(
    val id: Long = 1,
    val name: String = "Jane Doe",
    val email: String = "jane@example.com",
    val isActive: Boolean = true
)

@Test
fun `inactive users cannot log in`() {
    val user = UserFixture(isActive = false)
    assertFalse(loginService.canLogIn(user))
}
```

A `data class` with sensible defaults for every field (see
[Test Fixtures & Builders](../03-property-based-and-parameterized-testing/test-fixtures-and-builders.md)
for this pattern in more depth) lets each test override **only the field it actually cares about**
— `UserFixture(isActive = false)` reads as "a normal user, except inactive," which is exactly the
intent of that specific test, without repeating every unrelated field's value in every test.

## `data class` equality for assertion readability

```kotlin
data class Point(val x: Int, val y: Int)

@Test
fun `translate moves the point correctly`() {
    val result = Point(1, 2).translate(dx = 3, dy = 4)
    assertEquals(Point(4, 6), result)
}
```

Because `data class` generates structural `equals()` automatically, comparing two instances in an
assertion compares their actual field values — no manual `equals()` override needed, and a failed
assertion's error message shows both full objects' field values directly, rather than just "not
equal" with two opaque object references.

## Extension functions for custom assertions

```kotlin
fun HttpResponse.assertStatus(expected: Int) {
    assertEquals(expected, this.statusCode, "Unexpected status. Body: ${this.body}")
}

@Test
fun `returns 404 for missing user`() {
    val response = api.getUser(id = 999)
    response.assertStatus(404)
}
```

An extension function (see the Kotlin Idioms topic's coverage of extension functions generally)
written specifically for test code can read like a natural, fluent assertion method on a type you
don't own — `response.assertStatus(404)` reads better than a bare
`assertEquals(404, response.statusCode)`, and can bundle in extra diagnostic context (like the
response body) automatically on failure.
