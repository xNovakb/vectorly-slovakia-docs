---
sidebar_position: 2
title: "apply, also"
---

# apply, also

Kým [let, run, with](./let-run-with.md) vrátia **vypočítanú hodnotu**, `apply` a `also` vrátia
**samotný pôvodný objekt** — postavené konkrétne na konfiguráciu objektu alebo vykonanie
vedľajšieho efektu, s pokračovaním v používaní toho istého objektu.

## `apply` — objekt ako `this`, vráti objekt

```kotlin
val person = Person().apply {
    name = "Jane"
    age = 30
    email = "jane@example.com"
}
```

Keďže receiver je `this` (implicitne), `apply` sa číta ako konfiguračný blok — nastav niekoľko
vlastností na čerstvo vytvorenom objekte, potom dostaň späť ten istý objekt, pripravený na
použitie. Toto je idiomatická Kotlin náhrada za Java-style builder pattern v mnohých prípadoch,
keď sú nastavované vlastnosti obyčajné mutovateľné `var`.

```kotlin
val intent = Intent(context, DetailActivity::class.java).apply {
    putExtra("id", itemId)
    putExtra("source", "notification")
}
startActivity(intent)
```

## `also` — objekt ako `it`, vráti objekt

```kotlin
val numbers = mutableListOf(1, 2, 3)
    .also { println("Initial list: $it") }
    .also { it.add(4) }
```

`also` je ako `apply`, ale receiver je `it` namiesto implicitného `this` — užitočné, keď chceš byť
explicitný pri odkazovaní na objekt (alebo keď je hlavným účelom bloku **vedľajší efekt**, ako
logovanie, namiesto konfigurácie vlastných vlastností objektu).

```kotlin
val result = computeExpensiveValue()
    .also { logger.debug("Computed value: $it") }
```

## Prečo `also` pred `apply` pri obyčajnom logovaní

```kotlin
// ❌ funguje, ale `this` vnútri je trochu zavádzajúce pre čistý vedľajší efekt
someObject.apply {
    println("Value: $this")
}

// ✅ `it` jasne ukazuje, že toto inšpektuje objekt, nie ho konfiguruje
someObject.also {
    println("Value: $it")
}
```

Toto je štýlová konvencia, nie tvrdé technické pravidlo — ale naozaj užitočná: implicitné `this`
`apply` sa číta prirodzene, keď **nastavuješ vlastnosti na receiveri**; explicitné `it` `also` sa
číta prirodzene, keď **robíš niečo s** receiverom bez jeho úpravy.

## `apply` vs. `also`, vedľa seba

| | Prístup k receiveru | Vráti | Typické použitie |
|---|---|---|---|
| `apply` | `this` (implicitne) | Objekt | Konfigurácia vlastností čerstvo vytvoreného objektu |
| `also` | `it` | Objekt | Vedľajší efekt (logovanie, validácia) uprostred reťazenia |

## Oba vrátia objekt — reťazenie zostáva neprerušené

```kotlin
val list = mutableListOf<Int>()
    .apply { add(1); add(2) }
    .also { println("After adding: $it") }
    .apply { add(3) }
```

Keďže oba vrátia pôvodný objekt, voľne sa reťazia medzi sebou aj s obyčajnými volaniami metód —
presne toto robí scope funkcie tak dobre skladateľné v reálnom kóde namiesto potreby
samostatných dočasných premenných pri každom kroku.

Pozri [Výber Správnej Scope Funkcie](./choosing-the-right-scope-function.md) pre jednu tabuľku
naprieč všetkými piatimi scope funkciami pokrytými na tejto a predchádzajúcej stránke.
