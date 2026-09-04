---
sidebar_position: 3
title: Test Organization
---

# Test Organization

Naming and structural conventions — not JUnit features, just agreed-upon patterns — that keep a
growing test suite navigable instead of a flat pile of loosely related test methods.

## Given/When/Then as a convention

```kotlin
@Test
fun `withdrawal fails when balance is insufficient`() {
    // given
    val account = Account(balance = 50)

    // when
    val result = account.withdraw(100)

    // then
    assertTrue(result.isFailure)
    assertEquals(50, account.balance)  // balance unchanged
}
```

Given/When/Then (borrowed from behavior-driven-development phrasing) is purely a **comment/naming
convention** — no special library or annotation makes this "official." Its value is forcing a
consistent shape onto every test: set up state, perform one action, assert the outcome — which
makes an unfamiliar test fast to parse, and makes a test that's doing too much (multiple "whens")
visually obvious.

## Structuring test classes to mirror source structure

```text
src/main/kotlin/com/example/UserService.kt
src/test/kotlin/com/example/UserServiceTest.kt

src/main/kotlin/com/example/payments/PaymentProcessor.kt
src/test/kotlin/com/example/payments/PaymentProcessorTest.kt
```

A one-to-one mapping between source files and test files, in matching package structure, means
anyone can find a class's tests without searching — `UserService.kt` → `UserServiceTest.kt`,
predictably, every time.

## Separate test source sets in Gradle

```kotlin title="build.gradle.kts"
sourceSets {
    test {
        kotlin.srcDirs("src/test/kotlin")
    }
}

// A common pattern: a separate source set for slower integration tests
sourceSets.create("integrationTest") {
    kotlin.srcDir("src/integrationTest/kotlin")
}

tasks.register<Test>("integrationTest") {
    testClassesDirs = sourceSets["integrationTest"].output.classesDirs
    classpath = sourceSets["integrationTest"].runtimeClasspath
}
```

```bash
./gradlew test               # fast unit tests only
./gradlew integrationTest      # slower tests, run separately (e.g. in a later CI stage)
```

Splitting fast unit tests from slower integration tests into separate Gradle source sets/tasks
means the fast suite can run on every single change while the slower suite runs less frequently —
the same "different tests, different CI triggers" principle covered generally in
[Running Tests in CI](/study-materials/ci-cd/build-and-test/running-tests-in-ci) in the CI/CD
topic, applied concretely to a Kotlin/Gradle project's own test setup.

## Naming test classes and methods consistently

```text
ClassUnderTest + "Test"    — UserServiceTest, PaymentProcessorTest (the standard convention)

Method names as behavior descriptions, not implementation descriptions:
❌ `test add method`                              — describes WHAT is tested, not the expected behavior
✅ `adds two positive numbers and returns the sum`   — describes the actual expected behavior
```

A test name should describe **behavior**, not restate that a test exists for a given method — the
difference matters most when a test fails: a good name tells you what's broken without opening the
test body at all.

## One assertion concept per test

```kotlin
❌ @Test
   fun `user creation`() {
       val user = createUser("Jane", "jane@example.com")
       assertEquals("Jane", user.name)
       assertEquals("jane@example.com", user.email)
       assertTrue(user.isActive)
       assertNotNull(user.createdAt)
       // ...and now also testing update, deletion, in the same test...
   }

✅ @Test
   fun `created user has the provided name and email`() { ... }
   @Test
   fun `newly created user is active by default`() { ... }
```

Not a hard rule against multiple assertions in one test (asserting several fields of one created
object is fine) — the real goal is one **test per distinct behavior**, so a failure immediately
tells you which specific behavior broke, rather than one giant test whose failure reveals nothing
about which of five unrelated things actually went wrong.
