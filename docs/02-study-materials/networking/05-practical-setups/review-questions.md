---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- The deploy chain runs `ssh docs-server "docker ps"` as troubleshooting step 1. Why is checking
  whether the container is even running the right first step, before checking Caddy or DNS at all?

  <details>
  <summary>Answer</summary>

  It's the innermost link in the chain — if the container isn't running, nothing downstream
  (internal listening, the reverse proxy, DNS) can possibly be the actual problem, so ruling it in
  or out first narrows the search fastest.
  </details>

- `docs-app` only listens on port 80 internally, reachable by Caddy over `proxy-net` but not from
  the host or the internet. Which Docker networking concept makes that isolation the default
  rather than something you have to configure?

  <details>
  <summary>Answer</summary>

  Containers on a bridge network are reachable by name to each other by default, but nothing is
  reachable from outside Docker unless a port is explicitly published with `-p` — internal-only is
  the default, not an extra step.
  </details>

- Using the troubleshooting toolkit's order (DNS → reachable at all → TLS → proxy → backend),
  where would "container is running and `docker logs` shows no errors, but `curl` from outside
  gets a 502" point you?

  <details>
  <summary>Answer</summary>

  The reverse proxy is up and reachable, but can't reach the backend it's proxying to — check
  whether the app is actually listening on the port/network the proxy expects, even though the
  container itself is healthy.
  </details>

- Why does `ping` returning nothing NOT immediately mean "the deploy is broken" when debugging a
  static site deployment?

  <details>
  <summary>Answer</summary>

  Many servers deliberately block ICMP for security reasons — a missing ping response only rules
  out ICMP specifically, not the actual HTTP(S) service the deploy is supposed to expose.
  </details>
