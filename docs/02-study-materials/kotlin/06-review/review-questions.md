---
sidebar_position: 1
title: Review Questions
---

# Review Questions

Synthesis questions across the whole Kotlin topic. Answer out loud, connecting subtopics — that's
the point of this page, not repeating any single subtopic's own questions.

- [Null Safety](/study-materials/kotlin/kotlin-fundamentals/basics/null-safety) makes `String` vs.
  `String?` a compile-time distinction. [Kotlin Entities & JPA Gotchas](/study-materials/kotlin/kotlin-spring-boot/data-access/kotlin-entities-and-jpa-gotchas)
  describes a case where a non-null Kotlin property can still end up holding `null` at runtime.
  Why does Kotlin's compile-time guarantee fail specifically at that boundary?

  <details>
  <summary>Answer</summary>

  Hibernate assigns values into entity properties via reflection at runtime, completely bypassing
  normal Kotlin code paths the compiler actually analyzes. If the underlying database column
  contains `NULL` despite the Kotlin property being declared non-null, Hibernate hands `null` into
  it anyway — the compiler's guarantee only holds for code paths it can see, and reflection-based
  assignment isn't one of them.
  </details>

- [Data Classes](/study-materials/kotlin/kotlin-fundamentals/classes-and-objects/data-classes)
  presents `data class` as the idiomatic default for a data holder.
  [Kotlin Entities & JPA Gotchas](/study-materials/kotlin/kotlin-spring-boot/data-access/kotlin-entities-and-jpa-gotchas)
  says not to use it for JPA entities, while
  [Kotlin-Specific Test Idioms](/study-materials/kotlin/kotlin-testing/basics/kotlin-specific-test-idioms)
  recommends it specifically for test fixtures. What's the actual criterion that makes `data class`
  right in one case and wrong in the other?

  <details>
  <summary>Answer</summary>

  `data class`'s generated `equals()`/`hashCode()`/`copy()` are based on all constructor
  properties and assume the object's identity is fully determined by its current field values — true
  for a test fixture (an immutable, disposable value), but false for a JPA entity, where identity
  should be based on a stable ID and mutable `var` fields plus lazy-loaded proxies make the
  generated equality genuinely unreliable. The criterion is whether the type's identity is
  value-based or reference/ID-based.
  </details>

- [Suspend Functions](/study-materials/kotlin/kotlin-coroutines/basics/suspend-functions) says
  `suspend` is enforced by the compiler as part of a function's type.
  [MockK Basics](/study-materials/kotlin/kotlin-testing/assertions-and-mocking/mockk-basics)
  mentions MockK has native support for mocking `suspend` functions where Mockito historically
  struggled. Why would mocking a suspend function be a genuinely different problem than mocking a
  regular one?

  <details>
  <summary>Answer</summary>

  The Kotlin compiler transforms a suspend function into a state machine via Continuation Passing
  Style — its actual runtime signature doesn't look like the plain function signature written in
  source. A mocking library built without Kotlin's suspend mechanics in mind doesn't know how to
  intercept or stub that transformed shape, which is exactly the kind of Kotlin-specific language
  feature MockK was designed around from the start, the same way it was designed to mock `final`
  classes natively.
  </details>

- [Sealed Classes & when](/study-materials/kotlin/kotlin-idioms/classes-advanced/sealed-classes-and-when)
  covers exhaustive `when` over a closed hierarchy.
  [Custom Exceptions](/study-materials/kotlin/kotlin-fundamentals/error-handling/custom-exceptions)
  applies this to a domain exception hierarchy (`OrderException`). What compile-time guarantee does
  marking `OrderException` `sealed` give a `when` block handling it, that an unsealed exception
  hierarchy couldn't?

  <details>
  <summary>Answer</summary>

  The compiler can enumerate every possible subtype of a sealed class at compile time, so a `when`
  handling every current subtype needs no `else` branch — and if a new subtype is added later
  (`OrderCancelledException`, say), every `when` matching on `OrderException` fails to compile until
  updated to handle it. An unsealed hierarchy gives the compiler no way to know the complete set of
  possibilities, so it can't offer that same exhaustiveness check at all.
  </details>

- [Scoped Extensions & Receivers](/study-materials/kotlin/kotlin-idioms/extension-functions-and-properties/scoped-extensions-and-receivers)
  and [DSL Basics](/study-materials/kotlin/kotlin-idioms/building-dsls/dsl-basics) build a
  configuration-block mechanism from trailing lambdas with receivers.
  [Test Fixtures & Builders](/study-materials/kotlin/kotlin-testing/property-based-and-parameterized-testing/test-fixtures-and-builders)'s
  `orderFixture { withStatus(...); withItem(...) }` uses the identical pattern. What's the shared
  mechanism underneath both, and why does it read naturally in both a DSL and a test fixture?

  <details>
  <summary>Answer</summary>

  Both are built on a function type with a receiver (`SomeType.() -> Unit`) — the lambda runs with
  `this` bound to the builder object, so calls like `withStatus(...)` need no qualifier, reading as
  if written directly inside that type. It reads naturally in both contexts because the mechanism's
  actual purpose — configuring an object step by step inside one expression — is exactly what both
  a DSL block and a test fixture builder need, just applied to different domains.
  </details>

