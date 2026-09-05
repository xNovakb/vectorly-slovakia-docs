---
sidebar_position: 1
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Syntetizujúce otázky naprieč celou témou. Odpovedaj nahlas a prepájaj podkapitoly — o to na tejto
stránke ide, nie o opakovanie otázok z jednotlivých stránok.

- Prejdi `https://docs.vectorly-slovakia.sk` od napísania do prehliadača po zobrazenie stránky:
  pomenuj každý mechanizmus z tejto témy zapojený (DNS, TCP/port, TLS, reverse proxy, kontajner).

  <details>
  <summary>Odpoveď</summary>

  DNS resolvuje hostname na IP; prehliadač otvorí TCP spojenie na port 443; TLS handshake ustanoví
  šifrovanie a overí certifikát; požiadavka (s hlavičkou `Host`) dosiahne Caddy, reverse proxy,
  ktorý smeruje podľa hostname na kontajner `docs-app` cez internú Docker sieť `proxy-net`;
  kontajner odpovie, a Caddy to relayuje späť šifrované.
  </details>

- Aj SSH key auth aj TLS certifikáty sa spoliehajú na koncept súkromného/verejného páru kľúčov.
  Kde sa skutočná podobnosť končí?

  <details>
  <summary>Odpoveď</summary>

  Oboje dokazuje identitu cez súkromný kľúč, ktorý nikdy neopustí svojho držiteľa, a verejný
  náprotivok, voči ktorému druhá strana overuje. Rozchádzajú sa v nastavení dôvery: SSH dôvera sa
  ustanovuje ručným umiestnením verejného kľúča do `authorized_keys`; TLS dôvera sa spolieha na
  tretiu stranu (CA) ručiacu za certifikát servera, ktorý prehliadač overí voči vstavanému
  zoznamu dôveryhodných CA.
  </details>

- Prečo súkromná IP za NAT vysvetľuje aj "nemôžem sa SSH-núť na notebook z kaviarne," aj "port
  forwarding z routera je niekedy potrebný pre priamy prístup"?

  <details>
  <summary>Odpoveď</summary>

  Oboje je ten istý podkladový fakt: súkromná IP nie je priamo dostupná zvonku svojej lokálnej
  siete bez niečoho (NAT pravidiel, port forwardingu, alebo tunela) explicitne premosťujúceho
  túto medzeru — notebook na domácom Wi-Fi a kontajner bez publikovaného portu zdieľajú presne
  toto obmedzenie.
  </details>

- SSH tunel (`-L`) aj Docker bridge networking oboje umožnia jednej strane dosiahnuť službu, ktorá
  nie je verejne vystavená. Čo je naozaj rôzne v modeli dôvery, na ktorý sa každý spolieha?

  <details>
  <summary>Odpoveď</summary>

  SSH tunel sa spolieha na to, že si sa už autentifikoval na vzdialenom počítači cez SSH — tunel
  sa vezie na tejto už ustanovenej dôvere. Docker bridge sieť sa spolieha na to, že kontajnery boli
  pripojené k rovnakej súkromnej sieti osobou, ktorá to nastavila — na sieťovej vrstve samotnej sa
  nedeje žiadna per-connection autentifikácia.
  </details>

- Prečo táto organizácia terminuje TLS na reverse proxy namiesto vnútri `docs-app` samotného, a
  ako to súvisí s tým, prečo `docs-app` potrebuje len firewallovaný interný port, nie verejný?

  <details>
  <summary>Odpoveď</summary>

  Terminovanie TLS raz, centrálne, znamená, že len Caddy potrebuje certifikát a potrebuje byť
  dostupný z internetu vôbec — `docs-app` môže hovoriť obyčajným HTTP cez súkromnú Docker sieť,
  lebo tá sieť nie je vystavená tak, ako internetu-vystavený skok, a len jedna vec (Caddy)
  potrebuje byť udržiavaná patchnutá proti priamemu vystaveniu.
  </details>

- Zmena DNS záznamu aj health check load balancera oboje zahŕňajú jednu vec "neprejaví sa všade
  okamžite." Prečo je jedno o cachovaní a druhé o aktívnej detekcii?

  <details>
  <summary>Odpoveď</summary>

  DNS propagačné oneskorenie je pasívne — resolvery jednoducho naďalej servírujú cachovanú
  odpoveď, kým nevyprší jej TTL, nikto nič nekontroluje. Health check load balancera je aktívny —
  opakovane pollne každú inštanciu samotnú, aby rozhodol, takmer v reálnom čase, či na ňu naďalej
  smerovať.
  </details>

