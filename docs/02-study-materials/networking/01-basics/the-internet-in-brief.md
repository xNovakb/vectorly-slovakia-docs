---
sidebar_position: 3
title: The Internet, in Brief
---

# The Internet, in Brief

Just enough of how packets actually travel to make SSH, DNS, and reverse proxies (the rest of
this section) make sense — not a full networking course.

## IP addresses

Every device on a network has an **IP address** — a numeric identifier packets get routed to.

```
203.0.113.42        <- IPv4, four numbers 0-255
2001:db8::1          <- IPv6, longer, being adopted for the larger address space
```

A domain name (`docs.vectorly-slovakia.sk`) is just a human-friendly label that **DNS** resolves
to one of these — see [How DNS Works](../03-domains-and-dns/how-dns-works.md).

## Public vs. private addresses

- **Public IP** — globally unique, reachable directly from the internet. A VPS has one of these.
- **Private IP** — reusable within a local network (`192.168.x.x`, `10.x.x.x`), not directly
  reachable from outside it. Your home router hands these out to your laptop/phone; a **NAT**
  (Network Address Translation) at the router translates between your private IP and the router's
  one public IP.

This is why your laptop typically can't be SSH'd into directly from the internet without extra
setup (port forwarding, a VPN, a tunnel), while a VPS — which has its own public IP — can.

## Packets and routing, at a glance

Data doesn't travel as one stream — it's broken into **packets**, each hopping through multiple
routers between source and destination, potentially via different paths for different packets.

```mermaid
graph LR
    A[Your laptop] --> B[Home router]
    B --> C[ISP]
    C --> D[... internet backbone ...]
    D --> E[VPS's data center]
    E --> F[docs.vectorly-slovakia.sk]
```

Each router only knows "which direction gets this packet closer to its destination" — nothing
knows the whole path in advance. `traceroute` (covered in
[Troubleshooting Connectivity](../05-practical-setups/troubleshooting-connectivity.md)) shows you
this hop-by-hop path for real.

## Why this matters practically

- A firewall or security group blocking a port stops packets at one specific hop — "it works from
  my machine but not from the office" is almost always a difference somewhere along this path, not
  a broken server.
- Latency (ping time) is roughly proportional to physical distance + hop count — a server on
  another continent will always have a floor on how fast it can respond, no matter how fast the
  code is.

## Check yourself

- Why can't you usually SSH directly into your own laptop from the internet, while you can SSH
  into a VPS?

  <details>
  <summary>Answer</summary>

  Your laptop typically has only a private IP behind NAT, not directly reachable from outside
  without extra setup (port forwarding, a VPN, a tunnel); a VPS has its own public IP.
  </details>

- Does a single packet travel the entire source-to-destination path in one hop, or does it pass
  through intermediate routers?

  <details>
  <summary>Answer</summary>

  It passes through multiple routers, each of which only knows which direction gets it closer to
  the destination — no single point knows the whole path in advance.
  </details>

- "It works from my machine but not from the office" — what does this usually indicate, given how
  packets actually route?

  <details>
  <summary>Answer</summary>

  A firewall or security group is blocking the connection at one specific hop somewhere along that
  particular network path — almost never a broken server, since the server is the same for both.
  </details>

