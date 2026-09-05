---
sidebar_position: 3
title: Testovanie Kontrolérov s MockMvc
---

# Testovanie Kontrolérov s MockMvc

Medzi čistým unit testom ([Unit Testovanie s MockK](./unit-testing-with-mockk.md), žiadny Spring
zapojený vôbec) a plným integračným testom
([Integračné Testovanie s Testcontainers](./integration-testing-with-testcontainers.md), reálna
databáza) `MockMvc` testuje **konkrétne web vrstvu** — smerovanie, parsovanie požiadavky,
validáciu, serializáciu odpovede — bez spustenia skutočného HTTP servera alebo sieťového
pripojenia.

## Základný setup

```kotlin
@WebMvcTest(OrderController::class)
class OrderControllerTest {

    @Autowired
    lateinit var mockMvc: MockMvc

    @MockkBean
    lateinit var orderService: OrderService

    @Test
    fun `GET orders:id returns the order as JSON`() {
        every { orderService.findById(1L) } returns Order(id = 1L, status = "pending", total = BigDecimal("50.00"))

        mockMvc.perform(get("/orders/1"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.status").value("pending"))
    }

    @Test
    fun `POST orders with invalid body returns 400`() {
        mockMvc.perform(
            post("/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"customerId": null}""")
        ).andExpect(status().isBadRequest)
    }
}
```

`@WebMvcTest(OrderController::class)` načíta **len** web vrstvu — tento jeden kontrolér, Spring
MVC infraštruktúru, a [exception handler](../03-web-layer/exception-handling-in-controllers.md)
— nie plný application context, nie reálne service/repository beany. `@MockkBean` (Spring
integrácia MockK) nahradí `OrderService` mockom vnútri tohto výseku kontextu, rovnaká
`every`/`verify` slovná zásoba z [Unit Testovanie s MockK](./unit-testing-with-mockk.md) platí aj
tu.

## Čo toto naozaj overuje, čo čistý unit test nie

```text
Čistý MockK unit test:      Správa sa vlastná logika OrderService správne?
MockMvc controller test:      Smeruje URL správne? Naozaj sa spustí @Valid validácia?
                                Je JSON odpoveď správne tvarovaná? Namapujú sa výnimky na správny
                                status kód cez GlobalExceptionHandler?
```

Controller metóda so správnou internou logikou môže byť stále dosiahnutá zlou URL, zlyhať
aplikovať validáciu kvôli [`@field:` gotcha](../03-web-layer/request-validation.md), alebo vrátiť
zlý status kód — nič z toho by samotný service-level MockK test nikdy nezachytil, keďže sa vôbec
nedotýka smerovacej/serializačnej mašinérie Spring web vrstvy.

## Overovanie tvaru JSON odpovede

```kotlin
mockMvc.perform(get("/orders/1"))
    .andExpect(status().isOk)
    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
    .andExpect(jsonPath("$.id").value(1))
    .andExpect(jsonPath("$.status").value("pending"))
    .andExpect(jsonPath("$.items").isArray)
    .andExpect(jsonPath("$.items.length()").value(2))
```

`jsonPath(...)` umožňuje testu overiť konkrétne polia vnútri JSON tela bez toho, aby ho najprv
deserializoval do Kotlin objektu — užitočné na potvrdenie, že skutočný formát na drôte (mená
polí, vnorenie, typy) zodpovedá očakávaniu, čo je konkrétne to, čo má táto vrstva testu zachytiť.

## Testovanie, že zlyhania validácie vrátia správny tvar

```kotlin
@Test
fun `POST orders with blank email returns field-level validation errors`() {
    mockMvc.perform(
        post("/users")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""{"email": "", "name": "Jane"}""")
    )
        .andExpect(status().isBadRequest)
        .andExpect(jsonPath("$.code").value("validation_failed"))
        .andExpect(jsonPath("$.fields[0].field").value("email"))
}
```

Toto je presne druh testu, ktorý by bol zachytil
[gotcha cieľa anotácie `@field:`](../03-web-layer/request-validation.md) pokrytý skôr v tejto
téme — MockK-only unit test service vrstvy by nikdy nepreveril Bean Validation vôbec, keďže
validácia sa deje na web vrstve, predtým, než sa vôbec zavolá service metóda.

## Kedy siahnuť po MockMvc vs. plnom integračnom teste

MockMvc je správna vrstva pre "je samotná web vrstva správna" — smerovanie, validácia,
serializácia, mapovanie chýb. Zámerne sa nedotýka reálnej databázy, takže nemôže zachytiť naozaj
pokazenú query alebo JPA mapovací problém — na to slúžia
[Testcontainers](./integration-testing-with-testcontainers.md). Väčšina kontrolérov profituje z
oboch: MockMvc test pre kontrakt web vrstvy, a integračné testy nižšie v stacku konkrétne pre
dátovú vrstvu.
