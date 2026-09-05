---
sidebar_position: 3
title: Status Codes
---

# Status Codes

Every HTTP response carries a three-digit **status code** summarizing what happened. The first
digit tells you the *class* of outcome before you even need to know the specific number.

## The five classes

| Range | Class | Meaning |
|---|---|---|
| 1xx | Informational | Request received, still processing — rarely seen directly in app code |
| 2xx | Success | The request worked |
| 3xx | Redirection | Go look somewhere else |
| 4xx | Client error | The request itself was wrong |
| 5xx | Server error | The request was fine, the server failed to handle it |

That first digit alone is often enough to decide how to react — "is this a 2xx" is a valid and
common check even without caring about the exact code.

## The ones actually worth memorizing

```text
200 OK                     — standard success
201 Created                — success, and a new resource now exists (POST that created something)
204 No Content              — success, deliberately no body (e.g. a successful DELETE)

301 Moved Permanently        — this resource now lives at a new URL, permanently, update your links
302 Found                     — temporary redirect, don't update bookmarks/links
304 Not Modified               — "you already have the latest version" (see Caching & ETags)

400 Bad Request                 — the request itself is malformed/invalid
401 Unauthorized                  — you need to authenticate (despite the name, this is about
                                     identity, not permission)
403 Forbidden                      — you ARE authenticated, but not allowed to do this
404 Not Found                       — no resource at this path
409 Conflict                         — the request conflicts with the resource's current state
                                        (e.g. a duplicate create)
422 Unprocessable Entity               — well-formed request, but semantically invalid data

500 Internal Server Error                — generic "something broke" on the server
502 Bad Gateway                            — a reverse proxy got an invalid response from the
                                             backend it's forwarding to
503 Service Unavailable                      — server temporarily can't handle the request
                                                (overloaded, down for maintenance)
504 Gateway Timeout                            — a reverse proxy's backend didn't respond in time
```

:::note
`401` vs. `403` is a common mix-up: **401** means "I don't know who you are" (no valid credentials
provided at all); **403** means "I know who you are, and you're not allowed." A logged-out user
hitting a protected page should get 401; a logged-in user without the right role hitting an
admin-only page should get 403.
:::

## 502 vs. 504 — a genuinely useful distinction

Both point at a problem between a reverse proxy and its backend (see
[Reverse Proxies](/study-materials/networking/web-serving/reverse-proxies) in the Networking
topic), but differently:

- **502** — the proxy got a response, but it was garbage/invalid — usually means the backend
  crashed or returned something malformed.
- **504** — the proxy got *no* response in time — the backend is either down, or just too slow.

Seeing one over the other narrows down where to look first when debugging a deployed app.

## Checking what a real endpoint returns

```bash
curl -o /dev/null -s -w "%{http_code}\n" https://example.com
curl -I https://example.com          # headers only, includes the status line
```

## Check yourself

- What single check ("is this a 2xx") often suffices without knowing the exact code — why does
  that work?

  <details>
  <summary>Answer</summary>

  Because the first digit alone classifies the outcome (success, redirect, client error, server
  error) — often enough to decide how to react without needing the exact code.
  </details>

- What's the actual difference between `401` and `403`?

  <details>
  <summary>Answer</summary>

  `401` means "I don't know who you are" — no valid credentials were provided at all. `403` means
  "I know who you are, and you're not allowed to do this."
  </details>

- What's the difference between `502` and `504`, and what does each tell you about where to look
  first when debugging?

  <details>
  <summary>Answer</summary>

  `502` means the proxy got a response, but it was invalid or garbage — usually the backend
  crashed or misbehaved. `504` means the proxy got no response in time at all — the backend is
  either down or too slow. One points at "what came back," the other at "nothing came back."
  </details>

- Which status class means "the request itself was wrong," and which means "the request was fine
  but the server failed"?

  <details>
  <summary>Answer</summary>

  `4xx` means the request itself was wrong; `5xx` means the request was fine but the server failed
  to handle it.
  </details>
