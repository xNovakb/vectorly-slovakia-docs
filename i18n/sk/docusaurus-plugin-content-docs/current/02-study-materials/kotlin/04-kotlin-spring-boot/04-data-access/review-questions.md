---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- Dve neuložené entity `Order`, obidve s `id = 0`, sa porovnajú ako rovné cez vygenerovaný
  `equals()` data class, ak sa ich ostatné polia zhodou zhodujú. Podľa
  [Kotlin Entity a JPA Gotchas](./kotlin-entities-and-jpa-gotchas.md), prečo sa to stane, a aká je
  štandardná oprava?

  <details>
  <summary>Odpoveď</summary>

  Vygenerované `equals()`/`hashCode()` data class sú založené na *všetkých* konštruktorových
  properties, vrátane `id` — pred persistenciou je `id` stále svoja predvolená hodnota pre každú
  neuloženú entitu, tak dve rôzne neuložené entity so zhodujúcimi sa ostatnými poľami sa porovnajú
  ako rovné. Štandardná oprava je vôbec nepoužívať `data class` pre JPA entity, použiť obyčajnú
  triedu s ručne implementovaným `equals`/`hashCode` založeným len na ID.
  </details>

- Fetchovanie zoznamu objednávok, potom pristupovanie k `order.items` (lazy asociácia) na každej
  jednotlivo, spustí samostatný query na objednávku. Podľa
  [Query s JPA a QueryDSL](./querying-with-jpa-and-querydsl.md), ako sa tento vzor volá, a čo
  konkrétne to opraví?

  <details>
  <summary>Odpoveď</summary>

  N+1 query problém — 1 query na zoznam, plus N ďalších query, jeden na lazy asociáciu každej
  entity. `JOIN FETCH` v JPQL query toto skolabuje do jedného query načítaním asociácie eagerly ako
  súčasti pôvodného query, namiesto spúšťania samostatného lazy loadu na entitu neskôr.
  </details>

- Kotlin `String` (non-null) property je namapovaná na databázový stĺpec, ktorý je v skutočnosti
  nullable. Podľa [Kotlin Entity a JPA Gotchas](./kotlin-entities-and-jpa-gotchas.md), prečo to
  kompilátor Kotlinu nedokáže odchytiť, a čo sa musí stať, aby to naozaj spôsobilo problém?

  <details>
  <summary>Odpoveď</summary>

  Hibernate priradí hodnotu do property cez reflection za behu, úplne obchádzajúc normálne cesty
  kódu Kotlinu — kompilátor nemá žiadnu viditeľnosť do toho, čo databázový stĺpec v skutočnosti
  obsahuje. Problém sa prejaví len vtedy, ak ten stĺpec naozaj obsahuje `NULL` (riadok vložený
  niečím mimo appky, medzera v migrácii), v ktorom momente Hibernate odovzdá `null` do property,
  o ktorej kompilátor predpokladal, že nikdy nemôže byť null.
  </details>

- Väčšina non-ID entity properties musí byť `var`, nie `val`, aj keď `val`-predvolene je
  všeobecný idióm Kotlinu inde. Podľa [Kotlin Entity a JPA Gotchas](./kotlin-entities-and-jpa-gotchas.md),
  prečo to Hibernate konkrétne vyžaduje, a prečo zostáva `id` rozumnou výnimkou?

  <details>
  <summary>Odpoveď</summary>

  Hibernate potrebuje vedieť nastaviť väčšinu entity properties cez bezargumentový konštruktor plus
  reflection (alebo setter properties), čo vyžaduje mutabilný `var`. `id` je rozumná výnimka na
  ponechanie ako `val`, lebo je nastavené raz databázou pri vložení a legitímne sa už potom nikdy
  nemení, na rozdiel od properties ako `status`, ktoré aktualizuje samotná logika aplikácie počas
  životnosti entity.
  </details>

- Meno derived query metódy narastie na
  `findByStatusAndCustomerIdAndCreatedAtBetweenOrderByTotalDesc`. Podľa
  [Základy Spring Data JPA](./spring-data-jpa-basics.md) a
  [Query s JPA a QueryDSL](./querying-with-jpa-and-querydsl.md), je to znak, že derived method
  prístup prestal *fungovať*, alebo niečo iné?

  <details>
  <summary>Odpoveď</summary>

  Stále je funkčne správny — Spring naozaj parsuje a generuje query z mena metódy takejto dĺžky.
  Skutočný signál je čitateľnosť, nie funkčnosť: derived meno s veľa reťazenými podmienkami je
  zvyčajne signál na prechod na explicitný `@Query` s JPQL, nie preto, že by sa derived forma
  pokazila, ale preto, že pri takej dĺžke prestane byť čitateľná.
  </details>

