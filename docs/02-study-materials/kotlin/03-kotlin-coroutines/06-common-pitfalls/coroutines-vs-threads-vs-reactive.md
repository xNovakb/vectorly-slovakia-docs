---
sidebar_position: 3
title: Coroutines vs. Threads vs. Reactive
---

# Coroutines vs. Threads vs. Reactive

Three genuinely different concurrency models available on the JVM, each with real strengths — not
a strictly ordered "best to worst" ranking.

## The three models, briefly

```text
Raw threads (java.lang.Thread / ExecutorService)
  - The lowest-level model — you manage threads (or a pool of them) directly.
  - Blocking by nature; each unit of concurrent work ties up a real OS thread while waiting.

Coroutines (kotlinx.coroutines)
  - Suspension instead of blocking (see What Are Coroutines) — many coroutines share few threads.
  - Sequential-looking code (no callback nesting) that's actually asynchronous under the hood.
  - Kotlin-specific — not directly usable from Java without adapter layers.

Reactive streams (RxJava, Project Reactor)
  - A different abstraction: composable, declarative streams of events, built around
    operators (map, filter, flatMap, etc.) applied to an ongoing sequence of values.
  - Backpressure handling is a first-class, well-developed concept.
  - JVM-wide standard-ish (Reactive Streams spec) — usable from Java as naturally as Kotlin.
```

## Side-by-side comparison

| | Raw Threads | Coroutines | Reactive (RxJava/Reactor) |
|---|---|---|---|
| Concurrency unit cost | Expensive (OS thread) | Cheap (heap object) | Cheap (no dedicated thread per stream) |
| Code style | Callback-heavy or blocking | Sequential-looking, `suspend` | Declarative, operator-chain style |
| Language | Any JVM language | Kotlin (primarily) | Any JVM language |
| Backpressure handling | Manual | Via `Flow`'s buffering, less mature than reactive | Mature, first-class concept |
| Learning curve | Low to start, hard to get right | Moderate (structured concurrency is a real concept to learn) | Steep (operator vocabulary is large) |
| Ecosystem | Universal | Kotlin-specific, growing fast | Very mature, long-established |

## `Flow` vs. RxJava specifically — a common comparison

Kotlin's `Flow` (see [Introduction to Flow](../04-flow/introduction-to-flow.md)) was deliberately
designed with reactive streams as inspiration — many concepts map closely (`map`/`filter` operate
similarly, cold vs. hot mirrors reactive's cold/hot observable distinction). The practical
difference is mostly ecosystem and integration: `Flow` is native to coroutines and Kotlin
suspend functions, integrating seamlessly with the rest of this topic's material, while RxJava
predates coroutines and has its own separate, very mature ecosystem and operator set.

## When each is actually the right tool

```text
Raw threads/ExecutorService:
  - Simple, infrequent background work where the overhead of learning coroutines/reactive
    genuinely isn't worth it for the task's scale
  - Interfacing with existing thread-based Java code with no coroutine bridge available

Coroutines:
  - New Kotlin code, especially anything already using suspend functions from a framework
    (Ktor, Spring's coroutine support, Android's lifecycle-aware coroutine scopes)
  - When "sequential-looking async code" is valuable for readability over an operator-chain style

Reactive (RxJava/Reactor):
  - A codebase already built around reactive streams (e.g. Spring WebFlux)
  - Genuinely complex backpressure requirements
  - A team or codebase spanning both Java and Kotlin, needing one shared concurrency model
```

## They're not mutually exclusive in practice

```kotlin
// kotlinx-coroutines-reactive provides bridging functions
val flow: Flow<Int> = someRxObservable.asFlow()
val observable: Observable<Int> = someFlow.asObservable()
```

A codebase migrating from RxJava to coroutines (a common real-world scenario, since coroutines are
newer) doesn't have to do it all at once — bridging libraries exist specifically to let both
models coexist during a gradual transition.
