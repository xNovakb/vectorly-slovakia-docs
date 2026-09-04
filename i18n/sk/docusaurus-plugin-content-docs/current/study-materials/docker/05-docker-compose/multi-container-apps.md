---
sidebar_position: 2
title: Multi-Kontajnerové Appky
---

# Multi-Kontajnerové Appky

Reálna appka je zriedka jeden kontajner — typický tvar rozdelí zodpovednosti naprieč viacerými,
zloženými dokopy.

## Kompletnejší príklad

```yaml title="docker-compose.yml"
services:
  api:
    build: ./api
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache

  worker:
    build: ./api          # rovnaký image ako api, iný príkaz — background job processor
    command: node worker.js
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres:16
    volumes:
      - pg-data:/var/lib/postgresql/data

  cache:
    image: redis:7

volumes:
  pg-data:
```

Všimni si, že `api` a `worker` sa pripájajú k databáze pomocou hostname `db`, nie IP adresy alebo
`localhost` — automatický networking Compose (pozri [Základy Compose](./compose-basics.md))
automaticky rozlíši mená služieb na správny kontajner, rovnaký vstavaný DNS mechanizmus pokrytý v
[Porty a Sieťové Režimy](../04-networking-and-storage/ports-and-network-modes.md) pre vlastné
Docker siete všeobecne.

## `depends_on` — čo naozaj garantuje, a čo nie

```yaml
services:
  api:
    depends_on:
      - db
```

`depends_on` riadi **poradie štartu** — Docker spustí `db` pred spustením `api`. **Nečaká**, kým
`db` naozaj bude *pripravený* prijímať pripojenia, len kým jeho proces kontajnera naštartuje.
Databázový kontajner môže po spustení chvíľu trvať, kým naozaj začne prijímať pripojenia — `api`
sa môže spustiť a okamžite zlyhať pripojenie, ak túto medzeru sám neošetrí.

```yaml
services:
  api:
    depends_on:
      db:
        condition: service_healthy    # čakaj na skutočný healthcheck db, nie len "spustený"
  db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5
```

`condition: service_healthy` je skutočná oprava — čaká na to, kým vlastný
[healthcheck](../06-production-practices/health-checks-and-restart-policies.md) závislosti
nenahlási healthy, nie len "proces sa spustil." Bez toho dobre napísaná appka väčšinou stále
potrebuje vlastnú retry-on-connect logiku, keďže "kontajner sa spustil" a "pripravený obsluhovať
prevádzku" sú naozaj rôzne momenty.

## Škálovanie jednej služby

```bash
docker compose up -d --scale worker=3
```

Spustí tri inštancie služby `worker` súčasne — užitočné pre background job processor, ktorý
profituje z paralelizmu. Nedáva zmysel pre každú službu (služba viazaná na pevný port hostiteľa
cez `ports:` nemôže mať viacero inštancií súťažiacich o rovnaký port hostiteľa bez dodatočnej
konfigurácie).

## Prepisovanie konfigurácie podľa prostredia

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Compose zlúči viacero súborov v poradí — bežný vzor je základný `docker-compose.yml` so
zdieľanou konfiguráciou, plus `docker-compose.prod.yml` (alebo `.dev.yml`) prepisujúci len to, čo
sa líši podľa prostredia (rôzne hodnoty `environment:`, rôzne `ports:`, či sú volumes
bind-mountnuté pre live-reload).
