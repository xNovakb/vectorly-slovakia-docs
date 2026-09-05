---
sidebar_position: 1
title: Bežné Hlavičky
---

# Bežné Hlavičky

Hlavičky sú key-value metadáta pripojené k požiadavke alebo odpovedi — existujú desiatky, ale
malá sada tvorí drvivú väčšinu toho, čo naozaj budeš čítať alebo nastavovať.

## Hlavičky požiadavky, ktoré sa oplatí poznať

```text
Host: example.com                      — ktorá stránka, keď jeden server hostuje viac domén
                                          (pozri Reverse Proxy v téme Siete)
User-Agent: Mozilla/5.0 ...              — identifikuje softvér klienta robiaceho požiadavku
Accept: application/json                  — aký content type(y) klient dokáže spracovať späť
Authorization: Bearer eyJhbGc...            — credentials (typicky token)
Content-Type: application/json               — formát tela TEJTO požiadavky, ak nejaké má
Cookie: session=abc123                         — cookies predtým nastavené týmto serverom
```

## Hlavičky odpovede, ktoré sa oplatí poznať

```text
Content-Type: application/json           — formát tela odpovede
Content-Length: 1524                       — veľkosť tela v bajtoch
Set-Cookie: session=abc123; HttpOnly        — žiada klienta, aby uložil cookie (pozri Cookies a Session)
Cache-Control: max-age=3600                   — inštrukcie cachovania (pozri Cachovanie a ETags)
Location: /articles/42                          — kam ísť, pri presmerovaní alebo po 201 Created
Access-Control-Allow-Origin: https://app.com      — CORS povolenie (pozri Same-Origin Policy a CORS)
```

## `Content-Type` — pravdepodobne najdôležitejšia hlavička

Hovorí prijímajúcej strane, ako interpretovať bajty tela. Pomýliť sa v nej znamená, že úplne
platné telo sa nesprávne prečíta:

```http
Content-Type: application/json
Content-Type: text/html; charset=utf-8
Content-Type: multipart/form-data; boundary=----abc123
Content-Type: application/x-www-form-urlencoded
```

Server posielajúci JSON, ale deklarujúci `Content-Type: text/plain`, často spôsobí, že klient
(alebo dev tools prehliadača) to zobrazí ako surový text namiesto parsovania — bajty na drôte sú
identické, len *označenie* je zlé, ale práve tomu označeniu dôveruje všetko za ním.

## Vidieť hlavičky naozaj

```bash
curl -v https://example.com 2>&1 | grep -E "^[<>]"
curl -I https://example.com          # len hlavičky odpovede, bez tela
```

```bash
# posielanie vlastnej hlavičky
curl -H "Authorization: Bearer abc123" https://api.example.com/me
```

## Case-insensitivita a opakované hlavičky

**Mená** hlavičiek nerozlišujú veľké/malé písmená (`Content-Type` a `content-type` sú tá istá
hlavička) — hodnoty zvyčajne áno. Hlavička sa tiež legálne môže objaviť viackrát v jednej správe
(bežne `Set-Cookie`, raz na každú nastavovanú cookie) — kód čítajúci hlavičky s tým musí počítať,
nie predpokladať presne jednu hodnotu na meno.

## Skontroluj sa

- Čo popisuje `Content-Type` na požiadavke, a čo popisuje na odpovedi — je to to isté oboje razy?

  <details>
  <summary>Odpoveď</summary>

  Na požiadavke popisuje formát tela tej požiadavky (ak nejaké má); na odpovedi popisuje formát
  tela odpovede. Rovnaké meno hlavičky, ale každá inštancia popisuje tú správu, na ktorej je.
  </details>

- Prečo mená hlavičiek nerozlišujú veľké/malé písmená, ale ich hodnoty zvyčajne áno?

  <details>
  <summary>Odpoveď</summary>

  Mená hlavičiek sú len protokolový identifikátor, ktorý sa porovnáva, tak na veľkosti písmen
  nezáleží; hodnoty sú skutočné dáta (napr. token, MIME typ), kde na veľkosti písmen môže záležať.
  </details>

- Ktorá hlavička sa môže legálne objaviť viackrát v jednej odpovedi, a prečo s tým kód čítajúci
  hlavičky musí počítať?

  <details>
  <summary>Odpoveď</summary>

  `Set-Cookie` — raz na každú nastavovanú cookie. Kód čítajúci hlavičky musí zvládnuť viacero
  hodnôt na meno, nie predpokladať presne jednu.
  </details>
