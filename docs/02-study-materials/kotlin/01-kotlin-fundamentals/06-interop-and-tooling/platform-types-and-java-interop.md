---
sidebar_position: 2
title: Platform Types & Java Interop
---

# Platform Types & Java Interop

[Null Safety](../01-basics/null-safety.md) covers Kotlin's own type system enforcing nullability
strictly — but Java code has no such enforcement built into its type system at all. **Platform
types** are how Kotlin bridges that gap when calling into Java.

## The problem

```java title="LegacyService.java (no nullability annotations at all)"
public class LegacyService {
    public String getName() {
        return someCondition ? "Jane" : null;    // Java's type system can't express this possibility
    }
}
```

Kotlin has no way to know, just from the Java method signature, whether `getName()` can actually
return `null` — the Java type system simply doesn't carry that information for unannotated code.

## Platform types — Kotlin's answer

```kotlin
val name = legacyService.getName()    // inferred type: String! — a "platform type"
```

`String!` (shown in IDE tooling, not writable directly in source) means "Kotlin doesn't know if
this is nullable or not — you decide, and you're on your own if you're wrong." A platform type can
be treated as **either** `String` or `String?` at the call site:

```kotlin
val nonNull: String = legacyService.getName()      // Kotlin trusts you here — NPE if actually null
val nullable: String? = legacyService.getName()      // safer — treats it as potentially null
```

:::warning
Treating a platform type as non-null when the underlying Java method can actually return `null`
reintroduces exactly the `NullPointerException` risk Kotlin's null-safety system exists to
prevent — the compiler simply can't warn you here, since it genuinely doesn't know. When calling
unfamiliar or legacy Java APIs, treating the result as nullable (`String?`) by default is the
safer default until you've confirmed otherwise.
:::

## Annotated Java code closes this gap

```java title="ModernService.java"
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class ModernService {
    public @NotNull String getRequiredField() { return "value"; }
    public @Nullable String getOptionalField() { return maybeNull; }
}
```

```kotlin
val required = modernService.getRequiredField()    // inferred as non-null String, enforced normally
val optional = modernService.getOptionalField()      // inferred as String?, enforced normally
```

With `@NotNull`/`@Nullable` (from JetBrains' annotations, or the JSR-305 / Jakarta equivalents),
Kotlin trusts the annotation and treats the type as genuinely non-null or nullable — full,
normal null-safety enforcement applies, no platform-type ambiguity at all.

## Practical guidance for interop-heavy code

```text
- Prefer calling well-annotated Java libraries where possible — the interop experience is
  meaningfully better and safer
- When wrapping an unannotated legacy Java API for use from Kotlin, wrap it once in a small
  Kotlin adapter layer that makes an explicit, deliberate nullability decision for each method
  — rather than leaving `!` platform types scattered through calling code everywhere
- When in doubt about an unannotated method's actual nullability, check its documentation or
  source rather than guessing from the platform type alone
```

This is also relevant when a Kotlin/Spring Boot app persists data through JPA, where lazy-loaded
relationships have their own related nullability subtlety — see
[Null Safety with JPA Entities](/study-materials/kotlin/kotlin-spring-boot/data-access/kotlin-entities-and-jpa-gotchas)
in the Kotlin + Spring Boot topic for that specific, common case.
