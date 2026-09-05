---
sidebar_position: 2
title: Podman Compose
---

# Podman Compose

Odpoveď Podman na [Docker Compose](/sk/study-materials/docker/docker-compose/compose-basics) —
plus jeden naozaj Podman-specifický trik: generovanie skutočného Kubernetes YAML priamo z
bežiaceho nastavenia.

## `podman-compose` — samostatný nástroj, rovnaký formát súboru

```bash
podman-compose up -d
podman-compose down
podman-compose logs -f web
```

`podman-compose` je **samostatný, komunitou udržiavaný nástroj** (nie vstavaný priamo v `podman`
tak, ako je teraz `docker compose` vstavaný v Docker CLI), ktorý číta rovnaký formát
`docker-compose.yml` a prekladá ho na ekvivalentné `podman` príkazy. V praxi väčšina existujúcich
Compose súborov funguje s malou alebo žiadnou úpravou — rovnaký tvar YAML pokrytý v
[Základy Compose](/sk/study-materials/docker/docker-compose/compose-basics) a
[Multi-Kontajnerové Appky](/sk/study-materials/docker/docker-compose/multi-container-apps) platí aj
tu.

```bash
# Novšie verzie Podman tiež podporujú natívnu compose podporu priamo:
podman compose up -d
```

Nedávne vydania Podman začali pridávať **natívnu** `podman compose` podporu (delegujúcu na
`podman-compose` alebo kompatibilnú implementáciu, ak je nainštalovaná) — oplatí sa skontrolovať
dokumentáciu nainštalovanej verzie, keďže táto oblasť sa aktívne približuje k správaniu
`docker compose`.

## Generovanie Kubernetes YAML — naozaj odlišná schopnosť

```bash
podman pod create --name my-app-pod -p 8080:8080
podman run -d --pod my-app-pod --name web my-web-image
podman run -d --pod my-app-pod --name sidecar my-sidecar-image

podman generate kube my-app-pod > my-app-pod.yaml
```

Toto vyprodukuje **skutočný, použiteľný Kubernetes YAML** popisujúci ten pod a jeho kontajnery —
nie aproximáciu, skutočné manifesty, ktoré `kubectl apply` vie skonzumovať. Docker Compose nemá
ekvivalentný príkaz; konverzia Compose súboru na Kubernetes manifesty zvyčajne vyžaduje samostatný
nástroj tretej strany (ako `kompose`), zatiaľ čo toto je plnohodnotná funkcia Podman, priamy
dôsledok toho, že [koncept pod](../01-basics/the-pod-concept.md) je od začiatku modelovaný podľa
Kubernetes podov.

```bash
podman play kube my-app-pod.yaml     # opačný smer: spusti Kubernetes YAML súbor lokálne, cez Podman
```

`podman play kube` vie ísť aj opačným smerom — vziať Kubernetes manifest a spustiť ho lokálne ako
pody/kontajnery, užitočné na testovanie konfigurácie viazanej na Kubernetes bez skutočného
clustra.

## Kedy na tomto naozaj záleží

Ak je skutočným deployment cieľom tímu Kubernetes, vývoj a testovanie lokálne s pod modelom
Podman — a schopnosť generovať skutočné manifesty priamo z toho, čo bolo testované lokálne — je
zmysluplne tesnejšia slučka než vývoj proti bridge-network modelu Docker Compose a dúfanie, že sa
prípadný preklad na Kubernetes bude správať ekvivalentne. Pre tím, ktorý necieli na Kubernetes
vôbec, táto konkrétna výhoda naozaj neplatí — pozri
[Kedy Vybrať Ktorý](../03-docker-vs-podman/when-to-choose-which.md) pre úplnejší obraz.
