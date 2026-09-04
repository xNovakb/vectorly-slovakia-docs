---
sidebar_position: 3
title: Triggery a Eventy
---

# Triggery a Eventy

Pipeline nebeží sama od seba — niečo ju musí spustiť. **Trigger** je event, ktorý naštartuje beh
pipeline.

## Bežné typy triggerov

```yaml title="Push na konkrétnu vetvu"
on:
  push:
    branches: [main]
```

```yaml title="Pull request otvorený alebo aktualizovaný"
on:
  pull_request:
    branches: [main]
```

```yaml title="Rozvrh (cron syntax)"
on:
  schedule:
    - cron: "0 3 * * *"    # každý deň o 3:00
```

```yaml title="Manuálny trigger, netreba zmenu kódu"
on:
  workflow_dispatch:
```

```yaml title="Nový tag pushnutý (bežné pre releasy)"
on:
  push:
    tags: ["v*"]
```

## Push vs. pull-request triggery — zmysluplný rozdiel

- **Push-triggered** — beží voči kódu presne tak, ako existuje na tej vetve. Typicky sa používa
  pre vetvu, ktorá naozaj nasadzuje (napr. `main`).
- **Pull-request-triggered** — beží voči *výsledku zlúčenia* vetvy PR do jej cieľa — zachytáva
  integračné problémy, ktoré by samotná vetva PR neodhalila, ešte pred samotným mergom. Toto je
  trigger za vzorom "checky musia prejsť pred mergom," ktorý väčšina tímov používa pre code review
  gate.

## Naplánované triggery — nad rámec len reagovania na zmeny kódu

Naplánovaná pipeline beží nezávisle od akejkoľvek zmeny kódu — užitočné pre veci, ktoré sa musia
diať pravidelne bez ohľadu na to, či sa niečo zmenilo:

```text
- Nočné behy plnej testovacej sady (širšie/pomalšie než to, čo beží pri každom push)
- Skenovanie zraniteľností závislostí
- Naplánované zálohy alebo cleanup joby
- Periodická kontrola odkazov na docs stránke
```

## Manuálne triggery — zámerná ľudská akcia

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: "Ktoré prostredie nasadiť"
        required: true
        default: "staging"
```

Manuálny trigger môže prijímať vstupy, čím premení pipeline na niečo bližšie self-service nástroju
— "znovu nasaď aktuálny build na staging" ako kliknutie na tlačidlo, namiesto potreby nového
commitu len na opätovné spustenie niečoho.

## Kombinovanie viacerých triggerov

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:
```

Veľmi bežné: bež automaticky pri každom push a PR, ale *aj* ponechaj dostupný manuálny trigger pre
prípady ako opätovné spustenie deploy bez nového commitu (napr. po prechodnom zlyhaní
infraštruktúry, nie probléme s kódom).

## Filtrovanie toho, čo naozaj spustí beh

```yaml
on:
  push:
    branches: [main]
    paths:
      - "src/**"
      - "package.json"
```

Path filtre zabránia nesúvisiacim zmenám (oprava preklepu v README) zbytočne spustiť plnú, možno
pomalú pipeline — zmysluplná úspora nákladov/času na veľkom codebase, kde nie každý commit sa
dotýka kódu, ktorý pipeline naozaj potrebuje rebuildovať alebo znovu otestovať.
