---
sidebar_position: 1
title: Conventional Commits
---

# Conventional Commits

[Conventional Commits](https://www.conventionalcommits.org/) je štandardný formát pre commit
správy: `<typ>(<scope>): <popis>`. Tento repozitár ho používa — pozri históriu commitov pre reálne
príklady, alebo [`/sk/internal-operations/git-workflow`](/sk/internal-operations/git-workflow) pre
politiku.

## Formát

```
<typ>(<scope>): <krátke zhrnutie>

<voliteľné dlhšie telo>

<voliteľná pätička>
```

- **typ** — aký druh zmeny (pozri tabuľku nižšie)
- **scope** — voliteľné, oblasť, ktorej sa to týka (priečinok, modul alebo názov feature)
- **zhrnutie** — rozkazovací spôsob, malé začiatočné písmeno, bez bodky na konci: "add", nie
  "added" alebo "Adds"

## Bežné typy

| Typ | Použi pre |
|---|---|
| `feat` | Novú funkciu |
| `fix` | Opravu chyby |
| `docs` | Len dokumentáciu |
| `refactor` | Zmenu kódu, ktorá nie je ani fix ani feature (bez zmeny správania) |
| `test` | Pridanie alebo opravu testov |
| `chore` | Build proces, tooling, bumpy závislostí — nič viditeľné pre používateľa |
| `style` | Len formátovanie (medzery, bodkočiarky) — bez zmeny logiky |

## Reálne príklady z tohto repozitára

```
feat(mbm-group): add initial access topology and credentials guide
fix(study): correct Neo4j Cypher query syntax in graph notes
docs(internal): update server backup recovery runbook
fix(docs): correct broken link in intro
```

## Prečo sa s tým zaoberať

- **Automatizácia changelogu** — nástroje ako `standard-version` alebo `semantic-release` čítajú
  typy commitov na automatické generovanie changelogu a výber ďalšieho čísla verzie.
- **Automatizácia semveru** — podľa konvencie: `fix` → patch bump, `feat` → minor bump, pätička
  `BREAKING CHANGE:` → major bump.
- **Prehľadná história** — `git log --oneline` sa stane čitateľným zhrnutím *aký druh* práce sa
  udial, nie len opakované "fix", "update", "wip".

## Breaking changes

Pridaj pätičku (nie súčasť riadku zhrnutia):

```
feat(api): change login endpoint response shape

BREAKING CHANGE: `token` field renamed to `accessToken` in the login response.
```

## Bežná chyba

Nepíš typ/scope a potom ho zopakuj v texte:

```
❌ fix: fix bug where login fails
✅ fix(auth): reject empty password on login instead of 500ing
```

Typ už hovorí "toto je fix" — zhrnutie použi na vysvetlenie *čo* sa presne zmenilo.

## Skontroluj sa

- Čo spúšťa pätička `BREAKING CHANGE:` pri semver automatizácii?

  <details>
  <summary>Odpoveď</summary>

  Major version bump (na rozdiel od `fix` → patch, `feat` → minor).
  </details>

- Čo je zle na správe ako `fix: fix bug where login fails`?

  <details>
  <summary>Odpoveď</summary>

  Opakuje typ ("fix") v texte zhrnutia namiesto toho, aby ten priestor využila na vysvetlenie, čo
  konkrétne sa zmenilo.
  </details>

- Aké dve veci umožňuje typ Conventional Commits automatizovať?

  <details>
  <summary>Odpoveď</summary>

  Generovanie changelogu a semver version bumpy, oboje riadené čítaním typu commitu.
  </details>
