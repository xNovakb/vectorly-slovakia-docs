---
sidebar_position: 1
title: Spracovanie Výnimiek v Coroutines
---

# Spracovanie Výnimiek v Coroutines

Výnimky v coroutines dodržiavajú tie isté pravidlá štruktúrovanej konkurencie pokryté vo
[Vysvetlení Štruktúrovanej Konkurencie](../02-structured-concurrency/structured-concurrency-explained.md)
— nespracovaná výnimka neovplyvní len coroutine, v ktorej sa stala, propaguje sa cez
rodič/dieťa vzťah, s reálnymi, niekedy prekvapivými dôsledkami.

## `try`/`catch` funguje normálne vnútri coroutine

```kotlin
launch {
    try {
        riskyOperation()
    } catch (e: Exception) {
        println("Caught: ${e.message}")
    }
}
```

Nič nezvyčajné tu — bežný `try`/`catch` okolo suspend volaní sa správa presne tak, ako by mal.

## *Nezachytená* výnimka v `launch` sa propaguje rodičovi, okamžite

```kotlin
fun main() = runBlocking {
    launch {
        throw RuntimeException("Boom")    // nezachytená — propaguje sa okamžite
    }
    delay(1000L)
    println("This may never print")        // rodičovský scope je zrušený zlyhaním dieťaťa
}
```

Predvolene (pozri [Vysvetlenie Štruktúrovanej Konkurencie](../02-structured-concurrency/structured-concurrency-explained.md)),
nezachytená výnimka v detskej coroutine zruší jej rodičovský scope, čo zase zruší aj každú
súrodeneckú coroutine — "zlyhaj spolu" je predvolené správanie, nie opt-in.

## Výnimky `async` sú iné — držané, kým sa nezavolá `.await()`

```kotlin
val deferred = async {
    throw RuntimeException("Boom")
}
delay(1000L)
println("This DOES print — async doesn't propagate immediately")
deferred.await()    // výnimka sa hodí TU, nie keď sa pôvodne stala
```

Toto je naozaj dôležitá asymetria oproti `launch` — pozri [Launch vs. Async](../01-basics/launch-vs-async.md)
— výnimka `async` coroutine je držaná, kým niečo naozaj nezavolá `.await()` na jej `Deferred`. Ak
sa `.await()` nikdy nezavolá, výnimka sa možno vôbec neprejaví (aj keď stále môže ovplyvniť
rodičovský scope v závislosti od kontextu — pozri nižšie).

## `CoroutineExceptionHandler` — posledná záchrana, top-level handler

```kotlin
val handler = CoroutineExceptionHandler { _, exception ->
    println("Caught unhandled exception: ${exception.message}")
}

val scope = CoroutineScope(Dispatchers.Default + handler)
scope.launch {
    throw RuntimeException("Boom")
}
```

Nainštalovaný cez `CoroutineContext`, zachytí výnimky, ktoré by inak spadli program (alebo sa
potichu stratili) — ale len pre **root** coroutines (top-level `launch` volania na scope), a len
pre `launch`, nie `async` (ktorého výnimky sú namiesto toho odložené do `.await()`, kde je
obyčajný `try`/`catch` okolo `.await()` volania správny nástroj).

:::note
`CoroutineExceptionHandler` nainštalovaný na kontexte *detskej* coroutine je efektívne
ignorovaný — lebo nezachytené výnimky sa propagujú hore k rodičovi predtým, než dostane
zmysluplnú šancu zareagovať akýkoľvek handler na dieťati, handler musí byť na top-level scope, nie
roztrúsený na jednotlivých detských coroutines, ktoré by mali spracovať vlastnú výnimku.
:::

## Praktické odporúčania

```text
launch:  zabaľ rizikový kód do try/catch VNÚTRI coroutine, ak sa vieš lokálne zotaviť;
         použi CoroutineExceptionHandler na top-level scope ako poslednú záchranu
async:   zabaľ .await() volanie do try/catch — tam sa výnimka naozaj prejaví
```

Zle pochopiť toto — očakávať, že výnimka `async` sa bude správať ako `launch`, alebo naopak — je
jeden z bežnejších zdrojov zmätku "prečo sa moja výnimka nezachytila" pri prvej práci s
coroutines.
