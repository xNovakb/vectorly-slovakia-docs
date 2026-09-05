---
sidebar_position: 1
title: Čo je Git
---

# Čo je Git

Git je **systém na správu verzií (VCS)**: zaznamenáva históriu súborov projektu v čase, takže vidíš,
čo sa zmenilo, kto to zmenil, a vieš sa v prípade potreby vrátiť späť.

## Snapshoty, nie diffy

Bežná mylná predstava je, že Git ukladá zoznam *diffov* (patchov) medzi súbormi. Nie je to tak —
každý commit je **kompletný snapshot** celého projektu v danom bode v čase. Ak sa súbor medzi
dvoma commitmi nezmenil, Git jednoducho oba commity nasmeruje na ten istý uložený súbor namiesto
jeho opätovného kopírovania. Preto sú commity lacné a preto sú operácie ako checkout starého
commitu rýchle — Git neprehráva reťaz patchov, len ti odovzdá uložený snapshot.

## Distribuovaný, nie centralizovaný

Staršie nástroje ako SVN alebo CVS udržiavajú jednu centrálnu kópiu histórie na serveri; tvoj
lokálny počítač má len aktuálne súbory. Git je **distribuovaný**: každý klon obsahuje **celú**
históriu, nielen posledný snapshot.

```bash
git clone https://github.com/example/project.git
```

Po tomto máš:
- každý commit, ktorý kedy vznikol,
- každú vetvu a tag,
- celú históriu — všetko na vlastnom disku, bez potreby siete na jej prehliadanie.

Preto `git log`, `git diff` medzi starými commitmi a prepínanie vetiev fungujú offline.

## Prečo na tom záleží v praxi

- Môžeš commitovať, vetviť a prezerať históriu bez pripojenia k sieti — sieť potrebuješ len pri
  `push`/`pull`/`fetch` na synchronizáciu s ostatnými.
- Strata servera neznamená stratu histórie — obnoviť ju vie ktorýkoľvek klon.
- Vetvenie je lacné (vetva je len presúvateľný ukazovateľ na commit), preto sa Git workflow tak
  silno opiera o vetvy — pozri [Vetvy](../02-branching-merging/branches.md).

## Tri stavy súboru

Git sleduje súbor v jednom z troch stavov, čo bude dôležité, keď začneš commitovať:

| Stav | Význam |
|---|---|
| **Working directory** | Súbor tak, ako je na disku, prípadne upravený |
| **Staging area (index)** | Zmeny označené pomocou `git add`, pripravené na commit |
| **Committed** | Zmeny uložené do histórie projektu |

Ďalšia stránka, [Inštalácia a Konfigurácia](./installation-config.md), ťa nastaví na to, aby si to
mohol vyskúšať; [Základný Workflow](./core-workflow.md) prevedie súbor cez tieto tri stavy.

## Skontroluj sa

- Prečo Git ukladá commity ako snapshoty namiesto diffov, a aký praktický prínos to dáva?

  <details>
  <summary>Odpoveď</summary>

  Každý commit je kompletný snapshot — nezmenený súbor jednoducho ukazuje na ten istý uložený
  blob ako predtým, namiesto opätovného kopírovania. Preto sú commity lacné a checkout starého
  commitu je rýchly: Git ti odovzdá uložený snapshot namiesto prehrávania reťaze patchov.
  </details>

- Čo znamená "distribuovaný" pre Git konkrétne, v kontraste s SVN/CVS?

  <details>
  <summary>Odpoveď</summary>

  Každý klon obsahuje celú históriu — každý commit, vetvu a tag — nielen posledný snapshot.
  SVN/CVS držia skutočnú históriu na centrálnom serveri; tvoj lokálny počítač má len aktuálne
  súbory.
  </details>

- Pomenuj tri stavy, v ktorých môže byť súbor, a ktorý príkaz ho presunie z prvého do druhého.

  <details>
  <summary>Odpoveď</summary>

  Working directory, staging area (index), a committed. `git add` presunie súbor z working
  directory do staging area.
  </details>

- Prečo môžeš spraviť `git log` a prepínať vetvy bez pripojenia k sieti?

  <details>
  <summary>Odpoveď</summary>

  Tvoj klon už drží celú históriu lokálne — pripojenie k sieti potrebuješ len na synchronizáciu s
  ostatnými cez push/pull/fetch.
  </details>
