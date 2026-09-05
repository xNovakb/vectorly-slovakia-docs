---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- Parameter funkcie je typu `List<String>` namiesto `MutableList<String>`. Podľa
  [Prehľad Kolekcií](./collections-overview.md), čo to signalizuje volajúcemu, a je to garancia,
  že podkladový objekt sa nikdy nemôže zmeniť?

  <details>
  <summary>Odpoveď</summary>

  Signalizuje to, že samotná funkcia nezmutuje to, čo jej bolo odovzdané, keďže `List` naozaj nemá
  vo svojom interface žiadne mutujúce metódy. Nie je to však garancia, že objekt je skutočne
  nemenný — referencia by mohla ukazovať na skutočný `MutableList` pod povrchom, a niečo iné
  držiace samostatnú referenciu na ten istý objekt by ho stále mohlo mutovať.
  </details>

- `listOf(1,2,3,4,5).map{...}.filter{...}.first()` aj `.asSequence()` verzia toho istého reťazca
  obidva nakoniec zavolajú `.first()`. Podľa [Sequences](./sequences.md), prečo len lazy verzia
  vynechá spracovanie elementov 4 a 5?

  <details>
  <summary>Odpoveď</summary>

  Na obyčajnom `List` beží `map` eagerly cez každý element, produkujúc celý nový list, skôr než
  `filter` vôbec začne — kým beží `.first()`, všetkých 5 elementov už prešlo oboma krokmi. Na
  `Sequence` prechádza každý element *celým* reťazcom naraz, a spracovanie sa zastaví hneď, keď
  `.first()` nájde zhodu, takže neskorších elementov sa nikdy nedotkne.
  </details>

- Prečo `generateSequence(1) { it + 1 }` dokáže reprezentovať nekonečnú sekvenciu prirodzených
  čísel, kým `List` to zásadne nedokáže, podľa [Sequences](./sequences.md)?

  <details>
  <summary>Odpoveď</summary>

  `List` je vyhodnotený eagerly — musel by úplne zmaterializovať každý element, aby vôbec
  existoval, čo je pre nekonečný rad nemožné. `Sequence` počíta elementy len tak, ako sú skutočne
  spotrebované, tak v kombinácii s terminálnou operáciou ako `.take(5)` sa vyprodukujú len naozaj
  potrebné elementy.
  </details>

- `numbers.reduce { acc, n -> acc + n }` hodí výnimku na prázdnom liste, ale `numbers.fold(100) {
  acc, n -> acc + n }` nie. Podľa [Funkcionálne Operácie](./functional-operations.md), prečo tento
  rozdiel existuje?

  <details>
  <summary>Odpoveď</summary>

  `reduce` použije vlastný prvý element kolekcie ako počiatočnú akumulátorovú hodnotu, tak prázdna
  kolekcia nemá odkiaľ začať a hodí výnimku. `fold` berie explicitnú počiatočnú hodnotu (`100`)
  dodanú nezávisle od obsahu kolekcie, tak má vždy čo vrátiť, aj keď je kolekcia prázdna.
  </details>

- [Sequences](./sequences.md) varuje, že `Sequence` nie je "vždy rýchlejší." Pomocou prípadov
  "naozaj nezáleží," ktoré uvádza, vysvetli, prečo by zabalenie malého, jediného `.map()` volania
  do `.asSequence()` mohlo pravdepodobne kód spraviť *pomalším*, nie rýchlejším.

  <details>
  <summary>Odpoveď</summary>

  Samotný mechanizmus sequence má réžiu (zabalenie každého kroku, koordinácia lazy vyhodnotenia
  element po elemente), ktorú obyčajná eager `List` operácia neplatí. Pre malú kolekciu alebo
  jednu operáciu bez výhody skorého ukončenia môže táto réžia mechanizmu prevážiť akékoľvek
  úspory, ktoré by lazy vyhodnotenie inak poskytlo — výhoda sa prejaví len pri veľkých kolekciách
  alebo reťazcoch, ktoré sa dajú skoro ukončiť.
  </details>

