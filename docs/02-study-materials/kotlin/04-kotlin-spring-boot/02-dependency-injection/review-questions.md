---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- `OrderService(private val orderRepository: OrderRepository)` needs no `@Autowired` annotation at
  all. Per [Constructor Injection, Kotlin Style](./constructor-injection-kotlin-style.md), what two
  separate facts (one about Spring, one about Kotlin) combine to make this work?

  <details>
  <summary>Answer</summary>

  Since Spring 4.3, a class with exactly one constructor is automatically used for injection with
  no annotation required. Separately, Kotlin's `val` constructor parameters double as both the
  constructor argument and the class's field declaration in one line — Java needs a separate
  constructor body plus field declarations to express the same thing.
  </details>

- Two beans require each other via constructor injection, and Spring fails immediately at startup
  with a clear error. Per [Constructor Injection, Kotlin Style](./constructor-injection-kotlin-style.md),
  why is this failure actually a genuine benefit over how the same circular dependency behaves with
  field injection?

  <details>
  <summary>Answer</summary>

  Field injection can sometimes resolve a circular dependency silently, via proxy-based lazy
  resolution — which usually just masks a real design problem rather than surfacing it. Constructor
  injection's fail-fast startup error immediately signals that two classes should probably be
  refactored (extracting a shared dependency, or merging them), rather than letting a genuine
  design issue linger unnoticed.
  </details>

- A `ReportCache?` constructor parameter defaults to `null`. Per
  [Constructor Injection, Kotlin Style](./constructor-injection-kotlin-style.md), what does Spring
  do if no matching `ReportCache` bean exists, and what does Kotlin's type system require of every
  place `cache` is used inside the class afterward?

  <details>
  <summary>Answer</summary>

  Spring simply passes `null` rather than failing to start, since the dependency is expressed as
  optional. Every use of `cache` inside the class must then explicitly handle the `null` case
  (via `?.`, a null check, etc.) — a compile error otherwise, since the property's type is
  genuinely nullable.
  </details>

- A `prototype`-scoped bean is injected into a `singleton`-scoped bean via a normal constructor
  parameter. Per [Beans & Scopes](./beans-and-scopes.md), does the singleton get a fresh prototype
  instance every time it uses that dependency?

  <details>
  <summary>Answer</summary>

  No — the prototype dependency is only resolved once, at the singleton's own construction time.
  The "new instance every time" behavior doesn't automatically apply just because the dependency
  happens to be prototype-scoped; getting a genuinely fresh instance per use from inside a
  singleton requires an extra pattern like `ObjectProvider<T>` or a scoped proxy.
  </details>

- `@Service`, `@Repository`, and `@RestController` are all, underneath, the same mechanism as
  `@Component`. Per [Beans & Scopes](./beans-and-scopes.md), what's the one genuinely different
  technical behavior among them, beyond communicating intent to a reader?

  <details>
  <summary>Answer</summary>

  `@Repository` additionally enables automatic translation of database-specific exceptions into
  Spring's own consistent `DataAccessException` hierarchy — the other three stereotypes are
  functionally identical to `@Component`, differing only in what they signal about a class's role
  to whoever reads the code.
  </details>

