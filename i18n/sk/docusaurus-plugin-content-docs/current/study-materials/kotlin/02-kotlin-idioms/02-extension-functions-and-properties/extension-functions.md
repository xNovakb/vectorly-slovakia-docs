---
sidebar_position: 1
title: Extension Funkcie
---

# Extension Funkcie

Extension funkcia ti umožní pridať funkciu k existujúcemu typu — vrátane typov, ktoré nevlastníš,
ako triedy zo štandardnej knižnice alebo knižnice tretej strany — bez dedenia od nej alebo úpravy
jej zdrojového kódu.

## Definovanie

```kotlin
fun String.isPalindrome(): Boolean {
    val cleaned = this.lowercase().filter { it.isLetter() }
    return cleaned == cleaned.reversed()
}

"racecar".isPalindrome()   // true
"Hello".isPalindrome()      // false
```

Vnútri funkcie `this` odkazuje na **receiver** — inštanciu, na ktorej sa extension volá (tu
`String`). Volaná normálnou syntaxou metódy, na mieste volania nerozoznateľná od "skutočnej"
členskej funkcie.

## Realistickejšie príklady

```kotlin
fun List<Int>.average2Decimals(): String {
    return "%.2f".format(this.average())
}

fun <T> List<T>.secondOrNull(): T? = if (size >= 2) this[1] else null

fun Int.isEven(): Boolean = this % 2 == 0
```

```kotlin
val scores = listOf(85, 92, 78, 95)
println(scores.average2Decimals())    // "87.50"
println(scores.secondOrNull())         // 92
println(4.isEven())                     // true
```

## Prečo na tom záleží nad rámec pohodlia

Extension funkcie sú spôsob, akým samotná štandardná knižnica Kotlinu pridáva toľko
funkcionality k základným typom (`String`, `List`, `Int`) bez toho, aby tieto triedy museli byť
predizajnované alebo znovu otvorené — `filter`, `map`, `firstOrNull` na kolekciách sú samotné
extension funkcie, nie zabudované priamo do tried kolekcií. Rovnaký mechanizmus je plne dostupný
pre vlastný kód.

## Kritický háčik: extensions sa resolvujú staticky, nie polymorfne

:::warning
Na rozdiel od skutočnej členskej funkcie, ktorá je resolvovaná na základe **skutočného runtime
typu** objektu (dynamický dispatch), extension funkcia je resolvovaná na základe
**deklarovaného/statického typu** premennej — určeného počas kompilácie, nie za behu. Toto je
naozaj bežný zdroj prekvapivých bugov pre kohokoľvek, kto predpokladá, že extensions sa správajú
ako zdedené metódy.
:::

```kotlin
open class Animal
class Dog : Animal()

fun Animal.speak() = "..."
fun Dog.speak() = "Woof!"

val animal: Animal = Dog()       // statický typ je Animal, skutočný objekt je Dog
println(animal.speak())            // vypíše "...", NIE "Woof!"

val dog: Dog = Dog()
println(dog.speak())                // vypíše "Woof!" — statický typ je tu SKUTOČNE Dog
```

Skutočný (členský) override `speak()` na `Dog` by *v oboch prípadoch* vypísal `"Woof!"` — takto
normálne funguje polymorfizmus. Extension funkcie sa v tomto mechanizme vôbec nezúčastňujú; ktorá
extension sa zavolá, rozhoduje čisto deklarovaný typ premennej na mieste volania, resolvovaný
počas kompilácie, rovnako ako pri akejkoľvek obyčajnej preťaženej funkcii.

## Kedy siahnuť po extension vs. členskej funkcii

```text
Použi extension keď:
  - Nevlastníš triedu (stdlib typ, trieda knižnice tretej strany)
  - Funkcia je čistá, samostatná operácia, ktorá nepotrebuje prístup k privátnemu stavu
  - Chceš pridať "utility" správanie bez nafukovania pôvodnej triedy

Preferuj skutočnú členskú funkciu keď:
  - Vlastníš triedu a funkcia je jadrom toho, ČÍM tento typ je, nie len pohodlie
  - Potrebuje polymorfné (prepísateľné) správanie — pozri háčik vyššie
  - Potrebuje prístup k privátnym členom triedy
```

Pozri [Extension Vlastnosti](./extension-properties.md) pre ekvivalent tohto mechanizmu pre
vlastnosti, a [Scoped Extensions a Receivery](./scoped-extensions-and-receivers.md) pre extension
funkcie, ktoré samotné berú lambdu s receiverom — základ Kotlin DSL, pokrytý podrobne v
[Budovanie DSL](../05-building-dsls/dsl-basics.md).
