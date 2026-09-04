---
sidebar_position: 2
title: Request Validation
---

# Request Validation

## Bean Validation basics

```kotlin
data class CreateUserRequest(
    @field:NotBlank
    val email: String,

    @field:Size(min = 2, max = 100)
    val name: String,

    @field:Min(0)
    val age: Int
)
```

```kotlin
@PostMapping
fun createUser(@Valid @RequestBody request: CreateUserRequest): UserResponse =
    userService.create(request)
```

`@Valid` on the controller parameter tells Spring to run Bean Validation against the incoming
request body **before** the method body even executes — a request failing validation never reaches
`createUser`'s own code at all, Spring returns a `400 Bad Request` automatically.

## The `@field:` gotcha — a genuine, commonly-hit Kotlin issue

:::warning
In a Kotlin data class, a validation annotation written as just `@NotBlank` (without the
`@field:` prefix) often attaches to the **constructor parameter**, not the underlying property —
and Bean Validation frameworks generally validate **fields**, not constructor parameters. The
annotation can silently do nothing at all, with no error, no warning — the request "validates"
successfully even when it shouldn't.

```kotlin
❌ data class CreateUserRequest(
       @NotBlank            // may attach to the wrong target — validation silently skipped
       val email: String
   )

✅ data class CreateUserRequest(
       @field:NotBlank         // explicitly targets the property/field
       val email: String
   )
```

This is specifically a consequence of Kotlin's **use-site targets** — an annotation on a primary
constructor `val` parameter is ambiguous about whether it means the parameter, the field, the
getter, or something else, and different annotations default to different targets. `@field:` (or
`@get:`, `@param:`, etc.) removes that ambiguity explicitly. Always use `@field:` for Bean
Validation annotations on a Kotlin data class constructor property.
:::

## Common validation annotations

```kotlin
data class ProductRequest(
    @field:NotBlank
    val name: String,

    @field:NotNull
    @field:Positive
    val price: BigDecimal,

    @field:Email
    val contactEmail: String?,

    @field:Pattern(regexp = "^[A-Z]{3}-\\d{4}$")
    val sku: String
)
```

```text
@NotBlank    — string is not null AND not empty/whitespace-only
@NotNull       — value is not null (works on any type, doesn't check emptiness)
@NotEmpty        — collection/string is not null and has at least one element/character
@Size              — string length or collection size within bounds
@Min / @Max          — numeric bounds
@Positive / @Negative  — numeric sign
@Email                   — valid email format
@Pattern                   — matches a regex
```

## Validating nested objects

```kotlin
data class CreateOrderRequest(
    @field:NotEmpty
    @field:Valid                 // without this, nested object validation is skipped entirely
    val items: List<OrderItemRequest>
)

data class OrderItemRequest(
    @field:NotNull
    val productId: Long,
    @field:Positive
    val quantity: Int
)
```

`@Valid` on a nested object or collection field is required to make validation **cascade** into
it — without it, `OrderItemRequest`'s own annotations are simply never checked, even though they're
present in the code, another easy-to-miss silent gap rather than an explicit failure.

## What happens on a validation failure

A `MethodArgumentNotValidException` is thrown automatically by Spring — by default this becomes a
generic `400 Bad Request` with Spring's own default error body shape. Customizing that into the
kind of specific, field-by-field error response covered in
[REST API Design](/study-materials/http-web/rest-and-api-design/designing-a-good-api)'s validation
error guidance is exactly what
[Exception Handling in Controllers](./exception-handling-in-controllers.md) covers next.
