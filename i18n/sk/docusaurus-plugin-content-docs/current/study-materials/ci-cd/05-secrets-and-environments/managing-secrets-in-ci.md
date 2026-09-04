---
sidebar_position: 1
title: Správa Secretov v CI
---

# Správa Secretov v CI

Pipeline rutinne potrebuje credentials — API kľúč, deploy kľúč, heslo do databázy — aby naozaj
zvládla svoju prácu. Bezpečné zaobchádzanie s nimi je samostatná záležitosť od všetkého ostatného
o návrhu pipeline.

## Prečo secrety nepatria do samotného YAML pipeline

```yaml
❌ jobs:
     deploy:
       steps:
         - run: curl -H "Authorization: Bearer sk_live_abc123..." https://api.example.com/deploy
```

Konfiguračný súbor pipeline žije v repozitári — ktokoľvek s read prístupom k repozitáru (a jeho
plnou históriou git, navždy) vie prečítať secret natvrdo zakódovaný tu. Toto je presne ten istý
princíp pokrytý pre [Docker image](/sk/study-materials/docker/running-containers/environment-and-secrets):
nikdy nezapeč skutočný credential do niečoho, čo sa ukladá/zdieľa/verzuje.

## Úložiská secretov CI — skutočný mechanizmus

```yaml
jobs:
  deploy:
    steps:
      - run: curl -H "Authorization: Bearer ${{ secrets.DEPLOY_TOKEN }}" https://api.example.com/deploy
```

Každá väčšia CI platforma poskytuje šifrované úložisko secretov, samostatné od samotného
repozitára — secrety sa konfigurujú cez UI/API platformy, odkazuje sa na ne podľa mena v
konfigurácii pipeline, a vkladajú sa ako premenné prostredia (alebo ekvivalent) **len za behu**,
nikdy nezapísané do konfiguračného súboru ani do histórie repozitára.

## Automatické maskovanie logov

```text
$ curl -H "Authorization: Bearer ***" https://api.example.com/deploy
```

Väčšina platforiem automaticky zistí, keď by sa v log výstupe objavila známa hodnota secretu, a
nahradí ju `***` (alebo podobne) pred zobrazením logov — reálna bezpečnostná sieť, ale nie
absolútna garancia:

:::warning
Maskovanie logov väčšinou zachytí len **presný** reťazec secretu objavujúci sa doslovne. Secret,
ktorý bol najprv transformovaný (base64-enkódovaný, spojený s iným textom, rozdelený naprieč
viacerými log riadkami), môže stále unikať cez maskovanie, ktoré len pattern-matchuje doslovnú
hodnotu. Nikdy zámerne `echo`/vypisuj secret "len na debug" — aj s aktívnym maskovaním sa tomuto
zvyku úplne oplatí vyhnúť.
:::

## Secrety vs. obyčajná konfigurácia

```text
Obyčajná konfigurácia (fajn commitnúť):    NODE_ENV, base URL API, feature flagy, log level
Secrety (nikdy necommituj, použi
  úložisko secretov):                        API kľúče, heslá databázy, deploy credentials, tokeny
```

Nie všetko, čo pipeline potrebuje, je citlivé — nadmerné zaobchádzanie s bežnou konfiguráciou ako
so secretom len pridáva trenie (potreba prístupu k platforme na zmenu necitlivej hodnoty) bez
pridania skutočnej bezpečnosti.

## Least privilege platí aj tu

To, že *hodnota* secretu je chránená, neznamená, že jeho *rozsah* je automaticky primeraný — pozri
[Credentials s Najmenším Oprávnením](./least-privilege-credentials.md) pre scoping toho, k čomu
daný secret naozaj má prístup, čo záleží nezávisle od toho, ako dobre je chránená samotná hodnota.

## Rotácia secretov

Secret, ktorý sa v pipeline používa roky bez toho, aby bol niekedy rotovaný, je väčšie riziko než
ten pravidelne rotovaný — ak niekedy unikne (zle nakonfigurovaný log, kompromitovaný runner), okno
expozície pre nerotovaný dlhodobý secret je neobmedzené. Zaobchádzanie s rotáciou secretov ako s
rutinnou, naplánovanou praxou namiesto reakcie len na núdzové situácie je časťou toho, čo robí
zaobchádzanie s credentials pipeline naozaj bezpečným v čase, nie len bezpečným na papieri.
