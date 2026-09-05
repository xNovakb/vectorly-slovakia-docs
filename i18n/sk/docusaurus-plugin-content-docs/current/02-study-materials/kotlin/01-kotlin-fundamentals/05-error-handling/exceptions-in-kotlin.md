---
sidebar_position: 1
title: Výnimky v Kotline
---

# Výnimky v Kotline

## Základné try/catch/finally

```kotlin
fun parseAge(input: String): Int {
    try {
        return input.toInt()
    } catch (e: NumberFormatException) {
        println("Invalid age: $input")
        return -1
    } finally {
        println("Parse attempt finished")    // vždy beží, úspech alebo zlyhanie
    }
}
```

Štrukturálne identické s Javou — skutočný, zámerný rozdiel je v tom, čo Kotlin **nemá**.

## Žiadne checked výnimky — skutočný, zámerný rozdiel

```kotlin
fun readFile(path: String): String {
    return File(path).readText()    // môže hodiť IOException — žiadna `throws` klauzula netreba, žiadna
                                       // chyba kompilácie, ak volajúci ju nechytí
}
```

Java núti metódu deklarovať checked výnimky (`throws IOException`) a núti volajúcich buď ich
chytiť, alebo znovu deklarovať, vynucované kompilátorom. Kotlin nemá **žiadne checked výnimky
vôbec** — každá výnimka je efektívne "unchecked" z pohľadu kompilátora, či už je to
`RuntimeException` alebo nie.

Toto je zámerné rozhodnutie dizajnu Kotlinu, nie prehliadnutie: v praxi checked výnimky mali
tendenciu produkovať buď naozaj ošetrené chyby *alebo* obrovské množstvo `catch (Exception e) {}`
boilerplatu napísaného čisto na uspokojenie kompilátora, poskytujúc malú skutočnú bezpečnosť a
pridávajúc reálny šum. Dizajnéri Kotlinu usúdili, že tento kompromis nestál za to.

## `try` ako výraz

```kotlin
val age = try {
    input.toInt()
} catch (e: NumberFormatException) {
    0    // záložná hodnota, ak parsing zlyhá
}
```

Ako `if` a `when` (pozri [Riadenie Toku](../02-functions-and-control-flow/control-flow.md)),
`try` sa dá použiť ako výraz, produkujúci hodnotu z toho, ktorá vetva naozaj bežala — `age` tu
dostane buď parsovanú hodnotu alebo fallback, v jednom výraze namiesto samostatného `var`
deklarovaného pred blokom a znovu priradeného vnútri.

## `require`, `check`, a `error` — idiomatická validácia

```kotlin
fun withdraw(amount: Double, balance: Double) {
    require(amount > 0) { "Amount must be positive, got $amount" }      // hodí IllegalArgumentException
    check(amount <= balance) { "Insufficient funds" }                     // hodí IllegalStateException
}

fun processStatus(status: String): String = when (status) {
    "active" -> "Running"
    "stopped" -> "Halted"
    else -> error("Unknown status: $status")                               // hodí IllegalStateException
}
```

- **`require`** — na validáciu *argumentov/vstupu* (volajúci urobil niečo zle).
- **`check`** — na validáciu *interného stavu* (niečo, čo samotný kód očakával, že je pravda,
  nie je — bug v logike, nie chyba volajúceho).
- **`error`** — skratka pre bezpodmienečné hodenie `IllegalStateException`, často použitá ako
  `else` vetva inak exhaustívneho `when`, aby "nemožný" prípad hlasno zlyhal namiesto tichého
  prepadnutia.

Tieto sa čítajú oveľa jasnejšie na mieste volania než holé `if (...) throw IllegalArgumentException(...)`,
a sú naozaj idiomatické — siahni po nich namiesto manuálneho `if`/`throw` takmer vždy.

## Multi-catch — nie priamo podporované, riešené inak

```kotlin
try {
    riskyOperation()
} catch (e: Exception) {
    when (e) {
        is IOException -> handleIoError(e)
        is NumberFormatException -> handleParseError(e)
        else -> throw e    // znovu hoď čokoľvek explicitne neošetrené
    }
}
```

Kotlin nemá `catch (IOException | NumberFormatException e)` multi-catch syntax tak, ako ju má
Java — chytenie širokého typu a použitie `when (e) { is X -> ...; is Y -> ... }` vnútri je
idiomatický ekvivalent.

## Kam ísť odtiaľto

[Typ Result](./the-result-type.md) pokrýva alternatívu k výnimkám úplne, pre funkcie, kde "toto
môže zlyhať" je normálny, očakávaný výsledok namiesto naozaj výnimočného.
