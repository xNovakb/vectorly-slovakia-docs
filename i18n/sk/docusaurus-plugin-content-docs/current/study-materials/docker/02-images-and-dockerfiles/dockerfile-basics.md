---
sidebar_position: 1
title: Základy Dockerfile
---

# Základy Dockerfile

**Dockerfile** je čisto textový recept na vybudovanie image — sekvencia inštrukcií, každá pridáva
vrstvu (pozri [Vrstvy Image a Caching](./image-layers-and-caching.md)).

## Základné inštrukcie

```dockerfile title="Dockerfile"
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
```

- **`FROM`** — základný image, na ktorom sa stavia všetko ostatné. Takmer každý Dockerfile tu
  začína; `node:22-alpine` znamená "začni od existujúceho image, ktorý už má nainštalovaný Node
  22, na minimálnom Alpine Linux základe."
- **`WORKDIR`** — nastaví pracovný priečinok pre každú inštrukciu za ním — ako `cd`, ale zapečené
  do buildu image.
- **`COPY`** — skopíruje súbory z build kontextu (tvoj lokálny projekt) do image.
- **`RUN`** — spustí príkaz *počas buildu*, a commitne výsledok ako novú vrstvu (napr. inštalácia
  závislostí).
- **`EXPOSE`** — zdokumentuje, na akom porte kontajner počúva. Čisto informačné — v skutočnosti
  port nepublikuje (pozri
  [Porty a Sieťové Režimy](../04-networking-and-storage/ports-and-network-modes.md), čo naozaj
  publikuje).
- **`CMD`** — predvolený príkaz spustený, keď kontajner z tohto image štartuje. Prepísateľné pri
  `docker run`; nespúšťa sa počas samotného buildu.

## `COPY package*.json ./` pred `COPY . .` — prečo tento split

Toto poradie nie je náhodné — je to zámerné použitie layer cachingu:

```dockerfile
COPY package*.json ./
RUN npm install
COPY . .
```

Ak sa zmení len kód appky (nie `package.json`), Docker vie znovupoužiť cachovanú vrstvu
`npm install` namiesto jej opätovného spustenia — lebo cache key vrstvy je založený na jej
vstupoch, a `package*.json` sa nezmenil. Obrátenie poradia (`COPY . .` pred `npm install`)
invaliduje install-vrstvu cache pri *každej* zmene kódu, keďže celá appka je teraz súčasťou
vstupu tejto vrstvy. Pozri [Vrstvy Image a Caching](./image-layers-and-caching.md) pre presne to,
prečo to funguje.

## `CMD` vs. `RUN` — bežná zámena

```dockerfile
RUN npm install        # spustí sa RAZ, počas buildu — jeho výstup sa stane súčasťou image
CMD ["node", "server.js"]   # spustí sa VŽDY, keď kontajner z tohto image štartuje
```

Umiestnenie `npm install` do `CMD` namiesto `RUN` by znamenalo, že inštalácia sa deje pri každom
štarte kontajnera namiesto raz pri builde — pomalšie, a poráža účel zapečenia závislostí do image
na začiatku.

## `.dockerignore`

```text title=".dockerignore"
node_modules
.git
.env
*.log
```

Rovnaká myšlienka ako `.gitignore` — vylúči súbory z build kontextu posielaného Docker daemonu.
Bez neho sa môže náhodný lokálny `node_modules` skopírovať do image (nafúkne ho, a potenciálne
odošle platform-specific binárky vybudované pre tvoj počítač, nie OS image) alebo jednoducho
spomalí build posielaním zbytočných súborov.

## Budovanie z tohto Dockerfile

```bash
docker build -t my-app:latest .
```

Podrobne pokryté v [Budovanie a Tagovanie Image](./building-and-tagging-images.md).
