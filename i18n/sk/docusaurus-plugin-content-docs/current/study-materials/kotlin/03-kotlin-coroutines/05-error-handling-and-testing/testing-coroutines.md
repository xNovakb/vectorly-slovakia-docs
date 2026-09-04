---
sidebar_position: 3
title: Testovanie Coroutines
---

# Testovanie Coroutines

Testovanie suspend funkcií a coroutines má jeden problém, aký bežné testy nemajú: kód so
skutočnými volaniami `delay()` by spravil testy naozaj pomalými, keby delay-e naozaj trvali
skutočný wall-clock čas. `kotlinx-coroutines-test` toto rieši **virtuálnym časom**.

## `runTest` — štandardný vstupný bod

```kotlin
import kotlinx.coroutines.test.runTest

@Test
fun `fetches user data`() = runTest {
    val user = fetchUser(1)
    assertEquals("Jane", user.name)
}
```

`runTest` vytvorí coroutine testovacie prostredie s `TestDispatcher` — dispatcherom postaveným
špecificky na testovanie, ktorý riadi samotný čas namiesto spoliehania sa na skutočné hodiny.

## Virtuálny čas — prečo test s `delay(10_000)` naozaj netrvá 10 sekúnd

```kotlin
@Test
fun `retries after delay`() = runTest {
    val start = currentTime      // virtuálny čas, nie skutočný čas
    delay(10_000L)                 // toto sa vykoná "okamžite" v skutočnom wall-clock čase
    val elapsed = currentTime - start
    assertEquals(10_000L, elapsed)   // virtuálny čas SA posunul správne, len nie v reálnom čase
}
```

Vnútri `runTest` `delay` naozaj nepozastaví vykonávanie na túto dobu — testovací dispatcher
namiesto toho pretočí virtuálny čas dopredu, takže test s niekoľkými sekundami hodnoty `delay`
volaní stále beží v milisekundách skutočného času, zatiaľ čo testovaný coroutine kód sa stále
*správa*, akoby skutočný čas plynul (timeouty, poradie relatívne k inej oneskorenej práci, atď.
všetko stále funguje správne).

## Testovanie `Flow`

```kotlin
@Test
fun `flow emits expected values`() = runTest {
    val result = countDown().toList()     // zozbieraj celý flow do List pre ľahké porovnanie
    assertEquals(listOf(3, 2, 1), result)
}
```

```kotlin
import app.cash.turbine.test    // populárna knižnica tretej strany špecificky na testovanie Flow

@Test
fun `flow emits values in order`() = runTest {
    countDown().test {
        assertEquals(3, awaitItem())
        assertEquals(2, awaitItem())
        assertEquals(1, awaitItem())
        awaitComplete()
    }
}
```

Zber do `List` funguje fajn pre konečný flow s malým počtom hodnôt; knižnica ako Turbine je bežná
pre zložitejšie scenáre testovania flow (presné overenie poradia emisií, testovanie flow, ktoré
prirodzene nekončia, testovanie správania `SharedFlow`/`StateFlow` — pozri
[StateFlow a SharedFlow](../04-flow/stateflow-and-sharedflow.md)).

## Vloženie `TestDispatcher` do testovaného kódu

```kotlin
class UserViewModel(private val dispatcher: CoroutineDispatcher = Dispatchers.Default) {
    fun loadUser(id: Int) {
        CoroutineScope(dispatcher).launch {
            // ...
        }
    }
}

@Test
fun `loads user`() = runTest {
    val viewModel = UserViewModel(dispatcher = StandardTestDispatcher(testScheduler))
    // teraz coroutines tohto ViewModelu bežia na ROVNAKOM virtuálno-časovom scheduleri ako test
}
```

Aby virtuálny čas naozaj fungoval správne, testovaný kód potrebuje použiť **ten istý** test
dispatcher/scheduler, na ktorom beží samotný test — preto je produkčný kód akceptujúci
injektovateľný dispatcher (namiesto natvrdo zakódovaného `Dispatchers.Default`/`Dispatchers.IO`
všade) bežná, zámerná dizajnová voľba konkrétne kvôli udržaniu kódu testovateľným.

## Čo táto stránka nepokrýva

Všeobecné testovanie v Kotline (základy JUnit, assertion knižnice, mockovanie) je mimo rozsahu tu
— pozri samostatnú tému Testing in Kotlin pre to; táto stránka je konkrétne o coroutine-špecifických
častiach (virtuálny čas, `runTest`, zber flow v testoch) navrstvených nad akékoľvek všeobecné
testovacie nastavenie, ktoré projekt už používa.
