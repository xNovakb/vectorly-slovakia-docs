---
sidebar_position: 2
title: Spúšťanie Testov v CI
---

# Spúšťanie Testov v CI

Automatizované testy poskytujú svoju skutočnú hodnotu, až keď bežia **automaticky, pri každej
zmene** — testovacia sada, ktorá beží len keď si vývojár spomenie ju spustiť lokálne, zachytí oveľa
menej regresií než tá istá sada zapojená do CI.

## Základné nastavenie

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npm test
```

Jednoduché v koncepte — hodnota je úplne v tom, že toto beží **spoľahlivo, pri každom push/PR**,
nie v žiadnej špeciálnej CI-špecifickej technike písania testov.

## Exit kódy sú to, čo CI naozaj kontroluje

```bash
npm test
echo $?    # 0 = všetky testy prešli, nenulové = aspoň jeden zlyhal
```

CI "nerozumie" výstupu testov sémanticky — kontroluje **exit kód** príkazu testov (pozri
[Čo je Proces](/sk/study-materials/linux-shell/processes/what-is-a-process) v téme Linux & Shell
pre presne to, čo exit kód je). Test runner, ktorý skončí s `0` aj keď testy zlyhajú
(nesprávne nakonfigurovaný runner, alebo taký, ktorý len vypíše zlyhania bez zlyhania procesu),
spôsobí, že CI nahlási úspech na naozaj pokazenom builde — reálna, aj keď nie bežná, past, ktorú
sa oplatí poznať.

## Rôzne druhy testov, rôzne zaobchádzanie v CI

```text
Unit testy        — rýchle, žiadne externé závislosti, bežia pri každom jednom push/PR
Integračné testy   — pomalšie, môžu potrebovať reálnu databázu/službu, často bežia menej často
                       (napr. len na PR smerujúcich do main, nie na každom jednom commite)
End-to-end testy      — najpomalšie, potrebujú plne bežiacu appku, často bežia podľa rozvrhu alebo
                          pred releasom namiesto pri každom push
```

Spúšťanie plnej, najpomalšej testovacej sady pri každom jednom push sa neškáluje dobre s rastom
codebase — bežný vzor je spúšťať rýchle unit testy pri každom push, a vyhradiť pomalšie sady pre
menej časté triggery (pozri [Triggery a Eventy](../01-basics/triggers-and-events.md)).

## Nestabilné (flaky) testy — reálny, bežný CI problém

**Flaky test** prechádza a zlyháva nekonzistentne bez skutočnej zmeny kódu — zvyčajne spôsobené
predpokladmi o časovaní, zdieľaným stavom medzi testami, alebo závislosťou na externých službách,
ktoré nie sú dokonale spoľahlivé.

:::warning
Lákavá "oprava" — jednoducho spustiť pipeline znova, kým neprejde — aktívne narúša dôveru v
testovaciu sadu v priebehu času. Akonáhle si tím zvykne ignorovať "asi flaky" červený build,
skutočné zlyhania sa začnú rovnako mávnutím ruky prehliadať. Flaky testy treba opraviť alebo
explicitne karanténovať (označiť a sledovať samostatne), nie rutinne obchádzať opätovným
spúšťaním.
:::

## Test reporty a viditeľnosť

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: test-results.xml
```

Nad rámec holého pass/fail vie väčšina CI platforiem zobraziť štruktúrované výsledky testov
(ktoré konkrétne testy zlyhali, ako dlho každý trval) — oveľa užitočnejšie na debugovanie než
scrollovanie surovým log výstupom, a toto je presne ten druh výstupu pokrytý ako
[artefakt](./artifacts.md) na ďalšej stránke.

## Blokovanie mergov na základe výsledkov testov

```text
Pravidlo ochrany vetvy: check "test" musí prejsť pred mergom
```

Skutočný vynucovací mechanizmus, ktorý robí CI dôležité v praxi — prechádzajúca testovacia sada,
na ktorú nikto nemusí čakať pred mergom, sa dá ľahko potichu ignorovať pod tlakom deadline.
Väčšina platforiem umožňuje, aby pass/fail status konkrétneho jobu podmieňoval, či je PR vôbec
mergovateľný.
