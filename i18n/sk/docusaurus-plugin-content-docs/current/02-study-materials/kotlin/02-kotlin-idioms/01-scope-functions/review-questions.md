---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- [let, run, with](./let-run-with.md) a [apply, also](./apply-also.md) rozdeľujú päť scope funkcií
  do dvoch skupín. Aká je skutočná deliaca čiara medzi oboma skupinami, podľa
  [Výber Správnej Scope Funkcie](./choosing-the-right-scope-function.md)?

  <details>
  <summary>Odpoveď</summary>

  Či funkcia vráti novo vypočítanú hodnotu (`let`, `run`, `with`) alebo samotný pôvodný receiver
  objekt (`apply`, `also`). Presne táto jedna otázka — "potrebujem objekt späť, alebo vypočítaný
  výsledok?" — je prvá vetva vlastného flowchartu decision guide.
  </details>

- `user?.let { u -> sendWelcomeEmail(u.email) }` a `with(user) { "$name is $age" }` obidva
  pracujú na objekte `User`. Podľa [let, run, with](./let-run-with.md), prečo je `let` prirodzená
  voľba pre prvý prípad, ale `with` sa zvyčajne nesiahne pre nullable receiver?

  <details>
  <summary>Odpoveď</summary>

  `let` v kombinácii s `?.` skratovo preskočí spustenie bloku vôbec, ak je receiver null — presne
  to, čo je potrebné pre nullable hodnotu. `with` berie svoj argument ako obyčajný, non-nullable
  parameter a nie je extension funkcia volaná cez `?.`, tak nemá vstavané rovnaké null-safety
  skratovanie; číta sa najlepšie, keď objekt už vieme, že existuje.
  </details>

- Prečo sa `apply` číta prirodzene s implicitným `this` pri konfigurovaní properties objektu, kým
  `also` sa preferuje s explicitným `it` pre side effect ako logovanie, podľa
  [apply, also](./apply-also.md) — vzhľadom na to, že oba vracajú ten istý objekt?

  <details>
  <summary>Odpoveď</summary>

  Je to konvencia čitateľnosti, nie technický rozdiel: implicitné `this` v `apply` sa číta
  prirodzene, keď blok *nastavuje properties na samotnom receiveri* (akoby si písal kód vnútri tej
  triedy), kým explicitné `it` v `also` jasne ukazuje, že blok *robí niečo s* objektom zvonka, bez
  editovania jeho vlastných properties — logovanie alebo validáciu, nie konfiguráciu.
  </details>

- `someValue.let { it + 1 }` je uvedený ako prípad, kedy by sa scope funkcia vôbec nemala
  používať. Podľa [Výber Správnej Scope Funkcie](./choosing-the-right-scope-function.md), aká je
  skutočná škoda pri písaní tohto, okrem toho, že je to jednoducho zbytočné?

  <details>
  <summary>Odpoveď</summary>

  Pridáva vrstvu nepriamosti (lambdu, scope) za nulový skutočný prínos oproti `someValue + 1` —
  scope funkcie si zaslúžia svoje miesto pri null-safety reťazcoch, konfigurácii objektov alebo
  zoskupovaní súvisiacich volaní; použitie jednej reflexívne na jednom triviálnom výraze prinúti
  čitateľa zastaviť sa a parsovať štruktúru, ktorá v skutočnosti nič nerobí, čo pôsobí proti
  čitateľnosti, ktorú má idióm poskytnúť.
  </details>

- Prečo vnorenie dvoch `let` blokov s tým istým implicitným `it` vytvára skutočný problém s
  čitateľnosťou, podľa [Výber Správnej Scope Funkcie](./choosing-the-right-scope-function.md), a
  aká je oprava, ktorá nevyžaduje úplné opustenie scope funkcií?

  <details>
  <summary>Odpoveď</summary>

  Po vnorení sa naozaj ťažko na prvý pohľad rozozná, ku ktorému `it` daná referencia patrí, keďže
  obidva bloky používajú to isté implicitné meno pre iný receiver. Oprava je explicitné
  pomenovanie parametra na každej úrovni (`let { o -> ... }`) namiesto spoliehania sa na implicitné
  `it`, alebo úplné vyhnutie sa vnoreniu pomocou pomenovanej medzipremennej.
  </details>

