---
sidebar_position: 1
title: Spring Boot s Kotlinom
---

# Spring Boot s Kotlinom

Spring Boot bol postavený pre Javu, ale má prvotriednu podporu Kotlinu — a vlastné jazykové
funkcie Kotlinu riešia reálne problémy, ktoré Java Spring kód vždy musel obchádzať konvenciou.

## Prečo táto kombinácia funguje dobre

- **Stručnosť** — data class nahradí konštruktor, gettery, `equals`, `hashCode` a `toString`
  boilerplate Java POJO úplne.
- **Null safety** — typový systém Kotlinu rozlišuje `String` od `String?` v čase kompilácie.
  Vlastné null-handling anotácie Springu (`@Nullable`) sú v Jave nanajvýš odporúčacie; v Kotline
  neplatný (null) parameter pre non-null typ zlyhá už pri kompilácii, nie len za behu.
- **Predvolené argumenty** — nahradí "telescoping constructors" alebo builder-pattern boilerplate,
  po ktorom Java kód často siaha na spracovanie voliteľných parametrov.

```kotlin
data class CreateUserRequest(
    val email: String,
    val name: String,
    val role: String = "user"    // predvolený argument — netreba overload
)
```

## Dva Gradle pluginy, ktoré toto naozaj umožňujú

Kotlin triedy sú **predvolene `final`** — na rozdiel od Javy, kde je trieda otvorená na
dedenie, pokiaľ nie je označená `final`. Spring sa silno spolieha na dedenie/proxovanie pre dva
základné mechanizmy:

- **CGLIB proxy** — Spring obalí mnoho beanov (čokoľvek s `@Transactional`, AOP, atď.) do
  dynamicky vygenerovanej podtriedy za behu. `final` trieda sa nedá podtriediť, takže sa to
  potichu alebo hlasno pokazí podľa prípadu.
- **JPA entity proxy** — Hibernate potrebuje generovať lazy-loading proxy podtriedy entity tried.
  Rovnaký problém.

```kotlin title="build.gradle.kts"
plugins {
    kotlin("plugin.spring") version "1.9.25"    // "all-open" plugin, prekonfigurovaný pre Spring
    kotlin("plugin.jpa") version "1.9.25"         // "no-arg" plugin, prekonfigurovaný pre JPA
}
```

- **`kotlin("plugin.spring")`** — automaticky otvorí (odstráni implicitné `final`) akúkoľvek
  triedu otagovanú `@Component`, `@Service`, `@Configuration`, a podobnými Spring stereotypmi —
  takže nemusíš ručne označovať `open` každú Spring-spravovanú triedu.
- **`kotlin("plugin.jpa")`** — automaticky vygeneruje no-arg sekundárny konštruktor pre triedy
  otagované `@Entity` — Kotlin predvolene negeneruje no-arg konštruktor tak, ako to implicitne
  vie obyčajná Java trieda, a Hibernate ho potrebuje na inštanciovanie entít cez reflexiu.

:::note
Bez týchto pluginov môže Kotlin Spring Boot appka *väčšinou* pôsobiť fungujúco v jednoduchých
prípadoch, potom matúco zlyhá v momente, keď niečo potrebuje proxy — `@Transactional` metóda
potichu neparticipujúca v transakcii, alebo kryptická Hibernate inštanciačná chyba. Oba pluginy sú
blízko nevyhnutné pre akýkoľvek reálny Kotlin+Spring projekt, nie voliteľné pohodlie.
:::

## Čo táto téma predpokladá

Fungujúcu znalosť samotného jazyka Kotlin (pozri témy Kotlin Fundamentals a Kotlin Idioms) a
všeobecné HTTP koncepty (pozri tému [HTTP a Web Základy](/sk/study-materials/http-web/basics/what-is-http) pre REST
sémantiku, status kódy a hlavičky) — táto téma sa zameriava konkrétne na to, ako spolu interagujú
Spring Boot a Kotlin, nie na ktorýkoľvek z nich od základov.
