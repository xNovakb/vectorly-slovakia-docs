---
sidebar_position: 1
title: Extension Functions
---

# Extension Functions

An extension function lets you add a function to an existing type — including types you don't
own, like classes from the standard library or a third-party dependency — without inheriting from
it or modifying its source.

## Defining one

```kotlin
fun String.isPalindrome(): Boolean {
    val cleaned = this.lowercase().filter { it.isLetter() }
    return cleaned == cleaned.reversed()
}

"racecar".isPalindrome()   // true
"Hello".isPalindrome()      // false
```

Inside the function, `this` refers to the **receiver** — the instance the extension is called on
(`String` here). Called with normal method syntax, indistinguishable at the call site from a
"real" member function.

## More realistic examples

```kotlin
fun List<Int>.average2Decimals(): String {
    return "%.2f".format(this.average())
}

fun <T> List<T>.secondOrNull(): T? = if (size >= 2) this[1] else null

fun Int.isEven(): Boolean = this % 2 == 0
```

```kotlin
val scores = listOf(85, 92, 78, 95)
println(scores.average2Decimals())    // "87.50"
println(scores.secondOrNull())         // 92
println(4.isEven())                     // true
```

## Why this matters beyond convenience

Extension functions are how Kotlin's own standard library adds so much functionality to basic
types (`String`, `List`, `Int`) without those classes needing to be redesigned or reopened —
`filter`, `map`, `firstOrNull` on collections are themselves extension functions, not built into
the collection classes directly. The same mechanism is fully available for your own code.

## The critical caveat: extensions resolve statically, not polymorphically

:::warning
Unlike a real member function, which is resolved based on the object's **actual runtime type**
(dynamic dispatch), an extension function is resolved based on the **declared/static type** of the
variable — determined at compile time, not runtime. This is a genuinely common source of
surprising bugs for anyone assuming extensions behave like inherited methods.
:::

```kotlin
open class Animal
class Dog : Animal()

fun Animal.speak() = "..."
fun Dog.speak() = "Woof!"

val animal: Animal = Dog()       // static type is Animal, actual object is Dog
println(animal.speak())            // prints "...", NOT "Woof!"

val dog: Dog = Dog()
println(dog.speak())                // prints "Woof!" — static type here IS Dog
```

A real (member) `speak()` override on `Dog` *would* print `"Woof!"` in both cases — that's how
polymorphism normally works. Extension functions don't participate in that mechanism at all; which
extension gets called is decided purely by the variable's declared type at the call site, resolved
at compile time, same as any regular overloaded function.

## When to reach for an extension vs. a member function

```text
Use an extension when:
  - You don't own the class (a stdlib type, a third-party library's class)
  - The function is a pure, self-contained operation not needing access to private state
  - You want to add "utility" behavior without bloating the original class

Prefer a real member function when:
  - You own the class and the function is core to what that type IS, not just a convenience
  - It needs polymorphic (overridable) behavior — see the caveat above
  - It needs access to the class's private members
```

See [Extension Properties](./extension-properties.md) for the property equivalent of this same
mechanism, and [Scoped Extensions & Receivers](./scoped-extensions-and-receivers.md) for extension
functions that themselves take a lambda with a receiver — the foundation of Kotlin DSLs, covered
in depth in [Building DSLs](../05-building-dsls/dsl-basics.md).
