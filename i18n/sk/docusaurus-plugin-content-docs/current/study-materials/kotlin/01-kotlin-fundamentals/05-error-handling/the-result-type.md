---
sidebar_position: 2
title: Typ Result
---

# Typ Result

Standard library Kotlinu zahŕňa `Result<T>` — typ explicitne reprezentujúci "buď úspešnú hodnotu
alebo zlyhanie," ako alternatíva k hodeniu výnimky pre výsledky, ktoré sú normálnou, očakávanou
súčasťou správania funkcie namiesto naozaj výnimočných.

## Tri stratégie signalizovania zlyhania

```kotlin
// 1. Hoď výnimku — pre naozaj výnimočné, neočakávané zlyhania
fun parseAge(input: String): Int {
    return input.toInt()    // hodí NumberFormatException pri zlom vstupe
}

// 2. Vráť nullable typ — pre "toto jednoducho nemusí mať hodnotu," žiadne info o chybe netreba
fun findUser(id: Int): User? {
    return users.find { it.id == id }    // null jednoducho znamená "nenájdené," nie chybu
}

// 3. Vráť Result<T> — pre "toto môže zlyhať, a chcem popísať PREČO, bez hodenia výnimky"
fun parseAgeResult(input: String): Result<Int> {
    return runCatching { input.toInt() }
}
```

Každý sa hodí na inú situáciu — pozri porovnanie na konci tejto stránky, kedy siahnuť po ktorom.

## Vytváranie a používanie `Result`

```kotlin
fun divide(a: Int, b: Int): Result<Int> {
    return if (b == 0) {
        Result.failure(ArithmeticException("Division by zero"))
    } else {
        Result.success(a / b)
    }
}

val result = divide(10, 2)

result
    .onSuccess { println("Result: $it") }
    .onFailure { println("Failed: ${it.message}") }

val value = result.getOrNull()          // 5, alebo null ak zlyhalo
val valueOrDefault = result.getOrDefault(-1)   // 5, alebo -1 ak zlyhalo
val valueOrThrow = result.getOrThrow()           // 5, alebo znovu hodí originálnu výnimku
```

## `runCatching` — zabaľovanie kódu, ktorý môže hodiť výnimku

```kotlin
fun fetchConfig(path: String): Result<String> = runCatching {
    File(path).readText()    // ak toto hodí výnimku, runCatching ju chytí a zabalí ako Result.failure
}
```

`runCatching` je najbežnejší spôsob *produkovania* `Result` — spustí daný blok, a konvertuje
normálny return na `Result.success` alebo hodenú výnimku na `Result.failure`, bez potreby
explicitného try/catch (pozri [Výnimky v Kotline](./exceptions-in-kotlin.md)).

## Reťazenie transformácií na `Result`

```kotlin
val result = runCatching { "42".toInt() }
    .map { it * 2 }               // transformuje success hodnotu, ak nejaká je
    .recover { -1 }                 // poskytne fallback, ak zlyhalo, premení zlyhanie na úspech

println(result.getOrThrow())    // 84
```

`map` a `recover` ti umožnia postaviť pipeline operácií na `Result` bez skorého rozbalenia —
podobné v duchu reťazeniu na nullable s `?.`/`?:` (pozri
[Null Safety](../01-basics/null-safety.md)), ale nesúce skutočný dôvod zlyhania so sebou namiesto
len null.

## Výber medzi výnimkami, nullable, a `Result`

| Prístup | Najlepší pre |
|---|---|
| Hoď výnimku | Naozaj neočakávané zlyhania, ktoré volajúci pravdepodobne nedokáže zmysluplne lokálne zotaviť (bug, porušený invariant) |
| Nullable návrat (`T?`) | "Toto jednoducho nemusí mať hodnotu" — žiadny *dôvod* zlyhania netreba popisovať, absencia je normálny výsledok |
| `Result<T>` | Operácia, ktorá môže zlyhať *očakávaným*, popísateľným spôsobom, kde by volajúci mal rozhodnúť, ako reagovať, bez `try/catch` — obzvlášť užitočné naprieč hranicami funkcií alebo pri skladaní viacerých zlyhateľných krokov |

`Result<T>` nie je celoplošná náhrada za výnimky — Kotlin stále používa unchecked výnimky
naprieč vlastnou standard library aj širším JVM ekosystémom, s ktorým interoperuje (pozri
[Kotlin/Java Interop](../06-interop-and-tooling/kotlin-java-interop.md)). Je to nástroj pre
konkrétny prípad, kde spraviť zlyhanie explicitnou, typovanou súčasťou návratovej hodnoty funkcie
je naozaj jasnejšie, než by bola hodená výnimka.
