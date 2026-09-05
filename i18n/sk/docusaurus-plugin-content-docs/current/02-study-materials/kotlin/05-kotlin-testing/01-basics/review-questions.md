---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- Test pomenovaný `` `should return 404 when user not found` `` sa číta jasne v CI failure
  reporte, kým `shouldReturn404WhenUserNotFound` vyžaduje mentálne parsovanie camelCase. Podľa
  [Idiómy Testovania Špecifické pre Kotlin](./kotlin-specific-test-idioms.md), aká jazyková funkcia
  Kotlinu umožňuje prvý tvar, a prečo je táto konvencia zámerne obmedzená na testovací kód?

  <details>
  <summary>Odpoveď</summary>

  Mená funkcií v backticks, naozajstná jazyková funkcia Kotlinu, ktorá umožňuje medzery a
  interpunkciu v identifikátoroch, keď sú zabalené v backticks. Je obmedzená na testy, lebo "meno
  funkcie" je tam v skutočnosti ľudsky čitateľná špecifikácia čítaná ľuďmi, nie API volané podľa
  mena z iného kódu — tá istá konvencia v bežnom kóde aplikácie by bola regresia čitateľnosti, a
  mená v backticks sa navyše vôbec nedajú normálne volať z Java interop kódu.
  </details>

- `@Nested inner class WhenCartHasItems` vyžaduje konkrétne Kotlin modifikátor `inner`, nie len
  obyčajnú vnorenú triedu. Podľa [JUnit5 v Kotline](./junit5-in-kotlin.md), čo by sa pokazilo bez
  `inner`?

  <details>
  <summary>Odpoveď</summary>

  Obyčajná (nie `inner`) vnorená trieda v Kotline nemá prístup k členom svojej obklopujúcej triedy
  — `inner` je to, čo dá vnorenej testovacej triede referenciu na inštanciu vonkajšej triedy, čo
  `@Nested` testovacie triedy bežne potrebujú (zdieľaný setup stav, polia z vonkajšej testovacej
  triedy). Bez `inner` by vnorená trieda nemala k tomu vonkajšiemu kontextu vôbec prístup.
  </details>

- Given/When/Then je opísané ako "čisto komentárová/pomenovacia konvencia," nie funkcia JUnit.
  Podľa [Organizácia Testov](./test-organization.md), aká je skutočná praktická hodnota, ktorú
  poskytuje, ak to žiadna knižnica ani anotácia nevynucuje?

  <details>
  <summary>Odpoveď</summary>

  Vynúti konzistentný tvar na každý test — nastav stav, vykonaj jednu akciu, over výsledok — čo
  spraví neznámy test rýchlo parsovateľným, a spraví test robiaci príliš veľa (viacero rozdielnych
  "when") vizuálne zjavným pre čitateľa alebo recenzenta, aj keď nič technicky štruktúru
  nekontroluje ani nevynucuje.
  </details>

- `data class Point(val x: Int, val y: Int)` použitá v `assertEquals(Point(4, 6), result)`
  vyprodukuje failure správu zobrazujúcu skutočné hodnoty polí oboch objektov. Podľa
  [Idiómy Testovania Špecifické pre Kotlin](./kotlin-specific-test-idioms.md), prečo toto
  automaticky funguje pre data class, ale nefungovalo by pre obyčajnú triedu bez vlastného
  `equals()`/`toString()`?

  <details>
  <summary>Odpoveď</summary>

  Data class automaticky vygeneruje štruktúrny `equals()` (porovnávajúci skutočné hodnoty polí,
  nie referenčnú identitu) a skutočný `toString()` zobrazujúci hodnoty polí — obyčajná trieda bez
  toho by porovnávala podľa referenčnej identity (vždy zlyhajúca, pokiaľ to nie je doslova tá istá
  inštancia) a vypísala nepriehľadnú referenciu ako `Point@1a2b3c4d` vo failure správe, neodhaľujúc
  nič o tom, ktoré pole sa v skutočnosti líši.
  </details>

- Rozdelenie `./gradlew test` od `./gradlew integrationTest` na samostatné Gradle source sety/tasky
  je opísané ako aplikovanie CI/CD princípu na konkrétne Kotlin projekt. Podľa
  [Organizácia Testov](./test-organization.md), aká je skutočná výhoda spúšťania týchto na rôznych
  triggeroch namiesto vždy spolu?

  <details>
  <summary>Odpoveď</summary>

  Rýchle unit testy môžu bežať pri každej jednej zmene (okamžitá spätná väzba), kým pomalšie
  integračné testy bežia menej často — spúšťanie celej pomalej sady pri každej zmene by bolo
  nepraktické v rovnakej frekvencii ako rýchla sada. Ich štruktúrne oddelenie na úrovni Gradle je
  to, čo umožňuje ich naozaj rozdielne triggerovať v CI, nie len preferencia pomenovania.
  </details>

