---
sidebar_position: 1
title: Bežné Chyby s Coroutines
---

# Bežné Chyby s Coroutines

Prehľad chýb, ktoré sa opakovane objavujú, akonáhle ľudia začnú písať skutočný coroutine kód —
väčšina sa dá vystopovať k nepochopeniu jednej z predchádzajúcich stránok v tejto téme.

## Nadmerné používanie `GlobalScope`

```kotlin
❌ fun refreshData() {
    GlobalScope.launch {
        fetchLatestData()
    }
}
```

`GlobalScope` spustí coroutine bez rodiča, bez ohraničenej životnosti, a bez akéhokoľvek spojenia
so štruktúrovanou konkurenciou vôbec (pozri
[Vysvetlenie Štruktúrovanej Konkurencie](../02-structured-concurrency/structured-concurrency-explained.md))
— žije, kým celý proces appky neskončí alebo kým sa sama nedokončí, nedá sa zrušiť ako skupina s
ničím iným, a jej výnimky nie sú viazané na nič zmysluplné.

```kotlin
✅ class DataRepository(private val scope: CoroutineScope) {
    fun refreshData() {
        scope.launch {
            fetchLatestData()
        }
    }
}
```

Namiesto toho viaž coroutines na scope so skutočnou, ohraničenou životnosťou — vlastný scope
triedy, zrušený, keď je táto trieda hotová. `GlobalScope` má pár legitímnych okrajových použití
(naozaj procesovo-dlhá práca na pozadí), ale siahnutie po ňom ako predvolenej voľbe je takmer vždy
zlé rozhodnutie.

## Zabudnutie `suspend` na funkcii, ktorá to potrebuje

```kotlin
❌ fun fetchUser(id: Int): User {
    return apiClient.getUser(id)    // chyba kompilácie, ak je getUser() sama suspend funkcia
}
```

```kotlin
✅ suspend fun fetchUser(id: Int): User {
    return apiClient.getUser(id)
}
```

Priamočiare, keď sa raz vidí, ale bežný počiatočný kameň úrazu — pozri
[Suspend Funkcie](../01-basics/suspend-functions.md), prečo je toto obmedzenie z času kompilácie,
nie len štýlová smernica.

## Spustenie coroutine a nečakanie na výsledok, ktorý si naozaj potreboval

```kotlin
❌ fun processOrder(order: Order): ProcessedOrder {
    var result: ProcessedOrder? = null
    launch {
        result = expensiveProcessing(order)    // toto sa nemusí byť ešte dokončené...
    }
    return result!!    // ...takže toto môže spadnúť, alebo potichu vrátiť zastaranú/null hodnotu
}
```

```kotlin
✅ suspend fun processOrder(order: Order): ProcessedOrder {
    return expensiveProcessing(order)    // alebo async { }.await(), ak je konkurencia naozaj potrebná
}
```

`launch` na nič nečaká a nevráti žiadnu hodnotu — pokus o prečítanie výsledku, ktorý mal prísť
zvnútra `launch` bloku, hneď po jeho spustení, je race condition zo samotnej konštrukcie. Ak
potrebuješ hodnotu späť, funkcia musí byť `suspend` a buď priamo počkať na async prácu, alebo
správne použiť [`async`](../01-basics/launch-vs-async.md).

## Použitie `Dispatchers.Main` (alebo ničoho) na blokujúcu prácu

Podrobne pokryté v [Blokujúce Volania v Coroutines](./blocking-calls-in-coroutines.md) — oplatí sa
mu vlastná dedikovaná stránka vzhľadom na to, aká je táto konkrétna chyba bežná a rušivá.

## Neošetrenie zrušenia v cleanup kóde

```kotlin
❌ launch {
    try {
        doWork()
    } catch (e: Exception) {
        retry()    // toto zachytí aj CancellationException — retry-uje aj keď je naozaj zrušené!
    }
}
```

```kotlin
✅ launch {
    try {
        doWork()
    } catch (e: CancellationException) {
        throw e    // nechaj zrušenie propagovať — nezaobchádzaj s ním ako s opakovateľným zlyhaním
    } catch (e: Exception) {
        retry()
    }
}
```

Široký `catch (e: Exception)` zachytí aj `CancellationException` (pozri
[Zrušenie](../02-structured-concurrency/cancellation.md)), pokiaľ nie je explicitne vylúčená —
jej pohltenie rozbije zrušenie pre coroutine a čokoľvek, čo sa spolieha na jeho propagáciu.

## Ignorovanie `Job` vráteného z `launch`, keď naozaj potrebuješ spravovať jeho lifecycle

```kotlin
❌ launch { longRunningTask() }    // žiadna referencia zachovaná — nemôžeš to neskôr zrušiť, ak treba

✅ val job = launch { longRunningTask() }
   // neskôr, ak treba:
   job.cancel()
```

V poriadku zahodiť `Job` pre naozaj fire-and-forget prácu, ktorej životnosť je už viazaná na
rodičovský scope — ale bežná chyba, keď životnosť coroutine naozaj potrebuje nezávislú správu
(napr. zrušenie jednej konkrétnej background úlohy bez zrušenia všetkého ostatného v scope).
