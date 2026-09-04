---
sidebar_position: 3
title: StateFlow & SharedFlow
---

# StateFlow & SharedFlow

Both are **hot** flows (see [Introduction to Flow](./introduction-to-flow.md) for cold vs. hot) —
they exist and can emit independent of whether anyone is currently collecting, and multiple
collectors share the same underlying stream. A genuinely common point of confusion between the
two is worth addressing head-on.

## `StateFlow` — always has a current value

```kotlin
val state = MutableStateFlow(0)     // must be given an initial value

state.value = 1                       // update it directly
println(state.value)                    // read the current value directly, no suspension needed

state.collect { println("New value: $it") }   // also collectable as a flow
```

Every `StateFlow` always holds exactly one current value, readable synchronously via `.value` at
any time — there's no such thing as a `StateFlow` with "no value yet." A new collector
**immediately** receives the current value first, then subsequent updates.

## `SharedFlow` — configurable, event-oriented

```kotlin
val events = MutableSharedFlow<String>(replay = 0)    // no current "value" concept at all

events.emit("user_clicked")     // suspending — emits to whoever's currently collecting
events.tryEmit("user_clicked")    // non-suspending variant, may drop the value if buffer is full
```

`SharedFlow` has no built-in notion of "the current value" — it's a general-purpose broadcast
mechanism, with configurable `replay` (how many past values a new collector receives immediately)
and buffering behavior.

## The comparison that actually matters

| | `StateFlow` | `SharedFlow` |
|---|---|---|
| Always has a current value | Yes, via `.value` | No |
| A new collector immediately gets... | The current value | Nothing, unless `replay` is configured |
| Conflates rapid updates (skips intermediate values if collector is slow) | Yes, always | Only if configured to |
| Typical use | Representing current state (e.g. "the current user," "is loading") | Representing discrete events (e.g. "show this toast," "navigate to this screen") |
| Built on top of | `SharedFlow` internally (it's a specialized case) | — |

## Why the distinction is genuinely important, not just API trivia

```kotlin
// ❌ using StateFlow for one-off events — a late collector gets the LAST event replayed,
//    even if it already "happened" and shouldn't fire again (e.g. re-showing a toast on rotation)
val toastEvents = MutableStateFlow<String?>(null)

// ✅ SharedFlow with replay = 0 — an event is only seen by collectors that were listening
//    at the moment it was emitted, which is what a one-off event should mean
val toastEvents = MutableSharedFlow<String>(replay = 0)
```

Using `StateFlow` for something that's conceptually a one-time **event** (show a toast, navigate
somewhere, show an error dialog) is a common and genuinely disruptive mistake — because it always
holds a "current value," a late collector (e.g. after a UI rotation, or a new screen subscribing)
can see an old event fire again, unintentionally.

## Which to reach for

```text
"What is the current state of X?"    -> StateFlow
"Something just happened"              -> SharedFlow (typically with replay = 0)
```

If the answer to "what should a brand-new collector see immediately" is "the current value of
something," reach for `StateFlow`. If the answer is "nothing, unless it's listening when the next
thing happens," reach for `SharedFlow`.
