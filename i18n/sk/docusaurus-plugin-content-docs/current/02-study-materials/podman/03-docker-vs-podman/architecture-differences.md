---
sidebar_position: 1
title: Architektonické Rozdiely
---

# Architektonické Rozdiely

Súhrnný pohľad na to, čo sa naozaj líši, po individuálnom pokrytí každého kúsku skôr v tejto
téme.

## Vedľa seba

| | Docker | Podman |
|---|---|---|
| Architektúra | Client-server: CLI sa rozpráva s background daemonom (`dockerd`) | Bezdémonová: CLI priamo spravuje kontajnery ako vlastné detské procesy |
| Predvolený model privilégií | Daemon tradične beží ako root; skupina `docker` ≈ root prístup | Predvolene rootless — žiadna špeciálna skupina, netreba zvýšený prístup |
| Jediný bod zlyhania | Áno — pád daemona ovplyvní každý kontajner, ktorý spravuje | Nie — žiadny zdieľaný daemon proces, ktorý by mohol spadnúť |
| Multi-kontajnerové zoskupovanie | Bridge siete + Compose (kontajnery si držia samostatné IP, dosahujú sa podľa mena služby) | Natívny koncept "pod" — kontajnery zdieľajú jeden network namespace, zrkadliac Kubernetes pody |
| Generovanie Kubernetes YAML | Nie je vstavané (treba samostatný nástroj ako `kompose`) | Vstavané (`podman generate kube`) |
| Správa perzistentnej služby | Vlastné restart politiky daemona | Deleguje na systemd (`podman generate systemd`) |
| CLI | `docker ...` | `podman ...` — zámerne takmer identická syntax |
| Formát image | OCI-compliant | OCI-compliant — rovnaké image fungujú s oboma |

## Prečo je "daemon vs. bezdémonové" koreňom väčšiny ostatných rozdielov

Takmer každý ďalší riadok tejto tabuľky sa dá vystopovať späť k tejto jednej architektonickej
voľbe:

- Rootless-predvolene existuje *lebo* neexistuje root daemon, cez ktorý by sa udelil prístup.
- Žiadny jediný bod zlyhania existuje *lebo* neexistuje zdieľaný proces, na ktorom všetko závisí.
- Potreba systemd pre perzistenciu existuje *lebo* neexistuje daemon, ktorý by túto úlohu
  dohliadania už robil.
- Koncept pod nie je striktne dôsledok bezdémonovosti, ale odráža rovnakú podkladovú
  dizajnovú filozofiu — modelovať zoskupovanie kontajnerov spôsobom, akým to už robí orchestrátor
  (Kubernetes), namiesto vymýšľania vlastnej samostatnej abstrakcie Dockeru (bridge siete
  Compose).

## Čo je naozaj ekvivalentné, nie len podobné

- **Formát image** — oba buildujú a konzumujú štandardné OCI image. Image vybudovaný `docker
  build` beží v poriadku pod `podman run`, a naopak — toto nie je kompatibilná náplasť, je to ten
  istý otvorený štandard, na ktorý oba nástroje cielia.
- **Syntax Dockerfile** — Podman číta obyčajný `Dockerfile` priamo, žiadny samostatný formát
  `Podmanfile` neexistuje.
- **Väčšina dennodenných CLI príkazov** — pozri
  [Základy Podman CLI](../02-using-podman/podman-cli-basics.md) pre rozsah tohto.

## Čo naozaj nie je drop-in náhrada

- Čokoľvek, čo predpokladá existenciu **daemon socketu** (niektorý tooling postavený okolo
  Docker API, Docker-specifické orchestračné integrácie), automaticky nefunguje voči Podman bez
  toho, aby bola explicitne zapnutá a nasmerovaná vlastná daemon-kompatibilná API vrstva Podman
  (`podman system service`).
- Rootless-specifické okrajové prípady (privilegované porty, niektoré pokročilé
  networking/volume permission scenáre) — pozri sekciu "Skutočné limity" v
  [Rootless Predvolene](../01-basics/rootless-by-default.md).

[Kompatibilita a Migrácia](./compatibility-and-migration.md) pokrýva presne, ako ďaleko
kompatibilita v praxi siaha, a [Kedy Vybrať Ktorý](./when-to-choose-which.md) premení toto
porovnanie na skutočný sprievodca rozhodovaním.
