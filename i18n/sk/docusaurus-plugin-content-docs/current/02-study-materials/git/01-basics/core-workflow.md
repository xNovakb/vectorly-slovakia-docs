---
sidebar_position: 3
title: Základný Workflow
---

# Základný Workflow

Toto je slučka, ktorú spustíš desiatky krát denne: uprav súbory, stagni to, čo chceš uložiť,
commitni to, opakuj.

## Založenie repozitára

```bash
git init                                    # začni trackovať nový projekt
# alebo
git clone git@github.com:example/project.git   # získaj existujúci
```

## Staging area

Staging area (aka "index") je medzikrok medzi working directory a commitom. Umožňuje ti postaviť
commit len z **časti** zmien, nie nutne zo všetkého, čoho si sa dotkol.

```bash
git status              # čo sa zmenilo, čo je stagnuté
git add file.txt         # stagni jeden súbor
git add src/             # stagni celý priečinok
git add -A                # stagni všetko (nové, upravené, zmazané)
git add -p                 # stagni interaktívne, hunk po hunku — skvelé na rozdelenie jednej veľkej úpravy na dva čisté commity
```

## Commitovanie

```bash
git commit -m "Add login form validation"
```

Toto vezme, čo je **stagnuté** (nie celý working directory) a uloží to ako nový snapshot do
histórie. Čokoľvek si upravil, ale necommitol cez `git add`, zostane mimo commitu.

## Prezeranie histórie

```bash
git log                       # celá história
git log --oneline             # jeden riadok na commit, kompaktné
git log --oneline --graph     # + ASCII graf vetiev
git diff                      # nestagnuté zmeny voči poslednému commitu
git diff --staged             # stagnuté zmeny voči poslednému commitu
git show <commit-hash>        # plný diff jedného commitu
```

## Typická sekvencia

```bash
# uprav nejaké súbory...
git status                          # pozri, čo sa zmenilo
git add src/login.ts                # stagni len tento súbor
git diff --staged                   # over si, čo chystáš commitnúť
git commit -m "fix: validate empty password on login"
git log --oneline -5                # potvrď, že to pristálo
```

## Working tree vs. index vs. HEAD

Tri ukazovatele, oplatí sa ich mať jasné, pretože neskoršie témy (`reset`, `restore`, `checkout` —
pozri [Vracanie Zmien](../04-history-and-fixes/undoing-changes.md)) sú v podstate len rôzne
spôsoby presúvania dát medzi nimi:

- **Working directory** — súbory tak, ako práve teraz sedia na disku.
- **Index / staging area** — čo `git add` naplánoval pre ďalší commit.
- **HEAD** — ukazovateľ na posledný commit na aktuálnej vetve.

`git status` je v podstate diff report medzi všetkými troma.

## Skontroluj sa

- Aký je rozdiel medzi `git add -A` a `git add -p`?

  <details>
  <summary>Odpoveď</summary>

  `git add -A` stagne všetko (nové, upravené, zmazané) naraz; `git add -p` ti umožní stagovať
  interaktívne, hunk po hunku — užitočné na rozdelenie jednej edit session na viac čistých
  commitov.
  </details>

- Uloží `git commit` celý tvoj working directory, alebo niečo užšie?

  <details>
  <summary>Odpoveď</summary>

  Niečo užšie — uloží, čo je práve stagnuté. Čokoľvek si upravil, ale necommitol cez `git add`,
  zostane mimo commitu.
  </details>

- Aké tri ukazovatele `git status` v podstate porovnáva?

  <details>
  <summary>Odpoveď</summary>

  Working directory, index (staging area), a HEAD (posledný commit na aktuálnej vetve).
  </details>
