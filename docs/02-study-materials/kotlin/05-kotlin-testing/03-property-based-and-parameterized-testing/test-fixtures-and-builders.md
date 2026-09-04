---
sidebar_position: 3
title: Test Fixtures & Builders
---

# Test Fixtures & Builders

A practical pattern for constructing realistic test data without every test repeating every field
of a complex object — building on the data-class fixture idea introduced in
[Kotlin-Specific Test Idioms](../01-basics/kotlin-specific-test-idioms.md).

## The problem: verbose, repetitive object construction

```kotlin
❌ @Test
   fun `active user can place an order`() {
       val user = User(
           id = 1, name = "Jane Doe", email = "jane@example.com",
           isActive = true, createdAt = Instant.now(), role = Role.CUSTOMER
       )
       // the test actually only cares about isActive — everything else is noise
   }
```

Every test that needs *any* `User` has to specify *every* field, even fields completely irrelevant
to what that specific test checks — this both clutters the test and, worse, obscures which field
actually matters to the behavior under test.

## A fixture function with sensible defaults

```kotlin
fun userFixture(
    id: Long = 1,
    name: String = "Jane Doe",
    email: String = "jane@example.com",
    isActive: Boolean = true,
    role: Role = Role.CUSTOMER
) = User(id, name, email, isActive, Instant.now(), role)
```

```kotlin
✅ @Test
   fun `inactive user cannot place an order`() {
       val user = userFixture(isActive = false)
       assertFalse(orderService.canPlaceOrder(user))
   }
```

Now the test states **exactly one thing**: this user is inactive. Every other field takes a
reasonable, unremarkable default — a reader immediately knows `isActive = false` is the fact that
matters to this specific test, without needing to mentally filter out irrelevant fields.

## Builder-style fixtures for more complex objects

```kotlin
class OrderFixtureBuilder {
    private var items = mutableListOf<Item>()
    private var user: User = userFixture()
    private var status: OrderStatus = OrderStatus.PENDING

    fun withItem(item: Item) = apply { items.add(item) }
    fun withUser(user: User) = apply { this.user = user }
    fun withStatus(status: OrderStatus) = apply { this.status = status }
    fun build() = Order(items, user, status)
}

fun orderFixture(block: OrderFixtureBuilder.() -> Unit = {}) =
    OrderFixtureBuilder().apply(block).build()
```

```kotlin
@Test
fun `cancelled orders cannot be shipped`() {
    val order = orderFixture {
        withStatus(OrderStatus.CANCELLED)
        withItem(Item("Book", 10))
    }
    assertFalse(shippingService.canShip(order))
}
```

For objects with more moving parts (collections, nested objects, several optional
configurations), a small builder DSL — using a trailing lambda with a receiver, the same
[scope function](/study-materials/kotlin/kotlin-idioms/scope-functions/apply-also) pattern behind
`apply` — reads almost like a mini specification of exactly the scenario being tested, while still
defaulting everything not explicitly mentioned.

## Shared fixtures vs. one-off inline objects

```text
Use a shared fixture function/builder when:
  - The same kind of object is constructed across many test files
  - The object has several fields, most of which rarely matter to any given test

Just construct the object inline when:
  - It's a simple object (2-3 fields) used in only one or two tests
  - Building a fixture function would be more code than it saves
```

A fixture function is a tool for reducing noise, not a rule to apply everywhere unconditionally —
a trivial object with two fields, used in one test, doesn't need a builder; a `User` with a dozen
fields, constructed in fifty different test files, clearly does.

## Keeping fixtures test-only

```text
src/test/kotlin/com/example/fixtures/UserFixtures.kt   ✅ lives alongside tests
src/main/kotlin/com/example/UserFixtures.kt              ❌ leaks test-only code into production
```

Fixtures belong in the test source set specifically (see
[Test Organization](../01-basics/test-organization.md) for Gradle test source sets) — they exist
to make test-writing convenient, and have no reason to ship as part of the actual production
build.
