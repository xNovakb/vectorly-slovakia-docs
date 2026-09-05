---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- [Čo je Shell](./what-is-a-shell.md) hovorí, že shell sa rozpráva s kernelom v tvojom mene. Kam
  do toho zapadá jeden koreňový strom (`/`) zo [Súborového Systému](./the-filesystem.md) — je to
  niečo, čo shell vymýšľa, alebo niečo, čo poskytuje kernel?

  <details>
  <summary>Odpoveď</summary>

  Kernel udržiava a poskytuje jeden súborový strom; shell si ho nevymýšľa, len interpretuje cesty,
  ktoré napíšeš, a žiada kernel, aby ich rozriešil/spracoval.
  </details>

- Relatívna cesta ako `docs/README.md` sa správa inak podľa jedného konkrétneho kúsku stavu shellu.
  Ktorého, a ktorý príkaz z [Navigácie a Súborov](./navigating-and-files.md) ho ukazuje?

  <details>
  <summary>Odpoveď</summary>

  Aktuálny pracovný priečinok — `pwd` ho ukazuje, a každá relatívna cesta sa rieši od neho.
  </details>

- Prečo `ls *.md` zachytí len súbory v aktuálnom priečinku, kým `find . -name "*.md"` (spomenuté v
  Navigácii a Súboroch, plne pokryté neskôr) sa rekurzívne vnára do podpriečinkov?

  <details>
  <summary>Odpoveď</summary>

  `*` je shell wildcard, ktorý sa zhoduje len v rámci jedného segmentu cesty — nikdy neprejde cez
  `/`; `find` je program, ktorý sám prechádza strom priečinkov, takže sa prirodzene rekurzívne
  vnára.
  </details>

- Spravíš `cd /opt/vectorly-docs`, potom ti kolega povie "skontroluj `~/.ssh`". Podľa toho, čo
  Súborový Systém hovorí o `~`, je to ten istý priečinok, do ktorého si sa práve presunul?

  <details>
  <summary>Odpoveď</summary>

  Nie — `~` vždy znamená tvoj domovský priečinok (napr. `/home/deploy`), bez ohľadu na to, čo je
  tvoj aktuálny pracovný priečinok po `cd`.
  </details>

- Prečo je `rm -rf` obzvlášť nebezpečný hneď po `cd`, spájajúc to, čo obe stránky hovoria o
  relatívnych cestách a o skrytom stave?

  <details>
  <summary>Odpoveď</summary>

  `rm -rf` berie relatívnu cestu doslovne, bez potvrdenia; ak `cd` zmenil aktuálny priečinok na
  niečo iné, než si predpokladal, tá istá relatívna cesta teraz ukazuje úplne inam — a príkaz sa
  aj tak spustí.
  </details>
