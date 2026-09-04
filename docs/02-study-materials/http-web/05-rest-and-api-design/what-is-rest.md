---
sidebar_position: 1
title: What Is REST
---

# What Is REST

**REST** (Representational State Transfer) is a set of architectural constraints for designing
networked APIs — not a protocol, not a format, and not simply "an API that uses JSON over HTTP,"
despite that being the loose way it's often used in casual conversation.

## The constraints, briefly

- **Client-server** — a clean separation between the client (UI concerns) and server (data/logic),
  able to evolve independently.
- **Stateless** — each request from a client must contain everything needed to understand it; the
  server holds no client "conversation state" between requests (see
  [What Is HTTP](../01-basics/what-is-http.md) — this is really just HTTP's own statelessness,
  applied deliberately at the API design level too, rather than working around it).
- **Cacheable** — responses should explicitly state whether they're cacheable, so clients/proxies
  can reuse them (see [Caching & ETags](../03-headers-and-content/caching-and-etags.md)).
- **Uniform interface** — resources are identified by URLs, manipulated through a small, standard
  set of methods (see [HTTP Methods](../02-methods-and-semantics/http-methods.md)) — this is the
  constraint that gives REST APIs their familiar shape.
- **Layered system** — a client shouldn't need to know whether it's talking directly to the
  server or through intermediaries (a reverse proxy, a CDN — see the Networking topic's
  [Reverse Proxies](/study-materials/networking/web-serving/reverse-proxies) page).

## Resources, not actions

The core mental shift REST asks for: model an API around **nouns** (resources), not **verbs**
(actions) — the HTTP method already supplies the verb.

```text
❌ POST /createUser
❌ POST /getUserById?id=42
❌ POST /deleteUser?id=42

✅ POST   /users              (create)
✅ GET    /users/42            (read)
✅ DELETE /users/42             (delete)
```

The right side reuses one consistent resource path (`/users/42`) across multiple methods, instead
of inventing a differently-named endpoint per action — this is what "uniform interface" buys you
in practice: a client that already understands the pattern can guess how to interact with a new
resource type it's never seen before.

## What "RESTful" commonly means in practice

Very few real-world APIs implement every constraint from the original definition strictly (the
"stateless" and "layered system" constraints in particular are often loosely followed) — in
everyday use, "RESTful API" mostly means: resource-oriented URLs, standard HTTP methods used per
their semantics (see [Idempotency & Safety](../02-methods-and-semantics/idempotency-and-safety.md)),
and predictable, consistent response shapes. [Designing a Good API](./designing-a-good-api.md)
covers what that looks like concretely.

## REST vs. alternatives, briefly

- **GraphQL** — client specifies exactly what fields it wants in a single request, instead of
  fixed resource shapes across multiple endpoints. Solves over/under-fetching REST can suffer
  from, at the cost of losing some of REST's built-in HTTP caching (a GraphQL API is usually a
  single `POST /graphql` endpoint, which HTTP-level caching can't distinguish by query).
- **gRPC** — a binary, contract-first RPC framework, common for service-to-service communication
  where performance matters more than human-readability or browser-friendliness.

Neither replaces REST universally — the choice depends on the specific consumer (a public API vs.
an internal microservice vs. a mobile app with strict bandwidth constraints), not a general
"better" or "worse."
