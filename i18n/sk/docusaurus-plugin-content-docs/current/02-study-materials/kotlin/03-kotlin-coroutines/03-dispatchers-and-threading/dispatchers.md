---
sidebar_position: 1
title: Dispatchery
---

# Dispatchery

**Dispatcher** rozhoduje, na ktorom vlákne (alebo thread poole) coroutine naozaj beží. Samotné
coroutines sú vláknovo-agnostické — dispatcher je to, čo prepája ľahkú coroutine abstrakciu (pozri
[Čo sú Coroutines](../01-basics/what-are-coroutines.md)) so skutočnými OS vláknami.

## Štandardné dispatchery

```kotlin
launch(Dispatchers.Default) { /* CPU-náročná práca */ }
launch(Dispatchers.IO) { /* blokujúce I/O */ }
launch(Dispatchers.Main) { /* UI vlákno — Android/desktop UI frameworky */ }
launch(Dispatchers.Unconfined) { /* zriedka to, čo chceš — pozri nižšie */ }
```

### `Dispatchers.Default` — CPU-viazaná práca

Thread pool veľkosti podľa počtu dostupných CPU jadier. Vhodné pre naozaj CPU-náročnú prácu:
triedenie veľkých kolekcií, komplexné výpočty, parsovanie veľkého množstva dát — čokoľvek, čo
naozaj zaneprázdňuje jadro namiesto čakania na niečo externé.

### `Dispatchers.IO` — blokujúce I/O

Väčší thread pool (môže rásť výrazne nad počet CPU jadier), navrhnutý špecificky pre blokujúce
volania: file I/O, blokujúce sieťové volania, blokujúce databázové drivery. Keďže tieto vlákna
väčšinou *čakajú* namiesto počítania, mať ich viac než CPU jadier dáva zmysel — nesúťažia o CPU
čas tak, ako to robí workload `Default`.

### `Dispatchers.Main` — UI vlákno

Dostupné v UI frameworkoch (Android, a niektoré desktop UI toolkity cez extension knižnice) —
smeruje na jediné vlákno, na ktorom sa musia diať UI aktualizácie. Nemá zmysel v čisto
backendovom/serverovom kontexte bez akéhokoľvek UI vlákna vôbec.

### `Dispatchers.Unconfined` — na špeciálny účel, zriedka správna predvoľba

```kotlin
launch(Dispatchers.Unconfined) {
    println(Thread.currentThread().name)   // začne tu...
    delay(100)
    println(Thread.currentThread().name)   // ...ale môže sa obnoviť na úplne inom vlákne
}
```

Neobmedzuje vykonávanie na žiadne konkrétne vlákno — začne na vlákne volajúceho, ale po suspenzii
sa môže obnoviť na akomkoľvek vlákne, na ktorom ho suspending funkcia náhodou obnoví. Užitočné pre
pár špecifických pokročilých/testovacích scenárov, ale jeho nepredvídateľné vláknové správanie ho
robí zlou predvolenou voľbou pre bežný aplikačný kód.

## Výber správneho — rýchla referencia

```text
Triedenie veľkého zoznamu, spracovanie obrázkov, komplexná matematika  -> Dispatchers.Default
Čítanie súboru, blokujúce JDBC volanie, blokujúci HTTP klient          -> Dispatchers.IO
Aktualizácia UI elementov (Android/desktop)                              -> Dispatchers.Main
Všetko ostatné / väčšina biznis logiky bez blokujúcich volaní             -> akýkoľvek dispatcher,
                                                                              na ktorom už si (často
                                                                              netreba explicitný
                                                                              dispatcher vôbec)
```

## Špecifikácia dispatchera pri spúšťaní

```kotlin
CoroutineScope(Dispatchers.IO).launch {
    val data = readFile("data.txt")    // blokujúce volanie, vhodne na Dispatchers.IO
}
```

Pozri [Prepínanie Kontextu](./context-switching.md) pre prepínanie dispatcherov **uprostred
coroutine** (namiesto fixovania jedného dispatchera na celú životnosť coroutine) — bežnejší
reálny vzor, keďže jedna coroutine často potrebuje robiť aj CPU prácu aj I/O v rôznych bodoch.

## Vlastný thread pool, keď predvolené nesedia

```kotlin
val customDispatcher = Executors.newFixedThreadPool(4).asCoroutineDispatcher()
```

Zriedkavé v typickom aplikačnom kóde, ale dostupné, keď je naozaj potrebný konkrétny, izolovaný
thread pool (napr. izolácia jedného konkrétneho druhu blokujúcej práce od zdieľaného poolu
`Dispatchers.IO`, aby nemohla vyhladovať inú I/O prácu).
