---
sidebar_position: 2
title: "apply, also"
---

# apply, also

Where [let, run, with](./let-run-with.md) return a **computed value**, `apply` and `also` return
the **original object itself** — built specifically for configuring an object or performing a
side effect, then continuing to use that same object.

## `apply` — the object as `this`, returns the object

```kotlin
val person = Person().apply {
    name = "Jane"
    age = 30
    email = "jane@example.com"
}
```

Because the receiver is `this` (implicit), `apply` reads like a configuration block — set several
properties on a freshly created object, then get that same object back, ready to use. This is the
idiomatic Kotlin replacement for a Java-style builder pattern in many cases, when the properties
being set are regular mutable `var`s.

```kotlin
val intent = Intent(context, DetailActivity::class.java).apply {
    putExtra("id", itemId)
    putExtra("source", "notification")
}
startActivity(intent)
```

## `also` — the object as `it`, returns the object

```kotlin
val numbers = mutableListOf(1, 2, 3)
    .also { println("Initial list: $it") }
    .also { it.add(4) }
```

`also` is like `apply`, but the receiver is `it` instead of implicit `this` — useful when you want
to be explicit about referring to the object (or when the block's main purpose is a **side
effect**, like logging, rather than configuring the object's own properties).

```kotlin
val result = computeExpensiveValue()
    .also { logger.debug("Computed value: $it") }
```

## Why `also` over `apply` when just logging

```kotlin
// ❌ works, but `this` inside is a bit misleading for a pure side effect
someObject.apply {
    println("Value: $this")
}

// ✅ `it` makes clear this is inspecting the object, not configuring it
someObject.also {
    println("Value: $it")
}
```

This is a style convention, not a hard technical rule — but it's a genuinely useful one:
`apply`'s implicit `this` reads naturally when you're **setting properties on the receiver**;
`also`'s explicit `it` reads naturally when you're **doing something with** the receiver without
modifying it.

## `apply` vs. `also`, side by side

| | Receiver access | Returns | Typical use |
|---|---|---|---|
| `apply` | `this` (implicit) | The object | Configuring a freshly created object's properties |
| `also` | `it` | The object | A side effect (logging, validation) in the middle of a chain |

## Both return the object — chaining stays intact

```kotlin
val list = mutableListOf<Int>()
    .apply { add(1); add(2) }
    .also { println("After adding: $it") }
    .apply { add(3) }
```

Because both return the original object, they chain freely with each other and with regular
method calls — this is exactly what makes scope functions compose well in real code rather than
needing separate temporary variables at every step.

See [Choosing the Right Scope Function](./choosing-the-right-scope-function.md) for a single table
across all five scope functions covered on this and the previous page.
