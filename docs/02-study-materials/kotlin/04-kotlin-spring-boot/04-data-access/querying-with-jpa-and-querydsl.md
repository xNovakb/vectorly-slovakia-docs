---
sidebar_position: 3
title: Querying with JPA & QueryDSL
---

# Querying with JPA & QueryDSL

[Spring Data JPA Basics](./spring-data-jpa-basics.md) covers derived query methods (`findBy...`)
— fine for simple conditions, but they get unwieldy fast once a query needs real logic.

## `@Query` with JPQL

```kotlin
interface OrderRepository : JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.total > :minTotal")
    fun findLargeOrders(status: String, minTotal: BigDecimal): List<Order>

    @Query("""
        SELECT o FROM Order o
        JOIN FETCH o.items
        WHERE o.customerId = :customerId
    """)
    fun findWithItems(customerId: Long): List<Order>
}
```

**JPQL** (Java/Jakarta Persistence Query Language) looks like SQL but queries **entities and their
properties**, not raw tables and columns — `Order` and `o.status` refer to the Kotlin class and its
property, not necessarily identical database table/column names. Kotlin's triple-quoted strings
(`"""..."""`) are genuinely useful here for a multi-line query, avoiding awkward string
concatenation.

## `JOIN FETCH` — solving the N+1 query problem

```kotlin
// Without JOIN FETCH: one query for orders, then ONE MORE query per order to lazy-load its items
fun findAll(): List<Order>

// With JOIN FETCH: one single query, items loaded eagerly as part of it
@Query("SELECT o FROM Order o JOIN FETCH o.items")
fun findAllWithItems(): List<Order>
```

Fetching a list of entities, then accessing a lazy-loaded association (like `order.items`) on each
one individually, triggers a **separate query per entity** — the classic **N+1 query problem**:
1 query for the list, plus N more queries for each entity's association. `JOIN FETCH` collapses
this into a single query. This resurfaces as a genuine production performance issue in
[Performance Tuning Basics](../06-production-considerations/performance-tuning-basics.md) — it's
one of the most common real-world Spring Data performance bugs, often invisible in local
development with small datasets and only actually painful at production scale.

## Native SQL, when JPQL isn't enough

```kotlin
@Query(
    value = "SELECT * FROM orders WHERE EXTRACT(YEAR FROM created_at) = :year",
    nativeQuery = true
)
fun findByYear(year: Int): List<Order>
```

Drops down to real, database-specific SQL — necessary for anything JPQL can't express (database-
specific functions, complex window functions), at the cost of losing database portability and
entity-level abstraction.

## Method-name-derived queries vs. `@Query` — when to switch

```text
Derived method name:     Good for simple, small numbers of conditions
                            findByStatusAndCustomerId(status: String, customerId: Long)

@Query (JPQL):              Better once conditions get complex, need joins, or the derived
                              method name would become unreasonably long/unreadable

Native SQL:                    Only when JPQL genuinely can't express what's needed
```

A derived method name with five or six `And`/`Or` conditions chained together is usually the
signal to switch to an explicit `@Query` — not because the derived form stops working, but because
it stops being readable.

## QueryDSL and Exposed — worth knowing about, not covered in depth here

**QueryDSL** generates a type-safe query DSL from your entity classes at compile time, catching
query typos/type-mismatches the compiler can verify instead of failing only at runtime string-based
JPQL parsing.

**Exposed** is JetBrains' own Kotlin-native SQL framework — a genuinely different approach from
JPA/Hibernate entirely (no entity proxies, no reflection-based instantiation, a Kotlin DSL for SQL
built from the ground up for the language) rather than a Java framework retrofitted with Kotlin
support. Worth knowing it exists as an alternative to the whole JPA approach covered in this
section, particularly for a project that wants to sidestep the
[Kotlin/JPA friction points](./kotlin-entities-and-jpa-gotchas.md) entirely rather than work around
them — a deeper comparison is outside this topic's current scope.
