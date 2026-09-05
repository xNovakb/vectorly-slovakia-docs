---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- Spravíš `git fetch` a vidíš, že `origin/main` má nové commity, ale ešte si nepullol. Zmenil sa
  tvoj working directory vôbec?

  <details>
  <summary>Odpoveď</summary>

  Nie — `fetch` len aktualizuje tvoj lokálny záznam o remote; nič sa nezmení vo working directory,
  kým naozaj nespravíš merge alebo rebase (napr. cez `pull`).
  </details>

- V fork-based PR modeli, na ktorý remote pushuješ svoju feature vetvu, a z ktorého fetchuješ
  upstream zmeny?

  <details>
  <summary>Odpoveď</summary>

  Pushuješ na `origin` (tvoj fork); fetchuješ/mergueš z `upstream` (originálny repozitár).
  </details>

- Po `git push -u origin feature/login`, čo umožní obyčajnému `git push` na tejto vetve fungovať
  bez opätovného uvedenia origin/vetvy?

  <details>
  <summary>Odpoveď</summary>

  Tracking vzťah nastavený cez `-u` — lokálna vetva teraz vie, ktorej remote vetve zodpovedá.
  </details>

- Vyžaduje otvorenie PR nejaký špeciálny Git príkaz nad rámec obyčajného pushu?

  <details>
  <summary>Odpoveď</summary>

  Nie — pushnutie vetvy je obyčajná Git operácia; samotný PR sa vytvorí až potom cez UI hostingovej
  platformy, keďže PR nie je koncept Gitu.
  </details>

- Ktorý workflow model (z Modelov Git Workflow) zodpovedá PR procesu tejto organizácie, popísanému
  tu?

  <details>
  <summary>Odpoveď</summary>

  Model spoločného repozitára so štruktúrou vetiev `main`/`develop`/`feature`, najbližšie k
  odľahčenému GitFlow.
  </details>
