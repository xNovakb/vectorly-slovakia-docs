---
sidebar_position: 3
title: Reified Typové Parametre
---

# Reified Typové Parametre

Obmedzenie, s ktorým väčšina JVM jazykov jednoducho žije: informácia o generickom type je
normálne za behu **zahladená** (erased) (toto platí v Jave aj Kotline, dôsledok toho, ako boli
generiká dodatočne pridané na JVM). Kľúčové slovo `reified` v Kotline je skutočný únikový východ
z tohto obmedzenia — ale len za jednej konkrétnej podmienky.

## Problém: type erasure

```kotlin
fun <T> isOfType(value: Any): Boolean {
    return value is T    // ❌ chyba kompilácie: "Cannot check for instance of erased type T"
}
```

Za behu JVM v skutočnosti nevie, čím `T` bolo — `List<String>` a `List<Int>` sú po skompilovaní
obe len `List`, typový parameter je zahladený. Preto obyčajná generická funkcia nemôže vôbec
urobiť runtime type check voči vlastnému typovému parametru.

## Oprava: `inline` + `reified`

```kotlin
inline fun <reified T> isOfType(value: Any): Boolean {
    return value is T    // ✅ teraz to funguje
}

isOfType<String>("hello")    // true
isOfType<Int>("hello")         // false
```

`reified` je povolené **len** na typovom parametri `inline` funkcie — toto nie je svojvoľné
obmedzenie. Telo inline funkcie sa skopíruje priamo na každé miesto volania počas kompilácie
(pozri ako sa toto spája s použitím `inline` pre receiver lambdy v
[Extension Funkciách](../02-extension-functions-and-properties/scoped-extensions-and-receivers.md))
— takže na každom konkrétnom mieste volania kompilátor presne vie, aký konkrétny typ bol
odovzdaný, a priamo ho dosadí do inline-ovaného kódu. Za behu už pre toto konkrétne volanie
vôbec nezostáva "generické `T`" — bolo už nahradené skutočným typom skôr, než kód vôbec beží.

## Naozaj užitočný reálny prípad

```kotlin
inline fun <reified T> Gson.fromJson(json: String): T {
    return this.fromJson(json, T::class.java)
}

val user: User = gson.fromJson(jsonString)    // netreba ručne odovzdávať User::class.java
```

Bez `reified` volanie JSON-deserializačnej funkcie normálne vyžaduje manuálne odovzdanie cieľovej
triedy (`gson.fromJson(json, User::class.java)`), lebo funkcia nemá iný spôsob, ako za behu
vedieť, do akého typu deserializovať. `reified` umožní typ odvodiť z miesta volania (alebo
deklarovaného návratového typu) a použiť priamo vnútri tela funkcie — naozaj odstraňuje
boilerplate, ktorému by sa inak na JVM nedalo vyhnúť.

## Ďalší bežný vzor: type-safe lookup

```kotlin
inline fun <reified T> List<Any>.filterIsInstanceOf(): List<T> {
    return this.filterIsInstance<T>()
}

val mixed: List<Any> = listOf(1, "two", 3, "four", 5.0)
val strings: List<String> = mixed.filterIsInstanceOf<String>()
```

Samotný `filterIsInstance<T>()`, zo štandardnej knižnice, je implementovaný pomocou `reified`
presne z tohto dôvodu — filtrovanie zmiešanej kolekcie podľa runtime typu jednoducho nie je
vyjadriteľné bez neho.

## Skutočné obmedzenie na zapamätanie

```text
reified   → vyžaduje    → inline
```

Nemôžeš označiť typový parameter ako `reified` na non-`inline` funkcii — kompilátor to rovno
odmietne, lebo bez inline-ovania nemá kompilátor miesto volania, do ktorého by mohol dosadiť
konkrétny typ; obyčajná (non-inlined) funkcia sa skompiluje raz, generický, a naozaj nemá spôsob,
ako vedieť, čím bude `T` na každom budúcom mieste volania.

:::note
Keďže `inline` kopíruje telo funkcie do každého miesta volania, nadmerné používanie `inline`
(najmä na veľkých funkciách, alebo volaných z mnohých miest) môže nafúknuť veľkosť skompilovaného
bytecode. `reified` to konkrétne vyžaduje, ale je to reálny kompromis, o ktorom treba vedieť, ak
siaha po `inline` širšie, než pre túto konkrétnu potrebu.
:::
