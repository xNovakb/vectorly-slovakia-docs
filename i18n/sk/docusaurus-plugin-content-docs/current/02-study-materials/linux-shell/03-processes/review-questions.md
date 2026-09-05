---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- [Čo je Proces](./what-is-a-process.md) hovorí, že zatvorenie terminálu môže zabiť všetko, čo si z
  neho spustil. Ktorý konkrétny signál z [Pozadia a Úloh](./background-and-jobs.md) to spôsobuje, a
  prečo?

  <details>
  <summary>Odpoveď</summary>

  `SIGHUP` (hangup) — keď rodičovský shell skončí, jeho child procesy dostanú predvolene `SIGHUP` a
  zomrú, keďže bežná background úloha (`&`) je stále dieťaťom toho shellu.
  </details>

- Prečo `nohup long-task.sh &` vyrieši problém s odpojením, kým bežné `long-task.sh &` z [Pozadia a
  Úloh](./background-and-jobs.md) nie, vzhľadom na to, čo [Čo je Proces](./what-is-a-process.md)
  hovorí o vzťahoch rodič/dieťa?

  <details>
  <summary>Odpoveď</summary>

  Oba spustia proces ako dieťa shellu, ale `nohup` spôsobí, že to dieťa konkrétne ignoruje `SIGHUP`,
  takže prežije skončenie shellu — vzťah rodič/dieťa je identický, líši sa len spracovanie signálu.
  </details>

- [Správa Procesov](./managing-processes.md) rozlišuje `kill` (SIGTERM) od `kill -9` (SIGKILL).
  Ktorý z nich riskuje stav "zombie" popísaný v [Čo je Proces](./what-is-a-process.md), a ktorý
  riskuje namiesto toho poškodené dáta?

  <details>
  <summary>Odpoveď</summary>

  Ani jeden priamo nespôsobí zombie (to sa týka rodiča, ktorý nevyzdvihne exit status už
  skončeného dieťaťa) — ale SIGKILL je ten, čo riskuje poškodené dáta, keďže procesu nedá žiadnu
  šancu dokončiť zápis alebo sa upratať; SIGTERM mu dovolí ukončiť sa čisto.
  </details>

- `tmux` je v [Pozadí a Úlohách](./background-and-jobs.md) popísaný ako riešenie "širšieho
  problému" než `nohup`. Aký je skutočný rozdiel v tom, čo prežije odpojenie?

  <details>
  <summary>Odpoveď</summary>

  `nohup` udrží jeden konkrétny príkaz bežiaci po odpojení; `tmux` udrží celú perzistentnú terminál
  reláciu nažive — viacero príkazov, panelov a možnosť sa znovu pripojiť a pokračovať interaktívne
  pracovať, nielen nechať jeden proces dobehnúť bez dozoru.
  </details>

- Podľa diagramu stromu procesov v [Čo je Proces](./what-is-a-process.md)
  (`sshd → bash → docker compose up → proces kontajnera`), ktorý proces skutočne cieli `pkill node`
  zo [Správy Procesov](./managing-processes.md), a prečo je zabíjanie podľa mena riskantnejšie na
  zdieľanom serveri ako podľa PID?

  <details>
  <summary>Odpoveď</summary>

  Cieli akýkoľvek proces kdekoľvek v tom strome (alebo inde v systéme), ktorého meno sa zhoduje s
  "node" — keďže sa zhoduje podľa mena, nie konkrétneho PID, môže zabiť nesúvisiace Node procesy
  patriace iným službám bežiacim na tom istom serveri.
  </details>
