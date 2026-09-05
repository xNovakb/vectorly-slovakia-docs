---
sidebar_position: 2
title: Základy MockK
---

# Základy MockK

[MockK](https://mockk.io/) je mockovacia knižnica postavená konkrétne pre Kotlin — kde má Mockito
(štandardná Java mockovacia knižnica) reálnu friction so špecifickými jazykovými funkciami
Kotlinu, MockK je navrhnutý okolo nich od začiatku.

## Prečo nepoužiť jednoducho Mockito

```kotlin
class UserService {   // bežná Kotlin trieda — predvolene final!
    fun findUser(id: Long): User? = ...
}
```

Kotlin triedy a funkcie sú **predvolene final** (musia byť explicitne označené `open`, aby
dovolili subclassing/override) — ale väčšina mockovacích knižníc, vrátane Mockito, historicky
funguje generovaním subclass mockovanej triedy za behu. Mockovanie final Kotlin triedy s
obyčajným Mockito buď úplne zlyhá, alebo vyžaduje extra plugin (`mockito-inline`/`all-open`
compiler plugin) len na obídenie friction, ktorý zaviedol samotný dizajn Kotlinu. MockK je
postavený tak, aby natívne mockoval final triedy, bez extra konfigurácie — priamy dôsledok toho,
že je navrhnutý pre Kotlin namiesto adaptovaný z Java-first nástroja.

MockK má tiež natívnu podporu pre mockovanie `suspend` funkcií (coroutines) — pozri
[Testovanie Coroutines](/sk/study-materials/kotlin/kotlin-coroutines/error-handling-and-testing/testing-coroutines)
v téme Kotlin Coroutines a Konkurencia — s čím Mockito historicky zápasil úplne.

## Vytvorenie mocku

```kotlin
import io.mockk.mockk
import io.mockk.every

val userRepository = mockk<UserRepository>()

every { userRepository.findById(1) } returns User(id = 1, name = "Jane")

val user = userRepository.findById(1)
println(user?.name)   // "Jane"
```

`mockk<T>()` vytvorí mock inštanciu typu `T`; `every { ... } returns ...` nastaví, čo by konkrétne
volanie na tomto mocku malo vrátiť, použijúc syntax trailing lambda Kotlinu, aby nastavené volanie
vyzeralo ako prirodzený výraz namiesto string-based method reference.

## Realistický test používajúci mock

```kotlin
class OrderServiceTest {

    @Test
    fun `applies a discount when the user has a loyalty membership`() {
        val userRepository = mockk<UserRepository>()
        every { userRepository.findById(1) } returns User(id = 1, hasLoyaltyMembership = true)

        val orderService = OrderService(userRepository)
        val total = orderService.calculateTotal(userId = 1, subtotal = 100)

        assertEquals(90, total)   // 10% loyalty zľava aplikovaná
    }
}
```

Mock úplne zastúpi `UserRepository` — žiadna reálna databáza, žiadne reálne sieťové volanie —
takže test beží rýchlo a deterministicky, testujúc discount logiku `OrderService` izolovane od
toho, ako sa dáta používateľa v produkcii naozaj získajú.

## Nastavenie rôznych return values pre rôzne argumenty

```kotlin
every { userRepository.findById(1) } returns User(id = 1, name = "Jane")
every { userRepository.findById(2) } returns User(id = 2, name = "Bob")
every { userRepository.findById(999) } returns null
```

Každé `every { }` s inou hodnotou argumentu nastaví toto konkrétne volanie nezávisle — mock sa
môže správať odlišne v závislosti od toho, presne ako je volaný, nie len vracať jednu pevnú
hodnotu pre každé volanie.

## Nastavenie výnimky

```kotlin
every { userRepository.findById(1) } throws DatabaseConnectionException("timeout")

@Test
fun `propagates a database error`() {
    assertThrows<DatabaseConnectionException> {
        orderService.calculateTotal(userId = 1, subtotal = 100)
    }
}
```

Užitočné na testovanie, ako kód zaobchádza so zlyhaním závislosti — niečo naozaj ťažké spoľahlivo
vyvolať na požiadanie proti reálnej databáze, ale triviálne proti mocku.

## Kam toto zapadá pri reálnom Spring Boot testovaní

[Unit Testing s MockK](/sk/study-materials/kotlin/kotlin-spring-boot/testing-spring-apps/unit-testing-with-mockk)
v téme Kotlin + Spring Boot pokrýva tú istú knižnicu aplikovanú konkrétne vnútri testov service
vrstvy Spring appky — táto stránka je všeobecný základ, na ktorom tá stránka stavia.
