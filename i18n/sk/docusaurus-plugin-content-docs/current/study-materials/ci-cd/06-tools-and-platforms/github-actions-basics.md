---
sidebar_position: 1
title: Základy GitHub Actions
---

# Základy GitHub Actions

Konkrétny pohľad na jednu konkrétnu, široko používanú CI/CD platformu — všetko pokryté
abstraktne skôr v tejto téme (pipeliny, joby, triggery, artefakty) sa priamo mapuje na vlastný
slovník a formát súborov GitHub Actions.

## Kde workflow žije

```text
.github/workflows/ci.yml
.github/workflows/deploy.yml
```

Každý workflow je YAML súbor pod `.github/workflows/` v repozitári — viacero workflow súborov
môže koexistovať, každý spustený nezávisle (pozri
[Triggery a Eventy](../01-basics/triggers-and-events.md)).

## Základný slovník

```yaml title=".github/workflows/ci.yml"
name: CI

on:
  push:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install
      - run: npm test
```

- **`on`** — trigger (pozri [Triggery a Eventy](../01-basics/triggers-and-events.md)).
- **`jobs`** — jeden alebo viac jobov, každý bežiaci na vlastnom čerstvom runneri (pozri
  [Fázy a Joby](../04-pipeline-design/stages-and-jobs.md)).
- **`runs-on`** — aké runner prostredie tento job potrebuje (`ubuntu-latest`,
  `windows-latest`, `macos-latest`, alebo self-hosted runner — pozri
  [Self-Hosted vs. Managed Runnery](./self-hosted-vs-managed-runners.md)).
- **`steps`** — sekvencia príkazov/akcií v rámci jedného jobu, spustené v poradí.
- **`uses`** vs. **`run`** — dva rôzne druhy kroku, pokryté ďalej.

## `uses` — znovupoužiteľná, zabalená akcia

```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with:
    node-version: 22
```

**Akcia** je preddefinovaná, znovupoužiteľná jednotka automatizácie — niekto iný (samotný GitHub,
alebo komunita) ju už napísal a publikoval, a `uses:` na ňu len odkazuje podľa mena a verzie
(`@v4` pripne konkrétnu verziu, rovnaká opatrnosť s pripnutím verzie pokrytá pre
[základné image](/sk/study-materials/docker/production-practices/dockerfile-best-practices)
platí aj tu). `actions/checkout` je takmer univerzálna — je to to, čo naozaj stiahne kód
repozitára na runner, predtým než ho môže použiť akýkoľvek iný krok.

## `run` — obyčajný shell príkaz

```yaml
- run: npm install
- run: npm test
- run: |
    echo "Viacriadkové príkazy fungujú tiež"
    echo "Každý riadok beží v tej istej shell session"
```

Pre jednoduchý shell príkaz netreba akciu — `run:` ho jednoducho priamo spustí na runneri, presne
ako jeho napísanie do terminálu (pozri
[Čo je Shell](/sk/study-materials/linux-shell/basics/what-is-a-shell) v téme Linux & Shell pre to,
čo sa naozaj deje pod tým).

## Runnery

**Runner** je skutočný počítač, ktorý vykonáva kroky jobu — GitHub poskytuje managed runnery
(`ubuntu-latest` atď.) s predinštalovanými bežnými nástrojmi, alebo si repozitár/organizácia môže
zaregistrovať vlastný **self-hosted** runner namiesto toho. Pozri
[Self-Hosted vs. Managed Runnery](./self-hosted-vs-managed-runners.md) pre tento kompromis
podrobne.

## Odkazovanie na secrety

```yaml
- run: curl -H "Authorization: Bearer ${{ secrets.DEPLOY_TOKEN }}" https://api.example.com/deploy
```

`${{ secrets.NAME }}` vytiahne hodnotu z nakonfigurovaného úložiska secretov repozitára (alebo
organizácie) — pozri [Správa Secretov v CI](../05-secrets-and-environments/managing-secrets-in-ci.md)
pre všeobecný princíp, ktorý toto implementuje.
