---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A `@NotBlank` annotation (without `@field:`) on a Kotlin data class constructor property compiles
  fine, but validation silently never fires. Per [Request Validation](./request-validation.md), why
  does this happen with no error or warning at all?

  <details>
  <summary>Answer</summary>

  Without a use-site target, the annotation is ambiguous about whether it applies to the
  constructor parameter, the field, the getter, or something else — different annotations default
  to different targets, and it can attach to the parameter rather than the field. Bean Validation
  frameworks generally validate fields, not constructor parameters, so an annotation that landed on
  the wrong target simply never gets checked, with no indication anything is wrong.
  </details>

- A `CreateOrderRequest` has `@field:Valid` on its `items: List<OrderItemRequest>` field, but
  `OrderItemRequest`'s own `@field:NotNull`/`@field:Positive` annotations are never actually
  checked without it. Per [Request Validation](./request-validation.md), what does `@Valid`
  specifically do that a bare nested object reference doesn't?

  <details>
  <summary>Answer</summary>

  `@Valid` on a nested object or collection field is what makes validation cascade into it — without
  it, the nested object's own validation annotations are present in the code but simply never
  checked at all, a silent gap rather than an explicit failure, since nothing about the outer
  request would look invalid on its own.
  </details>

- Two `@ExceptionHandler` methods are declared out of order in a `@ControllerAdvice` class — a
  broad `RuntimeException::class` handler is written above a more specific
  `OrderNotFoundException::class` handler. Per
  [Exception Handling in Controllers](./exception-handling-in-controllers.md), which one actually
  handles an `OrderNotFoundException`?

  <details>
  <summary>Answer</summary>

  The more specific `OrderNotFoundException::class` handler, regardless of declaration order —
  Spring picks the most specific matching handler automatically, not the first one encountered in
  the class. Declaration order in the source file has no effect on which handler actually runs.
  </details>

- A `@PostMapping` method that creates a resource returns its response with no `@ResponseStatus`
  set. Per [REST Controllers](./rest-controllers.md), what status code does the client actually
  receive, and why does that matter beyond just "it still works"?

  <details>
  <summary>Answer</summary>

  It defaults to `200 OK` rather than the semantically correct `201 Created` for a creating `POST`.
  It "still works" in the sense that the client gets a successful response, but it's imprecise
  against the status code conventions the HTTP & Web Fundamentals topic covers — `@ResponseStatus`
  is what explicitly sets the more accurate code instead of relying on the generic default.
  </details>

- Domain exceptions like `OrderNotFoundException` are thrown from service-layer code with no
  awareness of HTTP status codes at all. Per
  [Exception Handling in Controllers](./exception-handling-in-controllers.md), why is keeping that
  mapping entirely inside `GlobalExceptionHandler`, rather than in the service layer, a deliberate
  separation of concerns?

  <details>
  <summary>Answer</summary>

  The service layer stays focused purely on business logic — it doesn't need to know or care what
  HTTP status code its failure eventually becomes, since that's an HTTP-layer concern, not a
  business-logic one. Centralizing the exception-to-status mapping in one place also means every
  controller gets consistent error handling without repeating that mapping logic per controller.
  </details>

