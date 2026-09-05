---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- [Čo sú Coroutines](./what-are-coroutines.md) hovorí, že pozastavená coroutine "vráti vlákno úplne
  späť." Podľa [Suspend Funkcie](./suspend-functions.md), aký mechanizmus vynútený kompilátorom je
  to, čo pozastavenie vôbec umožňuje?

  <details>
  <summary>Odpoveď</summary>

  Modifikátor `suspend` — Kotlin kompilátor transformuje suspend funkciu na stavový automat cez
  Continuation Passing Style, kde sa každý bod pozastavenia stane stavom, v ktorom sa funkcia môže
  zastaviť a neskôr obnoviť, s lokálnymi premennými zachovanými na heape namiesto potreby
  rezervovaného OS thread stacku.
  </details>

- `fetchUser(1)` volajúca `delay(100L)` sa skompiluje bez problémov vnútri iného `suspend fun`, ale
  zlyhá vnútri obyčajnej `fun`. Podľa [Suspend Funkcie](./suspend-functions.md), prečo je to chyba
  kompilácie, nie niečo odchytené len za behu?

  <details>
  <summary>Odpoveď</summary>

  `suspend` je súčasťou typu funkcie a kompilátor sleduje pri každom mieste volania, či si aktuálne
  v suspending kontexte — odmietne skompilovať volanie suspend funkcie z nesuspendujúceho kódu.
  Toto je zmysluplne silnejšie ako konvenčný alebo dokumentáciou podložený prístup v iných
  jazykoch, kde nesprávne volanie asynchrónneho kódu sa možno prejaví až za behu.
  </details>

- `val user1 = fetchUser(1); val user2 = fetchUser(2)` vnútri `suspend fun` beží sekvenčne, nie
  konkurentne. Podľa [Suspend Funkcie](./suspend-functions.md) a [Launch vs. Async](./launch-vs-async.md),
  prečo samotné `suspend` nedáva konkurenciu, a čo by ju skutočne dalo?

  <details>
  <summary>Odpoveď</summary>

  `suspend` znamená len "schopný pozastaviť sa" — nič nehovorí o behu nezávisle od iného kódu.
  Volanie dvoch suspend funkcií za sebou stále čaká na dokončenie prvej pred spustením druhej.
  Skutočná konkurencia vyžaduje explicitné spustenie samostatných coroutines, napr. zabalenie
  každého volania do vlastného `async { }` pred volaním `.await()` na ktorýkoľvek z nich.
  </details>

- `async { riskyOperation() }` sa zavolá, ale `.await()` na výsledku sa nikdy nezavolá. Podľa
  [Launch vs. Async](./launch-vs-async.md), čo sa stane s výnimkou hodenou vnútri toho bloku, a
  prečo je `launch` opísaný ako "úprimnejšia voľba," keď výsledok nie je potrebný?

  <details>
  <summary>Odpoveď</summary>

  Výnimka `async` sa drží, kým niekto nezavolá `.await()` — ak sa to nikdy nestane, výnimka sa
  nikdy nemusí prejaviť vôbec, potichu prehltnutá. Neošetrená výnimka `launch` sa namiesto toho
  okamžite propaguje do rodiča, čo je predvídateľnejší spôsob zlyhania, keď v skutočnosti nie je
  žiadny výsledok, ktorý by bolo treba získať.
  </details>

- Spustia sa dve `async { fetchUser(id) }` volania, a `.await()` sa zavolá na každom hneď po jeho
  spustení (namiesto po spustení oboch). Podľa [Launch vs. Async](./launch-vs-async.md), beží toto
  stále oba fetche konkurentne?

  <details>
  <summary>Odpoveď</summary>

  Nie — volanie `.await()` hneď po spustení prvého `async` pozastaví, kým sa ten prvý nedokončí,
  skôr než sa druhý `async` vôbec spustí, čím ich náhodne znovu sériové spravíš. Obidve `async`
  volania musia byť spustené *pred* volaním `.await()` na ktorékoľvek z nich, aby skutočne bežali
  konkurentne.
  </details>

