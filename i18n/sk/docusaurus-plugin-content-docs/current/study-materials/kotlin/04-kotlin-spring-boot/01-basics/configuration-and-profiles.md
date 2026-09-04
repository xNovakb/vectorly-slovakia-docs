---
sidebar_position: 3
title: Konfigurácia a Profily
---

# Konfigurácia a Profily

## `application.yml`

Predvolený konfiguračný formát Spring Boot — YAML (alebo starší `.properties` formát) čítaný pri
štarte:

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

## Naviazanie konfigurácie na Kotlin data class

Namiesto čítania jednotlivých hodnôt cez `@Value("${app.max-upload-size-mb}")` roztrúsených po
kóde, `@ConfigurationProperties` naviaže celú konfiguračnú sekciu na jeden typovaný objekt:

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

Automatické mapovanie camelCase ↔ kebab-case v Kotline znamená, že `maxUploadSizeMb` v data
class sa naviaže na `max-upload-size-mb` v YAML — netreba ručné mapovanie. Výsledný
`AppProperties` je jednoducho ďalší injectovateľný bean (pozri
[Constructor Injection, Kotlinovým Spôsobom](../02-dependency-injection/constructor-injection-kotlin-style.md))
— typovo bezpečný, autocompletovateľný, a refactor-safe spôsobom, akým roztrúsené `@Value`
stringy nie sú.

## Spring profily

**Profil** je pomenovaný konfiguračný variant, ktorý umožní rôznym prostrediam používať rôzne
nastavenia bez zmien kódu:

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

Alebo cez premennú prostredia, bežné v kontajnerizovanom deploy (pozri
[Balenie a Nasadzovanie Spring Boot Appky](../06-production-considerations/packaging-and-deploying-a-spring-boot-app.md)):

```bash
SPRING_PROFILES_ACTIVE=prod java -jar app.jar
```

## Beany špecifické pre profil

```kotlin
@Service
@Profile("prod")
class RealEmailService : EmailService { /* ... */ }

@Service
@Profile("!prod")
class FakeEmailService : EmailService { /* ... */ }
```

Umožní vymeniť celú implementáciu beanu podľa prostredia — bežný vzor pre čokoľvek, čo by naozaj
nemalo bežať voči reálnym externým službám mimo produkcie (posielanie reálnych emailov, nabíjanie
reálnych platieb) počas lokálneho vývoja alebo automatizovaných testov.

## Samostatné súbory na profil

```text
application.yml           — zdieľaná/predvolená konfigurácia
application-dev.yml         — dev-špecifické prepisy
application-prod.yml          — prod-špecifické prepisy
```

Spring automaticky načíta `application-{profile}.yml` navrch základného `application.yml`, keď je
tento profil aktívny — alternatíva k prístupu s jedným súborom oddeleným `---`, ukázanému vyššie,
často preferovaná, akonáhle profilovo-špecifická konfigurácia narastie natoľko, že je v jednom
súbore neprehľadná.
