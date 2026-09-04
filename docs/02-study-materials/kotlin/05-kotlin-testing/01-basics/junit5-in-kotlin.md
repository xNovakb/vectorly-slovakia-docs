---
sidebar_position: 1
title: JUnit5 in Kotlin
---

# JUnit5 in Kotlin

JUnit5 is the standard test framework on the JVM, and works from Kotlin with no special setup —
but a few of its features fit Kotlin's syntax especially well, worth knowing from the start.

## The basics

```kotlin
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.assertEquals

class CalculatorTest {

    @Test
    fun `adds two numbers correctly`() {
        val result = Calculator().add(2, 3)
        assertEquals(5, result)
    }
}
```

`@Test` marks a function as a test case; `assertEquals(expected, actual)` fails the test if the
two values aren't equal. Note the backtick-quoted function name — covered properly in
[Kotlin-Specific Test Idioms](./kotlin-specific-test-idioms.md).

## Setup and teardown

```kotlin
class UserRepositoryTest {
    private lateinit var repository: UserRepository

    @BeforeEach
    fun setUp() {
        repository = UserRepository(InMemoryDatabase())
    }

    @AfterEach
    fun tearDown() {
        repository.close()
    }

    @Test
    fun `saves and retrieves a user`() {
        repository.save(User(id = 1, name = "Jane"))
        val found = repository.findById(1)
        assertEquals("Jane", found?.name)
    }
}
```

`@BeforeEach`/`@AfterEach` run before/after **every** test method in the class — the standard way
to give each test a fresh, isolated starting point instead of tests accidentally sharing state.

## Nested test classes

```kotlin
class ShoppingCartTest {

    @Nested
    inner class WhenCartIsEmpty {
        @Test
        fun `total is zero`() {
            assertEquals(0, ShoppingCart().total())
        }
    }

    @Nested
    inner class WhenCartHasItems {
        private val cart = ShoppingCart().apply { add(Item("Book", 10)) }

        @Test
        fun `total reflects item prices`() {
            assertEquals(10, cart.total())
        }

        @Test
        fun `item count increases`() {
            assertEquals(1, cart.itemCount())
        }
    }
}
```

`@Nested` (combined with Kotlin's `inner class`, needed so the nested class can access the outer
class) groups related tests under a shared context — the test report reads as
"WhenCartHasItems > total reflects item prices," which is far more readable than one long, flat
list of unrelated-looking test names.

## Common assertions

```kotlin
assertEquals(expected, actual)
assertTrue(condition)
assertFalse(condition)
assertNull(value)
assertNotNull(value)
assertThrows<IllegalArgumentException> {
    validateAge(-1)
}
```

`assertThrows<T> { }` is the idiomatic Kotlin form (using a reified type parameter and a trailing
lambda) — cleaner than the Java equivalent, which needs an explicit `.class` reference. See
[Kotest Assertions](../02-assertions-and-mocking/kotest-assertions.md) for an alternative
assertion style many Kotlin projects prefer over these built-in JUnit assertions.

## Where this fits

Plain JUnit5 is a perfectly good foundation — nothing here is wrong or outdated. The rest of this
topic covers idioms and libraries (Kotest, MockK) that build on top of this same JUnit5
foundation to make tests read more naturally in Kotlin specifically, not a replacement for it.
