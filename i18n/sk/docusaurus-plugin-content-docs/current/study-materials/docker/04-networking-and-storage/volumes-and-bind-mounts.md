---
sidebar_position: 2
title: Volumes a Bind Mounts
---

# Volumes a Bind Mounts

Dva rôzne spôsoby, ako dať kontajneru prístup k dátam, ktoré žijú mimo jeho vlastnej
zapisovateľnej vrstvy — podobný povrch, naozaj rôzne use casy.

## Named volumes — úložisko spravované Dockerom

```bash
docker volume create app-data
docker run -v app-data:/var/lib/postgresql/data postgres
```

Docker spravuje, kde volume naozaj žije na disku (typicky pod `/var/lib/docker/volumes/`) — nemusíš
poznať ani sa starať o presnú cestu na hostiteľovi. Volume pretrváva nezávisle od akéhokoľvek
kontajnera, a dá sa pripojiť k novému kontajneru aj po odstránení pôvodného.

```bash
docker volume ls                    # vypíš všetky volumes
docker volume inspect app-data        # kde naozaj žije na disku, a čo ho používa
docker volume rm app-data               # zmaž ho — len ak ho nič aktuálne nepoužíva
```

## Bind mounts — konkrétna cesta na hostiteľovi, priamo

```bash
docker run -v /home/deploy/app-config:/etc/app/config nginx
docker run -v "$(pwd)":/app node:22    # bežné v lokálnom vývoji: pripoj aktuálny priečinok projektu
```

Mapuje **konkrétnu, známu cestu na hostiteľovi** priamo do kontajnera. Na rozdiel od named volume,
ty (nie Docker) vyberáš presne kde na súborovom systéme hostiteľa dáta žijú — užitočné, keď
konkrétne potrebuješ pristupovať alebo upravovať tie súbory priamo z hostiteľa, nie len zvnútra
kontajnera.

## Named volume vs. bind mount, vedľa seba

| | Named volume | Bind mount |
|---|---|---|
| Cesta na hostiteľovi | Spravovaná Dockerom, nepriehľadná | Ty vyberáš presnú cestu |
| Prenositeľné naprieč hostiteľmi | Áno (na názve volume záleží) | Nie (predpokladá, že táto presná cesta hostiteľa existuje) |
| Dobré pre | Produkčné dáta (databázy, nahrané súbory) | Lokálny vývoj (live-editovanie zdrojového kódu), config súbory so známou lokáciou na hostiteľovi |
| Priamo editovateľné z hostiteľa | Nepohodlné — musel by si nájsť internú cestu Dockeru | Triviálne — je to len obyčajná cesta na hostiteľovi |

## Vzor lokálneho vývoja: bind-mountovanie zdrojového kódu

```bash
docker run -v "$(pwd)":/app -p 3000:3000 node:22 npm run dev
```

Pripojenie priečinka projektu znamená, že zmeny urobené v tvojom editore (na hostiteľovi) sú
okamžite viditeľné vnútri kontajnera, bez rebuildovania image — takto väčšina lokálnych dev
nastavení dosiahne live-reload s kontajnerizovanou appkou, a je to konkrétne **vývojársky** vzor,
nie niečo použité v produkčnom nastavení pokrytom v
[Nastavenie Kontajnerov Tejto Organizácie](../06-production-practices/this-orgs-container-setup.md)
(produkčné kontajnery bežia skutočný vybudovaný image, nie live-mountovaný zdrojový strom).

## Anonymné volumes — subtílnejšia tretia možnosť

```dockerfile
VOLUME /var/lib/mysql
```

Inštrukcia `VOLUME` v Dockerfile automaticky vytvorí anonymný volume pri štarte kontajnera, ak nič
iné nie je pripojené na tejto ceste — bežne vidno v oficiálnych image databáz na zabezpečenie, že
dáta potichu nežijú len v efemérnej zapisovateľnej vrstve, aj keby ten, kto kontajner spúšťa,
zabudol sám pripojiť named volume.

:::warning
Odstránenie kontajnera cez `docker rm` predvolene **neodstráni** volumes, ktoré mal pripojené —
vrátane anonymných, pokiaľ nepridáš `-v` k `docker rm`. Toto je zvyčajne správna predvoľba (dáta
prežijú kontajner), ale anonymné volumes z opakovane znovuvytváraných kontajnerov môžu potichu
nahromadiť diskové využitie v priebehu času, ak sa nikdy nevyčistia (`docker volume prune`
odstráni nepoužívané).
:::
