---
sidebar_position: 1
title: Vetvy
---

# Vetvy

Vetva je len **presúvateľný ukazovateľ na commit**. `main` nie je pre Git interne nič špeciálne —
je to ukazovateľ ako každý iný, len je konvenčne predvolený.

## Vytváranie a prepínanie

```bash
git branch feature/login          # vytvor vetvu (neprepne na ňu)
git switch feature/login           # prepni sa na ňu
# alebo v jednom kroku:
git switch -c feature/login        # vytvor + prepni
```

`git checkout` robí rovnakú prácu ako `git switch` (a viac) — `switch`/`restore` boli z `checkout`
vyčlenené v novšom Gite práve preto, aby bol zámer každého príkazu jasnejší. Uvidíš oba v praxi;
`switch` na zmenu vetiev je modernejšia, menej dvojznačná voľba.

```bash
git branch                # vypíš lokálne vetvy, * označuje aktuálnu
git branch -a              # + remote-tracking vetvy
git branch -d feature/login   # zmaž vetvu (len ak je zlúčená)
git branch -D feature/login   # vynúť zmazanie (aj keď nie je zlúčená)
```

## Čo je HEAD v skutočnosti

`HEAD` je ukazovateľ na "aktuálne vyčekovaný commit" — bežne to znamená, že ukazuje *na vetvu*,
ktorá zase ukazuje na commit:

```
HEAD -> main -> commit a1b2c3d
```

Keď spravíš `git switch other-branch`, HEAD sa presunie a ukazuje na `other-branch` namiesto
predchádzajúcej. Keď spravíš `git commit`, *vetva*, na ktorú HEAD ukazuje, sa posunie dopredu na
nový commit — HEAD samotný sa nehýbe, len sleduje svoju vetvu.

## Detached HEAD

Ak vyčekuješ konkrétny commit (nie vetvu), HEAD ukazuje priamo na tento commit namiesto na vetvu:

```bash
git checkout a1b2c3d
# You are in 'detached HEAD' state...
```

Môžeš sa tam poobzerať a dokonca aj commitovať, ale nič na tieto commity neukazuje, akonáhle sa
prepneš preč — stanú sa nedosiahnuteľnými a nakoniec ich zmaže garbage collector. V poriadku na
"len sa pozrieť na starý kód", riskantné, ak si chcel novú prácu ponechať. Ak počas detached stavu
commitneš niečo, čo chceš zachovať:

```bash
git switch -c rescue-branch      # premení tvoje detached commity na skutočnú vetvu
```

## Konvencie pomenovania

Bežný vzor, Git ho nevynucuje:

```
feature/short-description
fix/short-description
chore/short-description
```

Drž mená krátke a s pomlčkami — objavujú sa v URL, názvoch CI jobov a vo výstupe
`git log --graph`, kde dlhé mená pôsobia natlačene.

## Skontroluj sa

- Je `main` pre Git interne niečo špeciálne?

  <details>
  <summary>Odpoveď</summary>

  Nie — je to presúvateľný ukazovateľ na commit ako každý iný; je len konvenčne predvolený.
  </details>

- Čo sa stane s HEAD, keď spravíš `git commit`?

  <details>
  <summary>Odpoveď</summary>

  HEAD samotný sa nehýbe — *vetva*, na ktorú HEAD ukazuje, sa posunie dopredu na nový commit;
  HEAD len sleduje.
  </details>

- Čo je riskantné na commitovaní v detached HEAD stave?

  <details>
  <summary>Odpoveď</summary>

  Tieto commity sa stanú nedosiahnuteľnými a nakoniec ich zmaže garbage collector, akonáhle sa
  prepneš preč, pokiaľ ich najprv nepremeníš na skutočnú vetvu pomocou `git switch -c <meno>`.
  </details>

- Aký je rozdiel medzi `git branch -d` a `git branch -D`?

  <details>
  <summary>Odpoveď</summary>

  `-d` zmaže vetvu len ak je už zlúčená; `-D` ju vynúti zmazať aj keď nie je zlúčená.
  </details>
