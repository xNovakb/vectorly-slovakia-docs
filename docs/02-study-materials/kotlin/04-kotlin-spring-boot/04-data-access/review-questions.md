---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- Two unsaved `Order` entities, both with `id = 0`, compare as equal via a `data class`'s
  generated `equals()` if their other fields happen to match. Per
  [Kotlin Entities & JPA Gotchas](./kotlin-entities-and-jpa-gotchas.md), why does this happen, and
  what's the standard fix?

  <details>
  <summary>Answer</summary>

  A data class's generated `equals()`/`hashCode()` are based on *all* constructor properties,
  including `id` — before persistence, `id` is still its default value for every unsaved entity,
  so two different unsaved entities with matching other fields compare as equal. The standard fix
  is to not use `data class` for JPA entities at all, using a plain class with manually implemented
  `equals`/`hashCode` based only on the ID.
  </details>

- Fetching a list of orders, then accessing `order.items` (a lazy association) on each one
  individually, triggers a separate query per order. Per
  [Querying with JPA & QueryDSL](./querying-with-jpa-and-querydsl.md), what's this pattern called,
  and what specifically fixes it?

  <details>
  <summary>Answer</summary>

  The N+1 query problem — 1 query for the list, plus N more queries, one per entity's lazy
  association. `JOIN FETCH` in a JPQL query collapses this into a single query by loading the
  association eagerly as part of the original query, rather than triggering a separate lazy load
  per entity afterward.
  </details>

- A Kotlin `String` (non-null) property is mapped to a database column that's actually nullable.
  Per [Kotlin Entities & JPA Gotchas](./kotlin-entities-and-jpa-gotchas.md), why can't the Kotlin
  compiler catch this mismatch, and what has to happen for it to actually cause a problem?

  <details>
  <summary>Answer</summary>

  Hibernate assigns the value into the property via reflection at runtime, bypassing normal Kotlin
  code paths entirely — the compiler has no visibility into what a database column might actually
  contain. The problem only surfaces if that column somehow actually contains `NULL` (a row
  inserted by something outside the app, a migration gap), at which point Hibernate hands a `null`
  into a property the compiler assumed could never be null.
  </details>

- Most non-ID entity properties need to be `var`, not `val`, even though `val`-by-default is the
  general Kotlin idiom elsewhere. Per
  [Kotlin Entities & JPA Gotchas](./kotlin-entities-and-jpa-gotchas.md), why does Hibernate
  specifically require this, and why does `id` remain a reasonable exception?

  <details>
  <summary>Answer</summary>

  Hibernate needs to be able to set most entity properties via the no-arg constructor plus
  reflection (or property setters), which requires a mutable `var`. `id` is a reasonable exception
  to keep as `val` because it's set once by the database at insert time and never legitimately
  changed afterward, unlike properties such as `status` that the application logic itself updates
  over the entity's lifetime.
  </details>

- A derived query method name grows to `findByStatusAndCustomerIdAndCreatedAtBetweenOrderByTotalDesc`.
  Per [Spring Data JPA Basics](./spring-data-jpa-basics.md) and
  [Querying with JPA & QueryDSL](./querying-with-jpa-and-querydsl.md), is this a sign the derived
  method approach has stopped *working*, or something else?

  <details>
  <summary>Answer</summary>

  It's still functionally correct — Spring genuinely parses and generates the query from a method
  name this long. The actual signal is readability, not functionality: a derived name with many
  chained conditions is usually the cue to switch to an explicit `@Query` with JPQL, not because
  the derived form breaks, but because it stops being readable at that length.
  </details>

