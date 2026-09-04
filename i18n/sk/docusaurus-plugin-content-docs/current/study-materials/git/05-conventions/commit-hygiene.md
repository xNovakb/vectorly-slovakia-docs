---
sidebar_position: 2
title: Hygiena Commitov
---

# Hygiena Commitov

Dobrá hygiena commitov znamená, že každý commit je samostatná, zrozumiteľná jednotka — nie surový
denník každého úderu klávesu.

## Atomické commity

Atomický commit robí **jednu logickú vec**. Ak musíš do commit správy napísať "a", často to
znamená, že by mali byť commity dva:

```
❌ fix(login): fix validation bug and update dependencies and tweak CSS
✅ fix(login): reject empty password on login
✅ chore(deps): bump lodash to 4.17.21
✅ style(login): align submit button with form width
```

Prečo na tom v praxi záleží:
- `git revert` na jednom commite náhodne nevráti aj nesúvisiacu prácu.
- Code review je jednoduchší — reviewer vie zhodnotiť "dáva táto jedna vec zmysel" namiesto
  rozpletania troch vecí naraz.
- `git bisect` (pozri [Bisect](../04-history-and-fixes/bisect.md)) funguje dobre len ak sú
  commity malé a izolované — bisect, ktorý pristane na obrovskom zmiešanom commite, veľa
  nepovie.

## Rozdelenie jednej edit session na viac commitov

Nemusíš commitovať v poradí, v akom si písal kód — stagni selektívne:

```bash
git add -p            # stagni hunk po hunku, vyber, čo patrí do tohto commitu
git commit -m "fix(login): reject empty password on login"
git add -p             # stagni zvyšok
git commit -m "chore(deps): bump lodash to 4.17.21"
```

## Písanie samotnej správy

- **Riadok zhrnutia**: rozkazovací spôsob ("add", "fix", "remove" — nie "added"/"fixes"), pod
  ~72 znakov, bez bodky na konci.
- **Telo** (voliteľné, prázdny riadok po zhrnutí): vysvetli *prečo*, nie *čo* — diff už ukazuje,
  čo sa zmenilo.

```
fix(cart): recalculate total after coupon removal

Previously the cached total wasn't invalidated when a coupon was
removed, so the UI kept showing the discounted price after checkout
had already reverted to full price server-side.
```

## Neporiadna lokálna história je v poriadku — vyčisti ju pred zdieľaním

Je úplne normálne commitovať `wip`, `fix typo`, `actually fix it` počas práce. Pravidlo hygieny
platí pre to, čo pristane v **trvalej, zdieľanej histórii** — vyčisti to pomocou `rebase -i` pred
otvorením PR, alebo to za teba spraví squash-merge. Pozri
[Squash a Rebase](./squash-and-rebase.md).
