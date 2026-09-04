---
sidebar_position: 2
title: Platform Types a Java Interop
---

# Platform Types a Java Interop

[Null Safety](../01-basics/null-safety.md) pokrýva vlastný typový systém Kotlinu prísne
vynucujúci nullabilitu — ale Java kód nemá vôbec žiadne také vynucovanie zabudované do svojho
typového systému. **Platform types** sú spôsob, akým Kotlin premostí túto medzeru pri volaní do
Javy.

## Problém

```java title="LegacyService.java (žiadne anotácie nullability vôbec)"
public class LegacyService {
    public String getName() {
        return someCondition ? "Jane" : null;    // typový systém Javy nevie vyjadriť túto možnosť
    }
}
```

Kotlin nemá spôsob, ako vedieť, len zo signatúry Java metódy, či `getName()` naozaj môže vrátiť
`null` — typový systém Javy jednoducho nenesie túto informáciu pre neanotovaný kód.

## Platform types — odpoveď Kotlinu

```kotlin
val name = legacyService.getName()    // odvodený typ: String! — "platform type"
```

`String!` (zobrazené v IDE tooling, nezapísateľné priamo v zdrojovom kóde) znamená "Kotlin
nevie, či je toto nullable alebo nie — rozhodni sa, a si na to sám, ak sa mýliš." Platform type
sa dá zaobchádzať **buď** ako `String` alebo `String?` na mieste volania:

```kotlin
val nonNull: String = legacyService.getName()      // Kotlin ti tu verí — NPE, ak je to naozaj null
val nullable: String? = legacyService.getName()      // bezpečnejšie — zaobchádza s tým ako s potenciálne null
```

:::warning
Zaobchádzanie s platform type ako s non-null, keď podkladová Java metóda naozaj vie vrátiť
`null`, znovu vnesie presne to riziko `NullPointerException`, ktorému má null-safety systém
Kotlinu predchádzať — kompilátor ťa tu jednoducho nevie varovať, keďže to naozaj nevie. Pri
volaní neznámych alebo legacy Java API je zaobchádzanie s výsledkom ako s nullable (`String?`)
predvolene bezpečnejšia predvoľba, kým to nepotvrdíš inak.
:::

## Anotovaný Java kód uzatvára túto medzeru

```java title="ModernService.java"
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class ModernService {
    public @NotNull String getRequiredField() { return "value"; }
    public @Nullable String getOptionalField() { return maybeNull; }
}
```

```kotlin
val required = modernService.getRequiredField()    // odvodené ako non-null String, normálne vynucované
val optional = modernService.getOptionalField()      // odvodené ako String?, normálne vynucované
```

S `@NotNull`/`@Nullable` (z JetBrains anotácií, alebo JSR-305 / Jakarta ekvivalentov) Kotlin
dôveruje anotácii a zaobchádza s typom ako naozaj non-null alebo nullable — plne, normálne
vynucovanie null-safety platí, žiadna platform-type nejednoznačnosť vôbec.

## Praktické odporúčania pre interop-ťažký kód

```text
- Preferuj volanie dobre anotovaných Java knižníc, kde je to možné — interop zážitok je
  zmysluplne lepší a bezpečnejší
- Pri zabaľovaní neanotovaného legacy Java API na použitie z Kotlinu, zabaľ ho raz do malej
  Kotlin adaptérovej vrstvy, ktorá spraví explicitné, zámerné rozhodnutie o nullabilite pre
  každú metódu — namiesto nechania `!` platform types roztrúsených naprieč volajúcim kódom všade
- Keď si nie si istý skutočnou nullabilitou neanotovanej metódy, skontroluj jej dokumentáciu
  alebo zdroj namiesto hádania len z platform type
```

Toto je relevantné aj keď Kotlin/Spring Boot appka persistuje dáta cez JPA, kde lazy-loaded
vzťahy majú vlastnú súvisiacu nuansu nullability — pozri
[Null Safety s JPA Entitami](/sk/study-materials/kotlin/kotlin-spring-boot/data-access/kotlin-entities-and-jpa-gotchas)
v téme Kotlin + Spring Boot pre tento konkrétny, bežný prípad.
