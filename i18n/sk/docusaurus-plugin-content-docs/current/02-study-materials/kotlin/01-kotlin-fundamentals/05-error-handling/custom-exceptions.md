---
sidebar_position: 3
title: Vlastné Výnimky
---

# Vlastné Výnimky

## Definovanie vlastného typu výnimky

```kotlin
class InsufficientFundsException(message: String) : Exception(message)

fun withdraw(amount: Double, balance: Double) {
    if (amount > balance) {
        throw InsufficientFundsException("Cannot withdraw $amount, balance is only $balance")
    }
}
```

Vlastná výnimka je jednoducho trieda rozširujúca `Exception` (alebo jej subtyp) — konštruktorová
syntax Kotlinu (pozri [Triedy a Konštruktory](../03-classes-and-objects/classes-and-constructors.md))
robí toto jednoriadkovkou v bežnom prípade, keď treba len vlastnú správu.

## Pridanie polí nad rámec len správy

```kotlin
class InsufficientFundsException(
    val requested: Double,
    val available: Double
) : Exception("Cannot withdraw $requested, only $available available")

try {
    throw InsufficientFundsException(requested = 500.0, available = 200.0)
} catch (e: InsufficientFundsException) {
    println("Short by ${e.requested - e.available}")    // štruktúrované dáta, nie len parsovanie stringu správy
}
```

Pripojenie skutočných polí (nie len formátovanej správy) umožní volajúcemu kódu reagovať
programaticky na *prečo* niečo zlyhalo, namiesto potreby parsovať ľudsky čitateľný string na
extrakciu detailov — zmysluplne robustnejší vzor než kódovanie všetkého len do správy výnimky.

## Výber, čo rozšíriť

```kotlin
class ValidationException(message: String) : IllegalArgumentException(message)     // "volajúci poslal zlý vstup"
class ConfigurationException(message: String) : IllegalStateException(message)       // "interný stav je zlý"
class NotFoundException(message: String) : RuntimeException(message)                  // naozaj nová kategória
```

Rozšírenie existujúceho, sémanticky vhodného typu výnimky (`IllegalArgumentException`,
`IllegalStateException`) namiesto vždy rozširovania generickej `Exception`/`RuntimeException`
umožní existujúcim catch blokom napísaným pre tú širšiu kategóriu stále chytiť aj tvoj vlastný
typ — užitočné, keď tvoja výnimka naozaj *je* konkrétnejším prípadom existujúcej, dobre pochopenej
kategórie, nie plne novým druhom zlyhania.

## Hierarchie výnimiek pre doménu

```kotlin
sealed class OrderException(message: String) : Exception(message)

class OrderNotFoundException(id: Int) : OrderException("Order $id not found")
class OrderAlreadyShippedException(id: Int) : OrderException("Order $id already shipped, cannot modify")
class InvalidOrderStateException(id: Int, state: String) : OrderException("Order $id in invalid state: $state")
```

```kotlin
fun handleOrderError(e: OrderException) {
    when (e) {
        is OrderNotFoundException -> println("404: ${e.message}")
        is OrderAlreadyShippedException -> println("409: ${e.message}")
        is InvalidOrderStateException -> println("400: ${e.message}")
        // žiadne `else` netreba — sealed znamená, že kompilátor vie, že tento `when` je exhaustívny
    }
}
```

Označenie základnej výnimky ako `sealed` (pokryté podrobne v
[Sealed Classes & Interfaces](/sk/study-materials/kotlin/kotlin-idioms/classes-advanced/sealed-classes-and-when)
v téme Kotlin Idioms & Advanced Features) znamená, že `when` ošetrujúci každý subtyp vôbec
nepotrebuje `else` vetvu — kompilátor overí, že každý možný subtyp `OrderException` je naozaj
ošetrený, a upozorní, ak sa neskôr pridá nový subtyp bez aktualizácie tohto `when`.

## Zachovanie originálnej príčiny

```kotlin
class DataAccessException(message: String, cause: Throwable) : Exception(message, cause)

try {
    database.query("...")
} catch (e: SQLException) {
    throw DataAccessException("Failed to load user data", e)    // originálna SQLException zachovaná ako `cause`
}
```

Zabalenie nízkoúrovňovej výnimky (surová `SQLException`) do zmysluplnejšej, doménovo-špecifickej
je bežný a užitočný vzor — ale vždy odovzdaj originálnu výnimku ako `cause`, nie len jej správu.
Toto udrží plný originálny stack trace dostupný na debugovanie, namiesto jeho straty v momente
opätovného zabalenia.
