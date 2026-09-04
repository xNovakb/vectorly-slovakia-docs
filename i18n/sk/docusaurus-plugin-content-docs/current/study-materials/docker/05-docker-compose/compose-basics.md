---
sidebar_position: 1
title: Základy Compose
---

# Základy Compose

Spustenie jedného kontajnera je jeden príkaz `docker run`. Spustenie appky zloženej z viacerých
kontajnerov — webová appka, databáza, reverse proxy — sa rýchlo zmení na dlhý zoznam príkazov na
zapamätanie a spustenie v správnom poradí. **Docker Compose** to nahradí jedným deklaratívnym
YAML súborom.

## Minimálny `docker-compose.yml`

```yaml title="docker-compose.yml"
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:16
    volumes:
      - pg-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=devpassword

volumes:
  pg-data:
```

Každá položka pod `services:` je zhruba hodnota konfigurácie jedného príkazu `docker run`,
deklarovaná namiesto napísaná — `build: .` je kombinácia `docker build` + `docker run`, samotné
`image:` len stiahne a spustí existujúci image.

## Základné príkazy

```bash
docker compose up            # vybuduj (ak treba) a spusti každú službu, pripojený k logom
docker compose up -d           # to isté, ale detached (na pozadí)
docker compose down              # zastav a odstráň kontajnery každej služby
docker compose down -v             # odstráň aj volumes — ZNIČÍ akékoľvek dáta v nich
docker compose ps                    # vypíš kontajnery tohto projektu a ich stav
docker compose logs -f web             # sleduj logy len jednej služby
```

:::warning
`docker compose down -v` odstráni volumes spolu s kontajnermi — pri projekte s databázovou
službou toto zmaže jej dáta (pozri
[Perzistencia Dát](../04-networking-and-storage/data-persistence.md)). Obyčajné
`docker compose down` (bez `-v`) je bezpečná predvoľba; `-v` pridaj len keď naozaj chceš všetko
vymazať.
:::

## Rebuild po zmene kódu

```bash
docker compose up -d --build      # rebuildni image pred spustením, potom (znovu)spusti
```

Toto je presný príkaz za deploy krokom tejto organizácie — pozri
[Compose vo Vlastnom Deploy Tejto Organizácie](./compose-in-this-orgs-deploy.md) pre reálne
použitie.

## Prečo deklaratívne poráža shell skript `docker run` príkazov

- **Jeden zdroj pravdy** — tvar celej appky (služby, siete, volumes, env) žije v jednom
  recenzovateľnom súbore, nie roztrúsený naprieč imperatívnymi príkazmi alebo niekoho pamäťou.
- **Konzistentný networking** — každá služba v jednom `docker-compose.yml` je automaticky
  umiestnená na zdieľanú sieť, dostupná podľa mena služby, bez ručného vytvorenia a pripojenia
  vlastnej siete, ako to vyžaduje obyčajné `docker run` (pozri
  [Porty a Sieťové Režimy](../04-networking-and-storage/ports-and-network-modes.md)).
- **Reprodukovateľné** — ktokoľvek s repozitárom a nainštalovaným Dockerom vie spustiť presne tú
  istú sadu služieb jedným príkazom, netreba tajné znalosti "spusti týchto päť `docker run`
  príkazov v tomto poradí."

## `docker-compose` vs. `docker compose`

```bash
docker-compose up      # staršia, samostatná Python nástroj (v1), teraz deprecated
docker compose up        # moderná, vstavaná priamo v Docker CLI (v2) — aktuálny štandard
```

Verzia oddelená medzerou `docker compose` (bez pomlčky) je aktuálna, aktívne udržiavaná verzia,
vstavaná priamo v Dockeri samotnom namiesto samostatného nástroja na inštaláciu — oplatí sa
vedieť, keďže obe formy sa stále objavujú v starších tutoriáloch a existujúcich skriptoch.
