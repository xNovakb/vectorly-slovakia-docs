---
sidebar_position: 1
title: Základy Funkcií
---

# Základy Funkcií

## Základná syntax

```kotlin
fun add(a: Int, b: Int): Int {
    return a + b
}

fun greet(name: String) {    // žiadny návratový typ = vracia Unit (pozri Premenné a Typy)
    println("Hello, $name!")
}
```

## Single-expression funkcie

```kotlin
fun add(a: Int, b: Int): Int = a + b       // žiadne zložené zátvorky, žiadny explicitný `return`
fun square(x: Int) = x * x                   // návratový typ odvodený ako Int
```

Keď je telo funkcie jeden výraz, `= expression` úplne nahradí blok `{ return ... }` — naozaj
bežné v idiomatickom Kotline pri krátkych funkciách, nie len roztomilá skratka. Návratový typ sa
dá dokonca vynechať, odvodený z výrazu, hoci explicitný typ je stále dobrá prax na verejnom API.

## Predvolené parametre

```kotlin
fun greet(name: String, greeting: String = "Hello") {
    println("$greeting, $name!")
}

greet("Jane")                    // "Hello, Jane!"
greet("Jane", "Hi")               // "Hi, Jane!"
```

Predvolené parametre eliminujú obrovské množstvo Java method-overloading boilerplatu (písanie
troch overloadov tej istej metódy len na podporu voliteľných parametrov) — jedna definícia
funkcie pokryje každý tvar volania, ktorý jednoducho vynechá koncové defaultované parametre.

## Pomenované argumenty

```kotlin
fun createUser(name: String, email: String, isAdmin: Boolean = false) { /* ... */ }

createUser(name = "Jane", email = "jane@example.com", isAdmin = true)
createUser(email = "jane@example.com", name = "Jane")    // na poradí nezáleží s pomenovanými argumentmi
```

Obzvlášť hodnotné v kombinácii s predvolenými parametrami — vieš nastaviť parameter hlboko v
zozname bez potreby opakovať každý default pred ním:

```kotlin
fun connect(host: String, port: Int = 443, timeout: Int = 30, retries: Int = 3) { /* ... */ }

connect("example.com", retries = 5)    // preskoč port/timeout, prepíš len retries
```

## Varargs

```kotlin
fun sum(vararg numbers: Int): Int = numbers.sum()

sum(1, 2, 3)              // 6
sum(1, 2, 3, 4, 5)          // 15

val nums = intArrayOf(1, 2, 3)
sum(*nums)                    // spread operátor (*) na odovzdanie poľa ako varargs
```

## Funkcie ako top-level deklarácie

```kotlin title="Utils.kt"
fun formatCurrency(amount: Double): String = "$${"%.2f".format(amount)}"
```

Na rozdiel od Javy, Kotlin funkcia vôbec nemusí žiť vnútri triedy — obyčajná top-level funkcia v
`.kt` súbore je úplne platná, a bežná pre utility funkcie, ktoré prirodzene nepatria žiadnemu
konkrétnemu typu. [Extension Functions](/sk/study-materials/kotlin/kotlin-idioms/extension-functions-and-properties/extension-functions)
(v téme Kotlin Idioms & Advanced Features) stavajú na tejto istej myšlienke ďalej.

## Kam toto vedie ďalej

[Riadenie Toku](./control-flow.md) pokrýva `if`/`when` ako *výrazy* — súvisiaca myšlienka, ktorá
robí Kotlin funkcie často ešte stručnejšími než samotná single-expression forma ukázaná tu.
