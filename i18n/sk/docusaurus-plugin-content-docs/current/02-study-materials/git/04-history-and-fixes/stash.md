---
sidebar_position: 2
title: Stash
---

# Stash

`git stash` odloží necommitnuté zmeny (stagnuté aj nestagnuté), takže working directory sa vráti
k poslednému commitu — bez skutočného commitovania čohokoľvek. Užitočné, keď potrebuješ prepnúť
vetvu, ale ešte nie si pripravený commitnúť to, na čom pracuješ.

## Základné použitie

```bash
git stash              # odlož aktuálne zmeny
# working directory je teraz čistý...
git switch main
# ... urob niečo iné ...
git switch feature/login
git stash pop           # vráť zmeny späť a odstráň ich zo zoznamu stashov
```

`git stash pop` aplikuje najnovší stash a zmaže ho zo zoznamu. Použi `git stash apply` namiesto
toho, ak chceš zmeny aplikovať, ale **zachovať** ich v zozname (napr. na aplikovanie rovnakého
stashu na viac vetiev).

## Pomenovanie a výpis stashov

Stashe sa vrstvia — môžeš ich mať naraz viac, tak ich pomenuj, ak ich bude viac naraz:

```bash
git stash push -m "WIP: login form validation"
git stash list
# stash@{0}: On feature/login: WIP: login form validation
# stash@{1}: On main: WIP: quick debug logging
git stash pop stash@{1}      # popni konkrétny, nie len najnovší
```

## Stashovanie len časti zmien

```bash
git stash push -p     # interaktívne vyber, ktoré hunky stashovať, podobne ako `git add -p`
```

## Zahodenie stashu bez aplikovania

```bash
git stash drop stash@{0}
git stash clear         # odstráň všetky stashe
```

## Stash vs. WIP commit

Oboje ti umožnia "ulož a vráť sa neskôr" — rozdiel je v rozsahu a viditeľnosti:

| | Stash | WIP commit |
|---|---|---|
| Zobrazí sa v `git log` | Nie | Áno (kým ho nevyčistíš) |
| Prežije `git clone` / pushne sa | Nie — stashe sú len lokálne | Áno, po pushnutí |
| Vhodné pre | Rýchlu odbočku pri prepnutí vetvy | Prácu, ktorú chceš zálohovať vzdialene, alebo plánuješ neskôr `rebase -i --fixup` do skutočného commitu |

Pravidlo: stashuj na päťminútové vyrušenie, commituj (aj neporiadne, na neskoršie squashnutie —
pozri [Squash a Rebase](../05-conventions/squash-and-rebase.md)) pre čokoľvek, čo by ťa mrzelo
stratiť, keby ti spadol notebook.
