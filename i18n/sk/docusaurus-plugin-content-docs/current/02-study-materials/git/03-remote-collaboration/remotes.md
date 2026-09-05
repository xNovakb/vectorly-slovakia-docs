---
sidebar_position: 1
title: Remote Repozitáre
---

# Remote Repozitáre

Remote je len pomenovaná URL ukazujúca na inú kópiu repozitára — zvyčajne hostovanú na
GitHub/GitLab.

```bash
git remote -v                                        # vypíš remoty
git remote add origin git@github.com:example/project.git
```

`origin` je konvenčný názov pre "hlavný remote, z ktorého si klonoval" — žiadne pravidlo Gitu
tento názov nevynucuje, je to len to, čo `git clone` automaticky nastaví.

## Fetch vs. pull

```bash
git fetch origin       # stiahni nové commity/vetvy z origin, nedotýkaj sa working súborov
git pull origin main     # fetch + merge (alebo rebase) do aktuálnej vetvy, v jednom kroku
```

`fetch` je vždy bezpečný — len aktualizuje tvoj lokálny záznam o tom, čo má remote, nikdy nemení
working directory. `pull` = `fetch` + integrácia, takže **môže** vytvoriť merge commit alebo
konflikt. Ak si nie si istý, najprv spusti `fetch` a pozri sa, čo sa zmenilo
(`git log origin/main`), než sa rozhodneš, ako to integrovať.

```bash
git pull --rebase origin main    # fetch + rebase namiesto merge — udrží lineárnu históriu
```

## Pushovanie

```bash
git push origin feature/login             # pushni vetvu na origin
git push -u origin feature/login           # + nastav tracking, aby budúci `git push` samostatne vedel kam
```

Po jednom `-u` obyčajný `git push` / `git pull` na tejto vetve vie, s ktorou remote vetvou má
komunikovať.

## Tracking vetvy

Lokálna vetva môže byť prepojená s remote vetvou, ktorú "trackuje" — `git status` potom povie, či
si vpredu/vzadu:

```bash
git branch -vv                # ukáže tracking info pre každú vetvu
# feature/login  a1b2c3d [origin/feature/login: ahead 2] Add validation
```

## `origin` vs. `upstream`

Objavuje sa pri **fork workflow** (pozri [Pull / Merge Requesty](./pull-requests.md)): keď
forkuješ cudzí repozitár, `origin` konvenčne ukazuje na *tvoj* fork, a pridáš druhý remote s
názvom `upstream`, ktorý ukazuje na originálny repozitár, aby si mohol ťahať jeho najnovšie
zmeny:

```bash
git remote add upstream git@github.com:original-owner/project.git
git fetch upstream
git merge upstream/main       # prenes zmeny z upstream do lokálnej main
```

## Premenovanie alebo odstránenie remotu

```bash
git remote rename origin old-origin
git remote remove old-origin
```
