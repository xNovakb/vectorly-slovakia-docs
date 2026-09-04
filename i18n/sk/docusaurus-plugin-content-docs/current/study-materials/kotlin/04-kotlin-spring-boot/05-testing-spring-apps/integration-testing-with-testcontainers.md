---
sidebar_position: 2
title: Integračné Testovanie s Testcontainers
---

# Integračné Testovanie s Testcontainers

[Unit Testovanie s MockK](./unit-testing-with-mockk.md) úplne mockne databázu preč — rýchle, ale
nič nedokazuje o tom, či reálne JPA mapovania, query, a obmedzenia naozaj fungujú voči reálnej
databáze. **Testcontainers** spustí reálnu databázu v reálnom
[Docker kontajneri](/sk/study-materials/docker/basics/what-is-a-container) na trvanie testu,
potom ju zahodí.

## Základný setup

```kotlin
@SpringBootTest
@Testcontainers
class OrderRepositoryIntegrationTest {

    companion object {
        @Container
        @JvmStatic
        val postgres = PostgreSQLContainer("postgres:16")

        @DynamicPropertySource
        @JvmStatic
        fun configureProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
        }
    }

    @Autowired
    lateinit var orderRepository: OrderRepository

    @Test
    fun `save and retrieve an order`() {
        val saved = orderRepository.save(Order(status = "pending", total = BigDecimal("50.00")))
        val found = orderRepository.findById(saved.id)
        assertTrue(found.isPresent)
        assertEquals("pending", found.get().status)
    }
}
```

`@Container` spustí reálny PostgreSQL kontajner pred behom test triedy (cez bežnú
[Docker](/sk/study-materials/docker/running-containers/container-lifecycle) mechaniku životného
cyklu kontajnera, riadenú programaticky namiesto priamo `docker run`), a
`@DynamicPropertySource` naviaže konfiguráciu datasource Springu na skutočný, dynamicky
priradený host/port tohto kontajnera — žiadna ručne spravovaná testovacia databáza, žiadny pevný
port kolidujúci s čímkoľvek iným bežiacim lokálne.

## Prečo nepoužiť len in-memory databázu (H2) namiesto toho

```kotlin
❌ // application-test.yml ukazujúci na H2 namiesto Postgres
spring:
  datasource:
    url: jdbc:h2:mem:testdb
```

H2 sa rýchlejšie spúšťa a nepotrebuje vôbec Docker — ale je to **iný databázový engine** než
produkcia (za predpokladu, že produkcia beží PostgreSQL, MySQL, alebo podobné). Rozdiely v SQL
dialekte, správaní obmedzení, a konkrétnych funkciách sa môžu všetky subtílne líšiť medzi H2 a
skutočnou produkčnou databázou — test, ktorý prejde voči H2, negarantuje rovnaké správanie voči
databáze skutočne používanej v produkcii. Testcontainers beží **presne ten istý** databázový
engine a verziu ako produkcia, za cenu pomalšieho testu (potreba naozaj spustiť kontajner) a
Docker závislosti pre čokoľvek spúšťajúce test suite (vrátane CI runnerov).

## Kompromis, explicitne

```text
MockK unit testy:            Najrýchlejšie, netreba infraštruktúru, testujú LEN vlastnú logiku service
Testcontainers integrácia:     Pomalšie (štart kontajnera), potrebuje dostupný Docker, testuje
                                 REÁLNE správanie databázy, zachytí problémy, ktoré mocky štrukturálne nemôžu
```

Zdravý test suite typicky má **veľa** rýchlych unit testov a **menej** pomalších integračných
testov — nie preto, že by boli integračné testy menej hodnotné, ale preto, že ich cena (čas,
Docker závislosť) robí spustenie stoviek z nich pri každej jednej zmene nepraktickým spôsobom, akým
je to pre čisté unit testy.

## Znovupoužitie kontajnera naprieč viacerými test triedami

```kotlin
companion object {
    @Container
    @JvmStatic
    val postgres = PostgreSQLContainer("postgres:16").apply {
        withReuse(true)    // vyžaduje testcontainers.reuse.enable=true v ~/.testcontainers.properties
    }
}
```

Predvolene sa spustí (a zastaví) čerstvý kontajner na test triedu — správne a izolované, ale
pridáva reálnu réžiu spustenia, ak veľa test tried potrebuje vlastnú databázu. `withReuse(true)`
udrží jeden kontajner nažive naprieč viacerými behmi testov počas lokálneho vývoja, za cenu toho,
že testy už nie sú predvolene plne izolované od dát navzájom — zámerný kompromis pre rýchlosť
lokálneho vývoja, všeobecne nezapnuté v CI, kde na plnej izolácii záleží viac než na rýchlosti
iterácie.

## Kde toto zapadá s CI

Testy založené na Testcontainers potrebujú dostupný Docker daemon kdekoľvek bežia — pozri stránku
[self-hosted vs. managed runners](/sk/study-materials/ci-cd/tools-and-platforms/self-hosted-vs-managed-runners)
témy CI/CD pre to, čo táto požiadavka znamená pri výbere CI infraštruktúry; väčšina managed CI
runnerov (vrátane GitHub-hosted) poskytuje Docker predvolene, ale oplatí sa to overiť, nie
predpokladať pri menej bežných CI nastaveniach.
