---
sidebar_position: 3
title: Objects a Companion Objects
---

# Objects a Companion Objects

Kotlin nemá vôbec kľúčové slovo `static` — tri súvisiace `object` konštrukty pokrývajú všetko,
na čo Java používa `static`, plus skutočné singletony ako plnohodnotnú jazykovú funkciu.

## `object` deklarácie — vstavané singletony

```kotlin
object AppConfig {
    val version = "1.0.0"
    var debugMode = false

    fun printInfo() {
        println("App version: $version, debug: $debugMode")
    }
}

AppConfig.printInfo()          // žiadna inštanciácia netreba — existuje presne jedna inštancia, navždy
AppConfig.debugMode = true
```

`object` deklarácia definuje triedu **a** vytvorí jej jedinú inštanciu súčasne, lazy
inicializovanú pri prvom prístupe, thread-safe podľa konštrukcie — žiadny manuálny singleton
pattern (private konštruktor + static instance field + getInstance() metóda) netreba tak, ako to
vyžaduje Java.

## Companion objects — najbližšie k Java `static`

```kotlin
class User private constructor(val name: String, val email: String) {
    companion object {
        fun create(name: String, email: String): User {
            require(email.contains("@")) { "Invalid email" }
            return User(name, email)
        }

        const val DEFAULT_DOMAIN = "example.com"
    }
}

val user = User.create("Jane", "jane@example.com")    // volané ako static metóda
println(User.DEFAULT_DOMAIN)                              // pristupné ako static field
```

`companion object` je skutočný objekt *asociovaný s* triedou (dostupný cez meno triedy priamo,
`User.create(...)` namiesto `User.Companion.create(...)`) — bežne používaný pre factory funkcie
(ako vyššie), konštanty, a utility funkcie logicky viazané na tú konkrétnu triedu.

## Prečo factory funkcia v companion object, nie verejný konštruktor

```kotlin
class User private constructor(val name: String, val email: String) {
    companion object {
        fun create(name: String, email: String): User? {
            if (!email.contains("@")) return null    // validácia môže elegantne zlyhať, na rozdiel od konštruktora
            return User(name, email)
        }
    }
}
```

Konštruktor nemôže vrátiť `null` alebo iný subtyp — factory funkcia v companion object môže, čo
dáva skutočnú flexibilitu, ktorú konštruktor štrukturálne nemôže: vrátenie `null` pri neplatnom
vstupe, cachovanie/znovupoužitie inštancií, alebo vrátenie inej implementácie na základe
argumentov.

## Object expressions — anonymné objekty

```kotlin
val clickListener = object {
    fun onClick() = println("Clicked!")
}

interface Comparator2<T> {
    fun compare(a: T, b: T): Int
}

val byLength = object : Comparator2<String> {
    override fun compare(a: String, b: String) = a.length - b.length
}
```

**Object expression** vytvorí jednorazovú, anonymnú inštanciu presne tam, kde je použitá —
Kotlin ekvivalent Java anonymous inner classes, najčastejšie použitý pri implementovaní
jednorazovej implementácie interface priamo namiesto definovania celej pomenovanej triedy preň.

## Zhrnutie: tri formy

```text
object Name { ... }                — pomenovaný singleton, jedna inštancia navždy, pristupný podľa mena
class X { companion object { ... } } — static-like členy viazané na konkrétnu triedu
object : SomeInterface { ... }        — anonymná, jednorazová inštancia ("object expression")
```

Všetky tri sa pod kapotou skompilujú do skutočných JVM tried — toto je čisto Kotlin syntax
robiaca patterny, na ktoré Java vyžaduje manuálny boilerplate (singleton, static členy, anonymné
triedy), plnohodnotnými, stručnými jazykovými funkciami.
