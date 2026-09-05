---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- Doménové meno sa resolvuje na IP adresu, ktorá je súkromná (`192.168.x.x`), nie verejná. Čo to
  hovorí o tom, či je ten server priamo dostupný z internetu?

  <details>
  <summary>Odpoveď</summary>

  Nie je priamo dostupný — súkromná IP existuje len v rámci lokálnej siete a potrebuje NAT (alebo
  port forwarding/tunel), aby bola dosiahnuteľná zvonku, na rozdiel od verejnej IP, akú má napr.
  VPS.
  </details>

- Aj "server" (rola) aj "port" (číslo smerujúce prevádzku na správny program) umožnia jednému
  počítaču robiť veľa vecí naraz. Ako sa skombinujú, aby to fungovalo?

  <details>
  <summary>Odpoveď</summary>

  Jeden počítač s jednou IP môže bežať viacero server programov, každý naviazaný na vlastný port —
  "server" popisuje, čo program robí, "port" je to, čo nasmeruje prichádzajúce pripojenie na
  správny z nich.
  </details>

- Prečo firewall blokujúci jeden konkrétny skok vyprodukuje "funguje z domu, nie z kancelárie,"
  namiesto totálneho, univerzálneho zlyhania?

  <details>
  <summary>Odpoveď</summary>

  Pakety z domu a z kancelárie idú rôznymi cestami cez rôzne routery pred dosiahnutím cieľa — blok
  na jednom konkrétnom skoku ovplyvní len cesty, ktoré cezeň prechádzajú.
  </details>

- Ak `docs.vectorly-slovakia.sk` aj požiadavka na `localhost:3000` oboje "dosiahnu server," čo je
  naozaj rôzne v tom, ako sa tam každý dostane?

  <details>
  <summary>Odpoveď</summary>

  `localhost` vždy znamená "tento počítač" — žiadne sieťové smerovanie zapojené vôbec. Doménové
  meno sa resolvuje cez DNS na IP, a potom požiadavka naozaj cestuje cez internet cez viacero
  routerov, aby dosiahla vzdialený počítač.
  </details>
