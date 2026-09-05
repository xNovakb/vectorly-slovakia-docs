---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A pure MockK unit test of `OrderService` passes, but a request to the real endpoint fails
  validation in a way the test never caught. Per
  [Testing Controllers with MockMvc](./testing-controllers-with-mockmvc.md), why would a MockK-only
  test structurally never catch this, even with perfect coverage of the service's own logic?

  <details>
  <summary>Answer</summary>

  Validation happens at the web layer, triggered by `@Valid` on the controller parameter, before
  the service method is ever called at all. A MockK unit test constructs `OrderService` directly
  with no Spring context involved — it never exercises Bean Validation, routing, or serialization,
  so a bug in any of those layers (including the `@field:` annotation-target gotcha) is invisible
  to it by construction, not by an oversight in the test itself.
  </details>

- `OrderService(orderRepository, paymentClient)` is constructed directly in a test with no Spring
  context at all. Per [Unit Testing with MockK](./unit-testing-with-mockk.md), which earlier
  Kotlin+Spring Boot page's pattern is what specifically makes this possible?

  <details>
  <summary>Answer</summary>

  Constructor injection (from the Dependency Injection subfolder) — because dependencies are just
  constructor parameters, constructing the service directly with test doubles requires nothing
  beyond calling the constructor, no `@Autowired`, no container startup, no mocking-framework
  annotations just to build the object under test.
  </details>

- A test suite uses H2 for fast tests and passes cleanly, but a subtle bug involving a
  PostgreSQL-specific constraint only shows up in production. Per
  [Integration Testing with Testcontainers](./integration-testing-with-testcontainers.md), why
  wouldn't H2 have caught this, and what would Testcontainers have caught instead?

  <details>
  <summary>Answer</summary>

  H2 is a genuinely different database engine than production — SQL dialect differences,
  constraint behavior, and specific functions can all differ subtly, so a test passing against H2
  doesn't guarantee the same behavior against the actual production database. Testcontainers runs
  the exact same database engine and version as production in a real container, so a
  PostgreSQL-specific constraint issue would actually surface in the test, at the cost of slower
  startup and a Docker dependency.
  </details>

- `@WebMvcTest(OrderController::class)` loads only the web layer, not the full application
  context. Per [Testing Controllers with MockMvc](./testing-controllers-with-mockmvc.md), what
  specifically does this let a test verify that a pure MockK unit test can't, and what does it
  deliberately *not* verify that Testcontainers would?

  <details>
  <summary>Answer</summary>

  A `MockMvc` test verifies routing, `@Valid` validation actually triggering, JSON response
  shape, and whether exceptions map to the correct status code via the global exception handler —
  things a service-level MockK test never touches since it skips Spring's web machinery entirely.
  It deliberately doesn't touch a real database, so it can't catch a genuinely broken query or JPA
  mapping issue — that's specifically what Testcontainers integration tests are for.
  </details>

- A relaxed mock (`mockk<Logger>(relaxed = true)`) is used for a logger dependency in a test, while
  `orderRepository` and `paymentClient` remain plain, non-relaxed mocks. Per
  [Unit Testing with MockK](./unit-testing-with-mockk.md), why is this split reasonable rather than
  making every mock relaxed for convenience?

  <details>
  <summary>Answer</summary>

  A plain mock throwing on any unstubbed call is a useful guardrail — an unexpected call to
  `orderRepository` or `paymentClient` likely signals the test doesn't fully understand what it's
  exercising, and that failure is meaningful. A logger is genuinely incidental to what the test is
  actually verifying, so explicitly stubbing every possible logging call would just be noise;
  `relaxed = true` is reserved for dependencies where an unstubbed call carries no real signal.
  </details>

