---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- CDN edge node cachne JS bundle appky. Tím nasadí opravu bugu pod úplne rovnakým menom súboru.
  Čo sa pokazí, a aká konvencia pomenovania z tejto podkapitoly tomu zabráni?

  <details>
  <summary>Odpoveď</summary>

  Používatelia naďalej dostávajú starú cachovanú kópiu pod starým menom súboru, kým cache
  nevyprší alebo sa explicitne nepurgne. Súbor s content hashom v mene (`app.a1b2c3.js`) tomu
  zabráni — oprava sa nasadí pod naozaj novou URL.
  </details>

- Nahrádza HTTP-level kompresia (gzip/brotli) potrebu minifikácie, alebo naopak — prečo tímy
  bežne robia oboje?

  <details>
  <summary>Odpoveď</summary>

  Ani jedno nenahrádza druhé. Minifikácia odstraňuje bajty, ktoré runtime nikdy nepotrebuje, v
  build čase; kompresia zneužíva redundanciu v tom, čo z bajtov zostane, per-request. Spraviť len
  jedno stále posiela viac bajtov než oboje.
  </details>

- Pri HTTP/1.1, prečo bundlovanie veľa malých súborov do menšieho počtu väčších pomáhalo výkonu —
  a prečo táto rada slabne pri HTTP/2?

  <details>
  <summary>Odpoveď</summary>

  HTTP/1.1 doručuje jednu požiadavku naraz na spojenie, tak každý ďalší súbor stál celý round
  trip; menej/väčšie súbory znamenali menej round tripov. Multiplexing HTTP/2 umožní zdieľať
  jedno spojenie mnohými požiadavkami súčasne, tak táto cena väčšinou zmizne.
  </details>

- Používateľ na stratovom mobilnom pripojení hlási pomalú stránku, aj keď server používa HTTP/2.
  Čo sa naozaj deje na TCP vrstve, a ktorý neskorší protokol cieli presne na tento problém?

  <details>
  <summary>Odpoveď</summary>

  Striktné poradie TCP znamená, že jeden stratený paket zablokuje každú inú prebiehajúcu
  požiadavku zdieľajúcu to isté spojenie, aj tie, čo už dorazili. HTTP/3, bežiace cez QUIC/UDP,
  cieli presne na toto tým, že robí obnovu straty per-stream namiesto pre celé spojenie.
  </details>

- Prečo problém CDN cache invalidácie jednoducho nevzniká pri obsahu, ktorý sa na edge vôbec
  necachuje (napr. dashboard prihláseného používateľa)?

  <details>
  <summary>Odpoveď</summary>

  Lebo neexistuje nič cachované, čo by mohlo zastarať — invalidácia je problém len pre obsah,
  ktorý bol na začiatku cachovaný.
  </details>
