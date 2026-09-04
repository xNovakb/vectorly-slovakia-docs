---
sidebar_position: 1
title: Kotest Assertions
---

# Kotest Assertions

[Kotest](https://kotest.io/) poskytuje plynulú, Kotlin-idiomatickú assertion knižnicu — použiteľnú
samostatne s obyčajnými JUnit5 testovacími triedami, aj bez prijatia vlastného štýlu test-runnera
Kotest.

## Plynulé matchery vs. obyčajné JUnit assertions

```kotlin
// Obyčajný JUnit
assertEquals(5, result)
assertTrue(list.contains("apple"))
assertTrue(text.startsWith("Hello"))

// Kotest
result shouldBe 5
list shouldContain "apple"
text shouldStartWith "Hello"
```

`shouldBe` sa číta zľava doprava ako prirodzená veta — "result should be 5" — používajúc syntax
infix funkcií Kotlinu (pozri pokrytie infix funkcií v téme Kotlin Idiómy) namiesto volania
`assertX(expected, actual)`, kde je poradie argumentov ľahké si popliesť.

## Bežné matchery

```kotlin
result shouldBe expected
result shouldNotBe unexpected

list shouldContain "apple"
list shouldHaveSize 3
list shouldBeEmpty()

text shouldStartWith "Hello"
text shouldContain "world"
text shouldMatch Regex("[a-z]+")

number shouldBeGreaterThan 0
number shouldBeInRange 1..100

nullableValue shouldNotBeNull()
nullableValue.shouldBeNull()
```

## Assertions na výnimky

```kotlin
val exception = shouldThrow<IllegalArgumentException> {
    validateAge(-1)
}
exception.message shouldBe "Age cannot be negative"
```

Podobný tvar ako `assertThrows` z JUnit5, ale priamo vráti zachytenú výnimku na ďalšie assertions
na nej — reťazenie kontroly správy na ten istý výraz namiesto potreby samostatného `assertEquals`
neskôr.

## Prečo sú chybové správy skutočný prínos

```text title="Zlyhanie obyčajného JUnit"
org.opentest4j.AssertionFailedError:
Expected :5
Actual   :4

title="Zlyhanie Kotest"
io.kotest.assertions.AssertionFailedError:
expected: 5 but was: 4
```

Pri jednoduchých prípadoch je rozdiel malý, ale matchery Kotest sa lepšie škálujú pre
štruktúrované dáta:

```kotlin
user shouldBe User(id = 1, name = "Jane", email = "jane@example.com")
```

```text title="Štrukturálny diff Kotest pri zlyhaní"
expected: User(id=1, name="Jane", email="jane@example.com")
but was:  User(id=1, name="Jane", email="jane@wrong.com")

Field differences:
  email: expected "jane@example.com" but was "jane@wrong.com"
```

Presné ukázanie, *ktoré pole* sa líši (namiesto len vypísania oboch celých objektov a nechania
teba porovnávať ich okom), je naozaj praktická úspora času, akonáhle sú testovacie dáta
zložitejšie než jedna primitívna hodnota.

## Soft assertions — zbieranie viacerých zlyhaní naraz

```kotlin
assertSoftly {
    user.name shouldBe "Jane"
    user.email shouldBe "jane@example.com"
    user.isActive shouldBe true
}
```

Normálne sa test zastaví na **prvej** zlyhanej assertion — neskoršie assertions v tom istom teste
nikdy ani nebežia, takže jeden beh testu odhalí len jeden problém naraz. `assertSoftly` spustí
každú assertion vnútri bloku bez ohľadu na skoršie zlyhania, a nahlási **všetky** zlyhania
spolu — užitočné pri kontrole viacerých nezávislých polí jedného objektu, aby jeden beh testu
odhalil každý skutočný problém namiesto potreby viacerých kôl "oprav jedno, spusti znova, nájdi
ďalšie."

## Použitie Kotest matcherov s obyčajným JUnit5

```kotlin
import org.junit.jupiter.api.Test
import io.kotest.matchers.shouldBe

class CalculatorTest {
    @Test
    fun `adds two numbers`() {
        Calculator().add(2, 3) shouldBe 5   // Kotest matcher, obyčajný JUnit5 test runner
    }
}
```

Knižnica matcherov a test runner sú naozaj samostatné veci — projekt môže prijať assertions
Kotest bez prepnutia celého test frameworku preč od JUnit5, nízko-frikčný spôsob, ako to
postupne vyskúšať.
