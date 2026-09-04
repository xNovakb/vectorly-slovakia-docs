---
sidebar_position: 1
title: Kotlin/Java Interop
---

# Kotlin/Java Interop

Kotlin and Java compile to the same JVM bytecode (see
[What Is Kotlin](../01-basics/what-is-kotlin.md)), which is what makes calling between them in
either direction genuinely seamless, not a compatibility shim bolted on afterward.

## Calling Java from Kotlin

```kotlin
import java.util.ArrayList
import java.time.LocalDate

val list = ArrayList<String>()      // any Java class, used directly, no wrapper
list.add("hello")

val today = LocalDate.now()           // Java standard library, called like native Kotlin
println(today.plusDays(7))
```

No special syntax needed — a Java class is used exactly like a Kotlin one, because at the bytecode
level, there's no real distinction once compiled.

## Calling Kotlin from Java

```kotlin title="User.kt"
class User(val name: String, val email: String) {
    fun greet(): String = "Hello, $name!"
}
```

```java title="Main.java"
User user = new User("Jane", "jane@example.com");
System.out.println(user.greet());
System.out.println(user.getName());    // Kotlin's `val name` becomes a Java getter automatically
```

A Kotlin `val`/`var` property compiles to a real Java getter (and setter, for `var`) under the
hood — `user.name` in Kotlin and `user.getName()` in Java both reach the same underlying field.

## `@JvmStatic` — exposing a companion object member as a real static method

```kotlin
class MathUtils {
    companion object {
        @JvmStatic
        fun square(x: Int): Int = x * x
    }
}
```

```java
// Without @JvmStatic, Java would need: MathUtils.Companion.square(5)
int result = MathUtils.square(5);    // with @JvmStatic, callable as a normal Java static method
```

Without `@JvmStatic`, a companion object member (see
[Objects & Companion Objects](../03-classes-and-objects/objects-and-companion-objects.md)) is
still accessible from Java, just awkwardly, through the generated `Companion` object explicitly.
`@JvmStatic` makes it appear as a genuine `static` method to Java callers.

## `@JvmOverloads` — exposing default parameters as real overloads

```kotlin
class Greeter {
    @JvmOverloads
    fun greet(name: String, greeting: String = "Hello") {
        println("$greeting, $name!")
    }
}
```

```java
greeter.greet("Jane");           // works — @JvmOverloads generated this overload
greeter.greet("Jane", "Hi");       // and this one
```

Default parameters (see [Functions Basics](../02-functions-and-control-flow/functions-basics.md))
are a purely Kotlin-compiler feature — without `@JvmOverloads`, Java code calling a Kotlin
function with default parameters would be forced to always pass every parameter explicitly, with
no overloads generated. `@JvmOverloads` tells the compiler to generate the actual Java overloads
Java callers expect.

## `@JvmName` — renaming for Java when Kotlin's name would collide

```kotlin
@file:JvmName("StringUtils")

fun String.isValidEmail(): Boolean = contains("@")
```

Kotlin file-level functions compile to a class named after the file by default (e.g.
`StringExtensionsKt` for a file `StringExtensions.kt`) — `@JvmName` lets you control that
generated class name explicitly, useful when the default would be awkward for Java callers or
would collide with something else.

## Where the interop story gets genuinely trickier

Nullability doesn't cross the Kotlin/Java boundary automatically for unannotated Java code — see
[Platform Types & Java Interop](./platform-types-and-java-interop.md) for exactly how that gap is
handled, and where it can still bite you.
