---
sidebar_position: 2
title: Caching v CI
---

# Caching v CI

Každý čerstvý job pipeline typicky štartuje z čistého prostredia (pozri
[Fázy a Joby](./stages-and-jobs.md)) — skvelé pre reprodukovateľnosť, ale znamená to opätovné
sťahovanie a inštalovanie rovnakých závislostí pri každom jednom behu, pokiaľ ich niečo explicitne
necachuje.

## Čo sa oplatí cachovať

```text
- Závislosti package manageru (node_modules, ~/.m2 pre Maven, ~/.cargo pre Rust)
- Build výstupy, ktoré sú drahé na regenerovanie, ale nemenia sa často
- Stiahnuté základné image alebo toolchainy
```

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-${{ hashFiles('package-lock.json') }}
    restore-keys: |
      npm-
```

## Cache keys — mechanizmus, ktorý toto robí bezpečným

Cache je užitočná len ak sa invaliduje presne vtedy, keď by mala — potichu znovupoužiť zastaranú
cache je horšie než necachovať vôbec, keďže to môže maskovať skutočnú zmenu závislosti. `key` je
to, čo toto riadi:

```yaml
key: npm-${{ hashFiles('package-lock.json') }}
```

Hashovanie lockfile znamená, že cache key sa **automaticky zmení** v momente, keď sa závislosti
naozaj zmenia — nový key znamená cache miss, čo vynúti čerstvú inštaláciu, presne keď by mala.
Toto je koncepčne rovnaká myšlienka ako [layer caching Dockeru](/sk/study-materials/docker/images-and-dockerfiles/image-layers-and-caching)
— cache kľúčovaná svojimi skutočnými vstupmi, takže sa znovupoužije len keď sú tieto vstupy naozaj
nezmenené.

## `restore-keys` — záloha pre čiastočné cache hity

```yaml
key: npm-${{ hashFiles('package-lock.json') }}
restore-keys: |
  npm-
```

Ak žiadna cache presne nesedí s aktuálnym key (lockfile sa zmenil), `restore-keys` umožní pipeline
padnúť späť na najnovšiu cache so zodpovedajúcim **prefixom** — stále užitočné ako východiskový
bod (väčšina závislostí sa asi nezmenila, aj keď lockfile áno), namiesto štartu z úplne prázdnej
cache.

## Cache scoping — per-branch vs. zdieľané

Väčšina platforiem do určitej miery scopuje cache podľa vetvy, aby sa predišlo tomu, že zmeny
jednej vetvy znečistia cache inej spôsobom, ktorý produkuje nesprávne výsledky:

```text
- Cache vytvorená na feature vetve je často použiteľná PR-mi smerujúcimi do základu tejto vetvy,
  ale nie automaticky zdieľaná globálne naprieč každou nesúvisiacou vetvou
- Cache predvolenej vetvy sa bežne používa ako záložný základ pre nové vetvy, keďže je zvyčajne
  najreprezentatívnejší "aktuálny" stav závislostí
```

Presné pravidlá scopingu sa naozaj líšia podľa platformy — oplatí sa to konkrétne skontrolovať,
keďže predpoklad zlého scoping správania môže buď premárniť potenciál cache (príliš úzke), alebo
spôsobiť jemnú cross-branch kontamináciu (príliš široké).

## Cachovanie build výstupov, nie len závislostí

```yaml
- uses: actions/cache@v4
  with:
    path: .next/cache          # príklad: vlastná incrementálna build cache frameworku
    key: nextjs-${{ hashFiles('**/*.js', '**/*.ts') }}
```

Niektoré build nástroje udržiavajú vlastnú incrementálnu build cache (rebuilduje len to, čo sa
naozaj zmenilo) — perzistencia tohto cache priečinka medzi CI behmi, nie len inštalácií
závislostí, môže výrazne skrátiť čas buildu pre veľké codebase, navyše k samotnému cachovaniu
závislostí.

## Keď caching zlyhá

:::warning
Príliš široký cache key (alebo taký, čo sa nikdy nemení) môže servírovať naozaj zastarané, zlé
artefakty — build, ktorý "má" odrážať aktualizáciu závislosti, ale neodráža, lebo cache key sa
naozaj nezmenil, keď mal. Pri debugovaní CI výsledku, ktorý akoby ignoruje skutočnú zmenu, je
nesprávne scopovaná cache bežný, ľahko prehliadnuteľný podozrivý.
:::
