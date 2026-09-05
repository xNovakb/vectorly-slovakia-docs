---
sidebar_position: 3
title: Test Fixtures a Buildery
---

# Test Fixtures a Buildery

Praktický vzor na konštruovanie realistických testovacích dát bez toho, aby každý test opakoval
každé pole zložitého objektu — stavajúci na myšlienke data-class fixture predstavenej v
[Idiómy Testovania Špecifické pre Kotlin](../01-basics/kotlin-specific-test-idioms.md).

## Problém: rozvláčna, repetitívna konštrukcia objektov

```kotlin
❌ @Test
   fun `active user can place an order`() {
       val user = User(
           id = 1, name = "Jane Doe", email = "jane@example.com",
           isActive = true, createdAt = Instant.now(), role = Role.CUSTOMER
       )
       // testu naozaj záleží len na isActive — všetko ostatné je šum
   }
```

Každý test, ktorý potrebuje *akéhokoľvek* `User`, musí špecifikovať *každé* pole, aj polia úplne
irelevantné tomu, čo daný konkrétny test kontroluje — toto zaplňuje test, a horšie, zastiera,
ktoré pole naozaj záleží testovanému správaniu.

## Fixture funkcia s rozumnými predvoľbami

```kotlin
fun userFixture(
    id: Long = 1,
    name: String = "Jane Doe",
    email: String = "jane@example.com",
    isActive: Boolean = true,
    role: Role = Role.CUSTOMER
) = User(id, name, email, isActive, Instant.now(), role)
```

```kotlin
✅ @Test
   fun `inactive user cannot place an order`() {
       val user = userFixture(isActive = false)
       assertFalse(orderService.canPlaceOrder(user))
   }
```

Teraz test vyjadruje **presne jednu vec**: tento používateľ je neaktívny. Každé ostatné pole má
rozumnú, nenápadnú predvoľbu — čitateľ okamžite vie, že `isActive = false` je fakt, na ktorom
tomuto konkrétnemu testu záleží, bez potreby mentálne odfiltrovať irelevantné polia.

## Builder-style fixtures pre zložitejšie objekty

```kotlin
class OrderFixtureBuilder {
    private var items = mutableListOf<Item>()
    private var user: User = userFixture()
    private var status: OrderStatus = OrderStatus.PENDING

    fun withItem(item: Item) = apply { items.add(item) }
    fun withUser(user: User) = apply { this.user = user }
    fun withStatus(status: OrderStatus) = apply { this.status = status }
    fun build() = Order(items, user, status)
}

fun orderFixture(block: OrderFixtureBuilder.() -> Unit = {}) =
    OrderFixtureBuilder().apply(block).build()
```

```kotlin
@Test
fun `cancelled orders cannot be shipped`() {
    val order = orderFixture {
        withStatus(OrderStatus.CANCELLED)
        withItem(Item("Book", 10))
    }
    assertFalse(shippingService.canShip(order))
}
```

Pre objekty s viac pohyblivými časťami (kolekcie, vnorené objekty, viacero voliteľných
konfigurácií), malé builder DSL — používajúce trailing lambda s receiverom, rovnaký vzor
[scope function](/sk/study-materials/kotlin/kotlin-idioms/scope-functions/apply-also) za `apply` —
sa číta takmer ako mini-špecifikácia presne testovaného scenára, pričom stále predvolí všetko
explicitne nespomenuté.

## Zdieľané fixtures vs. jednorazové inline objekty

```text
Použi zdieľanú fixture funkciu/builder keď:
  - Ten istý druh objektu je konštruovaný naprieč mnohými testovacími súbormi
  - Objekt má viacero polí, väčšine z nich na danom teste zriedka záleží

Jednoducho skonštruuj objekt inline keď:
  - Je to jednoduchý objekt (2-3 polia) použitý len v jednom alebo dvoch testoch
  - Vybudovanie fixture funkcie by bolo viac kódu, než ušetrí
```

Fixture funkcia je nástroj na zníženie šumu, nie pravidlo na aplikovanie všade bezpodmienečne —
triviálny objekt s dvoma poľami, použitý v jednom teste, nepotrebuje builder; `User` s tuctom
polí, konštruovaný v päťdesiatich rôznych testovacích súboroch, jasne áno.

## Udržanie fixtures len pre testy

```text
src/test/kotlin/com/example/fixtures/UserFixtures.kt   ✅ žije popri testoch
src/main/kotlin/com/example/UserFixtures.kt              ❌ prepustí testovací kód do produkcie
```

Fixtures patria konkrétne do test source set (pozri
[Organizácia Testov](../01-basics/test-organization.md) pre Gradle test source sets) — existujú
na to, aby písanie testov bolo pohodlné, a nemajú dôvod byť súčasťou skutočného produkčného
buildu.
