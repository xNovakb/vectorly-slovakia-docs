---
sidebar_position: 2
title: Kotlin Entities & JPA Gotchas
---

# Kotlin Entities & JPA Gotchas

JPA/Hibernate predates Kotlin by well over a decade, and was designed entirely around Java's
mutable-POJO conventions. Kotlin's idioms (data classes, immutability, non-null-by-default) collide
with real Hibernate assumptions in ways worth knowing explicitly, not discovering in production.

## `data class` as a JPA entity — usually a mistake

```kotlin
❌ @Entity
   data class Order(
       @Id @GeneratedValue val id: Long = 0,
       var status: String
   )
```

:::danger
A `data class`'s auto-generated `equals()`/`hashCode()` are based on **all constructor
properties** — including the `id`. This causes real, subtle bugs with Hibernate:

- **Before the entity is saved**, `id` is `0` (or whatever default). Two different unsaved
  entities can compare as equal if their other fields happen to match, breaking things like
  `Set<Order>` membership before persistence.
- **Lazy-loaded proxies** — Hibernate often returns a dynamically generated proxy subclass instead
  of the real entity for lazy associations. A data class's generated `equals()` compares the
  runtime class too, and a proxy's class differs from the real entity's class — causing
  `equals()` to return `false` even when comparing "the same" logical entity, breaking
  collection-membership checks and test assertions in confusing, hard-to-reproduce ways.
- **Mutable `var` properties in `equals`/`hashCode`** compound this further — an entity's hash code
  can change after it's already been placed in a `HashSet`, corrupting that collection's internal
  bucket structure.

The standard fix: **don't use `data class` for JPA entities.** Use a plain class, and if you need
`equals`/`hashCode` at all, base them **only on the ID**, implemented manually.
:::

```kotlin title="✅ A plain class, ID-based equals/hashCode"
@Entity
class Order(
    @Id @GeneratedValue val id: Long = 0,
    var status: String
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Order) return false
        return id != 0L && id == other.id
    }
    override fun hashCode(): Int = javaClass.hashCode()   // stable across mutation, not ID-based
}
```

## The no-arg constructor requirement

Covered briefly in [Spring Boot with Kotlin](../01-basics/spring-boot-with-kotlin.md) — worth
restating concretely here: Hibernate instantiates entities via reflection, calling a no-argument
constructor and then setting fields directly, bypassing your own constructor logic entirely. The
`kotlin("plugin.jpa")` Gradle plugin generates this no-arg constructor automatically for
`@Entity`-annotated classes; without it, expect an `InstantiationException` at runtime, not a
compile-time error.

## Nullable vs. non-null property mapping

```kotlin
@Entity
class Product(
    @Id @GeneratedValue val id: Long = 0,

    @Column(nullable = false)
    var name: String,              // non-null Kotlin type — should match nullable = false

    @Column(nullable = true)
    var description: String?         // nullable Kotlin type — should match nullable = true
)
```

:::warning
Kotlin's `String` (non-null) mapped against a database column that's actually nullable is a real
mismatch: if that column somehow contains `NULL` (a row inserted by something outside this app, a
migration gap, manual SQL), Hibernate can hand back a `null` into a Kotlin property typed as
non-null — a violation of Kotlin's own null-safety guarantee that the compiler can't catch, since
it happens via reflection at runtime, not through normal Kotlin code paths. Keep the Kotlin
nullability and the `@Column(nullable = ...)` annotation genuinely in sync, in both directions.
:::

## `val` vs. `var` on entity properties

```kotlin
@Entity
class Order(
    @Id @GeneratedValue val id: Long = 0,   // val — an ID shouldn't be reassigned after creation
    var status: String                        // var — Hibernate needs to be able to set this
)
```

Hibernate needs to **set** most entity properties (via the no-arg constructor + reflection, or
Kotlin property setters) — meaning most non-ID properties need to be `var`, not `val`, despite
`val`-by-default being the general Kotlin idiom elsewhere in this stack (see the Kotlin Idioms
topic). The `id` itself is a reasonable exception to keep `val`, since it's set once by the
database and never legitimately changed afterward.

## The general lesson

JPA entities are one of the few places in a Kotlin Spring Boot codebase where idiomatic Kotlin
(data classes, immutable `val`, non-null-by-default) has to yield to what Hibernate's
reflection-based object model actually requires — worth treating as a deliberate, understood
exception rather than trying to force full Kotlin idiom onto every entity class.
