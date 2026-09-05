---
sidebar_position: 3
title: Operator Overloading
---

# Operator Overloading

Kotlin umožní triede definovať, čo štandardné operátory (`+`, `*`, `[]`, `()`, a viac) znamenajú
pre jej vlastné inštancie, implementáciou špeciálne pomenovaných funkcií označených `operator`.
Dobre použité, toto je to, čo robí mnoho Kotlin DSL a value typov (ako `Money` alebo `Vector`
typy) čitateľnými prirodzene; zle použité, môže spraviť kód aktívne ťažšie pochopiteľným.

## Aritmetické operátory

```kotlin
data class Vector2(val x: Double, val y: Double) {
    operator fun plus(other: Vector2) = Vector2(x + other.x, y + other.y)
    operator fun times(scalar: Double) = Vector2(x * scalar, y * scalar)
}

val a = Vector2(1.0, 2.0)
val b = Vector2(3.0, 4.0)
println(a + b)       // Vector2(x=4.0, y=6.0)
println(a * 2.0)       // Vector2(x=2.0, y=4.0)
```

`operator fun plus` je to, čo `a + b` naozaj volá pod kapotou — `+` je čistý syntax sugar pre
`a.plus(b)`. Každý aritmetický operátor (`plus`, `minus`, `times`, `div`, `rem`) nasleduje túto
istú konvenciu.

## `get` a `set` — pre vlastné indexovanie

```kotlin
class Grid(private val width: Int, private val height: Int) {
    private val cells = Array(width * height) { 0 }

    operator fun get(x: Int, y: Int): Int = cells[y * width + x]
    operator fun set(x: Int, y: Int, value: Int) { cells[y * width + x] = value }
}

val grid = Grid(10, 10)
grid[3, 4] = 7          // zavolá set(3, 4, 7)
println(grid[3, 4])      // zavolá get(3, 4) -> 7
```

Presne takto funguje interne `[]` indexovanie na `List`/`MutableList` — `operator fun get` a
`operator fun set` sú aj na týchto typoch štandardné knižnicové funkcie, nie kompilátorová mágia
vyhradená pre vstavané kolekcie.

## `invoke` — spravenie objektu volateľným ako funkcia

```kotlin
class Multiplier(val factor: Int) {
    operator fun invoke(value: Int): Int = value * factor
}

val double = Multiplier(2)
println(double(5))    // 10 — zavolá double.invoke(5)
```

`invoke` umožní *inštanciu* volať syntaxou volania funkcie priamo — naozaj užitočné pri budovaní
konfigurovateľných, znovupoužiteľných "function-like" objektov, a presný mechanizmus za tým, ako
môže byť trieda použitá, akoby bola lambda v určitých API.

## `contains` — poháňanie operátora `in`

```kotlin
data class DateRange(val start: LocalDate, val end: LocalDate) {
    operator fun contains(date: LocalDate) = date in start..end
}

val range = DateRange(LocalDate.of(2026, 1, 1), LocalDate.of(2026, 12, 31))
println(LocalDate.of(2026, 6, 15) in range)    // true — zavolá range.contains(...)
```

## Kedy operator overloading pomáha čitateľnosti vs. kedy nie

```kotlin
✅ val total = price1 + price2                 // "+" pre dve Money hodnoty sa číta prirodzene
✅ if (userId in allowedIds) { ... }              // "in" pre membership check sa číta prirodzene
✅ matrix[row, col] = value                         // vlastné indexovanie sa číta prirodzene

❌ operator fun Order.plus(discount: Discount): Order = this.applyDiscount(discount)
   val discounted = order + discount              // "+" pre "aplikuj zľavu"? nie zjavne to, čo tu + znamená
```

:::warning
Operator overloading by mal robiť kód čitateľnejším bližšie k jeho skutočnému doménovému
významu (vektor/maticová matematika, peňažná aritmetika, membership rozsahu) — nie znovupoužiť
*symbol* operátora pre operáciu bez reálnej koncepčnej súvislosti s tým, čo tento symbol
konvenčne znamená. `order + discount` je nejednoznačné spôsobom, akým `order.applyDiscount(discount)`
jednoducho nie je; čitatelia prinášajú reálne očakávania o tom, čo `+` typicky robí, a porušenie
tohto očakávania kvôli "stručne vyzerajúcemu" kódu je reálna cena za čitateľnosť, nie štýlová
drobnosť.
:::

## Plný zoznam preťažiteľných operátorov, v skratke

```text
+  -  *  /  %          → plus, minus, times, div, rem
+=  -=  *=  /=  %=       → plusAssign, minusAssign, atď. (pre mutovateľné in-place operácie)
==  !=                     → equals (zvyčajne cez auto-vygenerovanú verziu data class)
<  >  <=  >=                 → compareTo
[]                              → get / set
()                                → invoke
in                                  → contains
..                                    → rangeTo
```

Väčšina z nich sa v bežnom kóde používa oveľa menej než `plus`/`get`/`invoke` — vedieť, že
existujú, má väčší význam pri čítaní kódu knižníc, ktoré ich používajú, než pri siahaní po
všetkých vo vlastnom.
