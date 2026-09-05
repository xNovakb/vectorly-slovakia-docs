---
sidebar_position: 2
title: Data Classes
---

# Data Classes

**Data class** je trieda, ktorej hlavný účel je držať dáta — Kotlin automaticky generuje metódy,
ktoré takmer každá takáto trieda potrebuje, a ktoré by inak boli únavný, opakujúci sa boilerplate.

## Základná deklarácia

```kotlin
data class User(val name: String, val email: String)
```

Tento jeden riadok ti dá, zadarmo:

```kotlin
val user1 = User("Jane", "jane@example.com")
val user2 = User("Jane", "jane@example.com")

println(user1 == user2)          // true — equals() porovná hodnoty vlastností, nie identitu referencie
println(user1)                    // User(name=Jane, email=jane@example.com) — skutočný toString()
println(user1.hashCode())           // hashCode() konzistentný s equals()

val renamed = user1.copy(name = "Janet")   // copy() — nová inštancia s jedným zmeneným poľom
println(renamed)                             // User(name=Janet, email=jane@example.com)
```

Obyčajná (non-data) trieda by ti dala reference-identity `equals` (`user1 == user2` by bolo
`false` aj s identickými poľami), zbytočný predvolený `toString()` (niečo ako `User@1a2b3c4d`), a
žiadny `copy()` vôbec — písať toto všetko ručne pre každý jednoduchý data holder je presne ten
boilerplate, ktorý data classes eliminujú.

## Destructuring

```kotlin
val user = User("Jane", "jane@example.com")
val (name, email) = user

println(name)     // "Jane"
println(email)      // "jane@example.com"
```

Destructuring funguje, lebo data class automaticky generuje `component1()`, `component2()`, atď.
— jednu na vlastnosť konštruktora, v poradí deklarácie. Toto je aj to, čo robí destructuring
čistým v cykle:

```kotlin
val users = listOf(User("Jane", "jane@example.com"), User("Bob", "bob@example.com"))
for ((name, email) in users) {
    println("$name: $email")
}
```

## `copy()` pre nemenné aktualizácie

```kotlin
data class Order(val id: Int, val status: String, val total: Double)

val order = Order(1, "pending", 99.99)
val shipped = order.copy(status = "shipped")     // zmení sa len status, id/total sa prenesú
```

`copy()` je idiomatický spôsob "aktualizácie" nemennej data class — namiesto mutovania originálu
dostaneš novú inštanciu len so zmenenými špecifikovanými poľami. Tento vzor je obzvlášť
prirodzený, akonáhle je data class použitá ako DTO vo web vrstve, pokryté konkrétne v
[Data Classes ako DTOs](/sk/study-materials/kotlin/kotlin-spring-boot/data-access/kotlin-entities-and-jpa-gotchas)
v téme Kotlin + Spring Boot.

## Čo data classes vyžadujú, a ich reálne limity

```kotlin
data class Point(val x: Int, val y: Int)    // ✅ aspoň jeden parameter konštruktora povinný

// data class Empty()                         ❌ chyba kompilácie — potrebuje aspoň jednu vlastnosť
```

:::note
Data classes a dedičnosť sa dobre nemiešajú — data class môže rozšíriť inú triedu, ale nemôže byť
rozšírená inou, a dedenie equality sémantiky naprieč hierarchiou zvykne produkovať mätúce, ľahko
pokaziteľné `equals()` správanie. Ak potrebuješ hierarchiu súvisiacich typov,
[sealed class hierarchia](/sk/study-materials/kotlin/kotlin-idioms/classes-advanced/sealed-classes-and-when)
(v téme Kotlin Idioms & Advanced Features) je zvyčajne vhodnejší nástroj, než sa snažiť rozšíriť
data class.
:::

## Kedy NESIAHAŤ po data class

Trieda so skutočným správaním/invariantmi na ochranu (nie len data holder), alebo taká, ktorá
potrebuje reference identity sémantiku (dve inštancie by mali byť považované za odlišné aj s
identickými hodnotami polí — zriedkavé, ale stáva sa to, napr. niektoré entity-tracking scenáre),
je znak, že obyčajná trieda (pozri [Triedy a Konštruktory](./classes-and-constructors.md)) je
lepší fit, nie data class.
