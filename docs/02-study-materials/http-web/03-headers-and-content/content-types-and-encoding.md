---
sidebar_position: 2
title: Content Types & Encoding
---

# Content Types & Encoding

## MIME types

A **MIME type** (also called media type) is the standardized `type/subtype` label a
`Content-Type` header carries — it's what tells the receiving side what kind of data the bytes
represent.

```text
text/html
text/plain
application/json
application/pdf
image/png
image/jpeg
application/octet-stream          — "arbitrary binary data, no more specific type known"
multipart/form-data                — a request body made of multiple distinct parts (e.g. a file upload alongside form fields)
```

Browsers use this to decide how to handle a response — `text/html` gets rendered as a page,
`application/pdf` opens a PDF viewer, `application/octet-stream` typically triggers a download
dialog since the browser doesn't know what else to do with it.

## Charset

```http
Content-Type: text/html; charset=utf-8
```

Text content also needs to specify *character encoding* — how bytes map to actual characters.
Getting this wrong is exactly how "mojibake" (garbled text like `Ã©` instead of `é`) happens: the
bytes are correct, but the receiving side decoded them assuming the wrong charset. `utf-8` is the
overwhelming default for anything written today; a missing or wrong `charset` is almost always the
cause when non-ASCII text renders as garbage.

## `Accept` — content negotiation

The client can state what formats it's willing to accept, and the server picks accordingly:

```http
Accept: application/json
Accept: text/html, application/xhtml+xml, */*;q=0.8
```

The `;q=0.8` is a quality value — when multiple types are listed, it ranks preference (1.0 =
most preferred, default if omitted). A server that can respond in multiple formats (e.g. an API
that supports both JSON and XML) uses this header to decide which to actually send back, and
should return `406 Not Acceptable` if it truly can't satisfy any listed format.

## Encoding vs. compression — a different kind of "encoding"

Don't confuse *character* encoding (`charset`) with *transfer* encoding — `Content-Encoding:
gzip` describes compression applied to the body, unrelated to what characters it represents. Both
happen to use the word "encoding" but answer completely different questions:
[Compression & Minification](../06-performance-and-protocol-evolution/compression-and-minification.md)
covers the compression kind specifically.

## A practical debugging habit

When a response looks wrong (garbled text, a browser refusing to render something, a client
failing to parse a body), checking `Content-Type` (and `charset` for text) with `curl -I` is
often faster than looking anywhere else first — a large share of "the API is broken" bugs are
actually a mislabeled or missing `Content-Type`.
