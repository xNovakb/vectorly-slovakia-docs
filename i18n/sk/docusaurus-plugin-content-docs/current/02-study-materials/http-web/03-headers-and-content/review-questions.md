---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- Odpoveď nastaví `Cache-Control: no-cache` a obsahuje `ETag`. Prejdi presne, čo sa stane pri
  *ďalšej* požiadavke na ten istý zdroj.

  <details>
  <summary>Odpoveď</summary>

  Keďže `Cache-Control` hovorí "over si to pred použitím," klient pošle cachovaný `ETag` späť cez
  `If-None-Match`. Ak sa stále zhoduje, server odpovie `304` bez tela a klient znovu použije svoju
  cachovanú kópiu; ak sa zmenil, server odpovie `200` s novým telom a `ETag`.
  </details>

- Prečo je `Content-Type` pravdepodobne najdôležitejšia hlavička, a ako zlý `charset` rozbije
  veci, aj keď je samotný MIME typ správny?

  <details>
  <summary>Odpoveď</summary>

  Je to to, čomu dôveruje všetko za ním pri interpretácii bajtov tela. Aj technicky platné telo sa
  vykreslí zle (alebo ako surový text), ak `charset` chýba alebo je zlý, nezávisle od toho, či bol
  samotný MIME typ správny.
  </details>

- Na čo umožňuje hlavička `Accept` klientovi vyjednávať, a ktorá hlavička na strane odpovede
  potvrdzuje, čo si server naozaj vybral poslať?

  <details>
  <summary>Odpoveď</summary>

  `Accept` umožňuje klientovi zoradiť, aké formáty je ochotný akceptovať; `Content-Type` na
  odpovedi potvrdzuje, aký formát server naozaj poslal.
  </details>

- Serveru úplne chýba `Cache-Control` hlavička v odpovedi. Aký je najbezpečnejší predvolený
  predpoklad, ktorý by mal prehliadač urobiť ohľadom jej cachovania?

  <details>
  <summary>Odpoveď</summary>

  Nespoliehať sa na to, že bude cachovaná vôbec — explicitná `Cache-Control` hlavička je jediný
  spoľahlivý spôsob riadenia cachovacieho správania; jej absencia by sa nemala čítať ako pozvánka
  na voľné cachovanie.
  </details>

- `Set-Cookie` sa môže legálne objaviť viackrát v jednej odpovedi. Mohol by to isté spraviť
  `Content-Type`? Prečo áno, alebo prečo nie?

  <details>
  <summary>Odpoveď</summary>

  Nie — `Content-Type` popisuje jedno telo, tak dáva zmysel presne jedna hodnota. `Set-Cookie` sa
  môže opakovať, lebo každá inštancia nastavuje logicky samostatnú cookie.
  </details>
