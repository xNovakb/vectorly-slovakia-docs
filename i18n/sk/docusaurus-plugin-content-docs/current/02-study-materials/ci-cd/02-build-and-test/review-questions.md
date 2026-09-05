---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie znovu čítaním stránok — presne to overí, či koncept naozaj sedí.

- [Automatizované Buildy](./automated-builds.md) hovorí, že build má byť deterministický. Uveď
  jednu vec, čo determinizmus rozbije, a ako návrh cache key v
  [Cachovanie v CI](../04-pipeline-design/caching-in-ci.md) rieši rovnaký typ problému, len pre
  cache konkrétne.

  <details>
  <summary>Odpoveď</summary>

  Spoliehanie sa na "latest" verzie závislostí, ktoré sa v čase rozlíšia inak, rozbije determinizmus
  buildu; cache key hashnutý z lockfile sa automaticky zmení hneď, ako sa závislosti naozaj zmenia,
  takže cache sa nikdy nepoužije naprieč skutočnou zmenou závislostí tak, ako by mohol nepinnutý
  build ticho zmutovať.
  </details>

- [Spúšťanie Testov v CI](./running-tests-in-ci.md) hovorí, že CI kontroluje exit kód testovacieho
  príkazu, nie jeho výstup. Prečo z toho robí zle nakonfigurovaný test runner skutočné (aj keď
  nezvyčajné) riziko?

  <details>
  <summary>Odpoveď</summary>

  Test runner, ktorý skončí s `0` aj keď testy naozaj zlyhali (taký, čo len vypíše zlyhania bez
  toho, aby proces zlyhal), spôsobí, že CI nahlási úspech na skutočne pokazenom builde — CI nemá
  žiadne sémantické porozumenie vypísaným výsledkom, len numerický exit kód.
  </details>

- Prečo musí zlyhanie buildu okamžite zastaviť pipeline namiesto pokračovania do test fázy, podľa
  [Automatizované Buildy](./automated-builds.md)?

  <details>
  <summary>Odpoveď</summary>

  Spúšťanie testov proti kódu, ktorý sa ani neskompiluje, plytvá časom a produkuje zmätočné
  zlyhanie — zlyhanie testu, ktoré je vlastne len zamaskované zlyhanie buildu.
  </details>

- [Artefakty](./artifacts.md) rozlišuje pipeline artefakt od registry/package repozitára. Ktorý by
  si použil pre Docker image, ktorý má stiahnuť produkčná infraštruktúra, a prečo?

  <details>
  <summary>Odpoveď</summary>

  Registry — pipeline artefakt je krátkodobý a obmedzený na jeden beh pipeline, hlavne na odovzdanie
  medzi fázami toho istého behu, zatiaľ čo registry je dlhodobý, verzovaný a nezávisle stiahnuteľný
  čímkoľvek, čo je presne to, čo produkčný deploy potrebuje.
  </details>

- Test reporty (nahrané ako artefakty) a upozornenie na flaky testy v
  [Spúšťanie Testov v CI](./running-tests-in-ci.md) spolu súvisia — ako to, že máš štruktúrované,
  uchované test reporty, uľahčí flaky test skutočne diagnostikovať a opraviť namiesto len
  odignorovania opätovným spustením?

  <details>
  <summary>Odpoveď</summary>

  Štruktúrovaný report ukáže, ktoré konkrétne testy zlyhali a ako dlho trvali naprieč viacerými
  behmi, čím sa nekonzistentný vzorec pass/fail (podpis flakiness) stane viditeľným v čase, namiesto
  toho, aby si videl len surový log jedného behu a spúšťal znova naslepo.
  </details>

- Prečo [Artefakty](./artifacts.md) považujú beh jobov vo "fresh, izolovaných prostrediach" za
  relevantný pre to, prečo artefakty vôbec potrebujú existovať ako koncept?

  <details>
  <summary>Odpoveď</summary>

  Ak nič z prostredia jednej fázy nie je automaticky dostupné v ďalšej, niečo musí explicitne
  preniesť výstup buildu (napr. skompilovaný bundle) z build fázy do deploy fázy — to explicitné
  odovzdanie je presne to, na čo je artefakt.
  </details>

- Unit, integračné a end-to-end testy dostávajú rôzne CI zaobchádzanie podľa
  [Spúšťanie Testov v CI](./running-tests-in-ci.md). Aký podkladový kompromis vedie k tomu, že sa
  najpomalšie sady spúšťajú menej často než pri každom pushi?

  <details>
  <summary>Odpoveď</summary>

  Rýchlosť feedbacku vs. dôkladnosť — spúšťanie každej sady pri každom pushi neškáluje s rastúcim
  kódovým základom, tak rýchle unit testy bežia pri každom pushi, zatiaľ čo pomalšie
  integračné/e2e sady sú vyhradené pre menej časté triggery, čo vymení trochu okamžitosti za
  udržanie bežného prípadu rýchlym.
  </details>
