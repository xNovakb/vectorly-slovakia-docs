---
sidebar_position: 1
title: Submoduly a Subtrees
---

# Submoduly a Subtrees

Oboje ti umožní vložiť jeden Git repozitár do druhého. Rôzne kompromisy.

## Submoduly

Submodul je **ukazovateľ na konkrétny commit** iného repozitára, uložený ako špeciálna položka
v tvojom repozitári (nie súbory druhého repozitára samotné).

```bash
git submodule add git@github.com:example/shared-lib.git libs/shared-lib
git commit -m "chore: add shared-lib as submodule"
```

Clonovanie repozitára so submodulmi predvolene nepretiahne ich obsah — je potrebný extra krok:

```bash
git clone --recurse-submodules git@github.com:example/project.git
# alebo, po obyčajnom clone:
git submodule update --init --recursive
```

Aktualizácia submodulu na novší commit vnútorného repozitára:

```bash
cd libs/shared-lib
git pull origin main
cd ../..
git add libs/shared-lib
git commit -m "chore: bump shared-lib submodule"
```

Výhody: vnútorný repozitár zostáva plne nezávislým Git repozitárom, s vlastnou históriou a
remote. Nevýhody: každý clone/pull potrebuje extra submodule krok, a je to bežný zdroj zmätku
"prečo je tento priečinok prázdny" pre každého, kto submodules nepozná.

## Subtrees

Subtree skopíruje súbory iného repozitára **priamo do** histórie tvojho repozitára, žiadny
špeciálny ukazovateľ — len bežné commitnuté súbory.

```bash
git subtree add --prefix=libs/shared-lib git@github.com:example/shared-lib.git main --squash
```

Neskoršie pretiahnutie upstream zmien:

```bash
git subtree pull --prefix=libs/shared-lib git@github.com:example/shared-lib.git main --squash
```

Výhody: funguje bez extra krokov pre kohokoľvek, kto clonne — súbory sú jednoducho tam.
Nevýhody: história vnútorného repozitára sa zloží do tvojej (neprehľadnejší `git log`), a
pushnutie zmien späť upstream je zložitejšie než pri submodule.

## Ktorý zvoliť

| | Submodul | Subtree |
|---|---|---|
| Extra clone/pull kroky | Áno | Nie |
| Vnútorný repozitár zostáva nezávislý | Áno | Zliaty dokopy |
| Dobré pre | Knižnicu, ktorú verzuješ a aktualizuješ zámerne | Vendorovanie kódu, ktorý zriedka potrebuješ pushovať späť |

Pre väčšinu interných potrieb "zdieľaný kód medzi našimi vlastnými repozitármi" je publikovaný
balík (npm, atď.) zvyčajne jednoduchší než oboje — siahni po submodules/subtrees len keď
publikovanie balíka nie je praktické.

## Skontroluj sa

- Čo submodul naozaj uloží v tvojom repozitári — súbory druhého repozitára, alebo niečo iné?

  <details>
  <summary>Odpoveď</summary>

  Ukazovateľ na konkrétny commit druhého repozitára, nie súbory druhého repozitára samotné —
  clonovanie potrebuje extra krok (`--recurse-submodules` alebo `submodule update --init`), aby
  naozaj pretiahlo obsah.
  </details>

- Zachová subtree vnútorný repozitár ako nezávislý Git repozitár?

  <details>
  <summary>Odpoveď</summary>

  Nie — subtree skopíruje súbory druhého repozitára priamo do histórie tvojho repozitára ako
  bežné commitnuté súbory, čím zlieva jeho históriu do tvojej.
  </details>

- Pre väčšinu interných potrieb "zdieľaný kód medzi našimi vlastnými repozitármi," čo je
  zvyčajne jednoduchšie než submoduly alebo subtrees?

  <details>
  <summary>Odpoveď</summary>

  Publikovaný balík (napr. npm balík).
  </details>
