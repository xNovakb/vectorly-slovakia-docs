---
sidebar_position: 2
title: Ports & Protocols
---

# Ports & Protocols

A single machine has one IP address but can run many servers. A **port** is how traffic gets
routed to the *right* one — a number from 0–65535 tagged onto every connection.

```
docs.vectorly-slovakia.sk:443
        ^                  ^
     hostname             port
```

## Well-known ports

| Port | Protocol | Used for |
|---|---|---|
| 22 | SSH | Remote terminal access |
| 80 | HTTP | Unencrypted web traffic (usually redirects to 443) |
| 443 | HTTPS | Encrypted web traffic |
| 5432 | PostgreSQL | Database connections |
| 3306 | MySQL | Database connections |

Ports below 1024 are "well-known" / reserved — binding to them typically needs elevated
privileges on the server.

## TCP vs. UDP

Both are transport protocols — how bytes actually get moved over the network — sitting underneath
higher-level protocols like HTTP or SSH.

- **TCP** — connection-oriented, guarantees delivery and order (retransmits lost packets). What
  HTTP, HTTPS, and SSH all run on. Slower per-packet overhead, but correctness matters more than
  speed for these.
- **UDP** — no guarantees, no retransmission, lower overhead. Used where a dropped packet is fine
  to lose (video calls, DNS queries, online games) — better to skip a frame than stall waiting for
  a retransmit.

## What "protocol" means here

A protocol is just an agreed message format both sides understand. HTTP is a protocol: a request
line, headers, an optional body — both browser and server agree on that shape, so either side can
write software that speaks it without knowing anything about the other's internals.

```text title="A raw HTTP request, what curl sends"
GET /login HTTP/1.1
Host: docs.vectorly-slovakia.sk
User-Agent: curl/8.4.0
```

## Checking what's listening

```bash
# Windows PowerShell
Get-NetTCPConnection -State Listen

# Linux/macOS
ss -tlnp
```

Useful when a server "isn't responding" — confirming *something* is actually listening on the
expected port is the first troubleshooting step (more in
[Troubleshooting Connectivity](../05-practical-setups/troubleshooting-connectivity.md)).

## Check yourself

- Why can one machine with a single IP address run a web server, a database, and an SSH server
  all at once without them interfering?

  <details>
  <summary>Answer</summary>

  Each one listens on its own port — the port number, not the IP, is what routes a connection to
  the right one of them.
  </details>

- What's the practical difference in what TCP and UDP guarantee, and why does SSH need TCP's
  guarantee while a video call is fine on UDP?

  <details>
  <summary>Answer</summary>

  TCP guarantees delivery and order, retransmitting lost packets; UDP guarantees neither. SSH
  needs every byte to arrive correctly and in order (it's a terminal session); a video call would
  rather skip a lost frame than stall waiting for a retransmit.
  </details>

- A server "isn't responding." What's the first thing to check, and what command checks it?

  <details>
  <summary>Answer</summary>

  Whether anything is actually listening on the expected port — `ss -tlnp` (Linux/macOS) or
  `Get-NetTCPConnection -State Listen` (PowerShell).
  </details>

