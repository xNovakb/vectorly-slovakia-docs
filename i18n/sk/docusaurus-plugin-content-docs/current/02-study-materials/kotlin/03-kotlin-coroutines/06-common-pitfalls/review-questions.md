---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- `GlobalScope.launch { fetchLatestData() }` je označené ako chyba v
  [Bežné Chyby s Coroutines](./common-coroutine-mistakes.md). Viažuc to späť na
  [Vysvetlenie Štruktúrovanej Konkurencie](../02-structured-concurrency/structured-concurrency-explained.md),
  čo konkrétne chýba, čo by scope naviazaný na lifecycle triedy poskytol?

  <details>
  <summary>Odpoveď</summary>

  `GlobalScope` nemá rodiča ani ohraničený lifecycle — vôbec nie je súčasťou stromu štruktúrovanej
  konkurencie, tak sa nedá zrušiť ako skupina s ničím iným a žije, kým celý proces neskončí alebo
  sám nedobehne. Scope vlastnený triedou naviaže lifecycle coroutine na niečo skutočné a ohraničené,
  automaticky zrušené, keď je tá trieda použitá.
  </details>

- `Thread.sleep(5000L)` aj `delay(1000L)` sú obidva zavolané vnútri `launch { }` bloku. Podľa
  [Blokujúce Volania v Coroutines](./blocking-calls-in-coroutines.md), prečo len jedno z nich
  naozaj uvoľní podkladové vlákno, aj keď obe "vyzerajú" ako pozastavenie na nejakú dobu?

  <details>
  <summary>Odpoveď</summary>

  `delay` je skutočná suspending funkcia — pozastaví coroutine a vráti vlákno na inú prácu.
  `Thread.sleep` je blokujúce volanie, ktoré obsadí a zablokuje skutočné OS vlákno na celú svoju
  dobu, presne ako by to spravilo mimo akejkoľvek coroutine — coroutines nespravia blokujúce
  volanie neblokujúcim len tým, že je volané zvnútra jednej z nich.
  </details>

- `catch (e: Exception) { retry() }` obalí volanie `doWork()` vnútri coroutine, a coroutine sa
  pokúsi znova aj keď bola v skutočnosti zrušená. Podľa [Bežné Chyby s Coroutines](./common-coroutine-mistakes.md),
  prečo to spôsobí široký `catch (e: Exception)`, a aká je oprava?

  <details>
  <summary>Odpoveď</summary>

  `CancellationException` je sama `Exception`, tak ju široký catch blok tiež chytí, pokiaľ nie je
  explicitne vylúčená — retry po jej chytení zaobchádza s legitímnym zrušením ako s opakovateľným
  zlyhaním. Oprava je chytiť `CancellationException` samostatne najprv a znovu ju hodiť, skôr než
  širší `catch (e: Exception)` spracuje skutočné zlyhania.
  </details>

- Podľa [Blokujúce Volania v Coroutines](./blocking-calls-in-coroutines.md), blokujúce JDBC
  volanie bežiace na `Dispatchers.Default` môže vyhladovieť úplne nesúvisiace coroutines. Podľa
  [Dispatchery](../03-dispatchers-and-threading/dispatchers.md) a
  [Coroutines vs. Vlákna vs. Reactive](./coroutines-vs-threads-vs-reactive.md), prečo presun toho
  konkrétneho volania na `Dispatchers.IO` opraví problém bez potreby úplnej zmeny modelu
  konkurencie?

  <details>
  <summary>Odpoveď</summary>

  Thread pool `Dispatchers.IO` je zámerne oveľa väčší ako pool `Default` veľkosti CPU jadier,
  konkrétne určený na absorbovanie mnohých konkurentných blokujúcich volaní bez jeho vyčerpania.
  Zabalenie len blokujúcej časti do `withContext(Dispatchers.IO)` izoluje problém do poolu
  postaveného na jeho toleranciu, kým CPU-bound časti tej istej coroutine ostávajú na `Default`,
  kam patria — netreba opustiť coroutines pre vlákna alebo reactive streamy na vyriešenie tohto
  konkrétneho problému.
  </details>

- Podľa [Coroutines vs. Vlákna vs. Reactive](./coroutines-vs-threads-vs-reactive.md), tím už
  používajúci RxJava naprieč codebase zvažuje prijatie Kotlin coroutines. Prečo toto nevyžaduje
  prepis všetkého naraz?

  <details>
  <summary>Odpoveď</summary>

  Bridging knižnice (`kotlinx-coroutines-reactive`) existujú konkrétne na konverziu medzi `Flow` a
  RxJava `Observable` v oboch smeroch — codebase môže bežať oba modely konkurencie súbežne počas
  postupnej migrácie, namiesto potreby konvertovať každý reactive stream na coroutines naraz.
  </details>

