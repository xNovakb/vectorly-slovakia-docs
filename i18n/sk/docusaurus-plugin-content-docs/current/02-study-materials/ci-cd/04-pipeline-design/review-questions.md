---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Odpovedaj nahlas, nie znovu čítaním stránok — presne to overí, či koncept naozaj sedí.

- [Fázy a Joby](./stages-and-jobs.md) ukazuje `test` a `lint`, oba závislé len na `build`, bežiace
  súčasne. Čo musí platiť o `test` a `lint`, aby ich CI platforma spustila paralelne automaticky?

  <details>
  <summary>Odpoveď</summary>

  Musia nemať žiadny závislostný vzťah voči sebe navzájom (ani jeden nedeklaruje `needs:` na
  druhý) — CI platforma zostaví skutočný graf závislostí a spustí čokoľvek bez vzťahu medzi sebou
  súbežne, bez potreby explicitne žiadať paralelizmus.
  </details>

- [Paralelizácia](./parallelization.md) hovorí, že rozdelenie 2-minútového jobu na 4 shardy veľmi
  nepomôže. Prečo nie, vzhľadom na to, čo [Fázy a Joby](./stages-and-jobs.md) hovorí o samostatných
  joboch bežiacich vo fresh, izolovaných prostrediach?

  <details>
  <summary>Odpoveď</summary>

  Každý samostatný job platí svoju vlastnú réžiu za nastavenie prostredia (checkout, inštalácia
  závislostí) — pri naozaj krátkom jobe táto fixná réžia môže dominovať alebo prekročiť skutočný
  ušetrený čas práce, čím spotrebuje alebo obráti prínos paralelizmu.
  </details>

- Ako súvisí upozornenie [Cachovanie v CI](./caching-in-ci.md) o príliš širokom cache key s
  definíciou deterministického buildu z
  [Automatizované Buildy](../02-build-and-test/automated-builds.md)?

  <details>
  <summary>Odpoveď</summary>

  Zastaraná cache podaná pod nesprávne škálovaným kľúčom vyprodukuje build, ktorý neodráža svoje
  skutočné vstupy (aktualizáciu závislosti, ktorú by mal obsahovať, ale neobsahuje) — rovnaký typ
  tichého, nereprodukovateľného driftu, ktorý rozbíja determinizmus buildu, len spôsobený vrstvou
  cache namiesto samotného build kroku.
  </details>

- Matrix build spustí 3 verzie Node × 3 operačné systémy = 9 paralelných jobov. Podľa
  [Paralelizácia](./parallelization.md), aká je skutočná cena tohto, oddelene od wall-clock času?

  <details>
  <summary>Odpoveď</summary>

  Výpočtová cena — spustenie 9 paralelných jobov je skutočne 9x výpočtu jedného sekvenčného jobu
  pre ten beh, aj keď wall-clock čas klesne; väčšina platforiem účtuje podľa výpočtového
  času/súbežnosti, takže toto je skutočný kompromis, nie zadarmo rýchlosť.
  </details>

- [Fázy a Joby](./stages-and-jobs.md) hovorí, že príliš jemné rozdelenie môže pridať réžiu, ktorá
  preváži prínos paralelizmu. Vyjadri tú istú myšlienku slovníkom
  [Paralelizácia](./parallelization.md)-u.

  <details>
  <summary>Odpoveď</summary>

  Klesajúce výnosy — každé ďalšie rozdelenie stále platí svoju vlastnú réžiu za nastavenie, takže
  za istým bodom ďalšie delenie prestane zmysluplne skracovať pipeline a môže ju dokonca predĺžiť.
  </details>

- Prečo `restore-keys` v [Cachovanie v CI](./caching-in-ci.md) záleží konkrétne pre projekt, ktorého
  lockfile sa mení pomerne často, oproti takému, kde sa závislosti menia zriedka?

  <details>
  <summary>Odpoveď</summary>

  Pri častých zmenách lockfile presná zhoda cache key často chýba; `restore-keys` sa vráti na
  najnovšiu cache so zhodnou predponou, takže väčšina závislostí (ktoré sa pravdepodobne nezmenili)
  sa stále znovupoužije namiesto začínania z úplne prázdnej cache zakaždým.
  </details>

- Tvar fan-out/fan-in pipeline (jeden build napájajúci paralelné test/lint/type-check, potom jeden
  deploy čakajúci na všetky tri) sa objavuje v [Fázy a Joby](./stages-and-jobs.md) aj implicitne v
  [Paralelizácia](./parallelization.md). Čo určuje celkový čas fan-out fázy?

  <details>
  <summary>Odpoveď</summary>

  Najpomalšia jediná kontrola v tom fan-oute, nie súčet všetkých — keďže bežia súbežne, fáza nemôže
  skončiť rýchlejšie než jej najpomalší člen.
  </details>
