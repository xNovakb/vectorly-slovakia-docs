---
sidebar_position: 2
title: MockK Basics
---

# MockK Basics

[MockK](https://mockk.io/) is a mocking library built specifically for Kotlin — where Mockito
(the standard Java mocking library) has real friction with Kotlin-specific language features,
MockK is designed around them from the start.

## Why not just use Mockito

```kotlin
class UserService {   // a regular Kotlin class — final by default!
    fun findUser(id: Long): User? = ...
}
```

Kotlin classes and functions are **final by default** (must be explicitly marked `open` to allow
subclassing/overriding) — but most mocking libraries, Mockito included, historically work by
generating a subclass of the mocked class at runtime. Mocking a final Kotlin class with plain
Mockito either fails outright or requires an extra plugin
(`mockito-inline`/`all-open` compiler plugin) just to work around a friction Kotlin's own design
introduced. MockK is built to mock final classes natively, with no extra configuration — a direct
consequence of being designed for Kotlin instead of adapted from a Java-first tool.

MockK also has native support for mocking `suspend` functions (coroutines) — see
[Testing Coroutines](/study-materials/kotlin/kotlin-coroutines/error-handling-and-testing/testing-coroutines)
in the Kotlin Coroutines & Concurrency topic — which Mockito historically struggled with entirely.

## Creating a mock

```kotlin
import io.mockk.mockk
import io.mockk.every

val userRepository = mockk<UserRepository>()

every { userRepository.findById(1) } returns User(id = 1, name = "Jane")

val user = userRepository.findById(1)
println(user?.name)   // "Jane"
```

`mockk<T>()` creates a mock instance of type `T`; `every { ... } returns ...` stubs what a specific
call on that mock should return, using Kotlin's trailing-lambda syntax to make the stubbed call
look like a natural expression rather than a string-based method reference.

## A realistic test using a mock

```kotlin
class OrderServiceTest {

    @Test
    fun `applies a discount when the user has a loyalty membership`() {
        val userRepository = mockk<UserRepository>()
        every { userRepository.findById(1) } returns User(id = 1, hasLoyaltyMembership = true)

        val orderService = OrderService(userRepository)
        val total = orderService.calculateTotal(userId = 1, subtotal = 100)

        assertEquals(90, total)   // 10% loyalty discount applied
    }
}
```

The mock stands in for `UserRepository` entirely — no real database, no real network call — so the
test runs fast and deterministically, testing `OrderService`'s discount logic in isolation from
however user data actually gets fetched in production.

## Stubbing different return values for different arguments

```kotlin
every { userRepository.findById(1) } returns User(id = 1, name = "Jane")
every { userRepository.findById(2) } returns User(id = 2, name = "Bob")
every { userRepository.findById(999) } returns null
```

Each `every { }` with a different argument value stubs that specific call independently — a mock
can behave differently depending on exactly how it's called, not just return one fixed value for
every invocation.

## Stubbing an exception

```kotlin
every { userRepository.findById(1) } throws DatabaseConnectionException("timeout")

@Test
fun `propagates a database error`() {
    assertThrows<DatabaseConnectionException> {
        orderService.calculateTotal(userId = 1, subtotal = 100)
    }
}
```

Useful for testing how code handles a dependency failing — something genuinely difficult to
reliably trigger against a real database on demand, but trivial against a mock.

## Where this fits with real Spring Boot testing

[Unit Testing with MockK](/study-materials/kotlin/kotlin-spring-boot/testing-spring-apps/unit-testing-with-mockk)
in the Kotlin + Spring Boot topic covers this same library applied specifically inside a Spring
application's service-layer tests — this page is the general-purpose foundation that page builds
on.
