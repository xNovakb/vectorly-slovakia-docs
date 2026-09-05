---
sidebar_position: 1
title: Základy Generík
---

# Základy Generík

Generiká umožnia funkcii alebo triede pracovať s **typovým parametrom** namiesto jedného pevného
typu — ten istý kód funguje pre `List<Int>`, `List<String>`, `List<User>`, bez jeho duplikovania
na typ.

## Generické funkcie

```kotlin
fun <T> firstOrDefault(list: List<T>, default: T): T {
    return if (list.isNotEmpty()) list[0] else default
}

firstOrDefault(listOf(1, 2, 3), 0)          // Int verzia
firstOrDefault(listOf("a", "b"), "none")      // String verzia, tá istá funkcia
```

`<T>` deklaruje typový parameter; kompilátor odvodí konkrétny typ (`Int`, `String`) z argumentov
na každom mieste volania — nemusíš písať `firstOrDefault<Int>(...)` explicitne, pokiaľ to
inference naozaj nedokáže zistiť sama.

## Generické triedy

```kotlin
class Box<T>(private var content: T) {
    fun get(): T = content
    fun set(value: T) { content = value }
}

val intBox = Box(42)
val stringBox = Box("hello")
```

`Box<T>` je jedna definícia triedy, ktorá sa pri každom použití stane `Box<Int>`, `Box<String>`,
atď. — každá inštancia je stále silne typovaná (nemôžeš `intBox.set("oops")`, to je chyba
kompilácie).

## Ohraničené typové parametre

```kotlin
fun <T : Comparable<T>> max(a: T, b: T): T {
    return if (a > b) a else b
}

max(3, 7)          // funguje — Int implementuje Comparable<Int>
max("a", "b")        // funguje — String implementuje Comparable<String>
```

`<T : Comparable<T>>` obmedzí `T` len na typy, ktoré implementujú `Comparable<T>` — bez tohto
ohraničenia by telo funkcie nemohlo použiť `>` vôbec, keďže úplne neobmedzené `T` nemá garantované
žiadne operácie nad rámec toho, čo poskytuje `Any`.

## Viacnásobné ohraničenia

```kotlin
fun <T> process(item: T) where T : Comparable<T>, T : java.io.Serializable {
    // item je garantovane spĺňa OBE obmedzenia
}
```

`where` umožní typovému parametru byť ohraničenému viac ako jednou požiadavkou súčasne — naozaj
užitočné, aj keď menej bežné dennodenne než jedno ohraničenie.

## Prečo generiká nad `Any`

```kotlin
❌ fun firstOrDefault(list: List<Any>, default: Any): Any { ... }
   val x: Int = firstOrDefault(listOf(1, 2, 3), 0) as Int   // potrebný manuálny cast, nebezpečné

✅ fun <T> firstOrDefault(list: List<T>, default: T): T { ... }
   val x: Int = firstOrDefault(listOf(1, 2, 3), 0)             // žiadny cast, typovo kontrolované
```

Použitie `Any` úplne stratí typovú informáciu — volajúci musí výsledok pretypovať späť na
skutočný typ, bez akejkoľvek compile-time garancie, že je cast vôbec správny. Generiká zachovajú
skutočný typ celú cestu, zachytávajúc nezhodu typu počas kompilácie namiesto
`ClassCastException` za behu.

## Čo nasleduje

Táto stránka pokrýva generiká tak, ako ich má väčšina jazykov. Vlastný twist Kotlinu —
[declaration-site variancia](./variance-in-out.md) (`in`/`out`) — sa naozaj líši od toho, ako s
rovnakým problémom zaobchádza Java, a [reified typové parametre](./reified-type-parameters.md)
riešia obmedzenie, ktoré generiká normálne majú na JVM a väčšina jazykov s ním jednoducho žije.
