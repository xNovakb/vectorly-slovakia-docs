---
sidebar_position: 2
title: Kotlin Entity a JPA Gotchas
---

# Kotlin Entity a JPA Gotchas

JPA/Hibernate predchádza Kotlin o dobre viac než desaťročie, a bol navrhnutý úplne okolo Java
mutable-POJO konvencií. Idiomy Kotlinu (data classes, nemennosť, non-null-by-default) sa zrážajú
so skutočnými predpokladmi Hibernate spôsobmi, ktoré sa oplatí explicitne poznať, nie objaviť v
produkcii.

## `data class` ako JPA entita — zvyčajne chyba

```kotlin
❌ @Entity
   data class Order(
       @Id @GeneratedValue val id: Long = 0,
       var status: String
   )
```

:::danger
Automaticky vygenerované `equals()`/`hashCode()` `data class` sú založené na **všetkých
konštruktorových vlastnostiach** — vrátane `id`. Toto spôsobuje reálne, subtílne bugy s
Hibernate:

- **Pred uložením entity** je `id` `0` (alebo aká je predvolená hodnota). Dve rôzne neuložené
  entity sa môžu porovnať ako rovnaké, ak sa ich ostatné polia zhodou okolností zhodujú, čo
  rozbije napr. členstvo v `Set<Order>` pred perzistenciou.
- **Lazy-loaded proxy** — Hibernate často vráti dynamicky vygenerovanú proxy podtriedu namiesto
  skutočnej entity pre lazy asociácie. Vygenerované `equals()` data class porovnáva aj runtime
  triedu, a trieda proxy sa líši od triedy skutočnej entity — čo spôsobí, že `equals()` vráti
  `false` aj pri porovnávaní "tej istej" logickej entity, rozbíjajúc kontroly členstva v
  kolekciách a test assertions matúcimi, ťažko reprodukovateľnými spôsobmi.
- **Meniteľné `var` vlastnosti v `equals`/`hashCode`** toto ďalej zhoršujú — hash code entity sa
  môže zmeniť po tom, čo už bola vložená do `HashSet`, čo poškodí internú bucket štruktúru tejto
  kolekcie.

Štandardná oprava: **nepoužívaj `data class` pre JPA entity.** Použi obyčajnú triedu, a ak
potrebuješ `equals`/`hashCode` vôbec, založ ich **len na ID**, implementovanom ručne.
:::

```kotlin title="✅ Obyčajná trieda, ID-based equals/hashCode"
@Entity
class Order(
    @Id @GeneratedValue val id: Long = 0,
    var status: String
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Order) return false
        return id != 0L && id == other.id
    }
    override fun hashCode(): Int = javaClass.hashCode()   // stabilné naprieč mutáciou, nie ID-based
}
```

## Požiadavka no-arg konštruktora

Krátko pokryté v [Spring Boot s Kotlinom](../01-basics/spring-boot-with-kotlin.md) — oplatí sa to
tu konkrétne zopakovať: Hibernate inštanciuje entity cez reflexiu, volajúc bezargumentový
konštruktor a potom nastavujúc fieldy priamo, úplne obchádzajúc tvoju vlastnú konštruktorovú
logiku. Gradle plugin `kotlin("plugin.jpa")` automaticky vygeneruje tento no-arg konštruktor pre
`@Entity`-otagované triedy; bez neho očakávaj `InstantiationException` za behu, nie chybu
kompilácie.

## Nullable vs. non-null mapovanie vlastností

```kotlin
@Entity
class Product(
    @Id @GeneratedValue val id: Long = 0,

    @Column(nullable = false)
    var name: String,              // non-null Kotlin typ — mal by zodpovedať nullable = false

    @Column(nullable = true)
    var description: String?         // nullable Kotlin typ — mal by zodpovedať nullable = true
)
```

:::warning
Non-null Kotlin `String` namapovaný voči databázovému stĺpcu, ktorý je v skutočnosti nullable, je
reálny nesúlad: ak tento stĺpec nejako obsahuje `NULL` (riadok vložený niečím mimo tejto appky,
medzera v migrácii, ručné SQL), Hibernate môže vrátiť `null` do Kotlin vlastnosti typovanej ako
non-null — porušenie vlastnej garancie null-safety Kotlinu, ktoré kompilátor nedokáže zachytiť,
keďže sa to deje cez reflexiu za behu, nie cez normálne cesty Kotlin kódu. Udržuj nullabilitu
Kotlinu a anotáciu `@Column(nullable = ...)` naozaj synchronizované, oboma smermi.
:::

## `val` vs. `var` na vlastnostiach entity

```kotlin
@Entity
class Order(
    @Id @GeneratedValue val id: Long = 0,   // val — ID by nemalo byť po vytvorení preradené
    var status: String                        // var — Hibernate to potrebuje vedieť nastaviť
)
```

Hibernate potrebuje **nastaviť** väčšinu vlastností entity (cez no-arg konštruktor + reflexiu,
alebo Kotlin property settery) — čo znamená, že väčšina non-ID vlastností potrebuje byť `var`,
nie `val`, napriek tomu, že `val`-by-default je všeobecný Kotlin idiom inde v tomto stacku (pozri
tému Kotlin Idioms). Samotné `id` je rozumná výnimka, ktorá zostáva `val`, keďže ho nastaví raz
databáza a legitímne sa už potom nemení.

## Všeobecné ponaučenie

JPA entity sú jedno z mála miest v Kotlin Spring Boot codebase, kde idiomatický Kotlin (data
classes, nemenné `val`, non-null-by-default) musí ustúpiť tomu, čo reflexiou-založený objektový
model Hibernate naozaj vyžaduje — oplatí sa to brať ako zámernú, pochopenú výnimku namiesto
snahy vnútiť plný Kotlin idiom každej entity triede.
