---
sidebar_position: 1
title: Review Questions
---

# Review Questions

Synthesis questions across the whole topic. Answer out loud, connecting subfolders — that's the
point of this page, not repeating any single page's own questions.

- Trace one full request: a browser sends `GET /articles/42` over HTTP/2 and gets a `304` back.
  Name every mechanism from this topic involved in that single exchange (protocol version, method,
  status code, caching headers).

  <details>
  <summary>Answer</summary>

  HTTP/2 (protocol version, multiplexing over one connection), `GET` (a safe, idempotent method),
  and `304` (a status code meaning "unchanged," produced by ETag/`Cache-Control` validation) — all
  three from this topic show up in that one exchange.
  </details>

- Why is REST's "stateless" constraint described as just HTTP's own statelessness applied
  deliberately at the API-design level, rather than something new REST invents?

  <details>
  <summary>Answer</summary>

  Because it doesn't add a new rule — it says: apply HTTP's own statelessness deliberately at the
  API-design level (every request self-contained) rather than working around it with server-side
  session state.
  </details>

- A team adds `Access-Control-Allow-Origin: *` to a public, read-only endpoint that never checks
  cookies. Is that safe? Would the same header be safe on an endpoint that relies on
  `Authorization` cookies?

  <details>
  <summary>Answer</summary>

  Safe on the public read-only endpoint — there's nothing sensitive a malicious origin could read.
  Not safe on the credentialed endpoint — browsers actually refuse to expose a response to a
  wildcard-origin request that relies on cookies/`Authorization`, specifically to prevent this.
  </details>

- Why can a CSRF attack succeed against a `GET`-based delete endpoint but not against a properly
  designed `DELETE`-method endpoint guarded by a CSRF token?

  <details>
  <summary>Answer</summary>

  A `GET`-based delete endpoint has no CSRF protection since `GET` requests are trivially triggered
  cross-site (an `<img>` tag, an auto-submitting form). A properly designed `DELETE` endpoint
  requiring a CSRF token can't be forged, because the attacker's cross-site request has no way to
  know or include that token.
  </details>

- How does content negotiation (`Accept` / `Content-Type`) let one endpoint serve both JSON and
  XML clients, and where does REST's "uniform interface" constraint show up in that?

  <details>
  <summary>Answer</summary>

  The server picks a response format based on the client's `Accept` header and labels it with
  `Content-Type` on the way back. This is "uniform interface" in action: one endpoint, standard
  negotiation, instead of separate endpoints per format.
  </details>

- Why does versioning an API in the URL path (rather than a header) make CDN and reverse-proxy
  routing easier — tying the REST/API-design subfolder to the performance subfolder?

  <details>
  <summary>Answer</summary>

  A reverse proxy can route purely on the URL path (`/v1/*` vs. `/v2/*` to different backend
  deployments) without needing to inspect headers — infrastructure-level routing is exactly what a
  CDN or proxy already does well.
  </details>

- A deployed static asset behind a CDN edge doesn't update for users after a fix ships. Chase the
  failure through: the origin's `Cache-Control` header, the CDN edge's behavior, and the browser's
  own cache — where's the most likely single point of failure?

  <details>
  <summary>Answer</summary>

  Most likely at the origin/CDN layer — either the origin's `Cache-Control` was set too
  aggressively, or the CDN was never told to purge/revalidate. The browser's own cache is
  downstream of whatever the CDN already served, so it's rarely the actual root cause.
  </details>

- Why does `PUT` being idempotent matter specifically for automatic retries, and how does that
  connect to why REST APIs favor semantically correct methods over routing everything through
  `POST`?

  <details>
  <summary>Answer</summary>

  `PUT` being idempotent means an automatic retry after a dropped connection is safe — repeating
  it doesn't change the outcome. That's exactly why REST APIs favor giving each action its
  semantically correct method instead of routing everything through `POST`, where an automatic
  retry could create a duplicate.
  </details>

- Explain, end to end, why a session cookie needs `HttpOnly`, `Secure`, and `SameSite` all
  together — what does each one specifically stop, and is any of the three redundant with another?

  <details>
  <summary>Answer</summary>

  `HttpOnly` stops JavaScript (including XSS-injected scripts) from reading the cookie; `Secure`
  stops it from ever being sent over plaintext HTTP; `SameSite` stops it from being attached to
  cross-site (CSRF-triggered) requests. None is redundant — each defends against a different
  attack vector (XSS-read, network-sniffing, CSRF-attach).
  </details>

- Why is HTTP/3's fix for head-of-line blocking about *where* reliability is implemented (TCP vs.
  QUIC per-stream), rather than just opening more parallel connections the way HTTP/1.1 workarounds
  did?

  <details>
  <summary>Answer</summary>

  Opening more parallel TCP connections just spreads the same per-connection head-of-line-blocking
  problem across more connections, still bounded by TCP's strict per-connection ordering. HTTP/3
  instead moves reliability to per-stream (QUIC), so a lost packet only stalls its own stream
  regardless of how many connections exist.
  </details>

- An API returns `422 Unprocessable Entity` instead of `400 Bad Request` for a well-formed request
  with semantically invalid data. Why is that the more correct choice — referencing both the
  status-codes and API-design subfolders?

  <details>
  <summary>Answer</summary>

  `422` says "I understood your request perfectly, but the data itself is invalid" (e.g. a
  malformed email address); `400` says the request itself couldn't be parsed or understood.
  Returning the more specific `422` lets client code and monitoring distinguish a validation
  failure from a genuinely malformed request.
  </details>

- Why does pagination style (offset vs. cursor) interact with caching — specifically, why is an
  offset-paginated response harder to cache correctly than a cursor-paginated one under concurrent
  writes?

  <details>
  <summary>Answer</summary>

  An offset-paginated response's correctness depends on nothing having shifted since the offset
  was computed — not guaranteed under concurrent writes, so caching it risks serving stale or
  incorrect pages. A cursor encodes a stable position relative to actual data, so the same cursor
  reliably returns the same "next" page regardless of concurrent writes, making it safe to cache.
  </details>
