---
sidebar_position: 3
title: Testing Controllers with MockMvc
---

# Testing Controllers with MockMvc

Between a pure unit test ([Unit Testing with MockK](./unit-testing-with-mockk.md), no Spring
involved at all) and a full integration test
([Integration Testing with Testcontainers](./integration-testing-with-testcontainers.md), a real
database), `MockMvc` tests the **web layer specifically** — routing, request parsing, validation,
response serialization — without starting an actual HTTP server or network connection.

## The basic setup

```kotlin
@WebMvcTest(OrderController::class)
class OrderControllerTest {

    @Autowired
    lateinit var mockMvc: MockMvc

    @MockkBean
    lateinit var orderService: OrderService

    @Test
    fun `GET orders:id returns the order as JSON`() {
        every { orderService.findById(1L) } returns Order(id = 1L, status = "pending", total = BigDecimal("50.00"))

        mockMvc.perform(get("/orders/1"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.status").value("pending"))
    }

    @Test
    fun `POST orders with invalid body returns 400`() {
        mockMvc.perform(
            post("/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"customerId": null}""")
        ).andExpect(status().isBadRequest)
    }
}
```

`@WebMvcTest(OrderController::class)` loads **only** the web layer — this one controller, Spring
MVC infrastructure, and the [exception handler](../03-web-layer/exception-handling-in-controllers.md)
— not the full application context, not real service/repository beans. `@MockkBean` (MockK's
Spring integration) replaces `OrderService` with a mock inside that slice of context, the same
`every`/`verify` vocabulary from [Unit Testing with MockK](./unit-testing-with-mockk.md) applying
here too.

## What this actually verifies that a pure unit test doesn't

```text
Pure MockK unit test:      Does OrderService's own logic behave correctly?
MockMvc controller test:     Does the URL route correctly? Does @Valid validation actually trigger?
                                Is the JSON response shaped correctly? Do exceptions map to the right
                                status code via GlobalExceptionHandler?
```

A controller method with correct internal logic can still be reached by the wrong URL, fail to
apply validation because of the
[`@field:` gotcha](../03-web-layer/request-validation.md), or return the wrong status code — none
of which a service-level MockK test alone would ever catch, since it never touches Spring's web
routing/serialization machinery at all.

## Asserting on the JSON response shape

```kotlin
mockMvc.perform(get("/orders/1"))
    .andExpect(status().isOk)
    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
    .andExpect(jsonPath("$.id").value(1))
    .andExpect(jsonPath("$.status").value("pending"))
    .andExpect(jsonPath("$.items").isArray)
    .andExpect(jsonPath("$.items.length()").value(2))
```

`jsonPath(...)` lets a test assert on specific fields within the JSON body without deserializing
it into a Kotlin object first — useful for confirming the actual wire format (field names, nesting,
types) matches what's expected, which is specifically what this layer of test is meant to catch.

## Testing validation failures return the right shape

```kotlin
@Test
fun `POST orders with blank email returns field-level validation errors`() {
    mockMvc.perform(
        post("/users")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""{"email": "", "name": "Jane"}""")
    )
        .andExpect(status().isBadRequest)
        .andExpect(jsonPath("$.code").value("validation_failed"))
        .andExpect(jsonPath("$.fields[0].field").value("email"))
}
```

This is exactly the kind of test that would have caught the
[`@field:` annotation-target gotcha](../03-web-layer/request-validation.md) covered earlier in this
topic — a MockK-only unit test of the service layer would never exercise Bean Validation at all,
since validation happens at the web layer, before the service method is ever called.

## When to reach for MockMvc vs. a full integration test

MockMvc is the right layer for "is the web layer itself correct" — routing, validation,
serialization, error mapping. It deliberately doesn't touch a real database, so it can't catch a
genuinely broken query or a JPA mapping issue — that's what
[Testcontainers](./integration-testing-with-testcontainers.md) is for. Most controllers benefit
from both: a MockMvc test for the web-layer contract, and integration tests further down the stack
for the data layer specifically.
