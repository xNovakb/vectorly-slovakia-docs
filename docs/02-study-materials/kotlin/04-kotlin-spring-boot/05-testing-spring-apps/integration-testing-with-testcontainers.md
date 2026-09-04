---
sidebar_position: 2
title: Integration Testing with Testcontainers
---

# Integration Testing with Testcontainers

[Unit Testing with MockK](./unit-testing-with-mockk.md) mocks the database away entirely — fast,
but it proves nothing about whether the real JPA mappings, queries, and constraints actually work
against a real database. **Testcontainers** runs a real database in a real
[Docker container](/study-materials/docker/basics/what-is-a-container) for the duration of the
test, then throws it away.

## The basic setup

```kotlin
@SpringBootTest
@Testcontainers
class OrderRepositoryIntegrationTest {

    companion object {
        @Container
        @JvmStatic
        val postgres = PostgreSQLContainer("postgres:16")

        @DynamicPropertySource
        @JvmStatic
        fun configureProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
        }
    }

    @Autowired
    lateinit var orderRepository: OrderRepository

    @Test
    fun `save and retrieve an order`() {
        val saved = orderRepository.save(Order(status = "pending", total = BigDecimal("50.00")))
        val found = orderRepository.findById(saved.id)
        assertTrue(found.isPresent)
        assertEquals("pending", found.get().status)
    }
}
```

`@Container` starts a real PostgreSQL container before the test class runs (via
[Docker](/study-materials/docker/running-containers/container-lifecycle)'s normal
container-lifecycle mechanics, driven programmatically rather than `docker run` directly), and
`@DynamicPropertySource` wires Spring's datasource configuration to point at that container's
actual, dynamically-assigned host/port — no manually-managed test database, no fixed port to
collide with anything else running locally.

## Why not just use an in-memory database (H2) instead

```kotlin
❌ // application-test.yml pointing at H2 instead of Postgres
spring:
  datasource:
    url: jdbc:h2:mem:testdb
```

H2 is faster to start and needs no Docker at all — but it's a **different database engine** than
production (assuming production runs PostgreSQL, MySQL, or similar). SQL dialect differences,
constraint behavior, and specific functions can all differ subtly between H2 and the real
production database — a test passing against H2 doesn't guarantee the same behavior against the
database actually used in production. Testcontainers runs the **exact same** database engine and
version as production, at the cost of a slower test (needing to actually start a container) and a
Docker dependency for anything running the test suite (including CI runners).

## The tradeoff, explicitly

```text
MockK unit tests:            Fastest, no infrastructure needed, tests ONLY the service's own logic
Testcontainers integration:    Slower (container startup), needs Docker available, tests REAL
                                 database behavior, catches issues mocks structurally can't
```

A healthy test suite typically has **many** fast unit tests and **fewer** slower integration
tests — not because integration tests are less valuable, but because their cost (time, Docker
dependency) makes running hundreds of them on every single change impractical the way it is for
pure unit tests.

## Reusing a container across multiple test classes

```kotlin
companion object {
    @Container
    @JvmStatic
    val postgres = PostgreSQLContainer("postgres:16").apply {
        withReuse(true)    // requires testcontainers.reuse.enable=true in ~/.testcontainers.properties
    }
}
```

By default, a fresh container starts (and stops) per test class — correct and isolated, but adds
real startup overhead if many test classes each need their own database. `withReuse(true)` keeps
one container alive across multiple test runs during local development, at the cost of tests no
longer being fully isolated from each other's data by default — a deliberate tradeoff for local
dev speed, generally not enabled in CI where full isolation matters more than iteration speed.

## Where this fits with CI

Testcontainers-based tests need a Docker daemon available wherever they run — see the CI/CD
topic's [self-hosted vs. managed runners](/study-materials/ci-cd/tools-and-platforms/self-hosted-vs-managed-runners)
page for what that requirement means for choosing CI infrastructure; most managed CI runners
(including GitHub-hosted ones) do provide Docker out of the box, but it's worth confirming rather
than assuming for less common CI setups.
