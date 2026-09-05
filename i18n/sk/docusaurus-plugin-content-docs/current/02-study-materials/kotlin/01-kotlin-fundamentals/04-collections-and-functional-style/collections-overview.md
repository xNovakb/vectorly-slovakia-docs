---
sidebar_position: 1
title: Prehľad Kolekcií
---

# Prehľad Kolekcií

## Tri základné typy kolekcií

```kotlin
val list = listOf(1, 2, 3)           // usporiadaná, dovoľuje duplicity
val set = setOf(1, 2, 3)               // neusporiadaná, žiadne duplicity
val map = mapOf("a" to 1, "b" to 2)      // key-value páry
```

Všetky tri stavajú na štandardných JVM kolekčných typoch pod kapotou (`ArrayList`, `HashSet`,
`HashMap` predvolene) — príspevok Kotlinu je API povrch navrstvený navrch, nie znovuvynájdený
mechanizmus úložiska.

## Mutovateľné vs. read-only rozhrania — skutočná dizajnová voľba Kotlinu

```kotlin
val readOnly: List<Int> = listOf(1, 2, 3)
// readOnly.add(4)                        ❌ chyba kompilácie — List nemá add() vôbec

val mutable: MutableList<Int> = mutableListOf(1, 2, 3)
mutable.add(4)                              // ✅ v poriadku — MutableList rozširuje List, pridáva mutujúce metódy
```

Toto je skutočné, zámerné rozhodnutie API dizajnu, nie len menovacia konvencia: `List` (a
`Set`/`Map`) naozaj nemajú žiadne mutujúce metódy vo svojom rozhraní vôbec — `MutableList` je
*samostatné* rozhranie, ktoré rozširuje `List` a pridáva ich. Funkcia, ktorá len potrebuje čítať
kolekciu, by mala brať obyčajný `List` parameter, signalizujúc volajúcim (a kompilátoru), že
nezmení, čo bolo odovzdané:

```kotlin
fun printAll(items: List<String>) {    // volajúci vie, že táto funkcia nemôže mutovať jeho list
    items.forEach { println(it) }
}
```

:::note
Toto **nie je** skutočná nemennosť tak, ako `val` nie je skutočná nemennosť pre objekt, na ktorý
odkazuje (pozri [Premenné a Typy](../01-basics/variables-and-types.md)) — `List` referencia by
stále mohla ukazovať na objekt, ktorý je v skutočnosti pod kapotou `MutableList`, a niečo iné
držiace referenciu na ten istý podkladový `MutableList` by ho stále mohlo mutovať. `List`
zabraňuje mutácii *cez túto konkrétnu referenciu*, nie garancia, že podkladová kolekcia sa nikdy
nemôže zmeniť.
:::

## Vytváranie kolekcií

```kotlin
val empty = emptyList<String>()
val fromValues = listOf("a", "b", "c")
val fromRange = (1..5).toList()

val mutableEmpty = mutableListOf<String>()
val mutableFromValues = mutableListOf("a", "b", "c")
```

## Bežné operácie

```kotlin
val list = listOf(1, 2, 3, 4, 5)

println(list.size)              // 5
println(list.first())             // 1
println(list.last())               // 5
println(list.contains(3))            // true
println(list[2])                       // 3 — prístup podľa indexu
println(list.isEmpty())                  // false
println(list.getOrNull(10))                // null — bezpečný indexovaný prístup, žiadna výnimka
```

## Konkrétne Maps

```kotlin
val ages = mapOf("Jane" to 30, "Bob" to 25)

println(ages["Jane"])            // 30
println(ages["Unknown"])           // null — chýbajúci kľúč vráti null, nehodí výnimku
println(ages.getOrDefault("Unknown", 0))   // 0

for ((name, age) in ages) {          // destructuring funguje aj tu, pozri Data Classes
    println("$name is $age")
}
```

`to` je tu vlastne infix funkcia vytvárajúca `Pair` — `"Jane" to 30` je ekvivalentné
`Pair("Jane", 30)`, len čitateľnejšie pri budovaní map literálu.

## Kam toto vedie

[Funkcionálne Operácie](./functional-operations.md) pokrýva transformáciu kolekcií
(`map`/`filter`/`reduce`) — časť Kotlin kolekcií, ktorá najviac mení, ako sa kód naozaj píše,
dennodenne.
