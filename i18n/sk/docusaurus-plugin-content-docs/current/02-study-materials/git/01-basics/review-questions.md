---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- Ako sa model "troch stavov" z [Čo je Git](./what-is-git.md) mapuje na staging/commit kroky zo
  [Základného Workflow](./core-workflow.md)?

  <details>
  <summary>Odpoveď</summary>

  Working directory je súbor upravený na disku; staging area je to, čo `git add` naplánoval
  (staging krok zo Základného Workflow); committed je to, čo `git commit` uloží do histórie —
  Základný Workflow doslova presúva súbor cez tieto tri stavy.
  </details>

- Nastavíš `user.email` globálne, potom spustíš `git config user.email work@company.com` vnútri
  jedného konkrétneho repozitára. Ktorý email použijú commity tohto repozitára?

  <details>
  <summary>Odpoveď</summary>

  Lokálna hodnota špecifická pre repozitár prepíše globálnu — len v rámci tohto repozitára.
  </details>

- Prečo pridanie súboru do `.gitignore` po tom, čo je už commitnutý, nič nespraví, s odkazom na
  to, čo Git skutočne trackuje?

  <details>
  <summary>Odpoveď</summary>

  `.gitignore` zabráni len tomu, aby Git začal trackovať aktuálne netrackovaný súbor; už
  trackovaný súbor treba najprv explicitne odtrackovať pomocou `git rm --cached`.
  </details>

- Prečo môžu `git log` a `git diff` medzi starými commitmi fungovať bez pripojenia k sieti,
  vzhľadom na distribuovanú povahu Gitu?

  <details>
  <summary>Odpoveď</summary>

  Lebo klon už obsahuje celú históriu lokálne — netreba kontaktovať server na prehliadanie
  commitov, ktoré už máš na disku.
  </details>

- Aký vzťah ukazuje `git status`, v zmysle troch ukazovateľov, ktoré popisuje Základný Workflow?

  <details>
  <summary>Odpoveď</summary>

  Zobrazuje diff medzi working directory, indexom (staging area), a HEAD.
  </details>
