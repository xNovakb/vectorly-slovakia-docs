---
sidebar_position: 2
title: Property-Based Testing with Kotest
---

# Property-Based Testing with Kotest

A genuinely different testing philosophy from [parameterized tests](./parameterized-tests.md):
instead of hand-picking specific example inputs, the test framework **generates many random
inputs** and checks that a general property holds true for all of them.

## Example-based vs. property-based, side by side

```kotlin title="Example-based — you choose the specific inputs"
@Test
fun `reverse of reverse is the original list`() {
    assertEquals(listOf(1, 2, 3), listOf(1, 2, 3).reversed().reversed())
}
```

```kotlin title="Property-based — the framework generates many inputs"
import io.kotest.property.checkAll

test("reverse of reverse is always the original list") {
    checkAll<List<Int>> { list ->
        list.reversed().reversed() shouldBe list
    }
}
```

The example-based test proves the property holds for **one specific list**. `checkAll` generates
potentially hundreds of random lists — different lengths, empty lists, lists with duplicate or
negative values — and checks the property holds for **all of them**, catching an edge case a
human might never have thought to hand-pick (an empty list, a single-element list, very large
values).

## What makes a good "property" to test

A property is a general statement that should hold true regardless of the specific input — not
every piece of logic has an obvious one, but common shapes include:

```text
Round-trip:        decode(encode(x)) == x
Idempotence:        f(f(x)) == f(x)
Invariant:            sorting a list never changes its length
Commutativity:          add(a, b) == add(b, a)
Equivalent to a simpler,
  known-correct alternative:  fastSort(list) produces the same result as list.sorted()
```

```kotlin
test("sorting never changes the number of elements") {
    checkAll<List<Int>> { list ->
        list.sorted().size shouldBe list.size
    }
}

test("encoding then decoding returns the original string") {
    checkAll<String> { original ->
        decode(encode(original)) shouldBe original
    }
}
```

## Controlling the generated inputs

```kotlin
import io.kotest.property.Arb
import io.kotest.property.arbitrary.int

checkAll(Arb.int(1..100)) { number ->
    // number is always between 1 and 100
    isValidAge(number) shouldBe true
}
```

`Arb` (short for "arbitrary") generators control the shape of generated data — restricting to a
realistic range, or generating structured data (a custom `Arb` for a data class) rather than
Kotest's fully generic default generator for a type, when the test specifically needs
realistic-looking inputs rather than arbitrary edge-case noise.

## When a failure happens — shrinking

```text
Property failed after 23 tests.
Shrunk failing case: [0, -1]
Original failing case: [847, -9231, 5, 0, -1, 33291]
```

When `checkAll` finds a failing input, Kotest doesn't just report the (often large, unwieldy)
randomly-generated case that first failed — it automatically **shrinks** it, searching for a
smaller, simpler input that still triggers the same failure. This is one of property-based
testing's most practically useful features: debugging a failure on `[0, -1]` is far more tractable
than debugging one on a 6-element list of large arbitrary numbers.

## Where this fits, realistically

Property-based testing isn't a replacement for example-based tests — it shines for testing
**general logic with clear invariants** (parsers, serializers, mathematical/algorithmic code,
data transformations), and adds less value for logic that's inherently about specific business
cases (a single named discount rule) where an example-based test (see
[Parameterized Tests](./parameterized-tests.md)) already communicates intent clearly. Most
real codebases mix both, reaching for property-based tests specifically where "does this hold true
in general" is the actual question being asked.
