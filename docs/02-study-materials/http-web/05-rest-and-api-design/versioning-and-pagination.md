---
sidebar_position: 3
title: Versioning & Pagination
---

# Versioning & Pagination

Two problems every API eventually faces: how to change shape without breaking existing clients,
and how to return large collections without sending everything at once.

## API versioning strategies

```text
URL path:      GET /v1/users/42            — most visible, easiest to understand, clutters the URL
Header:        GET /users/42
               Accept: application/vnd.example.v1+json
Query param:   GET /users/42?version=1       — least common, easy to accidentally omit
```

**URL-path versioning** (`/v1/...`) is the most widely used in practice — not because it's
architecturally "purest" (arguably it isn't — the resource `/users/42` conceptually shouldn't
change identity just because the API version changed), but because it's immediately visible,
trivially routable at the infrastructure level (a reverse proxy can route `/v1/*` and `/v2/*` to
entirely different backend deployments — see
[Reverse Proxies](/study-materials/networking/web-serving/reverse-proxies) in the Networking
topic), and easy for any client developer to understand at a glance.

## When to actually bump a version

Not every change needs one — a genuinely useful rule of thumb:

```text
Does NOT need a new version:
  - Adding a new optional field to a response
  - Adding a new endpoint
  - Adding a new optional request parameter

DOES need a new version (breaking change):
  - Removing or renaming a field
  - Changing a field's type or meaning
  - Changing required parameters
  - Changing the URL structure itself
```

Versioning aggressively for every small change fragments an API into many barely-different
versions clients have to track; versioning too rarely means an unavoidable breaking change has
nowhere to go without breaking every existing integration at once. Reserve a version bump for
genuine breaking changes.

## Pagination — offset-based

```http
GET /articles?limit=20&offset=40
```

```json
{"data": [...], "meta": {"total": 342, "limit": 20, "offset": 40}}
```

Simple, supports jumping to an arbitrary page (`offset=200` for "page 11"), but has a real
correctness problem: if a record is inserted or deleted between two paginated requests, the
`offset` shifts under you — a client can see the same item twice, or skip one entirely, while
paging through results that are actively changing.

## Pagination — cursor-based

```http
GET /articles?limit=20&cursor=eyJpZCI6NDJ9
```

```json
{"data": [...], "meta": {"next_cursor": "eyJpZCI6NjJ9", "has_more": true}}
```

The cursor encodes a stable position (typically the last-seen item's ID or sort key) rather than a
raw numeric offset — inserting or deleting records elsewhere in the collection doesn't shift
what "next" means relative to where the client already was. Can't jump to an arbitrary page
number, only "next"/"previous" from where you are — a real tradeoff, not a strictly better
replacement for offset pagination.

## Which to use

| | Offset | Cursor |
|---|---|---|
| Jump to arbitrary page | Yes | No, sequential only |
| Correct under concurrent inserts/deletes | No | Yes |
| Implementation complexity | Simple | Slightly more involved |
| Common for | Admin UIs with page numbers | Infinite-scroll feeds, high-write-volume data |

A collection that changes frequently while being paginated (a social feed, a live log stream) is
the clearest case for cursor-based pagination; a mostly-static admin table with a page-number UI
is a reasonable place for offset pagination's simplicity to win.
