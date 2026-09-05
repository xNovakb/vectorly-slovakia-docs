---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A `@Service`-annotated Kotlin class works fine locally in simple tests, then a
  `@Transactional` method silently doesn't participate in a transaction once deployed. Per
  [Spring Boot with Kotlin](./spring-boot-with-kotlin.md), what's the root cause, and which Gradle
  plugin fixes it?

  <details>
  <summary>Answer</summary>

  Kotlin classes are `final` by default, but Spring's `@Transactional` (and AOP generally) relies
  on CGLIB proxies — dynamically generated subclasses at runtime — which can't subclass a `final`
  class. `kotlin("plugin.spring")` automatically removes the implicit `final` from any class
  annotated with Spring stereotypes, so the proxy mechanism can actually work.
  </details>

- An `@Entity`-annotated Kotlin class throws an `InstantiationException` at runtime, not a compile
  error. Per [Spring Boot with Kotlin](./spring-boot-with-kotlin.md), why does this specific
  failure only show up at runtime, and what's missing?

  <details>
  <summary>Answer</summary>

  Hibernate instantiates entities via reflection, calling a no-argument constructor — but Kotlin
  doesn't generate one by default the way a plain Java class implicitly can. The compiler has no
  way to catch this at compile time since the class itself compiles fine; the failure only surfaces
  when Hibernate actually tries to reflectively construct it. `kotlin("plugin.jpa")` generates the
  missing no-arg constructor automatically.
  </details>

- `runApplication<Application>(*args)` replaces Java's `SpringApplication.run(Application.class,
  args)`. Per [Project Structure](./project-structure.md), what do the `<Application>` type
  parameter and the `*args` spread operator each specifically avoid needing?

  <details>
  <summary>Answer</summary>

  `<Application>` is a reified generic type parameter, letting `runApplication` know the concrete
  class without needing `.class`/`::class` passed explicitly. `*args` (the spread operator) unpacks
  the `Array<String>` into individual vararg arguments — without it, the whole array would be
  passed as one single argument rather than as the multiple varargs the function expects.
  </details>

- `maxUploadSizeMb` in a Kotlin `@ConfigurationProperties` data class binds correctly to
  `max-upload-size-mb` in `application.yml` with zero manual mapping code. Per
  [Configuration & Profiles](./configuration-and-profiles.md), what convention makes this
  automatic?

  <details>
  <summary>Answer</summary>

  Spring Boot's relaxed binding automatically maps camelCase Kotlin property names to kebab-case
  YAML keys (and vice versa) — this isn't Kotlin-specific magic, it's a general Spring Boot
  convention that happens to line up naturally with idiomatic Kotlin naming, requiring no explicit
  annotation per property to connect the two.
  </details>

- Two `@Service` implementations of the same interface are each annotated `@Profile("prod")` and
  `@Profile("!prod")`. Per [Configuration & Profiles](./configuration-and-profiles.md), what
  problem does this solve that a single implementation with an `if` statement checking the active
  profile wouldn't as cleanly?

  <details>
  <summary>Answer</summary>

  It lets an entire bean implementation swap based on environment at the container-wiring level —
  useful for something that genuinely shouldn't run against real external services outside
  production (sending real emails, charging real payments). Rather than one implementation
  branching internally on environment, Spring decides which whole class to instantiate in the
  first place, keeping each implementation focused on just its own environment's actual behavior.
  </details>

