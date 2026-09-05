---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- Rebase dáva prehratým commitom nové hashe. Ako to súvisí s tým, prečo je rebase nebezpečný na
  zdieľaných vetvách, zatiaľ čo merge je vždy bezpečný?

  <details>
  <summary>Odpoveď</summary>

  Merge nikdy neprepisuje existujúce commit hashe, len pridá nový merge commit navrch — bezpečné
  pre kohokoľvek, kto už pullol. Rebase zmení hashe prehratých commitov, tak ktokoľvek, kto pullol
  tie staré, má teraz históriu rozídenú od tvojej.
  </details>

- Vetva sa počas merge fast-forwardne. Mohla by byť rovnaká história vetvy vytvorená namiesto
  toho rebasom?

  <details>
  <summary>Odpoveď</summary>

  Áno — fast-forward merge aj rebase nasledovaný fast-forwardom oba zanechajú jednu lineárnu
  históriu; rozdiel sa prejaví len keď sa cieľová vetva pohla a treba skutočný three-way
  merge/rebase-replay.
  </details>

- Ak rebase konfliktuje, riešiš to rovnako ako merge konflikt?

  <details>
  <summary>Odpoveď</summary>

  Konfliktné značky sú identické, ale dokončenie sa líši — rebase konflikt sa rieši pomocou
  `git rebase --continue` (nie `git commit`), keďže rebase si dokončenie každého prehratého
  commitu obslúži sám.
  </details>

- Prečo záleží na tom, že HEAD zostáva pripojený k vetve (namiesto detached), pre to, ako sa
  správajú `git commit` a `git switch`?

  <details>
  <summary>Odpoveď</summary>

  Keď HEAD ukazuje na vetvu, commitovanie automaticky posunie ukazovateľ tej vetvy dopredu; v
  detached HEAD nové commity nesleduje žiadna vetva a môžu sa stať nedosiahnuteľnými po prepnutí
  — museli by ste explicitne vytvoriť vetvu, aby ste ich zachovali.
  </details>

- Potrebuješ zlúčiť tri commity na feature vetve do dvoch čistých pred mergom. Ktorý nástroj z
  tejto podkapitoly to spraví, a ako to súvisí s tým, čo by zachoval obyčajný merge?

  <details>
  <summary>Odpoveď</summary>

  Interaktívny rebase (`rebase -i`, squash/fixup) — obyčajný merge by zachoval všetky tri pôvodné
  commity nedotknuté; interaktívny rebase naozaj prepíše vlastnú históriu vetvy na dva pred
  zlúčením.
  </details>
