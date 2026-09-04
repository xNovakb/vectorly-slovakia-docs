---
sidebar_position: 1
title: Používatelia a Skupiny
---

# Používatelia a Skupiny

Linux je multi-user podľa dizajnu, aj na serveri, do ktorého sa naozaj prihlasuje len jeden
človek — každý proces a súbor vlastní konkrétny používateľ, a toto vlastníctvo je to, čo
oprávnenia (pozri [Oprávnenia Súborov](./file-permissions.md)) skutočne kontrolujú.

## Kto som

```bash
whoami          # tvoje používateľské meno
id               # tvoje user ID (UID), group ID (GID), a každá skupina, do ktorej patríš
```

```text
$ id
uid=1000(deploy) gid=1000(deploy) groups=1000(deploy),999(docker)
```

Toto `groups=...,999(docker)` má praktický význam — byť v skupine `docker` je to, čo umožňuje
non-root používateľovi vôbec spúšťať `docker` príkazy (pozri
[Sudo a Root](./sudo-and-root.md) prečo je toto zámerná alternatíva k používaniu `sudo` pri
každom Docker príkaze).

## Používatelia a skupiny ako súbory

```bash
cat /etc/passwd | grep deploy
# deploy:x:1000:1000::/home/deploy:/bin/bash
```

Formát: `username:password-placeholder:UID:GID:comment:home-dir:default-shell`. Skutočný hash
hesla býva v `/etc/shadow` (čitateľný len rootom) — `/etc/passwd` drží len metadáta účtu,
historicky čitateľné pre každého.

```bash
cat /etc/group | grep docker
# docker:x:999:deploy
```

## Prečo servery používajú dedikovaného non-root používateľa

VPS tejto organizácie beží všetko ako používateľ menom `bnovak`, nie ako `root` (pozri
[`/sk/internal-operations/server-architecture`](/sk/internal-operations/server-architecture)) —
toto je štandardná prax, nie svojvoľná voľba:

- Chyba (`rm -rf` na zlom mieste, zlý skript) spustená ako obmedzený používateľ môže poškodiť len
  to, čo tento používateľ vlastní — ako root môže poškodiť celý systém.
- Kompromitovaná služba bežiaca ako obmedzený používateľ odovzdá útočníkovi obmedzený prístup,
  nie plnú kontrolu nad počítačom.
- Čokoľvek, čo naozaj potrebuje zvýšené práva, si ich explicitne vyžiada cez `sudo` (pozri
  [Sudo a Root](./sudo-and-root.md)) — zámerná, logovaná akcia, nie predvolený stav.

## Vytváranie a správa používateľov

```bash
sudo useradd -m deploy         # vytvor používateľa, -m vytvorí jeho domovský priečinok
sudo passwd deploy               # nastav mu heslo
sudo usermod -aG docker deploy    # pridaj existujúceho používateľa do skupiny docker
```

`-aG` (append + groups) má význam — obyčajné `-G` *nahradí* všetky existujúce členstvá
používateľa v skupinách namiesto pridania jednej, bežná a rušivá chyba.

## Prepínanie používateľov

```bash
su - deploy         # prepni sa na login shell používateľa deploy (spýta sa na heslo deploy)
sudo -u deploy whoami   # spusti jeden príkaz ako deploy (spýta sa na TVOJE heslo, ak máš sudo práva)
```
