---
sidebar_position: 2
title: Flow Operators
---

# Flow Operators

`Flow` supports many of the same operators you'd expect from Kotlin's regular collection
functions — `map`, `filter`, and others — but each one is suspending-aware and works over time
rather than over an already-complete collection.

## The familiar ones

```kotlin
flow { emit(1); emit(2); emit(3) }
    .map { it * 2 }              // 2, 4, 6
    .filter { it > 2 }             // 4, 6
    .collect { println(it) }
```

Reads exactly like the equivalent code on a `List` — `listOf(1, 2, 3).map { it * 2 }.filter { it > 2 }`
— but each value flows through the whole operator chain individually, as it's emitted, rather than
the flow first collecting everything into an intermediate list at each step.

## Operators that specifically involve suspending work

```kotlin
flow { emit(1); emit(2) }
    .map { id ->
        fetchUserFromDatabase(id)    // suspend call, totally fine inside map's lambda
    }
    .collect { user -> println(user) }
```

Because `Flow` is built on coroutines, its operators can freely call suspend functions inside
their lambdas — a genuine difference from a plain synchronous collection's `map`, which can't
suspend at all.

## `collectLatest` — cancel and restart on each new value

```kotlin
flow { emit(1); delay(100); emit(2) }
    .collectLatest { value ->
        delay(50)                        // simulate slow processing
        println("Processing $value")
    }
// value 1's processing gets cancelled partway through, once value 2 arrives
```

Useful when only the **latest** value's processing actually matters — e.g. a search-as-you-type
field, where an in-flight request for an outdated query should be abandoned once a newer one
comes in, rather than wastefully completing it.

## Combining multiple flows

```kotlin
val temperatures = flowOf(20, 21, 22)
val humidity = flowOf(40, 45, 50)

temperatures.zip(humidity) { temp, hum -> "$temp°C, $hum%" }
    .collect { println(it) }
// 20°C, 40%
// 21°C, 45%
// 22°C, 50%
```

```kotlin
temperatures.combine(humidity) { temp, hum -> "$temp°C, $hum%" }
    .collect { println(it) }
```

`zip` pairs values by index, one-to-one; `combine` emits a new combined value every time **either**
source flow emits, using the latest value from the other — meaningfully different behavior for
flows that emit at different rates or don't emit the same number of values.

## Exception handling within a flow chain

```kotlin
flow {
    emit(1)
    throw RuntimeException("Something broke")
}
.catch { e -> emit(-1) }    // catches upstream exceptions, can emit a fallback value
.collect { println(it) }
// 1
// -1
```

`catch` only catches exceptions from **upstream** (operators before it in the chain) — it will not
catch an exception thrown inside `collect`'s own lambda, which is downstream of it. See
[Exception Handling in Coroutines](../05-error-handling-and-testing/exception-handling-in-coroutines.md)
for coroutine exception handling more broadly.

## Terminal vs. intermediate operators

```text
Intermediate (lazy, return a new Flow):   map, filter, take, zip, combine, catch...
Terminal (suspend, actually run the flow): collect, toList, first, single, reduce...
```

Nothing in a flow chain actually executes until a **terminal** operator is called — building a
chain of `map`/`filter` calls alone does no work at all, exactly parallel to how a cold flow (see
[Introduction to Flow](./introduction-to-flow.md)) does nothing until `collect` starts it.
