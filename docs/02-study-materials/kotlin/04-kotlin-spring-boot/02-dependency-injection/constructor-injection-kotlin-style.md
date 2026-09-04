---
sidebar_position: 2
title: "Constructor Injection, Kotlin Style"
---

# Constructor Injection, Kotlin Style

Kotlin's primary constructor syntax makes constructor injection almost free to write — a genuine
improvement over the equivalent Java Spring code, not just a stylistic preference.

## The pattern

```kotlin
@Service
class OrderService(
    private val orderRepository: OrderRepository,
    private val paymentClient: PaymentClient
) {
    fun placeOrder(request: CreateOrderRequest): Order {
        val order = orderRepository.save(Order.from(request))
        paymentClient.charge(order.total)
        return order
    }
}
```

No `@Autowired` annotation needed at all. Since Spring 4.3, a class with exactly **one**
constructor is automatically used for injection — no annotation required — and Kotlin's `val`
constructor parameters double as both the constructor argument *and* the class's field
declaration in one line, something Java needs a separate constructor body and field declarations
to express.

```java title="The equivalent, roughly, in Java"
@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final PaymentClient paymentClient;

    public OrderService(OrderRepository orderRepository, PaymentClient paymentClient) {
        this.orderRepository = orderRepository;
        this.paymentClient = paymentClient;
    }
    // ...
}
```

## Why constructor injection specifically, over field/setter injection

- **Immutability** — `private val` means the dependency can never be reassigned after
  construction. Field injection with `lateinit var` allows (and requires) mutability that serves
  no real purpose here.
- **Impossible to construct in an invalid state** — a class requiring constructor arguments
  literally cannot be instantiated without its dependencies. Field-injected `lateinit var`
  properties can exist in a not-yet-injected state (e.g. if constructed manually outside Spring,
  such as in certain test setups), leading to a `lateinit property has not been initialized`
  exception at first use rather than at construction time.
- **Trivial to test without a Spring context at all** — since dependencies are just constructor
  arguments, testing `OrderService` needs nothing more than
  `OrderService(fakeRepo, fakePaymentClient)` — no Spring container, no mocking framework
  annotations required just to construct the object under test.
- **Circular dependencies fail loudly, at startup** — two beans requiring each other via
  constructor injection cause Spring to fail immediately on startup with a clear error. The same
  circular dependency via field injection can sometimes resolve silently (Spring falls back to
  proxy-based lazy resolution in some cases) — which usually means a design problem is being
  masked rather than surfaced.

:::note
That last point is a genuine, non-cosmetic reason to prefer constructor injection: a circular
dependency is almost always a sign two classes should be refactored (extract a third class they
both depend on, or merge them) — constructor injection's fail-fast behavior surfaces that design
problem immediately instead of letting it linger unnoticed.
:::

## Multiple constructors and `@Autowired`

```kotlin
@Service
class NotificationService(
    private val emailClient: EmailClient
) {
    @Autowired
    constructor(emailClient: EmailClient, smsClient: SmsClient) : this(emailClient) {
        // ...
    }
}
```

If a class genuinely needs more than one constructor, `@Autowired` becomes required again — to
tell Spring which one to use for injection. Rare in practice; usually a sign the class is trying
to do two different things and could be split.

## Optional dependencies

```kotlin
@Service
class ReportService(
    private val cache: ReportCache? = null    // nullable + default null = genuinely optional
)
```

A nullable constructor parameter with a default of `null` is how an *optional* dependency is
expressed — Spring injects a matching bean if one exists, and simply passes `null` if none does,
rather than failing to start. The nullability is enforced by Kotlin's own type system from that
point on — every use of `cache` inside the class must handle the `null` case explicitly, a compile
error otherwise.
