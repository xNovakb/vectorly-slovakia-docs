---
sidebar_position: 2
title: Type-Safe Buildery
---

# Type-Safe Buildery

[Základy DSL](./dsl-basics.md) postavili vnorený DSL pomocou receiver lambd — táto stránka
pokrýva problém, ktorý sa objaví konkrétne **akonáhle sa bloky začnú vnárať**, a anotáciu, ktorá
ho opravuje.

## Problém: implicitné receivery z vonkajších scope unikajú dovnútra

```kotlin
class Table {
    fun row(block: Row.() -> Unit) { /* ... */ }
}
class Row {
    fun cell(text: String) { /* ... */ }
}

fun table(block: Table.() -> Unit) = Table().apply(block)
```

```kotlin
table {
    row {
        cell("A1")
        row { }    // ⚠️ skompiluje sa! zavolá row() VONKAJŠEJ Table zvnútra Row bloku — takmer isto bug
    }
}
```

Bez akejkoľvek ochrany vidí resolvovanie implicitného receivera Kotlinu **oba** aktuálny `Row`
receiver *aj* vonkajší `Table` receiver súčasne — takže `row { }` vnorené vnútri iného `row { }`
sa v poriadku skompiluje, potichu zavolajúc nesprávnu (vonkajšiu) funkciu receivera, lebo nič
nebráni vnútornému scope dosiahnuť vonkajší.

## Oprava: `@DslMarker`

```kotlin
@DslMarker
annotation class HtmlDsl

@HtmlDsl
class Table {
    fun row(block: Row.() -> Unit) { /* ... */ }
}

@HtmlDsl
class Row {
    fun cell(text: String) { /* ... */ }
}
```

```kotlin
table {
    row {
        cell("A1")
        row { }    // ❌ teraz CHYBA KOMPILÁCIE — row() vonkajšej Table už nie je implicitne dosiahnuteľná tu
    }
}
```

`@DslMarker` je meta-anotácia — definuješ vlastnú anotáciu (tu `HtmlDsl`) označenú ňou, potom
aplikuješ *tú* anotáciu na každú triedu v DSL hierarchii. Po aplikovaní Kotlin obmedzí
resolvovanie implicitného receivera: **len najbližší obklopujúci receiver** označený rovnakou
skupinou `@DslMarker` je implicitne dosiahnuteľný — vonkajšie z tej istej skupiny sa zatienia
namiesto potichu dostupných.

## Explicitné dosiahnutie vonkajšieho receivera, keď to naozaj treba

```kotlin
table {
    row {
        cell("A1")
        this@table.row { }    // explicitný label — stále možné, len už nie náhodou
    }
}
```

`@DslMarker` nespraví vonkajší receiver *nedosiahnuteľným* — len vyžaduje byť pri tom explicitný
(`this@table`), premieňajúc čo bola predtým ľahká, tichá chyba na zámernú, jasne označenú voľbu.

## Prečo to reálne Kotlin DSL všetky používajú

```kotlin
@DslMarker
annotation class HtmlTagMarker
```

Každá seriózna Kotlin DSL knižnica (`kotlinx.html`, scope-obmedzené composables Jetpack Compose,
Gradle Kotlin DSL) používa `@DslMarker` presne z tohto dôvodu — bez neho sa hlboko vnorené DSL
bloky stanú reálnym footgunom, kde vnútorný blok môže náhodou zavolať rovnako pomenovanú funkciu
vonkajšieho scope, produkujúc kód, ktorý sa čisto skompiluje, ale robí niečo štrukturálne zle.

## Minimálny checklist na vybudovanie type-safe DSL

```text
1. Navrhni triedy reprezentujúce každú "úroveň" DSL (Table, Row, Cell, ...)
2. Daj builder funkcii každej úrovne receiver lambdu: SomeLevel.() -> Unit
3. Definuj jednu anotáciu @DslMarker, aplikuj ju na každú triedu v hierarchii
4. Over, že chyby vnárania teraz naozaj neprejdú kompiláciou, nielen "vyzerajú zle"
```

Akonáhle sú tieto štyri kúsky na mieste, DSL je aj príjemné písať (vďaka
[trailing lambdám + receiverom](./dsl-basics.md)), aj štrukturálne bezpečné (vďaka `@DslMarker`)
— kombinácia je to, čo oddeľuje "šikovný lambda trik" od naozaj produkčne kvalitného DSL.
