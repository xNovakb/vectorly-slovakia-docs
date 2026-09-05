---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- Deploy reťaz spustí `ssh docs-server "docker ps"` ako krok riešenia problémov 1. Prečo je
  kontrola, či kontajner vôbec beží, správnym prvým krokom, pred kontrolou Caddy alebo DNS?

  <details>
  <summary>Odpoveď</summary>

  Je to najvnútornejší článok reťaze — ak kontajner nebeží, nič po ňom (interné počúvanie,
  reverse proxy, DNS) nemôže byť skutočným problémom, tak vylúčenie alebo potvrdenie tohto ako
  prvého najrýchlejšie zúži hľadanie.
  </details>

- `docs-app` počúva na porte 80 len interne, dostupný pre Caddy cez `proxy-net`, ale nie z
  hostiteľa ani internetu. Ktorý koncept Docker sietí spraví túto izoláciu predvolenou, nie niečo,
  čo musíš nastaviť?

  <details>
  <summary>Odpoveď</summary>

  Kontajnery na bridge sieti sa dosiahnu podľa mena navzájom predvolene, ale nič nie je dostupné
  zvonku Dockeru, pokiaľ nie je port explicitne publikovaný cez `-p` — len-interné je predvolené,
  nie extra krok.
  </details>

- Pri použití poradia zo sady nástrojov na riešenie problémov (DNS → dosiahnuteľný vôbec → TLS →
  proxy → backend), kam by ťa nasmerovalo "kontajner beží a `docker logs` neukazuje chyby, ale
  `curl` zvonku dostane 502"?

  <details>
  <summary>Odpoveď</summary>

  Reverse proxy beží a je dostupný, ale nedostane sa k backendu, na ktorý proxuje — skontroluj,
  či appka naozaj počúva na porte/sieti, ktorú proxy očakáva, aj keď je samotný kontajner zdravý.
  </details>

- Prečo `ping` nevracajúci nič NEZNAMENÁ okamžite "deploy je pokazený" pri debugovaní nasadenia
  statickej stránky?

  <details>
  <summary>Odpoveď</summary>

  Veľa serverov zámerne blokuje ICMP z bezpečnostných dôvodov — chýbajúca odpoveď na ping vylúči
  len konkrétne ICMP, nie skutočnú HTTP(S) službu, ktorú má deploy vystaviť.
  </details>
