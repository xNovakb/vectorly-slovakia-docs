---
sidebar_position: 2
title: Property-Based Testovanie s Kotest
---

# Property-Based Testovanie s Kotest

Naozaj odlišná testovacia filozofia od [parametrizovaných testov](./parameterized-tests.md):
namiesto ručného vyberania konkrétnych príkladov vstupov, testovací framework **vygeneruje mnoho
náhodných vstupov** a skontroluje, že všeobecná vlastnosť platí pre všetky z nich.

## Example-based vs. property-based, vedľa seba

```kotlin title="Example-based — ty vyberáš konkrétne vstupy"
@Test
fun `reverse of reverse is the original list`() {
    assertEquals(listOf(1, 2, 3), listOf(1, 2, 3).reversed().reversed())
}
```

```kotlin title="Property-based — framework generuje mnoho vstupov"
import io.kotest.property.checkAll

test("reverse of reverse is always the original list") {
    checkAll<List<Int>> { list ->
        list.reversed().reversed() shouldBe list
    }
}
```

Example-based test dokáže, že vlastnosť platí pre **jeden konkrétny zoznam**. `checkAll`
vygeneruje potenciálne stovky náhodných zoznamov — rôzne dĺžky, prázdne zoznamy, zoznamy s
duplicitnými alebo zápornými hodnotami — a skontroluje, že vlastnosť platí pre **všetky z nich**,
zachytávajúc edge case, na ktorý by človek možno nikdy nepomyslel ručne vybrať (prázdny zoznam,
jednoprvkový zoznam, veľmi veľké hodnoty).

## Čo robí dobrú "vlastnosť" na testovanie

Vlastnosť je všeobecné tvrdenie, ktoré by malo platiť bez ohľadu na konkrétny vstup — nie každý
kúsok logiky má zjavnú, ale bežné tvary zahŕňajú:

```text
Round-trip:        decode(encode(x)) == x
Idempotencia:        f(f(x)) == f(x)
Invariant:            triedenie zoznamu nikdy nezmení jeho dĺžku
Komutativita:          add(a, b) == add(b, a)
Ekvivalentné jednoduchšej,
  overene správnej alternatíve:  fastSort(list) produkuje rovnaký výsledok ako list.sorted()
```

```kotlin
test("sorting never changes the number of elements") {
    checkAll<List<Int>> { list ->
        list.sorted().size shouldBe list.size
    }
}

test("encoding then decoding returns the original string") {
    checkAll<String> { original ->
        decode(encode(original)) shouldBe original
    }
}
```

## Kontrola generovaných vstupov

```kotlin
import io.kotest.property.Arb
import io.kotest.property.arbitrary.int

checkAll(Arb.int(1..100)) { number ->
    // number je vždy medzi 1 a 100
    isValidAge(number) shouldBe true
}
```

Generátory `Arb` (skratka pre "arbitrary") kontrolujú tvar generovaných dát — obmedzenie na
realistický rozsah, alebo generovanie štruktúrovaných dát (vlastný `Arb` pre data class) namiesto
plne generického predvoleného generátora Kotest pre typ, keď test konkrétne potrebuje realisticky
vyzerajúce vstupy namiesto arbitrárneho edge-case šumu.

## Keď sa stane zlyhanie — shrinking

```text
Property failed after 23 tests.
Shrunk failing case: [0, -1]
Original failing case: [847, -9231, 5, 0, -1, 33291]
```

Keď `checkAll` nájde zlyhávajúci vstup, Kotest nenahlási len (často veľký, ťažkopádny) náhodne
vygenerovaný prípad, ktorý zlyhal ako prvý — automaticky ho **zmenší (shrink)**, hľadajúc menší,
jednoduchší vstup, ktorý stále vyvolá to isté zlyhanie. Toto je jedna z najpraktickejšie
užitočných funkcií property-based testovania: debugovanie zlyhania na `[0, -1]` je oveľa
zvládnuteľnejšie než debugovanie na 6-prvkovom zozname veľkých arbitrárnych čísel.

## Kam toto realisticky zapadá

Property-based testovanie nie je náhrada za example-based testy — žiari pri testovaní
**všeobecnej logiky s jasnými invariantmi** (parsery, serializátory, matematický/algoritmický
kód, transformácie dát), a prináša menej hodnoty pre logiku, ktorá je inherentne o konkrétnych
business prípadoch (jedno pomenované discount pravidlo), kde example-based test (pozri
[Parametrizované Testy](./parameterized-tests.md)) už zámer komunikuje jasne. Väčšina reálnych
codebase kombinuje oboje, siahajúc po property-based testoch konkrétne tam, kde "platí toto
všeobecne" je skutočná otázka, ktorá sa kladie.
