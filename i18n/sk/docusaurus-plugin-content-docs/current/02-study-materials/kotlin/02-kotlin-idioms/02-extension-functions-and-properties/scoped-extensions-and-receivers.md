---
sidebar_position: 3
title: Scoped Extensions a Receivery
---

# Scoped Extensions a Receivery

Kombinácia [extension funkcií](./extension-functions.md) s lambdami produkuje niečo mocnejšie než
oboje samostatne: **funkčný typ s receiverom** — presný mechanizmus za Kotlin `apply`/`run`
(pozri [let, run, with](../01-scope-functions/let-run-with.md) a
[apply, also](../01-scope-functions/apply-also.md)) a základ type-safe DSL (pozri
[Budovanie DSL](../05-building-dsls/dsl-basics.md)).

## Funkčný typ s receiverom

```kotlin
val greet: String.() -> Unit = {
    println("Hello, $this!")
}

"World".greet()    // vypíše "Hello, World!"
```

`String.() -> Unit` je funkčný typ, kde telo funkcie má `this` naviazané na `String` — odlišné od
obyčajného `(String) -> Unit`, kde by string bol obyčajný parameter, nie receiver, na ktorom
môžeš priamo volať ďalších členov `String`.

## Odovzdanie ako parametra — takto naozaj funguje `apply`

```kotlin
fun <T> T.myApply(block: T.() -> Unit): T {
    this.block()
    return this
}
```

Toto je (približne) skutočná štandardná knižnicová implementácia `apply`. `block: T.() -> Unit`
znamená, že lambda odovzdaná `myApply` beží s `this` naviazaným na receiver — presne preto vnútri
bloku `apply { }` môžeš odkazovať priamo na vlastné členy receivera bez explicitného
kvalifikátora.

## Budovanie vlastnej scoped-extension funkcie

```kotlin
class HttpRequestBuilder {
    var url: String = ""
    var method: String = "GET"
    val headers = mutableMapOf<String, String>()
}

fun buildRequest(block: HttpRequestBuilder.() -> Unit): HttpRequestBuilder {
    val builder = HttpRequestBuilder()
    builder.block()
    return builder
}
```

```kotlin
val request = buildRequest {
    url = "https://api.example.com/users"
    method = "POST"
    headers["Authorization"] = "Bearer abc123"
}
```

Vnútri trailing lambdy sa `url`, `method` a `headers` prístupujú, akoby boli lokálne v scope —
lebo v podstate sú, cez implicitný `this: HttpRequestBuilder` receiver, s ktorým lambda beží.
Presne tento vzor — funkcia berúca `SomeType.() -> Unit` lambdu, konštruujúca a konfigurujúca
inštanciu vnútri nej — je jeden najbežnejší stavebný blok za Kotlin DSL.

## `it` vs. implicitné `this` — praktický rozdiel, ktorý toto vytvára

```kotlin
// obyčajný lambda parameter — musí sa odkazovať explicitne
inline fun configure(block: (Config) -> Unit) {
    val config = Config()
    block(config)
}
configure { it.name = "test" }

// receiver lambda — odkazovaná implicitne, číta sa ako mini-DSL
inline fun configureScoped(block: Config.() -> Unit) {
    val config = Config()
    config.block()
}
configureScoped { name = "test" }
```

Oboje dosahuje funkčne to isté — receiver forma sa jednoducho číta prirodzenejšie pre
konfiguračne tvarovaný kód, čo je presne prečo `apply`, vlastné builder-style API Kotlinu, a
vlastné DSL sa spoliehajú konkrétne na ňu namiesto obyčajného lambda parametra.

## Kam toto vedie ďalej

[Budovanie DSL](../05-building-dsls/dsl-basics.md) priamo pokračuje s týmto mechanizmom a stavia
naň plný riešený príklad (HTML-like DSL), vrátane [Type-Safe Builderov](../05-building-dsls/type-safe-builders.md)
anotácie `@DslMarker` — ktorá existuje konkrétne na to, aby predišla zmätku, na *ktorý* receiver
sa nekvalifikované volanie resolvuje, akonáhle sa tieto scoped-extension bloky začnú vnárať.
