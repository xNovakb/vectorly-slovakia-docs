---
sidebar_position: 5
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie opätovným čítaním stránok — to je to, čo naozaj otestuje, či ti koncept
ostal v hlave.

- Aj `git filter-repo`, aj `git worktree` ti umožnia pracovať s históriou/checkoutmi inak než
  predvolene. Ktorý z nich naozaj vytvorí nové commit hashe, a ktorý sa histórie vôbec
  nedotkne?

  <details>
  <summary>Odpoveď</summary>

  `git filter-repo` prepíše každý postihnutý commit (nové hashe); `git worktree` ti len dá ďalší
  checkout tej *istej* existujúcej histórie — žiadne prepisovanie.
  </details>

- Ak tím potrebuje zdieľať Git hooks naprieč každým clonom, ktorý mechanizmus z tejto
  podkapitoly to spraví automaticky bez manuálneho nastavovania na clone?

  <details>
  <summary>Odpoveď</summary>

  Nástroj ako Husky, ktorý nainštaluje hooks cez `npm install` postinstall krok — na rozdiel od
  samotného `core.hooksPath`, ktoré stále vyžaduje, aby každý clone raz spustil config príkaz.
  </details>

- Submodul potrebuje extra krok po clonovaní, aby naozaj získal obsah svojich súborov. Má
  worktree podobnú požiadavku na "extra krok"?

  <details>
  <summary>Odpoveď</summary>

  Nie — worktree je okamžite použiteľný po `git worktree add`; problém "extra kroku" je
  špecifický pre submoduly (`--recurse-submodules` alebo `submodule update --init`), nie
  worktrees.
  </details>

- Prečo by bol `git filter-repo` nástrojom voľby na odstránenie secretu commitnutého pred
  rokmi, keď `rebase -i HEAD~3` by nestačilo?

  <details>
  <summary>Odpoveď</summary>

  `rebase -i` dosiahne len nedávne commity, ktoré uvedieš (napr. posledné 3); secret zahrabaný
  hlboko v histórii vyžaduje prepísanie *každého* commitu, ktorý sa toho súboru kedy dotkol, čo
  je presne to, čo `filter-repo` robí naprieč celou históriou.
  </details>

- Dal by sa submodul a worktree skombinovať — napr. worktree repozitára, ktorý sám má
  submoduly?

  <details>
  <summary>Odpoveď</summary>

  Áno, koncepčne — worktree je len ďalší checkout toho istého repozitára, tak stále obsahuje
  rovnaké submodule ukazovatele ako akýkoľvek iný checkout toho repozitára; každý worktree by
  stále potreboval `submodule update --init` pre vlastný obsah submodulu.
  </details>