- [Constructor Injection, Kotlin Style](/study-materials/kotlin/kotlin-spring-boot/dependency-injection/constructor-injection-kotlin-style)
  says constructor injection makes a service "trivial to test without a Spring context at all."
  [Unit Testing with MockK](/study-materials/kotlin/kotlin-testing/assertions-and-mocking/mockk-basics)
  and [Unit Testing with MockK](/study-materials/kotlin/kotlin-spring-boot/testing-spring-apps/unit-testing-with-mockk)
  both rely on this directly. Trace the actual mechanism: what specifically about constructor
  injection is what MockK-based unit testing depends on?

  <details>
  <summary>Answer</summary>

  Because dependencies are just ordinary constructor parameters (not `@Autowired lateinit var`
  fields resolved by a container), constructing `OrderService(mockRepo, mockPaymentClient)`
  directly needs nothing beyond calling the constructor — no Spring `ApplicationContext`, no
  container startup, no special test annotations just to build the object under test. Field
  injection would leave those dependencies unset until something (normally Spring) injects them,
  making direct construction with test doubles awkward or impossible.
  </details>

- [Property Delegation](/study-materials/kotlin/kotlin-idioms/classes-advanced/delegation)'s `by
  lazy` and [The Standard Library You Should Know](/study-materials/kotlin/kotlin-idioms/idiomatic-patterns/the-standard-library-you-should-know)'s
  `lateinit` are both about deferring initialization.
  [Integration Testing with Testcontainers](/study-materials/kotlin/kotlin-spring-boot/testing-spring-apps/integration-testing-with-testcontainers)
  uses `lateinit var orderRepository: OrderRepository` with `@Autowired`. Why is `lateinit`, not
  `by lazy`, the right tool there specifically?

  <details>
  <summary>Answer</summary>

  `by lazy` computes its value itself, on first access, from something the object already knows how
  to compute. `lateinit` is for a property that will definitely be set from *outside* before use but
  isn't available at construction time — Spring's `@Autowired` injection happens after the test
  object is constructed, externally assigning the field, which is exactly the scenario `lateinit`
  is for and `by lazy` structurally isn't (there's no self-contained computation to lazily run).
  </details>

- [Reified Type Parameters](/study-materials/kotlin/kotlin-idioms/generics-and-type-system/reified-type-parameters)
  explains that `reified` only works on `inline` functions because inlining substitutes the real
  type at each call site. [Extension Functions](/study-materials/kotlin/kotlin-idioms/extension-functions-and-properties/extension-functions)
  covers a completely different limitation — extensions resolve statically, not polymorphically.
  What do these two features have in common about *when* type information is actually available?

  <details>
  <summary>Answer</summary>

  Both are fundamentally about compile-time type resolution rather than runtime dispatch: `reified`
  works because inlining lets the compiler substitute the concrete type before the code ever runs,
  while extension function resolution is decided by the variable's declared (static) type at
  compile time, never consulting the object's actual runtime type the way member-function
  overriding does. Neither mechanism defers its type decision to runtime at all.
  </details>

- [Optional Dependencies](/study-materials/kotlin/kotlin-spring-boot/dependency-injection/constructor-injection-kotlin-style)
  uses a nullable constructor parameter with a `null` default to express an optional Spring
  dependency. [The Result Type](/study-materials/kotlin/kotlin-fundamentals/error-handling/the-result-type)
  lists a nullable return as the right tool for "this may simply have no value." Why is the same
  "nullable = optional/absent" idiom appropriate in both a completely different context (DI vs.
  function return)?

  <details>
  <summary>Answer</summary>

  In both cases, `null` represents a genuinely normal, expected absence rather than an error to
  describe — no bean matching `ReportCache` isn't a failure any more than `findUser` finding no
  matching user is. Kotlin's null safety makes this a type-level contract either way: every
  subsequent use of the nullable value (the injected cache, or the returned user) must explicitly
  handle the `null` case, whether that value came from a container's wiring decision or a
  function's own logic.
  </details>

- A Spring `CoroutineScope` tied to a repository class's own lifecycle
  ([CoroutineScope & CoroutineContext](/study-materials/kotlin/kotlin-coroutines/structured-concurrency/coroutine-scope-and-context))
  and a Spring singleton bean's lifecycle
  ([Beans & Scopes](/study-materials/kotlin/kotlin-spring-boot/dependency-injection/beans-and-scopes))
  are both examples of binding something's lifetime to a container. What's the key structural
  difference between "structured concurrency" and "Spring bean scoping" as lifetime-management
  ideas?

  <details>
  <summary>Answer</summary>

  Structured concurrency's guarantee is enforced by the coroutine machinery itself — a scope
  genuinely cannot complete until every coroutine launched within it (transitively) finishes, with
  no way to silently escape short of a deliberately unscoped builder like `GlobalScope`. Spring's
  bean scoping is a *construction and sharing* policy (one shared instance vs. a new one per
  request) — it says nothing about coroutines or concurrent work at all; a singleton bean can
  itself own a `CoroutineScope` and manage that scope's structured-concurrency lifetime completely
  separately from its own singleton bean lifecycle.
  </details>

- Both [Property-Based Testing with Kotest](/study-materials/kotlin/kotlin-testing/property-based-and-parameterized-testing/property-based-testing-with-kotest)
  and [Kotest Assertions](/study-materials/kotlin/kotlin-testing/assertions-and-mocking/kotest-assertions)'s
  `assertSoftly` are about surfacing more information from a test run than a single pass/fail
  example-based check would. What's the different *kind* of extra information each one provides?

  <details>
  <summary>Answer</summary>

  Property-based testing surfaces cases the test author never thought to hand-pick — it explores
  the input *space* automatically, finding edge cases across potentially hundreds of generated
  values. `assertSoftly` surfaces every failing assertion *within one already-chosen test case* at
  once, rather than stopping at the first — it's about completeness of reporting for a single
  scenario, not about exploring more scenarios.
  </details>

