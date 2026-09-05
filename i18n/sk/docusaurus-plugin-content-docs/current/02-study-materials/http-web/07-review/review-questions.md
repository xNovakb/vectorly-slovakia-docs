---
sidebar_position: 1
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Syntetizujúce otázky naprieč celou témou. Odpovedaj nahlas a prepájaj podkapitoly — o to na tejto
stránke ide, nie o opakovanie otázok z jednotlivých stránok.

- Prejdi jednu celú požiadavku: prehliadač pošle `GET /articles/42` cez HTTP/2 a dostane späť
  `304`. Pomenuj každý mechanizmus z tejto témy zapojený do tejto jednej výmeny (verzia
  protokolu, metóda, status kód, cachovacie hlavičky).

  <details>
  <summary>Odpoveď</summary>

  HTTP/2 (verzia protokolu, multiplexing cez jedno spojenie), `GET` (bezpečná, idempotentná
  metóda), a `304` (status kód znamenajúci "nezmenené," produkovaný validáciou ETag/`Cache-Control`)
  — všetky tri z tejto témy sa objavia v tejto jednej výmene.
  </details>

- Prečo sa "bezstavové" obmedzenie REST popisuje ako len vlastná bezstavovosť HTTP, zámerne
  aplikovaná na úrovni návrhu API, namiesto niečoho, čo by REST sám vymýšľal?

  <details>
  <summary>Odpoveď</summary>

  Lebo nepridáva žiadne nové pravidlo — hovorí: aplikuj vlastnú bezstavovosť HTTP zámerne na
  úrovni návrhu API (každá požiadavka samostatná), namiesto obchádzania cez server-side session
  stav.
  </details>

- Tím pridá `Access-Control-Allow-Origin: *` na verejný, len-na-čítanie endpoint, ktorý nikdy
  nekontroluje cookies. Je to bezpečné? Bola by tá istá hlavička bezpečná na endpointe, ktorý sa
  spolieha na `Authorization` cookies?

  <details>
  <summary>Odpoveď</summary>

  Bezpečné na verejnom, len-na-čítanie endpointe — nie je tam nič citlivé, čo by mohol prečítať
  škodlivý origin. Nebezpečné na credentialed endpointe — prehliadače skutočne odmietnu vystaviť
  odpoveď wildcard-origin požiadavke, ktorá sa spolieha na cookies/`Authorization`, presne aby
  tomuto zabránili.
  </details>

- Prečo môže CSRF útok uspieť proti `GET`-based mazaciemu endpointu, ale nie proti správne
  navrhnutému `DELETE`-metóda endpointu chránenému CSRF tokenom?

  <details>
  <summary>Odpoveď</summary>

  `GET`-based mazací endpoint nemá žiadnu CSRF ochranu, keďže `GET` požiadavky sa triviálne spustia
  cross-site (`<img>` tag, automaticky odosielaný formulár). Správne navrhnutý `DELETE` endpoint
  vyžadujúci CSRF token sa nedá sfalšovať, lebo cross-site požiadavka útočníka nemá ako poznať
  alebo zahrnúť ten token.
  </details>

- Ako content negotiation (`Accept` / `Content-Type`) umožní jednému endpointu servírovať aj JSON,
  aj XML klientov, a kde sa v tom prejaví REST obmedzenie "uniform interface"?

  <details>
  <summary>Odpoveď</summary>

  Server vyberie formát odpovede na základe klientovej `Accept` hlavičky a označí ho
  `Content-Type` na ceste späť. Toto je "uniform interface" v akcii: jeden endpoint, štandardné
  vyjednávanie, namiesto samostatných endpointov na formát.
  </details>

- Prečo verzovanie API v URL ceste (namiesto hlavičky) uľahčuje smerovanie CDN a reverse proxy —
  prepájajúc podkapitolu REST/návrh API s podkapitolou výkonu?

  <details>
  <summary>Odpoveď</summary>

  Reverse proxy vie smerovať čisto podľa URL cesty (`/v1/*` vs. `/v2/*` na rôzne backend
  nasadenia) bez potreby skúmať hlavičky — smerovanie na úrovni infraštruktúry je presne to, čo
  CDN alebo proxy už robí dobre.
  </details>

