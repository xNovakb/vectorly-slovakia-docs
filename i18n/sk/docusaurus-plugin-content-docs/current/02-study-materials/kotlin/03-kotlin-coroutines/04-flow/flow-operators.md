---
sidebar_position: 2
title: Operátory Flow
---

# Operátory Flow

`Flow` podporuje mnoho rovnakých operátorov, aké by si čakal od bežných kolekčných funkcií
Kotlinu — `map`, `filter`, a ďalšie — ale každý z nich je suspending-aware a funguje v čase,
namiesto nad už kompletnou kolekciou.

## Tie známe

```kotlin
flow { emit(1); emit(2); emit(3) }
    .map { it * 2 }              // 2, 4, 6
    .filter { it > 2 }             // 4, 6
    .collect { println(it) }
```

Číta sa presne ako ekvivalentný kód na `List` — `listOf(1, 2, 3).map { it * 2 }.filter { it > 2
}` — ale každá hodnota preteká celým reťazcom operátorov jednotlivo, ako je emitovaná, namiesto
toho, aby flow najprv zozbieral všetko do medziľahlého zoznamu pri každom kroku.

## Operátory, ktoré konkrétne zahŕňajú suspending prácu

```kotlin
flow { emit(1); emit(2) }
    .map { id ->
        fetchUserFromDatabase(id)    // suspend volanie, úplne v poriadku vnútri lambdy map
    }
    .collect { user -> println(user) }
```

Keďže `Flow` je postavený na coroutines, jeho operátory môžu voľne volať suspend funkcie vnútri
svojich lambd — naozajstný rozdiel oproti `map` bežnej synchrónnej kolekcie, ktorá sa vôbec nevie
pozastaviť.

## `collectLatest` — zruš a reštartuj pri každej novej hodnote

```kotlin
flow { emit(1); delay(100); emit(2) }
    .collectLatest { value ->
        delay(50)                        // simuluj pomalé spracovanie
        println("Processing $value")
    }
// spracovanie hodnoty 1 sa zruší v polovici, akonáhle dorazí hodnota 2
```

Užitočné, keď záleží len na spracovaní **najnovšej** hodnoty — napr. pole vyhľadávania počas
písania, kde by mala byť prebiehajúca požiadavka na zastaraný dopyt zahodená, akonáhle príde
novšia, namiesto zbytočného dokončenia.

## Kombinovanie viacerých flow

```kotlin
val temperatures = flowOf(20, 21, 22)
val humidity = flowOf(40, 45, 50)

temperatures.zip(humidity) { temp, hum -> "$temp°C, $hum%" }
    .collect { println(it) }
// 20°C, 40%
// 21°C, 45%
// 22°C, 50%
```

```kotlin
temperatures.combine(humidity) { temp, hum -> "$temp°C, $hum%" }
    .collect { println(it) }
```

`zip` páruje hodnoty podľa indexu, jedna k jednej; `combine` emituje novú skombinovanú hodnotu
zakaždým, keď **hociktorý** zdrojový flow emituje, použijúc najnovšiu hodnotu z toho druhého —
zmysluplne odlišné správanie pre flow, ktoré emitujú rôznou rýchlosťou alebo neemitujú rovnaký
počet hodnôt.

## Spracovanie výnimiek vnútri flow reťazca

```kotlin
flow {
    emit(1)
    throw RuntimeException("Something broke")
}
.catch { e -> emit(-1) }    // zachytí upstream výnimky, môže emitovať náhradnú hodnotu
.collect { println(it) }
// 1
// -1
```

`catch` zachytí len výnimky z **upstream** (operátory pred ním v reťazci) — nezachytí výnimku
hodenú vnútri vlastnej lambdy `collect`, ktorá je downstream od neho. Pozri
[Spracovanie Výnimiek v Coroutines](../05-error-handling-and-testing/exception-handling-in-coroutines.md)
pre spracovanie výnimiek v coroutines všeobecnejšie.

## Terminálne vs. medziľahlé operátory

```text
Medziľahlé (lazy, vrátia nový Flow):        map, filter, take, zip, combine, catch...
Terminálne (suspend, naozaj spustia flow):    collect, toList, first, single, reduce...
```

Nič vo flow reťazci sa naozaj nevykoná, kým nie je zavolaný **terminálny** operátor — samotné
zostavenie reťazca `map`/`filter` volaní nerobí žiadnu prácu vôbec, presne paralelne s tým, ako
cold flow (pozri [Úvod do Flow](./introduction-to-flow.md)) nič nerobí, kým ho `collect`
nespustí.
