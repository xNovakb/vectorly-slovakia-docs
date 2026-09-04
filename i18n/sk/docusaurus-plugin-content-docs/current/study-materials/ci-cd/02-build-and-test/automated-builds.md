---
sidebar_position: 1
title: Automatizované Buildy
---

# Automatizované Buildy

Prvá vec, ktorú väčšina pipeline robí: vezme zdrojový kód a zmení ho na niečo spustiteľné —
kompiluje, bundluje, alebo inak transformuje, presne tak, ako by sa to stalo na počítači
vývojára, len automatizovane a konzistentne.

## Prečo automatizovať niečo, čo vývojár už vie spraviť lokálne

```bash
npm install
npm run build
```

Spustenie tohto lokálne dokáže, že to funguje **na tvojom počítači**, s tvojimi konkrétnymi
nainštalovanými verziami, tvojimi lokálnymi zvláštnosťami prostredia, možno necommitnutými
lokálnymi zmenami. Automatizovaný build beží v čistom, konzistentnom prostredí zakaždým — rovnaký
problém "funguje mi to na počítači," ktorý riešia [kontajnery](/sk/study-materials/docker/basics/what-is-a-container)
pre beh appky, rieši CI pre jej *buildovanie*.

## Build krok by mal byť deterministický

Pri rovnakom vstupe (rovnaký commit) by build mal produkovať rovnaký výstup zakaždým. Veci, ktoré
toto rozbíjajú:

```text
❌ Spoliehanie sa na "latest" verzie závislostí, ktoré sa v priebehu času resolvujú inak
❌ Spoliehanie sa na aktuálny dátum/čas spôsobom, ktorý ovplyvňuje výstup
❌ Spoliehanie sa na súbory, ktoré náhodou existujú na jednom počítači, ale nie sú v repozitári
```

Nedeterministický build je bežný zdroj "včera sa vybuildoval fajn, dnes zlyháva bez zmeny kódu" —
pripnutie verzií závislostí (lockfile ako `package-lock.json`) je najbežnejšia oprava.

## Čo "build" znamená sa dosť líši podľa stacku

```text
Kompilovaný jazyk (Go, Rust, Java):  zdroj → skompilovaný binárny súbor/bytecode
Bundlovaný frontend (React, Vue):      zdroj → optimalizovaný JS/CSS bundle
Statická stránka (táto docs stránka):    markdown/obsah → statické HTML/CSS/JS
Container image:                          Dockerfile → OCI image (pozri tému Docker)
Interpretovaný jazyk (obyčajný Python):     často žiadny samostatný "build" krok vôbec — len inštalácia závislostí
```

Bez ohľadu na stack je koncept pipeline rovnaký: definovaný, automatizovaný, reprodukovateľný krok,
ktorý zmení zdroj na niečo pripravené na ďalšiu fázu (pozri
[Koncept Pipeline](../01-basics/the-pipeline-concept.md)).

## Build caching

```yaml title="Cachovanie závislostí medzi behmi (koncepčne)"
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-${{ hashFiles('package-lock.json') }}
```

Opätovné sťahovanie a inštalovanie každej závislosti pri každom jednom behu pipeline je pomalé a
často zbytočné, ak sa nič nezmenilo — pozri [Caching v CI](../04-pipeline-design/caching-in-ci.md)
pre to, ako toto funguje a prečo na cache key záleží.

## Rýchle zlyhanie pri pokazenom builde

```yaml
jobs:
  build:
    steps:
      - run: npm run build    # ak toto zlyhá, job sa tu zastaví
  test:
    needs: build                # beží len ak sa build podaril
    steps:
      - run: npm test
```

Zlyhanie buildu by malo okamžite zastaviť pipeline namiesto pokračovania k spusteniu testov proti
kódu, ktorý sa ani nedá skompilovať — inak stratený čas a mätúce zlyhanie (zlyhanie testu, ktoré je
v skutočnosti len zlyhanie buildu v prestrojení).
