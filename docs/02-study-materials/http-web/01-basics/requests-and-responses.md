---
sidebar_position: 2
title: Requests & Responses
---

# Requests & Responses

Every HTTP message — request or response — has the same three-part shape: a start line, headers,
and an optional body.

## Anatomy of a request

```text
GET /articles/42?lang=en HTTP/1.1        <- request line: method, path (+ query), HTTP version
Host: example.com                          <- headers: key-value metadata
User-Agent: curl/8.4.0
Accept: application/json

                                              <- blank line separates headers from body
{"filter": "recent"}                          <- body (optional — often absent on GET)
```

- **Method** — what kind of action this is (`GET`, `POST`, etc. — covered in
  [HTTP Methods](../02-methods-and-semantics/http-methods.md)).
- **Path** — which resource on the server, plus an optional query string (`?lang=en`).
- **Headers** — metadata about the request: who's asking (`User-Agent`), what format they'll
  accept (`Accept`), authentication (`Authorization`), and more — see
  [Common Headers](../03-headers-and-content/common-headers.md).
- **Body** — the actual data being sent, if any. Common on `POST`/`PUT`, rare on `GET`.

## Anatomy of a response

```text
HTTP/1.1 200 OK                              <- status line: version, status code, reason phrase
Content-Type: application/json                 <- headers
Content-Length: 27

{"id": 42, "title": "Hello"}                     <- body
```

- **Status code** — a three-digit number classifying the outcome (see
  [Status Codes](./status-codes.md)).
- **Headers** — metadata about the response: what format the body is in (`Content-Type`), how
  long it is, caching instructions (see
  [Caching & ETags](../03-headers-and-content/caching-and-etags.md)).
- **Body** — the actual content: HTML, JSON, an image, whatever was requested. Not every response
  has one — a `204 No Content` or a `HEAD` response's body is empty by definition.

## Seeing this for real

```bash
curl -v https://example.com
```

`-v` prints the actual request and response headers exchanged — the single best way to make this
concrete instead of theoretical. Lines starting with `>` are what your client sent, `<` is what
the server sent back:

```text
> GET / HTTP/1.1
> Host: example.com
> Accept: */*
>
< HTTP/1.1 200 OK
< Content-Type: text/html
<
```

## Request vs. response headers aren't the same set

Some headers only make sense on one side — `User-Agent` (who's asking) only appears on requests;
`Content-Length`/`Set-Cookie` (describing what's being sent back) only appear on responses.
Others, like `Content-Type`, appear on both, describing the body in *that* particular message.

## Why the body is separate from headers

Headers describe the message; the body *is* the message's actual payload. Keeping them distinct
(separated by that blank line) is what lets a server or proxy read and act on headers — routing,
auth checks, content negotiation — without having to parse or even fully receive the body first.
