---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- V príklade `Animal`/`Dog` z [Extension Funkcie](./extension-functions.md) `val animal: Animal =
  Dog()` a následné `animal.speak()` vypíše `"..."` namiesto `"Woof!"`. Prečo sa toto nesprává ako
  normálny polymorfizmus?

  <details>
  <summary>Odpoveď</summary>

  Extension funkcie sa vyriešia na základe deklarovaného (statického) typu premennej v čase
  kompilácie, nie skutočného runtime typu objektu — `animal` je deklarovaný ako `Animal`, tak sa
  zavolá `Animal.speak()` bez ohľadu na to, čím objekt v skutočnosti pod povrchom je. Skutočný
  member-function override by použil dynamic dispatch a správne zavolal verziu `Dog`; extensions sa
  na tomto mechanizme vôbec nezúčastňujú.
  </details>

- `var String.customTag: String = ""` sa nedá skompilovať. Podľa
  [Extension Vlastnosti](./extension-properties.md), aký je štruktúrny dôvod, a ako sa príklad
  mutabilnej extension property `StringBuilder.lastChar` tomu vyhne?

  <details>
  <summary>Odpoveď</summary>

  Extension properties nemajú backing field — nie je kam na pôvodnej triede uložiť túto storage,
  keďže v skutočnosti nemeníš jej memory layout. Príklad `StringBuilder` funguje, lebo jeho setter
  mutuje *vlastný existujúci mutabilný stav receivera* (character buffer, ktorý `StringBuilder` už
  poskytuje), namiesto pokusu uložiť nové pole na samotnú extension.
  </details>

- `String.() -> Unit` a `(String) -> Unit` obidva nakoniec pracujú so `String`. Podľa
  [Scoped Extensions a Receivery](./scoped-extensions-and-receivers.md), aký je konkrétny rozdiel
  v tom, ako by si napísal kód vnútri lambdy každého z nich?

  <details>
  <summary>Odpoveď</summary>

  Pri `(String) -> Unit` je string obyčajný parameter — odkazoval by si naň explicitne (`it.length`,
  alebo pomenovaný parameter). Pri `String.() -> Unit` je string naviazaný ako `this` vnútri
  lambdy, tak môžeš volať jeho členov priamo bez akéhokoľvek kvalifikátora (`length` namiesto
  `it.length`) — presne mechanizmus, ktorý spôsobuje, že konfiguračné bloky v štýle `apply` sa
  čítajú tak, ako sa čítajú.
  </details>

- [Scoped Extensions a Receivery](./scoped-extensions-and-receivers.md) hovorí, že jeho príklad
  `myApply` je "približne skutočná implementácia `apply` v štandardnej knižnici." Čo presne to
  spôsobuje?

  <details>
  <summary>Odpoveď</summary>

  Typ parametra `myApply`, `block: T.() -> Unit`, znamená, že lambda odovzdaná do neho beží s
  `this` naviazaným na receiver `T` — presne preto môžeš vnútri skutočného `apply { }` bloku
  odkazovať na členov receivera priamo bez kvalifikátora. Skutočná `apply` v štandardnej knižnici
  používa presne tento istý mechanizmus function type with receiver.
  </details>

- Kedy siahnuť po extension funkcii namiesto pridania skutočnej member funkcie do triedy, podľa
  [Extension Funkcie](./extension-functions.md) — a ktoré z týchto kritérií vylučuje extensions
  pre niečo, čo potrebuje prístup k private stavu?

  <details>
  <summary>Odpoveď</summary>

  Extensions sedia, keď nevlastníš triedu, funkcia je čistá samostatná operácia, alebo chceš
  pridať utility správanie bez nabobtnania pôvodnej triedy. Skutočná member funkcia je namiesto
  toho správna voľba, keď funkcia potrebuje polymorfné (prepísateľné) správanie alebo potrebuje
  prístup k private members triedy — extension funkcia nemá vôbec žiadny prístup k private stavu
  triedy, keďže v skutočnosti nie je súčasťou tej triedy.
  </details>

