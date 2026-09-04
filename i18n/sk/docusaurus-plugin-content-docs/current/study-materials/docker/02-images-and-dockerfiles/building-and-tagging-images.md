---
sidebar_position: 2
title: Budovanie a Tagovanie Image
---

# Budovanie a Tagovanie Image

## Budovanie

```bash
docker build -t my-app:latest .
```

- `-t my-app:latest` — otaguje výsledný image menom (`my-app`) a tagom (`latest`).
- `.` — **build kontext**: priečinok poslaný Docker daemonu, na ktorý sa vedia odkazovať
  inštrukcie `COPY`/`ADD` Dockerfile. Všetko v tomto priečinku (mínus to, čo vylúči
  `.dockerignore`) sa pošle, aj súbory, ktoré Dockerfile nikdy naozaj neskopíruje — veľký build
  kontext spomaľuje každý build, čo je ďalší dôvod, prečo na `.dockerignore` záleží (pozri
  [Základy Dockerfile](./dockerfile-basics.md)).

```bash
docker build -f Dockerfile.prod -t my-app:latest .    # použi inak pomenovaný Dockerfile
```

## Tagy — čo naozaj sú

Tag je len ľudsky prívetivé označenie ukazujúce na konkrétny image (interne identifikovaný
content hashom). Nič nebráni tomu, aby *ten istý* tag neskôr ukazoval na *iný* image — pushnutie
nového buildu otagovaného `latest` nevytvorí nový tag, presunie existujúce označenie `latest`,
aby ukazovalo na nový image.

```bash
docker build -t my-app:1.2.0 .
docker build -t my-app:latest .          # samostatný tag, môže ukazovať na rovnaký alebo iný build
docker tag my-app:1.2.0 my-app:stable      # pridaj ďalší tag k image, ktorý už existuje
```

:::warning
`latest` je len tag, nie automaticky "najnovšia verzia" v žiadnom vynucovanom zmysle — build
otagovaný `latest` spred týždňa je stále `latest`, kým ho niečo znovu neotaguje. Spoliehanie sa na
`latest` v produkcii je bežný zdroj zmätku "ktorá verzia naozaj beží"; konkrétny tag verzie (alebo
lepšie, content-addressed digest) je bezpečnejší pre čokoľvek nad rámec lokálneho vývoja.
:::

## Pushnutie do registry

```bash
docker tag my-app:1.2.0 ghcr.io/example/my-app:1.2.0     # otaguj pre konkrétnu registry
docker push ghcr.io/example/my-app:1.2.0                    # nahraj ho
```

Registry (Docker Hub, GitHub Container Registry, súkromná) je, kde image naozaj žijú, aby ich iné
počítače — produkčný server, CI runner — mohli `docker pull`-núť namiesto opätovného buildovania
zo zdroja zakaždým.

```bash
docker pull ghcr.io/example/my-app:1.2.0
```

## Realistická sekvencia build → tag → push

```bash
docker build -t my-app:1.2.0 .
docker tag my-app:1.2.0 ghcr.io/example/my-app:1.2.0
docker tag my-app:1.2.0 ghcr.io/example/my-app:latest
docker push ghcr.io/example/my-app:1.2.0
docker push ghcr.io/example/my-app:latest
```

## Inšpekcia toho, čo je vybudované

```bash
docker images                       # každý image na tomto počítači
docker image inspect my-app:1.2.0     # plné metadáta: vrstvy, env, exponované porty, entrypoint
docker history my-app:1.2.0            # každá vrstva, a jej veľkosť — užitočné na nájdenie, čo nafukuje image
```
