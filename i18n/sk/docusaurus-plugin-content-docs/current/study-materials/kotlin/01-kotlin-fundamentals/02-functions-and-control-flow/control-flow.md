---
sidebar_position: 2
title: Riadenie Toku
---

# Riadenie Toku

## `if` ako výraz, nie len príkaz

```kotlin
// Štýl príkazu (funguje, ale nie idiomatický Kotlin pre tento prípad)
var max: Int
if (a > b) {
    max = a
} else {
    max = b
}
```

```kotlin
// Štýl výrazu — idiomatický Kotlin
val max = if (a > b) a else b
```

V Kotline `if` **produkuje hodnotu** — neexistuje samostatný ternárny operátor (`? :`) tak, ako
ho má Java, lebo `if`/`else` ako výraz už pokrýva presne tento use case. Toto nie je len kratšia
syntax; posúva kód smerom k "vypočítaj hodnotu" namiesto "mutuj premennú naprieč vetvami," čo
zvykne produkovať menej bugov zo zabudnutej vetvy.

## `when` ako výraz

```kotlin
val description = when (score) {
    in 90..100 -> "Excellent"
    in 70..89 -> "Good"
    in 50..69 -> "Passing"
    else -> "Failing"
}
```

`when` je náhrada Kotlinu za Java `switch` — ale oveľa schopnejšia: matchuje rozsahy, typy,
ľubovoľné boolean podmienky, a viacero hodnôt na vetvu, nie len konštanty.

```kotlin
fun describe(x: Any): String = when (x) {
    is Int -> "an integer: $x"          // type check + smart cast, pozri Null Safety
    is String -> "a string of length ${x.length}"
    0, 1 -> "zero or one"                  // viacero hodnôt, jedna vetva
    else -> "something else"
}
```

`else` vetva je **povinná** na `when` výraze (použitom ako hodnota), pokiaľ kompilátor nevie
dokázať, že každý prípad je pokrytý — presne vlastnosť, ktorú
[Sealed Classes](/sk/study-materials/kotlin/kotlin-idioms/classes-advanced/sealed-classes-and-when)
(v téme Kotlin Idioms & Advanced Features) využívajú, aby spravili `when` exhaustívny bez `else`
vôbec.

## Rozsahy

```kotlin
val range = 1..10                  // vrátane: 1, 2, ..., 10
val exclusive = 1 until 10           // bez konca: 1, 2, ..., 9
val stepped = 1..10 step 2             // 1, 3, 5, 7, 9
val reversed = 10 downTo 1               // 10, 9, ..., 1

if (age in 18..65) { /* ... */ }           // rozsahy fungujú priamo aj v boolean kontrolách
```

## `for` cykly

```kotlin
for (i in 1..5) {
    println(i)
}

val names = listOf("Jane", "Bob", "Alice")
for (name in names) {
    println(name)
}

for ((index, name) in names.withIndex()) {    // index + hodnota spolu
    println("$index: $name")
}
```

Kotlin nemá vôbec klasický C-style `for (int i = 0; i < n; i++)` cyklus — rozsahy a iterables
pokrývajú túto potrebu bezpečnejšie (žiadne off-by-one chyby indexu na spravenie v hlavičke
cyklu samotnej).

## `while` a `do-while`

```kotlin
var count = 0
while (count < 5) {
    println(count)
    count++
}

do {
    println(count)
    count--
} while (count > 0)
```

Správajú sa presne ako v Jave — hlavný odklon od známeho riadenia toku v Kotline je naozaj
`if`/`when` ako výrazy, nie samotné loop konštrukty.
