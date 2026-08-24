---
sidebar_position: 10
title: Git & CI/CD Workflow
---

# Git & CI/CD Workflow

Profesionálny Git workflow pre tento repozitár (solo-dev / B2B konzultačné nastavenie). Vychádza z modelu vetiev `main` + `develop`, manuálneho CI/CD spúšťača, squash rebasingu a Conventional Commits.

## Stratégia vetvenia

**`main`** — produkcia. Beží na `docs.vectorly-slovakia.sk`. Každý push spustí GitHub Actions: zostaví kontajner, nasadí naživo. Udržiavaná 100% stabilná.

**`develop`** — staging/integrácia. Nové kapitoly, štrukturálne úpravy, zmeny TypeScript konfigurácie. Push sem **automaticky nenasadzuje** — sandbox.

**`feature/*`, `fix/*`** — krátkodobé vetvy z `develop` pre konkrétnu zmenu (napr. `feature/mbm-group-docs`, `fix/broken-link`).

## Výnimka priamo do `main`: zmeny len v dokumentácii

Čisté úpravy dokumentácie (`docs/`, `blog/`, opravy preklepov, obsahové zmeny — žiadne zmeny konfigurácie/buildu/závislostí) môžu ísť priamo do `main` bez prechodu cez `develop`. Nízke riziko, rýchla iterácia pri obsahovej práci.

Čokoľvek, čo sa dotýka kódu, konfigurácie, závislostí alebo build nástrojov (`docusaurus.config.ts`, `package.json`, `src/`, `.github/workflows/`, `Dockerfile` atď.), musí ísť cez `develop` → feature branch → PR → squash merge. Nikdy priamo do `main`.

Vynucovať cez GitHub branch protection na `main`: vyžadovať PR + review pre všetkých, prípadne povoliť automatizovanú výnimku pre dokumentáciu cez CODEOWNERS/path pravidlo — inak je toto pravidlo, ktoré si vynucuješ sám.

## CI/CD spúšťač

`.github/workflows/deploy.yml` sa spúšťa pri:

```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch: # manuálne spustenie zo záložky Actions
```

`push` do `main` → automatické nasadenie. `workflow_dispatch` → manuálne opätovné nasadenie bez nového commitu (napr. znovu spustiť po výpadku servera).

## Commit správy: Conventional Commits

```
feat(mbm-group): add initial access topology and credentials guide
fix(study): correct Neo4j Cypher query syntax in graph notes
docs(internal): update server backup recovery runbook
```

## Zlučovanie: squash & rebase

Udržiavať históriu `main`/`develop` lineárnu, jeden zmysluplný commit na jednu funkciu. Žiadne commity typu `typo` / `fix bug` / `test again` v trvalej histórii.

### Postup krok za krokom

```bash
# 1. Vetva z develop
git checkout develop
git pull origin develop
git checkout -b feature/neo4j-notes

# 2. Commit s Conventional Commits
git add .
git commit -m "feat(study): add advanced graph indexing notes"

# 3. Rebase + squash lokálnych commitov pred pushom
git fetch origin develop
git rebase -i origin/develop
# označiť extra commity ako 'squash', uložiť, ukončiť

# 4. Push
git push origin feature/neo4j-notes --force-with-lease

# 5. Otvoriť PR do develop, "Squash and merge"
# 6. Keď je pripravené na nasadenie: PR develop -> main, "Squash and merge"
#    -> automaticky spustí deploy.yml
```

Rýchla cesta len pre dokumentáciu (pozri výnimku vyššie) preskočí krok 1 a `develop` medzikrok v krokoch 5-6:

```bash
git checkout main
git pull origin main
git checkout -b fix/broken-link
# úprava dokumentácie
git add .
git commit -m "fix(docs): correct broken link in intro"
git push origin fix/broken-link
# otvoriť PR priamo do main, squash merge -> automaticky nasadí
```
