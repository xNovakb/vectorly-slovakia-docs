---
sidebar_position: 2
title: Kompresia a Minifikácia
---

# Kompresia a Minifikácia

Dve rôzne techniky, ktoré obe zmenšia, čo ide cez drôt, pracujúce na rôznych úrovniach.

## HTTP kompresia — `Content-Encoding`

Server skomprimuje telo odpovede; prehliadač ho automaticky dekomprimuje pred odovzdaním stránke
— úplne transparentné pre aplikačný kód na oboch stranách.

```http
Požiadavka:
Accept-Encoding: gzip, br, deflate

Odpoveď:
Content-Encoding: br
```

`Accept-Encoding` uvádza, čo klient vie dekomprimovať; server vyberie jeden podporovaný a nastaví
`Content-Encoding` na odpovedi, aby povedal, ktorý použil.

```text
gzip      — dlhodobo univerzálna predvoľba, podporovaná všade
br        — Brotli, všeobecne lepší kompresný pomer než gzip, teraz široko podporovaný
deflate   — staršie, dnes zriedka používané zámerne
```

## Čo sa oplatí komprimovať, a čo nie

```bash
curl -H "Accept-Encoding: gzip" -I https://example.com/app.js
curl -H "Accept-Encoding: gzip" -I https://example.com/photo.jpg
```

Textovo založené formáty (HTML, CSS, JS, JSON) sa komprimujú extrémne dobre — často o 60-80%
menšie. Formáty, ktoré sú **už skomprimované** (JPEG, PNG, väčšina video/audio, samotné
`.zip`/`.gz` súbory), sa sotva ďalej zmenšia a niekedy sú po ďalšom kompresnom prechode dokonca
*mierne väčšie* — komprimovanie už skomprimovaných dát plytvá CPU na oboch koncoch bez reálneho
prínosu. Väčšina webových serverov je nakonfigurovaná tak, aby pre tieto content typy kompresiu
automaticky preskočila.

:::note
Toto je dôvod, prečo je komprimovanie už `.gz`-nutého assetu, alebo opätovná kompresia JPEG na
HTTP vrstve, čisté plytvanie — vždy skontroluj, či je formát už skomprimovaný, skôr než
predpokladáš, že HTTP kompresia pomôže.
:::

## Minifikácia — build-time technika, nie funkcia protokolu

Odlišná od HTTP kompresie: **minifikácia** odstráni zbytočné znaky zo zdrojového kódu (medzery,
komentáre, skráti mená premenných) *predtým*, než je vôbec servírovaný — deje sa v build čase,
nie per-request, a produkuje menší súbor, ktorý sa potom *aj* HTTP-skomprimuje navrch.

```js title="Pred minifikáciou"
function calculateTotal(price, quantity) {
    // apply the discount if eligible
    return price * quantity;
}
```

```js title="Po minifikácii"
function calculateTotal(e,t){return e*t}
```

## Prečo oboje spolu, nie jedno samotné

```text
Pôvodný súbor:         100 KB
Po minifikácii:          60 KB   (build-time, jednorazová cena)
Po gzip/brotli:           15 KB   (per-request, transparentné, navrch minifikovaného súboru)
```

Minifikácia a kompresia riešia prekrývajúce sa, ale nie identické problémy — minifikácia
odstraňuje bajty, ktoré runtime naozaj nikdy nepotrebuje (komentáre, medzery); kompresia zneužíva
štatistickú redundanciu v tom, čo z bajtov zostane. Spraviť oboje sčíta ich prínos; preskočenie
minifikácie a spoliehanie sa len na kompresiu stále posiela citeľne viac bajtov, lebo gzip/br
dobre komprimujú opakujúce sa vzory, ale konkrétne nechápu, že "táto medzera je sémanticky
bezvýznamná" tak, ako to robí minifier.

## Skontroluj sa

- Prečo komprimovanie už-zgzipovaného súboru, alebo JPEG, často nepomôže — alebo dokonca mierne
  uškodí?

  <details>
  <summary>Odpoveď</summary>

  Sú už skomprimované — ostáva málo redundancie na zneužitie, tak ďalší kompresný prechod plytvá
  CPU bez prínosu a niekedy súbor mierne zväčší.
  </details>

- Aký je skutočný rozdiel medzi minifikáciou a HTTP kompresiou? Stačí spraviť len jedno z nich?

  <details>
  <summary>Odpoveď</summary>

  Minifikácia odstraňuje bajty, ktoré runtime nikdy nepotrebuje (medzery, komentáre), v build
  čase; HTTP kompresia zneužíva štatistickú redundanciu v tom, čo z bajtov zostane, per-request.
  Spraviť len jedno stále posiela citeľne viac bajtov než oboje.
  </details>

- Ktoré dve hlavičky vyjednávajú HTTP kompresiu, a čo do nej dá každá strana?

  <details>
  <summary>Odpoveď</summary>

  `Accept-Encoding` (klient uvedie, čo vie dekomprimovať) a `Content-Encoding` (server uvedie,
  ktoré kódovanie naozaj použil).
  </details>
