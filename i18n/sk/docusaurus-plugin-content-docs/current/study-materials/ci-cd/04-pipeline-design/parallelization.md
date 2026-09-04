---
sidebar_position: 3
title: Paralelizácia
---

# Paralelizácia

[Fázy a Joby](./stages-and-jobs.md) pokrylo *prečo* nezávislé joby predvolene bežia súčasne,
akonáhle nemajú medzi sebou vzťah závislosti — táto stránka pokrýva zámerný návrh pipeline na
využitie tohto, vrátane rozdelenia práce, ktorá by inak bola jeden veľký sekvenčný job.

## Rozdelenie pomalej testovacej sady

```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - run: npm test -- --shard=${{ matrix.shard }}/4
```

Jedna 20-minútová testovacia sada rozdelená na 4 paralelné shardy (každý beží zhruba štvrtinu
testov) sa môže dokončiť bližšie k 5-6 minútam reálneho času, za cenu behu na 4x výpočtovom
výkone súčasne — priamy kompromis čas-za-zdroje, nie zadarmo rýchlosť.

## Matrix buildy — testovanie naprieč viacerými konfiguráciami naraz

```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, windows-latest, macos-latest]
    steps:
      - run: npm test
```

Toto spustí **celú kombináciu** — 3 verzie Node × 3 operačné systémy = 9 paralelných jobov —
stručný spôsob overenia kompatibility naprieč každou kombináciou, ktorú knižnica alebo appka
naozaj potrebuje podporovať, bez ručného vypisovania 9 samostatných takmer identických definícií
jobov.

```mermaid
graph LR
    subgraph "Matrix: 3 verzie × 3 OS = 9 paralelných jobov"
        A[Node 18, Ubuntu]
        B[Node 18, Windows]
        C[Node 18, macOS]
        D[Node 20, Ubuntu]
        E[Node 20, Windows]
        F[Node 20, macOS]
        G[Node 22, Ubuntu]
        H[Node 22, Windows]
        I[Node 22, macOS]
    end
```

## Skutočné limity — toto nie je zadarmo rýchlosť

- **Súťaženie o zdieľané zdroje** — ak každý paralelný job zasiahne rovnakú externú databázu,
  API rate limit, alebo zdieľanú test fixture, spustenie viacerých z nich súčasne môže spôsobiť
  zlyhania, ktoré nemajú nič spoločné so skutočným testovaným kódom, len súťaženie medzi
  samotnými paralelnými jobmi.
- **Klesajúce výnosy** — rozdelenie 2-minútového jobu na 4 kúsky zmysluplne nepomôže; každý kúsok
  stále platí vlastnú réžiu nastavenia prostredia (checkout, inštalácia závislostí), čo môže
  nakoniec dominovať nad skutočným pracovným časom pri dostatočne malých úsekoch.
- **Cena** — väčšina CI platforiem účtuje podľa výpočtového času/súbežnosti v nejakej forme.
  Spustenie 9 paralelných jobov namiesto 1 sekvenčného je naozaj 9x výpočtu pre ten beh, aj keď
  reálny čas klesne — skutočný kompromis nákladov, nad ktorým sa oplatí byť zámerný, nie
  jednoznačná výhra.

## Praktický prístup

Paralelizuj naozaj pomalé, nezávislé časti (veľká testovacia sada, matrix reálnych kompatibilných
cieľov, ktoré sa naozaj musia overiť) — nerozdeľuj reflexívne každý job na maximálny možný
paralelizmus, keďže od určitého bodu réžia nastavenia a súťaženie o zdieľané zdroje začnú
zožierať alebo obracať úspory času.
