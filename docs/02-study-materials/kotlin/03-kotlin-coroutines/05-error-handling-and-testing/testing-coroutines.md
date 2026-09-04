---
sidebar_position: 3
title: Testing Coroutines
---

# Testing Coroutines

Testing suspend functions and coroutines has one problem ordinary tests don't: code with real
`delay()` calls would make tests genuinely slow if delays actually took real wall-clock time.
`kotlinx-coroutines-test` solves this with **virtual time**.

## `runTest` — the standard entry point

```kotlin
import kotlinx.coroutines.test.runTest

@Test
fun `fetches user data`() = runTest {
    val user = fetchUser(1)
    assertEquals("Jane", user.name)
}
```

`runTest` creates a coroutine test environment with a `TestDispatcher` — a dispatcher built
specifically for testing, which controls time itself rather than relying on the real clock.

## Virtual time — why a test with `delay(10_000)` doesn't actually take 10 seconds

```kotlin
@Test
fun `retries after delay`() = runTest {
    val start = currentTime      // virtual time, not real time
    delay(10_000L)                 // this executes "instantly" in real wall-clock terms
    val elapsed = currentTime - start
    assertEquals(10_000L, elapsed)   // virtual time DID advance correctly, just not in real time
}
```

Inside `runTest`, `delay` doesn't actually pause execution for that duration — the test
dispatcher fast-forwards virtual time instead, so a test with several seconds' worth of `delay`
calls still runs in milliseconds of real time, while the coroutine code under test still
*behaves* as if real time passed (timeouts, ordering relative to other delayed work, etc. all
still work correctly).

## Testing a `Flow`

```kotlin
@Test
fun `flow emits expected values`() = runTest {
    val result = countDown().toList()     // collect a whole flow into a List for easy assertion
    assertEquals(listOf(3, 2, 1), result)
}
```

```kotlin
import app.cash.turbine.test    // a popular third-party library specifically for Flow testing

@Test
fun `flow emits values in order`() = runTest {
    countDown().test {
        assertEquals(3, awaitItem())
        assertEquals(2, awaitItem())
        assertEquals(1, awaitItem())
        awaitComplete()
    }
}
```

Collecting into a `List` works fine for a finite flow with a small number of values; a library
like Turbine is common for more complex flow-testing scenarios (asserting emission order
precisely, testing flows that don't naturally complete, testing `SharedFlow`/`StateFlow`
behavior — see [StateFlow & SharedFlow](../04-flow/stateflow-and-sharedflow.md)).

## Injecting a `TestDispatcher` into the code under test

```kotlin
class UserViewModel(private val dispatcher: CoroutineDispatcher = Dispatchers.Default) {
    fun loadUser(id: Int) {
        CoroutineScope(dispatcher).launch {
            // ...
        }
    }
}

@Test
fun `loads user`() = runTest {
    val viewModel = UserViewModel(dispatcher = StandardTestDispatcher(testScheduler))
    // now this ViewModel's coroutines run on the SAME virtual-time scheduler as the test
}
```

For virtual time to actually work correctly, code under test needs to use the **same** test
dispatcher/scheduler the test itself is running on — this is why production code accepting an
injectable dispatcher (rather than hardcoding `Dispatchers.Default`/`Dispatchers.IO` everywhere)
is a common, deliberate design choice specifically to keep code testable.

## What this page doesn't cover

General Kotlin testing (JUnit basics, assertion libraries, mocking) is out of scope here — see the
separate Testing in Kotlin topic for that; this page is specifically about the coroutine-specific
parts (virtual time, `runTest`, flow collection in tests) layered on top of whatever general
testing setup a project already uses.
