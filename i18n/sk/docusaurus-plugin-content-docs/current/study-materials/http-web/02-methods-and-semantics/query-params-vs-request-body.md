---
sidebar_position: 3
title: Query Parametre vs. Telo Požiadavky
---

# Query Parametre vs. Telo Požiadavky

Dve rôzne miesta, kam môžu dáta s požiadavkou cestovať — kam patria, nie je len štýlová
preferencia, každé má reálne, odlišné obmedzenia.

## Query parametre

```
GET /articles?category=tech&sort=recent&page=2
```

Pripojené k URL za `?`, `key=value` páry spojené `&`. Súčasť samotnej URL.

- Viditeľné v histórii prehliadača, prístupových logoch servera, a akomkoľvek nástroji, ktorý
  loguje URL — **nikdy** sem nedávaj secrety alebo citlivé dáta (API kľúč alebo heslo v query
  stringu skončí zalogovaný v čistom texte na oveľa viac miestach, než by kedy skončilo telo).
- Má praktické limity dĺžky (líšia sa podľa prehliadača/servera, ale URL nemôžu rásť
  neobmedzene).
- Prirodzene sa hodí pre `GET` požiadavky, ktoré konvenčne nemajú telo vôbec — pozri
  [HTTP Metódy](./http-methods.md).
- Dá sa dať do záložiek a zdieľať, keďže je súčasťou URL — toto je funkcia, nie len obmedzenie,
  pre veci ako stav vyhľadávania/filtra.

## Telo požiadavky

```http
POST /articles HTTP/1.1
Content-Type: application/json

{"title": "Hello World", "category": "tech"}
```

- Nie je súčasťou URL — neobjaví sa v histórii prehliadača ani typických prístupových logoch
  rovnakým spôsobom.
- Žiadny praktický limit veľkosti, ktorý by vynucoval samotný protokol (servery/frameworky
  nastavujú vlastné limity).
- Štandard pre `POST`/`PUT`/`PATCH` — posielanie skutočných dát, ktoré sa vytvárajú/aktualizujú.
- Nedá sa dať do záložiek — dáta existujú len pre tú jednu požiadavku.

## Pravidlo palca

| Použi... | Pre |
|---|---|
| Query parametre | Filtrovanie, triedenie, stránkovanie, hľadané výrazy — čokoľvek, čo identifikuje *ktorý* zdroj(e) chceš |
| Telo požiadavky | Skutočné dáta, ktoré sa vytvárajú alebo aktualizujú |
| Path segmenty | Identifikácia *jedného konkrétneho* zdroja (`/users/42`, nie `/users?id=42`) |

```bash
# identifikácia zdroja: path segment
GET /users/42

# filtrovanie kolekcie: query parametre
GET /users?role=admin&active=true

# vytváranie/aktualizácia dát: telo
POST /users
Content-Type: application/json

{"name": "Jane", "role": "admin"}
```

:::warning
Nikdy neposielaj credentials, tokeny, alebo akúkoľvek citlivú hodnotu ako query parameter. Okrem
vystavenia v logoch, URL s tokenom v nej môže uniknúť cez hlavičku `Referer`, keď stránka s tou
URL naviguje na stránku tretej strany, alebo cez autocomplete/sync histórie prehliadača — nič z
toho neplatí pre telo požiadavky.
:::

## Path segment vs. query parameter — bežné rozhodnutie

`GET /users/42` (path) vs. `GET /users?id=42` (query) oboje technicky fungujú — konvencia je:
použi path segment, keď identifikuje *jeden konkrétny zdroj*, a query parameter, keď filtruje/
upravuje *kolekciu*. Toto rozlíšenie má väčší význam pri návrhu reálneho API — pozri
[Návrh Dobrého API](../05-rest-and-api-design/designing-a-good-api.md).
