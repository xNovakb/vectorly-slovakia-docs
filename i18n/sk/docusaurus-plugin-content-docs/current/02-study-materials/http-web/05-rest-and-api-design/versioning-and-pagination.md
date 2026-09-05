---
sidebar_position: 3
title: Verzovanie a Stránkovanie
---

# Verzovanie a Stránkovanie

Dva problémy, ktorým každé API nakoniec čelí: ako zmeniť tvar bez rozbitia existujúcich
klientov, a ako vrátiť veľké kolekcie bez poslania všetkého naraz.

## Stratégie verzovania API

```text
URL path:      GET /v1/users/42            — najviditeľnejšie, najľahšie pochopiteľné, zapratáva URL
Hlavička:      GET /users/42
               Accept: application/vnd.example.v1+json
Query param:   GET /users/42?version=1       — najmenej bežné, ľahko sa náhodne vynechá
```

**URL-path verzovanie** (`/v1/...`) je v praxi najrozšírenejšie — nie preto, že by bolo
architektonicky "najčistejšie" (dá sa argumentovať, že nie je — zdroj `/users/42` by koncepčne
nemal meniť identitu len preto, že sa zmenila verzia API), ale lebo je okamžite viditeľné,
triviálne smerovateľné na úrovni infraštruktúry (reverse proxy vie nasmerovať `/v1/*` a `/v2/*` na
úplne rôzne backend nasadenia — pozri [Reverse Proxy](/sk/study-materials/networking/web-serving/reverse-proxies)
v téme Siete), a ľahko pochopiteľné pre akéhokoľvek vývojára klienta na prvý pohľad.

## Kedy naozaj zvýšiť verziu

Nie každá zmena ju potrebuje — naozaj užitočné pravidlo palca:

```text
NEPOTREBUJE novú verziu:
  - Pridanie nového voliteľného poľa do odpovede
  - Pridanie nového endpointu
  - Pridanie nového voliteľného parametra požiadavky

POTREBUJE novú verziu (breaking zmena):
  - Odstránenie alebo premenovanie poľa
  - Zmena typu alebo významu poľa
  - Zmena povinných parametrov
  - Zmena samotnej štruktúry URL
```

Agresívne verzovanie pri každej malej zmene rozdrobí API na mnoho sotva odlišných verzií, ktoré
klienti musia sledovať; príliš zriedkavé verzovanie znamená, že nevyhnutná breaking zmena nemá
kam ísť bez rozbitia každej existujúcej integrácie naraz. Vyhraď zvýšenie verzie pre naozajstné
breaking zmeny.

## Stránkovanie — offset-based

```http
GET /articles?limit=20&offset=40
```

```json
{"data": [...], "meta": {"total": 342, "limit": 20, "offset": 40}}
```

Jednoduché, podporuje skok na ľubovoľnú stránku (`offset=200` pre "stránku 11"), ale má reálny
problém so správnosťou: ak sa medzi dvoma stránkovanými požiadavkami vloží alebo zmaže záznam,
`offset` sa pod tebou posunie — klient môže vidieť tú istú položku dvakrát, alebo jednu úplne
preskočiť, počas prechádzania výsledkami, ktoré sa aktívne menia.

## Stránkovanie — cursor-based

```http
GET /articles?limit=20&cursor=eyJpZCI6NDJ9
```

```json
{"data": [...], "meta": {"next_cursor": "eyJpZCI6NjJ9", "has_more": true}}
```

Cursor kóduje stabilnú pozíciu (typicky ID poslednej videnej položky alebo sort kľúč) namiesto
surového numerického offsetu — vloženie alebo zmazanie záznamov inde v kolekcii neposunie, čo
"ďalšie" znamená relatívne k tomu, kde klient už bol. Nedá sa skočiť na ľubovoľné číslo stránky,
len "ďalej"/"späť" odtiaľ, kde si — reálny kompromis, nie striktne lepšia náhrada za offset
stránkovanie.

## Ktoré použiť

| | Offset | Cursor |
|---|---|---|
| Skok na ľubovoľnú stránku | Áno | Nie, len sekvenčne |
| Správne pri súbežných vkladaniach/mazaniach | Nie | Áno |
| Zložitosť implementácie | Jednoduchá | Mierne náročnejšia |
| Bežné pre | Admin UI s číslami stránok | Infinite-scroll feedy, dáta s vysokým objemom zápisov |

Kolekcia, ktorá sa často mení počas stránkovania (sociálny feed, live log stream), je najjasnejší
prípad pre cursor-based stránkovanie; väčšinou statická admin tabuľka s UI čísel stránok je
rozumné miesto, kde vyhráva jednoduchosť offset stránkovania.

## Skontroluj sa

- Pomenuj dve zmeny API, ktoré nepotrebujú novú verziu, a dve, ktoré áno.

  <details>
  <summary>Odpoveď</summary>

  Nepotrebujú: pridanie nového voliteľného poľa do odpovede, pridanie nového endpointu. Potrebujú:
  odstránenie alebo premenovanie poľa, zmena typu alebo významu poľa.
  </details>

- Prečo je URL-path verzovanie v praxi najbežnejším prístupom, napriek tomu, že nie je
  architektonicky "najčistejšie"?

  <details>
  <summary>Odpoveď</summary>

  Je okamžite viditeľné, triviálne smerovateľné na úrovni infraštruktúry (reverse proxy vie
  nasmerovať `/v1/*` a `/v2/*` na úplne rôzne backendy), a ľahko pochopiteľné pre akéhokoľvek
  vývojára klienta na prvý pohľad.
  </details>

- Aký problém so správnosťou môže postihnúť offset-based stránkovanie, ktorému sa cursor-based
  vyhne?

  <details>
  <summary>Odpoveď</summary>

  Ak sa medzi stránkovanými požiadavkami vloží alebo zmaže záznam, offset sa pod tebou posunie —
  klient môže vidieť tú istú položku dvakrát alebo jednu preskočiť. Cursor kóduje stabilnú
  pozíciu namiesto surového offsetu, tak ho súbežné vkladania/mazania neovplyvnia.
  </details>
