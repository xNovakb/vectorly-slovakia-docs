---
sidebar_position: 2
title: "Variancia: in a out"
---

# Variancia: in a out

Variancia odpovedá na konkrétnu otázku: ak je `Dog` podtyp `Animal`, je `Box<Dog>` podtyp
`Box<Animal>`? Odpoveď nie je automaticky "áno" — a Kotlin ti umožní deklarovať odpoveď
explicitne, priamo tam, kde je samotný generický typ definovaný.

## Problém, ktorý variancia rieši

```kotlin
class Box<T>(var content: T)

fun printAnimal(box: Box<Animal>) {
    println(box.content)
}

val dogBox = Box<Dog>(Dog())
printAnimal(dogBox)    // ❌ predvolene chyba kompilácie — Box<Dog> NIE JE Box<Animal>
```

Predvolene sú generické typy **invariantné** — `Box<Dog>` a `Box<Animal>` sú považované za úplne
nesúvisiace typy, aj keď je `Dog` `Animal`. Toto je zámerné: `Box<T>` je tu mutovateľný (`set`),
a povolenie použiť `Box<Dog>` ako `Box<Animal>` by umožnilo niekomu zavolať
`box.content = Cat()` na niečom, čo je v skutočnosti `Box<Dog>` — reálna diera v typovej
bezpečnosti.

## `out` — kovariancia, pre read-only producentov

```kotlin
class ReadOnlyBox<out T>(val content: T)

fun printAnimal(box: ReadOnlyBox<Animal>) {
    println(box.content)
}

val dogBox = ReadOnlyBox<Dog>(Dog())
printAnimal(dogBox)    // ✅ funguje — ReadOnlyBox<Dog> JE považovaný za ReadOnlyBox<Animal>
```

`out T` deklaruje, že `T` sa vždy objavuje len vo **výstupných** pozíciách (návratové typy, `val`
vlastnosti) — trieda len *produkuje* `T`, nikdy ho *nekonzumuje*. Vzhľadom na túto garanciu
kompilátor povolí vzťah podtypovania: keďže `ReadOnlyBox<Dog>` ti vždy vie odovzdať len `Dog`
(ktorý je vždy bezpečné považovať za `Animal`), je bezpečné použiť ho kdekoľvek sa očakáva
`ReadOnlyBox<Animal>`. `List<T>` v Kotline je deklarovaný `out` presne z tohto dôvodu — je
len-na-čítanie.

## `in` — kontravariancia, pre write-only konzumentov

```kotlin
class Consumer<in T> {
    fun consume(item: T) {
        println("Consuming: $item")
    }
}

val animalConsumer: Consumer<Animal> = Consumer()
val dogConsumer: Consumer<Dog> = animalConsumer    // ✅ funguje — OPAČNÝ smer podtypovania
```

`in T` deklaruje, že `T` sa vždy objavuje len vo **vstupných** pozíciách (parametre funkcií) —
trieda len *konzumuje* `T`, nikdy ho neprodukuje. Toto obráti vzťah podtypovania: `Consumer<Animal>`
(ktorý vie skonzumovať akékoľvek `Animal`, vrátane `Dog`) je bezpečne použiteľný kdekoľvek je
potrebný `Consumer<Dog>` — vie zvládnuť všetko, čo by zvládol `Consumer<Dog>`, a viac.

## Prečo sa prístup Kotlinu naozaj líši od Javy

Java toto rieši cez **use-site** varianciu (wildcards na mieste volania: `List<? extends Animal>`,
`List<? super Dog>`) — každý volajúci si musí pamätať a správne anotovať varianciu pri každom
použití. Kotlin používa **declaration-site** varianciu — `out`/`in` je deklarované **raz**, na
samotnej definícii triedy/interface, a každé použitie automaticky dostane správne správanie
variancie bez potreby wildcards na mieste volania vôbec.

```java
// Java: variancia anotovaná na každom mieste použitia
List<? extends Animal> animals = dogList;
```

```kotlin
// Kotlin: variancia deklarovaná raz, na vlastnej definícii List — jednoducho to funguje všade
val animals: List<Animal> = dogList
```

Toto je skutočná ergonomická výhra — typy štandardnej knižnice Kotlinu (`List` ako `out`, typy
parametrov funkcií ako `in`) už majú rozumnú varianciu vstavanú, takže väčšina bežného kódu z
toho profituje bez toho, aby vôbec potrebovala niekedy napísať `in`/`out`; hlavne to záleží pri
**navrhovaní vlastných** generických tried.

## Mnemotechnická pomôcka

```text
out  = "ide VON z boxu"    = producer  = kovariantné     = List<out T>
in   = "ide DO boxu"        = consumer  = kontravariantné  = Comparator<in T>
```

`Comparator<in T>` je reálny príklad zo štandardnej knižnice: `Comparator<Animal>` vie porovnať
akékoľvek dve `Animal`, vrátane dvoch `Dog` — takže je bezpečne použiteľný kdekoľvek sa očakáva
`Comparator<Dog>`, kontravariantný smer.