- Nasadený statický asset za CDN edge sa používateľom neaktualizuje po vydaní opravy. Prejdi
  zlyhanie cez: `Cache-Control` hlavičku origin servera, správanie CDN edge, a vlastnú cache
  prehliadača — kde je najpravdepodobnejšie jediné miesto zlyhania?

  <details>
  <summary>Odpoveď</summary>

  Najpravdepodobnejšie na úrovni origin/CDN — buď bol `Cache-Control` origin servera nastavený
  príliš agresívne, alebo CDN nikdy nedostal pokyn purgnúť/revalidovať. Vlastná cache prehliadača
  je za tým, čo CDN už servíroval, tak zriedka býva skutočnou hlavnou príčinou.
  </details>

- Prečo na tom, že `PUT` je idempotentný, záleží konkrétne pre automatické retries, a ako to
  súvisí s tým, prečo REST API uprednostňujú sémanticky správne metódy pred smerovaním všetkého
  cez `POST`?

  <details>
  <summary>Odpoveď</summary>

  Idempotentnosť `PUT` znamená, že automatický retry po zahodenom spojení je bezpečný — jeho
  opakovanie nemení výsledok. Presne preto REST API uprednostňujú dať každej akcii jej sémanticky
  správnu metódu namiesto smerovania všetkého cez `POST`, kde by automatický retry mohol vytvoriť
  duplikát.
  </details>

- Vysvetli, od začiatku do konca, prečo session cookie potrebuje `HttpOnly`, `Secure`, a
  `SameSite` všetky spolu — čo presne zastaví každý z nich, a je niektorý z troch redundantný s
  iným?

  <details>
  <summary>Odpoveď</summary>

  `HttpOnly` zastaví JavaScript (vrátane XSS-vloženého skriptu) v čítaní cookie; `Secure` zastaví
  jej posielanie cez obyčajné HTTP; `SameSite` zastaví jej pripájanie k cross-site (CSRF-vyvolaným)
  požiadavkám. Žiadny nie je redundantný — každý bráni proti inému vektoru útoku (XSS-čítanie,
  odpočúvanie siete, CSRF-pripojenie).
  </details>

- Prečo je oprava head-of-line blocking v HTTP/3 o tom, *kde* je implementovaná spoľahlivosť (TCP
  vs. QUIC per-stream), namiesto len otvárania viacerých paralelných spojení tak, ako to robili
  workaroundy HTTP/1.1?

  <details>
  <summary>Odpoveď</summary>

  Otvorenie viacerých paralelných TCP spojení len rozloží ten istý problém head-of-line blocking
  na viac spojení, stále ohraničený striktným poradím TCP na spojenie. HTTP/3 namiesto toho
  presúva spoľahlivosť na per-stream (QUIC), tak stratený paket zastaví len svoj vlastný stream,
  bez ohľadu na počet spojení.
  </details>

- API vráti `422 Unprocessable Entity` namiesto `400 Bad Request` pre dobre formovanú požiadavku
  so sémanticky neplatnými dátami. Prečo je to správnejšia voľba — s odkazom na podkapitoly status
  kódov aj návrhu API?

  <details>
  <summary>Odpoveď</summary>

  `422` hovorí "tvoju požiadavku som perfektne pochopil, ale samotné dáta sú neplatné" (napr.
  zle formovaná emailová adresa); `400` hovorí, že samotná požiadavka sa nedala parsovať alebo
  pochopiť. Vrátenie konkrétnejšieho `422` umožňuje kódu klienta aj monitoringu rozlíšiť
  validačné zlyhanie od naozaj zle formovanej požiadavky.
  </details>

- Prečo štýl stránkovania (offset vs. cursor) súvisí s cachovaním — konkrétne, prečo je
  offset-based odpoveď ťažšie správne cachovať než cursor-based, pri súbežných zápisoch?

  <details>
  <summary>Odpoveď</summary>

  Správnosť offset-based odpovede závisí od toho, že sa nič neposunulo od výpočtu offsetu — pri
  súbežných zápisoch to nie je garantované, tak jej cachovanie riskuje servírovanie zastaraných
  alebo nesprávnych stránok. Cursor kóduje stabilnú pozíciu relatívne k skutočným dátam, tak ten
  istý cursor spoľahlivo vráti tú istú "ďalšiu" stránku bez ohľadu na súbežné zápisy, čo ho robí
  bezpečným na cachovanie.
  </details>
