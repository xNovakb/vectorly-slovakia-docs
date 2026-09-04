---
sidebar_position: 1
title: REST Controllers
---

# REST Controllers

## The basic shape

```kotlin
@RestController
@RequestMapping("/orders")
class OrderController(private val orderService: OrderService) {

    @GetMapping("/{id}")
    fun getOrder(@PathVariable id: Long): OrderResponse =
        orderService.findById(id).toResponse()

    @PostMapping
    fun createOrder(@RequestBody request: CreateOrderRequest): OrderResponse =
        orderService.placeOrder(request).toResponse()

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteOrder(@PathVariable id: Long) =
        orderService.delete(id)
}
```

`@RestController` combines `@Controller` and `@ResponseBody` — every method's return value is
serialized directly into the response body (JSON, by default with Jackson), not resolved as a view
template name the way plain `@Controller` would.

## HTTP method mapping annotations

```kotlin
@GetMapping("/orders")       // GET  — see HTTP Methods in the HTTP & Web Fundamentals topic
@PostMapping("/orders")        // POST
@PutMapping("/orders/{id}")      // PUT
@PatchMapping("/orders/{id}")      // PATCH
@DeleteMapping("/orders/{id}")       // DELETE
```

These map directly onto the HTTP method semantics covered in
[HTTP Methods](/study-materials/http-web/methods-and-semantics/http-methods) — Spring doesn't
invent its own verb concept, it's a thin routing layer over the same HTTP methods, and the same
[idempotency/safety](/study-materials/http-web/methods-and-semantics/idempotency-and-safety)
expectations from that topic apply equally to a Spring controller's design (a `@GetMapping` method
still shouldn't have side effects, regardless of what Spring itself would technically allow).

## Data classes as request/response bodies

```kotlin
data class CreateOrderRequest(
    val customerId: Long,
    val items: List<OrderItemRequest>
)

data class OrderResponse(
    val id: Long,
    val status: String,
    val total: BigDecimal
)
```

Jackson (Spring Boot's default JSON library) deserializes an incoming JSON body directly into a
data class via its primary constructor, and serializes a returned data class back to JSON using
its properties — no manual mapping code needed for the common case. This requires the
`jackson-module-kotlin` dependency (included automatically by the standard
`spring-boot-starter-web` + Kotlin setup) specifically to understand Kotlin's constructor-based
class shape and non-null types correctly.

## Path variables and query parameters

```kotlin
@GetMapping("/orders/{id}/items/{itemId}")
fun getOrderItem(
    @PathVariable id: Long,
    @PathVariable itemId: Long
): OrderItemResponse = /* ... */

@GetMapping("/orders")
fun searchOrders(
    @RequestParam status: String?,
    @RequestParam(defaultValue = "0") page: Int
): List<OrderResponse> = /* ... */
```

Maps directly onto the [query params vs. path segments vs. body](/study-materials/http-web/methods-and-semantics/query-params-vs-request-body)
distinction from the HTTP & Web Fundamentals topic — `@PathVariable` for identifying one specific
resource, `@RequestParam` for filtering/paginating a collection, `@RequestBody` for the actual
data being created or updated.

## Response status codes

```kotlin
@PostMapping
@ResponseStatus(HttpStatus.CREATED)      // 201, not the default 200
fun createOrder(@RequestBody request: CreateOrderRequest): OrderResponse = /* ... */
```

Without `@ResponseStatus`, a successful controller method defaults to `200 OK` — explicitly
setting `201 Created` for a creating `POST` (or `204 No Content` for a `DELETE`, as in the first
example) matches the [status code](/study-materials/http-web/basics/status-codes) conventions
covered in the HTTP & Web Fundamentals topic, rather than returning a technically-working but
semantically-imprecise `200` for everything.

## Where errors get handled

Notice none of these methods have explicit try/catch blocks for things like "order not found" —
that's handled centrally, covered next in
[Exception Handling in Controllers](./exception-handling-in-controllers.md).
