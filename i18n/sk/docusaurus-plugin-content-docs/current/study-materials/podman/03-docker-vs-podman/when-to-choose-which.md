---
sidebar_position: 3
title: Kedy Vybrať Ktorý
---

# Kedy Vybrať Ktorý

Nie otázka "lepšie" vs. "horšie" — kompromis medzi dvoma naozaj rôznymi architektonickými
voľbami (pozri [Architektonické Rozdiely](./architecture-differences.md)), každá so situáciami,
kde jasne vyhráva.

## Dôvody siahnuť po Docker

```text
- Vyspelosť ekosystému a čistá šírka toolingu/tutoriálov predpokladajúcich konkrétne Docker
- Tím/CI prostredie už na ňom štandardizované, s fungujúcim toolingom postaveným okolo
  Docker daemon API (Docker Desktop, rôzne IDE integrácie, niektoré interné CI runnera)
- `docker compose` Docker Compose je first-party, aktívne udržiavaná súčasť samotného Docker CLI
  — netreba sledovať samostatný nástroj
- Najširší cross-platform desktop zážitok (Docker Desktop na macOS/Windows) — Windows/macOS
  príbeh Podman bol historicky menej vyladený, aj keď sa zlepšil
```

## Dôvody siahnuť po Podman

```text
- Rootless-predvolene záleží na tvojom threat modeli — multi-tenant build servery, CI runnery
  spúšťajúce nedôveryhodný kód, alebo akékoľvek prostredie, kde "prístup ku kontajneru ≈ root
  prístup" je reálna obava (pozri Rootless Predvolene)
- Žiadny daemon, ktorý by bol jediným bodom zlyhania, alebo ktorý by musel bežať ako
  privilegovaná služba na pozadí vôbec
- Kubernetes je skutočný deployment cieľ — koncept pod a `podman generate kube` dávajú
  naozaj tesnejšiu local-to-cluster vývojársku slučku (pozri Koncept Pod a Podman Compose)
- Preferencia systemd-natívnej správy služieb pred druhým, kontajner-specifickým
  mechanizmom dohliadania (pozri Podman a systemd)
- Prostredia (niektoré enterprise Linux distribúcie), kde je Podman natívne
  podporovaný/preferovaný container engine
```

## Toto zvyčajne nie je trvalá, exkluzívna voľba

Keďže oba konzumujú rovnaké OCI image a do veľkej miery rovnakú Dockerfile/Compose syntax (pozri
[Kompatibilita a Migrácia](./compatibility-and-migration.md)), praktické rozhodnutie je často
užšie než "vyber jeden navždy":

```text
- Použi Podman lokálne na vývoj (rootless bezpečnostný benefit, žiadny daemon na správu)
  zatiaľ čo CI/produkcia zostáva na Docker, ak je to to, čo tam už funguje.
- Použi Docker tam, kde je jeho konkrétny ekosystém toolingu naozaj potrebný, Podman tam,
  kde konkrétne záleží na rootless prevádzke alebo Kubernetes-zarovnaní.
```

## Konkrétne pre túto organizáciu

Aktuálne produkčné nastavenie (pozri
[Nastavenie Kontajnerov Tejto Organizácie](/sk/study-materials/docker/production-practices/this-orgs-container-setup)
v téme Docker) beží Docker, na jednom VPS, necieli na Kubernetes — žiadny z najsilnejších
diferenciátorov Podman (rootless multi-tenant izolácia, Kubernetes pod zarovnanie) tu momentálne
nie je nosnou požiadavkou. Táto téma Podman existuje ako všeobecné vedomosti a férové porovnanie,
nie preto, že by bola plánovaná alebo potrebná migrácia — Docker zostáva správnym nástrojom pre
nastavenie, ktoré je dnes naozaj v produkcii.
