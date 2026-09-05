---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- Práve si pridal `A` záznam ukazujúci novú subdoménu na server. `dig` z vlastného počítača ukáže
  správnu IP okamžite, ale kolega hovorí, že sa mu to ešte neresolvuje. Je to rozpor?

  <details>
  <summary>Odpoveď</summary>

  Nie — DNS propagácia nie je okamžitá všade; tvoj resolver možno nemal starú hodnotu cachovanú
  (alebo TTL už vypršal pre teba), zatiaľ čo resolver kolegu stále servíruje cachovanú odpoveď,
  kým nevyprší jeho TTL.
  </details>

- Prečo záleží na rozdelení registrátor/nameservery z Ako DNS Funguje, keď práve ty pridávaš `A`
  záznam z DNS Záznamy?

  <details>
  <summary>Odpoveď</summary>

  `A` záznam sa pridáva na nameserveroch (tvoj DNS provider), nie na registrátorovi — registrátor
  kontroluje len to, na ktoré nameservery doména ukazuje, tak musíš vedieť, ktorá firma naozaj
  hostuje tvoje DNS záznamy, skôr než ich môžeš upraviť.
  </details>

- Root doména potrebuje aj `MX` záznam (pre email), aj niekam ukazovať pre webovú stránku. Prečo
  nemôže časť s webovou stránkou jednoducho použiť `CNAME` na zjednodušenie aktualizácií?

  <details>
  <summary>Odpoveď</summary>

  `CNAME` nemôže koexistovať s inými záznamami (ako `MX`) na presne rovnakom mene — root doména
  musí použiť `A` záznam pre webovú stránku, ponechávajúc `CNAME` pre subdomény, ktoré na tom
  istom mene nepotrebujú aj `MX`.
  </details>

- Ak nastavíš TTL záznamu veľmi nízko tesne pred migráciou, a potom ho po nej znova zvýšiš, čo
  naozaj obetuješ v každej fáze?

  <details>
  <summary>Odpoveď</summary>

  Nízky TTL pred zmenou: rýchlejšia propagácia po prepnutí, za cenu viacerých opakovaných dopytov
  na nameserver. Jeho opätovné zvýšenie potom: menšia záťaž nameservera, za cenu pomalšej
  propagácie pri ďalšej zmene.
  </details>
