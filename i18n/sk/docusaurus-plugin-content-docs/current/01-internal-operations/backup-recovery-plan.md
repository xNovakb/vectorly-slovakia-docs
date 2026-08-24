---
sidebar_position: 3
title: Plán zálohovania a obnovy
---

# Plán zálohovania a obnovy

> TODO: doplniť — harmonogram záloh, retencia, cieľové úložisko a postup obnovy servera krok za krokom.

## Rozsah

- Zálohy na úrovni VPS (Netcup) / snapshoty
- Zálohy Docker volumes pre jednotlivé služby (databázy, nahrané súbory)
- Klientske zálohovacie skripty — pozri príručku každého klienta v sekcii [Klienti](/sk/clients/mbm-group/overview)

## Postup obnovy

> TODO: zdokumentovať postup obnovy od nuly: reprovision VPS, obnoviť `~/.ssh/config` + deploy kľúče (pozri [Architektúra servera](./server-architecture.md)), znovu vytvoriť `proxy-net`, znovu nasadiť každú službu cez jej CI/CD pipeline alebo `docker compose up -d --build`.
