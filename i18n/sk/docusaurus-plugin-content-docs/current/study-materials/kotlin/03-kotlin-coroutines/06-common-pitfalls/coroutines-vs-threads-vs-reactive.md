---
sidebar_position: 3
title: Coroutines vs. Vlákna vs. Reactive
---

# Coroutines vs. Vlákna vs. Reactive

Tri naozaj odlišné modely konkurencie dostupné na JVM, každý so skutočnými silnými stránkami — nie
striktne zoradený rebríček "najlepší po najhorší."

## Tri modely, v skratke

```text
Surové vlákna (java.lang.Thread / ExecutorService)
  - Najnižšia úroveň modelu — vlákna (alebo ich pool) spravuješ priamo ty.
  - Blokujúce svojou povahou; každá jednotka konkurentnej práce zaviaže skutočné OS vlákno počas čakania.

Coroutines (kotlinx.coroutines)
  - Suspenzia namiesto blokovania (pozri Čo sú Coroutines) — mnoho coroutines zdieľa málo vlákien.
  - Sekvenčne vyzerajúci kód (žiadne vnáranie callbackov), ktorý je pod kapotou naozaj asynchrónny.
  - Kotlin-špecifický — nie priamo použiteľný z Javy bez adapter vrstiev.

Reactive streams (RxJava, Project Reactor)
  - Iná abstrakcia: komponovateľné, deklaratívne prúdy udalostí, postavené okolo
    operátorov (map, filter, flatMap, atď.) aplikovaných na prebiehajúcu sekvenciu hodnôt.
  - Spracovanie backpressure je prvotriedny, dobre vyvinutý koncept.
  - JVM-wide takmer-štandard (Reactive Streams spec) — použiteľný z Javy rovnako prirodzene ako z Kotlinu.
```

## Porovnanie vedľa seba

| | Surové Vlákna | Coroutines | Reactive (RxJava/Reactor) |
|---|---|---|---|
| Cena jednotky konkurencie | Drahá (OS vlákno) | Lacná (objekt na heape) | Lacná (žiadne dedikované vlákno na prúd) |
| Štýl kódu | Callback-heavy alebo blokujúci | Sekvenčne vyzerajúci, `suspend` | Deklaratívny, operátorový reťazec |
| Jazyk | Ktorýkoľvek JVM jazyk | Kotlin (primárne) | Ktorýkoľvek JVM jazyk |
| Spracovanie backpressure | Ručné | Cez buffering `Flow`, menej vyzreté než reactive | Vyzreté, prvotriedny koncept |
| Krivka učenia | Nízka na začiatok, ťažké spraviť správne | Stredná (štruktúrovaná konkurencia je skutočný koncept na naučenie) | Strmá (slovník operátorov je veľký) |
| Ekosystém | Univerzálny | Kotlin-špecifický, rýchlo rastúci | Veľmi vyzretý, dlho zavedený |

## `Flow` vs. RxJava konkrétne — bežné porovnanie

Kotlin `Flow` (pozri [Úvod do Flow](../04-flow/introduction-to-flow.md)) bol zámerne navrhnutý s
reactive streams ako inšpiráciou — mnoho konceptov sa mapuje blízko (`map`/`filter` fungujú
podobne, cold vs. hot zrkadlí rozlíšenie cold/hot observable v reactive). Praktický rozdiel je
väčšinou ekosystém a integrácia: `Flow` je natívny pre coroutines a Kotlin suspend funkcie,
bezproblémovo sa integruje so zvyškom materiálu tejto témy, zatiaľ čo RxJava predchádza coroutines
a má vlastný samostatný, veľmi vyzretý ekosystém a sadu operátorov.

## Kedy je každý naozaj správny nástroj

```text
Surové vlákna/ExecutorService:
  - Jednoduchá, zriedkavá práca na pozadí, kde réžia učenia sa coroutines/reactive
    naozaj nestojí za to pre rozsah úlohy
  - Napojenie na existujúci thread-based Java kód bez dostupného coroutine mostu

Coroutines:
  - Nový Kotlin kód, najmä čokoľvek už používajúce suspend funkcie z frameworku
    (Ktor, coroutine podpora Springu, lifecycle-aware coroutine scopy v Androide)
  - Keď "sekvenčne vyzerajúci async kód" má hodnotu pre čitateľnosť oproti operátorovému štýlu

Reactive (RxJava/Reactor):
  - Codebase už postavená okolo reactive streams (napr. Spring WebFlux)
  - Naozaj zložité požiadavky na backpressure
  - Tím alebo codebase pokrývajúci Javu aj Kotlin, potrebujúci jeden zdieľaný model konkurencie
```

## V praxi sa navzájom nevylučujú

```kotlin
// kotlinx-coroutines-reactive poskytuje premosťovacie funkcie
val flow: Flow<Int> = someRxObservable.asFlow()
val observable: Observable<Int> = someFlow.asObservable()
```

Codebase migrujúca z RxJava na coroutines (bežný reálny scenár, keďže coroutines sú novšie)
nemusí to spraviť naraz — premosťovacie knižnice existujú špecificky na to, aby umožnili obom
modelom koexistovať počas postupného prechodu.
