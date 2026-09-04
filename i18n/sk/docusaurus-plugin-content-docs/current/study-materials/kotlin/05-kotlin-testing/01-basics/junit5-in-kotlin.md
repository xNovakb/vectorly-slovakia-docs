---
sidebar_position: 1
title: JUnit5 v Kotline
---

# JUnit5 v Kotline

JUnit5 je štandardný test framework na JVM, a funguje z Kotlinu bez špeciálneho nastavenia — ale
pár jeho funkcií zapadá do syntaxe Kotlinu obzvlášť dobre, oplatí sa ich poznať od začiatku.

## Základy

```kotlin
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.assertEquals

class CalculatorTest {

    @Test
    fun `adds two numbers correctly`() {
        val result = Calculator().add(2, 3)
        assertEquals(5, result)
    }
}
```

`@Test` označí funkciu ako test case; `assertEquals(expected, actual)` zlyhá test, ak sa dve
hodnoty nerovnajú. Všimni si názov funkcie v backtickoch — poriadne pokryté v
[Idiómy Testovania Špecifické pre Kotlin](./kotlin-specific-test-idioms.md).

## Setup a teardown

```kotlin
class UserRepositoryTest {
    private lateinit var repository: UserRepository

    @BeforeEach
    fun setUp() {
        repository = UserRepository(InMemoryDatabase())
    }

    @AfterEach
    fun tearDown() {
        repository.close()
    }

    @Test
    fun `saves and retrieves a user`() {
        repository.save(User(id = 1, name = "Jane"))
        val found = repository.findById(1)
        assertEquals("Jane", found?.name)
    }
}
```

`@BeforeEach`/`@AfterEach` bežia pred/po **každej** testovacej metóde v triede — štandardný
spôsob, ako dať každému testu čerstvý, izolovaný počiatočný bod namiesto toho, aby testy náhodou
zdieľali stav.

## Vnorené testovacie triedy

```kotlin
class ShoppingCartTest {

    @Nested
    inner class WhenCartIsEmpty {
        @Test
        fun `total is zero`() {
            assertEquals(0, ShoppingCart().total())
        }
    }

    @Nested
    inner class WhenCartHasItems {
        private val cart = ShoppingCart().apply { add(Item("Book", 10)) }

        @Test
        fun `total reflects item prices`() {
            assertEquals(10, cart.total())
        }

        @Test
        fun `item count increases`() {
            assertEquals(1, cart.itemCount())
        }
    }
}
```

`@Nested` (v kombinácii s `inner class` Kotlinu, potrebné, aby vnorená trieda mala prístup k
vonkajšej triede) zoskupí súvisiace testy pod zdieľaný kontext — test report sa číta ako
"WhenCartHasItems > total reflects item prices," čo je oveľa čitateľnejšie než jeden dlhý, plochý
zoznam navzájom nesúvisiaco vyzerajúcich mien testov.

## Bežné assertions

```kotlin
assertEquals(expected, actual)
assertTrue(condition)
assertFalse(condition)
assertNull(value)
assertNotNull(value)
assertThrows<IllegalArgumentException> {
    validateAge(-1)
}
```

`assertThrows<T> { }` je idiomatická forma pre Kotlin (používajúca reified type parameter a
trailing lambda) — čistejšia než Java ekvivalent, ktorý potrebuje explicitný `.class` odkaz. Pozri
[Kotest Assertions](../02-assertions-and-mocking/kotest-assertions.md) pre alternatívny štýl
assertions, ktorý mnoho Kotlin projektov preferuje pred týmito vstavanými JUnit assertions.

## Kam toto zapadá

Obyčajný JUnit5 je úplne dobrý základ — nič tu nie je zlé ani zastarané. Zvyšok tejto témy pokrýva
idiómy a knižnice (Kotest, MockK), ktoré stavajú na tomto rovnakom JUnit5 základe, aby testy
čítali prirodzenejšie konkrétne v Kotline, nie náhradu za neho.
