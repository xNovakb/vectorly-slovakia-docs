---
sidebar_position: 1
title: HTTP Methods
---

# HTTP Methods

The **method** (or "verb") on a request states the intended action. HTTP doesn't enforce what a
method actually does server-side — these are conventions, but conventions that browsers, proxies,
caches, and other tooling all rely on being followed.

## The common ones

```text
GET      — retrieve a resource, no side effects intended
POST     — create a resource, or trigger an action that isn't a clean fit for the others
PUT      — replace a resource entirely with what's provided
PATCH    — partially update a resource
DELETE   — remove a resource
HEAD     — like GET, but response has no body — just headers (e.g. checking if something exists,
            or its size, without downloading it)
OPTIONS  — ask what methods/headers are allowed on this resource (used by CORS preflight — see
            Same-Origin & CORS)
```

## `PUT` vs. `PATCH` — a genuinely common confusion

- **PUT** — send the *entire* resource; the server replaces what's there with exactly what you
  sent. Fields you omit are implicitly removed/reset.
- **PATCH** — send only the *fields that changed*; everything else on the resource stays as-is.

```bash
# PUT — must include every field, or they get wiped
curl -X PUT https://api.example.com/users/42 \
  -d '{"name": "Jane", "email": "jane@example.com", "role": "admin"}'

# PATCH — only send what's actually changing
curl -X PATCH https://api.example.com/users/42 \
  -d '{"email": "jane@newdomain.com"}'
```

Using `PUT` with a partial body is a common real-world bug — it silently wipes fields the caller
didn't think to include, because `PUT` semantically means "this is now the whole thing."

## A worked example across methods

```bash
curl https://api.example.com/articles/42                          # GET  — read it
curl -X POST https://api.example.com/articles -d '{"title":"..."}'  # POST — create a new one
curl -X PATCH https://api.example.com/articles/42 -d '{"title":"New"}'  # PATCH — update one field
curl -X DELETE https://api.example.com/articles/42                    # DELETE — remove it
```

## Why the method matters beyond just "which function runs"

Browsers, caches, and proxies all behave differently depending on the method — a `GET` can be
cached and safely retried automatically by a browser on a flaky connection; a `POST` generally
can't be (browsers warn before resubmitting a form). This is why picking the *semantically*
correct method matters even when, technically, your server code could handle any of them the same
way — see [Idempotency & Safety](./idempotency-and-safety.md) for exactly what's being relied on.

## Check yourself

- What's the real difference between `PUT` and `PATCH`, and what's the classic bug from sending a
  partial body with `PUT`?

  <details>
  <summary>Answer</summary>

  `PUT` sends the entire resource and replaces what's there — fields you omit are implicitly
  wiped. `PATCH` sends only the fields that changed, leaving everything else untouched. The
  classic bug: sending a partial body via `PUT` silently deletes whatever wasn't included.
  </details>

- Which method does a CORS preflight request use, and why that one specifically?

  <details>
  <summary>Answer</summary>

  `OPTIONS` — it asks what methods/headers are allowed on a resource before the browser sends the
  real cross-origin request.
  </details>

- Name a method that returns headers but never a body — what's it useful for?

  <details>
  <summary>Answer</summary>

  `HEAD` — like `GET` but with no body, useful for checking whether a resource exists or how large
  it is without downloading it.
  </details>
