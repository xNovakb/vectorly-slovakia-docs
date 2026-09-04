---
sidebar_position: 1
title: "let, run, with"
---

# let, run, with

Kotlin's scope functions execute a block of code in the context of an object, without needing a
separate named variable for it. `let`, `run`, and `with` are three of the five (`apply` and `also`
are covered in [apply & also](./apply-also.md)) — this page focuses on the ones centered around
**returning a computed value**.

## `let` — the object as `it`, returns the lambda result

```kotlin
val name: String? = "Jane"

val length = name?.let {
    println("Name is $it")
    it.length
}
```

`let` passes the receiver as `it` (or a named parameter), and returns whatever the lambda's last
expression evaluates to. Its most common real use: safely operating on a nullable value only when
it's non-null, using the `?.let { }` pattern above — the block simply doesn't run if `name` is
`null`.

```kotlin
val user: User? = fetchUser()
user?.let { u ->
    sendWelcomeEmail(u.email)
    logSignup(u.id)
}
```

## `run` — the object as `this`, returns the lambda result

```kotlin
val result = "hello".run {
    uppercase().reversed()
}
// result == "OLLEH"
```

`run` is like `let`, but the receiver is available as `this` (implicit — member access doesn't
need a qualifier) instead of `it`. Also usable *without* a receiver, as a plain scoping block:

```kotlin
val configured = run {
    val a = computeA()
    val b = computeB()
    a + b
}
```

This standalone form is useful for scoping a handful of temporary variables (`a`, `b` here) out of
the surrounding scope, without needing a separate function.

## `with` — not an extension function, takes the object as an argument

```kotlin
val sb = StringBuilder()
val message = with(sb) {
    append("Hello, ")
    append("world!")
    toString()
}
```

`with` behaves like `run`'s receiver-as-`this` form, but is called differently: `with(obj) { }`
rather than `obj.run { }`. Because it's a regular function taking the receiver as a parameter (not
an extension function called *on* something), `with` reads slightly better when the object already
exists and you're not chaining off a nullable value — `run`/`let` are usually the better fit when
chaining off an expression or a nullable.

## `let` vs. `run` vs. `with` at a glance

| | Receiver access | Returns | Typical use |
|---|---|---|---|
| `let` | `it` | Lambda result | Null-safety chains (`?.let { }`), transforming a value |
| `run` | `this` | Lambda result | Scoping temporary variables, chaining computation on a receiver |
| `with` | `this` | Lambda result | Grouping multiple calls on an already-existing object |

## Continuing the comparison

[apply & also](./apply-also.md) covers the other two scope functions — the ones built around
**configuring an object and returning the object itself**, a genuinely different use case from
these three. [Choosing the Right Scope Function](./choosing-the-right-scope-function.md) ties all
five together into one practical decision guide.
