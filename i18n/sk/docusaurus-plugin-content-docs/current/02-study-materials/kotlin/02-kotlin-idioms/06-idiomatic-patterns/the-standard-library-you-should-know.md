---
sidebar_position: 3
title: Štandardná Knižnica, Ktorú by si Mal Poznať
---

# Štandardná Knižnica, Ktorú by si Mal Poznať

Zbierka stdlib funkcií, ktoré sú naozaj užitočné, neustále sa objavujú v idiomatickom Kotlin
kóde, ale ľahko sa prehliadnu, ak si sa Kotlin naučil primárne písaním Java-tvarovaného kódu s
Kotlin syntaxou.

## `takeIf` / `takeUnless` — podmienená hodnota alebo null

```kotlin
val positive = number.takeIf { it > 0 }        // číslo, ak je kladné; inak null
val nonEmpty = text.takeUnless { it.isEmpty() }   // text, pokiaľ nie je prázdny; inak null
```

```kotlin
val validEmail = email.takeIf { it.contains("@") } ?: "invalid@example.com"
```

Naozaj užitočný vzor: reťazenie `takeIf`/`takeUnless` s `?:` alebo
[`let`](../01-scope-functions/let-run-with.md) premení viacriadkovú `if` kontrolu na jeden výraz —
siahni po tom, keď sa hodnota má podmienene stať `null` (aby ju ďalej spracoval zvyšok
null-safety reťazenia), nie ako náhradu za každý `if` výrok.

## `repeat` — čistejší ohraničený cyklus

```kotlin
repeat(3) {
    println("Attempt $it")
}
```

Ekvivalent `for (i in 0 until 3)`, ale číta sa priamejšie ako "urob toto N-krát," keď na
samotnej hodnote indexu veľmi nezáleží nad rámec logovania/počítania.

## `use` — garantované vyčistenie zdroja

```kotlin
File("data.txt").bufferedReader().use { reader ->
    println(reader.readLine())
}    // reader.close() sa zavolá automaticky, aj keď sa vnútri bloku hodí exception
```

`use` je Kotlin ekvivalent Java try-with-resources — automaticky zavolá `.close()` na receiveri
po dokončení bloku, **vrátane** keď blok hodí exception. Akýkoľvek `Closeable`/`AutoCloseable`
(file handles, databázové spojenia, sieťové sockety) by mal byť všeobecne obalený v `use { }`
namiesto manuálneho volania `.close()` na konci funkcie, čo potichu leakne zdroj pri akomkoľvek
predčasnom returne alebo hodenej exception po ceste.

## `check` / `require` / `assert` — rôzna sémantika zlyhania

```kotlin
fun withdraw(amount: Int) {
    require(amount > 0) { "Amount must be positive, got $amount" }    // IllegalArgumentException
    check(balance >= amount) { "Insufficient balance" }                 // IllegalStateException
    assert(balance >= 0) { "Balance invariant violated" }                 // AssertionError, kontrolované len ak sú assertions zapnuté
    balance -= amount
}
```

Vyzerajú podobne, ale signalizujú naozaj rôzne veci:
- **`require`** — **volajúci** odovzdal zlý vstup. Hodí `IllegalArgumentException`. Použi na
  validáciu argumentov funkcie.
- **`check`** — **vlastný stav objektu/programu** je zlý, nezávisle od toho, čo bolo práve
  odovzdané. Hodí `IllegalStateException`. Použi na overenie interných invariantov.
- **`assert`** — sanity check určený primárne pre vývoj/testovanie; typicky vypnutý v produkčných
  JVM behoch, pokiaľ nie sú assertions explicitne zapnuté (flag `-ea`). Nespoliehaj sa na
  `assert` pre čokoľvek, čo naozaj musí bežať v produkcii — použi na to `require`/`check`.

## `apply`, `also`, `let`, `run`, `with` — už pokryté, ale oplatí sa tu znovu zdôrazniť

Pozri [Scope Funkcie](../01-scope-functions/let-run-with.md) — týchto päť sú tiež stdlib funkcie,
len dosť dôležité, aby si zaslúžili vlastnú dedikovanú sekciu skôr v tejto téme namiesto
zakopania v zbernom zozname.

## `lateinit` a `by lazy` — odloženie inicializácie, odlišne

```kotlin
lateinit var name: String    // musí byť `var`, non-null typ, inicializovaná pred prvým použitím — hodí chybu, ak sa pristúpi príliš skoro

val config: Config by lazy { loadConfig() }    // vypočítaná raz, pri prvom prístupe
```

Rôzne nástroje pre rôzne situácie: `lateinit` je pre vlastnosť, ktorá bude určite nastavená pred
použitím (bežné v dependency injection alebo Android lifecycle callbackoch), ale nie je dostupná
v čase konštrukcie. `by lazy` (pozri [Delegácia](../03-classes-advanced/delegation.md)) je pre
`val`, ktorej hodnota je naozaj vypočítaná pri prvom prístupe a cachovaná — siahni po `lateinit`,
keď to niečo externé neskôr priradí, po `by lazy`, keď je hodnota samo-vypočítateľná, ale drahá
alebo možno nepotrebná.

## Záverečná myšlienka k tejto téme

Každá stránka v tejto téme Kotlin Idioms & Advanced Features — scope funkcie, extensions, sealed
classes, generiká, DSL, a tento posledný zberný zoznam — zdieľa jednu podkladovú tému: Kotlin ti
dáva nástroje na priame vyjadrenie *zámeru* (toto je konfiguračný krok, toto je jeden z presne
týchto troch stavov, táto hodnota by sa mala podmienene stať null) namiesto kódovania toho
zámeru len do komentára alebo mena premennej. Siahnutie po tom správnom, na správnom mieste, je
to, čo oddeľuje Kotlin kód, ktorý len kompiluje, od Kotlin kódu, ktorý sa číta ako Kotlin.
