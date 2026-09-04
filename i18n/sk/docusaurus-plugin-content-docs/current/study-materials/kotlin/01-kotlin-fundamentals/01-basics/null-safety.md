---
sidebar_position: 3
title: Null Safety
---

# Null Safety

Najčastejšie citovaný dôvod, prečo tímy prijímajú Kotlin: nullabilita je súčasťou samotného
**typového systému**, nie runtime prekvapenie, ktoré odhalí `NullPointerException` až po fakte.

## Nullable vs. non-null typy

```kotlin
var name: String = "Jane"       // non-null — kompilátor garantuje, že toto nikdy nie je null
name = null                       // chyba kompilácie, nie runtime pád

var nickname: String? = "Janey"    // nullable — explicitne zvolené, označené s ?
nickname = null                       // v poriadku — typ hovorí, že toto je dovolené
```

Každý typ je predvolene non-null; nullabilita musí byť **explicitne deklarovaná** s `?`. Toto
obráti predvoľbu Javy, kde každý referenčný typ môže potichu byť null, pokiaľ nepridáš vlastnú
disciplínu (alebo anotáciu ako `@Nullable`), aby si povedal inak.

## Safe call (`?.`)

```kotlin
val nickname: String? = null

val length = nickname?.length     // vráti null namiesto hodenia výnimky, ak je nickname null
println(length)                     // vypíše: null
```

```kotlin
// reťazenie safe calls — skratuje sa na null pri prvom null spojení
val city: String? = user?.address?.city
```

`?.` volá metódu/vlastnosť len ak receiver nie je null; ak je, celý výraz sa vyhodnotí na `null`
namiesto hodenia výnimky — žiadny `if (x != null)` boilerplate netreba pre jednoduchý prípad
"urob toto, ak to tam je."

## Elvis operátor (`?:`)

```kotlin
val nickname: String? = null
val displayName = nickname ?: "Anonymous"    // použi "Anonymous" ak je nickname null

val length = nickname?.length ?: 0             // skombinuj so safe call: predvoľ 0 ak null
```

`?:` poskytne záložnú hodnotu pre null prípad — číta sa prirodzene ako "alebo, ak je to null,
použi toto namiesto." Kombinovanie `?.` a `?:` (`nickname?.length ?: 0`) je jeden z najbežnejších
Kotlin idiómov pre "získaj túto hodnotu, alebo rozumnú predvoľbu, ak chýba."

## Not-null assertion (`!!`) — a prečo je code smell

```kotlin
val nickname: String? = null
val length = nickname!!.length    // okamžite hodí NullPointerException ak je nickname null
```

`!!` povie kompilátoru "ver mi, toto naozaj nie je null" — a ak sa mýliš, hodí presne
`NullPointerException`, ktorej existuje celý null-safety systém Kotlinu na predchádzanie.

:::warning
`!!` je takmer vždy znak, že kód by mal byť reštrukturalizovaný — safe call s rozumnou
predvoľbou (`?:`), skorý return, alebo oprava skutočného zdroja nechcenej nullability je takmer
vždy lepšia než asertovanie cez to. Siahni po `!!` len keď máš skutočnú externú garanciu, ktorú
kompilátor nevidí (napr. hodnota, ktorú si práve skontroloval cez `if (x != null)` spôsobom, aký
smart-cast kompilátora, nižšie, nevie sledovať) — nie ako rutinný spôsob umlčania compiler
warningu.
:::

## Smart casts

```kotlin
fun printLength(text: String?) {
    if (text != null) {
        println(text.length)    // žiadne ?. ani !! tu netreba — kompilátor VIE, že text nie je null
    }
}
```

Vnútri bloku `if (text != null)` kompilátor automaticky zaobchádza s `text` ako s non-null typom
`String` namiesto `String?` — toto je **smart cast**, a presne toto robí `!!` zbytočným vo
väčšine reálneho kódu: explicitná null kontrola nasledovaná normálnym kódom, nie asercia, je
idiomatický vzor.

```kotlin
// smart casts nefungujú naprieč volaniami funkcií, keďže hodnota sa mohla zmeniť medzi
// kontrolou a použitím — tento konkrétny prípad naozaj potrebuje iný prístup:
class Config { var value: String? = null }

fun printValue(config: Config) {
    if (config.value != null) {
        // println(config.value.length)   // ❌ stále chyba — config.value je mutovateľná
                                            //    vlastnosť, mohla sa zmeniť medzi kontrolou a tu
        val value = config.value
        if (value != null) {
            println(value.length)          // ✅ lokálny val MÔŽE byť smart-cast
        }
    }
}
```

## Platform types — kde Kotlin nevie pomôcť

Volanie do Java kódu bez anotácií nullability, Kotlin nevie, či daná referencia môže byť null —
pozri [Platform Types a Java Interop](../06-interop-and-tooling/platform-types-and-java-interop.md)
pre presne to, ako sa táto medzera rieši na hranici Kotlin/Java.
