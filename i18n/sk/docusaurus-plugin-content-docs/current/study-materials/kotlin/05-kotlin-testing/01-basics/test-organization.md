---
sidebar_position: 3
title: Organizácia Testov
---

# Organizácia Testov

Konvencie pomenovania a štruktúry — nie funkcie JUnit, len dohodnuté vzory — ktoré udržia rastúcu
test suite prehľadnú namiesto plochej hromady voľne súvisiacich testovacích metód.

## Given/When/Then ako konvencia

```kotlin
@Test
fun `withdrawal fails when balance is insufficient`() {
    // given
    val account = Account(balance = 50)

    // when
    val result = account.withdraw(100)

    // then
    assertTrue(result.isFailure)
    assertEquals(50, account.balance)  // balance unchanged
}
```

Given/When/Then (prevzaté z frázovania behavior-driven-development) je čisto **konvencia
komentárov/pomenovania** — žiadna špeciálna knižnica ani anotácia toto nerobí "oficiálnym." Jeho
hodnota je vynútenie konzistentného tvaru na každý test: nastav stav, vykonaj jednu akciu, over
výsledok — čo robí neznámy test rýchlo pochopiteľným, a robí test, ktorý robí príliš veľa
(viacero "when"), vizuálne zjavným.

## Štruktúrovanie testovacích tried podľa zdrojovej štruktúry

```text
src/main/kotlin/com/example/UserService.kt
src/test/kotlin/com/example/UserServiceTest.kt

src/main/kotlin/com/example/payments/PaymentProcessor.kt
src/test/kotlin/com/example/payments/PaymentProcessorTest.kt
```

Jedna-na-jednu mapovanie medzi zdrojovými súbormi a testovacími súbormi, v zodpovedajúcej
štruktúre balíkov, znamená, že ktokoľvek vie nájsť testy triedy bez hľadania — `UserService.kt` →
`UserServiceTest.kt`, predvídateľne, zakaždým.

## Samostatné test source sets v Gradle

```kotlin title="build.gradle.kts"
sourceSets {
    test {
        kotlin.srcDirs("src/test/kotlin")
    }
}

// Bežný vzor: samostatný source set pre pomalšie integračné testy
sourceSets.create("integrationTest") {
    kotlin.srcDir("src/integrationTest/kotlin")
}

tasks.register<Test>("integrationTest") {
    testClassesDirs = sourceSets["integrationTest"].output.classesDirs
    classpath = sourceSets["integrationTest"].runtimeClasspath
}
```

```bash
./gradlew test               # len rýchle unit testy
./gradlew integrationTest      # pomalšie testy, spustené samostatne (napr. v neskoršej CI fáze)
```

Rozdelenie rýchlych unit testov od pomalších integračných testov do samostatných Gradle source
sets/tasks znamená, že rýchla suite môže bežať pri každej jednej zmene, zatiaľ čo pomalšia suite
beží menej často — rovnaký princíp "rôzne testy, rôzne CI triggery" všeobecne pokrytý v
[Spúšťanie Testov v CI](/sk/study-materials/ci-cd/build-and-test/running-tests-in-ci) v téme
CI/CD, aplikovaný konkrétne na vlastné testovacie nastavenie Kotlin/Gradle projektu.

## Konzistentné pomenovanie testovacích tried a metód

```text
Testovaná trieda + "Test"    — UserServiceTest, PaymentProcessorTest (štandardná konvencia)

Mená metód ako popisy správania, nie popisy implementácie:
❌ `test add method`                              — popisuje ČO sa testuje, nie očakávané správanie
✅ `adds two positive numbers and returns the sum`   — popisuje skutočné očakávané správanie
```

Meno testu by malo popisovať **správanie**, nie opakovať, že test pre danú metódu existuje —
rozdiel má najväčší význam, keď test zlyhá: dobré meno ti povie, čo je pokazené, bez otvorenia
tela testu vôbec.

## Jeden koncept assertion na test

```kotlin
❌ @Test
   fun `user creation`() {
       val user = createUser("Jane", "jane@example.com")
       assertEquals("Jane", user.name)
       assertEquals("jane@example.com", user.email)
       assertTrue(user.isActive)
       assertNotNull(user.createdAt)
       // ...a teraz aj testovanie update, mazania, v tom istom teste...
   }

✅ @Test
   fun `created user has the provided name and email`() { ... }
   @Test
   fun `newly created user is active by default`() { ... }
```

Nie je to tvrdé pravidlo proti viacerým assertions v jednom teste (overenie viacerých polí jedného
vytvoreného objektu je v poriadku) — skutočný cieľ je jeden **test na odlišné správanie**, aby
zlyhanie okamžite povedalo, ktoré konkrétne správanie sa pokazilo, namiesto jedného obrovského
testu, ktorého zlyhanie neodhalí, ktorá z piatich nesúvisiacich vecí sa naozaj pokazila.
