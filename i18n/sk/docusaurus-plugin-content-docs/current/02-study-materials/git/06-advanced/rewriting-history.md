---
sidebar_position: 3
title: Prepisovanie Histórie
---

# Prepisovanie Histórie

Niekoľko nástrojov ti umožní zmeniť commity, ktoré už existujú, namiesto len pridávania nových
navrch. Mocné, a najjednoduchší spôsob, ako spôsobiť skutočné problémy na zdieľanej vetve.

## `rebase -i` na úpravu vlastných nedávnych commitov

Už pokryté do hĺbky na
[Rebasing → Interaktívny rebase](../02-branching-merging/rebasing.md#interaktívny-rebase) —
slovesá `pick`/`reword`/`squash`/`fixup`/`drop` na úpravu, kombinovanie, alebo odstránenie
commitov.

Ešte jedno sloveso, ktoré sa oplatí poznať: `edit`, ktoré pozastaví rebase na tom commite, aby si
ho mohol priamo upraviť:

```bash
git rebase -i HEAD~3
# označ commit ako `edit`, potom:
git commit --amend         # zmeň obsah/správu commitu
git rebase --continue        # pokračuj v prehrávaní zvyšku
```

## `git filter-repo` — prepísanie *celej* histórie

Pre niečo, čo `rebase -i` nedokáže — ako odstránenie súboru, ktorý bol náhodou commitnutý všade
v histórii (secret, obrovský binárny súbor) — použi
[`git filter-repo`](https://github.com/newren/git-filter-repo) (moderná náhrada staršieho,
pomalšieho `git filter-branch`):

```bash
git filter-repo --path secrets.env --invert-paths
```

Toto prepíše **každý** commit, ktorý sa dotkol `secrets.env`, úplne ho odstráni, a dá každému
postihnutému commitu nový hash.

:::warning
Ak bol commitnutý skutočný secret, prepísanie histórie ho odstráni z *budúcich* clonov, ale
ktokoľvek, kto už clonol/pullol, ho stále má, a môže byť cachovaný hostiacou platformou.
Prepísanie histórie nie je náhrada za **rotáciu uniknutého credentialu** — zaobchádzaj s ním
ako s kompromitovaným bez ohľadu na to.
:::

## Prečo je prepisovanie zdieľanej histórie nebezpečné

Každý príkaz vyššie zmení commit hashe. Ak už boli tie commity pushnuté a niekto iný ich pullol,
prepísanie vytvorí fork: tvoja história a ich história už nezdieľajú tie isté commity, aj keď
*obsah* vyzerá podobne. Ich ďalší pull buď zlyhá, alebo (pri určitých merge nastaveniach) znovu
zavedie tie staré, "odstránené" commity naspäť.

**Pravidlo**: prepisuj len commity, ktoré existujú výlučne na tvojej vlastnej vetve, ešte
nikým iným nepullnuté. Akonáhle je niečo na `main`/`develop` alebo inej zdieľanej vetve, zaobchádzaj
s tým ako s trvalým — použi `git revert` (pozri
[Vrátenie Zmien](../04-history-and-fixes/undoing-changes.md)) namiesto toho.

Ak je prepísanie na zdieľanej vetve naozaj nevyhnutné (napr. odstránenie uniknutého secretu
naprieč celým repozitárom), musí byť koordinované: oznám to, nech si každý znovu clonne alebo
opatrne rebasuje svoje vlastné rozrobené vetvy potom, a force-pushni s vedomím celého tímu —
nikdy potichu.

## Skontroluj sa

- Aký je rozdiel medzi tým, čo dokáže prepísať `rebase -i`, a čo dokáže prepísať
  `git filter-repo`?

  <details>
  <summary>Odpoveď</summary>

  `rebase -i` upravuje/preusporadúva/kombinuje/odstraňuje tvoje vlastné nedávne commity;
  `git filter-repo` prepíše *celú* históriu, potrebné pre niečo ako odstránenie súboru
  (uniknutého secretu), ktorý bol commitnutý naprieč celou históriou.
  </details>

- Ak bol náhodou commitnutý secret a potom odstránený cez prepísanie histórie, je credential
  znova bezpečný?

  <details>
  <summary>Odpoveď</summary>

  Nie — ktokoľvek, kto už clonol/pullol, ho stále má, a môže byť cachovaný hostiacou platformou;
  uniknutý credential musí byť rotovaný bez ohľadu na prepísanie histórie.
  </details>

- Aké je pravidlo pre to, kedy je bezpečné prepisovať commity?

  <details>
  <summary>Odpoveď</summary>

  Prepisuj len commity, ktoré existujú výlučne na tvojej vlastnej vetve, ešte nikým iným
  nepullnuté — akonáhle je niečo na zdieľanej vetve, použi namiesto toho `git revert`.
  </details>
