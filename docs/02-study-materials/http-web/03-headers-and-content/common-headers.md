---
sidebar_position: 1
title: Common Headers
---

# Common Headers

Headers are key-value metadata attached to a request or response — dozens exist, but a small set
accounts for the vast majority of what you'll actually read or set.

## Request headers worth knowing

```text
Host: example.com                      — which site, when one server hosts multiple domains
                                          (see Reverse Proxies in the Networking topic)
User-Agent: Mozilla/5.0 ...              — identifies the client software making the request
Accept: application/json                  — what content type(s) the client can handle back
Authorization: Bearer eyJhbGc...            — credentials (a token, typically)
Content-Type: application/json               — format of THIS request's body, if it has one
Cookie: session=abc123                         — cookies previously set by this server
```

## Response headers worth knowing

```text
Content-Type: application/json           — format of the response body
Content-Length: 1524                       — size of the body in bytes
Set-Cookie: session=abc123; HttpOnly        — asks the client to store a cookie (see Cookies & Sessions)
Cache-Control: max-age=3600                   — caching instructions (see Caching & ETags)
Location: /articles/42                          — where to go, on a redirect or after a 201 Created
Access-Control-Allow-Origin: https://app.com      — CORS permission (see Same-Origin & CORS)
```

## `Content-Type` — probably the single most important header

Tells the receiving side how to interpret the body's bytes. Get it wrong and a perfectly valid
body gets misread:

```http
Content-Type: application/json
Content-Type: text/html; charset=utf-8
Content-Type: multipart/form-data; boundary=----abc123
Content-Type: application/x-www-form-urlencoded
```

A server sending JSON but declaring `Content-Type: text/plain` will often cause a client (or
browser dev tools) to display it as raw text instead of parsing it — the bytes on the wire are
identical, only the *label* is wrong, but that label is what everything downstream trusts.

## Seeing headers for real

```bash
curl -v https://example.com 2>&1 | grep -E "^[<>]"
curl -I https://example.com          # response headers only, no body
```

```bash
# sending a custom header
curl -H "Authorization: Bearer abc123" https://api.example.com/me
```

## Case-insensitivity and repeated headers

Header **names** are case-insensitive (`Content-Type` and `content-type` are the same header) —
values usually aren't. A header can also legally appear multiple times in one message (commonly
`Set-Cookie`, once per cookie being set) — code reading headers needs to handle that, not assume
exactly one value per name.
