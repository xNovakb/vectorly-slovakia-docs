---
sidebar_position: 3
title: Beany a Scopes
---

# Beany a Scopes

**Bean** je akýkoľvek objekt spravovaný `ApplicationContext` Springu (pozri
[Základy DI v Spring](./di-basics-in-spring.md)) — vytvorený, spojený so svojimi závislosťami, a
sledovaný kontajnerom namiesto priamo aplikačným kódom.

## Stereotypové anotácie

```kotlin
@Component     // generické — "toto je Spring-spravovaný bean," žiadna konkrétnejšia rola naznačená
@Service         // trieda business logiky — sémanticky @Component, označuje zámer
@Repository        // trieda prístupu k dátam — tiež zapne Spring exception translation pre tento bean
@RestController       // trieda web vrstvy — kombinuje @Controller + @ResponseBody
```

Všetky štyri sú v skutočnosti **rovnaký mechanizmus** pod tým (`@Service`, `@Repository`, a
`@RestController` sú samy otagované `@Component`) — rozdiel je takmer úplne o **komunikovaní
zámeru** tomu, kto číta kód, nie odlišné technické správanie, s jednou reálnou výnimkou:
`@Repository` navyše zapne automatický preklad databázovo-špecifických výnimiek do vlastnej
konzistentnej hierarchie `DataAccessException` Springu.

## `@Bean` metódy — pre veci, ktoré nevlastníš

Stereotypové anotácie fungujú len na triedach, ktoré vieš priamo otagovať. Pre triedu z knižnice
tretej strany, alebo čokoľvek potrebujúce vlastnú konštrukčnú logiku, je alternatívou `@Bean`
metóda vnútri `@Configuration` triedy:

```kotlin title="config/AppConfig.kt"
@Configuration
class AppConfig {
    @Bean
    fun objectMapper(): ObjectMapper =
        ObjectMapper().registerKotlinModule()

    @Bean
    fun restTemplate(builder: RestTemplateBuilder): RestTemplate =
        builder
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(5))
            .build()
}
```

Návratová hodnota každej `@Bean`-otagovanej metódy sa stane spravovaným beanom, injektovateľným
kdekoľvek inde rovnako, ako by bola `@Component`-otagovaná trieda. Tu tiež bežne býva výber beanu
špecifického pre profil (pozri [Konfigurácia a Profily](../01-basics/configuration-and-profiles.md)),
keď voľba závisí od viac než jednoduchého `@Profile` na celej triede.

## Bean scopes

```kotlin
@Service
class OrderService   // predvolený scope: singleton — jedna zdieľaná inštancia pre celú appku
```

```kotlin
@Service
@Scope("prototype")
class ReportBuilder   // NOVÁ inštancia zakaždým, keď je injektovaná/požadovaná
```

```text
singleton   — jedna zdieľaná inštancia, vytvorená raz, znovupoužitá všade (predvolené, a zďaleka
               najbežnejšie — vhodné pre bezstavové služby)
prototype     — nová inštancia zakaždým, keď je požadovaná — vhodné pre niečo naozaj stavové,
                 čo by sa nemalo zdieľať naprieč súbežnými použitiami
request         — jedna inštancia na HTTP požiadavku (len webové appky)
session           — jedna inštancia na HTTP session (len webové appky)
```

## Prečo je singleton rozumná predvoľba

Väčšina Spring beanov (services, repositories, controllers) nedrží **žiadny meniteľný stav na
požiadavku** — sú v podstate len balíky správania operujúceho na dátach odovzdaných do ich metód.
Jedna zdieľaná inštancia je aj správna aj oveľa lacnejšia než konštruovanie novej pri každom
použití. Siahni po `prototype` (alebo scope užšom než singleton) len keď bean naozaj potrebuje
držať stav, ktorý sa nesmie zdieľať medzi súbežnými volajúcimi — zriedkavá potreba pre typickú
Spring service vrstvu, a často znak, že daný stav v skutočnosti patrí do parametra metódy alebo
databázy, nie do samotného beanu.

:::warning
Injektovanie `prototype`-scoped beanu do `singleton`-scoped beanu (predvolené) vyrieši prototype
závislosť len **raz**, pri konštrukcii samotného singletonu — správanie "nová inštancia
zakaždým" sa automaticky neuplatní len preto, že je závislosť prototype-scoped. Získanie naozaj
čerstvej prototype inštancie na použitie zvnútra singletonu vyžaduje extra vzor
(`ObjectProvider<T>`, alebo scoped proxy) — reálny, bežne narazený gotcha, nie len teoretický.
:::
