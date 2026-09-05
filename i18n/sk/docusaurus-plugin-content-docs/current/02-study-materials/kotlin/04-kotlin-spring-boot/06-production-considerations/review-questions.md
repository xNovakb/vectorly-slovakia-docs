---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- Docker `HEALTHCHECK` pre Spring Boot kontajner volá `/actuator/health`. Podľa
  [Actuator a Observability](./actuator-and-observability.md), prečo je toto zmysluplne lepšia
  kontrola ako taká, ktorá len potvrdí, že proces stále beží?

  <details>
  <summary>Odpoveď</summary>

  `/actuator/health` automaticky agreguje status zo skutočných závislostí (konektivita databázy,
  diskový priestor, a akékoľvek vlastné beany `HealthIndicator`) do jedného celkového statusu
  `UP`/`DOWN` — naozaj pokazená závislosť ako nefunkčný platobný provider dokáže spôsobiť, že celá
  appka nahlási `DOWN`, čo je presne rozlíšenie "proces beží, ale nefunguje naozaj," ktoré
  vyžadujú pokyny Docker témy pre health checky, nie len statický liveness ping.
  </details>

- Fetchovanie 100 objednávok, potom lazy loadovanie items každej objednávky jednotlivo,
  vyprodukuje 101 queries. Podľa [Základy Ladenia Výkonu](./performance-tuning-basics.md), prečo
  je tento bug konkrétne nebezpečný z hľadiska *kedy* sa všimne?

  <details>
  <summary>Odpoveď</summary>

  Je neviditeľný na malých lokálnych testovacích datasetoch — 100 extra rýchlych queries proti
  malej lokálnej databáze sotva zaregistrujete — a stane sa bolestne zjavným až v produkčnom
  meradle, kde tie isté extra queries bežia proti zaťaženej produkčnej databáze a násobia sa
  naprieč konkurentnými requestmi. Bug existuje identicky v dev aj prod; len jeho cena sa líši
  natoľko, aby bola skutočne zaznamenaná.
  </details>

- Layered JAR rozdelí fat JAR Spring Boot na samostatné vrstvy Docker image podľa toho, ako často
  sa každá mení. Podľa
  [Balenie a Nasadzovanie Spring Boot Appky](./packaging-and-deploying-a-spring-boot-app.md), ktorý
  koncept z Docker témy toto priamo znovupoužíva, a čo konkrétne sa v dôsledku toho zrýchli?

  <details>
  <summary>Odpoveď</summary>

  Znovupoužíva cachovanie vrstiev image z Docker témy — závislosti (ktoré sa menia zriedkavo) idú
  do skoršej vrstvy, kód aplikácie (ktorý sa mení často) ide do neskoršej. Zmena len kódu potom
  invaliduje len malú finálnu vrstvu `application`, nie celú, na stovky megabajtov veľkú vrstvu
  závislostí, čím sa zmysluplne zrýchlia rebuildy aj pushovanie do registra.
  </details>

- Zvýšenie `maximum-pool-size` HikariCP z hodnoty založenej na vzorci na svojvoľne veľké okrúhle
  číslo nespraví appku rýchlejšou, a môže ju spraviť pomalšou. Podľa
  [Základy Ladenia Výkonu](./performance-tuning-basics.md), prečo viac spojení automaticky
  neznamená lepší throughput?

  <details>
  <summary>Odpoveď</summary>

  Každé spojenie spotrebuje skutočné zdroje na strane databázy, a predimenzovaný pool spôsobí
  nadmerné súperenie na strane databázy plus réžiu prepínania kontextu — od určitého bodu viac
  spojení aktívne škodí výkonu namiesto toho, aby pomáhalo. Vlastné pokyny HikariCP odporúčajú
  veľkosť z vzorca blízkeho `(počet jadier * 2) + effective_spindle_count`, nie hádanie veľkého
  čísla na základe predpokladu, že väčšie je vždy lepšie.
  </details>

- Fat JAR Spring Boot appky je vybuildovaný pomocou `./gradlew bootJar` a skopírovaný do
  single-stage Dockerfile používajúceho plný JDK image za behu. Podľa
  [Balenie a Nasadzovanie Spring Boot Appky](./packaging-and-deploying-a-spring-boot-app.md) a
  multi-stage build vzoru z Docker témy, čo sa premrhá nepoužitím multi-stage buildu tu?

  <details>
  <summary>Odpoveď</summary>

  Plný JDK (kompilátor, build nástroje) je potrebný len na *vyprodukovanie* JAR, nie na jeho beh —
  beh potrebuje len JRE. Single-stage build odošle celý build toolchain a Gradle dependency cache
  vo finálnom image bez akéhokoľvek prínosu za behu, zmysluplne nafúkne image v porovnaní s
  multi-stage buildom, ktorý úplne zahodí JDK stage `builder` a odošle len finálny image založený
  na JRE.
  </details>

