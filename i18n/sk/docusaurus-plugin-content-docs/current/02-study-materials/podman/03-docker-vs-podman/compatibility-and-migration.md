---
sidebar_position: 2
title: Kompatibilita a Migrácia
---

# Kompatibilita a Migrácia

Ako ďaleko "Podman je drop-in náhrada za Docker" naozaj platí, a kde naozaj nie — praktická
otázka za abstraktnejším porovnaním v
[Architektonické Rozdiely](./architecture-differences.md).

## Čo migruje bez akýchkoľvek zmien

```bash
alias docker=podman
```

Pre veľkú väčšinu dennodenného používania — budovanie image z `Dockerfile`, spúšťanie
kontajnerov, `docker ps`/`logs`/`exec`, aj väčšinu `docker-compose.yml` súborov cez
[podman-compose](../02-using-podman/podman-compose.md) — tento doslovný alias často stačí.
Existujúce shell skripty, CI kroky, a dokumentácia odkazujúca na `docker` príkazy typicky naďalej
fungujú bez úprav.

```bash
# Existujúce skripty používajúce tento vzor nepotrebujú žiadne zmeny vôbec:
docker build -t my-app .
docker run -d --name web my-app
docker logs -f web
```

## Čo si zaslúži druhý pohľad pred migráciou

**Čokoľvek, čo sa rozpráva priamo s API Docker daemona** (nie len CLI `docker`) — niektoré CI
runnery, IDE integrácie, a nástroje tretích strán predpokladajú, že na známej ceste existuje
Docker-kompatibilný socket.

```bash
podman system service --time=0 unix:///run/user/1000/podman/podman.sock
```

Podman *vie* vystaviť Docker-API-kompatibilný socket týmto spôsobom, čo umožní API-based toolingu
proti nemu fungovať — ale toto je explicitný opt-in krok, nie automatický, na rozdiel od daemon
socketu Dockeru, ktorý jednoducho existuje, akonáhle je Docker nainštalovaný a beží.

**Privilegované porty, ak beží rootless** (pozri
[Rootless Predvolene](../01-basics/rootless-by-default.md)) — bindovanie priamo na port 80/443
vyžaduje buď beh rootful, alebo úpravu kernel nastavenia
`net.ipv4.ip_unprivileged_port_start`.

**Okrajové prípady oprávnení volume** — keďže rootless Podman mapuje UID kontajnera cez user
namespaces (pozri [Rootless Predvolene](../01-basics/rootless-by-default.md)), vlastníctvo
bind-mountnutého priečinka sa môže správať inak než pod tradičným root-daemon modelom Dockeru,
najmä pri image, ktoré majú natvrdo zakódované konkrétne UID/GID očakávania pre pripojené dáta.

## Realistický migračný checklist

```text
1. Nainštaluj Podman, vyskúšaj `alias docker=podman` voči existujúcim skriptom/Compose súborom.
2. Spusti skutočnú testovaciu sadu / CI pipeline voči Podman, nielen sa pozri okom.
3. Skontroluj, či niečo hovorí priamo s Docker socketom (nie len docker CLI) —
   Docker integrácie IDE, niektoré interné CI runnera, určité GUI nástroje.
4. Ak beží rootless a bindovanie nízkych portov, uprav kernel nastavenie alebo akceptuj rootful
   pre tie konkrétne služby.
5. Skontroluj konkrétne oprávnenia bind-mountnutých volume, ak nejaký image predpokladá pevné UID/GID.
```

## Prečo väčšina tímov nepotrebuje "big bang" migráciu

Keďže oba nástroje konzumujú rovnaké OCI image a do veľkej miery rovnakú Dockerfile/Compose
syntax, prepnutie je zriedka rozhodnutie všetko-alebo-nič — tím môže bežať Podman lokálne na
vývoj (dennodenný rootless bezpečnostný benefit) zatiaľ čo produkcia stále beží na Docker, alebo
naopak, bez toho, aby sa samotný formát image alebo Dockerfile museli akokoľvek líšiť. Obsah
[Docker témy](/sk/study-materials/docker/basics/what-is-a-container) — Dockerfile, vrstvy image,
Compose súbory — je rovnako aplikovateľný bez ohľadu na to, ktorý engine ich naozaj spúšťa.
