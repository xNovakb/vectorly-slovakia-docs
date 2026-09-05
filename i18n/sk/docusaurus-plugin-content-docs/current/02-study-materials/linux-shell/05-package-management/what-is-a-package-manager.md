---
sidebar_position: 1
title: Čo je Package Manager
---

# Čo je Package Manager

**Package manager** inštaluje, aktualizuje a odstraňuje softvér, a — kriticky — automaticky
vyrieši a nainštaluje čokoľvek *iné*, na čom tento softvér závisí, namiesto toho, aby si to
sledoval ručne.

## Čo skutočne rieši

Bez neho inštalácia niečoho znamená ručne nájsť správny binárny súbor pre tvoju presnú OS/CPU
architektúru, zistiť každú knižnicu, na ktorej závisí, nainštalovať aj tie, a opakovať to
rekurzívne pre ich závislosti. Package manager z toho spraví:

```bash
sudo apt install docker.io
```

...a on sám vyrieši graf závislostí, stiahne všetko potrebné, a dá to všetko na správne miesto.

## Package manager na úrovni distribúcie vs. jazyka

Ľahko sa to popletie — táto sekcia pokrýva ten **distro-level** typ (inštalácia systémového
softvéru), nie **language-level** typ, ktorý už poznáš z iných kontextov:

| Úroveň | Príklady | Inštaluje |
|---|---|---|
| Distribúcia | `apt` (Debian/Ubuntu), `dnf` (Fedora/RHEL) | Systémové balíky: `docker`, `nginx`, `git`, samotný `curl` |
| Jazyk | `npm`, `pip`, `cargo` | Knižnice pre jeden konkrétny projekt, v rámci vlastného scope tohto projektu |

Oba majú význam, ale sú nezávislé — `npm install` sa nedotýka systémových balíkov, a `apt` sa
nedotýka `node_modules` Node projektu.

## Repozitáre

Package manager neprehľadáva celý internet — pozerá do nakonfigurovaných **repozitárov** (repos),
zoznamov dostupných balíkov a odkiaľ ich stiahnuť, definovaných v súboroch ako
`/etc/apt/sources.list` (Debian/Ubuntu) alebo `/etc/yum.repos.d/` (Fedora/RHEL). Pridanie
repozitára tretej strany (napr. oficiálneho Docker repozitára) je spôsob, ako získať softvér
novší, než čo distribúcia predvolene dodáva.

## Prečo na tom záleží pre server tejto organizácie

VPS, na ktorom bežia stránky tejto organizácie, je Fedora/Ubuntu-based (pozri
[`/sk/internal-operations/server-architecture`](/sk/internal-operations/server-architecture)) —
čo znamená, [`apt` alebo `dnf`](./apt-and-dnf.md) je to, ako sa samotný Docker, spolu s akýmkoľvek
iným systémovým tooling-om, skutočne nainštaloval a udržuje aktuálny na tomto počítači.
