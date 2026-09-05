---
sidebar_position: 3
title: Query Params vs. Request Body
---

# Query Params vs. Request Body

Two different places data can travel with a request — where it belongs isn't just a style
preference, each has real, different constraints.

## Query parameters

```
GET /articles?category=tech&sort=recent&page=2
```

Appended to the URL after `?`, `key=value` pairs joined with `&`. Part of the URL itself.

- Visible in browser history, server access logs, and any tool that logs URLs — **never** put
  secrets or sensitive data here (an API key or password in a query string ends up logged in
  plaintext in far more places than a body ever would).
- Has practical length limits (varies by browser/server, but URLs can't grow unbounded).
- Naturally fits `GET` requests, which conventionally have no body at all — see
  [HTTP Methods](./http-methods.md).
- Bookmarkable and shareable, since it's part of the URL — this is a feature, not just a
  limitation, for things like search/filter state.

## Request body

```http
POST /articles HTTP/1.1
Content-Type: application/json

{"title": "Hello World", "category": "tech"}
```

- Not part of the URL — doesn't show up in browser history or typical access logs the same way.
- No practical size limit the protocol itself imposes (servers/frameworks set their own limits).
- Standard for `POST`/`PUT`/`PATCH` — sending the actual data being created/updated.
- Not bookmarkable — the data only exists for that one request.

## A rule of thumb

| Use... | For |
|---|---|
| Query params | Filtering, sorting, pagination, search terms — anything that identifies *which* resource(s) you want |
| Request body | The actual data being created or updated |
| Path segments | Identifying *one specific* resource (`/users/42`, not `/users?id=42`) |

```bash
# identifying a resource: path segment
GET /users/42

# filtering a collection: query params
GET /users?role=admin&active=true

# creating/updating data: body
POST /users
Content-Type: application/json

{"name": "Jane", "role": "admin"}
```

:::warning
Never send credentials, tokens, or any sensitive value as a query parameter. Beyond logging
exposure, a URL with a token in it can leak via the `Referer` header when a page with that URL
navigates to a third-party site, or via browser autocomplete/history sync — none of which apply to
a request body.
:::

## Path segment vs. query param — a common judgment call

`GET /users/42` (path) vs. `GET /users?id=42` (query) both technically work — the convention is:
use a path segment when it identifies *one specific resource*, and a query param when it's
filtering/modifying *a collection*. This distinction matters more once designing a real API — see
[Designing a Good API](../05-rest-and-api-design/designing-a-good-api.md).

## Check yourself

- Why should you never put a secret or token in a query parameter, beyond it just "looking bad" in
  the URL?

  <details>
  <summary>Answer</summary>

  Query params show up in browser history, server access logs, and any tool that logs URLs — a
  secret there ends up in plaintext in far more places than a body ever would. It can also leak
  via the `Referer` header when the page navigates elsewhere.
  </details>

- When do you choose a path segment over a query param for identifying something?

  <details>
  <summary>Answer</summary>

  A path segment when it identifies one specific resource (`/users/42`); a query param when
  filtering or modifying a collection (`/users?role=admin`).
  </details>

- Name one property a request body has that query params don't, and one property query params
  have that a request body doesn't.

  <details>
  <summary>Answer</summary>

  A body has no practical protocol-imposed size limit and isn't bookmarkable. Query params are
  bookmarkable/shareable as part of the URL, but have practical length limits.
  </details>
