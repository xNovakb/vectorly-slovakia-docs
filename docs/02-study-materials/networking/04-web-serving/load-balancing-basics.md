---
sidebar_position: 3
title: Load Balancing Basics
---

# Load Balancing Basics

A load balancer spreads incoming requests across **multiple** instances of the same backend,
instead of one reverse-proxy target handling everything alone. Same underlying mechanism as a
reverse proxy (see [Reverse Proxies](./reverse-proxies.md)) — routing decisions — just routing
across replicas of one service rather than to different services.

```mermaid
graph LR
    Internet --> LB[Load balancer]
    LB --> A1[App instance 1]
    LB --> A2[App instance 2]
    LB --> A3[App instance 3]
```

## Why

- **Capacity** — one instance has a ceiling on how much traffic it can handle; more instances
  raise that ceiling.
- **Availability** — if one instance crashes or is being deployed/restarted, the others keep
  serving traffic. This is what makes zero-downtime deploys possible.

## Common strategies

| Strategy | How it picks an instance |
|---|---|
| Round robin | Cycles through instances in order, one request each |
| Least connections | Sends to whichever instance currently has the fewest active requests |
| IP hash | Same client IP always routes to the same instance (useful for session affinity) |

## Health checks

A load balancer needs to know when an instance is actually broken, not just route to it blindly:

```mermaid
sequenceDiagram
    participant LB as Load balancer
    participant App as App instance
    loop every few seconds
        LB->>App: GET /health
        App-->>LB: 200 OK (or times out / errors)
    end
```

An instance that stops responding to health checks gets pulled out of rotation automatically until
it recovers — this is what lets a rolling deploy replace instances one at a time with zero
requests ever hitting a dead one.

## Where this applies (and doesn't) here

This org's current setup — one VPS, one container per app (see
[`/internal-operations/server-architecture`](/internal-operations/server-architecture)) — doesn't
run multiple replicas of the docs site, so there's no load balancer in the picture today; Caddy is
acting purely as a reverse proxy routing by hostname, not spreading load across instances. This
page is here as the concept you'd reach for if/when traffic or availability needs outgrow a single
instance — not a description of the current setup.

## Check yourself

- A reverse proxy routes by hostname to different services; a load balancer routes across
  multiple instances of the same service. Is the underlying mechanism actually different?

  <details>
  <summary>Answer</summary>

  No — both are the same routing-decision mechanism, just applied differently: one to different
  services, the other to replicas of one service.
  </details>

- Why do health checks matter for a load balancer beyond just "is the instance capable of more
  traffic"?

  <details>
  <summary>Answer</summary>

  Without them the load balancer would keep routing to an instance that's actually broken; health
  checks let it automatically pull a failed instance out of rotation until it recovers.
  </details>

- Does this org's current setup use a load balancer? Why or why not?

  <details>
  <summary>Answer</summary>

  No — it runs one VPS with one container per app, so there's nothing to spread load across;
  Caddy here is acting purely as a reverse proxy routing by hostname, not balancing replicas.
  </details>

