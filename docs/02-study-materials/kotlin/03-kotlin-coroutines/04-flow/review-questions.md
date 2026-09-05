---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- `flow { println("started"); emit(1) }` prints "started" every single time `.collect()` is called
  on it, once per call. Per [Introduction to Flow](./introduction-to-flow.md), what property of a
  cold flow explains this, and how would a `StateFlow` behave differently for the same scenario?

  <details>
  <summary>Answer</summary>

  A cold flow does nothing until `collect` is called, and runs its whole body independently, from
  the start, for *each* separate collector — hence "started" printing again on every call. A hot
  flow like `StateFlow` already exists and holds state regardless of whether anyone is collecting;
  multiple collectors share the same ongoing stream rather than each triggering an independent run.
  </details>

- Building `flow.map { }.filter { }` alone does no work at all. Per
  [Flow Operators](./flow-operators.md), what has to happen before any of that chain actually
  executes, and how does this parallel the cold-flow behavior from
  [Introduction to Flow](./introduction-to-flow.md)?

  <details>
  <summary>Answer</summary>

  A terminal operator (`collect`, `toList`, `first`, etc.) has to be called — intermediate
  operators like `map`/`filter` are lazy and just return a new `Flow` describing the chain, without
  running anything. This is exactly parallel to how a cold flow does nothing until `collect` starts
  it — nothing runs until something actually asks for values.
  </details>

- A one-off "show this toast" event is modeled with `MutableStateFlow<String?>(null)` instead of
  `MutableSharedFlow<String>(replay = 0)`. Per
  [StateFlow & SharedFlow](./stateflow-and-sharedflow.md), what concrete bug does this cause for a
  late collector (e.g. after a screen rotation)?

  <details>
  <summary>Answer</summary>

  `StateFlow` always holds a current value, and a new collector immediately receives that current
  value on subscribing — so a late collector sees the last toast event "replayed" and fires it
  again, even though the event already happened and shouldn't repeat. `SharedFlow` with `replay =
  0` only delivers an event to collectors that were actively listening at the moment it was
  emitted, which is the actual semantics a one-off event needs.
  </details>

- `flow.catch { e -> emit(-1) }.collect { println(it) }` catches an exception thrown upstream in
  the flow builder, but per [Flow Operators](./flow-operators.md), it would *not* catch an
  exception thrown inside the `collect` lambda itself. Why not?

  <details>
  <summary>Answer</summary>

  `catch` only catches exceptions from operators upstream of it in the chain (before it) — the
  `collect` lambda is downstream of `catch`, so an exception thrown there is outside what `catch`
  is positioned to intercept at all.
  </details>

- `temperatures.zip(humidity) { ... }` and `temperatures.combine(humidity) { ... }` both combine
  two flows into one. Per [Flow Operators](./flow-operators.md), when would these produce a
  different number of emitted values for the same two source flows?

  <details>
  <summary>Answer</summary>

  `zip` pairs values strictly by index, one-to-one, so it only emits as many combined values as the
  shorter source flow provides. `combine` emits a new combined value every time *either* source
  emits, using the latest value from the other — for flows emitting at different rates or counts,
  `combine` typically produces more emissions than `zip` would for the same two flows.
  </details>

