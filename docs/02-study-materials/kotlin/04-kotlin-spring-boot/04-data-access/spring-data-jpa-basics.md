---
sidebar_position: 1
title: Spring Data JPA Basics
---

# Spring Data JPA Basics

## Entities

```kotlin
@Entity
@Table(name = "orders")
class Order(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    var status: String,

    @Column(name = "total_amount")
    var total: BigDecimal
)
```

`@Entity` marks a class as mapped to a database table; `@Id` marks its primary key. This requires
the `kotlin("plugin.jpa")` Gradle plugin covered in
[Spring Boot with Kotlin](../01-basics/spring-boot-with-kotlin.md) — without it, Hibernate can't
instantiate this class via reflection, since Kotlin doesn't generate a no-arg constructor by
default. [Kotlin Entities & JPA Gotchas](./kotlin-entities-and-jpa-gotchas.md) goes deep into the
real friction points this specific combination introduces.

## Repositories

```kotlin
interface OrderRepository : JpaRepository<Order, Long> {
    fun findByStatus(status: String): List<Order>
    fun findByCustomerIdAndStatus(customerId: Long, status: String): List<Order>
}
```

Just an **interface** — no implementation code at all. `JpaRepository<Order, Long>` (entity type,
ID type) already provides `save`, `findById`, `findAll`, `deleteById`, and more, and Spring
generates a real implementation at runtime automatically.

## Derived query methods — Spring reads the method name

```kotlin
interface OrderRepository : JpaRepository<Order, Long> {
    fun findByStatus(status: String): List<Order>
    fun findByCustomerIdOrderByCreatedAtDesc(customerId: Long): List<Order>
    fun countByStatus(status: String): Long
    fun existsByCustomerIdAndStatus(customerId: Long, status: String): Boolean
    fun deleteByStatus(status: String): Int
}
```

Spring parses the method name itself (`findBy` + property names + operators like `And`/`Or`,
`OrderBy...Desc`) and generates the corresponding query — genuinely functional, not just a naming
convention with no effect, though it can get unwieldy for anything beyond simple conditions (see
[Querying with JPA & QueryDSL](./querying-with-jpa-and-querydsl.md) for `@Query` when derived
methods stop being the right tool).

## Basic usage in a service

```kotlin
@Service
class OrderService(private val orderRepository: OrderRepository) {

    fun findById(id: Long): Order =
        orderRepository.findById(id).orElseThrow { OrderNotFoundException(id) }

    fun findActiveOrders(customerId: Long): List<Order> =
        orderRepository.findByCustomerIdAndStatus(customerId, "active")

    fun save(order: Order): Order = orderRepository.save(order)
}
```

Note `findById` returns Java's `Optional<Order>`, not a Kotlin-nullable `Order?` — `JpaRepository`
is a Java-originated interface, so `.orElseThrow { }` (a Kotlin-friendly lambda form of
`Optional`'s method) is the idiomatic way to unwrap it, converting the Java-style optional into
Kotlin's own null-handling idiom at the boundary.

## Pagination and sorting

```kotlin
interface OrderRepository : JpaRepository<Order, Long> {
    fun findByStatus(status: String, pageable: Pageable): Page<Order>
}
```

```kotlin
val page = orderRepository.findByStatus("active", PageRequest.of(0, 20, Sort.by("createdAt").descending()))
```

Spring Data's `Page<T>` return type is the framework's own version of the
[pagination](/study-materials/http-web/rest-and-api-design/versioning-and-pagination) concept
covered in the HTTP & Web Fundamentals topic — it bundles the page of results together with total
count and page metadata, ready to map onto the same kind of wrapped collection response that topic
recommends for a REST API.
