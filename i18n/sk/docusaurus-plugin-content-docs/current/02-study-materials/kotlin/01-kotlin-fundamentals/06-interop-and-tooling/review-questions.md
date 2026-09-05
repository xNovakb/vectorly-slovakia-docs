---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- [Kotlin/Java Interop](./kotlin-java-interop.md) hovorí, že volanie medzi Kotlinom a Javou je
  "naozaj bezproblémové, nie kompatibilná vrstva navyše." Aký jeden fakt o oboch jazykoch to
  spôsobuje, namiesto potreby adaptérovej vrstvy?

  <details>
  <summary>Odpoveď</summary>

  Kotlin aj Java sa kompilujú do toho istého JVM bytecode — za behu nie je zmysluplný rozdiel
  medzi triedou, ktorá začala ako Kotlin zdroj, a tou, ktorá začala ako Java zdroj, tak volanie
  medzi nimi sú len obyčajné volania metód na úrovni bytecode, bez potreby prekladovej vrstvy.
  </details>

- Java metóda bez akýchkoľvek nullability anotácií vráti hodnotu, ktorú Kotlin nedokáže overiť
  ako non-null. Podľa [Platform Types a Java Interop](./platform-types-and-java-interop.md), aký
  typ Kotlin odvodí, a prečo považovanie za non-null nesie skutočné riziko?

  <details>
  <summary>Odpoveď</summary>

  Kotlin odvodí platform type (v tooling zobrazený ako `String!`) — naozaj nevie, či hodnota môže
  byť null, keďže neanotovaná Java nenesie žiadnu informáciu o nullabilite vôbec. Považovanie za
  non-null dôveruje úsudku volajúceho bez zálohy kompilátora; ak je ten úsudok nesprávny, hodí
  presne ten `NullPointerException`, ktorému systém null safety Kotlinu inak zabraňuje v čase
  kompilácie.
  </details>

- Prečo funkcia Kotlinu s predvoleným parametrom potrebuje `@JvmOverloads`, aby bola volateľná z
  Javy s menším počtom argumentov, podľa [Kotlin/Java Interop](./kotlin-java-interop.md), keď
  [Základy Funkcií](../02-functions-and-control-flow/functions-basics.md) ukazuje predvolené
  parametre fungujúce z Kotlinu bez akejkoľvek dodatočnej anotácie?

  <details>
  <summary>Odpoveď</summary>

  Predvolené parametre sú čisto funkcia Kotlin kompilátora — Kotlin volajúci ich môžu vynechať,
  lebo samotný Kotlin kompilátor doplní predvolenú hodnotu na mieste volania. Java koncept
  predvolených parametrov vôbec nemá, tak bez `@JvmOverloads`, ktoré vygeneruje skutočné
  preťažené metódy, by Java kód musel vždy odovzdať každý parameter explicitne.
  </details>

- [Gradle a Kotlin Projekty](./gradle-and-kotlin-projects.md) rozlišuje dependency konfigurácie
  `implementation` a `api`. Pre typickú aplikáciu (nie knižnicu, na ktorej závisia iné projekty),
  prečo na tomto rozdiele "v praxi málokedy záleží"?

  <details>
  <summary>Odpoveď</summary>

  Rozdiel záleží len na tom, čo sa sprístupní classpath v čase kompilácie niečoho iného, keď je
  *tvoj* projekt sám o sebe závislosťou iného projektu — aplikácia nie je konzumovaná ako knižnica
  nikým iným, tak neexistuje žiadny downstream classpath, na ktorý by širšie sprístupnenie `api`
  vôbec mohlo mať vplyv; `implementation` pokrýva vlastné potreby aplikácie tak či tak.
  </details>

- Build skript Kotlin projektu je súbor `build.gradle.kts` namiesto Groovy `build.gradle`. Podľa
  [Gradle a Kotlin Projekty](./gradle-and-kotlin-projects.md), akú konkrétnu IDE výhodu to
  konkrétne prináša, a prečo existuje len preto, že projekt je už Kotlin projekt?

  <details>
  <summary>Odpoveď</summary>

  Keďže build skript je sám napísaný v Kotline, dostáva rovnakú IDE podporu (autocomplete,
  type checking) ako samotný kód aplikácie — výhoda, ktorá dáva zmysel len v Kotlin projekte
  presne preto, že tooling, ktorý rozumie Kotlin syntaxi, je už prítomný a nakonfigurovaný pre
  zvyšok codebase.
  </details>

