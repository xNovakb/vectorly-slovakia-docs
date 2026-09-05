---
sidebar_position: 2
title: Suspend Funkcie
---

# Suspend Funkcie

Modifikátor `suspend` je to, čo robí funkciu schopnou pozastaviť sa — zastaviť svoje vykonávanie
bez blokovania vlákna, a neskôr sa obnoviť, možno na inom vlákne.

## Deklarovanie

```kotlin
suspend fun fetchUser(id: Int): User {
    delay(100L)                 // predstav si, že toto je sieťové volanie
    return User(id, "Jane")
}
```

Na tele funkcie nič nevyzerá nezvyčajne — je to kľúčové slovo `suspend` na signatúre, čo umožní
zavolať toto z, a volať do, iného suspending kódu. Zavolanie `delay` (samo o sebe suspend funkcia)
vnútri non-`suspend` funkcie je **chyba pri kompilácii**, nie runtime varovanie.

## Základné pravidlo: suspend funkcie sa dajú volať len zo suspending kontextu

```kotlin
fun regularFunction() {
    fetchUser(1)    // ❌ chyba kompilácie: suspend funkciu 'fetchUser' možno volať len
                       //    z coroutine alebo inej suspend funkcie
}

suspend fun anotherSuspendFunction() {
    fetchUser(1)    // ✅ v poriadku — táto funkcia je sama suspend
}

fun main() = runBlocking {
    fetchUser(1)    // ✅ v poriadku — runBlocking poskytuje coroutine (suspending) kontext
}
```

Toto vynucuje samotný Kotlin kompilátor, nie kódovacia konvencia, ktorú si niekto musí pamätať a
dodržiavať — naozaj nemôžeš náhodou zavolať suspend funkciu z bežného, non-coroutine kódu a
nechať to potichu skompilovať.

## Prečo je toto garancia z času kompilácie, nie len dokumentácia

V mnohých iných jazykoch je "táto funkcia robí async prácu" niečo, čo sa naučíš z dokumentácie,
naming konvencie, alebo runtime chyby — nič ti nebráni zavolať ju nesprávne, kým to naozaj
neurobíš a niečo sa nepokazí. Kotlin modifikátor `suspend` je súčasťou **typu** funkcie —
kompilátor sleduje, pri každom volaní, či si aktuálne vnútri suspending kontextu, a odmietne
skompilovať, ak nie si. Toto je zmysluplne silnejšia garancia než prístupy založené na konvencii v
iných ekosystémoch.

## Čo sa naozaj deje pod kapotou, v skratke

Kotlin kompilátor transformuje suspend funkciu na stavový automat (cez **Continuation Passing
Style**) — každý bod suspenzie sa stane stavom, v ktorom sa funkcia môže pozastaviť a neskôr z
neho obnoviť, so zachovanými lokálnymi premennými. Túto transformáciu priamo nepíšeš ani o nej
nepremýšľaš — je neviditeľná v dennodennom coroutine kóde — ale je *dôvodom*, prečo môže byť stav
pozastavenej coroutine lacno držaný na heape namiesto potreby rezervovaného OS thread stacku
(pozri [Čo sú Coroutines](./what-are-coroutines.md), prečo na tom záleží pri väčšej škále).

## Suspend funkcie nie sú automaticky konkurentné

```kotlin
suspend fun fetchTwoUsers(): Pair<User, User> {
    val user1 = fetchUser(1)    // čaká, kým sa toto dokončí...
    val user2 = fetchUser(2)    // ...predtým než toto začne
    return user1 to user2
}
```

Zavolanie dvoch suspend funkcií jednu po druhej stále beží **sekvenčne** — `suspend` znamená
"schopná pozastaviť sa," nie "beží konkurentne so všetkým ostatným." Skutočný beh práce konkurentne
vyžaduje explicitné spustenie samostatných coroutines — pozri [Launch vs. Async](./launch-vs-async.md).

## Suspend funkcia volajúca bežnú (non-suspend) funkciu je úplne normálne

```kotlin
suspend fun processData(): String {
    val raw = fetchRawData()      // suspend funkcia
    return formatData(raw)          // bežná funkcia — žiadny problém zavolať ju zo suspend kódu
}
```

Obmedzenie ide len jedným smerom: suspend funkcia môže voľne volať bežné funkcie; bežná funkcia
nemôže volať suspend funkciu.
