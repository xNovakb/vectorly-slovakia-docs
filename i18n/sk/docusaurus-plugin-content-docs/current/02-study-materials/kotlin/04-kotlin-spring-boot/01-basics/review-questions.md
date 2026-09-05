---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- Trieda Kotlinu anotovaná `@Service` funguje lokálne v jednoduchých testoch v pohode, potom
  metóda `@Transactional` potichu neúčastní transakcie po nasadení. Podľa
  [Spring Boot s Kotlinom](./spring-boot-with-kotlin.md), aká je koreňová príčina, a ktorý Gradle
  plugin to opraví?

  <details>
  <summary>Odpoveď</summary>

  Triedy Kotlinu sú predvolene `final`, ale Spring `@Transactional` (a AOP všeobecne) sa spolieha
  na CGLIB proxy — dynamicky generované podtriedy za behu — ktoré nemôžu podtriedu `final` triedy.
  `kotlin("plugin.spring")` automaticky odstráni implicitné `final` z každej triedy anotovanej
  Spring stereotypmi, tak proxy mechanizmus môže naozaj fungovať.
  </details>

- Trieda anotovaná `@Entity` hodí `InstantiationException` za behu, nie chybu kompilácie. Podľa
  [Spring Boot s Kotlinom](./spring-boot-with-kotlin.md), prečo sa toto konkrétne zlyhanie prejaví
  len za behu, a čo chýba?

  <details>
  <summary>Odpoveď</summary>

  Hibernate inštanciuje entity cez reflection, volajúc bezargumentový konštruktor — ale Kotlin ho
  predvolene negeneruje spôsobom, akým to implicitne dokáže obyčajná Java trieda. Kompilátor toto
  nedokáže odchytiť v čase kompilácie, keďže trieda sama sa skompiluje bez problémov; zlyhanie sa
  prejaví len keď sa Hibernate skutočne pokúsi ju reflektívne skonštruovať. `kotlin("plugin.jpa")`
  automaticky vygeneruje chýbajúci bezargumentový konštruktor.
  </details>

- `runApplication<Application>(*args)` nahrádza Java `SpringApplication.run(Application.class,
  args)`. Podľa [Štruktúra Projektu](./project-structure.md), čomu presne sa vyhne typový parameter
  `<Application>` a spread operátor `*args`?

  <details>
  <summary>Odpoveď</summary>

  `<Application>` je reified generický typový parameter, umožňujúci `runApplication` vedieť
  konkrétnu triedu bez potreby explicitne odovzdať `.class`/`::class`. `*args` (spread operátor)
  rozbalí `Array<String>` na jednotlivé vararg argumenty — bez neho by sa celé pole odovzdalo ako
  jeden jediný argument namiesto viacerých varargov, ktoré funkcia očakáva.
  </details>

- `maxUploadSizeMb` v Kotlin `@ConfigurationProperties` data class sa správne naviaže na
  `max-upload-size-mb` v `application.yml` s nulovým manuálnym mapovacím kódom. Podľa
  [Konfigurácia a Profily](./configuration-and-profiles.md), aká konvencia toto spraví automatickým?

  <details>
  <summary>Odpoveď</summary>

  Relaxed binding Spring Boot automaticky mapuje camelCase mená properties Kotlinu na kebab-case
  kľúče YAML (a naopak) — toto nie je mágia špecifická pre Kotlin, je to všeobecná konvencia
  Spring Boot, ktorá sa prirodzene zhoduje s idiomatickým pomenovaním v Kotline, bez potreby
  explicitnej anotácie na spojenie oboch pre každú property.
  </details>

- Dve `@Service` implementácie tej istej interface sú každá anotovaná `@Profile("prod")` a
  `@Profile("!prod")`. Podľa [Konfigurácia a Profily](./configuration-and-profiles.md), aký
  problém toto rieši, ktorý by jedna implementácia s `if` príkazom kontrolujúcim aktívny profil
  neriešila tak čisto?

  <details>
  <summary>Odpoveď</summary>

  Umožňuje to výmenu celej implementácie beanu na základe prostredia na úrovni container-wiring —
  užitočné pre niečo, čo by naozaj nemalo bežať proti reálnym externým službám mimo produkcie
  (odosielanie skutočných emailov, účtovanie skutočných platieb). Namiesto jednej implementácie
  vetviacej sa interne podľa prostredia sa Spring rozhodne, ktorú celú triedu vôbec inštanciovať,
  čím zostáva každá implementácia zameraná len na skutočné správanie svojho prostredia.
  </details>

