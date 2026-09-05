---
sidebar_position: 2
title: Pull / Merge Requesty
---

# Pull / Merge Requesty

**Pull request** (GitHub) alebo **merge request** (GitLab) — rovnaký koncept, iný názov — je
žiadosť o zlúčenie jednej vetvy do druhej, otvorená *pred* samotným zlúčením, aby si ostatní mohli
najprv pozrieť diff. Nie je to vôbec koncept Gitu — je to funkcia, ktorú pridáva hostingová
platforma (GitHub/GitLab) navyše.

## Typický postup

```bash
git switch -c feature/login main    # odvetvi sa z main
# ... commituj prácu ...
git push -u origin feature/login    # pushni vetvu
```

Potom na GitHub/GitLab: otvor PR/MR z `feature/login` do `main`. Toto poskytne:

- diff view všetkého, čo vetva mení,
- miesto na komentáre/vlákna review na konkrétnych riadkoch,
- CI status checky (testy, linting) automaticky spustené voči vetve,
- jedno tlačidlo na zlúčenie po schválení.

## Priebeh code review

1. Autor otvorí PR, ideálne s popisom *čo* a *prečo*.
2. Reviewer(i) nechajú inline komentáre na konkrétnych riadkoch, alebo schvália.
3. Autor pushne ďalšie commity riešiace feedback — PR sa aktualizuje automaticky, netreba nič
   znovu otvárať.
4. Po schválení a prejdení checkov zlúč (pozri
   [Squash a Rebase](../05-conventions/squash-and-rebase.md) pre *ako* tu mergujeme).

```bash
# riešenie feedbacku z review:
git add src/login.ts
git commit -m "fix: address review comment on error message wording"
git push origin feature/login       # PR sa aktualizuje automaticky
```

## Forkovanie vs. spoločný repozitár

Dva bežné modely, kto môže pushovať vetvy:

- **Spoločný repozitár** (typické pre malý tím s write prístupom): každý pushuje feature vetvy
  priamo do rovnakého repozitára, otvorí PR z `feature/x` → `main`.
- **Fork-based** (typické pre open source, alebo prispievateľov bez write prístupu): forkneš
  repozitár do vlastného účtu, pushuješ vetvy tam, a otvoríš PR *z vlastného forku* do
  originálneho repozitára. Vyžaduje nastavenie remotov `origin`/`upstream` popísané v
  [Remote Repozitáre](./remotes.md).

Táto organizácia používa model spoločného repozitára so štruktúrou vetiev
`main`/`develop`/`feature` — pozri [Modely Git Workflow](./git-workflow-models.md) a reálnu
politiku na [`/sk/internal-operations/git-workflow`](/sk/internal-operations/git-workflow).

## Skontroluj sa

- Je pull/merge request koncept Gitu?

  <details>
  <summary>Odpoveď</summary>

  Nie — je to funkcia, ktorú pridáva hostingová platforma (GitHub/GitLab) navyše k obyčajnému
  Gitu; samotný Git nemá koncept PR.
  </details>

- Ak pushneš ďalšie commity na vetvu, ktorá má už otvorený PR, treba niečo znovu otvárať?

  <details>
  <summary>Odpoveď</summary>

  Nie — PR sa automaticky aktualizuje o nové commity.
  </details>

- Aký je kľúčový rozdiel medzi modelom spoločného repozitára a fork-based modelom?

  <details>
  <summary>Odpoveď</summary>

  V spoločnom repozitári každý pushuje feature vetvy priamo do rovnakého repozitára; vo
  fork-based modeli pushuješ do vlastnej forknutej kópie a otvoríš PR z forku do originálneho
  repozitára — čo vyžaduje nastavenie remotov `origin`/`upstream`.
  </details>
