---
sidebar_position: 1
title: REST Kontroléry
---

# REST Kontroléry

## Základný tvar

```kotlin
@RestController
@RequestMapping("/orders")
class OrderController(private val orderService: OrderService) {

    @GetMapping("/{id}")
    fun getOrder(@PathVariable id: Long): OrderResponse =
        orderService.findById(id).toResponse()

    @PostMapping
    fun createOrder(@RequestBody request: CreateOrderRequest): OrderResponse =
        orderService.placeOrder(request).toResponse()

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteOrder(@PathVariable id: Long) =
        orderService.delete(id)
}
```

`@RestController` kombinuje `@Controller` a `@ResponseBody` — návratová hodnota každej metódy sa
serializuje priamo do tela odpovede (JSON, predvolene s Jackson), nie resolvovaná ako meno view
šablóny, ako by to robil obyčajný `@Controller`.

## Anotácie mapovania HTTP metód

```kotlin
@GetMapping("/orders")       // GET  — pozri HTTP Metódy v téme HTTP a Web Základy
@PostMapping("/orders")        // POST
@PutMapping("/orders/{id}")      // PUT
@PatchMapping("/orders/{id}")      // PATCH
@DeleteMapping("/orders/{id}")       // DELETE
```

Tieto sa mapujú priamo na sémantiku HTTP metód pokrytú v
[HTTP Metódy](/sk/study-materials/http-web/methods-and-semantics/http-methods) — Spring
nevymýšľa vlastný koncept slovies, je to tenká smerovacia vrstva nad rovnakými HTTP metódami, a
rovnaké [idempotency/safety](/sk/study-materials/http-web/methods-and-semantics/idempotency-and-safety)
očakávania z tej témy platia rovnako pre návrh Spring kontroléra (`@GetMapping` metóda by stále
nemala mať vedľajšie efekty, bez ohľadu na to, čo by Spring samotný technicky dovolil).

## Data classes ako telá požiadaviek/odpovedí

```kotlin
data class CreateOrderRequest(
    val customerId: Long,
    val items: List<OrderItemRequest>
)

data class OrderResponse(
    val id: Long,
    val status: String,
    val total: BigDecimal
)
```

Jackson (predvolená JSON knižnica Spring Boot) deserializuje prichádzajúce JSON telo priamo do
data class cez jej primárny konštruktor, a serializuje vrátenú data class späť na JSON pomocou
jej vlastností — netreba manuálny mapovací kód pre bežný prípad. Toto vyžaduje závislosť
`jackson-module-kotlin` (zahrnutú automaticky štandardným `spring-boot-starter-web` + Kotlin
setupom) konkrétne na správne pochopenie tvaru triedy založeného na konštruktore Kotlinu a
non-null typov.

## Path premenné a query parametre

```kotlin
@GetMapping("/orders/{id}/items/{itemId}")
fun getOrderItem(
    @PathVariable id: Long,
    @PathVariable itemId: Long
): OrderItemResponse = /* ... */

@GetMapping("/orders")
fun searchOrders(
    @RequestParam status: String?,
    @RequestParam(defaultValue = "0") page: Int
): List<OrderResponse> = /* ... */
```

Mapuje sa priamo na rozlíšenie
[query params vs. path segmenty vs. telo](/sk/study-materials/http-web/methods-and-semantics/query-params-vs-request-body)
z témy HTTP a Web Základy — `@PathVariable` na identifikáciu jedného konkrétneho zdroja,
`@RequestParam` na filtrovanie/stránkovanie kolekcie, `@RequestBody` na skutočné dáta, ktoré sa
vytvárajú alebo aktualizujú.

## Status kódy odpovedí

```kotlin
@PostMapping
@ResponseStatus(HttpStatus.CREATED)      // 201, nie predvolené 200
fun createOrder(@RequestBody request: CreateOrderRequest): OrderResponse = /* ... */
```

Bez `@ResponseStatus` úspešná controller metóda predvolene vráti `200 OK` — explicitné
nastavenie `201 Created` pre vytvárajúci `POST` (alebo `204 No Content` pre `DELETE`, ako v prvom
príklade) zodpovedá konvenciám [status kódov](/sk/study-materials/http-web/basics/status-codes)
pokrytým v téme HTTP a Web Základy, namiesto vrátenia technicky fungujúceho, ale sémanticky
nepresného `200` pre všetko.

## Kde sa spracovávajú chyby

Všimni si, že žiadna z týchto metód nemá explicitné try/catch bloky pre veci ako "objednávka
nenájdená" — to sa spracúva centrálne, pokryté ďalej v
[Spracovanie Výnimiek v Kontroléroch](./exception-handling-in-controllers.md).
