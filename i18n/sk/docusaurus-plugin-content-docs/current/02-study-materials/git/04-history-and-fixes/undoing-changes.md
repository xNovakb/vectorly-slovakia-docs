---
sidebar_position: 1
title: Vracanie Zmien
---

# Vracanie Zmien

Štyri príkazy, ktoré vyzerajú podobne, ale pôsobia na rôznych úrovniach — ich zámena je
najčastejší spôsob, ako ľudia náhodou stratia prácu. Predstav si tri stavy zo
[Základného Workflow](../01-basics/core-workflow.md): working directory → staging area →
história commitov.

## `git restore` — vráť zmeny vo working directory / staging area

Vôbec sa nedotýka histórie. Bezpečné pre "ešte som necommitol."

```bash
git restore file.txt              # zahoď necommitnuté zmeny vo working directory (späť na posledný commit)
git restore --staged file.txt      # unstagni súbor (zachová úpravy, len ich odstráni zo stagingu)
```

## `git checkout <commit> -- file` — vytiahni starú verziu jedného súboru

```bash
git checkout a1b2c3d -- file.txt   # vráť file.txt do stavu z daného commitu, stagne to
```

Nehýbe vetvou ani HEAD — len prinesie obsah jedného súboru späť z histórie.

## `git reset` — presuň ukazovateľ vetvy

Prepíše, na čo ukazuje tvoja **aktuálna vetva**. Tri režimy, s narastajúcou deštruktívnosťou:

```bash
git reset --soft HEAD~1     # vráť posledný commit, zmeny nechaj stagnuté
git reset --mixed HEAD~1    # vráť posledný commit, zmeny nechaj vo working dir, unstagnuté (predvolený režim)
git reset --hard HEAD~1     # vráť posledný commit, zmeny ÚPLNE ZAHOĎ
```

`--hard` zahodí necommitnutú prácu bez potvrdenia — vždy najprv `git status`/`git diff`, aby si
sa uistil, že tam necommitnuté nesedí nič, na čom ti záleží.

**Nikdy nerobí `reset` na commit, ktorý už bol pushnutý a niekto iný ho pullol** — prepíše
históriu spod neho, rovnaké nebezpečenstvo ako rebase zdieľaných commitov (pozri
[Rebasing](../02-branching-merging/rebasing.md)).

## `git revert` — vráť zmeny pridaním nového commitu

```bash
git revert a1b2c3d
```

Vytvorí **nový** commit, ktorý aplikuje opak daného commitu. História sa neprepisuje — rastie
dopredu s "undo" commitom. Toto je bezpečná voľba na vrátenie niečoho už pushnutého/zdieľaného,
lebo nemení žiadny existujúci commit hash.

## Ktorý si vybrať?

| Situácia | Príkaz |
|---|---|
| Zahodiť necommitnuté úpravy | `git restore file.txt` |
| Vrátiť `git add` | `git restore --staged file.txt` |
| Vrátiť posledný lokálny commit, ešte nepushnutý | `git reset --soft HEAD~1` |
| Vrátiť commit už pushnutý/zdieľaný | `git revert <commit>` |
| Získať jeden súbor späť zo starého commitu | `git checkout <commit> -- file.txt` |

Ak si `--hard` použil omylom a niečo si stratil, [Reflog a Obnova](./reflog-recovery.md) je
väčšinou cesta späť.
