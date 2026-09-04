---
sidebar_position: 2
title: Mergovanie
---

# Mergovanie

Mergovanie prenesie zmeny z jednej vetvy do druhej.

```bash
git switch main
git merge feature/login
```

Toto zlúči `feature/login` **do** vetvy, ktorú máš práve vyčekovanú (tu `main`).

## Fast-forward merge

Ak sa `main` nepohla odkedy sa `feature/login` odvetvila, Git nepotrebuje vytvárať merge commit
vôbec — jednoducho posunie ukazovateľ `main` dopredu na posledný commit `feature/login`:

```mermaid
gitGraph
   commit id: "A"
   branch feature/login
   checkout feature/login
   commit id: "B"
   commit id: "C"
   checkout main
   merge feature/login
```

Toto je **fast-forward** — `main` sa jednoducho posunie na `C`, žiadny samostatný merge commit.
História zostáva lineárna, nie je čo mergovať.

## Three-way merge

Ak sa `main` **pohla** (niekto iný pushol commity), zatiaľ čo sa pracovalo na `feature/login`, Git
vytvorí **merge commit** — commit s dvoma rodičmi, ktorý spojí obe histórie:

```mermaid
gitGraph
   commit id: "A"
   branch feature/login
   checkout main
   commit id: "D"
   checkout feature/login
   commit id: "B"
   commit id: "C"
   checkout main
   merge feature/login id: "M"
```

`M` je nový merge commit — má dvoch rodičov, `D` a `C`. Git porovná oba konce vetiev voči ich spoločnému predkovi (`A`) — "trojcestné" porovnanie — a
automaticky zlúči všetko, čo sa zmenilo len na jednej strane.

## Merge konflikty

Konflikt nastane, keď **obe** vetvy zmenili **rovnaké riadky** rovnakého súboru odlišne. Git
nevie uhádnuť, ktorú verziu chceš, tak sa zastaví a súbor označí:

```text title="file.txt po konfliktnom merge"
<<<<<<< HEAD
const timeout = 30;
=======
const timeout = 60;
>>>>>>> feature/login
```

- Všetko medzi `<<<<<<< HEAD` a `=======` je verzia **tvojej aktuálnej vetvy**.
- Všetko medzi `=======` a `>>>>>>> feature/login` je verzia **prichádzajúcej vetvy**.

Riešenie: uprav súbor ručne na to, čo *má* obsahovať, zmaž značky `<<<<<<<`/`=======`/`>>>>>>>`,
potom:

```bash
git add file.txt          # označ tento súbor ako vyriešený
git commit                 # dokončí merge (správa je predvyplnená)
```

Ak je to neporiadok a chceš začať odznova, celkom to zruš:

```bash
git merge --abort
```

## Merge vs. rebase

Merge zachová presne to, čo sa stalo (vrátane merge commitu); rebase prepíše históriu tak, aby
vyzerala lineárne. Pozri [Rebasing](./rebasing.md) pre kompromis, a
[Squash a Rebase](../05-conventions/squash-and-rebase.md) pre to, ktorý z nich tu skutočne
používame.
