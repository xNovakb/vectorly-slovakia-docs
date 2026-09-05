---
sidebar_position: 2
title: "Constructor Injection, Kotlinovým Spôsobom"
---

# Constructor Injection, Kotlinovým Spôsobom

Syntax primárneho konštruktora Kotlinu robí constructor injection takmer zadarmo na napísanie —
skutočné zlepšenie oproti ekvivalentnému Java Spring kódu, nie len štylistická preferencia.

## Vzor

```kotlin
@Service
class OrderService(
    private val orderRepository: OrderRepository,
    private val paymentClient: PaymentClient
) {
    fun placeOrder(request: CreateOrderRequest): Order {
        val order = orderRepository.save(Order.from(request))
        paymentClient.charge(order.total)
        return order
    }
}
```

Netreba vôbec anotáciu `@Autowired`. Od Spring 4.3 sa trieda s presne **jedným** konštruktorom
automaticky použije na injektovanie — bez potreby anotácie — a Kotlin `val` konštruktorové
parametre slúžia zároveň ako konštruktorový argument *aj* deklarácia poľa triedy v jednom riadku,
niečo, čo Java potrebuje vyjadriť samostatným telom konštruktora a deklaráciami polí.

```java title="Ekvivalent, zhruba, v Jave"
@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final PaymentClient paymentClient;

    public OrderService(OrderRepository orderRepository, PaymentClient paymentClient) {
        this.orderRepository = orderRepository;
        this.paymentClient = paymentClient;
    }
    // ...
}
```

## Prečo konkrétne constructor injection, nad field/setter injection

- **Nemennosť** — `private val` znamená, že závislosť sa nikdy nedá po konštrukcii preradiť.
  Field injection s `lateinit var` umožňuje (a vyžaduje) mutabilitu, ktorá tu neslúži žiadnemu
  reálnemu účelu.
- **Nemožné skonštruovať v neplatnom stave** — trieda vyžadujúca konštruktorové argumenty
  doslova nemôže byť inštanciovaná bez svojich závislostí. Field-injectované `lateinit var`
  vlastnosti môžu existovať v ešte-neinjectovanom stave (napr. ak sú skonštruované ručne mimo
  Spring, ako v niektorých test setupoch), čo vedie k výnimke
  `lateinit property has not been initialized` pri prvom použití namiesto pri konštrukcii.
- **Triviálne testovateľné bez Spring kontextu vôbec** — keďže závislosti sú len konštruktorové
  argumenty, testovanie `OrderService` nepotrebuje nič viac než
  `OrderService(fakeRepo, fakePaymentClient)` — žiadny Spring kontajner, žiadne anotácie
  mockovacieho frameworku potrebné len na skonštruovanie testovaného objektu.
- **Kruhové závislosti zlyhajú hlasno, pri štarte** — dva beany vyžadujúce sa navzájom cez
  constructor injection spôsobia, že Spring okamžite zlyhá pri štarte s jasnou chybou. Rovnaká
  kruhová závislosť cez field injection sa niekedy môže potichu vyriešiť (Spring sa v niektorých
  prípadoch uchýli k proxy-based lazy resolution) — čo zvyčajne znamená, že sa maskuje dizajnový
  problém namiesto jeho odhalenia.

:::note
Tento posledný bod je skutočný, nie kozmetický dôvod preferovať constructor injection: kruhová
závislosť je takmer vždy znak, že by sa dve triedy mali refaktorovať (vyextrahovať tretiu triedu,
od ktorej obe závisia, alebo ich zlúčiť) — fail-fast správanie constructor injection odhalí tento
dizajnový problém okamžite namiesto toho, aby nepovšimnuto pretrvával.
:::

## Viacero konštruktorov a `@Autowired`

```kotlin
@Service
class NotificationService(
    private val emailClient: EmailClient
) {
    @Autowired
    constructor(emailClient: EmailClient, smsClient: SmsClient) : this(emailClient) {
        // ...
    }
}
```

Ak trieda naozaj potrebuje viac než jeden konštruktor, `@Autowired` sa opäť stane potrebné — aby
povedal Springu, ktorý použiť na injektovanie. V praxi zriedkavé; zvyčajne znak, že sa trieda
snaží robiť dve rôzne veci a mohla by sa rozdeliť.

## Voliteľné závislosti

```kotlin
@Service
class ReportService(
    private val cache: ReportCache? = null    // nullable + predvolené null = naozaj voliteľné
)
```

Nullable konštruktorový parameter s predvoleným `null` je spôsob, ako vyjadriť *voliteľnú*
závislosť — Spring injektuje zodpovedajúci bean, ak existuje, a jednoducho odovzdá `null`, ak nie,
namiesto zlyhania pri štarte. Nullabilita je odtiaľ vynucovaná vlastným typovým systémom Kotlinu —
každé použitie `cache` vnútri triedy musí explicitne ošetriť `null` prípad, inak chyba kompilácie.
