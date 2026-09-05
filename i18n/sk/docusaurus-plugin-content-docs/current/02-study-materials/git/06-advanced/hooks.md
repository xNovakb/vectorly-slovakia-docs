---
sidebar_position: 2
title: Git Hooks
---

# Git Hooks

Hooks sú skripty, ktoré Git automaticky spúšťa v bodoch commit/push lifecycle — `.git/hooks/` v
každom repozitári, každý je jednoducho spustiteľný skript (akýkoľvek jazyk, pokiaľ má shebang).

## Bežné hooks

| Hook | Kedy sa spustí | Typické použitie |
|---|---|---|
| `pre-commit` | Pred vytvorením commitu | Lint/format staged súborov, spustenie rýchlych testov |
| `commit-msg` | Po napísaní správy, pred finalizáciou commitu | Vynútenie formátu správy (napr. Conventional Commits) |
| `pre-push` | Pred tým, než `git push` niečo pošle | Spustenie celej test suite, zablokovanie pushu pri zlyhaní |

## Príklad `pre-commit`

```bash title=".git/hooks/pre-commit"
#!/bin/sh
npx eslint $(git diff --cached --name-only --diff-filter=ACM -- '*.ts' '*.tsx')
```

Sprav ho spustiteľným: `chmod +x .git/hooks/pre-commit`. Nenulový exit kód zo skriptu zablokuje
commit.

## Vynútenie Conventional Commits cez `commit-msg`

```bash title=".git/hooks/commit-msg"
#!/bin/sh
commit_msg=$(cat "$1")
pattern="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+"
if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo "Commit message doesn't follow Conventional Commits format:"
  echo "  <type>(<scope>): <description>"
  exit 1
fi
```

Pozri [Conventional Commits](../05-conventions/conventional-commits.md) pre formát, ktorý toto
kontroluje.

## Lokálne vs. zdieľané hooks

`.git/hooks/` **nie je** commitnuté — žije vo vnútri lokálneho `.git` priečinka, takže hooks tam
umiestnené platia len pre ten jeden clone a automaticky sa nezdieľajú s kolegami.

Na zdieľanie hooks naprieč tímom, drž skripty v trackovanom priečinku (napr. `.githooks/`) a buď:

```bash
git config core.hooksPath .githooks     # povedz Gitu, aby použil tento priečinok namiesto .git/hooks
```

alebo použi nástroj ako [Husky](https://typicode.github.io/husky/) (bežný v Node projektoch),
ktorý nainštaluje hooks automaticky cez `npm install` postinstall krok, takže každý clone ich
dostane bez manuálneho nastavovania.

## Obídenie hooku

```bash
git commit --no-verify -m "..."
```

Preskočí `pre-commit`/`commit-msg`. Užitočné v skutočných núdzových situáciách, ale hook, ktorý
rutinne obchádzaš, je signál, že treba opraviť samotný hook, nie že `--no-verify` je správny
zvyk.

## Skontroluj sa

- Sú `.git/hooks/` skripty commitnuté a automaticky zdieľané s kolegami?

  <details>
  <summary>Odpoveď</summary>

  Nie — žijú vo vnútri lokálneho `.git` priečinka a nie sú commitnuté, takže platia len pre ten
  jeden clone, pokiaľ ich tím explicitne nezdieľa cez trackovaný priečinok + `core.hooksPath`,
  alebo nástroj ako Husky.
  </details>

- Čo spraví nenulový exit kód z `pre-commit` hooku?

  <details>
  <summary>Odpoveď</summary>

  Zablokuje vytvorenie commitu.
  </details>

- Čo robí `git commit --no-verify`, a kedy je to namieste?

  <details>
  <summary>Odpoveď</summary>

  Obíde `pre-commit`/`commit-msg` hooks — užitočné v skutočných núdzových situáciách, ale
  rutinné obchádzanie hooku signalizuje, že treba opraviť samotný hook.
  </details>
