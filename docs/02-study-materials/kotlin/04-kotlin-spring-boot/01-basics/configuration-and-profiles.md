---
sidebar_position: 3
title: Configuration & Profiles
---

# Configuration & Profiles

## `application.yml`

Spring Boot's default configuration format — YAML (or the older `.properties` format) read at
startup:

```yaml title="application.yml"
spring:
  application:
    name: my-app
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: app_user

server:
  port: 8080

app:
  jwt-secret-header: X-App-Secret
  max-upload-size-mb: 10
```

## Binding config to a Kotlin data class

Rather than reading individual values with `@Value("${app.max-upload-size-mb}")` scattered across
the codebase, `@ConfigurationProperties` binds a whole config section to one typed object:

```kotlin title="config/AppProperties.kt"
package com.example.app.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app")
data class AppProperties(
    val jwtSecretHeader: String,
    val maxUploadSizeMb: Int
)
```

```kotlin title="Application.kt"
@SpringBootApplication
@EnableConfigurationProperties(AppProperties::class)
class Application
```

Kotlin's automatic camelCase ↔ kebab-case mapping means `maxUploadSizeMb` in the data class binds
to `max-upload-size-mb` in the YAML — no manual mapping needed. The resulting `AppProperties` is
just another injectable bean (see
[Constructor Injection, Kotlin Style](../02-dependency-injection/constructor-injection-kotlin-style.md)) —
type-safe, autocompletable, and refactor-safe in a way scattered `@Value` strings aren't.

## Spring profiles

A **profile** is a named configuration variant, letting different environments use different
settings without code changes:

```yaml title="application.yml"
spring:
  config:
    activate:
      on-profile: default
  datasource:
    url: jdbc:h2:mem:testdb
---
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: jdbc:postgresql://prod-db:5432/mydb
```

```bash
java -jar app.jar --spring.profiles.active=prod
```

Or via an environment variable, common in a containerized deploy (see
[Packaging & Deploying a Spring Boot App](../06-production-considerations/packaging-and-deploying-a-spring-boot-app.md)):

```bash
SPRING_PROFILES_ACTIVE=prod java -jar app.jar
```

## Profile-specific beans

```kotlin
@Service
@Profile("prod")
class RealEmailService : EmailService { /* ... */ }

@Service
@Profile("!prod")
class FakeEmailService : EmailService { /* ... */ }
```

Lets an entire bean implementation swap based on environment — a common pattern for anything that
shouldn't actually run against real external services outside production (sending real emails,
charging real payments) during local development or automated tests.

## Separate files per profile

```text
application.yml           — shared/default config
application-dev.yml         — dev-specific overrides
application-prod.yml          — prod-specific overrides
```

Spring automatically loads `application-{profile}.yml` on top of the base `application.yml` when
that profile is active — an alternative to the single-file `---`-separated document approach shown
above, often preferred once profile-specific config grows large enough to be unwieldy in one file.
