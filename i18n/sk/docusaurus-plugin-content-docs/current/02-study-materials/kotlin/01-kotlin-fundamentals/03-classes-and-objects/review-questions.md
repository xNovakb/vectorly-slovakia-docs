---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- `class User(val name: String, val email: String)` a `data class User(val name: String, val
  email: String)` vyzerajú takmer identicky. Podľa [Data Classes](./data-classes.md), čo presne
  druhá z nich generuje navyše oproti prvej, a prečo na tom záleží pre `user1 == user2`?

  <details>
  <summary>Odpoveď</summary>

  Modifikátor `data` automaticky generuje `equals()`, `hashCode()`, `toString()`, `copy()` a
  `componentN()` funkcie založené na constructor properties. Bez `data` sa `==` na obyčajnej
  triede vráti k porovnaniu podľa referenčnej identity, tak dve inštancie s identickými hodnotami
  polí by sa porovnali ako `false`; s `data` `equals()` porovnáva skutočné hodnoty properties, tak
  sa porovnajú ako `true`.
  </details>

- Prečo [Triedy a Konštruktory](./classes-and-constructors.md) hovorí, že konštruktorový parameter
  bez `val`/`var` "nie je property," a čo sa presne pokazí, ak sa ho pokúsiš pristúpiť mimo `init`
  bloku alebo metódy?

  <details>
  <summary>Odpoveď</summary>

  Bez `val`/`var` je parameter len obyčajný konštruktorový argument obmedzený na
  konštruktorovú/`init` logiku samotnú — vôbec nie je uložený ako pole na inštancii, tak neskôr
  nie je čo pristúpiť. Niečo ako `prefix` v `Logger(prefix)` musí byť explicitne zachytené do
  skutočnej property (ako `fullPrefix`), ak má prežiť aj po konštrukcii.
  </details>

- Factory funkcia v companion objecte môže vrátiť `null` pri neplatnom vstupe; obyčajný
  konštruktor nemôže. Podľa [Objects a Companion Objects](./objects-and-companion-objects.md),
  prečo je to konkrétny dôvod siahnuť po `private constructor` + companion factory namiesto
  obyčajného public konštruktora?

  <details>
  <summary>Odpoveď</summary>

  Konštruktor je štruktúrne povinný buď plne vytvoriť inštanciu, alebo hodiť výnimku — nemá
  spôsob, ako signalizovať "tento vstup bol neplatný, tu je namiesto toho `null`." Factory funkcia
  v companion objecte je len obyčajná funkcia, voľná vrátiť `null`, cachovanú inštanciu, alebo
  dokonca iný podtyp na základe argumentov, čo pevný kontrakt konštruktora nedokáže vyjadriť.
  </details>

- Prečo [Data Classes](./data-classes.md) odporúča sealed hierarchiu tried namiesto pokusu
  rozšíriť data class pre rodinu súvisiacich typov, viažuc sa späť na to, čo
  [Triedy a Konštruktory](./classes-and-constructors.md) hovorí o vlastnej `equals` sémantike?

  <details>
  <summary>Odpoveď</summary>

  Vygenerované `equals()`/`hashCode()` data class sú založené na jej vlastných deklarovaných
  properties — zdedenie tejto vygenerovanej rovnosti naprieč hierarchiou tried má tendenciu
  produkovať mätúce, ľahko pokaziteľné porovnania (napr. podtrieda pridávajúca polia, o ktorých
  vygenerovaný `equals()` rodiča nevie). Sealed hierarchia modeluje "jeden z niekoľkých
  súvisiacich typov" bez toho, aby sa vôbec spoliehala na zdedenú rovnosť data class.
  </details>

- `AppConfig.printInfo()` (`object` deklarácia) a `User.create(...)` (companion object factory)
  sú obidva volané bez explicitného volania `new`/konštruktora. Podľa
  [Objects a Companion Objects](./objects-and-companion-objects.md), aký je skutočný rozdiel
  medzi tým, čo každý z nich reprezentuje?

  <details>
  <summary>Odpoveď</summary>

  `AppConfig` je samostatný singleton — existuje presne jedna inštancia `AppConfig`, naviazaná na
  žiadnu inú triedu. `User.create` je člen companion objectu *asociovaného s* triedou `User`
  konkrétne — je to najbližší ekvivalent Kotlinu k Java static metóde, existujúci na poskytnutie
  funkcionality na úrovni triedy (factories, konštanty) pre `User`, nie singleton sám osebe.
  </details>