- Ak sa `curl -v` proti doméne zastaví hneď po "Connected", ale nikdy nedokončí TLS handshake,
  ktorá podkapitola vysvetľuje, čo skontrolovať ďalej, a prečo to nie je DNS problém?

  <details>
  <summary>Odpoveď</summary>

  Stránka TLS a HTTPS z Web Serving — úspešné TCP pripojenie už znamená, že DNS resolvoval
  správne a server prijal spojenie; zaseknutý handshake ukazuje konkrétne na problém s
  certifikátom alebo TLS konfiguráciou, o jednu vrstvu ďalej než DNS.
  </details>

- Prečo by pridanie load balancera pred viacero inštancií appky zmenilo, ako by si debugoval
  "deploy sa nezobrazuje," v porovnaní s aktuálnym jedno-inštančným nastavením tejto organizácie?

  <details>
  <summary>Odpoveď</summary>

  S jednou inštanciou, `docker ps`/`docker logs` na jednom serveri povie celý príbeh. S load
  balancerom by mohla byť zastaraná inštancia stále v rotácii servírujúca starý obsah, zatiaľ čo
  ostatné dostali nový deploy — musel by si skontrolovať každú inštanciu samostatne, alebo že
  load balancer naozaj presmeroval prevádzku na aktualizované.
  </details>

- SSH-based deploy pipeline aj reverse proxy oboje fungujú ako jediný kontrolovaný vstupný bod
  strážiaci niečo za sebou. Čo je naozaj chránené v každom prípade?

  <details>
  <summary>Odpoveď</summary>

  SSH deploy kľúč stráži, *kto* môže spustiť príkazy a zmeniť, čo beží na VPS vôbec; reverse proxy
  stráži, *ktorý* backend smie daná verejná požiadavka dosiahnuť — jedno kontroluje
  administratívny prístup, druhé kontroluje smerovanie/vystavenie požiadaviek.
  </details>

- Prečo `CNAME` záznam a smerovanie reverse proxy podľa hostname riešia koncepčne podobné
  problémy ("nasmeruj toto na správny skutočný cieľ") pomocou úplne rôznych mechanizmov?

  <details>
  <summary>Odpoveď</summary>

  `CNAME` funguje na DNS vrstve, predtým než sa vytvorí akékoľvek spojenie — len povie
  resolverom "vyhľadaj namiesto toho toto iné meno." Reverse proxy funguje po tom, čo je TCP/TLS
  spojenie už ustanovené, skúmajúc hlavičku `Host` skutočnej HTTP požiadavky, aby rozhodol, kam ju
  presmerovať — DNS presmeruje *vyhľadanie*, proxy presmeruje *živé spojenie*.
  </details>

- Vzhľadom na všetko v tejto téme, prečo je "funguje mi to" takmer nepoužiteľné ako bug report pre
  sieťový problém, a aký je najrýchlejší spôsob, ako ho spraviť použiteľným?

  <details>
  <summary>Odpoveď</summary>

  Lebo tak veľa článkov v reťazi (použitý DNS resolver, sieťová cesta/skoky, firewall pravidlá,
  ktorá IP bola naozaj dosiahnutá) sa môže líšiť medzi dvoma počítačmi, aj keď oba zasiahnu "tú
  istú" doménu. Najrýchlejšia oprava je spustiť rovnaké usporiadané kontroly (DNS → dosiahnuteľný
  vôbec → dokončí sa TLS → odpovedá proxy → odpovedá backend) zo zlyhávajúceho počítača, aby si
  identifikoval, ktorý článok sa presne líši.
  </details>

- Prečo SSH deploy kľúč nepotrebujúci passphrase (pre CI) a Docker kontajner nepotrebujúci
  publikovaný port (pre len-interné služby) oboje odrážajú ten istý podkladový bezpečnostný
  princíp?

  <details>
  <summary>Odpoveď</summary>

  Oboje nasleduje "zúž polomer výbuchu namiesto širokej dôvery": deploy kľúč je zaškatuľkovaný na
  jeden účel, tak je únik obmedzený, a nepublikovaný port kontajnera jednoducho vôbec nie je
  dostupný zvonku — ani jedno sa nespolieha na to, že sa širší credential alebo otvorený povrch
  starostlivo strážia, jednoducho odstraňujú vystavenie.
  </details>
