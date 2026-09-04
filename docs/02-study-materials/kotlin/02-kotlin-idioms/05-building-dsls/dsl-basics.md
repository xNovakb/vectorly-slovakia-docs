---
sidebar_position: 1
title: DSL Basics
---

# DSL Basics

A Kotlin DSL (domain-specific language) is regular Kotlin code, syntactically arranged to read
like a purpose-built mini-language for a specific problem — no separate parser, no new syntax, just
existing language features (trailing lambdas + [scoped extensions](../02-extension-functions-and-properties/scoped-extensions-and-receivers.md))
combined deliberately.

## The foundation: trailing lambda syntax

```kotlin
fun repeat3(action: () -> Unit) {
    action(); action(); action()
}

repeat3 {
    println("Hello")
}
```

When a function's **last parameter** is a lambda, Kotlin lets you write it outside the parentheses
— `repeat3 { ... }` instead of `repeat3({ ... })`. This alone is why so much Kotlin code (`apply`,
`let`, collection operations) already reads like built-in language syntax rather than ordinary
function calls.

## Adding a receiver — the second piece

```kotlin
class Html {
    private val content = StringBuilder()
    fun text(value: String) { content.append(value) }
    override fun toString() = content.toString()
}

fun html(block: Html.() -> Unit): Html {
    val h = Html()
    h.block()
    return h
}
```

```kotlin
val page = html {
    text("Hello, ")
    text("world!")
}
println(page)    // "Hello, world!"
```

Combining a trailing lambda with a **receiver type** (`Html.() -> Unit`, covered in
[Scoped Extensions & Receivers](../02-extension-functions-and-properties/scoped-extensions-and-receivers.md))
is what makes `text(...)` callable directly inside the block, with no `h.text(...)` qualifier
needed — the block runs *as if it were code written inside the `Html` class itself*.

## A more realistic worked example — building a simple HTML structure

```kotlin
class Tag(private val name: String) {
    private val children = mutableListOf<Tag>()
    private val attributes = mutableMapOf<String, String>()
    private var text: String = ""

    fun attr(key: String, value: String) { attributes[key] = value }

    fun tag(name: String, block: Tag.() -> Unit): Tag {
        val child = Tag(name).apply(block)
        children.add(child)
        return child
    }

    fun text(value: String) { text = value }

    override fun toString(): String {
        val attrs = attributes.entries.joinToString(" ") { "${it.key}=\"${it.value}\"" }
        val open = if (attrs.isEmpty()) "<$name>" else "<$name $attrs>"
        val childrenHtml = children.joinToString("") { it.toString() }
        return "$open$text$childrenHtml</$name>"
    }
}

fun html(block: Tag.() -> Unit) = Tag("html").apply(block)
```

```kotlin
val page = html {
    tag("body") {
        attr("class", "main")
        tag("h1") { text("Welcome") }
        tag("p") { text("This is a Kotlin DSL example.") }
    }
}
println(page)
// <html><body class="main"><h1>Welcome</h1><p>This is a Kotlin DSL example.</p></body></html>
```

Every `tag { }` block nests naturally, with each level's receiver giving access to that level's
own `attr`/`text`/`tag` functions — genuinely readable structure-building code, built entirely
from ordinary function calls and lambdas, no special DSL syntax in the language itself.

## Real-world DSLs built this exact way

```text
- Gradle's Kotlin DSL (build.gradle.kts) — dependencies { implementation(...) }
- Kotlin's own kotlinx.html library — html { body { h1 { +"Hello" } } }
- Jetpack Compose's declarative UI — Column { Text("Hello") }
- Ktor's routing DSL — routing { get("/users") { ... } }
```

None of these required new language syntax — every one is trailing lambdas + receiver types,
exactly as shown above, just applied to a much larger, more polished domain.

## What's next

[Type-Safe Builders](./type-safe-builders.md) covers the `@DslMarker` annotation — needed once DSL
blocks start nesting, to prevent an inner block from accidentally calling an outer receiver's
function by mistake; [Operator Overloading](./operator-overloading.md) covers the other major
tool Kotlin DSLs frequently lean on.
