---
sidebar_position: 2
title: Premenné a Typy
---

# Premenné a Typy

## `val` vs. `var`

```kotlin
val name = "Jane"       // read-only referencia — nedá sa priradiť znova
var count = 0             // mutovateľná referencia — dá sa priradiť znova

count = 1                   // v poriadku
name = "Bob"                  // chyba kompilácie: val sa nedá priradiť znova
```

`val` nutne neznamená, že podkladový objekt je nemenný — znamená, že *referencia* nemôže byť
priradená, aby ukazovala na niečo iné:

```kotlin
val list = mutableListOf(1, 2, 3)
list.add(4)          // v poriadku — mutuje objekt, na ktorý list ukazuje
list = mutableListOf()  // chyba kompilácie — samotný val sa nedá priradiť znova
```

Predvolene používaj `val`, pokiaľ nemáš konkrétny dôvod potrebovať opätovné priradenie — toto je
naozaj idiomatický Kotlin zvyk, nie len štýlová preferencia, keďže robí kód ľahšie sledovateľným
(o `val` vieš, že sa nezmenil, kým ho neskôr v tej istej funkcii prečítaš).

## Základné typy

```kotlin
val age: Int = 30
val price: Double = 19.99
val initial: Char = 'J'
val isActive: Boolean = true
val name: String = "Jane"
val bigNumber: Long = 10_000_000_000L
```

Na rozdiel od Javy, Kotlin nemá **žiadne primitívne typy viditeľné v zdrojovom kóde** — `Int`,
`Boolean`, atď. sú všetko skutočné typy s metódami, a kompilátor rozhodne, či ich reprezentovať
ako JVM primitívy alebo boxed objekty pod kapotou, na základe kontextu (nullable `Int?` musí byť
boxed, keďže JVM primitívy nemôžu byť null — pozri [Null Safety](./null-safety.md)).

## Type inference

```kotlin
val name = "Jane"        // odvodené ako String, anotácia netreba
val age = 30                // odvodené ako Int
val price = 19.99             // odvodené ako Double

val explicit: String = "Jane"   // explicitná anotácia, dovolená, ale zvyčajne zbytočná
```

Type inference nie je "žiadne typy" — je to kompilátor určujúci typ v čase kompilácie, presne tak
prísne kontrolovaný, ako keby si ho napísal explicitne. Anotácia sa oplatí pridať, keď by odvodený
typ nebol čitateľovi zrejmý, alebo na signatúre funkcie verejného API kvôli jasnosti, ale inak je
to zvyčajne len šum.

## String templates

```kotlin
val name = "Jane"
val age = 30

println("Hello, $name! You are $age years old.")     // jednoduchá referencia na premennú
println("Next year you'll be ${age + 1}.")               // výraz vnútri ${}
println("Name in caps: ${name.uppercase()}")               // volania metód fungujú tiež
```

String templates nahrádzajú neohrabanú konkatenáciu Javy `"Hello, " + name + "!"` — `$variable`
pre jednoduchú referenciu, `${expression}` pre čokoľvek zložitejšie než holé meno premennej.

## `Any`, `Unit`, a `Nothing` — tri špeciálne typy

```kotlin
fun printSomething(): Unit {    // Unit = "nevracia nič zmysluplné", ako Java void
    println("hi")
}                                  // Unit je predvolený návratový typ, zvyčajne úplne vynechaný

fun describe(x: Any): String {    // Any = koreň typovej hierarchie Kotlinu (ako Java Object)
    return x.toString()
}

fun fail(): Nothing {              // Nothing = funkcia, ktorá sa nikdy normálne nevráti
    throw IllegalStateException()   // (vždy hodí, alebo beží navždy) — užitočné pre exhaustívnosť
}
```

`Nothing` sa objaví viac, než by sa mohlo zdať — je to návratový typ, ktorý Kotlin odvodí pre
vetvu, ktorá vždy hodí výnimku, čo je presne to, čo umožňuje kompilátoru stále považovať `when`
výraz za exhaustívny aj keď jedna vetva len hodí výnimku namiesto vrátenia hodnoty (pozri
[Riadenie Toku](../02-functions-and-control-flow/control-flow.md)).
