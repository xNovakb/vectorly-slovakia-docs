---
sidebar_position: 1
title: Triedy a Konštruktory
---

# Triedy a Konštruktory

## Primárny konštruktor

```kotlin
class User(val name: String, val email: String)
```

Tento jeden riadok deklaruje triedu **a** jej konštruktor **a** dve read-only vlastnosti — žiadne
samostatné deklarácie polí, žiadne samostatné telo konštruktora, žiadny boilerplate getterov.
`val`/`var` v zozname parametrov konštruktora je to, čo premení parameter na skutočnú vlastnosť.

```kotlin
val user = User("Jane", "jane@example.com")
println(user.name)    // "Jane" — skutočná vlastnosť, nie len parameter konštruktora
```

Bez `val`/`var` je parameter konštruktora len obyčajný parameter, nie vlastnosť:

```kotlin
class Logger(prefix: String) {    // prefix NIE JE vlastnosť — použiteľný len vnútri init/metód
    val fullPrefix = "[$prefix]"    // musí byť explicitne zachytený do skutočnej vlastnosti, ak treba neskôr
}
```

## `init` bloky

```kotlin
class User(val name: String, val email: String) {
    init {
        require(email.contains("@")) { "Invalid email: $email" }
        println("Created user: $name")
    }
}
```

`init` bloky bežia ako súčasť konštrukcie, v poradí, v akom sa objavujú relatívne k deklaráciám
vlastností — užitočné pre validáciu alebo setup logiku, ktorá sa nezmestí do zoznamu parametrov
konštruktora samotného. `require`/`check` (hádžuce `IllegalArgumentException`/`IllegalStateException`)
sú idiomatický spôsob validácie argumentov konštruktora.

## Sekundárne konštruktory

```kotlin
class User(val name: String, val email: String) {
    var isGuest: Boolean = false

    constructor(name: String) : this(name, "no-email@example.com") {
        isGuest = true
    }
}

val registered = User("Jane", "jane@example.com")
val guest = User("Anonymous")    // použije sekundárny konštruktor
```

Každý sekundárny konštruktor musí nakoniec delegovať na primárny konštruktor (`: this(...)`) —
Kotlin nedovoľuje triede mať plne nezávislé konštrukčné cesty, ktoré preskočia logiku primárneho
konštruktora. V praxi predvolené parametre (pozri
[Základy Funkcií](../02-functions-and-control-flow/functions-basics.md)) pokrývajú rovnakú
potrebu častejšie, čo robí sekundárne konštruktory menej bežnými v idiomatickom Kotline než v
Jave.

## Vlastné gettery a settery

```kotlin
class Rectangle(val width: Double, val height: Double) {
    val area: Double
        get() = width * height          // vypočítaná vlastnosť, žiadne backing field vôbec
}

class Person(name: String) {
    var name: String = name
        set(value) {
            field = value.trim()          // `field` odkazuje na skutočné backing úložisko
        }
}
```

`area` tu nie je uložená — je prepočítaná zakaždým, keď je prečítaná, z `width`/`height`. `field`
vnútri vlastného setteru je špeciálny identifikátor odkazujúci na skutočné backing úložisko
vlastnosti, odlišný od samotného mena vlastnosti (použitie `name = value` vnútri vlastného
setteru `name` by rekurzovalo donekonečna).

## Členy triedy: vlastnosti a metódy spolu

```kotlin
class BankAccount(private val owner: String, private var balance: Double) {
    fun deposit(amount: Double) {
        require(amount > 0) { "Deposit must be positive" }
        balance += amount
    }

    fun withdraw(amount: Double) {
        check(amount <= balance) { "Insufficient funds" }
        balance -= amount
    }

    fun getBalance(): Double = balance
}
```

`private` na parametri/vlastnosti konštruktora obmedzí ho na samotnú triedu, rovnaký význam
viditeľnosti ako v Jave — predvolená viditeľnosť Kotlinu (bez ničoho špecifikovaného) je
`public`, na rozdiel od predvolenej package-private v Jave.

Pozri [Data Classes](./data-classes.md) ďalej pre konkrétny, extrémne bežný prípad triedy, ktorá
je hlavne len držiteľom dát.
