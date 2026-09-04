---
sidebar_position: 2
title: Type-Safe Builders
---

# Type-Safe Builders

[DSL Basics](./dsl-basics.md) built a nested DSL using receiver lambdas — this page covers the
problem that shows up specifically **once blocks start nesting**, and the annotation that fixes
it.

## The problem: implicit receivers from outer scopes leak inward

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
        row { }    // ⚠️ compiles! calls the OUTER Table's row() from inside a Row block — almost certainly a bug
    }
}
```

Without any guard, Kotlin's implicit-receiver resolution can see **both** the current `Row`
receiver *and* the outer `Table` receiver at the same time — so `row { }` nested inside another
`row { }` compiles fine, silently calling the wrong (outer) receiver's function, because nothing
stops an inner scope from reaching an outer one.

## The fix: `@DslMarker`

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
        row { }    // ❌ now a COMPILE ERROR — outer Table's row() is no longer implicitly reachable here
    }
}
```

`@DslMarker` is a meta-annotation — you define your own annotation (here, `HtmlDsl`) marked with
it, then apply *that* annotation to every class in the DSL hierarchy. Once applied, Kotlin
restricts implicit receiver resolution: **only the nearest enclosing receiver** marked with the
same `@DslMarker` group is implicitly reachable — outer ones in the same group get shadowed rather
than silently accessible.

## Explicitly reaching an outer receiver, when genuinely needed

```kotlin
table {
    row {
        cell("A1")
        this@table.row { }    // explicit label — still possible, just not by accident anymore
    }
}
```

`@DslMarker` doesn't make the outer receiver *unreachable* — it just requires being explicit about
it (`this@table`), turning what used to be an easy, silent mistake into a deliberate,
clearly-labeled choice.

## Why real-world Kotlin DSLs all use this

```kotlin
@DslMarker
annotation class HtmlTagMarker
```

Every serious Kotlin DSL library (`kotlinx.html`, Jetpack Compose's scope-restricted composables,
Gradle's Kotlin DSL) uses `@DslMarker` for exactly this reason — without it, deeply nested DSL
blocks become a real footgun where an inner block can accidentally invoke an outer scope's
same-named function, producing code that compiles cleanly but does something structurally wrong.

## A minimal checklist for building a type-safe DSL

```text
1. Design the classes representing each "level" of the DSL (Table, Row, Cell, ...)
2. Give each level's builder function a receiver lambda: SomeLevel.() -> Unit
3. Define one @DslMarker annotation, apply it to every class in the hierarchy
4. Verify nesting mistakes now genuinely fail to compile, not just "look wrong"
```

Once these four pieces are in place, the DSL is both pleasant to write (thanks to
[trailing lambdas + receivers](./dsl-basics.md)) and structurally safe (thanks to `@DslMarker`) —
the combination is what separates a "clever lambda trick" from a genuinely production-quality DSL.
