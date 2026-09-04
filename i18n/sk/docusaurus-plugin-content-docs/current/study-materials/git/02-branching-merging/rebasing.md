---
sidebar_position: 3
title: Rebasing
---

# Rebasing

Rebase vezme commity na tvojej vetve a znovu ich prehrá nad iným počiatočným bodom — zvyčajne
nad najnovším `main`.

```bash
git switch feature/login
git rebase main
```

## Ako to vyzerá vizuálne

Predtým:

```mermaid
gitGraph
   commit id: "A"
   branch feature/login
   checkout main
   commit id: "D"
   checkout feature/login
   commit id: "B"
   commit id: "C"
```

Po `git rebase main`:

```mermaid
gitGraph
   commit id: "A"
   commit id: "D"
   branch feature/login
   commit id: "B'"
   commit id: "C'"
```

`B` a `C` sa stanú `B'` a `C'` — rovnaký *obsah*, nové commit hashe, pretože sa zmenil ich rodič.
Tvoja vetva teraz vyzerá, akoby bola napísaná od `D`, aj keď to tak nebolo. História pôsobí ako
jedna rovná línia namiesto tvaru rozdeľovania/spájania, ktorý produkuje merge.

## Rebase vs. merge

|  | Merge | Rebase |
|---|---|---|
| Tvar histórie | Zachová, čo sa naozaj stalo, vrátane merge commitu | Prepíše, aby vyzerala lineárne |
| Commit hashe | Nezmenené | Prepísané (nové hashe) pri každom prehratom commite |
| Bezpečné na zdieľanej vetve? | Áno, vždy | **Nie** — prepísanie commitov, ktoré si ostatní už pullli, spôsobí rozdielnu históriu pre nich |
| Vhodné pre | Zlúčenie hotovej feature do `main` | Vyčistenie / update vlastnej rozpracovanej vetvy pred jej zdieľaním |

**Pravidlo: nikdy nerebasuj vetvu, na ktorej pracujú aj iní ľudia.** Rebase prepisuje commit
hashe; ak si niekto stiahol tie staré, jeho história a tvoja si už nesedia. Rebasuj voľne len na
súkromnej feature vetve, ktorej sa dotýkaš iba ty.

## Interaktívny rebase

`rebase -i` ti umožní upraviť, preusporiadať, zlúčiť alebo zahodiť commity pred ich prehratím:

```bash
git rebase -i HEAD~3      # interaktívne prepíš posledné 3 commity
```

Otvorí sa editor so zoznamom ako:

```text
pick a1b2c3d Add login form
pick e4f5g6h Fix typo
pick h7i8j9k Add validation
```

Zmeň `pick` na:
- `reword` — ponechaj commit, uprav jeho správu
- `squash` (alebo `s`) — zlúč do **predchádzajúceho** commitu, ponechaj obe správy na úpravu
- `fixup` (alebo `f`) — zlúč do predchádzajúceho commitu, túto správu **zahoď**
- `drop` — commit úplne odstráň

Príklad — squashnutie "fix typo" commitu do predchádzajúceho:

```text
pick a1b2c3d Add login form
fixup e4f5g6h Fix typo
pick h7i8j9k Add validation
```

Výsledok: dva čisté commity namiesto troch neporiadnych. Toto je mechanizmus za
[Squash a Rebase](../05-conventions/squash-and-rebase.md) — čistenie lokálne pred zlúčením PR.

## Ak rebase konfliktuje

Rovnaké konfliktné značky ako pri merge (pozri [Mergovanie](./merging.md)). Uprav súbor, potom:

```bash
git add file.txt
git rebase --continue      # nie `git commit` — rebase si to obslúži sám
```

Alebo to celkom zruš:

```bash
git rebase --abort
```
