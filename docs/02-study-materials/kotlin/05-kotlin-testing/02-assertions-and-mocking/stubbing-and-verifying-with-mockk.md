---
sidebar_position: 3
title: Stubbing & Verifying with MockK
---

# Stubbing & Verifying with MockK

Beyond basic stubbing (see [MockK Basics](./mockk-basics.md)), MockK's argument matchers and
verification API let a test assert not just *what a mock returns*, but *how it was actually
called* — and control how strict a mock is about being told exactly what to expect.

## Verifying a mock was called

```kotlin
import io.mockk.verify

@Test
fun `sends a confirmation email after order creation`() {
    val emailService = mockk<EmailService>(relaxed = true)
    val orderService = OrderService(emailService)

    orderService.createOrder(userId = 1, items = listOf(item))

    verify { emailService.sendConfirmation(userId = 1) }
}
```

`every { }` stubs a **return value**; `verify { }` asserts an **interaction actually happened** —
different concerns. A test can verify a call happened even for a `Unit`-returning function (like
sending an email) where there's no return value to stub in the first place.

## Argument matchers

```kotlin
every { userRepository.findById(any()) } returns defaultUser         // matches ANY Long argument
every { userRepository.findById(eq(1)) } returns specificUser          // matches exactly 1
every { userRepository.save(match { it.name.isNotBlank() }) } returns Unit   // custom predicate

verify { emailService.sendConfirmation(userId = eq(1)) }
verify(exactly = 2) { emailService.sendConfirmation(any()) }
verify(atLeast = 1) { auditLog.record(any()) }
```

`any()` is useful when a test genuinely doesn't care about the specific argument value — but
overusing it can hide a real bug (a call happening with the *wrong* argument still satisfies an
`any()`-based verification), so prefer a specific value or `match { }` predicate whenever the
actual argument matters to what's being tested.

## Verifying no unexpected calls happened

```kotlin
verify(exactly = 0) { emailService.sendConfirmation(any()) }
confirmVerified(emailService)
```

`confirmVerified` fails the test if the mock had **any** interaction that wasn't explicitly
verified somewhere in the test — catches an accidental extra call a simple `verify { }` alone
wouldn't necessarily reveal, since `verify` only checks the specific interaction it's looking for,
not the complete set of what happened.

## Relaxed mocks — the convenience/safety tradeoff

```kotlin
val emailService = mockk<EmailService>()             // strict — every called method needs a stub, or the test throws
val emailService = mockk<EmailService>(relaxed = true)  // relaxed — unstubbed calls return a default value instead of throwing
```

```kotlin
// Strict mock, no stub for sendConfirmation():
orderService.createOrder(...)
// ❌ io.mockk.MockKException: no answer found for EmailService.sendConfirmation(1)

// Relaxed mock, no stub for sendConfirmation():
orderService.createOrder(...)
// ✅ runs fine — sendConfirmation() silently returns Unit (or 0, false, null, etc. depending on return type)
```

:::warning
A relaxed mock is convenient — no need to stub every single method a dependency happens to have,
even ones the current test doesn't care about — but it also means a genuinely unintentional call
to an *unstubbed* method silently succeeds instead of failing loudly. This can mask a real bug:
code that was supposed to call `emailService.sendConfirmation()` but has a typo calling a
different, similarly-named method won't be caught by a relaxed mock the way a strict mock's
exception would immediately reveal it. Reach for `relaxed = true` mainly for dependencies with many
methods where a specific test only cares about one or two — not as a default for every mock.
:::

## `every` + `verify` together — the full picture

```kotlin
@Test
fun `retries once on a transient failure, then succeeds`() {
    val paymentGateway = mockk<PaymentGateway>()
    every { paymentGateway.charge(any()) } returnsMany listOf(
        Result.failure(TimeoutException()),   // first call fails
        Result.success(Unit)                    // second call (the retry) succeeds
    )

    paymentService.chargeWithRetry(amount = 100)

    verify(exactly = 2) { paymentGateway.charge(any()) }
}
```

`returnsMany` stubs a **sequence** of return values for successive calls — combined with
`verify(exactly = 2)`, this test proves both the retry behavior's *outcome* (stubbing the failure
then success) and that it actually retried the expected *number* of times, not just that it
eventually succeeded somehow.
