---
sidebar_position: 1
title: Spring Boot with Kotlin
---

# Spring Boot with Kotlin

Spring Boot was built for Java, but has first-class Kotlin support — and Kotlin's own language
features solve real problems Java Spring code has always had to work around by convention.

## Why the combination works well

- **Conciseness** — a data class replaces a Java POJO's constructor, getters, `equals`,
  `hashCode`, and `toString` boilerplate entirely.
- **Null safety** — Kotlin's type system distinguishes `String` from `String?` at compile time.
  Spring's own null-handling annotations (`@Nullable`) are advisory at best in Java; in Kotlin,
  a non-null parameter that receives null fails to compile in the first place, not just at
  runtime.
- **Default arguments** — replaces the "telescoping constructors" or builder-pattern boilerplate
  Java code often reaches for to handle optional parameters.

```kotlin
data class CreateUserRequest(
    val email: String,
    val name: String,
    val role: String = "user"    // default argument — no overload needed
)
```

## Two Gradle plugins that make this actually work

Kotlin classes are **`final` by default** — unlike Java, where a class is open for subclassing
unless marked `final`. Spring relies heavily on subclassing/proxying for two core mechanisms:

- **CGLIB proxies** — Spring wraps many beans (anything using `@Transactional`, AOP, etc.) in a
  dynamically generated subclass at runtime. A `final` class can't be subclassed, so this breaks
  silently or loudly depending on the case.
- **JPA entity proxies** — Hibernate needs to generate lazy-loading proxy subclasses of entity
  classes. Same problem.

```kotlin title="build.gradle.kts"
plugins {
    kotlin("plugin.spring") version "1.9.25"    // "all-open" plugin, preconfigured for Spring
    kotlin("plugin.jpa") version "1.9.25"         // "no-arg" plugin, preconfigured for JPA
}
```

- **`kotlin("plugin.spring")`** — automatically opens (removes the implicit `final`) any class
  annotated with `@Component`, `@Service`, `@Configuration`, and similar Spring stereotypes — so
  you don't have to manually mark every Spring-managed class `open`.
- **`kotlin("plugin.jpa")`** — automatically generates a no-arg secondary constructor for classes
  annotated `@Entity` — Kotlin doesn't generate a no-arg constructor by default the way a plain
  Java class implicitly can, and Hibernate needs one to instantiate entities via reflection.

:::note
Without these plugins, a Kotlin Spring Boot app can *mostly* seem to work in simple cases, then
fail confusingly the moment something needs a proxy — a `@Transactional` method silently not
participating in a transaction, or a cryptic Hibernate instantiation error. Both plugins are
close to non-negotiable for any real Kotlin+Spring project, not an optional convenience.
:::

## What this topic assumes

Working knowledge of Kotlin the language itself (see the Kotlin Fundamentals and Kotlin Idioms
topics) and general HTTP concepts (see the [HTTP & Web Fundamentals](/study-materials/http-web/basics/what-is-http)
topic for REST semantics, status codes, and headers) — this topic focuses specifically on how
Spring Boot and Kotlin interact, not either one from first principles.
