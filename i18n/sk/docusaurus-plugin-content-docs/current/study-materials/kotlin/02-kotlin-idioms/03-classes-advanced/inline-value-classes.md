---
sidebar_position: 2
title: Inline a Value Classes
---

# Inline a Value Classes

`value class` obalí jednu hodnotu do type-safe wrappera, ktorý má vo väčšine prípadov **nulovú
runtime réžiu** v porovnaní s priamym použitím surového podkladového typu — wrapper existuje počas
kompilácie kvôli typovej bezpečnosti, ale za behu je často zahladený (erased).

## Problém, ktorý toto rieši

```kotlin
❌ fun transferMoney(fromAccountId: String, toAccountId: String, amount: String) { ... }

transferMoney(amount, toAccountId, fromAccountId)   // skompiluje sa fajn — argumenty prehodené, potichu zle
```

Použitie obyčajného `String` pre tri sémanticky odlišné veci (dve account ID a sumu) znamená, že
kompilátor nevie zachytiť chybu v poradí argumentov — z pohľadu typového systému sú všetky len
`String`.

## Obalenie value class

```kotlin
@JvmInline
value class AccountId(val value: String)

@JvmInline
value class Money(val cents: Long)

fun transferMoney(fromAccountId: AccountId, toAccountId: AccountId, amount: Money) { ... }
```

```kotlin
transferMoney(amount, toAccountId, fromAccountId)   // ❌ teraz CHYBA KOMPILÁCIE — typy sa nezhodujú
transferMoney(fromAccountId, toAccountId, amount)     // ✅ správne, a teraz vynucované kompilátorom
```

Presne tá istá chyba v poradí argumentov je teraz zachytená počas kompilácie, lebo `AccountId` a
`Money` sú odlišné typy, aj keď každý pod tým obaľuje primitívny typ.

## Prečo "nulová réžia" — čo sa naozaj deje za behu

```kotlin
@JvmInline
value class AccountId(val value: String)

fun printId(id: AccountId) = println(id.value)
```

Vo väčšine kontextov kompilátor wrapper **inline-uje** úplne preč — na úrovni bytecode
`AccountId` väčšinou neexistuje ako samostatný boxovaný objekt; správa sa, akoby bol priamo
odovzdaný surový `String`. Dostaneš compile-time typovú bezpečnosť odlišného wrapper typu, bez
runtime nákladov (extra alokácia, extra nepriamosť), ktoré by obyčajná wrapper trieda normálne
mala.

:::note
Toto inline-ovanie nie je garantované v úplne každom kontexte — value classes použité v nullable
pozíciách, ako typové parametre, alebo cez určité reflection cesty *môžu* byť stále boxované za
behu, rovnako ako primitívne typy Kotlinu (`Int`, atď.) môžu byť. Vlastnosť nulovej réžie je
bežný prípad a hlavná motivácia, nie absolútna, bezpodmienečná garancia pre každé možné použitie.
:::

## Kedy toto naozaj pomôže vs. pridá šum

```text
Naozaj pomôže:
  - ID, ktoré sa ľahko pomýlia (UserId vs. OrderId, oba obaľujúce String/Long)
  - Jednotky merania (Meters vs. Feet, Cents vs. Dollars), kde ich zámena je reálna trieda bugov
  - Akýkoľvek surový primitív, na ktorého VÝZNAME záleží viac než na jeho reprezentácii

Často len šum:
  - Jednorazový wrapper použitý presne na jednom mieste, nikdy v riziku zámeny s niečím iným
  - Obalenie niečoho, čo je už silne typované a jednoznačné
```

Hodnota tejto techniky je konkrétne v predchádzaní **zámene medzi podobne tvarovanými
primitívami** — siahni po nej, keď je toto reálne riziko v codebase, nie ako reflexný wrapper
okolo každej jednej primitívnej hodnoty.

## Pridanie validácie alebo správania

```kotlin
@JvmInline
value class Email(val address: String) {
    init {
        require(address.contains("@")) { "Invalid email: $address" }
    }

    val domain: String get() = address.substringAfter("@")
}
```

Value class môže stále mať `init` blok (vynucujúci invarianty pri konštrukcii) a vlastné
funkcie/vlastnosti — je to skutočný typ so správaním, nie len holý type alias. Toto je skutočné
rozlíšenie od `typealias`, ktorý nevytvorí žiadny nový typ vôbec, len alternatívne meno pre
existujúci — `typealias` poskytuje nulový prínos typovej bezpečnosti presne pre tento problém so
zámenou argumentov, keďže kompilátor ho stále považuje za pôvodný typ pod tým.
