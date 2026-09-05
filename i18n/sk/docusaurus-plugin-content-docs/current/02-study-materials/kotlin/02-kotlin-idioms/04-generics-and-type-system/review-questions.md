---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- `Box<Dog>` nie je predvolene automaticky považovaný za `Box<Animal>`, ale `ReadOnlyBox<Dog>` je
  považovaný za `ReadOnlyBox<Animal>`. Podľa [Variancia: in a out](./variance-in-out.md), aký je
  štruktúrny rozdiel medzi oboma triedami, ktorý toto robí bezpečným pre jednu, ale nie pre druhú?

  <details>
  <summary>Odpoveď</summary>

  `Box<T>` je mutabilný (má `set`), tak povolenie `Box<Dog>` použiť ako `Box<Animal>` by umožnilo
  niekomu priradiť `Cat` do niečoho, čo je v skutočnosti backed len `Dog`-om — skutočná diera v
  type-safety. `ReadOnlyBox<T>` vždy len *produkuje* `T` (deklarovaný `out`), nikdy neprijíma
  žiadny ako vstup, tak neexistuje spôsob, ako doň vložiť niečo nebezpečné — kompilátor môže
  bezpečne povoliť kovariantný vzťah.
  </details>

- Prečo sa `value is T` nedá skompilovať vnútri obyčajnej generickej funkcie `fun <T> isOfType(value:
  Any): Boolean`, podľa [Reified Typové Parametre](./reified-type-parameters.md), a ktoré dve
  kľúčové slová spolu to opravia?

  <details>
  <summary>Odpoveď</summary>

  Informácia o generickom type sa na JVM za behu vymaže — kým funkcia skutočne beží, nezostane
  žiadne `T`, na ktoré by sa dalo skontrolovať, len `Any`. Označenie funkcie ako `inline` a
  typového parametra ako `reified` to opraví, lebo telo inline funkcie sa skopíruje do každého
  miesta volania v čase kompilácie, čo kompilátoru umožní priamo dosadiť skutočný konkrétny typ
  skôr, než kód vôbec beží.
  </details>

- Prečo môže byť `reified` použitý len na typovom parametri `inline` funkcie, podľa
  [Reified Typové Parametre](./reified-type-parameters.md) — čo by sa pokazilo, keby to bolo
  povolené na obyčajnej, neinlinovanej generickej funkcii?

  <details>
  <summary>Odpoveď</summary>

  Obyčajná (neinline) funkcia sa skompiluje presne raz, generický, bez konkrétneho miesta volania,
  do ktorého by sa dosadil konkrétny typ — naozaj nemá spôsob, ako vedieť, čím bude `T` pre každého
  budúceho volajúceho. `reified` funguje len preto, že inlining duplikuje telo funkcie na každom
  mieste volania, kde je skutočný typový argument už známy v čase kompilácie.
  </details>

- Java `List<? extends Animal>` vyžaduje wildcard na každom mieste volania; Kotlin `List<Animal>`
  ho nikde nepotrebuje. Podľa [Variancia: in a out](./variance-in-out.md), aký je skutočný rozdiel
  v mechanizme, ktorý eliminuje potrebu tohto opakovania?

  <details>
  <summary>Odpoveď</summary>

  Kotlin používa declaration-site varianciu — `out`/`in` sa deklaruje raz na samotnej definícii
  `List` (ako `out`), tak každé použitie automaticky zdedí správne správanie variancie. Java
  používa use-site varianciu, kde si každý volajúci musí sám pamätať anotovať wildcard pri každom
  mieste použitia, keďže samotná definícia triedy nenesie žiadnu informáciu o variancii.
  </details>

- `fun <T : Comparable<T>> max(a: T, b: T): T` používa `>` vnútri svojho tela. Podľa
  [Základy Generík](./generics-basics.md), prečo by odstránenie ohraničenia `: Comparable<T>`
  pokazilo túto funkciu, keď je `T` stále platný generický typový parameter aj bez neho?

  <details>
  <summary>Odpoveď</summary>

  Neobmedzený typový parameter nemá garantované žiadne operácie nad rámec toho, čo poskytuje
  `Any`, a `Any` nemá operátor `>`. Ohraničenie `Comparable<T>` je to, čo garantuje, že každý
  konkrétny typ dosadený za `T` skutočne podporuje porovnávanie, čo je to, čo umožňuje telu funkcie
  vôbec použiť `>` — bez ohraničenia nemá kompilátor základ na povolenie tejto operácie.
  </details>

