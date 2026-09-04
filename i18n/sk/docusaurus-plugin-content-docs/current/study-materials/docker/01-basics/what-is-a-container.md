---
sidebar_position: 1
title: Čo je Kontajner
---

# Čo je Kontajner

**Kontajner** je izolovaný proces — alebo skupina procesov — bežiaci na vlastnom kerneli
hostiteľského počítača, urobený tak, aby *vyzeral a pôsobil* ako samostatný, sebestačný systém,
bez toho, aby ním skutočne bol samostatný operačný systém.

## Mechanizmus, v skratke

Skutočnú prácu robia dve funkcie Linux kernelu:

- **Namespaces** — dajú procesu vlastný izolovaný pohľad na veci, ktoré sú normálne globálne:
  vlastný zoznam procesov (nevidí ostatné procesy hostiteľa), vlastné mount body súborového
  systému, vlastné sieťové rozhrania, vlastný hostname. Proces *verí*, že je na počítači sám.
- **Cgroups** (control groups) — obmedzujú a účtujú zdroje, ktoré proces (alebo skupina procesov)
  môže použiť: CPU, pamäť, disk I/O. Zabraňujú jednému kontajneru vyhladovať všetko ostatné na
  hostiteľovi.

Docker (a Podman — pozri tému [Podman](/sk/study-materials/podman/basics/what-is-podman))
neznovuobjavuje ani jedno z toho — je to tooling, ktorý robí namespaces a cgroups pohodlné na
používanie, zabalené s formátom image a CLI.

## Čo to znamená v praxi

```bash
docker run -it ubuntu bash
```

Vnútri tohto shellu `ps aux` ukáže len procesy bežiace *v tomto kontajneri* — nie skutočný zoznam
procesov hostiteľa. `hostname` ukáže kontajnerom vygenerované ID, nie skutočný hostname
hostiteľského počítača. Súborový systém vyzerá ako čerstvá inštalácia Ubuntu, aj keď nikde nebeží
samostatný Ubuntu kernel — je to stále kernel hostiteľa pod tým, len s izolovaným pohľadom na
súborový systém navrstveným navrch (pozri [Image vs. Kontajnery](./images-vs-containers.md)).

## Prečo na tom záleží oproti spusteniu appky priamo na hostiteľovi

- **Konzistencia** — "funguje mi to na počítači" prestane byť o počítači vôbec, ak počítač sám
  jednoducho beží ten istý image kontajnera všade: vývojársky notebook, CI, produkčný server.
- **Izolácia** — závislosti jednej appky (konkrétna verzia Node, konkrétne systémové knižnice) sa
  nemôžu potichu skonfliktovať so závislosťami inej appky na tom istom hostiteľovi, lebo každý
  kontajner má vlastný izolovaný súborový systém.
- **Hranice zdrojov** — utekajúci proces v jednom kontajneri je obmedzený cgroups, namiesto toho,
  aby dokázal spotrebovať celú pamäť hostiteľa a vyhladovať každú inú službu na tom istom
  počítači.

## Nie je to VM

To, že kontajner vyzerá ako sebestačný systém, neznamená, že *ním je* — pozri
[Kontajnery vs. VM](./containers-vs-vms.md) pre presne to, čo sa zdieľa s hostiteľom a čo nie, a
prečo je práve tento rozdiel to, čo robí kontajnery tak oveľa ľahšie na spustenie a beh.
