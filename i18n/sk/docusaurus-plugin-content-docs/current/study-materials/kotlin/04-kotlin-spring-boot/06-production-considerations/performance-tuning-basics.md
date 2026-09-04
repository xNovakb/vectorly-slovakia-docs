---
sidebar_position: 2
title: Základy Ladenia Výkonu
---

# Základy Ladenia Výkonu

Zopár oblastí, ktoré tvoria väčšinu reálnych výkonnostných problémov Spring Boot — nie
vyčerpávajúci JVM tuning návod, ale konkrétne, bežné problémy, o ktorých sa oplatí vedieť
špecificky.

## Čas štartu JVM

Štart Spring Boot appky zahŕňa skenovanie classpath, vytváranie beanov, a (pre webovú appku)
spustenie embedded servera — toto môže trvať od menej než sekundy až po desiatky sekúnd v
závislosti od veľkosti appky, zmysluplne ovplyvňujúc veci ako cold-start čas kontajnera a
rýchlosť rolling deploy.

```text
Prispievatelia k pomalému štartu:
  - Veľký classpath / veľa závislostí na skenovanie
  - Nadmerný rozsah component scanningu
  - Eager (non-lazy) inicializácia mnohých beanov, z ktorých niektoré nemusia byť pre daný beh potrebné
```

```yaml title="Čiastočné zmiernenie — lazy inicializácia beanov"
spring:
  main:
    lazy-initialization: true
```

Lazy inicializácia odloží vytváranie beanov, kým sa naozaj po prvýkrát nepoužijú, namiesto všetkých
pri štarte appky — môže zmysluplne skrátiť čas štartu, za cenu presunutia časti inicializačnej
ceny (a potenciálnych zlyhaní pri prvom použití) neskôr, kedykoľvek je daný bean naozaj po prvýkrát
potrebný namiesto predvídateľne pri štarte.

## Veľkosť connection poolu (HikariCP)

Spring Boot predvolene používa **HikariCP** ako svoj JDBC connection pool.

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
```

:::warning
Príliš veľký pool nespraví appku rýchlejšou nad určitým bodom — môže ju spraviť **pomalšou**,
spôsobením nadmernej kontencie na strane databázy (každé pripojenie spotrebuje reálne zdroje na
strane databázy) a réžie context-switchingu. Vlastná dokumentácia HikariCP konkrétne odporúča
začať s formulou blízkou `((core_count * 2) + effective_spindle_count)` namiesto hádania veľkého
okrúhleho čísla — viac pripojení nie je automaticky lepšie, naozaj bežná mylná predstava.
:::

## N+1 query problém, konkrétne ako výkonnostný problém

Pokryté z uhla JPA mechaniky v
[Query s JPA a QueryDSL](../04-data-access/querying-with-jpa-and-querydsl.md) — oplatí sa to tu
zopakovať konkrétne ako *výkonnostný* problém: získanie 100 objednávok, potom lazy načítanie
items každej objednávky individuálne, znamená **101 query** namiesto 1 alebo 2. Toto je jeden z
najbežnejších reálnych Spring Data výkonnostných bugov práve preto, že je neviditeľný pri malých
lokálnych testovacích datasetoch (100 extra rýchlych query sotva zaregistruješ) a stane sa
bolestivo zjavným len v produkčnej mierke (100 extra query voči zaťaženej produkčnej databáze,
násobené naprieč súbežnými požiadavkami).

```kotlin
// Diagnostika: zapni SQL logovanie v application.yml a spočítaj skutočné query na požiadavku
spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```

## Lazy vs. eager loading, podkladový kompromis

```kotlin
@Entity
class Order(
    // ...
    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)   // predvolené pre @OneToMany
    val items: List<OrderItem> = listOf()
)
```

```text
LAZY   — nenačítaj asociáciu, kým sa naozaj nepristúpi (vyhne sa načítaniu nepotrebných dát,
          ale riskuje N+1, ak sa pristúpi v cykle bez JOIN FETCH)
EAGER    — vždy načítaj asociáciu okamžite s rodičom (vyhne sa N+1 pre túto konkrétnu asociáciu,
             ale môže over-fetchnúť dáta, ktoré často vôbec nie sú potrebné)
```

Ani jedno nie je univerzálne správne — `LAZY` (rozumná predvoľba pre väčšinu asociácií) plus
explicitný `JOIN FETCH` presne keď je asociácia naozaj potrebná je všeobecne správna kombinácia,
namiesto predvoľby všetkého na `EAGER`, aby sa o tom nemuselo premýšľať.

## Cachovanie, v skratke

```kotlin
@Cacheable("products")
fun findById(id: Long): Product = productRepository.findById(id).orElseThrow()
```

`@Cacheable` Springu môže zmysluplne znížiť zaťaženie databázy pre naozaj read-heavy, zriedka sa
meniace dáta — ale zavádza cache invalidáciu ako nový problém na správne riadenie (zastaraná
cachovaná hodnota servírovaná po zmene podkladových dát) — nie predvoľba, po ktorej siahnuť
všade, konkrétne hodnotná pre dáta s reálnym, identifikovateľným read-heavy/write-light vzorom
prístupu.
