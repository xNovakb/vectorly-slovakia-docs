---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- [Riadenie Toku](./control-flow.md) hovorí, že Kotlin nemá samostatný ternárny operátor, lebo
  `if` už produkuje hodnotu. Ako sa tá istá myšlienka "výraz, nielen príkaz" objaví znova v
  jednovýrazových funkciách zo [Základy Funkcií](./functions-basics.md)?

  <details>
  <summary>Odpoveď</summary>

  Jednovýrazová funkcia (`fun square(x: Int) = x * x`) funguje, lebo telo funkcie je samo osebe
  len výraz, ktorého hodnota sa stane návratovou hodnotou — presne ten istý princíp ako `val max =
  if (a > b) a else b`, kde vetviaci konštrukt sa vyhodnotí na hodnotu namiesto vyžadovania
  samostatných príkazov na priradenie do premennej.
  </details>

- `when` výraz použitý ako hodnota normálne vyžaduje vetvu `else`. Podľa
  [Riadenie Toku](./control-flow.md), za akej podmienky sa táto požiadavka dá vynechať, a prečo to
  kompilátor povoľuje?

  <details>
  <summary>Odpoveď</summary>

  Dá sa vynechať, keď kompilátor dokáže, že sú všetky prípady už pokryté — kanonický príklad je
  `when` nad hierarchiou sealed triedy, kde kompilátor pozná úplnú množinu podtypov a dokáže
  overiť exhaustívnosť bez záchytnej vetvy.
  </details>

- `calculate(3, 4) { x, y -> x + y }` aj `numbers.forEach { println(it) }` obidva vynechajú
  zátvorky okolo lambda argumentu. Podľa [Lambdy a Higher-Order Funkcie](./lambdas-and-higher-order-functions.md),
  prečo druhý príklad vynechá zátvorky *úplne*, kým prvý ich len presunie mimo?

  <details>
  <summary>Odpoveď</summary>

  Syntax trailing lambda umožňuje lambde, ktorá je *posledným* parametrom, presunúť sa mimo
  zátvoriek — `calculate` má stále dva ďalšie parametre (`3, 4`), tak pre ne zátvorky ostávajú.
  `forEach` berie lambdu ako svoj *jediný* parameter, tak keď sa raz presunie mimo, v zátvorkách
  nezostane nič a môžu byť úplne vynechané.
  </details>

- Prečo `fun multiplier(factor: Int): (Int) -> Int` vracajúca `{ number -> number * factor }`
  stále funguje správne aj po tom, čo sa samotný `multiplier` už vrátil, podľa
  [Lambdy a Higher-Order Funkcie](./lambdas-and-higher-order-functions.md)?

  <details>
  <summary>Odpoveď</summary>

  Vrátená lambda je closure — zachytáva `factor` z jeho obklopujúceho scope namiesto toho, aby
  odkazovala len na vlastné parametre. Táto zachytená hodnota zostáva nažive ako súčasť closure aj
  po tom, čo samotné volanie funkcie `multiplier` skončilo, čo je presne to, čo umožňuje
  `triple(5)` stále vedieť, že `factor` bol `3`.
  </details>

- Prečo Kotlin vôbec nemá klasický C-style loop `for (int i = 0; i < n; i++)`, podľa
  [Riadenie Toku](./control-flow.md), a ako `numbers.filter(::isEven)` z
  [Lambdy a Higher-Order Funkcie](./lambdas-and-higher-order-functions.md) odráža tú istú
  podkladovú návrhovú preferenciu?

  <details>
  <summary>Odpoveď</summary>

  Ranges a iterables pokrývajú tú istú potrebu ako C-style loop bez off-by-one chýb v indexoch,
  ktoré môže manuálne napísaná hlavička loopu zaviesť — Kotlin uprednostňuje vyjadrenie *čo*
  iterovať pred *ako* spravovať premennú indexu. Referencie na funkcie (`::isEven`) odrážajú tú
  istú preferenciu na úrovni funkcií: odovzdanie existujúcej pomenovanej funkcie priamo namiesto
  jej manuálneho zabalenia do lambdy, ktorá ju len volá.
  </details>

