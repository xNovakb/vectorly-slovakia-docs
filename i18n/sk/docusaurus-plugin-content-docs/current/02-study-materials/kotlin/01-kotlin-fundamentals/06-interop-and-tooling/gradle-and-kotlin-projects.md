---
sidebar_position: 3
title: Gradle a Kotlin Projekty
---

# Gradle a Kotlin Projekty

**Gradle** je štandardný build nástroj pre Kotlin/JVM projekty — kompiluje kód, spravuje
závislosti, a spúšťa tasky (testy, balenie), konfigurovaný cez build skript commitnutý priamo do
projektu.

## `build.gradle.kts` — Gradle nakonfigurovaný v samotnom Kotline

```kotlin title="build.gradle.kts"
plugins {
    kotlin("jvm") version "2.0.0"
    application
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.0")
    testImplementation(kotlin("test"))
}

application {
    mainClass.set("MainKt")
}
```

Prípona `.kts` znamená, že samotný build skript je napísaný v Kotline (Gradle tiež podporuje
Groovy-based `build.gradle`, bežnejší v starších/Java-first projektoch) — naozaj pekná vlastnosť
pre Kotlin projekt, keďže build konfigurácia dostane rovnakú IDE podporu (autocomplete, type
checking) ako samotný aplikačný kód.

## Základný slovník

```text
plugins { }        — ktoré Gradle pluginy aplikovať (Kotlin plugin, application balenie, atď.)
repositories { }     — odkiaľ sťahovať závislosti (mavenCentral() je predvolená voľba)
dependencies { }       — ktoré knižnice tento projekt naozaj potrebuje
```

## Konfigurácie závislostí

```kotlin
dependencies {
    implementation("com.example:library:1.0.0")        // potrebné na kompiláciu A beh tohto projektu
    api("com.example:public-api:1.0.0")                   // ako implementation, ale aj vystavené
                                                             // čomukoľvek, čo závisí na TOMTO projekte
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")   // potrebné len pre testy
    runtimeOnly("com.h2database:h2:2.2.0")                            // potrebné za behu, nie na kompiláciu proti
}
```

`implementation` vs. `api` má význam konkrétne pre **knižnice**, na ktorých závisia iné projekty
— `implementation` udrží závislosť ako interný detail; `api` unikne do verejného compile-time
classpath čohokoľvek, čo závisí na tvojom projekte. Pre aplikáciu (nie knižnicu, na ktorej
závisia iné veci), toto rozlíšenie v praxi zriedka záleží — `implementation` je správna
predvoľba takmer vždy.

## Bežné tasky

```bash
./gradlew build          # skompiluj, spusti testy, zabaľ
./gradlew test             # spusti len testy
./gradlew run                # spusti aplikáciu (s `application` pluginom)
./gradlew clean               # odstráň build výstup
```

`gradlew` (Gradle *wrapper*) je skript commitnutý priamo do repozitára, pripnutý na konkrétnu
verziu Gradle — takže každý vývojár (a CI, pozri stránku
[Automated Builds](/sk/study-materials/ci-cd/build-and-test/automated-builds) v téme CI/CD
Basics) používa presne rovnakú verziu Gradle bez potreby ju mať samostatne nainštalovanú a ručne
synchronizovanú.

## Kotlin-špecifická štruktúra projektu

```text
src/
  main/
    kotlin/       — zdroj aplikácie (konvenčný source root Kotlinu, popri/namiesto java/)
    resources/      — non-code súbory zabalené do buildu (config, statické assety)
  test/
    kotlin/          — zdroj testov
    resources/         — resources len pre testy
build.gradle.kts
settings.gradle.kts   — meno projektu, a štruktúra modulov pre multi-module projekty
```

Kotlin projekt vie voľne miešať `src/main/kotlin` a `src/main/java` v rovnakom module — Kotlin
Gradle plugin skompiluje oboje a nechá ich navzájom priamo odkazovať, ešte jedno konkrétne
vyjadrenie interopu pokrytého v [Kotlin/Java Interop](./kotlin-java-interop.md).

## Kde sa toto spája so zvyškom stacku tejto organizácie

Akonáhle je Kotlin projekt kontajnerizovaný na nasadenie, jeho Gradle build sa stane prvou fázou
multi-stage Dockerfile — pozri
[Multi-Stage Builds](/sk/study-materials/docker/production-practices/dockerfile-best-practices)
v téme Docker pre presne tento vzor (JDK+Gradle builder fáza produkujúca JAR, skopírovaná do
minimálneho runtime-only finálneho image).
