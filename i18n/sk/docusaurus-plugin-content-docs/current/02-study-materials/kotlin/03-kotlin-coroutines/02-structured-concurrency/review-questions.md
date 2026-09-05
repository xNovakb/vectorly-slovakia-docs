---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- Tesná slučka `while (i < 1000) { i++ }` bez akéhokoľvek suspending volania vnútri nereaguje na
  `job.cancel()`. Podľa [Zrušenie](./cancellation.md), prečo nie, a aký je mechanizmus, ktorý
  normálne spôsobí, že zrušenie zaberie?

  <details>
  <summary>Odpoveď</summary>

  Suspending funkcie ako `delay`/`yield` automaticky kontrolujú zrušenie vo svojich bodoch
  pozastavenia a hodia `CancellationException`, ak bola coroutine zrušená — to je skutočný
  mechanizmus, na ktorom zrušenie stojí. Slučka bez bodu pozastavenia vnútri nikdy nedosiahne
  miesto, kde by sa táto kontrola vykonala, tak zrušenie sa síce vyžiada, ale nikdy sa neprejaví,
  kým slučka sama neskončí.
  </details>

- `job.cancel()` na rodičovi automaticky zruší každú coroutine vnorenú v ňom, celou cestou dole.
  Podľa [CoroutineScope a CoroutineContext](./coroutine-scope-and-context.md) a
  [Vysvetlenie Štruktúrovanej Konkurencie](./structured-concurrency-explained.md), aký štruktúrny
  fakt o tom, ako sa `launch`/`async` volania vzťahujú k obklopujúcemu scope, toto spraví
  automatickým namiesto niečoho, čo musíš implementovať sám?

  <details>
  <summary>Odpoveď</summary>

  Každé volanie `launch`/`async` vytvorí child coroutine scope, v ktorom bolo zavolané, a coroutine
  builder zavolaný zvnútra inej coroutine vytvorí scope, ktorý je sám child tej coroutine — toto
  vnorenie znamená, že rodičovský scope naozaj vie o každej coroutine spustenej priamo alebo
  tranzitívne v ňom, tak zrušenie rodičovho `Job` sa propaguje dole cez tú istú štruktúru
  automaticky.
  </details>

- `runBlocking { launch { ... } }` aj `suspend fun doWork() = coroutineScope { launch { ... } }`
  obidva vytvoria scope. Podľa [CoroutineScope a CoroutineContext](./coroutine-scope-and-context.md),
  aký je konkrétny rozdiel v tom, čo každý z nich robí volajúcemu vláknu?

  <details>
  <summary>Odpoveď</summary>

  `runBlocking` naozaj blokuje aktuálne vlákno, kým sa všetko v ňom nedokončí — vhodné na
  skutočnej blokujúco/suspendujúcej hranici ako `main()` alebo test. `coroutineScope` je sama
  suspend funkcia — nič neblokuje, pozastaví volajúcu coroutine, kým sa jej deti nedokončia, pričom
  vlákno zostáva medzitým voľné na inú prácu.
  </details>

- Jedna child coroutine hodí neošetrenú výnimku, kým sibling stále beží pod obyčajným
  (non-supervisor) rodičovským scope. Podľa
  [Vysvetlenie Štruktúrovanej Konkurencie](./structured-concurrency-explained.md), čo sa stane so
  siblingom, a prečo je toto opísané ako zámerný default, nie okrajový prípad?

  <details>
  <summary>Odpoveď</summary>

  Výnimka sa propaguje hore a zruší rodičovský scope, ktorý zase zruší každé iné dieťa, vrátane
  stále bežiaceho siblingu — "zlyhať spolu" je default. Toto je zámerné: ak časť štruktúrovanej
  jednotky práce zlyhá, potichu pokračovať v behu zvyšku bez vedomia o zlyhaní málokedy je to, čo
  skutočne chceš.
  </details>

- `CancellationException` je chytená vnútri `try`/`catch` na cleanup účely, ale potom je prehltnutá
  namiesto znovu hodenej. Podľa [Zrušenie](./cancellation.md), čo sa v dôsledku toho pokazí, a
  prečo je to iné ako chytenie normálnej výnimky na zotavenie?

  <details>
  <summary>Odpoveď</summary>

  Prehltnutie poruší zrušenie pre čokoľvek downstream, čo očakáva jeho propagáciu — coroutine
  mechanizmus spolieha na to, že `CancellationException` naozaj dosiahne svoje normálne
  destinácie, aby správne označil coroutines za zrušené a zastavil kaskádovité zrušenie cez deti.
  Chytenie na spustenie cleanup logiky je v poriadku a bežné, ale musí byť vždy znovu hodená potom,
  na rozdiel od normálnej výnimky, ktorú recovery kód môže legitímne zastaviť od ďalšej propagácie.
  </details>

