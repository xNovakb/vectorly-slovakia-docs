---
sidebar_position: 3
title: StateFlow a SharedFlow
---

# StateFlow a SharedFlow

Oba sú **hot** flow (pozri [Úvod do Flow](./introduction-to-flow.md) pre cold vs. hot) — existujú
a vedia emitovať nezávisle od toho, či ich práve niekto zbiera, a viacero zberateľov zdieľa ten
istý podkladový prúd. Naozaj bežný bod zmätku medzi nimi dvoma stojí za priame riešenie.

## `StateFlow` — vždy má aktuálnu hodnotu

```kotlin
val state = MutableStateFlow(0)     // musí dostať počiatočnú hodnotu

state.value = 1                       // aktualizuj ju priamo
println(state.value)                    // čítaj aktuálnu hodnotu priamo, žiadna suspenzia netreba

state.collect { println("New value: $it") }   // dá sa zbierať aj ako flow
```

Každý `StateFlow` vždy drží presne jednu aktuálnu hodnotu, čitateľnú synchrónne cez `.value`
kedykoľvek — neexistuje niečo ako `StateFlow` "bez hodnoty zatiaľ." Nový zberateľ **okamžite**
dostane najprv aktuálnu hodnotu, potom nasledujúce aktualizácie.

## `SharedFlow` — konfigurovateľný, event-oriented

```kotlin
val events = MutableSharedFlow<String>(replay = 0)    // vôbec žiadny koncept "aktuálnej hodnoty"

events.emit("user_clicked")     // suspending — emituje tomu, kto práve zbiera
events.tryEmit("user_clicked")    // non-suspending variant, môže hodnotu zahodiť, ak je buffer plný
```

`SharedFlow` nemá vstavaný pojem "aktuálnej hodnoty" — je to všeobecný broadcast mechanizmus, s
konfigurovateľným `replay` (koľko minulých hodnôt nový zberateľ dostane okamžite) a bufferovacím
správaním.

## Porovnanie, na ktorom naozaj záleží

| | `StateFlow` | `SharedFlow` |
|---|---|---|
| Vždy má aktuálnu hodnotu | Áno, cez `.value` | Nie |
| Nový zberateľ okamžite dostane... | Aktuálnu hodnotu | Nič, pokiaľ nie je nastavený `replay` |
| Zlučuje rýchle aktualizácie (preskočí medzihodnoty, ak je zberateľ pomalý) | Áno, vždy | Len ak je nastavené |
| Typické použitie | Reprezentácia aktuálneho stavu (napr. "aktuálny používateľ," "načítava sa") | Reprezentácia diskrétnych udalostí (napr. "zobraz tento toast," "navigni na túto obrazovku") |
| Postavené na vrchu | `SharedFlow` interne (je to špecializovaný prípad) | — |

## Prečo je toto rozlíšenie naozaj dôležité, nie len API trivia

```kotlin
// ❌ použitie StateFlow pre jednorazové udalosti — neskorý zberateľ dostane POSLEDNÚ udalosť
//    reprodukovanú, aj keď sa už "stala" a nemala by sa spustiť znova (napr. opätovné zobrazenie
//    toastu pri rotácii)
val toastEvents = MutableStateFlow<String?>(null)

// ✅ SharedFlow s replay = 0 — udalosť vidia len zberatelia, ktorí počúvali v momente,
//    keď bola emitovaná, čo je to, čo by mala jednorazová udalosť znamenať
val toastEvents = MutableSharedFlow<String>(replay = 0)
```

Použitie `StateFlow` pre niečo, čo je koncepčne jednorazová **udalosť** (zobraz toast, navigni
niekam, zobraz chybový dialóg) je bežná a naozaj rušivá chyba — lebo vždy drží "aktuálnu
hodnotu," neskorý zberateľ (napr. po rotácii UI, alebo nová obrazovka sa prihlasujúca na odber)
môže vidieť starú udalosť spustiť sa znova, neúmyselne.

## Po čom siahnuť

```text
"Aký je aktuálny stav X?"    -> StateFlow
"Práve sa niečo stalo"          -> SharedFlow (typicky s replay = 0)
```

Ak je odpoveď na "čo by mal úplne nový zberateľ vidieť okamžite" "aktuálnu hodnotu niečoho," siahni
po `StateFlow`. Ak je odpoveď "nič, pokiaľ nepočúva, keď sa stane ďalšia vec," siahni po
`SharedFlow`.
