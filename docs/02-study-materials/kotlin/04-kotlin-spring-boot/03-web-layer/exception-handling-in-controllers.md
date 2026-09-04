---
sidebar_position: 3
title: Exception Handling in Controllers
---

# Exception Handling in Controllers

Centralizing error handling instead of wrapping every controller method in its own try/catch —
one place that turns exceptions into consistent, well-shaped HTTP responses across the whole app.

## `@ControllerAdvice` + `@ExceptionHandler`

```kotlin title="config/GlobalExceptionHandler.kt"
@ControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(OrderNotFoundException::class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    fun handleNotFound(ex: OrderNotFoundException): ErrorResponse =
        ErrorResponse(code = "not_found", message = ex.message ?: "Not found")

    @ExceptionHandler(MethodArgumentNotValidException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun handleValidation(ex: MethodArgumentNotValidException): ErrorResponse {
        val fields = ex.bindingResult.fieldErrors.map {
            FieldError(field = it.field, message = it.defaultMessage ?: "invalid")
        }
        return ErrorResponse(code = "validation_failed", message = "Validation failed", fields = fields)
    }

    @ExceptionHandler(Exception::class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    fun handleUnexpected(ex: Exception): ErrorResponse =
        ErrorResponse(code = "internal_error", message = "Something went wrong")
}
```

`@ControllerAdvice` applies across **every** controller in the app — a single class intercepts
exceptions thrown from any of them, rather than needing per-controller handling. Each
`@ExceptionHandler` method targets one exception type (or a hierarchy — a handler for a supertype
also catches subtypes not otherwise handled more specifically).

## A consistent error shape

```kotlin title="dto/ErrorResponse.kt"
data class ErrorResponse(
    val code: String,
    val message: String,
    val fields: List<FieldError> = emptyList()
)

data class FieldError(
    val field: String,
    val message: String
)
```

This is the same consistent-error-shape principle covered generally in
[Designing a Good API](/study-materials/http-web/rest-and-api-design/designing-a-good-api) in the
HTTP & Web Fundamentals topic — every endpoint's errors coming back in one predictable shape lets
client code write one generic error handler instead of special-casing each endpoint.

## Custom domain exceptions

```kotlin
class OrderNotFoundException(orderId: Long) : RuntimeException("Order $orderId not found")

class InsufficientStockException(productId: Long) : RuntimeException("Product $productId out of stock")
```

```kotlin title="service/OrderService.kt"
fun findById(id: Long): Order =
    orderRepository.findById(id) ?: throw OrderNotFoundException(id)
```

Domain-specific exceptions, thrown from service-layer code, keep the *service* focused on business
logic — it doesn't need to know or care what HTTP status code its failure eventually becomes; that
mapping lives entirely in `GlobalExceptionHandler`.

## Ordering matters for exception hierarchies

```kotlin
@ExceptionHandler(OrderNotFoundException::class)   // more specific — checked first
fun handleNotFound(ex: OrderNotFoundException): ErrorResponse = /* ... */

@ExceptionHandler(RuntimeException::class)           // less specific — catches anything else
fun handleRuntimeException(ex: RuntimeException): ErrorResponse = /* ... */

@ExceptionHandler(Exception::class)                    // broadest catch-all, last resort
fun handleUnexpected(ex: Exception): ErrorResponse = /* ... */
```

Spring picks the **most specific** matching handler automatically, regardless of the order methods
are declared in the class — but it's still worth mentally ordering handlers from specific to
general when reading/writing them, since that's the effective resolution order.

:::note
A catch-all `Exception::class` handler returning a generic `500` is worth having (so an
unanticipated bug produces a clean JSON error instead of a raw stack trace leaking to the client),
but shouldn't be relied on as the primary error-handling mechanism — genuinely expected failure
cases (not found, validation, business-rule violations) deserve their own specific exception types
and handlers, mapped to the correct
[status code](/study-materials/http-web/basics/status-codes), not funneled through the generic
500 handler.
:::
