---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- Služba `api` má `depends_on` na službu `db` bez nastavenej `condition:`, a `api` občas zlyhá pri
  pripájaní hneď po `docker compose up`. Podľa [Multi-Kontajnerové Appky](./multi-container-apps.md),
  prečo obyčajný `depends_on` tomuto nezabráni, a čo to skutočne opraví?

  <details>
  <summary>Odpoveď</summary>

  Obyčajný `depends_on` garantuje len poradie *spustenia* — Docker spustí kontajner `db` pred
  kontajnerom `api`, ale nečaká, kým `db` bude skutočne pripravená prijímať spojenia.
  `depends_on: db: condition: service_healthy` to opraví, lebo počká, kým vlastný healthcheck `db`
  nenahlási zdravý stav, nielen "proces sa spustil."
  </details>

- Prečo sa `api` aj `worker` v Compose súbore môžu pripojiť k databáze pomocou hostname `db`
  namiesto IP adresy, a ako je to *ten istý* podkladový mechanizmus ako DNS na vlastnej sieti
  Dockeru z [Porty a Sieťové Režimy](../04-networking-and-storage/ports-and-network-modes.md)?

  <details>
  <summary>Odpoveď</summary>

  Compose automaticky umiestni každú službu v jednom `docker-compose.yml` na zdieľanú sieť so
  vstavaným DNS rozlišujúcim mená služieb na správny kontajner — presne ten istý mechanizmus
  rozlišovania mien, aký poskytuje ručne vytvorená vlastná Docker sieť, len nastavený automaticky
  namiesto ručne cez `docker network create`.
  </details>

- `docker compose down` a `docker compose down -v` obidva zastavia a odstránia kontajnery každej
  služby. Aký je ten jeden rozdiel, a prečo ho [Základy Compose](./compose-basics.md) označuje
  `:::warning`?

  <details>
  <summary>Odpoveď</summary>

  `-v` navyše odstráni volumes projektu — pre službu s databázou to natrvalo zničí jej dáta, na
  rozdiel od obyčajného `down`, ktorý volumes (a ich dáta) ponechá netknuté pre ďalší `up`.
  </details>

- Prečo táto firma prevádzkuje svoj docs web a svoj hlavný marketingový web ako dva úplne
  samostatné Compose projekty namiesto jedného zdieľaného `docker-compose.yml`, podľa
  [Compose vo Vlastnom Deploy Tejto Organizácie](./compose-in-this-orgs-deploy.md)?

  <details>
  <summary>Odpoveď</summary>

  Každý web sa nasadzuje nezávisle (push do jedného repozitára rebuildne len kontajner toho webu),
  každý má vlastný build pipeline vhodný pre daný web, a chyba v Compose súbore jedného webu nemôže
  náhodne pokaziť nasadenie druhého — výhody, ktoré by jeden zdieľaný súbor stratil.
  </details>

- Ako dva samostatné Compose projekty v nastavení tejto firmy stále umožňujú Caddy dosiahnuť
  `docs-app` aj `astro-app` podľa mena, napriek tomu, že sú nasadzované nezávisle bez zdieľaného
  Compose súboru?

  <details>
  <summary>Odpoveď</summary>

  Obidva deklarujú tú istú externú sieť `proxy-net` ako `external: true` namiesto toho, aby si
  každý vytvoril vlastnú — pripojenie k tej jednej existujúcej zdieľanej bridge sieti je to, čo
  umožňuje Caddy rozlíšiť `docs-app` a `astro-app` podľa mena, úplne nezávisle od toho, ktorý
  Compose projekt vytvoril ktorý kontajner.
  </details>

