---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- Odpoveď príde so statusom `200`, ale telo je prázdne a chýba `Content-Length` hlavička. Aký
  status kód by robil prázdne telo *očakávaným* namiesto podozrivého, a prečo?

  <details>
  <summary>Odpoveď</summary>

  `204 No Content` — úspech, zámerne bez tela (napr. úspešný `DELETE`).
  </details>

- Kde v surovej HTTP výmene žije status kód, a ktorá časť štruktúry správy určuje, že patrí k
  odpovedi, nie k požiadavke?

  <details>
  <summary>Odpoveď</summary>

  Je súčasťou úvodného riadku odpovede (status riadku) — prvého riadku správy odpovede, odlišného
  od riadku požiadavky, ktorým začína požiadavka. Status kód jednoducho neexistuje na strane
  požiadavky.
  </details>

- Prehliadač požiada o stránku cez `GET` a dostane späť `304`. Rozbíja to model "jedna odpoveď na
  požiadavku" z [Čo je HTTP](./what-is-http.md)? Prečo áno, alebo prečo nie?

  <details>
  <summary>Odpoveď</summary>

  Nie — `304` je stále presne jedna odpoveď na tú jednu požiadavku. Len povie klientovi, aby
  znovu použil, čo už má, namiesto opätovného poslania tela.
  </details>

- HTTP je bezstavové, a predsa odpoveď `401` naznačuje, že serveru záleží na tom, "kto si." Čo
  rieši tento zdanlivý rozpor?

  <details>
  <summary>Odpoveď</summary>

  Samotné HTTP ostáva bezstavové — `401` neznamená, že si server pamätá prebiehajúcu
  "konverzáciu," len znamená, že akékoľvek credentials (alebo ich absencia) priložené k *tejto
  konkrétnej* požiadavke neboli platné. Identita sa ustanovuje pri každej požiadavke zvlášť, nie
  nesená spojením.
  </details>

- Klient pošle požiadavku bez `Host` hlavičky cez HTTP/1.1 spojenie. Akú triedu status kódu by si
  čakal späť, a prečo spadá do tejto triedy, nie do `5xx`?

  <details>
  <summary>Odpoveď</summary>

  `4xx` (konkrétne `400 Bad Request`) — samotná požiadavka je zle formovaná (chýba povinná
  hlavička), nie zlyhanie na strane servera.
  </details>
