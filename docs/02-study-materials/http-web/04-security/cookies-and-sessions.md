---
sidebar_position: 2
title: Cookies & Sessions
---

# Cookies & Sessions

HTTP itself has no memory between requests (see [What Is HTTP](../01-basics/what-is-http.md)) —
cookies are the mechanism that makes "staying logged in" possible, built entirely on top of plain
headers.

## How a cookie-based session actually works

```mermaid
sequenceDiagram
    participant Browser
    participant Server
    Browser->>Server: POST /login (username + password)
    Server-->>Browser: 200 OK, Set-Cookie: session=abc123; HttpOnly; Secure
    Note over Browser: browser stores the cookie
    Browser->>Server: GET /dashboard, Cookie: session=abc123
    Server->>Server: looks up session "abc123" -> user is Jane
    Server-->>Browser: 200 OK, Jane's dashboard
```

The server never actually "remembers" the browser between requests — the browser sends the cookie
back on every subsequent request to that domain, and the server looks up what that cookie value
means (typically a session ID mapped to a user, stored server-side or in the token itself).

## Setting a cookie

```http
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
```

- **`HttpOnly`** — JavaScript (`document.cookie`) cannot read this cookie at all. Critical
  protection against XSS stealing a session token — see
  [CSRF & XSS Basics](./csrf-and-xss-basics.md).
- **`Secure`** — only ever sent over HTTPS, never plain HTTP. Should be set on essentially every
  cookie carrying anything sensitive.
- **`SameSite`** — controls whether the cookie is sent on cross-site requests:
  - `Strict` — never sent cross-site at all (most secure, can break some legitimate flows like
    clicking a link from an email that lands you already logged in).
  - `Lax` — sent on top-level navigation (clicking a link) but not on background cross-site
    requests (images, iframes) — the modern default in most browsers.
  - `None` — sent on every cross-site request (requires `Secure` to be set too) — needed for
    legitimate cross-site use cases, but removes a real layer of CSRF protection.
- **`Max-Age`** / **`Expires`** — how long the cookie persists. Omitted entirely, it's a *session
  cookie* — deleted when the browser closes.

:::warning
A cookie without `HttpOnly` is readable by any JavaScript running on the page — including an
attacker's script, if the page has an XSS vulnerability. Any cookie holding a session
token/credential should always set `HttpOnly`.
:::

## Session storage: server-side vs. token-based

Two different models for what the cookie actually contains:

- **Server-side session** — the cookie holds only an opaque ID (`session=abc123`); the actual
  user data lives in a server-side store (database, in-memory cache). The server looks it up on
  every request. Easy to revoke (just delete the server-side record) — the classic, simplest
  approach.
- **Token-based (e.g. JWT)** — the cookie (or an `Authorization` header) holds the actual signed
  data itself; the server verifies the signature instead of doing a lookup. Scales without a
  shared session store, but harder to revoke a single token before it naturally expires.

## Cookies vs. `localStorage`/`sessionStorage` for auth tokens

A common modern question: store an auth token in a cookie, or in browser `localStorage`? Cookies
with `HttpOnly` can't be read by JavaScript at all (safer against XSS stealing the token);
`localStorage` is readable by any script on the page (vulnerable to XSS, but sidesteps some CSRF
considerations since it's never automatically attached to requests the way cookies are). Neither
is a strictly universal answer — it's a real tradeoff between XSS and CSRF exposure, not a solved
question with one obviously correct choice.

## Check yourself

- Why does `HttpOnly` matter for a session cookie, specifically against what kind of attack?

  <details>
  <summary>Answer</summary>

  It stops JavaScript — including an attacker's script injected via XSS — from reading the cookie
  at all. It's the specific defense against XSS stealing a session token.
  </details>

- What's the practical difference between `SameSite=Strict`, `Lax`, and `None`?

  <details>
  <summary>Answer</summary>

  `Strict` never sends the cookie cross-site at all. `Lax` sends it on top-level navigation
  (clicking a link) but not on background cross-site requests. `None` sends it on every cross-site
  request (and requires `Secure`).
  </details>

- What's the tradeoff between a server-side session and a token-based (JWT) session, specifically
  around revoking access?

  <details>
  <summary>Answer</summary>

  A server-side session is easy to revoke — just delete the server-side record — but needs a
  shared session store. A token-based session scales without one, but can't be revoked before it
  naturally expires.
  </details>
