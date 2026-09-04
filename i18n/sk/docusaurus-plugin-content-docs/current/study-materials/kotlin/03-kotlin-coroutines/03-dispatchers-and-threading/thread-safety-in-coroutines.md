---
sidebar_position: 3
title: Thread Safety v Coroutines
---

# Thread Safety v Coroutines

Naozaj bežná mylná predstava, ktorú stojí za to riešiť priamo: **coroutines automaticky nespravia
zdieľaný meniteľný stav bezpečným.** Viacero coroutines bežiacich konkurentne na multi-threaded
dispatcheri môže súťažiť (race condition) o zdieľaný stav presne tak, ako to môžu robiť viaceré
vlákna, lebo — na dispatcheri ako `Dispatchers.Default` alebo `Dispatchers.IO` — môžu naozaj bežať
na rôznych vláknach naraz.

## Race condition, konkrétne

```kotlin
var counter = 0

suspend fun incrementUnsafely() = coroutineScope {
    repeat(10_000) {
        launch(Dispatchers.Default) {
            counter++    // NIE je atomické — čítanie, inkrementácia, zápis, ako tri samostatné kroky
        }
    }
}
// counter takmer určite skončí NIŽŠÍ ako 10 000 — niektoré inkrementy sa stratia
```

:::warning
`counter++` vyzerá ako jedna operácia, ale v skutočnosti je read-modify-write — tri kroky. Ak sa
dve coroutines prelínajú medzi čítaním a zápisom, jeden inkrement sa potichu stratí. Toto je presne
tá istá trieda bugu ako klasická race condition vo viacvláknovom prostredí — coroutines menia
*ako* sa konkurencia vyjadruje, nie základné pravidlá zdieľaného meniteľného stavu.
:::

## Oprava 1: `Mutex` — vzájomné vylúčenie, coroutine-natívny spôsob

```kotlin
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

val mutex = Mutex()
var counter = 0

suspend fun incrementSafely() {
    mutex.withLock {
        counter++
    }
}
```

`Mutex` je coroutine-aware — na rozdiel od tradičného `synchronized` bloku, jeho zamknutie
**pozastaví** coroutine (vráti vlákno späť) namiesto blokovania vlákna počas čakania na zámok.
Použitie `synchronized` vnútri coroutine kódu funguje v zmysle, že sa to skompiluje, ale blokuje
podkladové vlákno počas čakania, čím poráža reálnu časť zmyslu použitia coroutines na začiatku.

## Oprava 2: atomické typy

```kotlin
import java.util.concurrent.atomic.AtomicInteger

val counter = AtomicInteger(0)

suspend fun incrementAtomically() {
    counter.incrementAndGet()    // naozaj atomické, žiadna suspenzia ani zamykanie netreba vôbec
}
```

Pre jednoduché prípady (jeden počítadlo, jedna referencia) je atomický typ z `java.util.concurrent`
často jednoduchší a rýchlejší než `Mutex` — žiadna réžia suspenzie, keďže operácia samotná je už
atomická na hardvérovej úrovni.

## Oprava 3: úplne sa vyhni zdieľanému meniteľnému stavu — zvyčajne najlepšia oprava

```kotlin
// ❌ zdieľaný meniteľný stav, potrebuje explicitnú synchronizáciu
var total = 0
items.forEach { launch { total += process(it) } }

// ✅ každá coroutine vráti vlastný výsledok, skombinovaný potom — nič zdieľané, nič na súťaženie
val results = items.map { async { process(it) } }.awaitAll()
val total = results.sum()
```

Najspoľahlivejšia oprava je často architektonická, vôbec nie zamykací primitív — nech každá
coroutine vypočíta a vráti vlastný nezávislý výsledok, a výsledky skombinuj potom na jednom mieste,
namiesto toho, aby mnoho coroutines konkurentne menilo jednu zdieľanú premennú. Toto celkom obíde
túto kategóriu bugu namiesto starostlivej správy prístupu k nej.

## Obmedzenie stavu na jednu coroutine/vlákno — ďalší platný prístup

```kotlin
val stateActor = CoroutineScope(Dispatchers.Default.limitedParallelism(1))
```

Obmedzenie dispatchera na jedno vlákno (alebo použitie actor-style vzoru) znamená, že len jedna
coroutine naraz sa môže dotknúť daného kusu stavu, konštrukciou — iný spôsob, ako sa vyhnúť race
conditions namiesto zamykania okolo nich.

## Ponaučenie

"Používam coroutines" nič nehovorí o tom, či je zdieľaný meniteľný stav bezpečný — to je úplne
samostatná otázka, riadená rovnakými pravidlami ako akýkoľvek konkurentný systém. Pozri
[Dispatchery](./dispatchers.md), prečo na tomto konkrétne záleží viac na multi-threaded
dispatcheroch (`Default`, `IO`) než na niečom obmedzenom na jedno vlákno.
