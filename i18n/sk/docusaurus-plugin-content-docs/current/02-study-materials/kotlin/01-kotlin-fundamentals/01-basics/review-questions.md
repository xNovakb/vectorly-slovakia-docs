---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- [Čo je Kotlin](./what-is-kotlin.md) nazýva null safety "jediný najviac citovaný dôvod, prečo
  tímy migrujú." Ako to predvolený non-null a `?` z [Null Safety](./null-safety.md) skutočne
  dosahuje, v porovnaní s predvoleným nastavením Javy, kde môže byť každý referenčný typ potichu
  null?

  <details>
  <summary>Odpoveď</summary>

  Každý typ v Kotline je non-null, pokiaľ nie je explicitne označený `?` — kompilátor odmietne
  priradenie `null` k non-null typu už v čase kompilácie, čím premení celú kategóriu
  `NullPointerException` na chybu kompilácie namiesto runtime prekvapenia. Opačné predvolené
  nastavenie Javy znamená, že každá referencia môže byť potichu null, pokiaľ vývojár sám nepridá
  vlastnú disciplínu, aby tomu zabránil.
  </details>

- `val list = mutableListOf(1, 2, 3)` a následné `list.add(4)` sa skompiluje bez problémov. Podľa
  [Premenné a Typy](./variables-and-types.md), prečo tomu `val` nezabráni, a čo `val` skutočne
  garantuje?

  <details>
  <summary>Odpoveď</summary>

  `val` zabráni len *znovupriradeniu* samotnej referencie (`list = mutableListOf()` by bola chyba
  kompilácie) — nič nehovorí o tom, či objekt, na ktorý referencia ukazuje, môže byť mutovaný.
  `list.add(4)` mutuje podkladový objekt `MutableList`, nie referenciu `list`, tak je to úplne
  povolené.
  </details>

- Prečo musí byť nullable `Int?` boxovaný na JVM, kým non-null `Int` zvyčajne nie je, podľa
  [Premenné a Typy](./variables-and-types.md), a ako to súvisí s presným sledovaním nullability na
  úrovni typového systému z [Null Safety](./null-safety.md)?

  <details>
  <summary>Odpoveď</summary>

  JVM primitívny `int` vôbec nemá reprezentáciu pre "žiadna hodnota" — `null` vyžaduje referenciu
  na objekt. Keďže typový systém Kotlinu presne sleduje nullability, kompilátor presne vie, kedy
  hodnota môže byť null (`Int?`), a boxuje len tieto prípady, pričom bežný non-null prípad
  ponecháva ako neboxovanú primitívu kvôli výkonu.
  </details>

- Lokálny `val` môže byť smart-castnutý po null checku, ale mutabilná property triedy pristúpená
  rovnako nemôže. Pomocou príkladu `Config`/`printValue` z [Null Safety](./null-safety.md)
  vysvetli, prečo to kompilátor rozlišuje inak.

  <details>
  <summary>Odpoveď</summary>

  Lokálny `val` sa nemôže zmeniť medzi null checkom a jeho použitím, tak ho kompilátor môže
  bezpečne považovať za non-null pre zvyšok toho scope. Mutabilná property (`var`) by teoreticky
  mohla byť zmenená iným kódom medzi checkom a použitím (aj na inom vlákne), tak kompilátor nemôže
  garantovať, že je stále non-null — vyžaduje najprv jej zachytenie do lokálneho `val`.
  </details>

- Prečo je `!!` opísaný ako "takmer vždy znak, že kód by mal byť prestrukturovaný" namiesto
  bežného nástroja null safety, vzhľadom na to, čo [Null Safety](./null-safety.md) hovorí, že
  skutočne robí za behu?

  <details>
  <summary>Odpoveď</summary>

  `!!` vyhodí presne ten `NullPointerException`, kvôli ktorému celý systém null safety Kotlinu
  existuje, ak sa hodnota ukáže byť null — je to únikový poklop, ktorý znovu zavedie runtime
  riziko, ktoré mal typový systém odstrániť v čase kompilácie, namiesto legitímneho spôsobu
  zaobchádzania s nullabilitou.
  </details>

