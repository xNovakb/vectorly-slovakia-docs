---
sidebar_position: 1
title: Sealed Classes a when
---

# Sealed Classes a when

**Sealed class** (alebo `sealed interface`) obmedzí typovú hierarchiu na známu, uzavretú sadu
podtypov — každý možný podtyp musí byť deklarovaný v tom istom súbore alebo module. Toto je jeden
z naozaj najužitočnejších Kotlin idiomov na modelovanie "jedna z týchto konkrétnych vecí, a nič
iné."

## Definovanie sealed hierarchie

```kotlin
sealed class ApiResult<out T>
data class Success<T>(val data: T) : ApiResult<T>()
data class Error(val message: String, val code: Int) : ApiResult<Nothing>()
object Loading : ApiResult<Nothing>()
```

Toto modeluje presne tri možné stavy výsledku API volania — nič iné nemôže rozšíriť `ApiResult`
zvonku tohto súboru, na rozdiel od obyčajnej open triedy, ktorú by mohol subclassovať ktokoľvek,
kdekoľvek.

## Exhaustívne `when` — skutočný prínos

```kotlin
fun render(result: ApiResult<User>) = when (result) {
    is Success -> showUser(result.data)
    is Error -> showError(result.message)
    is Loading -> showSpinner()
    // žiadna `else` vetva netreba — kompilátor vie, že toto sú JEDINÉ možné podtypy
}
```

Keďže kompilátor vie **kompletnú** sadu podtypov, `when` výraz nad sealed class nepotrebuje `else`
vetvu, aby bol exhaustívny — a kriticky, ak sa neskôr do hierarchie pridá nový podtyp, **každý**
`when` blok, ktorý naň matchuje, prestane kompilovať, kým nie je aktualizovaný pre nový prípad.

:::note
Táto compile-time kontrola exhaustívnosti je skutočná hodnota, ktorú sealed classes prinášajú nad
obyčajnú open triedu alebo enum s ručne kontrolovaným type poľom. Pridanie nového prípadu do
obyčajnej hierarchie tried sa potichu skompiluje všade, kde sa naň zabudlo — runtime bug čakajúci
na to, kým sa stane. Sealed class premení rovnakú chybu na chybu kompilácie, na každom mieste
volania, ktoré potrebuje aktualizáciu.
:::

## Sealed class vs. enum — naozaj rôzne nástroje

```kotlin
enum class Direction { NORTH, SOUTH, EAST, WEST }    // pevná sada jednoduchých, bezstavových hodnôt

sealed class NetworkState {
    object Connected : NetworkState()
    data class Disconnected(val reason: String) : NetworkState()   // nesie dáta!
}
```

Položka `enum` nemôže mať rôzne tvary dát na prípad — každá položka je štrukturálne identická.
Podtyp sealed class môže byť `data class` nesúci vlastné odlišné polia (ako `message`/`code`
`Error` vyššie), `object` pre bezstavový singleton prípad, alebo dokonca ďalšia vnorená `sealed
class`. Použi enum pre naozaj pevnú sadu zameniteľných konštánt; použi sealed class, keď rôzne
prípady potrebujú niesť zmysluplne odlišné dáta.

## `sealed interface` — rovnaká myšlienka, tvarovaná ako interface

```kotlin
sealed interface Shape
data class Circle(val radius: Double) : Shape
data class Rectangle(val width: Double, val height: Double) : Shape
```

Užitočné, keď obmedzená hierarchia potrebuje aj implementovať iný interface, alebo keď viacero
sealed hierarchií potrebuje zdieľať spoločný podtyp (trieda môže implementovať viac interfacov,
ale rozšíriť len jednu triedu) — inak `sealed class` a `sealed interface` dosahujú rovnakú
garanciu exhaustívnosti.

## Reálny use case: modelovanie UI stavu

```kotlin
sealed class ScreenState {
    object Loading : ScreenState()
    data class Content(val items: List<Item>) : ScreenState()
    data class Error(val throwable: Throwable) : ScreenState()
    object Empty : ScreenState()
}

fun render(state: ScreenState) = when (state) {
    is ScreenState.Loading -> showSpinner()
    is ScreenState.Content -> if (state.items.isEmpty()) showEmpty() else showList(state.items)
    is ScreenState.Error -> showError(state.throwable)
    is ScreenState.Empty -> showEmpty()
}
```

Presne tento vzor — sealed class modelujúca každý možný stav obrazovky/API/parsovania,
exhaustívne matchovaná — je jeden z najhodnotnejších idiomov v dennodennom Kotline, presne preto,
lebo robí "zabudol som ošetriť prípad" chybou kompilácie namiesto bugu nájdeného v produkcii.

Pozri [Inline a Value Classes](./inline-value-classes.md) pre iné, doplnkové využitie typového
systému Kotlinu — zero-overhead type-safe wrappery namiesto obmedzených hierarchií.
