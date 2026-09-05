---
sidebar_position: 2
title: Content Types a Kódovanie
---

# Content Types a Kódovanie

## MIME typy

**MIME typ** (tiež media type) je štandardizované `type/subtype` označenie, ktoré nesie hlavička
`Content-Type` — hovorí prijímajúcej strane, aký druh dát bajty predstavujú.

```text
text/html
text/plain
application/json
application/pdf
image/png
image/jpeg
application/octet-stream          — "ľubovoľné binárne dáta, konkrétnejší typ neznámy"
multipart/form-data                — telo požiadavky zložené z viacerých samostatných častí (napr. upload súboru spolu s poľami formulára)
```

Prehliadače podľa tohto rozhodujú, ako naložiť s odpoveďou — `text/html` sa vykreslí ako stránka,
`application/pdf` otvorí PDF viewer, `application/octet-stream` typicky spustí dialóg na
stiahnutie, keďže prehliadač nevie, čo iné by s tým mal robiť.

## Charset

```http
Content-Type: text/html; charset=utf-8
```

Textový obsah tiež potrebuje uviesť *znakové kódovanie* — ako sa bajty mapujú na skutočné znaky.
Pomýliť sa v tomto je presne to, ako vzniká "mojibake" (pokazený text ako `Ã©` namiesto `é`):
bajty sú správne, ale prijímajúca strana ich dekódovala s predpokladom zlého charsetu. `utf-8` je
drvivá predvoľba pre čokoľvek dnes písané; chýbajúci alebo zlý `charset` je takmer vždy príčinou,
keď sa non-ASCII text vykreslí ako nezmysel.

## `Accept` — content negotiation

Klient môže uviesť, aké formáty je ochotný akceptovať, a server podľa toho vyberie:

```http
Accept: application/json
Accept: text/html, application/xhtml+xml, */*;q=0.8
```

`;q=0.8` je quality hodnota — keď je uvedených viac typov, zoradí preferenciu (1.0 =
najpreferovanejšie, predvolené, ak vynechané). Server, ktorý dokáže odpovedať vo viacerých
formátoch (napr. API podporujúce JSON aj XML), použije túto hlavičku na rozhodnutie, ktorý naozaj
poslať späť, a mal by vrátiť `406 Not Acceptable`, ak naozaj nedokáže uspokojiť žiadny uvedený
formát.

## Kódovanie vs. kompresia — iný druh "kódovania"

Nepomýľ si *znakové* kódovanie (`charset`) s *transportným* kódovaním — `Content-Encoding: gzip`
popisuje kompresiu aplikovanú na telo, nesúvisiacu s tým, aké znaky reprezentuje. Oboje síce
používa slovo "encoding," ale odpovedajú na úplne rôzne otázky:
[Kompresia a Minifikácia](../06-performance-and-protocol-evolution/compression-and-minification.md)
pokrýva konkrétne ten kompresný druh.

## Praktický debugovací zvyk

Keď odpoveď vyzerá zle (pokazený text, prehliadač odmietajúci niečo vykresliť, klient
zlyhávajúci pri parsovaní tela), kontrola `Content-Type` (a `charset` pre text) cez `curl -I` je
často rýchlejšia než hľadanie kdekoľvek inde najprv — veľká časť bugov "API je pokazené" je v
skutočnosti zle označený alebo chýbajúci `Content-Type`.
