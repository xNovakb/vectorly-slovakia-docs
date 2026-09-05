---
sidebar_position: 4
title: Worktrees
---

# Worktrees

Bežne, jeden clone = jedna checked-out vetva naraz; prepínanie vetiev znamená `git switch` a tvoj
pracovný adresár sa pod tebou zmení. `git worktree` ti umožní checkoutnúť **viacero vetiev naraz**,
každú vo vlastnom samostatnom priečinku, všetky zdieľajúce ten istý podkladový repozitár/históriu.

## Prečo

Bežný prípad: si uprostred feature (necommitnuté zmeny, ktoré nechceš stashnúť) a potrebuješ
urgentne checkoutnúť `main`, aby si zreprodukoval bug, bez narušenia svojej rozrobenej práce.

```bash
git worktree add ../project-hotfix main
```

Toto vytvorí nový priečinok `../project-hotfix`, checked-out na `main`, ako plný pracovný
adresár — samostatný od tvojho súčasného, ale stále súčasť toho istého repozitára (rovnaká
`.git` história, rovnaké remotes, rovnaké objekty).

```bash
cd ../project-hotfix
# oprav bug na main tu, úplne izolovane od tvojho druhého pracovného adresára
git commit -m "fix: urgent null check"
git push origin main
```

Medzitým tvoj pôvodný priečinok stále má necommitnuté zmeny tvojej feature vetvy nedotknuté.

## Vytvorenie worktree pre novú vetvu

```bash
git worktree add ../project-experiment -b experiment/new-idea
```

## Výpis a odstránenie worktrees

```bash
git worktree list
git worktree remove ../project-hotfix       # keď s ním skončíš
```

Priečinok worktree zmazaný ručne (namiesto `git worktree remove`) zanechá zastarané metadáta —
vyčisti to pomocou:

```bash
git worktree prune
```

## Worktrees vs. stash vs. jednoducho znovu clonovanie

| | Worktree | `git stash` | Druhý `git clone` |
|---|---|---|---|
| Zdieľa históriu/objekty s originálom | Áno | Áno (rovnaký repozitár) | Nie — úplne samostatná kópia |
| Zachová necommitnutú prácu nedotknutú | Áno | Presunie ju bokom | Áno, ale zduplikuje celé `.git` |
| Využitie disku | Nízke (zdieľa objekty) | Žiadne navyše | Plná druhá kópia |

Worktrees sú efektívnejšia verzia "jednoducho to znovu clonni do iného priečinka" — rovnaká
výhoda (dva pracovné adresáre naraz), bez duplikovania celej histórie repozitára na disku.

## Skontroluj sa

- Aký problém rieši `git worktree`, ktorý by inak vyžadoval stashovanie?

  <details>
  <summary>Odpoveď</summary>

  Umožní ti checkoutnúť inú vetvu (napr. `main`, na opravu urgentného bugu) v úplne samostatnom
  priečinku, bez narušenia tvojej súčasnej necommitnutej práce na inej vetve.
  </details>

- Zdieľajú viaceré worktrees rovnakú históriu commitov/objekty, alebo každý worktree
  zduplikuje repozitár?

  <details>
  <summary>Odpoveď</summary>

  Zdieľajú ten istý podkladový repozitár/históriu (rovnaké `.git`, rovnaké remotes, rovnaké
  objekty) — oveľa nižšie využitie disku než druhý plný `git clone`.
  </details>

- Čo potrebuješ spustiť po zmazaní priečinka worktree ručne namiesto použitia
  `git worktree remove`?

  <details>
  <summary>Odpoveď</summary>

  `git worktree prune`, aby si vyčistil zastarané metadáta, ktoré po sebe zanechal.
  </details>
