---
sidebar_position: 3
title: Query s JPA a QueryDSL
---

# Query s JPA a QueryDSL

[Základy Spring Data JPA](./spring-data-jpa-basics.md) pokrýva derived query metódy (`findBy...`)
— fajn pre jednoduché podmienky, ale rýchlo sa zneprehľadnia, akonáhle query potrebuje reálnu
logiku.

## `@Query` s JPQL

```kotlin
interface OrderRepository : JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.total > :minTotal")
    fun findLargeOrders(status: String, minTotal: BigDecimal): List<Order>

    @Query("""
        SELECT o FROM Order o
        JOIN FETCH o.items
        WHERE o.customerId = :customerId
    """)
    fun findWithItems(customerId: Long): List<Order>
}
```

**JPQL** (Java/Jakarta Persistence Query Language) vyzerá ako SQL, ale dopytuje **entity a ich
vlastnosti**, nie surové tabuľky a stĺpce — `Order` a `o.status` odkazujú na Kotlin triedu a jej
vlastnosť, nie nutne identické mená databázových tabuliek/stĺpcov. Trojito-úvodzovkované stringy
Kotlinu (`"""..."""`) sú tu naozaj užitočné pre viacriadkovú query, vyhýbajúc sa nešikovnej
konkatenácii stringov.

## `JOIN FETCH` — riešenie N+1 query problému

```kotlin
// Bez JOIN FETCH: jedna query na objednávky, potom JEDNA ĎALŠIA query na objednávku na lazy-load jej items
fun findAll(): List<Order>

// S JOIN FETCH: jedna jediná query, items načítané eagerly ako jej súčasť
@Query("SELECT o FROM Order o JOIN FETCH o.items")
fun findAllWithItems(): List<Order>
```

Získanie zoznamu entít, potom prístup k lazy-loaded asociácii (ako `order.items`) na každej
jednotlivo, spustí **samostatnú query na entitu** — klasický **N+1 query problém**: 1 query na
zoznam, plus N ďalších query na asociáciu každej entity. `JOIN FETCH` toto zlúči do jednej query.
Toto sa znova objaví ako skutočný produkčný výkonnostný problém v
[Základoch Ladenia Výkonu](../06-production-considerations/performance-tuning-basics.md) — je to
jeden z najbežnejších reálnych Spring Data výkonnostných bugov práve preto, že je neviditeľný pri
malých lokálnych testovacích datasetoch (100 extra rýchlych query sotva zaregistruješ) a stane sa
bolestivo zjavným len v produkčnej mierke (100 extra query voči zaťaženej produkčnej databáze,
násobené naprieč súbežnými požiadavkami).

## Natívne SQL, keď JPQL nestačí

```kotlin
@Query(
    value = "SELECT * FROM orders WHERE EXTRACT(YEAR FROM created_at) = :year",
    nativeQuery = true
)
fun findByYear(year: Int): List<Order>
```

Zíde k skutočnému, databázovo-špecifickému SQL — potrebné pre čokoľvek, čo JPQL nevie vyjadriť
(databázovo-špecifické funkcie, komplexné window funkcie), za cenu straty prenositeľnosti
databázy a abstrakcie na úrovni entít.

## Derived metódy vs. `@Query` — kedy prepnúť

```text
Derived meno metódy:     Dobré pre jednoduché, malý počet podmienok
                            findByStatusAndCustomerId(status: String, customerId: Long)

@Query (JPQL):              Lepšie, akonáhle podmienky zosilnejú, treba joiny, alebo by sa meno
                              derived metódy stalo neprimerane dlhým/nečitateľným

Natívne SQL:                    Len keď JPQL naozaj nevie vyjadriť, čo je potrebné
```

Derived meno metódy s piatimi alebo šiestimi zreťazenými `And`/`Or` podmienkami je zvyčajne
signál na prepnutie na explicitné `@Query` — nie preto, že by derived forma prestala fungovať, ale
preto, že prestane byť čitateľná.

## QueryDSL a Exposed — oplatí sa o nich vedieť, tu nie sú do hĺbky pokryté

**QueryDSL** generuje typovo bezpečné query DSL z tvojich entity tried pri kompilácii, chytajúc
preklepy/typové nesúlady v query, ktoré kompilátor vie overiť namiesto zlyhania len pri
runtime string-based JPQL parsovaní.

**Exposed** je vlastný Kotlin-natívny SQL framework JetBrains — naozaj odlišný prístup od
JPA/Hibernate úplne (žiadne entity proxy, žiadna reflexiou-založená inštanciácia, Kotlin DSL pre
SQL postavený od základov pre jazyk) namiesto Java frameworku dodatočne vybaveného Kotlin
podporou. Oplatí sa vedieť, že existuje ako alternatíva k celému JPA prístupu pokrytému v tejto
sekcii, najmä pre projekt, ktorý chce úplne obísť
[trecie body Kotlin/JPA](./kotlin-entities-and-jpa-gotchas.md) namiesto ich obchádzania —
hlbšie porovnanie je mimo rozsah tejto témy momentálne.
