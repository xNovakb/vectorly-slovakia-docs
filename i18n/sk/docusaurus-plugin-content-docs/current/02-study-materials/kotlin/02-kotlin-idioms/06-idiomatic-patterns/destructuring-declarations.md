---
sidebar_position: 1
title: Destructuring Declarations
---

# Destructuring Declarations

Destructuring rozbalí objekt do viacerých premenných v jednom výraze — známa syntax, ak si ju
používal v JavaScripte/Pythone, ale v Kotline je poháňaná konkrétnou, rozšíriteľnou konvenciou
namiesto špeciálneho zaobchádzania s pár vstavanými typmi.

## Základná syntax

```kotlin
data class Point(val x: Int, val y: Int)

val point = Point(3, 4)
val (x, y) = point

println("x=$x, y=$y")    // x=3, y=4
```

## Prečo toto funguje konkrétne pre data classes

```kotlin
data class Point(val x: Int, val y: Int)
// kompilátor automaticky vygeneruje:
// operator fun component1() = x
// operator fun component2() = y
```

`data class` automaticky vygeneruje `componentN()` funkcie pre každú konštruktorovú vlastnosť —
destructuring `val (x, y) = point` je naozaj len sugar pre
`val x = point.component1(); val y = point.component2()`. Presne preto destructuring funguje pre
data classes bez akejkoľvek extra práce, a prečo *nefunguje* pre obyčajnú (non-`data`) triedu bez
definovaných `componentN()` funkcií.

## Sprístupnenie obyčajnej triedy pre destructuring

```kotlin
class Point(val x: Int, val y: Int) {
    operator fun component1() = x
    operator fun component2() = y
}
```

Akákoľvek trieda — nielen `data class` — sa stane destructurovateľnou jednoducho definovaním
vlastných `operator fun componentN()` funkcií, nasledujúc rovnakú konvenciu, akú
[operator overloading](../05-building-dsls/operator-overloading.md) pokrýva všeobecne. Presne
takto `Map.Entry` podporuje `for ((key, value) in map)` — `Map.Entry` definuje `component1()`
vracajúci kľúč a `component2()` vracajúci hodnotu.

## Destructuring v cykloch

```kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
for ((key, value) in map) {
    println("$key -> $value")
}
```

```kotlin
val pairs = listOf(1 to "one", 2 to "two")
for ((number, word) in pairs) {
    println("$number is $word")
}
```

## Destructuring v parametroch lambdy

```kotlin
val points = listOf(Point(1, 2), Point(3, 4))
points.forEach { (x, y) -> println("($x, $y)") }
```

## Preskočenie komponentov, ktoré nepotrebuješ

```kotlin
data class UserRecord(val id: String, val name: String, val email: String, val createdAt: Long)

val (id, name, _, createdAt) = userRecord    // podčiarknik preskočí `email`
```

## Reálna past: destructuring je **poziční**, nie pomenovaný

:::warning
Na rozdiel od destructuringu podľa pomenovaných polí v niektorých iných jazykoch, destructuring
Kotlinu matchuje `componentN()` funkcie čisto podľa **pozície**, nie podľa mena vlastnosti.
Preusporiadanie parametrov konštruktora data class potichu zmení, čo každá destructurovaná
premenná naozaj dostane na každom mieste volania, ktoré ju destructuruje — bez chyby kompilácie,
keďže typy sa stále môžu zhodovať.
:::

```kotlin
data class User(val name: String, val email: String)
// neskôr niekto preusporiada konštruktor:
data class User(val email: String, val name: String)

val (name, email) = user    // ❌ teraz potichu prehodené! `name` naozaj drží email, a naopak
```

Ak sú oba polia rovnaký typ (tu `String` a `String`), toto sa čisto skompiluje a potichu zlyhá —
skutočný argument buď pre udržanie stabilného poradia polí destructurovaných data classes, alebo
uprednostnenie explicitného prístupu `.name`/`.email` pred destructuringom, keď poradie polí nie
je pevne kontrolované.
