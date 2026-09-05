---
sidebar_position: 5
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- [Premenné Prostredia a PATH](./environment-variables-and-path.md) hovoria, že `export` je
  potrebný, aby ho videl child proces. Prečo je to dôležité konkrétne pre hodnoty v štýle
  `$API_KEY` zo [Základov Shell Scriptingu](./shell-scripting-basics.md) posielané do skriptu
  spusteného cez `bash deploy.sh`?

  <details>
  <summary>Odpoveď</summary>

  Skript spustený ako nový proces zdedí len premenné, ktoré boli exportované z volajúceho shellu;
  obyčajná (neexportovaná) premenná nastavená vo volajúcom shelli je vnútri procesu skriptu
  neviditeľná.
  </details>

- Kontrola `if [ $? -ne 0 ]` zo [Základov Shell Scriptingu](./shell-scripting-basics.md) sa
  spolieha na koncept pokrytý inde v tejto celej téme, nie v tomto podpriečinku. Ktorý, a kde?

  <details>
  <summary>Odpoveď</summary>

  Exit kódy, pokryté v [Čo je Proces](../03-processes/what-is-a-process.md) — `$?` obsahuje exit
  kód predošlého príkazu, `0` pre úspech, nenulový pre zlyhanie.
  </details>

- [systemd a Služby](./systemd-and-services.md) hovoria, že `Restart=always` je výhoda systemd
  oproti obyčajnému background procesu. S ktorým nástrojom z [Pozadia a
  Úloh](../03-processes/background-and-jobs.md) sa to implicitne porovnáva, a čo presne ten
  nástroj nespraví, čo systemd áno?

  <details>
  <summary>Odpoveď</summary>

  `nohup` (alebo holé `&`) — ani jeden automaticky nereštartuje proces, ak spadne; udržia ho bežať
  len cez odpojenie, nedohliadajú ani ho neoživia neskôr.
  </details>

- Šesť-príkazový praktický príklad z [Riešenia Problémov Servera](./troubleshooting-a-server.md)
  kontroluje disk, potom systemd status Dockeru, potom stav kontajnera, potom logy, a nakoniec
  konektivitu — v tomto poradí. Prečo kontrolovať miesto na disku pred čímkoľvek súvisiacim s
  Dockerom?

  <details>
  <summary>Odpoveď</summary>

  Plný disk je neprimerane častá základná príčina tichého zlyhania služby alebo nedokončeného
  deployu, a `df -h` to potvrdí alebo vyvráti za sekundy — lacnejšie vylúčiť najprv, než ladiť
  symptómy na úrovni Dockeru, ktoré môžu byť len druhotný efekt nedostatku voľného miesta.
  </details>

- Prečo je `journalctl -u docker` dôležitá ako *samostatná* kontrola od `docker logs docs-app`,
  podľa [systemd a Služieb](./systemd-and-services.md) a [Riešenia Problémov
  Servera](./troubleshooting-a-server.md)?

  <details>
  <summary>Odpoveď</summary>

  `journalctl -u docker` ukazuje, či je samotný Docker daemon (služba spravovaná systemd) zdravý;
  `docker logs docs-app` ukazuje vlastný výstup jedného konkrétneho kontajnera — kontrola daemona
  najprv ti povie, či je problém v samotnom Dockeri, alebo izolovaný na jeden kontajner.
  </details>

- Premenná exportovaná v termináli funguje v poriadku, ale zmizne v novom `tmux` paneli na tom
  istom stroji. Podľa rozdielu `.bashrc` vs. `.bash_profile` z [Premenných Prostredia a
  PATH](./environment-variables-and-path.md), aká je pravdepodobná príčina?

  <details>
  <summary>Odpoveď</summary>

  Premenná bola nastavená obyčajným `export` v termináli (len na reláciu) namiesto pridania do
  startup súboru ako `.bashrc` — alebo bola pridaná konkrétne do `.bash_profile`, ktorý beží len
  pre login shell, nie pre každý nový interaktívny shell/panel, ktorý načíta len `.bashrc`.
  </details>
