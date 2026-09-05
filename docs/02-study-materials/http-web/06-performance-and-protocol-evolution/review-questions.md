---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A CDN edge node caches an app's JS bundle. The team ships a bug fix under the exact same
  filename. What goes wrong, and what naming convention from this subfolder avoids it?

  <details>
  <summary>Answer</summary>

  Users keep getting the stale cached copy under the old filename until the cache expires or is
  explicitly purged. A content-hashed filename (`app.a1b2c3.js`) avoids this — the fix ships under
  a genuinely new URL instead.
  </details>

- Does HTTP-layer compression (gzip/brotli) replace the need for minification, or the other way
  around — why do teams typically do both?

  <details>
  <summary>Answer</summary>

  Neither replaces the other. Minification removes bytes never needed at runtime, at build time;
  compression exploits redundancy in whatever bytes remain, per request. Doing both stacks the
  benefit — skipping either still ships more bytes than doing both.
  </details>

- Under HTTP/1.1, why did bundling many small files into fewer, larger ones help performance — and
  why does that advice weaken under HTTP/2?

  <details>
  <summary>Answer</summary>

  HTTP/1.1 delivers one request at a time per connection, so each extra file cost a full
  round-trip; fewer/larger files meant fewer round trips. HTTP/2's multiplexing lets many requests
  share one connection simultaneously, so that round-trip cost mostly disappears.
  </details>

- A user on a lossy mobile connection reports a slow site even though the server uses HTTP/2.
  What's actually happening at the TCP layer, and which later protocol targets exactly that
  problem?

  <details>
  <summary>Answer</summary>

  TCP's strict-order guarantee means one lost packet blocks every other in-flight request sharing
  that same connection, even ones that already arrived. HTTP/3, running over QUIC/UDP, targets
  exactly this by making loss recovery per-stream instead of connection-wide.
  </details>

- Why does a CDN's cache-invalidation problem simply not arise for content that's never cached at
  the edge in the first place (e.g. a logged-in dashboard)?

  <details>
  <summary>Answer</summary>

  Because there's nothing cached to go stale — invalidation is only a problem for content that was
  cached to begin with.
  </details>
