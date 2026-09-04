---
sidebar_position: 2
title: Requesty a Odpovede
---

# Requesty a Odpovede

Každá HTTP správa — požiadavka alebo odpoveď — má rovnaký trojčasťový tvar: úvodný riadok,
hlavičky, a voliteľné telo.

## Anatómia požiadavky

```text
GET /articles/42?lang=en HTTP/1.1        <- riadok požiadavky: metóda, cesta (+ query), HTTP verzia
Host: example.com                          <- hlavičky: key-value metadáta
User-Agent: curl/8.4.0
Accept: application/json

                                              <- prázdny riadok oddeľuje hlavičky od tela
{"filter": "recent"}                          <- telo (voliteľné — pri GET často chýba)
```

- **Metóda** — aký druh akcie to je (`GET`, `POST`, atď. — pozri
  [HTTP Metódy](../02-methods-and-semantics/http-methods.md)).
- **Cesta** — ktorý zdroj na serveri, plus voliteľný query string (`?lang=en`).
- **Hlavičky** — metadáta o požiadavke: kto sa pýta (`User-Agent`), aký formát prijme
  (`Accept`), autentifikácia (`Authorization`), a viac — pozri
  [Bežné Hlavičky](../03-headers-and-content/common-headers.md).
- **Telo** — skutočné odosielané dáta, ak nejaké sú. Bežné pri `POST`/`PUT`, zriedkavé pri `GET`.

## Anatómia odpovede

```text
HTTP/1.1 200 OK                              <- status riadok: verzia, status kód, reason phrase
Content-Type: application/json                 <- hlavičky
Content-Length: 27

{"id": 42, "title": "Hello"}                     <- telo
```

- **Status kód** — trojciferné číslo klasifikujúce výsledok (pozri
  [Status Kódy](./status-codes.md)).
- **Hlavičky** — metadáta o odpovedi: v akom formáte je telo (`Content-Type`), aké je dlhé,
  inštrukcie na cachovanie (pozri
  [Cachovanie a ETags](../03-headers-and-content/caching-and-etags.md)).
- **Telo** — skutočný obsah: HTML, JSON, obrázok, čokoľvek bolo požadované. Nie každá odpoveď ho
  má — `204 No Content` alebo telo `HEAD` odpovede je z definície prázdne.

## Pozri to naozaj

```bash
curl -v https://example.com
```

`-v` vypíše skutočné vymenené hlavičky požiadavky a odpovede — najlepší spôsob, ako toto spraviť
konkrétne namiesto teoretického. Riadky začínajúce `>` sú to, čo poslal tvoj klient, `<` je to, čo
poslal server späť:

```text
> GET / HTTP/1.1
> Host: example.com
> Accept: */*
>
< HTTP/1.1 200 OK
< Content-Type: text/html
<
```

## Hlavičky požiadavky vs. odpovede nie sú rovnaká sada

Niektoré hlavičky dávajú zmysel len na jednej strane — `User-Agent` (kto sa pýta) sa objaví len v
požiadavkách; `Content-Length`/`Set-Cookie` (popisujúce, čo sa posiela späť) sa objavia len v
odpovediach. Iné, ako `Content-Type`, sa objavia v oboch, popisujúc telo *tejto* konkrétnej
správy.

## Prečo je telo oddelené od hlavičiek

Hlavičky popisujú správu; telo *je* skutočný payload správy. Udržanie ich oddelenými (oddelené
tým prázdnym riadkom) je to, čo umožňuje serveru alebo proxy čítať a konať na základe hlavičiek —
smerovanie, kontroly autentifikácie, content negotiation — bez toho, aby musel najprv parsovať
alebo čo i len úplne prijať telo.
