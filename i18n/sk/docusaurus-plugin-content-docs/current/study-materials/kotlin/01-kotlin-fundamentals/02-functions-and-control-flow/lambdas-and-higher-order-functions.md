---
sidebar_position: 3
title: Lambdy a Higher-Order Funkcie
---

# Lambdy a Higher-Order Funkcie

**Higher-order funkcia** je funkcia, ktorá berie inú funkciu ako parameter, vracia jednu, alebo
oboje. Kotlin zaobchádza s funkciami ako so skutočnými plnohodnotnými hodnotami — toto je
mechanizmus za väčšinou expresívnejšieho, funkcionálne pôsobiaceho kódu Kotlinu.

## Syntax lambdy

```kotlin
val square: (Int) -> Int = { x -> x * x }
println(square(5))    // 25

val add: (Int, Int) -> Int = { a, b -> a + b }
println(add(2, 3))     // 5
```

Typ `(Int) -> Int` sa číta ako "funkcia berúca `Int`, vracajúca `Int`" — typy funkcií sa píšu
takto všade, kde treba deklarovať tvar lambdy (typ parametra, typ `val`, návratový typ).

## `it` — implicitný jednoduchý parameter

```kotlin
val square: (Int) -> Int = { it * it }    // jednoparametrové lambdy môžu preskočiť pomenovanie parametra

val numbers = listOf(1, 2, 3, 4)
val doubled = numbers.map { it * 2 }        // `it` odkazuje na každý prvok
```

`it` je čisto pohodlie pre extrémne bežný prípad jednoparametrovej lambdy — pre čokoľvek s viac
než jedným parametrom, alebo kde by `it` bolo nejasné, pomenuj parametre explicitne namiesto toho.

## Odovzdávanie funkcií ako parametrov

```kotlin
fun calculate(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    return operation(a, b)
}

val sum = calculate(3, 4) { x, y -> x + y }       // 7
val product = calculate(3, 4) { x, y -> x * y }     // 12
```

## Trailing lambda syntax

```kotlin
// Ak je POSLEDNÝ parameter typ funkcie, lambda sa môže presunúť von zo zátvoriek:
calculate(3, 4) { x, y -> x + y }

// ekvivalentné, ale menej idiomatické:
calculate(3, 4, { x, y -> x + y })

// a ak je to JEDINÝ parameter, zátvorky sa dajú úplne vynechať:
numbers.forEach { println(it) }
```

Toto je presne syntax, ktorá robí standard-library funkcie Kotlinu (`map`, `filter`, `forEach` —
pozri [Funkcionálne Operácie](../04-collections-and-functional-style/functional-operations.md))
čitateľnými takmer ako zabudovanú jazykovú syntax namiesto obyčajných volaní funkcií — a je to
ten istý mechanizmus za DSL-building schopnosťou Kotlinu, pokrytou podrobne v
[Building DSLs](/sk/study-materials/kotlin/kotlin-idioms/building-dsls/dsl-basics) v téme Kotlin
Idioms & Advanced Features.

## Funkcie vracajúce funkcie

```kotlin
fun multiplier(factor: Int): (Int) -> Int {
    return { number -> number * factor }
}

val triple = multiplier(3)
println(triple(5))    // 15
```

`multiplier` vráti novú funkciu, takú, ktorá si "pamätá" `factor`, s ktorým bola vytvorená —
**closure**, zachytávajúci premennú z obklopujúceho scope namiesto len vlastných parametrov.

## Referencie na funkcie

```kotlin
fun isEven(n: Int): Boolean = n % 2 == 0

val numbers = listOf(1, 2, 3, 4, 5, 6)
val evens = numbers.filter(::isEven)       // odovzdaj existujúcu funkciu priamo, cez ::
val evensLambda = numbers.filter { isEven(it) }   // ekvivalentné, ale zbytočnejšie
```

`::functionName` odkazuje na existujúcu pomenovanú funkciu ako hodnotu, bez potreby ju zabaliť do
lambdy — užitočné, keď existujúca funkcia už robí presne to, čo je potrebné, bez čoho pridávať.
