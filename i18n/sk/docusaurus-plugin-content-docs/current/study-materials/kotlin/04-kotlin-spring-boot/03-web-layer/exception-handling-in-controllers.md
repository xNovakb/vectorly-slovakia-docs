---
sidebar_position: 3
title: Spracovanie Výnimiek v Kontroléroch
---

# Spracovanie Výnimiek v Kontroléroch

Centralizovanie spracovania chýb namiesto obaľovania každej controller metódy vlastným
try/catch — jedno miesto, ktoré premení výnimky na konzistentné, dobre tvarované HTTP odpovede
naprieč celou appkou.

## `@ControllerAdvice` + `@ExceptionHandler`

```kotlin title="config/GlobalExceptionHandler.kt"
@ControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(OrderNotFoundException::class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    fun handleNotFound(ex: OrderNotFoundException): ErrorResponse =
        ErrorResponse(code = "not_found", message = ex.message ?: "Not found")

    @ExceptionHandler(MethodArgumentNotValidException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun handleValidation(ex: MethodArgumentNotValidException): ErrorResponse {
        val fields = ex.bindingResult.fieldErrors.map {
            FieldError(field = it.field, message = it.defaultMessage ?: "invalid")
        }
        return ErrorResponse(code = "validation_failed", message = "Validation failed", fields = fields)
    }

    @ExceptionHandler(Exception::class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    fun handleUnexpected(ex: Exception): ErrorResponse =
        ErrorResponse(code = "internal_error", message = "Something went wrong")
}
```

`@ControllerAdvice` platí naprieč **každým** kontrolérom v appke — jedna trieda zachytáva
výnimky vyhodené z ktoréhokoľvek z nich, namiesto potreby per-controller spracovania. Každá
`@ExceptionHandler` metóda cieli na jeden typ výnimky (alebo hierarchiu — handler pre supertyp
zachytí aj podtypy inak konkrétnejšie neošetrené).

## Konzistentný tvar chyby

```kotlin title="dto/ErrorResponse.kt"
data class ErrorResponse(
    val code: String,
    val message: String,
    val fields: List<FieldError> = emptyList()
)

data class FieldError(
    val field: String,
    val message: String
)
```

Toto je ten istý princíp konzistentného tvaru chyby všeobecne pokrytý v
[Návrh Dobrého API](/sk/study-materials/http-web/rest-and-api-design/designing-a-good-api) v téme
HTTP a Web Základy — chyby každého endpointu vracajúce sa v jednom predvídateľnom tvare
umožňujú kódu klienta napísať jeden všeobecný error handler namiesto špeciálneho zaobchádzania s
každým endpointom.

## Vlastné doménové výnimky

```kotlin
class OrderNotFoundException(orderId: Long) : RuntimeException("Order $orderId not found")

class InsufficientStockException(productId: Long) : RuntimeException("Product $productId out of stock")
```

```kotlin title="service/OrderService.kt"
fun findById(id: Long): Order =
    orderRepository.findById(id) ?: throw OrderNotFoundException(id)
```

Doménovo-špecifické výnimky, vyhodené z kódu service vrstvy, udržia *service* zameraný na
business logiku — nepotrebuje vedieť ani sa starať, aký HTTP status kód sa nakoniec stane z jeho
zlyhania; toto mapovanie žije úplne v `GlobalExceptionHandler`.

## Na poradí záleží pri hierarchiách výnimiek

```kotlin
@ExceptionHandler(OrderNotFoundException::class)   // konkrétnejšie — skontrolované prvé
fun handleNotFound(ex: OrderNotFoundException): ErrorResponse = /* ... */

@ExceptionHandler(RuntimeException::class)           // menej konkrétne — zachytí čokoľvek iné
fun handleRuntimeException(ex: RuntimeException): ErrorResponse = /* ... */

@ExceptionHandler(Exception::class)                    // najširší catch-all, posledná záchrana
fun handleUnexpected(ex: Exception): ErrorResponse = /* ... */
```

Spring automaticky vyberie **najkonkrétnejší** zodpovedajúci handler, bez ohľadu na poradie, v
akom sú metódy deklarované v triede — ale stále sa oplatí mentálne radiť handlery od konkrétnych
po všeobecné pri ich čítaní/písaní, keďže toto je efektívne poradie riešenia.

:::note
Catch-all `Exception::class` handler vracajúci všeobecný `500` sa oplatí mať (aby neočakávaný bug
produkoval čistú JSON chybu namiesto surového stack trace unikajúceho ku klientovi), ale nemal by
byť spoliehaný ako primárny mechanizmus spracovania chýb — naozaj očakávané prípady zlyhania
(nenájdené, validácia, porušenia business pravidiel) si zaslúžia vlastné konkrétne typy výnimiek
a handlery, namapované na správny [status kód](/sk/study-materials/http-web/basics/status-codes),
nie presmerované cez všeobecný 500 handler.
:::
