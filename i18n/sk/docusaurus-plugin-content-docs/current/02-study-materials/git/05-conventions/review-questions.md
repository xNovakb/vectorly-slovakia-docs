---
sidebar_position: 5
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- Ako hygiena atomických commitov robí squash-merge workflow, ktorý táto organizácia používa,
  skutočne zmysluplným?

  <details>
  <summary>Odpoveď</summary>

  Squash-merge zbalí celú vetvu do jedného commitu bez ohľadu na to, aké neporiadne boli
  jednotlivé commity — atomická hygiena záleží najviac na tom, aby bol diff samotného PR
  jednoduchšie recenzovateľný pred squashnutím.
  </details>

- Commit správa hovorí `fix(cart): recalculate total after coupon removal`. Ktorý typ
  Conventional Commits je to, a zvýšil by patch alebo minor verziu?

  <details>
  <summary>Odpoveď</summary>

  `fix` — patch version bump.
  </details>

- Prečo squash-merge uľahčí neskoršie použitie `git bisect`, prepájajúc konvencie späť na
  nástroje histórie?

  <details>
  <summary>Odpoveď</summary>

  Každý commit na `main` zodpovedá presne jednému PR/logickej zmene, tak bisect pristávajúci na
  commite ukáže na jednu súvislú zmenu namiesto zmätku "wip"/"fix typo" commitov.
  </details>

- Potrebuješ vydať v2.5.0 po pridaní len spätne kompatibilných funkcií (žiadne breaking zmeny,
  žiadne opravy chýb). Ktorý segment verzie sa posunie?

  <details>
  <summary>Odpoveď</summary>

  MINOR (z `feat` commitov) — v2.4.1 → v2.5.0.
  </details>

- Prečo na `--force-with-lease` záleží konkrétne v squash-and-rebase workflow, viac než v
  merge-only workflow?

  <details>
  <summary>Odpoveď</summary>

  Squash-and-rebase vyžaduje prepísanie commitov tvojej vetvy (cez `rebase -i`) pred pushnutím, čo
  potrebuje force-push — `--force-with-lease` chráni pred potichým prepísaním cudzej práce
  pushnutej na tú vetvu odkedy si naposledy fetchol, čo merge-only workflow nikdy nepotrebuje,
  keďže nikdy neprepisuje hashe.
  </details>
