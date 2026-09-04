---
sidebar_position: 2
title: Project Structure
---

# Project Structure

## A typical layout

```text
src/main/kotlin/com/example/app/
├── Application.kt              # entry point
├── config/                       # @Configuration classes
├── controller/                     # @RestController classes
├── service/                          # business logic
├── repository/                         # Spring Data repositories
├── entity/                               # @Entity classes
└── dto/                                    # request/response data classes
src/main/resources/
├── application.yml
└── application-prod.yml
src/test/kotlin/com/example/app/
└── ...                                       # mirrors src/main structure
```

Not a Spring requirement — a convention, but a widely-used one. Package-by-layer (as above) vs.
package-by-feature (grouping a feature's controller/service/repository together) is a genuine
style choice; package-by-layer is more common in smaller Spring Boot apps and what most
tutorials/generators default to.

## The entry point

```kotlin title="Application.kt"
package com.example.app

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class Application

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}
```

A few Kotlin-specific things worth noting here:

- **`fun main` is top-level**, not inside a class — unlike Java, Kotlin doesn't require a `main`
  method to live inside any class at all.
- **`runApplication<Application>(*args)`** is a Kotlin extension function replacing Java's
  `SpringApplication.run(Application.class, args)` — the `<Application>` is a reified generic type
  parameter (no need to pass `.class`/`::class` explicitly), and `*args` is the spread operator,
  unpacking the `Array<String>` into individual vararg arguments.
- The `Application` class itself is typically empty — just a marker for `@SpringBootApplication`
  (which itself bundles `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`).

## `@SpringBootApplication` and component scanning

```kotlin
@SpringBootApplication
class Application
```

By default, Spring scans for components (`@Component`, `@Service`, `@Repository`,
`@RestController`, etc.) in the **same package as this class, and everything below it** — this is
exactly why `Application.kt` conventionally sits at the root package (`com.example.app`), not
buried in a subpackage: anything outside its package tree won't be found without explicit
`@ComponentScan` configuration.

## A minimal but real example

```kotlin title="controller/HealthController.kt"
package com.example.app.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HealthController {
    @GetMapping("/ping")
    fun ping(): String = "pong"
}
```

Note the single-expression function body (`fun ping(): String = "pong"`) — idiomatic Kotlin for a
function that's just one expression, replacing a full `{ return "pong" }` block. This pattern
shows up constantly in Spring controllers throughout
[REST Controllers](../03-web-layer/rest-controllers.md).

## Where configuration lives

```yaml title="application.yml"
spring:
  application:
    name: my-app
server:
  port: 8080
```

Covered in depth in [Configuration & Profiles](./configuration-and-profiles.md) — including how
Kotlin data classes bind to this YAML via `@ConfigurationProperties`.
