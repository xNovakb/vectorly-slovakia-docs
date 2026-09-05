---
sidebar_position: 1
title: Parametrizované Testy
---

# Parametrizované Testy

Spustenie rovnakej testovacej logiky proti viacerým vstupom, bez copy-paste testovacej metódy
pre každý vstup — JUnit5 aj Kotest ponúkajú toto, v nápadne odlišných štýloch.

## Problém, ktorý toto rieši

```kotlin
❌ @Test
   fun `isEven returns true for 2`() { assertTrue(isEven(2)) }
   @Test
   fun `isEven returns true for 4`() { assertTrue(isEven(4)) }
   @Test
   fun `isEven returns false for 3`() { assertFalse(isEven(3)) }
   // ...a tak ďalej, jedna testovacia metóda na prípad
```

Každý z týchto testov testuje presne tú istú logiku s iným vstupom — naozaj repetitívne, a
bolestivé na rozšírenie (pridanie nového prípadu znamená napísať úplne novú metódu).

## `@ParameterizedTest` z JUnit5

```kotlin
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource

@ParameterizedTest
@ValueSource(ints = [2, 4, 6, 8])
fun `isEven returns true for even numbers`(number: Int) {
    assertTrue(isEven(number))
}
```

Táto jedna testovacia metóda beží **štyrikrát**, raz na hodnotu v `@ValueSource` — každý beh je vo
výstupe testu nahlásený samostatne, takže zlyhanie na jednom konkrétnom vstupe je okamžite
identifikovateľné.

## Testovanie párov vstup/očakávaný-výstup s `@MethodSource`

```kotlin
@ParameterizedTest
@MethodSource("discountCases")
fun `calculates discount correctly`(subtotal: Int, hasLoyalty: Boolean, expected: Int) {
    assertEquals(expected, calculateDiscount(subtotal, hasLoyalty))
}

companion object {
    @JvmStatic
    fun discountCases() = listOf(
        Arguments.of(100, true, 90),     // loyalty zľava aplikovaná
        Arguments.of(100, false, 100),    // žiadna zľava
        Arguments.of(0, true, 0)            // nulový subtotal, žiadna zľava na aplikovanie
    )
}
```

`@MethodSource` dodá celú sadu n-tíc argumentov namiesto jednotlivých hodnôt — prirodzený fit,
keď test potrebuje viacero súvisiacich vstupov (subtotal, loyalty status) namapovaných na jeden
očakávaný výstup na prípad. `@JvmStatic` je tu vyžadované, keďže JUnit musí volať túto metódu bez
inštancie — detail špecifický pre Kotlin (členy companion objektu bez neho nie sú na JVM naozaj
static), oplatí sa vedieť pred narazením na mätúcu runtime chybu.

## Alternatíva Kotest s tabuľkovým riadením

```kotlin
import io.kotest.data.forAll
import io.kotest.data.row

class DiscountTest : StringSpec({
    "calculates discount correctly" {
        forAll(
            row(100, true, 90),
            row(100, false, 100),
            row(0, true, 0)
        ) { subtotal, hasLoyalty, expected ->
            calculateDiscount(subtotal, hasLoyalty) shouldBe expected
        }
    }
})
```

Rovnaká myšlienka ako `@MethodSource`, iná syntax — `row(...)` sa číta ako doslovná tabuľka
testovacích prípadov, argumentovateľne vizuálne prehľadnejšia ako skutočná tabuľka než zoznam
volaní `Arguments.of(...)`. Čo použiť často závisí od toho, či zvyšok codebase už spolieha na
obyčajný JUnit5 (pozri [JUnit5 v Kotline](../01-basics/junit5-in-kotlin.md)) alebo vlastný
test-spec štýl Kotest.

## Kedy je parametrizácia zlý nástroj

```kotlin
❌ @ParameterizedTest
   @MethodSource("everyEdgeCaseEverImagined")   // 40 riadkov pokrývajúcich nesúvisiace správania
```

Parametrizované testy fungujú najlepšie, keď každý prípad testuje **rovnaké logické správanie**
s inými dátami. Ak prípady naozaj testujú rôzne správania (nie len rôzne vstupy do jedného
správania), samostatné, jasne pomenované testovacie metódy komunikujú zámer lepšie než jeden
rozťahaný parametrizovaný test, ktorého 40 riadkov sa navzájom rozmazáva.

## Generovanie vstupov namiesto ich ručného vypísania

Pre prípady, kde ručné vyberanie konkrétnych vstupov nestačí — chceš skontrolovať, či vlastnosť
platí naprieč *širokým rozsahom* vstupov, nie len pár ručne vybraných — pozri
[Property-Based Testovanie s Kotest](./property-based-testing-with-kotest.md), naozaj odlišný
prístup k rovnakému všeobecnému problému.
