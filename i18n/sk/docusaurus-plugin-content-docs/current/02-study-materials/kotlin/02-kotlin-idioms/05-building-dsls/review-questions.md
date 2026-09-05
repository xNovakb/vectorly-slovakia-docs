---
sidebar_position: 4
title: Otázky na Zopakovanie
---

# Otázky na Zopakovanie

Prejdi si tieto otázky nahlas, nie opätovným čítaním stránok — to je to, čo skutočne otestuje, či
ti koncept zostal v hlave.

- [Základy DSL](./dsl-basics.md) hovorí, že Kotlin DSL je "obyčajný Kotlin kód," postavený z dvoch
  existujúcich jazykových funkcií skombinovaných zámerne. Aké sú tie dve funkcie, a ktorá z nich
  samotná by ti dala len volania v štýle `repeat3 { println("Hello") }` bez čitateľnosti
  `text(...)` vnútri `html { }`?

  <details>
  <summary>Odpoveď</summary>

  Trailing lambda syntax a receiver types (function type with receiver, ako `Html.() -> Unit`).
  Samotná trailing lambda syntax len presunie lambdu mimo zátvoriek — je to konkrétne receiver
  type, ktorý umožňuje volať `text(...)` bez kvalifikátora vnútri bloku, akoby bol kód napísaný
  priamo vnútri triedy `Html`.
  </details>

- `table { row { row { } } }` sa skompiluje bez `@DslMarker`, aj keď by nemal, podľa
  [Type-Safe Buildery](./type-safe-builders.md). Čo vnútorný `row { }` v skutočnosti volá, a prečo
  to kompilátor potichu povolí?

  <details>
  <summary>Odpoveď</summary>

  Potichu volá `row()` funkciu *vonkajšej* `Table`, nie vnútri `Row` bloku, namiesto vytvorenia
  vnoreného riadku vnútri riadku. Bez akéhokoľvek strážcu vidí resolúcia implicitného receivera
  Kotlinu súčasne aj aktuálny `Row` receiver, aj vonkajší `Table` receiver, tak nič nebráni
  vnútornému scope dosiahnuť vonkajší s rovnako pomenovanou funkciou.
  </details>

- Po pridaní `@DslMarker` na `Table` aj `Row` sa ten istý vnorený `row { }` stane chybou
  kompilácie. Podľa [Type-Safe Buildery](./type-safe-builders.md), robí to vonkajší receiver
  úplne nedosiahnuteľným zvnútra vnútorného bloku?

  <details>
  <summary>Odpoveď</summary>

  Nie — len to vyžaduje byť explicitný, cez label ako `this@table.row { }`. `@DslMarker`
  obmedzuje *implicitnú* resolúciu receivera len na najbližší obklopujúci receiver v tej istej
  marker skupine; vonkajší receiver je stále dosiahnuteľný, len už nie náhodne dosiahnuteľný.
  </details>

- `operator fun plus` na `Vector2` aj hypotetický `operator fun Order.plus(discount: Discount)`
  sú obidva platný Kotlin kód. Podľa [Operator Overloading](./operator-overloading.md), prečo je
  prvý považovaný za dobrú prax a druhý označený ako problém čitateľnosti?

  <details>
  <summary>Odpoveď</summary>

  `Vector2 + Vector2` sa číta blízko svojho skutočného doménového významu (sčítanie vektorov) —
  čitatelia prinášajú skutočné očakávania o tom, čo `+` znamená, a toto im sedí. `Order + Discount`
  znovupoužíva symbol `+` pre "aplikovať zľavu," význam bez skutočnej koncepčnej súvislosti so
  sčítaním — `order.applyDiscount(discount)` hovorí to isté jednoznačne, kým `order + discount`
  núti čitateľa hádať.
  </details>

- Prečo `grid[3, 4] = 7` v skutočnosti volá funkciu pomenovanú `set`, nie niečo pomenované podľa
  samotnej syntaxe `[]`, podľa [Operator Overloading](./operator-overloading.md) — a ako to súvisí
  s tým, ako funguje vlastné indexovanie `List`?

  <details>
  <summary>Odpoveď</summary>

  `[]` je čistý syntax sugar nad špeciálne pomenovanými `operator` funkciami — `grid[3, 4] = 7` sa
  skompiluje na volanie `grid.set(3, 4, 7)`, a čítanie `grid[3, 4]` sa skompiluje na `grid.get(3,
  4)`. Toto je presne ten istý mechanizmus, ktorý `List`/`MutableList` používajú pre vlastnú
  podporu `[]` — `operator fun get`/`set` sú obyčajné funkcie štandardnej knižnice na týchto
  typoch, nie mágia exkluzívna pre kompilátor.
  </details>

