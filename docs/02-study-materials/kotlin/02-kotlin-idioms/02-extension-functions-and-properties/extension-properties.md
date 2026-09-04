---
sidebar_position: 2
title: Extension Properties
---

# Extension Properties

The same idea as [extension functions](./extension-functions.md), applied to properties — adding
a property-like accessor to an existing type, with one important structural limitation.

## Defining one

```kotlin
val String.lastChar: Char
    get() = this[this.length - 1]

val String.wordCount: Int
    get() = this.trim().split(Regex("\\s+")).size
```

```kotlin
println("Hello".lastChar)          // 'o'
println("The quick fox".wordCount)   // 3
```

Called exactly like a real property — `"Hello".lastChar`, no parentheses — even though it's
computed by a getter function under the hood, same as any custom-getter property in Kotlin.

## The core limitation: no backing field

```kotlin
❌ var String.customTag: String = ""    // compile error — extension properties can't have a backing field
```

A real class property can store its own value directly (a backing field). An extension property
**cannot** — there's nowhere for that storage to actually live, since you're not modifying the
original class's memory layout at all, just adding a computed accessor on top of it. Every
extension property has to be **computed** from data the receiver already has (or from some
external store — see below), not stored directly on the extension itself.

```kotlin
✅ val String.lastChar: Char
    get() = this[this.length - 1]      // computed from `this` every time it's accessed

❌ var String.lastChar: Char = ' '        // can't do this — no backing field to hold it
```

## A mutable extension property, done correctly

```kotlin
var StringBuilder.lastChar: Char
    get() = this[this.length - 1]
    set(value) {
        this.setCharAt(this.length - 1, value)
    }
```

This works because the setter modifies the **receiver's own existing state** (`StringBuilder`'s
mutable character buffer) rather than trying to store a new field on the extension itself — the
mutation happens through the receiver's own API, not through storage the extension provides.

## If you genuinely need external storage per-instance

```kotlin
private val tags = WeakHashMap<Any, String>()

var Any.tag: String?
    get() = tags[this]
    set(value) { tags[this] = value }
```

A workaround using an external map, keyed by the receiver instance — genuinely useful in rare
cases (e.g. attaching metadata to objects from a library you don't control), but reach for it
deliberately, not as a routine pattern; it adds real complexity (memory management via
`WeakHashMap` to avoid leaking references) for a fairly narrow need.

## When extension properties earn their keep

```kotlin
val View.isVisible: Boolean
    get() = this.visibility == View.VISIBLE

val Context.screenWidth: Int
    get() = resources.displayMetrics.widthPixels
```

Genuinely useful when a computed, read-only "property-shaped" value reads more naturally than a
function call — `view.isVisible` over `view.isVisible()` — for something conceptually a property
of the receiver, just not literally stored as one.
