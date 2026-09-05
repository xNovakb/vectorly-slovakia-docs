---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A function parameter is typed `List<String>` rather than `MutableList<String>`. Per
  [Collections Overview](./collections-overview.md), what does that signal to a caller, and is it
  a guarantee the underlying object can never change?

  <details>
  <summary>Answer</summary>

  It signals the function itself won't mutate what's passed in, since `List` genuinely has no
  mutating methods in its interface. It's not a guarantee the object is truly immutable, though —
  the reference could point at an actual `MutableList` underneath, and something else holding a
  separate reference to that same object could still mutate it.
  </details>

- `listOf(1,2,3,4,5).map{...}.filter{...}.first()` and the `.asSequence()` version of the same
  chain both eventually call `.first()`. Per [Sequences](./sequences.md), why does only the lazy
  version skip processing elements 4 and 5?

  <details>
  <summary>Answer</summary>

  On a plain `List`, `map` runs eagerly across every element, producing a full new list, before
  `filter` even starts — by the time `.first()` runs, all 5 elements have already been through both
  steps. On a `Sequence`, each element flows through the *entire* chain one at a time, and
  processing stops the moment `.first()` finds a match, so later elements are never touched.
  </details>

- Why can `generateSequence(1) { it + 1 }` represent an infinite sequence of natural numbers when a
  `List` fundamentally cannot, per [Sequences](./sequences.md)?

  <details>
  <summary>Answer</summary>

  A `List` is eagerly evaluated — it would have to fully materialize every element to exist at
  all, which is impossible for an infinite series. A `Sequence` only computes elements as they're
  actually consumed, so combined with a terminal operation like `.take(5)`, only the elements
  genuinely needed are ever produced.
  </details>

- `numbers.reduce { acc, n -> acc + n }` throws on an empty list, but `numbers.fold(100) { acc, n
  -> acc + n }` doesn't. Per [Functional Operations](./functional-operations.md), why does this
  difference exist?

  <details>
  <summary>Answer</summary>

  `reduce` uses the collection's own first element as its starting accumulator value, so an empty
  collection has nothing to start from and throws. `fold` takes an explicit starting value
  (`100`) supplied independently of the collection's contents, so it always has something to
  return even if the collection is empty.
  </details>

- [Sequences](./sequences.md) warns that `Sequence` isn't "always faster." Using the "doesn't
  really matter" cases it lists, explain why wrapping a small, single `.map()` call in
  `.asSequence()` could plausibly make code *slower*, not faster.

  <details>
  <summary>Answer</summary>

  Sequence machinery itself has overhead (wrapping each step, coordinating lazy evaluation
  element-by-element) that a plain eager `List` operation doesn't pay. For a small collection or a
  single operation with no early-exit benefit, that machinery overhead can outweigh whatever
  savings laziness would otherwise provide — the benefit only shows up with large collections or
  chains that can short-circuit early.
  </details>

