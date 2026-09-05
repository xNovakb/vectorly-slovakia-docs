---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- Multi-stage Dockerfile buildne s `node:22` v stage `builder`, ale finálny stage je `FROM
  node:22-alpine` a len `COPY --from=builder`uje priečinky `dist` a `node_modules`. Podľa
  [Dockerfile Best Practices](./dockerfile-best-practices.md), prečo finálny image vôbec
  neobsahuje build toolchain?

  <details>
  <summary>Odpoveď</summary>

  Každý `FROM` naozaj naštartuje nový stage s vlastnými vrstvami; `COPY --from=builder` vytiahne
  len konkrétne pomenované súbory/priečinky z predošlého stage do nového. Všetko ostatné zo stage
  `builder` — jeho kompilátory, dev závislosti, zdrojové súbory — sa jednoducho nikdy neskopíruje
  ďalej a v finálnom image neexistuje.
  </details>

- Prečo `HEALTHCHECK` odchytí problém, ktorý samotný `restart: unless-stopped` nedokáže, vzhľadom
  na to, ako [Health Checky a Restart Politiky](./health-checks-and-restart-policies.md) rozlišuje
  "spadol" od "nezdravý"?

  <details>
  <summary>Odpoveď</summary>

  Restart politika reaguje len na skutočné ukončenie procesu kontajnera. Zaseknutý alebo
  nereagujúci proces, ktorý nikdy neskončí — len prestane odpovedať — nedá Dockeru vôbec žiadny
  pád, na ktorý by reagoval; `HEALTHCHECK` je to, čo zistí, že "beží" a "skutočne funguje" sa
  rozišli, lebo pravidelne testuje skutočné správanie appky namiesto len sledovania, či proces
  zomrel.
  </details>

- Prečo je `FROM node:latest` produkčné riziko spôsobom, ktorý sa prejaví "o mesiace neskôr",
  podľa [Dockerfile Best Practices](./dockerfile-best-practices.md)?

  <details>
  <summary>Odpoveď</summary>

  `latest` je len tag, ktorý sa priebežne presmerováva na novšie buildy — Dockerfile pripnutý na
  `node:latest` môže pri rebuilde dlho po napísaní Dockerfile potichu stiahnuť inú major verziu
  Node, bez akejkoľvek zmeny kódu z tvojej strany, ktorá by vysvetlila náhle zlyhanie.
  </details>

- Kontajnery `docs-app` a `astro-app` tejto firmy obidva používajú multi-stage build (Node.js
  builder → Nginx runner) a nepublikujú žiadne `ports:`. Ktoré dve produkčné praktiky z tejto
  podkapitoly táto kombinácia reálne uplatňuje, podľa
  [Nastavenie Kontajnerov Tejto Organizácie](./this-orgs-container-setup.md)?

  <details>
  <summary>Odpoveď</summary>

  Multi-stage buildy (odoslanie len vybuildovaného statického výstupu a minimálneho Nginx
  runtimu, nie Node.js build toolchainu) a zámerné nepublikovanie portu — kontajner je
  dosiahnuteľný len cez Caddy na zdieľanej sieti, konštrukčne, nie cez firewall pravidlo, ktoré by
  mohlo byť zle nakonfigurované.
  </details>

- Prečo záleží na `start_period` špecificky pre `HEALTHCHECK`, a čo by sa stalo pomaly
  naštartujúcej appke bez neho?

  <details>
  <summary>Odpoveď</summary>

  `start_period` je ochranná lehota, počas ktorej zlyhané kontroly nepočítajú do `retries` — pomaly
  naštartujúca appka by inak mohla byť označená za nezdravú (alebo dokonca reštartovaná, na
  platformách reagujúcich na health status) skôr, než skutočne dobehne bootovanie, len preto, že
  healthcheck začal testovať skôr, než bola appka pripravená odpovedať.
  </details>

