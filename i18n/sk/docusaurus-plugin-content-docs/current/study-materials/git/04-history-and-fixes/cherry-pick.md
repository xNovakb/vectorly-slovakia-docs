---
sidebar_position: 3
title: Cherry-Pick
---

# Cherry-Pick

`git cherry-pick` skopíruje **jeden konkrétny commit** odkiaľkoľvek z histórie na aktuálnu vetvu —
bez toho, aby priniesol aj všetko ostatné, čo tá vetva má.

```bash
git switch main
git cherry-pick a1b2c3d
```

Toto vytvorí nový commit na `main` s rovnakými zmenami (a správou) ako `a1b2c3d`, ale s novým
commit hashom (má teraz iného rodiča).

## Bežný use case: backport hotfixu

Povedzme, že kritický bugfix pristál na `develop`, ale existuje aj vetva `release/2.3`, ktorá ho
tiež potrebuje, a nechceš do release vetvy zlúčiť celý `develop` s ostatnou rozpracovanou prácou.

```bash
git log develop --oneline -5
# f9e8d7c fix: null pointer on empty cart (ten, ktorý potrebujeme)
# ... ostatné nesúvisiace commity ...

git switch release/2.3
git cherry-pick f9e8d7c
git push origin release/2.3
```

Presunie sa len ten jeden fix — release vetva zostáva izolovaná od zvyšku `develop`.

## Viacero commitov

```bash
git cherry-pick a1b2c3d f4e5d6c        # dva konkrétne commity
git cherry-pick a1b2c3d^..f4e5d6c       # rozsah (vrátane a1b2c3d)
```

## Konflikty

Rovnaké značky ako pri merge/rebase (pozri [Mergovanie](../02-branching-merging/merging.md)) —
commit, ktorý presúvaš, sa môže dotýkať kódu, ktorý sa na cieľovej vetve už rozišiel.

```bash
# uprav konfliktné značky v súbore, potom:
git add file.txt
git cherry-pick --continue
# alebo to zruš:
git cherry-pick --abort
```

## Na čo si dať pozor

- Cherry-pick vytvorí **duplicitný** commit (nový hash, rovnaký obsah). Ak sa tento commit neskôr
  zlúči aj normálne (napr. `develop` sa nakoniec zlúči do `release/2.3`), Git zvyčajne duplicitu
  zvládne v poriadku — ale občas to môže spôsobiť konflikt na už aplikovanej zmene. Nie je to
  problém so správnosťou, len niečo, s čím treba počítať.
- Nepoužívaj cherry-pick ako náhradu za merge/rebase celej vetvy — je to skalpel na jeden commit,
  nie všeobecný integračný nástroj.
