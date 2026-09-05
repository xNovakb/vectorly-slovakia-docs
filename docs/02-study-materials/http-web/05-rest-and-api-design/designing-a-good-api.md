---
sidebar_position: 2
title: Designing a Good API
---

# Designing a Good API

Practical conventions that make a REST API predictable to work with — none of these are enforced
by HTTP itself, they're accumulated community convention that most well-regarded APIs converge on.

## Resource naming

```text
✅ /users               ✅ /users/42               ✅ /users/42/orders
❌ /getUsers             ❌ /user/42                 ❌ /users/42/getOrders
```

- Plural nouns for collections (`/users`, not `/user`) — consistent even for a collection with one
  item.
- Nesting expresses a genuine ownership/containment relationship (`/users/42/orders` = "orders
  belonging to user 42") — don't nest more than 1-2 levels deep, it gets unwieldy fast; a flatter
  `/orders?user_id=42` is often more practical past that point.
- No verbs in the path — the HTTP method is the verb (see
  [What Is REST](./what-is-rest.md)).

## Consistent response shapes

```json title="A single resource"
{
  "id": 42,
  "name": "Jane",
  "email": "jane@example.com"
}
```

```json title="A collection — wrapped, not a bare array"
{
  "data": [
    {"id": 42, "name": "Jane"},
    {"id": 43, "name": "Bob"}
  ],
  "meta": {"total": 2, "page": 1}
}
```

Wrapping a collection response (rather than returning a bare JSON array at the top level) leaves
room to add metadata (pagination info, total count) later without a breaking change — a bare
array response has no place to put that without changing the response's fundamental shape.

## Consistent error responses

```json title="Error shape used across every endpoint"
{
  "error": {
    "code": "validation_failed",
    "message": "Email is required",
    "field": "email"
  }
}
```

Every endpoint returning errors in the *same shape* means client code can write one generic error
handler instead of special-casing each endpoint's own ad-hoc error format.

## Use status codes correctly, and don't reinvent them in the body

```json title="❌ Don't do this"
HTTP/1.1 200 OK
{"success": false, "error": "User not found"}
```

```json title="✅ Do this"
HTTP/1.1 404 Not Found
{"error": {"code": "not_found", "message": "User not found"}}
```

Returning `200` with a `success: false` field in the body defeats the purpose of status codes
(see [Status Codes](../01-basics/status-codes.md)) — it breaks generic HTTP tooling (monitoring,
caching, retry logic) that inspects the *status code*, not every response body's internal shape,
to determine if a request succeeded.

## Input validation errors: be specific

```json
{
  "error": {
    "code": "validation_failed",
    "fields": [
      {"field": "email", "message": "must be a valid email address"},
      {"field": "age", "message": "must be a positive number"}
    ]
  }
}
```

A vague `400 Bad Request` with no detail forces a client-side developer to guess what's actually
wrong — listing exactly which fields failed and why is what turns a debugging session into a
five-second fix.

## Idempotency keys for non-idempotent operations

For a `POST` that creates something with real-world consequences (a payment, an order), clients
often can't safely retry on a network timeout (see
[Idempotency & Safety](../02-methods-and-semantics/idempotency-and-safety.md)) — they don't know
if the original request actually succeeded before the connection dropped. A common pattern:

```http
POST /payments
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

The client generates a unique key once and sends it with every retry attempt of the *same*
logical operation; the server recognizes a repeated key and returns the original result instead
of creating a second payment.

## Check yourself

- Why wrap a collection response in an object (`{"data": [...], "meta": {...}}`) instead of
  returning a bare JSON array at the top level?

  <details>
  <summary>Answer</summary>

  Wrapping leaves room to add metadata (pagination info, total count) later without a breaking
  change — a bare array has nowhere to put that without changing the response's fundamental shape.
  </details>

- What's wrong with returning `200 OK` with `{"success": false}` in the body instead of an actual
  error status code?

  <details>
  <summary>Answer</summary>

  It breaks generic HTTP tooling — monitoring, caching, retry logic — that checks the status code,
  not each response's own ad-hoc body shape, to determine success or failure.
  </details>

- What problem does an `Idempotency-Key` solve that HTTP's own idempotent methods don't already
  cover?

  <details>
  <summary>Answer</summary>

  It lets a client safely retry a non-idempotent `POST` (e.g. a payment) after a network timeout —
  the server recognizes the repeated key and returns the original result instead of creating a
  duplicate.
  </details>
