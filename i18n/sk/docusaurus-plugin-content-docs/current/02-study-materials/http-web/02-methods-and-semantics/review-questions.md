---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- Prečo je prirodzenejšie spraviť `GET` s query parametrami idempotentným a bezpečným, než
  ekvivalentnú akciu poslanú ako telo `POST`?

  <details>
  <summary>Odpoveď</summary>

  `GET` je bezpečný a idempotentný *konvenčne* — prehliadače, cache a proxy s ním tak už
  zaobchádzajú (cachovateľný, opakovateľný). `POST` nesúci rovnaký zámer tieto garancie
  automaticky nezdedí, keďže `POST` konvenčne nie je ani bezpečný, ani idempotentný.
  </details>

- Crawler nasleduje každý odkaz (`GET`) na stránke, vrátane jedného, ktorý náhodou zmaže záznam.
  Ktoré dve vlastnosti tento endpoint porušuje, a prečo na ich porušení záleží aj crawlerom, aj
  prefetchingu prehliadača?

  <details>
  <summary>Odpoveď</summary>

  Bezpečnosť (safety) a idempotenciu — `GET`, ktorý niečo zmaže, poruší kontrakt "žiadne vedľajšie
  účinky," na ktorý sa spoliehajú aj crawlery, aj prefetching prehliadača, keď zaobchádzajú s `GET`
  ako s neškodným na spekulatívne a opakované volanie.
  </details>

- Prečo je `PUT` idempotentný, ale `POST` nie, s odkazom na to, čo každá metóda skutočne
  *znamená* sémanticky, nie len na to, čo náhodou robí v kóde nejakého servera?

  <details>
  <summary>Odpoveď</summary>

  Sémantika `PUT` je "nahraď presne týmto" — poslanie rovnakej náhrady dvakrát necháva zdroj v
  rovnakom finálnom stave oba razy. Sémantika `POST` je "vytvor alebo spusti akciu" — poslanie
  dvakrát vytvorí dve samostatné veci, lebo neexistuje koncept "nahradenia," ku ktorému by sa dalo
  skonvergovať.
  </details>

- API vystaví mazanie ako `GET /users/42/delete` namiesto `DELETE /users/42`. Pomenuj každú
  garanciu z tejto podkapitoly, ktorú tento návrh poruší.

  <details>
  <summary>Odpoveď</summary>

  Bezpečnosť (crawlery a prehliadače už nemôžu zaobchádzať s `GET` ako s neškodným), a v dôsledku
  toho cachovanie a prefetching (nebezpečná akcia by nemala byť dosiahnuteľná cez cachovateľnú,
  spekulatívne sťahovanú metódu).
  </details>

- Poslanie čiastočnej aktualizácie cez `PUT` (namiesto `PATCH`) môže potichu vymazať polia. Ako to
  súvisí s tým, čo "idempotentné" naozaj znamená pre `PUT`?

  <details>
  <summary>Odpoveď</summary>

  `PUT` znamená "toto je teraz celý zdroj" — vynechané polia sú implicitne resetnuté. To je v
  súlade s (nie v rozpore s) tým, že `PUT` je idempotentný: poslanie toho istého čiastočného tela
  dvakrát stále vedie k rovnakému (teraz neúplnému) finálnemu stavu oba razy.
  </details>
