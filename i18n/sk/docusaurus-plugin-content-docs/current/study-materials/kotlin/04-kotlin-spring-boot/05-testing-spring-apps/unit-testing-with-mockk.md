---
sidebar_position: 1
title: Unit Testovanie s MockK
---

# Unit Testovanie s MockK

Testovanie service triedy izolovane — precvičovanie jej vlastnej logiky bez reálnej databázy,
reálneho HTTP volania, alebo bežiaceho Spring kontextu vôbec, nahradením jej závislostí test
doubles.

## Prečo MockK nad Mockito pre Kotlin

Mockito (štandardná Java mockovacia knižnica) predchádza Kotlin a má s ním reálne trenie:
mockovanie `final` triedy potrebuje extra konfiguráciu (Kotlin triedy sú predvolene final —
pozri [Spring Boot s Kotlinom](../01-basics/spring-boot-with-kotlin.md)), a prirodzene
nerozumie Kotlin-špecifickým konštrukciám (predvolené argumenty, extension funkcie, `data class`
equality). **MockK** je postavený špecificky pre Kotlin, riešiaci toto všetko natívne.

## Základné mockovanie

```kotlin
class OrderServiceTest {

    private val orderRepository = mockk<OrderRepository>()
    private val paymentClient = mockk<PaymentClient>()
    private val orderService = OrderService(orderRepository, paymentClient)

    @Test
    fun `placeOrder saves the order and charges payment`() {
        val request = CreateOrderRequest(customerId = 1L, items = listOf())
        val savedOrder = Order(id = 1L, status = "pending", total = BigDecimal("99.99"))

        every { orderRepository.save(any()) } returns savedOrder
        every { paymentClient.charge(any()) } just Runs

        val result = orderService.placeOrder(request)

        assertEquals(savedOrder.id, result.id)
        verify { paymentClient.charge(savedOrder.total) }
    }
}
```

Keďže [Constructor Injection, Kotlinovým Spôsobom](../02-dependency-injection/constructor-injection-kotlin-style.md)
znamená, že závislosti sú len konštruktorové parametre, konštruovanie `OrderService(orderRepository,
paymentClient)` priamo — žiadny Spring kontext, žiadne `@Autowired`, žiadny štart kontajnera
vôbec — je presne to, čo tento druh rýchleho, izolovaného unit testu vôbec umožňuje.

## `every` / `verify` — základná slovná zásoba MockK

```kotlin
every { orderRepository.save(any()) } returns savedOrder     // stubni návratovú hodnotu
every { paymentClient.charge(any()) } just Runs                 // stubni void/Unit funkciu
every { orderRepository.findById(1L) } throws OrderNotFoundException(1L)   // stubni vyhodenú výnimku

verify { paymentClient.charge(savedOrder.total) }                  // over, že sa volanie stalo
verify(exactly = 0) { paymentClient.refund(any()) }                  // over, že sa volanie NESTALO
verify(exactly = 2) { orderRepository.save(any()) }                     // over presný počet volaní
```

`just Runs` je MockK idiom konkrétne pre stubovanie funkcie, ktorá vráti `Unit` (Kotlin
ekvivalent `void`) — nie je čo zmysluplné špecifikovať ako návratovú hodnotu, len potvrdenie, že
sa volanie očakáva a nemalo by hodiť výnimku.

## Mená testov ako čitateľné vety

```kotlin
@Test
fun `placeOrder throws when customer does not exist`() { /* ... */ }

@Test
fun `placeOrder charges the exact order total, not a rounded amount`() { /* ... */ }
```

Kotlin dovoľuje back-tick-quoted mená funkcií obsahujúce medzery a interpunkciu — široko
používané konkrétne pre mená test metód, keďže test report ukazujúci
`placeOrder throws when customer does not exist` je dramaticky čitateľnejší než
`testPlaceOrder_customerNotFound_throwsException`, konvencia pomenovania, na ktorej Java testy
zvyčajne uviaznu.

## Relaxed mocky — pre závislosti, na ktorých v konkrétnom teste nezáleží

```kotlin
val logger = mockk<Logger>(relaxed = true)    // akékoľvek nestubnuté volanie vráti rozumnú predvoľbu namiesto hodenia
```

Obyčajné `mockk<T>()` hodí výnimku, ak sa metóda zavolá bez explicitného stubnutia cez `every` —
väčšinu času vhodné, keďže neočakávané volanie často signalizuje test, ktorý plne nechápe, čo
precvičuje. `relaxed = true` je užitočné pre naozaj vedľajšie závislosti (logger, metrics klient),
kde by explicitné stubnutie každého možného volania bolo len šum nesúvisiaci s tým, čo test
vlastne overuje.

## Čo toto netestuje

Čistý unit test s mockovanými závislosťami overuje **vlastnú logiku** service — nič nehovorí o
tom, či reálny `OrderRepository` naozaj správne dopytuje databázu, alebo či reálny
`PaymentClient` naozaj správne komunikuje s platobným providerom. Pozri
[Integračné Testovanie s Testcontainers](./integration-testing-with-testcontainers.md) pre
testovanie týchto reálnych integrácií.
