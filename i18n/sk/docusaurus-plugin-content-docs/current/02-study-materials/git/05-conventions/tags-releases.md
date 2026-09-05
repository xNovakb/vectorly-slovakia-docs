---
sidebar_position: 4
title: Tagy a Releasy
---

# Tagy a Releasy

Tag je pevný, pomenovaný ukazovateľ na konkrétny commit — na rozdiel od vetvy sa nehýbe, keď
pribúdajú nové commity. Používa sa na označenie release bodov.

## Sémantické verzovanie

`MAJOR.MINOR.PATCH`, napr. `v2.4.1`:

- **MAJOR** — breaking change (pozri konvenciu pätičky `BREAKING CHANGE:` v
  [Conventional Commits](./conventional-commits.md))
- **MINOR** — nová spätne kompatibilná funkcia (`feat`)
- **PATCH** — spätne kompatibilná oprava chyby (`fix`)

## Lightweight vs. annotated tagy

```bash
git tag v2.4.1                              # lightweight — len meno ukazujúce na commit
git tag -a v2.4.1 -m "Release 2.4.1"          # annotated — plný objekt: tagger, dátum, správa, dá sa GPG podpísať
```

**Na releasy používaj annotated tagy.** Lightweight tagy sú fajn na rýchle jednorazové značky,
ale annotated tagy nesú metadáta (kto tagol, kedy, prečo) a sú to, čo očakávajú nástroje ako
`git describe` a GitHub Releases.

## Pushovanie tagov

Tagy sa nepushujú automaticky s `git push` — potrebujú vlastný push:

```bash
git push origin v2.4.1          # pushni jeden tag
git push origin --tags           # pushni všetky lokálne tagy, ktoré ešte nie sú na remote
```

## Výpis a inšpekcia

```bash
git tag                          # vypíš všetky tagy
git tag -l "v2.4.*"                # filtruj podľa vzoru
git show v2.4.1                   # zobraz otagovaný commit + správu tagu
```

## Prepojenie tagov s release workflow

Typická release sekvencia:

```bash
git checkout main
git pull origin main
git tag -a v2.4.1 -m "Release 2.4.1"
git push origin v2.4.1
```

Odtiaľ CI (napr. GitHub Actions workflow spustený `on: push: tags:`) môže tag zachytiť na build a
publikovanie release, a GitHub "Releases" UI k nemu vie priložiť release notes — často
automaticky vygenerované z Conventional Commit správ medzi týmto tagom a predchádzajúcim.

## Zmazanie tagu

```bash
git tag -d v2.4.1                    # zmaž lokálne
git push origin :refs/tags/v2.4.1     # zmaž z remote
```

Zriedkavé — rob to len pri skutočnej chybe (otagovaný zlý commit), nikdy na "predělanie" release,
ktorý si niekto mohol už stiahnuť.
