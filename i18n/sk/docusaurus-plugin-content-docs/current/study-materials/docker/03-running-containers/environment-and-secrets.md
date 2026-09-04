---
sidebar_position: 3
title: Prostredie a Secrety
---

# Prostredie a Secrety

Odovzdávanie konfigurácie do kontajnera bez jej zapečenia do image — rovnaký mechanizmus
premenných prostredia všeobecne pokrytý v
[Premenné Prostredia a PATH](/sk/study-materials/linux-shell/practical-shell/environment-variables-and-path)
v téme Linux & Shell, aplikovaný konkrétne na kontajnery.

## Nastavenie premenných prostredia

```bash
docker run -e NODE_ENV=production -e PORT=3000 my-app
```

```bash title=".env"
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://user:pass@db:5432/mydb
```

```bash
docker run --env-file .env my-app
```

`--env-file` číta obyčajný súbor `KEY=VALUE` — oveľa lepšie spravovateľné než dlhý zoznam `-e`
flagov, akonáhle je premenných viac ako pár.

## Prečo premenné prostredia, nie zapečené do image

```dockerfile
❌ ENV DATABASE_URL=postgres://user:realpassword@db:5432/mydb   # zapečené do image, v každej vrstve, navždy
```

Čokoľvek nastavené cez `ENV` v Dockerfile sa stane súčasťou **samotného image** — viditeľné
komukoľvek, kto vie `docker inspect` alebo pull-núť ten image, a natrvalo vložené do jeho histórie
vrstiev, aj keď to *neskoršia* vrstva prepíše. Odovzdanie konfigurácie pri `docker run` namiesto
toho udrží image všeobecný a znovupoužiteľný naprieč prostrediami (dev, staging, produkcia) bez
rebuildovania, a udrží secrety úplne mimo image.

:::danger
Nikdy nedávaj skutočný secret (heslo, API kľúč, token) do inštrukcie `ENV` alebo `ARG` Dockerfile,
alebo do `RUN` príkazov, ktoré ho echo-ujú. Docker image sa bežne pushujú do registry, a aj
hodnota neskôr prepísaná inou vrstvou je stále vydolovateľná z histórie vrstiev image — toto je
presne ten istý princíp hygieny secretov ako nikdy necommitovať secret do gitu, len pre vrstvy
image namiesto commitov.
:::

## Secrety konkrétne — nad rámec obyčajných env premenných

Obyčajné premenné prostredia sú viditeľné čokoľvek, čo vie inšpektovať kontajner (`docker
inspect`, `/proc/<pid>/environ` zvnútra kontajnera) — akceptovateľné pre väčšinu necitlivej
konfigurácie, ale nie ideálne pre naozaj citlivé secrety v produkčnom nastavení.

```bash
# Docker Compose secrety — pripojené ako súbory, nie premenné prostredia
docker compose config    # ukáže vyriešenú konfiguráciu, užitočné na potvrdenie, čo je naozaj nastavené
```

```yaml title="docker-compose.yml"
services:
  app:
    image: my-app
    secrets:
      - db_password

secrets:
  db_password:
    file: ./db_password.txt
```

Toto pripojí secret ako **súbor** vnútri kontajnera (typicky pod `/run/secrets/`) namiesto
premennej prostredia — zmysluplne menšia expozičná plocha, keďže sa neobjaví vo výpise prostredia
`docker inspect` ani sa automaticky nezdedí detskými procesmi tak, ako env premenné.

## Praktické vrstvenie konfigurácie

```text
Dockerfile ENV       — bezpečné predvoľby, nikdy secrety (napr. ENV PORT=3000)
docker run -e / --env-file  — per-environment, necitlivá konfigurácia (NODE_ENV, feature flagy)
Compose secrety / skutočný secrets manager  — čokoľvek naozaj citlivé (heslá, API kľúče, tokeny)
```

Rovnaký princíp vrstvenia, aký používajú CI/CD pipeliny pre deploy secrety (napr. ako tento
repozitár používa dedikovaný SSH deploy kľúč) — nikdy v samotnom artefakte, vždy vložené za behu
z niečoho mimo verzovacieho systému.
