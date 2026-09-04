---
sidebar_position: 1
title: "let, run, with"
---

# let, run, with

Scope funkcie Kotlinu vykonajú blok kódu v kontexte objektu, bez potreby samostatnej pomenovanej
premennej preň. `let`, `run` a `with` sú tri z piatich (`apply` a `also` sú pokryté v
[apply a also](./apply-also.md)) — táto stránka sa zameriava na tie sústredené okolo
**vrátenia vypočítanej hodnoty**.

## `let` — objekt ako `it`, vráti výsledok lambdy

```kotlin
val name: String? = "Jane"

val length = name?.let {
    println("Name is $it")
    it.length
}
```

`let` odovzdá receiver ako `it` (alebo pomenovaný parameter), a vráti, čokoľvek posledný výraz
lambdy vyhodnotí. Jeho najbežnejšie reálne použitie: bezpečná práca s nullable hodnotou len keď
nie je `null`, pomocou vzoru `?.let { }` vyššie — blok jednoducho nebeží, ak je `name` `null`.

```kotlin
val user: User? = fetchUser()
user?.let { u ->
    sendWelcomeEmail(u.email)
    logSignup(u.id)
}
```

## `run` — objekt ako `this`, vráti výsledok lambdy

```kotlin
val result = "hello".run {
    uppercase().reversed()
}
// result == "OLLEH"
```

`run` je ako `let`, ale receiver je dostupný ako `this` (implicitne — prístup k členom nepotrebuje
kvalifikátor) namiesto `it`. Použiteľné aj *bez* receivera, ako obyčajný scoping blok:

```kotlin
val configured = run {
    val a = computeA()
    val b = computeB()
    a + b
}
```

Táto samostatná forma je užitočná na vyčlenenie pár dočasných premenných (`a`, `b` tu) z okolitého
scope, bez potreby samostatnej funkcie.

## `with` — nie extension funkcia, berie objekt ako argument

```kotlin
val sb = StringBuilder()
val message = with(sb) {
    append("Hello, ")
    append("world!")
    toString()
}
```

`with` sa správa ako `run`-ova forma receiver-ako-`this`, ale volá sa inak: `with(obj) { }`
namiesto `obj.run { }`. Keďže je to obyčajná funkcia berúca receiver ako parameter (nie extension
funkcia volaná *na* niečom), `with` sa číta o niečo lepšie, keď objekt už existuje a nezreťazuješ
z nullable hodnoty — `run`/`let` sú zvyčajne lepšia voľba pri zreťazení z výrazu alebo nullable.

## `let` vs. `run` vs. `with` na pohľad

| | Prístup k receiveru | Vráti | Typické použitie |
|---|---|---|---|
| `let` | `it` | Výsledok lambdy | Null-safety reťazenie (`?.let { }`), transformácia hodnoty |
| `run` | `this` | Výsledok lambdy | Vyčlenenie dočasných premenných, reťazenie výpočtu na receiveri |
| `with` | `this` | Výsledok lambdy | Zoskupenie viacerých volaní na už existujúcom objekte |

## Pokračovanie porovnania

[apply a also](./apply-also.md) pokrýva ďalšie dve scope funkcie — tie postavené okolo
**konfigurácie objektu a vrátenia samotného objektu**, naozaj odlišný use case oproti týmto trom.
[Výber Správnej Scope Funkcie](./choosing-the-right-scope-function.md) spája všetkých päť dokopy
do jedného praktického návodu na rozhodovanie.
