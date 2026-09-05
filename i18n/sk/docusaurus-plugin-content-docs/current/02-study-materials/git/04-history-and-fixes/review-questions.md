---
sidebar_position: 6
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- Spravil si `git reset --hard` a stratil commit, ktorý si potreboval. Ktorý nástroj z tejto
  podkapitoly ho vráti späť, a prečo to stále funguje, aj keď commit "zmizol"?

  <details>
  <summary>Odpoveď</summary>

  `git reflog` — objekt commitu zvyčajne stále existuje na disku, reset len presunul ukazovateľ
  preč od neho; reflog nájde starú pozíciu HEAD, aby si sa mohol `reset --hard` vrátiť späť na ňu.
  </details>

- Ako súvisí binárne vyhľadávanie `git bisect` s druhom histórie, na ktorú by mohli `git
  cherry-pick` alebo `undoing-changes` potom pôsobiť?

  <details>
  <summary>Odpoveď</summary>

  Bisect identifikuje presný zlý commit; keď ho nájdeš, môžeš cherry-picknúť opravný commit na
  release vetvu, alebo použiť nástroje na vracanie zmien (revert/reset), aby si naozaj vrátil
  efekt zlého commitu.
  </details>

- Aj `git stash`, aj WIP commit ti umožnia "ulož a vráť sa neskôr." Pomohol by ti reflog obnoviť
  stash, ktorý si omylom zahodil, rovnako ako obnoví stratený commit?

  <details>
  <summary>Odpoveď</summary>

  Nie rovnako — reflog sleduje presuny HEAD a históriu vetiev; stash žije vo vlastnej samostatnej
  stash referencii mimo toho. Commitnutá zmena (vrátane WIP commitu) sa spoľahlivo objaví v
  hlavnom reflogu; zahodený stash sa oveľa ľahšie stratí úplne.
  </details>

- Cherry-pick vytvorí duplicitný commit. Ak sa tá istá zmena neskôr normálne zlúči cez bežnú
  históriu vetvy, rozbije sa Git?

  <details>
  <summary>Odpoveď</summary>

  Nie — Git zvyčajne duplicitný obsah zvládne v poriadku, aj keď to občas môže spôsobiť konflikt
  na už aplikovanej zmene; nie je to problém so správnosťou.
  </details>

- Ktorý príkaz z Vracania Zmien je bezpečná voľba na vrátenie commitu, ktorý je už pushnutý a
  niekto iný ho pullol, a prečo tá istá logika neplatí pre `reset --hard`?

  <details>
  <summary>Odpoveď</summary>

  `git revert` — pridá nový commit namiesto prepísania histórie, tak je bezpečný na zdieľaných
  commitoch. `reset --hard` prepíše, na čo ukazuje vetva, a commity zahodí, čo je nebezpečné na
  čomkoľvek, čo už niekto inde pullol.
  </details>
