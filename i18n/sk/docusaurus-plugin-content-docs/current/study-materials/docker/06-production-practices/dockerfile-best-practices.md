---
sidebar_position: 1
title: Dockerfile Best Practices
---

# Dockerfile Best Practices

Vzory, ktoré oddeľujú Dockerfile, ktorý len funguje, od takého, ktorý je malý, rýchly na build, a
bezpečný na beh v produkcii.

## Multi-stage buildy

Jednoznačne najúčinnejšia technika: buduj v jednej fáze (so všetkými kompilátormi, dev
závislosťami, build nástrojmi, ktoré potrebuješ), potom skopíruj len *výstup* do čistej,
minimálnej finálnej fázy.

```dockerfile title="Single-stage — odošle celý build toolchain"
FROM node:22
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["node", "dist/server.js"]
```

```dockerfile title="Multi-stage — odošle len to, čo je potrebné za behu"
FROM node:22 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]
```

Finálny image obsahuje len `alpine`-based runtime a vybudovaný výstup — žiadne dev závislosti,
build nástroje, ani zdrojové súbory z fázy `builder`. Toto pravidelne zníži veľkosť finálneho
image 5-10x pri kompilovaných/bundlovaných appkách, s nulovou zmenou toho, čo appka za behu
skutočne robí.

## Minimalizácia vrstiev a veľkosti image

```dockerfile
❌ RUN apt-get update
   RUN apt-get install -y curl
   RUN rm -rf /var/lib/apt/lists/*

✅ RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
```

Každý `RUN` je samostatná vrstva (pozri
[Vrstvy Image a Caching](../02-images-and-dockerfiles/image-layers-and-caching.md)) — rozdelenie
cleanup kroku (`rm -rf /var/lib/apt/lists/*`) do vlastného `RUN` v skutočnosti image nezmenší,
lebo súbory stále existujú v *skoršej* vrstve; len skombinovanie install-a-cleanup do jedného
`RUN` (jednej vrstvy) ich naozaj odstráni z finálneho image.

## Nebehaj ako root vnútri kontajnera

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install

USER node          # prepni na non-root používateľa pre všetko odtiaľto ďalej
CMD ["node", "server.js"]
```

Predvolene proces kontajnera beží ako root **vnútri kontajnera** — nie to isté ako root na
hostiteľovi, ale stále zmysluplne väčšia útočná plocha než non-root proces, najmä v kombinácii s
container-escape zraniteľnosťou. Mnoho oficiálnych image (ako `node`) už dodáva non-root
používateľa (`node`) pripraveného na prepnutie cez `USER`.

## Pripni verzie základných image

```dockerfile
❌ FROM node:latest
✅ FROM node:22.11.0-alpine
```

`node:latest` sa potichu mení v čase — rebuild o mesiace neskôr môže stiahnuť úplne inú major
verziu Node bez akejkoľvek zmeny kódu na tvojej strane, klasický zdroj buildov "včera to
fungovalo." Rovnaká opatrnosť s tagom `latest`, ako je pokrytá v
[Budovanie a Tagovanie Image](../02-images-and-dockerfiles/building-and-tagging-images.md),
aplikovaná konkrétne na základné image.

## Zoraď inštrukcie podľa frekvencie zmien

Podrobne pokryté v
[Vrstvy Image a Caching](../02-images-and-dockerfiles/image-layers-and-caching.md) — daj
zriedka sa meniace inštrukcie (`FROM`, inštalácia závislostí) skoro, často sa meniace
(`COPY . .` pre kód appky) na koniec, aby sa build cache naozaj použila pri väčšine rebuildov.

## Používaj `.dockerignore` agresívne

```text title=".dockerignore"
node_modules
.git
.env
*.md
Dockerfile
.dockerignore
```

Nad rámec rýchlosti buildu (pozri
[Základy Dockerfile](../02-images-and-dockerfiles/dockerfile-basics.md)) toto zabráni náhodnému
odoslaniu histórie `.git`, lokálnych `.env` súborov, alebo iných súborov, ktoré nikdy nemali
opustiť tvoj počítač, vnútri finálneho image.
