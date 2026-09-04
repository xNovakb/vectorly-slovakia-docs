---
sidebar_position: 3
title: Delegácia
---

# Delegácia

Kotlin má vstavanú podporu jazyka pre delegation pattern cez kľúčové slovo `by` — pre **class
delegation** (objekt implementujúci interface presmerovaním na iný objekt) aj **property
delegation** (get/set logika vlastnosti poskytnutá samostatným delegate objektom).

## Class delegation — kompozícia bez boilerplate

```kotlin
interface SoundMaker {
    fun makeSound(): String
}

class Dog : SoundMaker {
    override fun makeSound() = "Woof!"
}

class LoudDog(private val dog: SoundMaker) : SoundMaker by dog {
    // makeSound() sa automaticky presmeruje na `dog` — žiadny manuálny override netreba
}
```

```kotlin
val loud = LoudDog(Dog())
println(loud.makeSound())    // "Woof!" — presmerované automaticky
```

Bez `by dog` by `LoudDog` musel ručne napísať `override fun makeSound() = dog.makeSound()` pre
každú jednu metódu na interface — únavné a náchylné na chyby, ako interface rastie. `by`
automaticky vygeneruje tento forwarding boilerplate, pričom ti stále dovolí selektívne prepísať
jednotlivé metódy, keď treba:

```kotlin
class LoudDog(private val dog: SoundMaker) : SoundMaker by dog {
    override fun makeSound() = dog.makeSound().uppercase() + "!!!"   // prepíš len túto jednu
}
```

Toto je composition-over-inheritance, spravené ergonomicky — `LoudDog` vôbec nie je subclass
`Dog`, *má* `SoundMaker` a presmerúva naň, ale číta sa takmer tak stručne, akoby zdedil správanie.

## Property delegation — `by lazy`

```kotlin
val expensiveValue: String by lazy {
    println("Computing...")
    computeExpensiveValue()
}
```

Výpočet vnútri `lazy { }` beží len pri **prvom** prístupe k `expensiveValue`, a výsledok je
cachovaný pre každý ďalší prístup — naozaj užitočné pre čokoľvek drahé, čo možno nikdy nebude
potrebné, alebo je potrebné najviac raz.

```kotlin
val config: Config by lazy { loadConfigFromDisk() }
// loadConfigFromDisk() nebeží, kým sa `config` prvýkrát nepristúpi, ak vôbec
```

## Property delegation — `Delegates.observable`

```kotlin
import kotlin.properties.Delegates

var name: String by Delegates.observable("initial") { property, old, new ->
    println("${property.name} changed from $old to $new")
}

name = "Jane"    // vypíše: "name changed from initial to Jane"
```

Spustí callback pri každej zmene vlastnosti — užitočné na reagovanie na zmeny stavu (UI update,
invalidácia cache, validácia) bez ručného písania custom settera, ktorý manuálne volá túto logiku
zakaždým.

## Písanie vlastného delegate

```kotlin
class LoggingDelegate<T>(private var value: T) {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): T {
        println("Reading ${property.name}: $value")
        return value
    }
    operator fun setValue(thisRef: Any?, property: KProperty<*>, newValue: T) {
        println("Setting ${property.name} to $newValue")
        value = newValue
    }
}

var tracked: Int by LoggingDelegate(0)
```

Akákoľvek trieda implementujúca `getValue`/`setValue` (nasledujúca presne tento operator-function
tvar) môže slúžiť ako property delegate — `by lazy` a `by Delegates.observable` sú jednoducho
vlastné implementácie tejto istej konvencie v štandardnej knižnici, nie špeciálna kompilátorová
mágia nedostupná pre vlastný kód.

## Prečo na `by` záleží ako na všeobecnom idiome

Oba tvary delegácie riešia rovnaký podkladový problém: znovupoužitie správania z iného objektu
bez dedenia, a bez ručného písania forwarding/boilerplate kódu. V kombinácii so
[sealed classes](./sealed-classes-and-when.md) na obmedzené hierarchie a
[value classes](./inline-value-classes.md) na type-safe wrappery, delegácia zaokrúhľuje odpoveď
Kotlinu na "uprednostni kompozíciu pred dedením" ako naozaj pohodlnú, nízko-boilerplate predvoľbu
namiesto ašpiračného princípu, proti ktorému bojuje samotná ergonómia jazyka.
