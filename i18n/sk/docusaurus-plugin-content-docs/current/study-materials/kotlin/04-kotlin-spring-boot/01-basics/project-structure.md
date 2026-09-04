---
sidebar_position: 2
title: Štruktúra Projektu
---

# Štruktúra Projektu

## Typický layout

```text
src/main/kotlin/com/example/app/
├── Application.kt              # vstupný bod
├── config/                       # @Configuration triedy
├── controller/                     # @RestController triedy
├── service/                          # business logika
├── repository/                         # Spring Data repozitáre
├── entity/                               # @Entity triedy
└── dto/                                    # request/response data classes
src/main/resources/
├── application.yml
└── application-prod.yml
src/test/kotlin/com/example/app/
└── ...                                       # zrkadlí štruktúru src/main
```

Nie je to Spring požiadavka — konvencia, ale rozšírená. Package-by-layer (ako vyššie) vs.
package-by-feature (zoskupenie controllera/service/repository jednej feature dokopy) je skutočná
voľba štýlu; package-by-layer je bežnejší v menších Spring Boot appkách a čo väčšina
tutoriálov/generátorov predvolene používa.

## Vstupný bod

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

Pár vecí špecifických pre Kotlin, ktoré sa tu oplatí všimnúť:

- **`fun main` je top-level**, nie vnútri triedy — na rozdiel od Javy, Kotlin nevyžaduje, aby
  `main` metóda žila vôbec vnútri nejakej triedy.
- **`runApplication<Application>(*args)`** je Kotlin extension funkcia nahrádzajúca Java
  `SpringApplication.run(Application.class, args)` — `<Application>` je reified generický typový
  parameter (netreba explicitne odovzdať `.class`/`::class`), a `*args` je spread operátor,
  rozbaľujúci `Array<String>` na jednotlivé vararg argumenty.
- Trieda `Application` samotná je typicky prázdna — len marker pre `@SpringBootApplication`
  (ktorá sama zabalí `@Configuration`, `@EnableAutoConfiguration`, a `@ComponentScan`).

## `@SpringBootApplication` a component scanning

```kotlin
@SpringBootApplication
class Application
```

Predvolene Spring skenuje komponenty (`@Component`, `@Service`, `@Repository`, `@RestController`,
atď.) v **rovnakom balíku ako táto trieda, a všetkom pod ním** — presne preto `Application.kt`
konvenčne sedí v koreňovom balíku (`com.example.app`), nie zahrabaná v podbalíku: čokoľvek mimo
jej stromu balíkov sa nenájde bez explicitnej `@ComponentScan` konfigurácie.

## Minimálny, ale reálny príklad

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

Všimni si single-expression telo funkcie (`fun ping(): String = "pong"`) — idiomatický Kotlin pre
funkciu, ktorá je len jeden výraz, nahrádzajúci plný `{ return "pong" }` blok. Tento vzor sa
objavuje neustále v Spring kontroléroch naprieč [REST Kontroléry](../03-web-layer/rest-controllers.md).

## Kde býva konfigurácia

```yaml title="application.yml"
spring:
  application:
    name: my-app
server:
  port: 8080
```

Podrobne pokryté v [Konfigurácia a Profily](./configuration-and-profiles.md) — vrátane toho, ako
sa Kotlin data classes viažu na tento YAML cez `@ConfigurationProperties`.
