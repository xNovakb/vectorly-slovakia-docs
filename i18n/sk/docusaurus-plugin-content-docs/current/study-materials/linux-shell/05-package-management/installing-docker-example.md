---
sidebar_position: 3
title: "Príklad z Praxe: Inštalácia Dockeru"
---

# Príklad z Praxe: Inštalácia Dockeru

Konkrétny, end-to-end príklad spájajúci správu balíkov, používateľov/skupiny a oprávnenia dokopy —
presne ako sa samotný Docker, vec, na ktorej beží každý kontajner v stacku tejto organizácie
(pozri
[`/sk/internal-operations/server-architecture`](/sk/internal-operations/server-architecture)),
skutočne dostane na čerstvý server.

## 1. Nainštaluj ho cez package manager

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io

# Fedora/RHEL
sudo dnf install docker
```

Pozri [apt a dnf](./apt-and-dnf.md), čo každý z týchto krokov skutočne robí, a všimni si, že
distro-bundled verzia môže zaostávať za oficiálnym Docker repozitárom — pozri sekciu "Pridanie
repozitára tretej strany" na tej stránke, ak je konkrétne potrebná novšia verzia.

## 2. Spusti ho a povoľ pri štarte

Docker beží ako **služba** na pozadí, spravovaná systemd (podrobne pokryté v
[systemd a Služby](../06-practical-shell/systemd-and-services.md)):

```bash
sudo systemctl start docker      # spusti ho teraz
sudo systemctl enable docker       # spúšťaj automaticky pri každom budúcom štarte
sudo systemctl status docker         # potvrď, že naozaj beží
```

## 3. Dovoľ non-root používateľovi spúšťať `docker` príkazy

Predvolene sa len `root` môže rozprávať s Docker daemonom — spustenie `docker ps` ako bežný
používateľ zlyhá s chybou oprávnenia. Oprava sa priamo viaže na
[Používatelia a Skupiny](../02-permissions-and-users/users-and-groups.md):

```bash
sudo usermod -aG docker deploy      # pridaj "deploy" do skupiny docker
```

Musíš sa **odhlásiť a znovu prihlásiť** (alebo spustiť novú shell session), aby sa nové členstvo
v skupine prejavilo — veľmi bežná pasca "spustil som príkaz, ale stále to nefunguje."

```bash
groups        # potvrď, že "docker" sa teraz zobrazuje v tvojom zozname skupín
docker ps       # teraz by malo fungovať bez sudo
```

:::note
Byť v skupine `docker` je funkčne ekvivalentné root prístupu na tom počítači — akýkoľvek
kontajner sa dá nakonfigurovať tak, aby pripojil hostiteľský súborový systém. Toto je zámerný,
pochopený kompromis kvôli pohodliu vývojára, nie prehliadnutie — zaobchádzaj s členstvom v
docker skupine s rovnakou opatrnosťou ako so sudo právami (pozri
[Sudo a Root](../02-permissions-and-users/sudo-and-root.md)), nie ako s neškodným prepínačom
pohodlia.
:::

## 4. Over reálnym kontajnerom

```bash
docker run hello-world
```

Stiahne malý testovací image a spustí ho — úspešný beh potvrdí, že daemon je dosiahnuteľný, tvoj
používateľ má oprávnenie, a networking/sťahovanie image-ov funguje end to end.

## Čo tento príklad demonštruje

Každý kúsok z tejto sekcie sa objaví v jednej realistickej úlohe: `apt`/`dnf` na inštaláciu
softvéru, `systemctl` na jeho beh ako perzistentnú službu, `usermod`/skupiny na udelenie prístupu
bežnému používateľovi bez potreby `sudo` pri každom jednom príkaze. Žiadna z týchto tém neexistuje
izolovane na reálnom serveri.
