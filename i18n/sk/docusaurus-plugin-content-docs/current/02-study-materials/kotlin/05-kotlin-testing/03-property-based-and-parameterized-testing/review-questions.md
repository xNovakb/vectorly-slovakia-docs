---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- `@ParameterizedTest @ValueSource(ints = [2, 4, 6, 8])` a `checkAll<List<Int>> { ... }` obidva
  znižujú opakovanie pri písaní testov, ale predstavujú naozaj odlišné testovacie filozofie. Podľa
  [Parametrizované Testy](./parameterized-tests.md) a
  [Property-Based Testovanie s Kotest](./property-based-testing-with-kotest.md), aký je zásadný
  rozdiel v tom, *odkiaľ vstupy pochádzajú*?

  <details>
  <summary>Odpoveď</summary>

  Parametrizované testy spustia tú istú logiku proti vstupom, ktoré autor explicitne ručne vybral
  a vypísal. Property-based testovanie automaticky vygeneruje potenciálne stovky náhodných
  vstupov, kontrolujúc, či všeobecná vlastnosť platí naprieč všetkými z nich — odchytiac edge case
  (prázdny zoznam, veľmi veľké hodnoty), na ktorý by človek nikdy nepomyslel ručne vybrať.
  </details>

- Property-based test na `list.reversed().reversed() shouldBe list` zlyhá na veľkom,
  neprehľadnom náhodne vygenerovanom vstupe. Podľa
  [Property-Based Testovanie s Kotest](./property-based-testing-with-kotest.md), čo Kotest
  automaticky spraví, čo debugovanie tohto zlyhania spraví zvládnuteľnejším?

  <details>
  <summary>Odpoveď</summary>

  Kotest zmenší zlyhaný prípad — automaticky hľadá menší, jednoduchší vstup, ktorý stále spúšťa
  to isté zlyhanie, namiesto ponechania vývojára debugovať proti pôvodnému veľkému, komplexnému
  vygenerovanému prípadu. Debugovanie 2-prvkového zlyhaného prípadu je oveľa zvládnuteľnejšie ako
  debugovanie veľkého zoznamu s ľubovoľnými číslami.
  </details>

- `checkAll(Arb.int(1..100)) { number -> isValidAge(number) shouldBe true }` obmedzí rozsah
  generátora namiesto použitia plne generického predvoleného generátora `Int` v Kotest. Podľa
  [Property-Based Testovanie s Kotest](./property-based-testing-with-kotest.md), prečo by
  použitie neobmedzeného predvoleného generátora tu bola v skutočnosti nesprávna voľba?

  <details>
  <summary>Odpoveď</summary>

  Neobmedzený predvolený generátor by vyprodukoval hodnoty naprieč celým rozsahom `Int`, vrátane
  záporných čísel a hodnôt ďaleko mimo čokoľvek, čím by skutočný vek mohol byť — testovanie "je
  toto platný vek" proti vstupom, ktoré vôbec nie sú realistickými vekmi, netestuje zamýšľanú
  logiku zmysluplne. `Arb.int(1..100)` obmedzí generovanie na realisticky vyzerajúce vstupy
  konkrétne relevantné pre to, čo sa testuje.
  </details>

- `userFixture(isActive = false)` je preferovaná pred konštrukciou plného `User(...)` s každým
  poľom uvedeným priamo. Podľa [Test Fixtures a Buildery](./test-fixtures-and-builders.md), čo
  verzia s fixture komunikuje čitateľovi, čo úplne priama verzia nekomunikuje?

  <details>
  <summary>Odpoveď</summary>

  Komunikuje, že `isActive = false` je ten jeden fakt, na ktorom tomuto konkrétnemu testu naozaj
  záleží — každé iné pole má nenápadnú, rozumnú predvolenú hodnotu, ktorú čitateľ nemusí mentálne
  odfiltrovávať. Plne priama konštrukcia s každým uvedeným poľom zahmlieva, ktoré pole je v
  skutočnosti relevantné pre testované správanie medzi všetkým nesúvisiacim šumom.
  </details>

- Fixture funkcie testov sú umiestnené pod `src/test/kotlin/.../fixtures/` namiesto
  `src/main/kotlin/`. Podľa [Test Fixtures a Buildery](./test-fixtures-and-builders.md), prečo na
  tomto umiestnení záleží nad rámec jednoduchej organizačnej úhľadnosti?

  <details>
  <summary>Odpoveď</summary>

  Fixtures existujú čisto na to, aby uľahčili písanie testov, a nemajú dôvod byť súčasťou
  skutočného produkčného buildu — ich umiestnenie konkrétne do test source setu (nie do main)
  zabráni tomu, aby test-only kód vôbec unikol do produkčného artefaktu, nielen udržuje codebase
  usporiadaný.
  </details>

