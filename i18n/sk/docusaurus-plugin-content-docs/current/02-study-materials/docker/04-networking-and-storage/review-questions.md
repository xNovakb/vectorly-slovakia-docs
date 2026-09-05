---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- Postgres kontajner sa spustí bez akéhokoľvek `-v`, funguje týždne v pohode a potom stratí všetky
  dáta pri ďalšom redeployi. Pomocou [Perzistencia Dát](./data-persistence.md) vysvetli presne, čo
  sa stalo a prečo to Docker nepovažuje za chybu.

  <details>
  <summary>Odpoveď</summary>

  Bez pripojeného volume postgres zapisoval svoje dáta do vlastnej dočasnej writable vrstvy
  kontajnera. Redeploy, ktorý znovu vytvorí kontajner (`docker rm` + nový `docker run`), túto
  writable vrstvu úplne zahodí — z pohľadu Dockeru je to presne to, čo má odstránenie kontajnera
  robiť, nie porucha.
  </details>

- Aký je konkrétny rozdiel medzi `docker volume create app-data` použitým s `-v
  app-data:/data` a `-v /home/deploy/config:/data`, podľa
  [Volumes a Bind Mounts](./volumes-and-bind-mounts.md), a ktoré je správne pre dátový adresár
  databázy vs. pre live-editovanie zdrojového kódu vo vývoji?

  <details>
  <summary>Odpoveď</summary>

  Prvé je named volume — Docker spravuje, kde na disku žije, a je prenositeľné naprieč hostiteľmi
  podľa mena. Druhé je bind mount na konkrétnu, známu cestu na hostiteľovi, ktorú riadiš priamo.
  Dátový adresár databázy by mal použiť named volume (produkčné dáta, netreba sa k nim priamo
  dostávať z hostiteľa); live-editovanie zdrojového kódu vo vývoji potrebuje bind mount, lebo
  aktívne edituješ presne tie súbory z hostiteľa.
  </details>

- Bez `-p` je port kontajnera dosiahnuteľný len inými kontajnermi na tej istej sieti, nie z
  hostiteľa alebo internetu. Ako ten istý default vysvetľuje, prečo kontajner `docs-app` tejto
  firmy nepublikuje vôbec žiadne `ports:` vo svojom Compose súbore?

  <details>
  <summary>Odpoveď</summary>

  `docs-app` musí byť dosiahnuteľný len pre Caddy, čo je iný kontajner na tej istej bridge sieti
  `proxy-net` — takže nikdy nepotrebuje `-p`/`ports:`. Nepublikovanie portu nie je chýbajúca
  funkcia, je to zámerne to, čo robí kontajner appky nedosiahnuteľným z internetu okrem cez Caddy.
  </details>

- Prečo *predvolená* sieť `bridge` neumožní dvom kontajnerom dosiahnuť sa navzájom podľa mena, kým
  *vlastná* sieť (alebo tá, ktorú vytvorí Compose) áno?

  <details>
  <summary>Odpoveď</summary>

  Vstavané DNS rozlišovanie mien kontajnerov v Dockeri je poskytnuté len na používateľom
  vytvorených sieťach, nie na predvolenej sieti `bridge` — presne preto reálne nastavenia (vrátane
  `proxy-net` tejto firmy) vytvárajú pomenovanú vlastnú sieť namiesto spoliehania sa na predvolenú.
  </details>

- Na kontajneri s pripojeným named volume sa spustí `docker rm -f my-app`. Prežijú dáta vo volume,
  a ako to súvisí s tým, prečo by databázový kontajner mal vždy použiť named volume namiesto
  spoliehania sa na svoju writable vrstvu?

  <details>
  <summary>Odpoveď</summary>

  Áno — odstránenie kontajnera štandardne neodstráni volumes, ktoré mal pripojené. To je presne tá
  vlastnosť, ktorá robí named volume správnou opravou: životný cyklus dát sa stane nezávislým od
  akéhokoľvek konkrétneho kontajnera, čím prežije presne ten druh odstránenia, ktorý by inak
  zničil dáta žijúce len vo writable vrstve.
  </details>

