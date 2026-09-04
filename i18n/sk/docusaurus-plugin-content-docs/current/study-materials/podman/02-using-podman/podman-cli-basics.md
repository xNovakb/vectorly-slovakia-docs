---
sidebar_position: 1
title: Základy Podman CLI
---

# Základy Podman CLI

Praktický výsledok zámernej CLI kompatibility Podman (pozri
[Čo je Podman](../01-basics/what-is-podman.md)): takmer všetko z témy
[Docker](/sk/study-materials/docker/basics/what-is-a-container) sa prenáša priamo, príkaz za
príkazom.

## Rovnaké základné príkazy

```bash
podman run -d --name web nginx
podman ps
podman ps -a
podman stop web
podman start web
podman rm web
podman logs -f web
podman exec -it web sh
podman build -t my-app .
podman images
podman pull nginx
```

Každý jeden z nich sa správa rovnako ako jeho ekvivalent `docker` pokrytý naprieč témou
[Docker](/sk/study-materials/docker/basics/what-is-a-container) — [Životný Cyklus Kontajnera](/sk/study-materials/docker/running-containers/container-lifecycle),
[Exec, Logy a Inspect](/sk/study-materials/docker/running-containers/exec-logs-and-inspect), a
[Základy Dockerfile](/sk/study-materials/docker/images-and-dockerfiles/dockerfile-basics) platia
tu bez úprav — Podman dokonca predvolene číta obyčajný `Dockerfile`, netreba samostatný formát.

## Doslovný trik s `alias`

```bash
alias docker=podman
```

Keďže povrch príkazov je tak tesne zhodný, mnohé nastavenia jednoducho aliasujú `docker` na
`podman` a existujúce skripty, CI konfigurácie, a svalová pamäť naďalej fungujú bez akýchkoľvek
zmien — pozri [Kompatibilita a Migrácia](../03-docker-vs-podman/compatibility-and-migration.md)
pre presne to, ako ďaleko táto kompatibilita siaha, a kde nie.

## Kde sa CLI naozaj líši

```bash
podman pod create --name my-app-pod      # žiadny ekvivalent v Dockeri — pozri Koncept Pod
podman generate kube my-app-pod            # vygeneruj Kubernetes YAML z bežiaceho podu — žiadny ekvivalent v Dockeri
podman generate systemd --name web           # vygeneruj systemd unit pre kontajner — pozri Podman a systemd
```

Tieto tri sú naozaj Podman-specifické — vôbec neexistujú ako `docker` subpríkazy, lebo sú
postavené okolo konceptov (pody, priama systemd integrácia), ktoré v modeli Dockeru neexistujú.

## Rootless je jednoducho predvolené — netreba nič naviac napísať

```bash
podman run -d nginx      # už rootless, predvolene, žiadne flagy netreba
```

Na rozdiel od potreby špecificky zapnúť Docker rootless režim, neexistuje samostatný príkaz ani
flag "rootless Podman" — pozri [Rootless Predvolene](../01-basics/rootless-by-default.md) pre to,
prečo je toto normálny, nič nezvláštny spôsob, akým Podman beží.

## Kontrola, čo je naozaj iné pod kapotou

```bash
podman info          # ukáže detaily runtime — žiadna sekcia "Docker daemon" vôbec, keďže žiadny neexistuje
```

`podman info` hlási o vlastnom stave runtime Podman priamo (žiadny daemon na dopyt) — dobrý
rýchly spôsob, ako potvrdiť, že sa naozaj rozprávaš s Podman a vidieť rootless/rootful stav,
storage driver, a použitý OCI runtime (typicky `crun` alebo `runc`).
