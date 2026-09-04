---
sidebar_position: 2
title: Performance Tuning Basics
---

# Performance Tuning Basics

A handful of areas that account for most real-world Spring Boot performance issues — not an
exhaustive JVM tuning guide, but the concrete, common problems worth knowing about specifically.

## JVM startup time

A Spring Boot app's startup involves classpath scanning, bean creation, and (for a web app)
starting an embedded server — this can take anywhere from under a second to tens of seconds
depending on app size, meaningfully affecting things like container cold-start time and rolling
deploy speed.

```text
Contributors to slow startup:
  - Large classpath / many dependencies to scan
  - Excessive component scanning scope
  - Eager (non-lazy) initialization of many beans, some of which may not be needed for a given run
```

```yaml title="A partial mitigation — lazy bean initialization"
spring:
  main:
    lazy-initialization: true
```

Lazy initialization defers bean creation until first actually used, rather than all at
application startup — can meaningfully cut startup time, at the cost of pushing some
initialization cost (and potential first-use failures) later, to whenever that bean is first
actually needed instead of predictably at startup.

## Connection pool sizing (HikariCP)

Spring Boot uses **HikariCP** as its default JDBC connection pool.

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
```

:::warning
A pool sized too large doesn't make an app faster past a certain point — it can make it **slower**,
by causing excessive contention on the database side (each connection consumes real database-side
resources) and context-switching overhead. HikariCP's own documentation specifically recommends
starting from a formula close to `((core_count * 2) + effective_spindle_count)` rather than
guessing a large round number — more connections is not automatically better, a genuinely common
misconception.
:::

## The N+1 query problem, as a performance issue specifically

Covered from the JPA-mechanics angle in
[Querying with JPA & QueryDSL](../04-data-access/querying-with-jpa-and-querydsl.md) — worth
restating here as a *performance* problem specifically: fetching 100 orders, then lazily loading
each order's items individually, means **101 queries** instead of 1 or 2. This is one of the most
common real-world Spring Data performance bugs precisely because it's invisible with small local
test datasets (100 extra fast queries barely register) and only becomes painfully obvious at
production scale (100 extra queries against a loaded production database, multiplied across
concurrent requests).

```kotlin
// Diagnosing: enable SQL logging in application.yml and count actual queries per request
spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```

## Lazy vs. eager loading, the underlying tradeoff

```kotlin
@Entity
class Order(
    // ...
    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)   // default for @OneToMany
    val items: List<OrderItem> = listOf()
)
```

```text
LAZY   — don't load the association until it's actually accessed (avoids loading unneeded data,
          but risks N+1 if accessed in a loop without JOIN FETCH)
EAGER    — always load the association immediately with the parent (avoids N+1 for that specific
             association, but can over-fetch data that's often not needed at all)
```

Neither is universally correct — `LAZY` (the sensible default for most associations) plus explicit
`JOIN FETCH` exactly when an association is genuinely needed is generally the right combination,
rather than defaulting everything to `EAGER` to avoid thinking about it.

## Caching, briefly

```kotlin
@Cacheable("products")
fun findById(id: Long): Product = productRepository.findById(id).orElseThrow()
```

Spring's `@Cacheable` can meaningfully reduce database load for genuinely read-heavy, rarely-
changing data — but introduces cache invalidation as a new problem to manage correctly (a stale
cached value served after the underlying data changed) — not a default to reach for everywhere,
specifically valuable for data with a real, identifiable read-heavy/write-light access pattern.
