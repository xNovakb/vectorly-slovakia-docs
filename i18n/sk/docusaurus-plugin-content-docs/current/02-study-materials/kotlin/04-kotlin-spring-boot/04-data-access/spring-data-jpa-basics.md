---
sidebar_position: 1
title: Základy Spring Data JPA
---

# Základy Spring Data JPA

## Entity

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

`@Entity` označí triedu ako namapovanú na databázovú tabuľku; `@Id` označí jej primárny kľúč.
Toto vyžaduje Gradle plugin `kotlin("plugin.jpa")` pokrytý v
[Spring Boot s Kotlinom](../01-basics/spring-boot-with-kotlin.md) — bez neho Hibernate nevie túto
triedu inštanciovať cez reflexiu, keďže Kotlin predvolene negeneruje no-arg konštruktor.
[Kotlin Entity a JPA Gotchas](./kotlin-entities-and-jpa-gotchas.md) ide hlboko do skutočných
trecích bodov, ktoré táto konkrétna kombinácia prináša.

## Repozitáre

```kotlin
interface OrderRepository : JpaRepository<Order, Long> {
    fun findByStatus(status: String): List<Order>
    fun findByCustomerIdAndStatus(customerId: Long, status: String): List<Order>
}
```

Len **interface** — žiadny implementačný kód vôbec. `JpaRepository<Order, Long>` (typ entity,
typ ID) už poskytuje `save`, `findById`, `findAll`, `deleteById`, a viac, a Spring automaticky
vygeneruje skutočnú implementáciu za behu.

## Derived query metódy — Spring číta meno metódy

```kotlin
interface OrderRepository : JpaRepository<Order, Long> {
    fun findByStatus(status: String): List<Order>
    fun findByCustomerIdOrderByCreatedAtDesc(customerId: Long): List<Order>
    fun countByStatus(status: String): Long
    fun existsByCustomerIdAndStatus(customerId: Long, status: String): Boolean
    fun deleteByStatus(status: String): Int
}
```

Spring parsuje samotné meno metódy (`findBy` + mená vlastností + operátory ako `And`/`Or`,
`OrderBy...Desc`) a vygeneruje zodpovedajúcu query — naozaj funkčné, nie len konvencia
pomenovania bez efektu, aj keď to môže rýchlo zneprehľadnieť pre čokoľvek nad rámec jednoduchých
podmienok (pozri [Query s JPA a QueryDSL](./querying-with-jpa-and-querydsl.md) pre `@Query`, keď
derived metódy prestanú byť správnym nástrojom).

## Základné použitie v service

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

Všimni si, že `findById` vráti Java `Optional<Order>`, nie Kotlin-nullable `Order?` —
`JpaRepository` je interface pochádzajúci z Javy, takže `.orElseThrow { }` (Kotlin-priateľská
lambda forma metódy `Optional`) je idiomatický spôsob jeho rozbalenia, konvertujúci Java-štýl
optional na vlastný null-handling idiom Kotlinu na hranici.

## Stránkovanie a triedenie

```kotlin
interface OrderRepository : JpaRepository<Order, Long> {
    fun findByStatus(status: String, pageable: Pageable): Page<Order>
}
```

```kotlin
val page = orderRepository.findByStatus("active", PageRequest.of(0, 20, Sort.by("createdAt").descending()))
```

Návratový typ `Page<T>` Spring Data je vlastná verzia frameworku pre koncept
[stránkovania](/sk/study-materials/http-web/rest-and-api-design/versioning-and-pagination)
pokrytý v téme HTTP a Web Základy — zabaľuje stránku výsledkov spolu s celkovým počtom a
metadátami stránky, pripravenú namapovať sa na rovnaký druh zabalenej odpovede kolekcie, akú tá
téma odporúča pre REST API.
