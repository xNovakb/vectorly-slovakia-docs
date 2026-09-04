---
sidebar_position: 3
title: Beans & Scopes
---

# Beans & Scopes

A **bean** is any object managed by Spring's `ApplicationContext` (see
[DI Basics in Spring](./di-basics-in-spring.md)) — created, wired with its dependencies, and
tracked by the container rather than by application code directly.

## The stereotype annotations

```kotlin
@Component     // generic — "this is a Spring-managed bean," no more specific role implied
@Service         // a business-logic class — semantically a @Component, marks intent
@Repository        // a data-access class — also enables Spring's exception translation for this bean
@RestController       // a web-layer class — combines @Controller + @ResponseBody
```

All four are actually the *same mechanism* underneath (`@Service`, `@Repository`, and
`@RestController` are themselves annotated with `@Component`) — the distinction is almost entirely
about **communicating intent** to whoever reads the code, not different technical behavior, with
one real exception: `@Repository` additionally enables automatic translation of
database-specific exceptions into Spring's own consistent `DataAccessException` hierarchy.

## `@Bean` methods — for things you don't own

Stereotype annotations only work on classes you can annotate directly. For a class from a
third-party library, or anything needing custom construction logic, a `@Bean` method inside a
`@Configuration` class is the alternative:

```kotlin title="config/AppConfig.kt"
@Configuration
class AppConfig {
    @Bean
    fun objectMapper(): ObjectMapper =
        ObjectMapper().registerKotlinModule()

    @Bean
    fun restTemplate(builder: RestTemplateBuilder): RestTemplate =
        builder
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(5))
            .build()
}
```

Each `@Bean`-annotated method's return value becomes a managed bean, injectable anywhere else the
same way as a `@Component`-annotated class would be. This is also where profile-specific bean
selection (see [Configuration & Profiles](../01-basics/configuration-and-profiles.md)) commonly
lives when the choice depends on more than a simple `@Profile` on a whole class.

## Bean scopes

```kotlin
@Service
class OrderService   // default scope: singleton — one shared instance for the whole application
```

```kotlin
@Service
@Scope("prototype")
class ReportBuilder   // a NEW instance every time it's injected/requested
```

```text
singleton   — one shared instance, created once, reused everywhere (the default, and by far the
               most common — appropriate for stateless services)
prototype     — a new instance every time it's requested — appropriate for something genuinely
                 stateful that shouldn't be shared across concurrent uses
request         — one instance per HTTP request (web apps only)
session           — one instance per HTTP session (web apps only)
```

## Why singleton is the sensible default

Most Spring beans (services, repositories, controllers) hold **no mutable per-request state** —
they're essentially just bundles of behavior operating on data passed into their methods. A single
shared instance is both correct and far cheaper than constructing a new one for every use. Reach
for `prototype` (or a scope narrower than singleton) only when a bean genuinely needs to hold state
that must not be shared between concurrent callers — a rare need for a typical Spring service
layer, and often a sign the state in question actually belongs in a method parameter or a
database, not in the bean itself.

:::warning
Injecting a `prototype`-scoped bean into a `singleton`-scoped bean (the default) only resolves the
prototype dependency **once**, at the singleton's own construction time — the "new instance every
time" behavior doesn't automatically apply just because the dependency is prototype-scoped. Getting
a genuinely fresh prototype instance per use from within a singleton requires an extra pattern
(`ObjectProvider<T>`, or a scoped proxy) — a real, commonly-hit gotcha, not just theoretical.
:::
