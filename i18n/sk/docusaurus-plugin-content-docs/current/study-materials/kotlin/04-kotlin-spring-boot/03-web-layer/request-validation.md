---
sidebar_position: 2
title: Validácia Požiadaviek
---

# Validácia Požiadaviek

## Základy Bean Validation

```kotlin
data class CreateUserRequest(
    @field:NotBlank
    val email: String,

    @field:Size(min = 2, max = 100)
    val name: String,

    @field:Min(0)
    val age: Int
)
```

```kotlin
@PostMapping
fun createUser(@Valid @RequestBody request: CreateUserRequest): UserResponse =
    userService.create(request)
```

`@Valid` na parametri kontroléra povie Springu, aby spustil Bean Validation voči prichádzajúcemu
telu požiadavky **pred** tým, než sa vôbec vykoná telo metódy — požiadavka, ktorá zlyhá pri
validácii, sa vôbec nedostane do vlastného kódu `createUser`, Spring automaticky vráti
`400 Bad Request`.

## Gotcha `@field:` — skutočný, bežne narazený Kotlin problém

:::warning
V Kotlin data class sa validačná anotácia napísaná len ako `@NotBlank` (bez prefixu `@field:`)
často pripojí na **konštruktorový parameter**, nie na podkladovú property — a Bean Validation
frameworky všeobecne validujú **fieldy**, nie konštruktorové parametre. Anotácia môže potichu
nerobiť nič vôbec, bez chyby, bez varovania — požiadavka sa "zvaliduje" úspešne aj vtedy, keď by
nemala.

```kotlin
❌ data class CreateUserRequest(
       @NotBlank            // môže sa pripojiť na zlý cieľ — validácia potichu preskočená
       val email: String
   )

✅ data class CreateUserRequest(
       @field:NotBlank         // explicitne cieli na property/field
       val email: String
   )
```

Toto je konkrétne dôsledok **use-site targets** Kotlinu — anotácia na primárnom konštruktorovom
`val` parametri je nejednoznačná ohľadom toho, či myslí parameter, field, getter, alebo niečo
iné, a rôzne anotácie majú predvolene rôzne ciele. `@field:` (alebo `@get:`, `@param:`, atď.)
túto nejednoznačnosť explicitne odstráni. Vždy použi `@field:` pre Bean Validation anotácie na
konštruktorovej property Kotlin data class.
:::

## Bežné validačné anotácie

```kotlin
data class ProductRequest(
    @field:NotBlank
    val name: String,

    @field:NotNull
    @field:Positive
    val price: BigDecimal,

    @field:Email
    val contactEmail: String?,

    @field:Pattern(regexp = "^[A-Z]{3}-\\d{4}$")
    val sku: String
)
```

```text
@NotBlank    — string nie je null A nie je prázdny/len whitespace
@NotNull       — hodnota nie je null (funguje na akomkoľvek type, nekontroluje prázdnosť)
@NotEmpty        — kolekcia/string nie je null a má aspoň jeden prvok/znak
@Size              — dĺžka stringu alebo veľkosť kolekcie v rámci hraníc
@Min / @Max          — numerické hranice
@Positive / @Negative  — numerické znamienko
@Email                   — platný email formát
@Pattern                   — zodpovedá regexu
```

## Validovanie vnorených objektov

```kotlin
data class CreateOrderRequest(
    @field:NotEmpty
    @field:Valid                 // bez tohto sa validácia vnoreného objektu úplne preskočí
    val items: List<OrderItemRequest>
)

data class OrderItemRequest(
    @field:NotNull
    val productId: Long,
    @field:Positive
    val quantity: Int
)
```

`@Valid` na vnorenom objekte alebo kolekčnom fielde je potrebný na to, aby validácia **kaskádovala**
doňho — bez neho sa vlastné anotácie `OrderItemRequest` jednoducho nikdy neskontrolujú, aj keď sú
v kóde prítomné, ďalšia ľahko prehliadnuteľná potichu chýbajúca vec namiesto explicitného zlyhania.

## Čo sa stane pri zlyhaní validácie

`MethodArgumentNotValidException` sa vyhodí automaticky Springom — predvolene sa toto stane
všeobecným `400 Bad Request` s predvoleným tvarom chybového tela Springu. Prispôsobenie tohto na
druh konkrétnej, pole-po-poli chybovej odpovede pokrytej vo vedení k validačným chybám
[Návrh REST API](/sk/study-materials/http-web/rest-and-api-design/designing-a-good-api) je presne
to, čo pokrýva ďalej
[Spracovanie Výnimiek v Kontroléroch](./exception-handling-in-controllers.md).
