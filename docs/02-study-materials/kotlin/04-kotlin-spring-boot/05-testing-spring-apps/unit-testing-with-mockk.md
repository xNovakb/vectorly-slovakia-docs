---
sidebar_position: 1
title: Unit Testing with MockK
---

# Unit Testing with MockK

Testing a service class in isolation — exercising its own logic without a real database, a real
HTTP call, or a running Spring context at all, by replacing its dependencies with test doubles.

## Why MockK over Mockito for Kotlin

Mockito (the standard Java mocking library) predates Kotlin and has real friction with it: mocking
a `final` class needs extra configuration (Kotlin classes are final by default — see
[Spring Boot with Kotlin](../01-basics/spring-boot-with-kotlin.md)), and it doesn't naturally
understand Kotlin-specific constructs (default arguments, extension functions, `data class`
equality). **MockK** is built specifically for Kotlin, handling all of this natively.

## Basic mocking

```kotlin
class OrderServiceTest {

    private val orderRepository = mockk<OrderRepository>()
    private val paymentClient = mockk<PaymentClient>()
    private val orderService = OrderService(orderRepository, paymentClient)

    @Test
    fun `placeOrder saves the order and charges payment`() {
        val request = CreateOrderRequest(customerId = 1L, items = listOf())
        val savedOrder = Order(id = 1L, status = "pending", total = BigDecimal("99.99"))

        every { orderRepository.save(any()) } returns savedOrder
        every { paymentClient.charge(any()) } just Runs

        val result = orderService.placeOrder(request)

        assertEquals(savedOrder.id, result.id)
        verify { paymentClient.charge(savedOrder.total) }
    }
}
```

Because [Constructor Injection, Kotlin Style](../02-dependency-injection/constructor-injection-kotlin-style.md)
means dependencies are just constructor parameters, constructing `OrderService(orderRepository,
paymentClient)` directly — no Spring context, no `@Autowired`, no container startup at all — is
exactly what makes this kind of fast, isolated unit test possible in the first place.

## `every` / `verify` — the core MockK vocabulary

```kotlin
every { orderRepository.save(any()) } returns savedOrder     // stub a return value
every { paymentClient.charge(any()) } just Runs                 // stub a void/Unit function
every { orderRepository.findById(1L) } throws OrderNotFoundException(1L)   // stub a thrown exception

verify { paymentClient.charge(savedOrder.total) }                  // assert a call happened
verify(exactly = 0) { paymentClient.refund(any()) }                  // assert a call did NOT happen
verify(exactly = 2) { orderRepository.save(any()) }                     // assert an exact call count
```

`just Runs` is MockK's idiom specifically for stubbing a function that returns `Unit` (Kotlin's
equivalent of `void`) — there's no meaningful return value to specify, just an acknowledgment the
call is expected and shouldn't throw.

## Test names as readable sentences

```kotlin
@Test
fun `placeOrder throws when customer does not exist`() { /* ... */ }

@Test
fun `placeOrder charges the exact order total, not a rounded amount`() { /* ... */ }
```

Kotlin allows backtick-quoted function names containing spaces and punctuation — widely used for
test method names specifically, since a test report showing
`placeOrder throws when customer does not exist` is dramatically more readable than
`testPlaceOrder_customerNotFound_throwsException`, the naming convention Java tests are usually
stuck with.

## Relaxed mocks — for dependencies you don't care about in a specific test

```kotlin
val logger = mockk<Logger>(relaxed = true)    // any unstubbed call returns a sensible default instead of throwing
```

A plain `mockk<T>()` throws if a method is called without being explicitly stubbed with `every` —
appropriate most of the time, since an unexpected call often signals a test that doesn't fully
understand what it's exercising. `relaxed = true` is useful for genuinely incidental dependencies
(a logger, a metrics client) where every possible call being explicitly stubbed would just be
noise unrelated to what the test is actually verifying.

## What this doesn't test

A pure unit test with mocked dependencies verifies the service's **own logic** — it says nothing
about whether the real `OrderRepository` actually queries the database correctly, or whether the
real `PaymentClient` actually talks to a payment provider correctly. See
[Integration Testing with Testcontainers](./integration-testing-with-testcontainers.md) for testing
those real integrations.
