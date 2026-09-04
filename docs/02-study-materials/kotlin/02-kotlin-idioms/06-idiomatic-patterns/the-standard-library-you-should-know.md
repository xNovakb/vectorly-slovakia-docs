---
sidebar_position: 3
title: The Standard Library You Should Know
---

# The Standard Library You Should Know

A grab-bag of stdlib functions that are genuinely useful, show up constantly in idiomatic Kotlin
code, but are easy to miss if you learned Kotlin primarily by writing Java-shaped code with
Kotlin syntax.

## `takeIf` / `takeUnless` — conditional value or null

```kotlin
val positive = number.takeIf { it > 0 }        // the number, if positive; null otherwise
val nonEmpty = text.takeUnless { it.isEmpty() }   // the text, unless it's empty; null otherwise
```

```kotlin
val validEmail = email.takeIf { it.contains("@") } ?: "invalid@example.com"
```

The genuinely useful pattern: chaining `takeIf`/`takeUnless` with `?:` or
[`let`](../01-scope-functions/let-run-with.md) turns a multi-line `if` check into a single
expression — reach for it when a value should conditionally become `null` (to then be handled
by the rest of a null-safety chain), not as a replacement for every `if` statement.

## `repeat` — a cleaner bounded loop

```kotlin
repeat(3) {
    println("Attempt $it")
}
```

Equivalent to `for (i in 0 until 3)`, but reads more directly as "do this N times" when the index
value itself doesn't matter much beyond logging/counting.

## `use` — guaranteed resource cleanup

```kotlin
File("data.txt").bufferedReader().use { reader ->
    println(reader.readLine())
}    // reader.close() is called automatically, even if an exception is thrown inside the block
```

`use` is Kotlin's equivalent of Java's try-with-resources — it calls `.close()` on the receiver
automatically once the block finishes, **including** when the block throws an exception. Any
`Closeable`/`AutoCloseable` (file handles, database connections, network sockets) should generally
be wrapped in `use { }` rather than manually calling `.close()` at the end of a function, which
silently leaks the resource on any early return or thrown exception along the way.

## `check` / `require` / `assert` — different failure semantics

```kotlin
fun withdraw(amount: Int) {
    require(amount > 0) { "Amount must be positive, got $amount" }    // IllegalArgumentException
    check(balance >= amount) { "Insufficient balance" }                 // IllegalStateException
    assert(balance >= 0) { "Balance invariant violated" }                 // AssertionError, only checked if assertions enabled
    balance -= amount
}
```

These look similar but signal genuinely different things:
- **`require`** — the **caller** passed bad input. Throws `IllegalArgumentException`. Use for
  validating function arguments.
- **`check`** — the **object/program's own state** is wrong, independent of what was just passed
  in. Throws `IllegalStateException`. Use for verifying internal invariants.
- **`assert`** — a sanity check meant primarily for development/testing; typically disabled in
  production JVM runs unless assertions are explicitly enabled (`-ea` flag). Don't rely on
  `assert` for anything that must actually run in production — use `require`/`check` for that.

## `apply`, `also`, `let`, `run`, `with` — already covered, but worth re-flagging here

See [Scope Functions](../01-scope-functions/let-run-with.md) — these five are stdlib functions
too, just important enough to warrant their own dedicated section earlier in this topic rather
than being buried in a grab-bag list.

## `lateinit` and `by lazy` — deferring initialization, differently

```kotlin
lateinit var name: String    // must be a `var`, non-null type, initialized before first use — throws if accessed too early

val config: Config by lazy { loadConfig() }    // computed once, on first access
```

Different tools for different situations: `lateinit` is for a property that will definitely be set
before use (common in dependency injection or Android lifecycle callbacks), but isn't available at
construction time. `by lazy` (see [Delegation](../03-classes-advanced/delegation.md)) is for a
`val` whose value is genuinely computed on first access and cached — reach for `lateinit` when
something external will assign it later, `by lazy` when the value is self-computable but expensive
or possibly unneeded.

## Closing thought for this topic

Every page in this Kotlin Idioms & Advanced Features topic — scope functions, extensions, sealed
classes, generics, DSLs, and this final grab-bag — shares one underlying theme: Kotlin gives you
tools to express *intent* directly (this is a configuration step, this is one of exactly these
three states, this value should conditionally become null) rather than encoding that intent only
in a comment or a variable name. Reaching for the right one, in the right place, is what separates
Kotlin code that merely compiles from Kotlin code that reads like Kotlin.
