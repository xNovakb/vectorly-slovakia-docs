---
sidebar_position: 2
title: Funkcionálne Operácie
---

# Funkcionálne Operácie

Standard library Kotlinu dáva kolekciám bohatú sadu funkcionálne-štýlových operácií — stavajúc
priamo na lambdách a higher-order funkciách (pozri
[Lambdy a Higher-Order Funkcie](../02-functions-and-control-flow/lambdas-and-higher-order-functions.md))
aby ti umožnili popísať *akú* transformáciu chceš namiesto ručného písania cyklov preň.

## `map` — transformuj každý prvok

```kotlin
val numbers = listOf(1, 2, 3, 4)
val doubled = numbers.map { it * 2 }        // [2, 4, 6, 8]

val names = listOf("jane", "bob")
val capitalized = names.map { it.replaceFirstChar(Char::uppercase) }   // ["Jane", "Bob"]
```

## `filter` — ponechaj prvky spĺňajúce podmienku

```kotlin
val numbers = listOf(1, 2, 3, 4, 5, 6)
val evens = numbers.filter { it % 2 == 0 }     // [2, 4, 6]
val odds = numbers.filterNot { it % 2 == 0 }     // [1, 3, 5]
```

## `reduce` a `fold` — skombinuj do jednej hodnoty

```kotlin
val numbers = listOf(1, 2, 3, 4)

val sum = numbers.reduce { acc, n -> acc + n }        // 10 — začína prvým prvkom
val sumWithStart = numbers.fold(100) { acc, n -> acc + n }   // 110 — začína explicitnou počiatočnou hodnotou
```

`fold` a `reduce` robia rovnakú prácu, ale `fold` vyžaduje explicitnú počiatočnú hodnotu (a preto
môže produkovať *iný typ* než sú prvky kolekcie — napr. skladanie čísel do `String`), zatiaľ čo
`reduce` použije vlastný prvý prvok kolekcie ako začiatok a zlyhá na prázdnej kolekcii (`reduce`
na prázdnom liste hodí výnimku; `fold` nie, keďže už má počiatočnú hodnotu bez ohľadu na to).

## `sortedBy` a príbuzné

```kotlin
data class Person(val name: String, val age: Int)

val people = listOf(Person("Bob", 30), Person("Jane", 25))

val byAge = people.sortedBy { it.age }              // vzostupne podľa veku
val byAgeDesc = people.sortedByDescending { it.age }  // zostupne podľa veku
val byName = people.sortedBy { it.name }                // abecedne
```

## Reťazenie operácií

```kotlin
val result = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    .filter { it % 2 == 0 }      // [2, 4, 6, 8, 10]
    .map { it * it }               // [4, 16, 36, 64, 100]
    .filter { it > 20 }              // [36, 64, 100]
    .sum()                             // 200
```

Reťazenie sa číta zhora nadol ako pipeline transformácií — naozaj ľahšie sledovateľné než
ekvivalentná vnorená/ručná verzia cyklu, a presne tento reťaziaci štýl je to, čo
[Sequences](./sequences.md) (ďalšia stránka) ďalej optimalizuje pre väčšie kolekcie.

## Ďalšie bežné operácie

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

println(numbers.any { it > 3 })       // true — aspoň jeden matchuje
println(numbers.all { it > 0 })         // true — každý prvok matchuje
println(numbers.none { it > 10 })         // true — žiaden prvok nematchuje
println(numbers.count { it % 2 == 0 })      // 2
println(numbers.groupBy { it % 2 == 0 })      // {false=[1, 3, 5], true=[2, 4]}
println(numbers.associateWith { it * it })      // {1=1, 2=4, 3=9, 4=16, 5=25}
```

## Prečo na tomto záleží nad rámec stručnosti

Nad rámec toho, že je kratšie než ručne napísaný cyklus, každé z týchto pomenuje svoj *zámer*
priamo — `filter` hovorí "ponechávam niektoré prvky," `map` hovorí "transformujem každý prvok,"
spôsobom, akým generický `for` cyklus s `if` vnútri nekomunikuje na prvý pohľad. Čítanie reťaze
týchto ti povie, čo kód *robí*, skôr než musíš prejsť mechanikou cyklu, aby si to sám zistil.
