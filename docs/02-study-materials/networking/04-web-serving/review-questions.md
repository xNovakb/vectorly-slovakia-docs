---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A reverse proxy and a load balancer both make routing decisions. What's the actual difference in
  what each one is routing across?

  <details>
  <summary>Answer</summary>

  A reverse proxy routes to different backends (different services/apps by hostname); a load
  balancer routes across multiple replicas of the *same* backend — the same underlying mechanism,
  applied to a different kind of target.
  </details>

- Why does terminating TLS at the reverse proxy make load balancing across backend instances
  simpler, rather than each instance handling its own certificate?

  <details>
  <summary>Answer</summary>

  The proxy decrypts once and speaks plain HTTP internally — none of the backend instances need
  their own certificate or their own renewal process, so adding or removing instances doesn't
  touch TLS configuration at all.
  </details>

- This org's Caddy setup does TLS termination and hostname routing but not load balancing. What
  would have to change about the infrastructure, not just the Caddy config, for load balancing to
  become relevant?

  <details>
  <summary>Answer</summary>

  Running multiple instances/replicas of the same app — load balancing only matters once there's
  more than one instance of a backend to distribute requests across, which isn't the current
  one-VPS, one-container-per-app setup.
  </details>

- A health check fails for one backend instance behind a load balancer, which itself sits behind
  a TLS-terminating reverse proxy. Does the client making the HTTPS request ever see that failure
  directly?

  <details>
  <summary>Answer</summary>

  No — the load balancer pulls the failed instance out of rotation automatically and routes to a
  healthy one instead; from the client's side, behind the reverse proxy's single HTTPS endpoint,
  the request just succeeds against a different instance.
  </details>
