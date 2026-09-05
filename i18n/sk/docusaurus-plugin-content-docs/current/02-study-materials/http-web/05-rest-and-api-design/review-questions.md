---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- Aká je resource-oriented alternatíva k `POST /createUser`, a ktoré REST obmedzenie tento posun
  vlastne demonštruje?

  <details>
  <summary>Odpoveď</summary>

  `POST /users` — obmedzenie "uniform interface": zdroje identifikované URL, manipulované malou
  štandardnou sadou metód, namiesto jedného akciou-pomenovaného endpointu na sloveso.
  </details>

- Prečo záleží na zabalení odpovede kolekcie do `{"data": [...], "meta": {...}}` viac, keď do hry
  vstúpi stránkovanie — offset alebo cursor?

  <details>
  <summary>Odpoveď</summary>

  Holé pole nemá kam dať metadáta stránkovania (celkový počet, ďalší cursor) bez zmeny základného
  tvaru odpovede na najvyššej úrovni — breaking zmena. Zabalený tvar má na to už miesto vyhradené.
  </details>

- API zvýši svoju URL z `/v1/users` na `/v2/users`, lebo sa premenovalo pole. Bol to správny dôvod
  na zvýšenie verzie, podľa pravidla palca z tejto podkapitoly?

  <details>
  <summary>Odpoveď</summary>

  Áno — premenovanie poľa je presne ten druh breaking zmeny, pri ktorej pravidlo palca hovorí, že
  zvýšenie verzie je namieste.
  </details>

- Vrátenie `200 OK` s `{"success": false}` v tele rozbije viac, než len "REST čistotu" — pomenuj
  konkrétne nástroje, ktoré to rozbije.

  <details>
  <summary>Odpoveď</summary>

  Všeobecné HTTP nástroje — monitoring, cachovanie, retry logiku — ktoré skúmajú skutočný status
  kód, nie ad-hoc tvar tela každej odpovede, aby zistili úspech alebo zlyhanie.
  </details>

- Ktorý štýl stránkovania by si zvolil pre live, high-write sociálny feed, a prečo tam konkrétne
  ten druhý štýl zlyhá?

  <details>
  <summary>Odpoveď</summary>

  Cursor-based. Offset stránkovanie zlyhá pri súbežných vkladaniach/mazaniach — položky sa pod
  tebou posunú, čo spôsobí preskočené alebo duplicitné výsledky — presne prostredie, ktoré live
  feed vytvára.
  </details>
