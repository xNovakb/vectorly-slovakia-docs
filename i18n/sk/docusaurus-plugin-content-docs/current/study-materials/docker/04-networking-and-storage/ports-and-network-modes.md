---
sidebar_position: 1
title: Porty a Sieťové Režimy
---

# Porty a Sieťové Režimy

Pre model zdieľanej bridge siete, ktorý táto organizácia naozaj používa v produkcii (`proxy-net`,
kontajnery sa navzájom dosahujú podľa mena), pozri
[Základy Docker Networkingu](/sk/study-materials/networking/practical-setups/docker-networking-basics)
v téme Siete — táto stránka pokrýva mechaniku publikovania portov a sieťových režimov pod tým.

## Publikovanie portu

```bash
docker run -p 8080:80 nginx
```

`-p HOST:CONTAINER` mapuje port na **hostiteľovi** na port **vnútri kontajnera**. Bez `-p` je port
kontajnera dostupný iným kontajnerom na tej istej Docker sieti (pozri nižšie), ale vôbec nie z
hostiteľského počítača ani z internetu.

```bash
docker run -p 127.0.0.1:8080:80 nginx      # dostupné len z hostiteľa samotného, nie zo siete
docker run -p 8080:80 -p 8443:443 nginx      # publikuj viacero portov
docker run -P nginx                            # publikuj KAŽDÝ exponovaný port na náhodné porty hostiteľa
```

## Tri vstavané sieťové režimy

```bash
docker run --network bridge nginx     # predvolené — izolovaná virtuálna sieť, kontajnery sa dosahujú podľa mena
docker run --network host nginx         # žiadna izolácia — kontajner priamo zdieľa sieťový stack hostiteľa
docker run --network none nginx           # žiadny networking vôbec
```

### `bridge` — predvolené, a zvyčajne správna voľba

Kontajnery dostanú vlastnú IP na súkromnej virtuálnej sieti; dosiahnutie zvonku vyžaduje
explicitné publikovanie cez `-p`. Kontajnery na **rovnakej** bridge sieti sa navzájom dosahujú
**podľa mena kontajnera** bez akéhokoľvek publikovania vôbec — presne toto je mechanizmus, ktorý
[Základy Docker Networkingu](/sk/study-materials/networking/practical-setups/docker-networking-basics)
pokrýva pre `proxy-net` tejto organizácie.

### `host` — žiadna izolácia, priamy prístup k sieti hostiteľa

```bash
docker run --network host nginx
```

Kontajner priamo používa sieťové rozhrania hostiteľa — netreba mapovanie portov, ale aj žiadna
sieťová izolácia vôbec. Rýchlejšie (preskočí réžiu prekladu siete bridge), ale stráca jednu z
hlavných výhod kontajnerizácie na začiatku; všeobecne vyhradené pre prípady, kde na tejto réžii
naozaj záleží, nie predvolená voľba.

### `none` — plne izolované

```bash
docker run --network none alpine echo hi
```

Žiadny sieťový prístup vôbec — užitočné pre job, ktorý naozaj nemá mať možnosť dosiahnuť sieť
vôbec (čisto výpočtová úloha, alebo zámerne sandboxovaný proces).

## Vlastné siete — nad rámec predvolenej `bridge`

```bash
docker network create my-app-net
docker run --network my-app-net --name api my-api-image
docker run --network my-app-net --name db postgres
```

Kontajner na `my-app-net` dosiahne `db` podľa tohto mena, vďaka vstavanému Docker DNS pre vlastné
siete — *predvolená* `bridge` sieť toto rozlišovanie mien neposkytuje, čo je časť dôvodu, prečo
väčšina reálnych nastavení (vrátane `proxy-net` tejto organizácie) vytvára pomenovanú vlastnú
sieť namiesto spoliehania sa na predvolenú.

## Kontrola, čo je naozaj publikované

```bash
docker port my-app                # aké porty sú publikované, a kam
docker inspect my-app --format '{{.NetworkSettings.Ports}}'
```
