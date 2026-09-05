---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- `val (x, y) = point` funguje pre `data class Point` bez akéhokoľvek extra kódu. Podľa
  [Destructuring Declarations](./destructuring-declarations.md), čo `data class` automaticky
  generuje, čo to umožňuje, a prečo tá istá syntax zlyhá na obyčajnej (nie `data`) triede?

  <details>
  <summary>Odpoveď</summary>

  `data class` automaticky generuje `component1()`, `component2()`, atď. — jednu na každú
  konštruktorovú property — a destructuring je v skutočnosti len sugar pre postupné volanie
  týchto. Obyčajná trieda nemá vôbec žiadne vygenerované `componentN()` funkcie, tak nie je čo
  destructuring syntax volať; funguje len vtedy, keď sú tieto operator funkcie definované, ručne
  alebo pomocou `data`.
  </details>

- `data class User(val name: String, val email: String)` má neskôr preusporiadané konštruktorové
  parametre na `(val email: String, val name: String)`. Podľa varovania v
  [Destructuring Declarations](./destructuring-declarations.md), prečo `val (name, email) = user`
  zlyhá *potichu* namiesto chyby kompilácie?

  <details>
  <summary>Odpoveď</summary>

  Destructuring priraďuje `componentN()` funkcie čisto podľa pozície, nie podľa mien premenných
  použitých na mieste destructuringu — `name` a `email` sú stále obidve `String`, tak typy stále
  sedia aj po preusporiadaní. Kompilátor nemá spôsob, ako vedieť, že mená destructurovaných
  premenných mali zodpovedať konkrétnym menám properties, tak s radosťou skompiluje kód, ktorý
  teraz potichu prehodí obe hodnoty.
  </details>

- `3 times "ab"` a `order processWithDiscount discount` sú obidva syntakticky platné infix
  volania. Podľa [Infix Funkcie](./infix-functions.md), prečo je prvé považované za dobré použitie
  `infix` a druhé označené ako nadužívanie?

  <details>
  <summary>Odpoveď</summary>

  `times` sa číta ako prirodzený spojovací výraz medzi dvoma hodnotami ("3 krát ab"), presne to
  sladké miesto infix notácie. `processWithDiscount` je dlhšie meno v tvare slovesnej frázy, ktoré
  sa nečíta ako prirodzená predložka alebo krátke sloveso spájajúce receiver a argument —
  vynechanie bodky a zátvoriek tu spôsobí, že sa volanie číta nepohodlne namiesto prirodzenejšie,
  čo je opak zamýšľaného prínosu infix.
  </details>

- Prečo musí byť každá `infix`-oprávnená funkcia s **presne jedným** parametrom bez predvolenej
  hodnoty, podľa [Infix Funkcie](./infix-functions.md), a ako to vylučuje možnosť niekedy napísať
  `order processWithDiscount discount andTax taxRate` ako jeden infix reťazec?

  <details>
  <summary>Odpoveď</summary>

  Celá syntax infix notácie (`receiver funkcia argument`) má miesto len pre jeden argument
  pozične — neexistuje syntaktický slot pre druhý parameter alebo pre vynechanie predvoleného.
  Funkcia potrebujúca viac parametrov nemôže byť štruktúrne `infix` vôbec, čo je presne dôvod,
  prečo sa operácia s viacerými argumentmi musí vrátiť k obyčajnej syntaxi volania s bodkou a
  zátvorkami.
  </details>

- `File(...).bufferedReader().use { ... }` a manuálne volanie `.close()` na konci funkcie sa
  obidve snažia uvoľniť zdroj. Podľa
  [Štandardná Knižnica, Ktorú by si Mal Poznať](./the-standard-library-you-should-know.md), pred
  akým konkrétnym zlyhaním `use` chráni, pred ktorým manuálne `.close()` nechráni?

  <details>
  <summary>Odpoveď</summary>

  `use` automaticky zavolá `.close()` hneď, ako sa blok dokončí, vrátane prípadu, keď blok
  uprostred hodí výnimku. Manuálne `.close()` umiestnené na konci funkcie sa jednoducho nikdy
  nedosiahne, ak sa niekde pred tým riadkom hodí výnimka alebo funkcia predčasne vráti, čím
  potichu unikne zdroj — `use` garantuje cleanup bez ohľadu na to, ako blok skončí.
  </details>

