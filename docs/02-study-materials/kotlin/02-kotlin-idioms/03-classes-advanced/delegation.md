---
sidebar_position: 3
title: Delegation
---

# Delegation

Kotlin has first-class language support for the delegation pattern via the `by` keyword — both for
**class delegation** (an object implementing an interface by forwarding to another object) and
**property delegation** (a property's get/set logic supplied by a separate delegate object).

## Class delegation — composition without the boilerplate

```kotlin
interface SoundMaker {
    fun makeSound(): String
}

class Dog : SoundMaker {
    override fun makeSound() = "Woof!"
}

class LoudDog(private val dog: SoundMaker) : SoundMaker by dog {
    // makeSound() is automatically forwarded to `dog` — no manual override needed
}
```

```kotlin
val loud = LoudDog(Dog())
println(loud.makeSound())    // "Woof!" — forwarded automatically
```

Without `by dog`, `LoudDog` would need to manually write `override fun makeSound() = dog.makeSound()`
for every single method on the interface — tedious and error-prone as the interface grows. `by`
generates that forwarding boilerplate automatically, while still letting you selectively override
individual methods when needed:

```kotlin
class LoudDog(private val dog: SoundMaker) : SoundMaker by dog {
    override fun makeSound() = dog.makeSound().uppercase() + "!!!"   // override just this one
}
```

This is composition-over-inheritance, made ergonomic — `LoudDog` isn't a `Dog` subclass at all, it
*has* a `SoundMaker` and forwards to it, but reads almost as concisely as if it had inherited the
behavior.

## Property delegation — `by lazy`

```kotlin
val expensiveValue: String by lazy {
    println("Computing...")
    computeExpensiveValue()
}
```

The computation inside `lazy { }` only runs on the **first** access to `expensiveValue`, and the
result is cached for every access after that — genuinely useful for anything expensive that might
never actually be needed, or is needed at most once.

```kotlin
val config: Config by lazy { loadConfigFromDisk() }
// loadConfigFromDisk() doesn't run until `config` is first accessed, if ever
```

## Property delegation — `Delegates.observable`

```kotlin
import kotlin.properties.Delegates

var name: String by Delegates.observable("initial") { property, old, new ->
    println("${property.name} changed from $old to $new")
}

name = "Jane"    // prints: "name changed from initial to Jane"
```

Runs a callback on every change to the property — useful for reacting to state changes (UI
updates, cache invalidation, validation) without hand-writing a custom setter that manually calls
out to that logic every time.

## Writing a custom delegate

```kotlin
class LoggingDelegate<T>(private var value: T) {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): T {
        println("Reading ${property.name}: $value")
        return value
    }
    operator fun setValue(thisRef: Any?, property: KProperty<*>, newValue: T) {
        println("Setting ${property.name} to $newValue")
        value = newValue
    }
}

var tracked: Int by LoggingDelegate(0)
```

Any class implementing `getValue`/`setValue` (following this exact operator-function shape) can
serve as a property delegate — `by lazy` and `by Delegates.observable` are simply the standard
library's own implementations of this same convention, not special compiler magic unavailable to
your own code.

## Why `by` matters as a general idiom

Both forms of delegation solve the same underlying problem: reusing behavior from another
object without inheritance, and without writing manual forwarding/boilerplate code by hand.
Combined with [sealed classes](./sealed-classes-and-when.md) for restricted hierarchies and
[value classes](./inline-value-classes.md) for type-safe wrappers, delegation rounds out Kotlin's
answer to "favor composition over inheritance" as a genuinely convenient, low-boilerplate default
rather than an aspirational principle fought against by the language's own ergonomics.
