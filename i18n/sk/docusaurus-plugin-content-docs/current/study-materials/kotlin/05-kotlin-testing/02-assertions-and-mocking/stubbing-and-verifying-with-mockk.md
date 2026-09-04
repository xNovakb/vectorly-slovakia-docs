---
sidebar_position: 3
title: Stubbing a Verifikácia s MockK
---

# Stubbing a Verifikácia s MockK

Nad rámec základného stubbingu (pozri [Základy MockK](./mockk-basics.md)) ti argument matchery a
verification API MockK umožnia overiť nielen *čo mock vráti*, ale *ako bol naozaj volaný* — a
kontrolovať, ako prísny je mock v tom, čo od neho presne očakávaš.

## Overenie, že bol mock volaný

```kotlin
import io.mockk.verify

@Test
fun `sends a confirmation email after order creation`() {
    val emailService = mockk<EmailService>(relaxed = true)
    val orderService = OrderService(emailService)

    orderService.createOrder(userId = 1, items = listOf(item))

    verify { emailService.sendConfirmation(userId = 1) }
}
```

`every { }` nastaví **return value**; `verify { }` overí, že sa **interakcia naozaj stala** —
rôzne záležitosti. Test môže overiť, že volanie sa stalo, aj pre funkciu vracajúcu `Unit` (ako
posielanie emailu), kde vôbec nie je return value na nastavenie.

## Argument matchery

```kotlin
every { userRepository.findById(any()) } returns defaultUser         // matchuje AKÝKOĽVEK Long argument
every { userRepository.findById(eq(1)) } returns specificUser          // matchuje presne 1
every { userRepository.save(match { it.name.isNotBlank() }) } returns Unit   // vlastný predikát

verify { emailService.sendConfirmation(userId = eq(1)) }
verify(exactly = 2) { emailService.sendConfirmation(any()) }
verify(atLeast = 1) { auditLog.record(any()) }
```

`any()` je užitočné, keď testu naozaj nezáleží na konkrétnej hodnote argumentu — ale nadmerné
používanie môže skryť skutočný bug (volanie stávajúce sa so *zlým* argumentom stále spĺňa
verifikáciu založenú na `any()`), tak preferuj konkrétnu hodnotu alebo predikát `match { }`
kedykoľvek na skutočnom argumente záleží tomu, čo sa testuje.

## Overenie, že sa nestali neočakávané volania

```kotlin
verify(exactly = 0) { emailService.sendConfirmation(any()) }
confirmVerified(emailService)
```

`confirmVerified` zlyhá test, ak mal mock **akúkoľvek** interakciu, ktorá nebola niekde v teste
explicitne overená — zachytí náhodné extra volanie, ktoré by samotné `verify { }` nemuselo nutne
odhaliť, keďže `verify` kontroluje len konkrétnu interakciu, ktorú hľadá, nie kompletnú množinu
toho, čo sa stalo.

## Relaxed mocky — kompromis pohodlie/bezpečnosť

```kotlin
val emailService = mockk<EmailService>()             // prísny — každá volaná metóda potrebuje stub, inak test hodí chybu
val emailService = mockk<EmailService>(relaxed = true)  // relaxed — nenastavené volania vrátia predvolenú hodnotu namiesto chyby
```

```kotlin
// Prísny mock, žiadny stub pre sendConfirmation():
orderService.createOrder(...)
// ❌ io.mockk.MockKException: no answer found for EmailService.sendConfirmation(1)

// Relaxed mock, žiadny stub pre sendConfirmation():
orderService.createOrder(...)
// ✅ beží v poriadku — sendConfirmation() potichu vráti Unit (alebo 0, false, null, atď. podľa return type)
```

:::warning
Relaxed mock je pohodlný — netreba nastaviť každú jednu metódu, ktorú závislosť náhodou má, aj
tie, na ktorých aktuálnemu testu nezáleží — ale tiež to znamená, že naozaj neúmyselné volanie
*nenastavenej* metódy potichu uspeje namiesto hlasného zlyhania. Toto môže maskovať skutočný bug:
kód, ktorý mal volať `emailService.sendConfirmation()`, ale má preklep volajúci inú, podobne
pomenovanú metódu, relaxed mock nezachytí spôsobom, akým by to okamžite odhalila výnimka prísneho
mocku. Siahni po `relaxed = true` hlavne pre závislosti s mnohými metódami, kde konkrétnemu testu
záleží len na jednej alebo dvoch — nie ako predvoľbu pre každý mock.
:::

## `every` + `verify` spolu — celý obraz

```kotlin
@Test
fun `retries once on a transient failure, then succeeds`() {
    val paymentGateway = mockk<PaymentGateway>()
    every { paymentGateway.charge(any()) } returnsMany listOf(
        Result.failure(TimeoutException()),   // prvé volanie zlyhá
        Result.success(Unit)                    // druhé volanie (retry) uspeje
    )

    paymentService.chargeWithRetry(amount = 100)

    verify(exactly = 2) { paymentGateway.charge(any()) }
}
```

`returnsMany` nastaví **sekvenciu** return values pre po sebe idúce volania — v kombinácii s
`verify(exactly = 2)` tento test dokáže aj *výsledok* retry správania (nastavením zlyhania a
potom úspechu), aj to, že sa naozaj zopakovalo očakávaný *počet*krát, nie len že to nakoniec
nejako uspelo.
