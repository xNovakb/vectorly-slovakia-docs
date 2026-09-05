---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- `flow { println("started"); emit(1) }` vypíše "started" úplne zakaždým, keď sa naň zavolá
  `.collect()`, raz na každé volanie. Podľa [Úvod do Flow](./introduction-to-flow.md), aká
  vlastnosť studeného flow toto vysvetľuje, a ako by sa `StateFlow` správal inak pre tú istú
  situáciu?

  <details>
  <summary>Odpoveď</summary>

  Studený flow nič nerobí, kým sa nezavolá `collect`, a spustí celé svoje telo nezávisle, od
  začiatku, pre *každého* samostatného collectora — odtiaľ opätovné vypísanie "started" pri každom
  volaní. Horúci flow ako `StateFlow` už existuje a drží stav bez ohľadu na to, či niekto zbiera;
  viacerí collectori zdieľajú ten istý prebiehajúci stream namiesto toho, aby každý spustil
  nezávislý beh.
  </details>

- Vytvorenie `flow.map { }.filter { }` samotné nevykoná žiadnu prácu vôbec. Podľa
  [Operátory Flow](./flow-operators.md), čo sa musí stať pred tým, než sa niečo z toho reťazca
  vôbec vykoná, a ako to paralelne súvisí so správaním studeného flow z
  [Úvod do Flow](./introduction-to-flow.md)?

  <details>
  <summary>Odpoveď</summary>

  Musí sa zavolať terminálny operátor (`collect`, `toList`, `first`, atď.) — intermediate operátory
  ako `map`/`filter` sú lazy a len vrátia nový `Flow` popisujúci reťazec, bez spustenia čohokoľvek.
  Toto je presne paralelné s tým, ako studený flow nerobí nič, kým ho `collect` nespustí — nič
  nebeží, kým niečo aktívne nepožiada o hodnoty.
  </details>

- Jednorazová udalosť "zobraz tento toast" je modelovaná pomocou `MutableStateFlow<String?>(null)`
  namiesto `MutableSharedFlow<String>(replay = 0)`. Podľa
  [StateFlow a SharedFlow](./stateflow-and-sharedflow.md), aký konkrétny bug to spôsobí pre
  neskorého collectora (napr. po rotácii obrazovky)?

  <details>
  <summary>Odpoveď</summary>

  `StateFlow` vždy drží aktuálnu hodnotu, a nový collector ju hneď dostane pri subscribe — tak
  neskorý collector uvidí posledný toast event "prehratý" znovu, aj keď sa už udalosť stala a
  nemala by sa opakovať. `SharedFlow` s `replay = 0` doručí udalosť len collectorom, ktorí aktívne
  počúvali v momente jej emitovania, čo je skutočná sémantika, ktorú jednorazová udalosť potrebuje.
  </details>

- `flow.catch { e -> emit(-1) }.collect { println(it) }` chytí výnimku hodenú upstream vo flow
  builderi, ale podľa [Operátory Flow](./flow-operators.md) by *nechytila* výnimku hodenú vnútri
  samotnej lambdy `collect`. Prečo nie?

  <details>
  <summary>Odpoveď</summary>

  `catch` chytá len výnimky z operátorov upstream od neho v reťazci (pred ním) — lambda `collect`
  je downstream od `catch`, tak výnimka tam hodená je mimo toho, čo je `catch` pozicovaný
  zachytiť.
  </details>

- `temperatures.zip(humidity) { ... }` a `temperatures.combine(humidity) { ... }` obidva
  kombinujú dva flowy do jedného. Podľa [Operátory Flow](./flow-operators.md), kedy by
  vyprodukovali odlišný počet emitovaných hodnôt pre tie isté dva source flowy?

  <details>
  <summary>Odpoveď</summary>

  `zip` páruje hodnoty striktne podľa indexu, jedna k jednej, tak emituje len toľko kombinovaných
  hodnôt, koľko poskytne kratší source flow. `combine` emituje novú kombinovanú hodnotu zakaždým,
  keď *ktorýkoľvek* source emituje, používajúc poslednú hodnotu druhého — pre flowy emitujúce
  rôznou rýchlosťou alebo počtom `combine` typicky vyprodukuje viac emisií ako `zip` pre tie isté
  dva flowy.
  </details>

