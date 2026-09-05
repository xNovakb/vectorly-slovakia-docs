---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A domain name resolves to an IP address that's private (`192.168.x.x`), not public. What does
  this tell you about whether that server is directly reachable from the internet?

  <details>
  <summary>Answer</summary>

  It isn't directly reachable — a private IP only exists within a local network and needs NAT (or
  port forwarding/a tunnel) to be reached from outside, unlike a public IP such as a VPS has.
  </details>

- Both "server" (a role) and "port" (a number routing traffic to the right program) let one
  machine do many things at once. How do they combine to make that work?

  <details>
  <summary>Answer</summary>

  A single machine with one IP can run multiple server programs, each bound to its own port —
  "server" describes what a program does, "port" is what routes an incoming connection to the
  right one of them.
  </details>

- Why does a firewall blocking one specific hop produce "works from home, not from the office,"
  rather than a total, universal failure?

  <details>
  <summary>Answer</summary>

  Packets from home and from the office take different paths through different routers before
  reaching the destination — a block at one specific hop only affects paths that pass through it.
  </details>

- If `docs.vectorly-slovakia.sk` and a request to `localhost:3000` both "reach a server," what's
  actually different about how each one gets there?

  <details>
  <summary>Answer</summary>

  `localhost` always means "this machine" — no network routing involved at all. The domain name
  gets resolved by DNS to an IP, then the request actually travels across the internet through
  multiple routers to reach a remote machine.
  </details>
