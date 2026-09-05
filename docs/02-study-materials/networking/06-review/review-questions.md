---
sidebar_position: 1
title: Review Questions
---

# Review Questions

Synthesis questions across the whole topic. Answer out loud, connecting subfolders — that's the
point of this page, not repeating any single page's own questions.

- Trace `https://docs.vectorly-slovakia.sk` from typing it in a browser to seeing the page: name
  every mechanism from this topic involved (DNS, TCP/port, TLS, reverse proxy, container).

  <details>
  <summary>Answer</summary>

  DNS resolves the hostname to an IP; the browser opens a TCP connection to port 443; a TLS
  handshake establishes encryption and verifies the certificate; the request (with its `Host`
  header) reaches Caddy, the reverse proxy, which routes by hostname to the `docs-app` container
  over the internal `proxy-net` Docker network; the container responds, and Caddy relays that back
  encrypted.
  </details>

- Both SSH key auth and TLS certificates rely on a private/public keypair concept. Where does the
  actual similarity end?

  <details>
  <summary>Answer</summary>

  Both prove identity via a private key that never leaves its holder and a public counterpart the
  other side checks against. They diverge on trust setup: SSH trust is established by manually
  placing a public key in `authorized_keys`; TLS trust relies on a third-party CA vouching for the
  server's certificate, which the browser checks against a built-in trusted CA list.
  </details>

- Why does a private IP behind NAT explain both "I can't SSH into my laptop from a coffee shop"
  and "port forwarding from a router is sometimes needed for direct access"?

  <details>
  <summary>Answer</summary>

  Both are the same underlying fact: a private IP isn't directly reachable from outside its local
  network without something (NAT rules, port forwarding, or a tunnel) explicitly bridging that gap
  — a laptop on home Wi-Fi and a container without a published port share this exact limitation.
  </details>

- An SSH tunnel (`-L`) and Docker's bridge networking both let one side reach a service that isn't
  publicly exposed. What's genuinely different about the trust model each one relies on?

  <details>
  <summary>Answer</summary>

  The SSH tunnel relies on you having already authenticated to the remote machine over SSH — the
  tunnel piggybacks on that established trust. Docker's bridge network relies on containers being
  attached to the same private network by the person who configured it — no per-connection
  authentication happens at the network layer itself.
  </details>

- Why does this org terminate TLS at the reverse proxy instead of inside `docs-app` itself, and
  how does that connect to why `docs-app` only needs a firewalled internal port, not a public one?

  <details>
  <summary>Answer</summary>

  Terminating TLS once, centrally, means only Caddy needs a certificate and needs to be reachable
  from the internet at all — `docs-app` can speak plain HTTP over the private Docker network,
  because that network isn't exposed the way the internet-facing hop is, and only one thing (Caddy)
  needs to be kept patched against direct exposure.
  </details>

- A DNS record change and a load balancer health check both involve one thing "not taking effect
  everywhere instantly." Why is one about caching and the other about active detection?

  <details>
  <summary>Answer</summary>

  DNS propagation delay is passive — resolvers simply keep serving a cached answer until its TTL
  expires, nobody is checking anything. A load balancer's health check is active — it repeatedly
  polls each instance itself to decide, in near-real-time, whether to keep routing to it.
  </details>

- If `curl -v` against a domain stops right after "Connected" but never completes a TLS handshake,
  which subfolder's content explains what to check next, and why isn't it a DNS problem?

  <details>
  <summary>Answer</summary>

  Web Serving's TLS & HTTPS page — a successful TCP connect already means DNS resolved correctly
  and the server accepted the connection; a stalled handshake points specifically at a certificate
  or TLS configuration problem, one layer further along than DNS.
  </details>

- Why would putting a load balancer in front of multiple app instances change how you'd debug
  "the deploy isn't showing up," compared to this org's current single-instance setup?

  <details>
  <summary>Answer</summary>

  With one instance, `docker ps`/`docker logs` on the one server tells the whole story. With a
  load balancer, a stale instance could still be in rotation serving old content while others got
  the new deploy — you'd need to check each instance individually, or that the load balancer
  actually cycled traffic to the updated ones.
  </details>

- The SSH-based deploy pipeline and a reverse proxy both act as a single controlled entry point
  guarding something behind them. What's actually being protected in each case?

  <details>
  <summary>Answer</summary>

  The SSH deploy key guards *who* can execute commands and change what's running on the VPS at
  all; the reverse proxy guards *which* backend a given public request is allowed to reach — one
  controls administrative access, the other controls request routing/exposure.
  </details>

- Why does a `CNAME` record and a reverse proxy's hostname routing solve conceptually similar
  problems ("point this at the right actual target") using completely different mechanisms?

  <details>
  <summary>Answer</summary>

  A `CNAME` operates at the DNS layer, before any connection is made — it just tells resolvers
  "look up this other name instead." A reverse proxy operates after a TCP/TLS connection is
  already established, inspecting the `Host` header of an actual HTTP request to decide where to
  forward it — DNS redirects the *lookup*, the proxy redirects the *live connection*.
  </details>

- Given everything in this topic, why is "it works from my machine" nearly useless as a bug report
  for a networking issue, and what's the fastest way to make it useful?

  <details>
  <summary>Answer</summary>

  Because so many links in the chain (DNS resolver used, network path/hops, firewall rules, which
  IP was actually reached) can differ between two machines even when hitting "the same" domain.
  The fastest fix is running the same ordered checks (DNS → reachable at all → TLS → proxy →
  backend) from the failing machine to identify exactly which link differs.
  </details>

- Why does an SSH deploy key needing no passphrase (for CI) and a Docker container needing no
  published port (for internal-only services) both reflect the same underlying security
  principle?

  <details>
  <summary>Answer</summary>

  Both follow "narrow the blast radius instead of trusting broadly": the deploy key is scoped to
  one purpose so a leak is contained, and an unpublished container port simply isn't reachable
  from outside at all — neither relies on a broad credential or open surface being carefully
  guarded, they just remove the exposure.
  </details>
