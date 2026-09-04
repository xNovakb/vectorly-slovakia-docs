---
sidebar_position: 1
title: Základy DSL
---

# Základy DSL

Kotlin DSL (domain-specific language) je obyčajný Kotlin kód, syntakticky usporiadaný tak, aby sa
čítal ako účelový mini-jazyk pre konkrétny problém — žiadny samostatný parser, žiadna nová
syntax, len existujúce jazykové funkcie (trailing lambdy +
[scoped extensions](../02-extension-functions-and-properties/scoped-extensions-and-receivers.md))
skombinované zámerne.

## Základ: trailing lambda syntax

```kotlin
fun repeat3(action: () -> Unit) {
    action(); action(); action()
}

repeat3 {
    println("Hello")
}
```

Keď je **posledný parameter** funkcie lambda, Kotlin ti dovolí napísať ju mimo zátvoriek —
`repeat3 { ... }` namiesto `repeat3({ ... })`. Toto samo osebe je dôvod, prečo toľko Kotlin kódu
(`apply`, `let`, operácie na kolekciách) sa už číta ako vstavaná syntax jazyka namiesto
obyčajných volaní funkcií.

## Pridanie receivera — druhý kúsok

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

Kombinácia trailing lambdy s **typom receivera** (`Html.() -> Unit`, pokryté v
[Scoped Extensions a Receivery](../02-extension-functions-and-properties/scoped-extensions-and-receivers.md))
je to, čo robí `text(...)` volateľné priamo vnútri bloku, bez potreby kvalifikátora `h.text(...)`
— blok beží *akoby bol napísaný vnútri samotnej triedy `Html`*.

## Realistickejší riešený príklad — budovanie jednoduchej HTML štruktúry

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

Každý `tag { }` blok sa prirodzene vnára, pričom receiver každej úrovne dáva prístup k
funkciám `attr`/`text`/`tag` tejto úrovne — naozaj čitateľný kód na budovanie štruktúry, postavený
úplne z obyčajných volaní funkcií a lambd, žiadna špeciálna DSL syntax v samotnom jazyku.

## Reálne DSL postavené presne takto

```text
- Gradle Kotlin DSL (build.gradle.kts) — dependencies { implementation(...) }
- Vlastná knižnica Kotlinu kotlinx.html — html { body { h1 { +"Hello" } } }
- Deklaratívne UI Jetpack Compose — Column { Text("Hello") }
- Routing DSL Ktor — routing { get("/users") { ... } }
```

Žiadny z týchto nepotreboval novú jazykovú syntax — každý je trailing lambdy + typy receiverov,
presne ako ukázané vyššie, len aplikované na oveľa väčšiu, prepracovanejšiu doménu.

## Čo nasleduje

[Type-Safe Buildery](./type-safe-builders.md) pokrýva anotáciu `@DslMarker` — potrebnú akonáhle
sa DSL bloky začnú vnárať, aby predišla tomu, že vnútorný blok náhodou zavolá funkciu vonkajšieho
receivera omylom; [Operator Overloading](./operator-overloading.md) pokrýva ďalší hlavný nástroj,
o ktorý sa Kotlin DSL často opierajú.
