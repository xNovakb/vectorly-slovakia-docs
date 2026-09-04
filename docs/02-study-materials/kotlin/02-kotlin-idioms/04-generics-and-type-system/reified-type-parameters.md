---
sidebar_position: 3
title: Reified Type Parameters
---

# Reified Type Parameters

A limitation most JVM languages simply live with: generic type information is normally **erased**
at runtime (this is true in both Java and Kotlin, a consequence of how generics were retrofitted
onto the JVM). Kotlin's `reified` keyword is a genuine escape hatch from that limitation — but only
under one specific condition.

## The problem: type erasure

```kotlin
fun <T> isOfType(value: Any): Boolean {
    return value is T    // ❌ compile error: "Cannot check for instance of erased type T"
}
```

At runtime, the JVM doesn't actually know what `T` was — `List<String>` and `List<Int>` are both
just `List` once compiled, the type parameter is erased. This is why a plain generic function
can't do a runtime type check against its own type parameter at all.

## The fix: `inline` + `reified`

```kotlin
inline fun <reified T> isOfType(value: Any): Boolean {
    return value is T    // ✅ works now
}

isOfType<String>("hello")    // true
isOfType<Int>("hello")         // false
```

`reified` is **only** allowed on an `inline` function's type parameter — this isn't an arbitrary
restriction. An inline function's body is copied directly into every call site at compile time
(see how this connects to
[Extension Functions](../02-extension-functions-and-properties/scoped-extensions-and-receivers.md)'s
use of `inline` for receiver lambdas) — so at each specific call site, the compiler knows exactly
what concrete type was passed and substitutes it directly into the inlined code. There's no
"generic `T`" left at runtime at all for that particular call — it's already been replaced with
the real type before the code even runs.

## A genuinely useful real-world case

```kotlin
inline fun <reified T> Gson.fromJson(json: String): T {
    return this.fromJson(json, T::class.java)
}

val user: User = gson.fromJson(jsonString)    // no need to pass User::class.java manually
```

Without `reified`, calling a JSON-deserialization function normally requires manually passing the
target class (`gson.fromJson(json, User::class.java)`) because the function has no other way to
know what type to deserialize into at runtime. `reified` lets the type be inferred from the
call site (or the declared return type) and used directly inside the function body — genuinely
removing boilerplate that would otherwise be unavoidable on the JVM.

## Another common pattern: a type-safe lookup

```kotlin
inline fun <reified T> List<Any>.filterIsInstanceOf(): List<T> {
    return this.filterIsInstance<T>()
}

val mixed: List<Any> = listOf(1, "two", 3, "four", 5.0)
val strings: List<String> = mixed.filterIsInstanceOf<String>()
```

`filterIsInstance<T>()` itself, from the standard library, is implemented using `reified` for
exactly this reason — filtering a mixed collection by runtime type simply isn't expressible
without it.

## The real constraint to remember

```text
reified   → requires    → inline
```

You cannot mark a type parameter `reified` on a non-`inline` function — the compiler will reject
it outright, because without inlining, there's no call site for the compiler to substitute the
concrete type into; a normal (non-inlined) function is compiled once, generically, and genuinely
has no way to know what `T` will be at every future call site.

:::note
Because `inline` copies the function body into every call site, overusing `inline` (especially on
large functions, or ones called from many places) can bloat the compiled bytecode size. `reified`
specifically requires it, but that's a real tradeoff to be aware of if reaching for `inline` more
broadly than this specific need.
:::
