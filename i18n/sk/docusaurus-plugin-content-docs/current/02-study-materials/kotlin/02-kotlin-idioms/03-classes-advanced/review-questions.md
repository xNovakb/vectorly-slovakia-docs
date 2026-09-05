---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- `when` nad `sealed class` nepotrebuje vetvu `else`; `when` nad obyčajnou `open class` hierarchiou
  áno. Podľa [Sealed Classes a when](./sealed-classes-and-when.md), prečo môže kompilátor urobiť
  túto výnimku konkrétne pre sealed hierarchie?

  <details>
  <summary>Odpoveď</summary>

  Sealed class obmedzí svoje podtypy na známu, uzavretú množinu deklarovanú v tom istom súbore
  alebo module — kompilátor dokáže enumerovať každý možný podtyp v čase kompilácie a overiť, že
  `when` ich všetky spracuje. Obyčajnú open triedu môže niekto rozšíriť odkiaľkoľvek, tak
  kompilátor nemá spôsob, ako poznať úplnú množinu možností, a nemôže ponúknuť rovnakú garanciu
  exhaustívnosti.
  </details>

- `AccountId` a `Money` sú obidva `@JvmInline value class` wrappery okolo primitív. Podľa
  [Inline a Value Classes](./inline-value-classes.md), prečo takéto zabalenie odchytí chybu v
  poradí argumentov, ktorú by použitie obyčajného `String`/`Long` neodchytilo, a v akom momente sa
  táto chyba odchytí?

  <details>
  <summary>Odpoveď</summary>

  Aj keď `AccountId` a `Money` každý len zabaľuje primitívu pod povrchom, sú pre kompilátor
  skutočne odlišné typy — odovzdanie `Money` tam, kde sa očakáva `AccountId`, sa stane type
  mismatch. Toto sa odchytí v **čase kompilácie**, skôr než kód vôbec beží, na rozdiel od
  obyčajného zámeny `String`, ktorá sa skompiluje bez problémov a prejaví sa len ako bug v
  správaní (alebo vôbec, potichu).
  </details>

- Prečo `LoudDog(private val dog: SoundMaker) : SoundMaker by dog` nemusí sám napísať `override
  fun makeSound() = dog.makeSound()`, podľa [Delegácia](./delegation.md), a ako to súvisí s
  "kompozíciou pred dedičnosťou"?

  <details>
  <summary>Odpoveď</summary>

  Klauzula `by dog` povie kompilátoru, aby automaticky vygeneroval forwarding implementácie pre
  každú metódu na `SoundMaker`, delegujúc na `dog`. Toto je kompozícia (`LoudDog` *má*
  `SoundMaker`, nie je podtriedou nejakého), spravená rovnako ergonomicky ako by bola dedičnosť,
  bez toho, aby vôbec dedila z `Dog`, a bez ručného písania forwarding boilerplate.
  </details>

- `val expensiveValue: String by lazy { ... }` a `var tracked: Int by LoggingDelegate(0)` obidva
  používajú kľúčové slovo `by` pre property delegation. Podľa [Delegácia](./delegation.md), akú
  konvenciu musí vlastná trieda delegáta dodržať, aby to fungovalo takto, a je `by lazy` špeciálna
  syntax podporovaná kompilátorom, alebo len obyčajná implementácia tejto konvencie?

  <details>
  <summary>Odpoveď</summary>

  Trieda delegáta musí implementovať `operator fun getValue(...)` (a `setValue` pre `var`)
  nasledujúc konkrétny tvar zobrazený v príklade `LoggingDelegate`. `by lazy` nie je špeciálna
  kompilátorová mágia — je to jednoducho vlastná implementácia tejto istej konvencie
  `getValue`/`setValue` v štandardnej knižnici, čo znamená, že akákoľvek trieda dodržiavajúca túto
  konvenciu môže slúžiť ako property delegate, nielen tie vstavané.
  </details>

- Aj [Sealed Classes a when](./sealed-classes-and-when.md), aj
  [Inline a Value Classes](./inline-value-classes.md) sú o tom, že typový systém odchytí chyby v
  čase kompilácie namiesto za behu. Aký je skutočný rozdiel v tom, *aký druh* chyby má každý z nich
  odchytiť?

  <details>
  <summary>Odpoveď</summary>

  Sealed classes odchytia "zabudol som spracovať prípad" — `when` blok, ktorý nepočíta s
  každým možným podtypom, sa nedá skompilovať. Value classes odchytia "zamenil som dve sémanticky
  odlišné hodnoty toho istého podkladového primitívneho typu" — odovzdanie `AccountId` tam, kde sa
  očakáva `Money`, sa nedá skompilovať, aj keď obe len zabaľujú primitívu pod povrchom. Rôzne
  kategórie chýb, tá istá podkladová stratégia použitia typového systému na premenu runtime chyby
  na chybu kompilácie.
  </details>

