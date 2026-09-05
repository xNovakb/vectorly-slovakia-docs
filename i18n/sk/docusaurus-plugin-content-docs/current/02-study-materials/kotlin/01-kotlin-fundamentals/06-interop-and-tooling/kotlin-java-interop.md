---
sidebar_position: 1
title: Kotlin/Java Interop
---

# Kotlin/Java Interop

Kotlin a Java sa kompilujú do rovnakého JVM bytecode (pozri [Čo je Kotlin](../01-basics/what-is-kotlin.md)),
čo je to, čo robí volanie medzi nimi v ktoromkoľvek smere naozaj plynulé, nie kompatibilná
záplata prilepená dodatočne.

## Volanie Javy z Kotlinu

```kotlin
import java.util.ArrayList
import java.time.LocalDate

val list = ArrayList<String>()      // hocijaká Java trieda, použitá priamo, žiaden wrapper
list.add("hello")

val today = LocalDate.now()           // Java standard library, volaná ako natívny Kotlin
println(today.plusDays(7))
```

Žiadna špeciálna syntax netreba — Java trieda je použitá presne ako Kotlin trieda, lebo na úrovni
bytecode neexistuje skutočné rozlíšenie po skompilovaní.

## Volanie Kotlinu z Javy

```kotlin title="User.kt"
class User(val name: String, val email: String) {
    fun greet(): String = "Hello, $name!"
}
```

```java title="Main.java"
User user = new User("Jane", "jane@example.com");
System.out.println(user.greet());
System.out.println(user.getName());    // Kotlin `val name` sa automaticky stane Java getterom
```

Kotlin `val`/`var` vlastnosť sa pod kapotou skompiluje do skutočného Java getteru (a setteru, pre
`var`) — `user.name` v Kotline a `user.getName()` v Jave oba dosiahnu to isté podkladové pole.

## `@JvmStatic` — vystavenie companion object člena ako skutočnej static metódy

```kotlin
class MathUtils {
    companion object {
        @JvmStatic
        fun square(x: Int): Int = x * x
    }
}
```

```java
// Bez @JvmStatic by Java potrebovala: MathUtils.Companion.square(5)
int result = MathUtils.square(5);    // s @JvmStatic, volateľné ako normálna Java static metóda
```

Bez `@JvmStatic` je companion object člen (pozri
[Objects a Companion Objects](../03-classes-and-objects/objects-and-companion-objects.md)) stále
dostupný z Javy, len neohrabane, cez vygenerovaný `Companion` objekt explicitne. `@JvmStatic`
spraví, aby vyzeral pre Java volajúcich ako skutočná `static` metóda.

## `@JvmOverloads` — vystavenie predvolených parametrov ako skutočných overloadov

```kotlin
class Greeter {
    @JvmOverloads
    fun greet(name: String, greeting: String = "Hello") {
        println("$greeting, $name!")
    }
}
```

```java
greeter.greet("Jane");           // funguje — @JvmOverloads vygeneroval tento overload
greeter.greet("Jane", "Hi");       // a tento tiež
```

Predvolené parametre (pozri [Základy Funkcií](../02-functions-and-control-flow/functions-basics.md))
sú čisto vlastnosť Kotlin kompilátora — bez `@JvmOverloads` by Java kód volajúci Kotlin funkciu s
predvolenými parametrami musel vždy odovzdať každý parameter explicitne, bez vygenerovaných
overloadov. `@JvmOverloads` povie kompilátoru, aby vygeneroval skutočné Java overloady, ktoré
Java volajúci očakávajú.

## `@JvmName` — premenovanie pre Javu, keď by sa Kotlin meno zrážalo

```kotlin
@file:JvmName("StringUtils")

fun String.isValidEmail(): Boolean = contains("@")
```

Kotlin file-level funkcie sa predvolene kompilujú do triedy pomenovanej podľa súboru (napr.
`StringExtensionsKt` pre súbor `StringExtensions.kt`) — `@JvmName` ti umožní explicitne ovládať
toto vygenerované meno triedy, užitočné, keď by predvolené bolo neohrabané pre Java volajúcich
alebo by kolidovalo s niečím iným.

## Kde sa interop príbeh naozaj stane náročnejším

Nullabilita neprejde cez hranicu Kotlin/Java automaticky pre neanotovaný Java kód — pozri
[Platform Types a Java Interop](./platform-types-and-java-interop.md) pre presne to, ako sa táto
medzera rieši, a kde ťa ešte stále môže pohrýzť.
