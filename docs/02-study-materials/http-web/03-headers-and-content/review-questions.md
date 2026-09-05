---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A response sets `Cache-Control: no-cache` and includes an `ETag`. Walk through exactly what
  happens on the *next* request for that same resource.

  <details>
  <summary>Answer</summary>

  Because `Cache-Control` says "revalidate before using," the client sends the cached `ETag` back
  via `If-None-Match`. If it still matches, the server responds `304` with no body and the client
  reuses its cached copy; if it changed, the server responds `200` with a new body and `ETag`.
  </details>

- Why is `Content-Type` arguably the single most important header, and how does getting `charset`
  wrong break things even when the MIME type itself is correct?

  <details>
  <summary>Answer</summary>

  It's what everything downstream trusts to interpret the body's bytes. Even a technically valid
  body renders wrong (or as raw text) if `charset` is missing or wrong, independent of whether the
  MIME type itself was correct.
  </details>

- What does the `Accept` header let a client negotiate for, and which response header confirms
  what the server actually chose to send?

  <details>
  <summary>Answer</summary>

  `Accept` lets the client rank which formats it's willing to accept; `Content-Type` on the
  response confirms which format the server actually sent.
  </details>

- A server's `Cache-Control` header is missing entirely from a response. What's the safest default
  assumption a browser should make about caching it?

  <details>
  <summary>Answer</summary>

  Not to rely on it being cached at all — an explicit `Cache-Control` header is the only reliable
  way to control caching behavior; its absence shouldn't be read as an invitation to cache freely.
  </details>

- `Set-Cookie` can legally appear multiple times in one response. Could `Content-Type` do the
  same? Why or why not?

  <details>
  <summary>Answer</summary>

  No — `Content-Type` describes one body, so exactly one value makes sense. `Set-Cookie` can
  repeat because each instance sets a logically separate cookie.
  </details>
