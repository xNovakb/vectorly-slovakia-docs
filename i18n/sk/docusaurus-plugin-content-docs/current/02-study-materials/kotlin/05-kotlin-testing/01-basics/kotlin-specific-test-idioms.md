---
sidebar_position: 2
title: Idiómy Testovania Špecifické pre Kotlin
---

# Idiómy Testovania Špecifické pre Kotlin

Pár vzorov, ktoré nie sú *požiadavky* Kotlinu, ale konzistentne robia testovací kód čitateľnejším
— oplatí sa ich zámerne prijať namiesto písania Kotlin testov tak, ako by si napísal Java testy.

## Mená testov v backtickoch

```kotlin
❌ @Test
   fun shouldReturn404WhenUserNotFound() { ... }

✅ @Test
   fun `should return 404 when user not found`() { ... }
```

Kotlin dovoľuje mená funkcií obsahujúce medzery a interpunkciu, keď sú obalené v backtickoch —
skutočná jazyková funkcia, nie trik testovacej knižnice. Konkrétne pre testovacie funkcie toto
znamená, že meno testu môže byť **veta v obyčajnej angličtine** popisujúca testované správanie,
namiesto camelCase aproximácie takej vety. Prínos sa priamo prejaví v reportoch zlyhania testov:

```text
❌ CalculatorTest > shouldReturnZeroWhenBothInputsAreZero() FAILED
✅ CalculatorTest > `should return zero when both inputs are zero`() FAILED
```

Druhé je na prvý pohľad čitateľné pre niekoho, kto ten test nikdy nevidel — presne osoba, ktorá z
toho profituje najviac, čítajúc CI notifikáciu o zlyhaní o druhej ráno.

:::note
Toto je špecifické pre **testovací** kód — mená funkcií v backtickoch v bežnom aplikačnom kóde sú
zvyčajne regresia čitateľnosti, nie zlepšenie (a vôbec sa nedajú normálne volať z Java interop
kódu). Konvencia je zámerne obmedzená na testy, kde "meno funkcie" je naozaj čitateľná
špecifikácia pre človeka, nie API, ktoré iný kód volá podľa mena.
:::

## Data classes ako test fixtures

```kotlin
data class UserFixture(
    val id: Long = 1,
    val name: String = "Jane Doe",
    val email: String = "jane@example.com",
    val isActive: Boolean = true
)

@Test
fun `inactive users cannot log in`() {
    val user = UserFixture(isActive = false)
    assertFalse(loginService.canLogIn(user))
}
```

`data class` s rozumnými predvolenými hodnotami pre každé pole (pozri
[Test Fixtures a Buildery](../03-property-based-and-parameterized-testing/test-fixtures-and-builders.md)
pre tento vzor podrobnejšie) dovolí každému testu prepísať **len pole, na ktorom mu naozaj
záleží** — `UserFixture(isActive = false)` sa číta ako "bežný používateľ, len neaktívny," čo je
presne zámer daného konkrétneho testu, bez opakovania hodnoty každého nesúvisiaceho poľa v
každom teste.

## Rovnosť `data class` pre čitateľnosť assertions

```kotlin
data class Point(val x: Int, val y: Int)

@Test
fun `translate moves the point correctly`() {
    val result = Point(1, 2).translate(dx = 3, dy = 4)
    assertEquals(Point(4, 6), result)
}
```

Keďže `data class` automaticky generuje štrukturálnu `equals()`, porovnanie dvoch inštancií v
assertion porovná ich skutočné hodnoty polí — netreba ručný override `equals()`, a chybová správa
zlyhanej assertion ukáže hodnoty polí oboch celých objektov priamo, namiesto len "not equal" s
dvoma nepriehľadnými object references.

## Extension funkcie pre vlastné assertions

```kotlin
fun HttpResponse.assertStatus(expected: Int) {
    assertEquals(expected, this.statusCode, "Unexpected status. Body: ${this.body}")
}

@Test
fun `returns 404 for missing user`() {
    val response = api.getUser(id = 999)
    response.assertStatus(404)
}
```

Extension funkcia (pozri pokrytie extension funkcií všeobecne v téme Kotlin Idiómy) napísaná
konkrétne pre testovací kód sa môže čítať ako prirodzená, plynulá assertion metóda na type, ktorý
nevlastníš — `response.assertStatus(404)` sa číta lepšie než holé
`assertEquals(404, response.statusCode)`, a môže pri zlyhaní automaticky zabaliť extra
diagnostický kontext (ako telo odpovede).
