---
sidebar_position: 2
title: Extension Vlastnosti
---

# Extension Vlastnosti

Rovnaká myšlienka ako [extension funkcie](./extension-functions.md), aplikovaná na vlastnosti —
pridanie property-like accessora k existujúcemu typu, s jedným dôležitým štrukturálnym
obmedzením.

## Definovanie

```kotlin
val String.lastChar: Char
    get() = this[this.length - 1]

val String.wordCount: Int
    get() = this.trim().split(Regex("\\s+")).size
```

```kotlin
println("Hello".lastChar)          // 'o'
println("The quick fox".wordCount)   // 3
```

Volaná presne ako skutočná vlastnosť — `"Hello".lastChar`, žiadne zátvorky — aj keď je pod
kapotou vypočítaná getter funkciou, rovnako ako akákoľvek vlastnosť s custom getterom v Kotline.

## Kľúčové obmedzenie: žiadne backing field

```kotlin
❌ var String.customTag: String = ""    // chyba kompilácie — extension vlastnosti nemôžu mať backing field
```

Skutočná vlastnosť triedy vie uložiť vlastnú hodnotu priamo (backing field). Extension vlastnosť
**nemôže** — nie je kde by toto úložisko naozaj mohlo žiť, keďže vôbec neupravuješ layout pamäte
pôvodnej triedy, len pridávaš computed accessor navrch. Každá extension vlastnosť musí byť
**vypočítaná** z dát, ktoré receiver už má (alebo z externého úložiska — pozri nižšie), nie
uložená priamo na samotnej extension.

```kotlin
✅ val String.lastChar: Char
    get() = this[this.length - 1]      // vypočítané z `this` pri každom prístupe

❌ var String.lastChar: Char = ' '        // toto nejde — žiadne backing field na uloženie
```

## Mutovateľná extension vlastnosť, spravená správne

```kotlin
var StringBuilder.lastChar: Char
    get() = this[this.length - 1]
    set(value) {
        this.setCharAt(this.length - 1, value)
    }
```

Toto funguje, lebo setter upravuje **vlastný existujúci stav receivera** (mutovateľný character
buffer `StringBuilder`) namiesto pokusu uložiť nové pole na samotnej extension — mutácia sa deje
cez vlastné API receivera, nie cez úložisko, ktoré poskytuje extension.

## Ak naozaj potrebuješ externé úložisko na inštanciu

```kotlin
private val tags = WeakHashMap<Any, String>()

var Any.tag: String?
    get() = tags[this]
    set(value) { tags[this] = value }
```

Obchádzka pomocou externej mapy, kľúčovanej inštanciou receivera — naozaj užitočná v zriedkavých
prípadoch (napr. pripájanie metadát k objektom z knižnice, ktorú nekontroluješ), ale siahni po nej
zámerne, nie ako rutinný vzor; pridáva reálnu zložitosť (memory management cez `WeakHashMap` na
predídenie leaknutiu referencií) pre pomerne úzku potrebu.

## Kedy sa extension vlastnosti oplatia

```kotlin
val View.isVisible: Boolean
    get() = this.visibility == View.VISIBLE

val Context.screenWidth: Int
    get() = resources.displayMetrics.widthPixels
```

Naozaj užitočné, keď sa vypočítaná, len-na-čítanie "property-shaped" hodnota číta prirodzenejšie
než volanie funkcie — `view.isVisible` pred `view.isVisible()` — pre niečo koncepčne vlastnosť
receivera, len nie doslova takto uloženú.
