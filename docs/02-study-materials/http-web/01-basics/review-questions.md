---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A response comes back with status `200` but the body is empty and there's no `Content-Length`
  header. What status code would make an empty body *expected* instead of suspicious, and why?

  <details>
  <summary>Answer</summary>

  `204 No Content` — success, deliberately with no body (e.g. a successful `DELETE`).
  </details>

- Where in the raw HTTP exchange does the status code live, and what part of the message structure
  determines it belongs to the response, not the request?

  <details>
  <summary>Answer</summary>

  It's part of the response's start line (the status line) — the first line of a response
  message, distinct from the request line that starts a request. A status code simply doesn't
  exist on the request side of the exchange.
  </details>

- A browser requests a page with `GET` and gets a `304` back. Does that break the "one response per
  request" model from [What Is HTTP](./what-is-http.md)? Why or why not?

  <details>
  <summary>Answer</summary>

  No — a `304` is still exactly one response to that one request. It just tells the client to
  reuse what it already has instead of resending the body.
  </details>

- HTTP is stateless, yet a `401` response implies the server cares about "who you are" at all. What
  resolves that apparent contradiction?

  <details>
  <summary>Answer</summary>

  HTTP itself stays stateless — a `401` doesn't mean the server remembers an ongoing
  "conversation," it just means whatever credentials (or lack of any) came with *this specific*
  request weren't valid. Identity is re-established per-request, not carried by the connection.
  </details>

- A client sends a request with no `Host` header on an HTTP/1.1 connection. Which status class
  would you expect back, and why does it fall in that class rather than a `5xx`?

  <details>
  <summary>Answer</summary>

  `4xx` (specifically `400 Bad Request`) — the request itself is malformed (a mandatory header is
  missing), not a failure on the server's part.
  </details>
