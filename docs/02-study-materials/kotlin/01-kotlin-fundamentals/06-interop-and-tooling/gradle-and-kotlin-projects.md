---
sidebar_position: 3
title: Gradle & Kotlin Projects
---

# Gradle & Kotlin Projects

**Gradle** is the standard build tool for Kotlin/JVM projects — it compiles code, manages
dependencies, and runs tasks (tests, packaging), configured through a build script checked into
the project itself.

## `build.gradle.kts` — Gradle configured in Kotlin itself

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

The `.kts` extension means the build script itself is written in Kotlin (Gradle also supports a
Groovy-based `build.gradle`, more common in older/Java-first projects) — a genuinely nice property
for a Kotlin project, since the build configuration gets the same IDE support (autocomplete, type
checking) as the application code itself.

## The core vocabulary

```text
plugins { }        — which Gradle plugins to apply (the Kotlin plugin, application packaging, etc.)
repositories { }     — where to download dependencies FROM (mavenCentral() is the default choice)
dependencies { }       — which libraries this project actually needs
```

## Dependency configurations

```kotlin
dependencies {
    implementation("com.example:library:1.0.0")        // needed to compile AND run this project
    api("com.example:public-api:1.0.0")                   // like implementation, but also exposed
                                                             // to anything that depends on THIS project
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")   // only needed for tests
    runtimeOnly("com.h2database:h2:2.2.0")                            // needed at runtime, not to compile against
}
```

`implementation` vs. `api` matters specifically for **libraries** other projects depend on —
`implementation` keeps a dependency as an internal detail; `api` leaks it into the public
compile-time classpath of anything depending on your project. For an application (not a library
other things depend on), this distinction rarely matters in practice — `implementation` is the
right default almost always.

## Common tasks

```bash
./gradlew build          # compile, run tests, package
./gradlew test             # run tests only
./gradlew run                # run the application (with the `application` plugin)
./gradlew clean               # remove build output
```

`gradlew` (the Gradle *wrapper*) is a script checked into the repository itself, pinned to a
specific Gradle version — so every developer (and CI, see the CI/CD Basics topic's
[Automated Builds](/study-materials/ci-cd/build-and-test/automated-builds) page) uses the exact
same Gradle version without needing it separately installed and kept in sync manually.

## Kotlin-specific project structure

```text
src/
  main/
    kotlin/       — application source (Kotlin's conventional source root, alongside/instead of java/)
    resources/      — non-code files bundled into the build (config, static assets)
  test/
    kotlin/          — test source
    resources/         — test-only resources
build.gradle.kts
settings.gradle.kts   — project name, and module structure for multi-module projects
```

A Kotlin project can freely mix `src/main/kotlin` and `src/main/java` in the same module — the
Kotlin Gradle plugin compiles both and lets them reference each other directly, one more concrete
expression of the interop covered in
[Kotlin/Java Interop](./kotlin-java-interop.md).

## Where this connects to the rest of this org's stack

Once a Kotlin project is containerized for deployment, its Gradle build becomes the first stage of
a multi-stage Dockerfile — see
[Multi-Stage Builds](/study-materials/docker/production-practices/dockerfile-best-practices) in
the Docker topic for exactly that pattern (a JDK+Gradle builder stage producing a JAR, copied into
a minimal runtime-only final image).
