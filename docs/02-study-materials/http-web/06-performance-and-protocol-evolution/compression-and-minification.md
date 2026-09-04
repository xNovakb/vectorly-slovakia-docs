---
sidebar_position: 2
title: Compression & Minification
---

# Compression & Minification

Two different techniques that both shrink what goes over the wire, working at different levels.

## HTTP compression — `Content-Encoding`

The server compresses the response body; the browser decompresses it automatically before handing
it to the page — completely transparent to application code either side.

```http
Request:
Accept-Encoding: gzip, br, deflate

Response:
Content-Encoding: br
```

`Accept-Encoding` lists what the client can decompress; the server picks one it supports and sets
`Content-Encoding` on the response to say which it used.

```text
gzip      — the long-standing universal default, supported everywhere
br        — Brotli, generally better compression ratio than gzip, now widely supported
deflate   — older, rarely used by choice today
```

## What's worth compressing, and what isn't

```bash
curl -H "Accept-Encoding: gzip" -I https://example.com/app.js
curl -H "Accept-Encoding: gzip" -I https://example.com/photo.jpg
```

Text-based formats (HTML, CSS, JS, JSON) compress extremely well — often 60-80% smaller. Formats
that are **already compressed** (JPEG, PNG, most video/audio, `.zip`/`.gz` files themselves) barely
shrink further and sometimes get *slightly larger* after another compression pass — compressing
already-compressed data wastes CPU on both ends for no real benefit. Most web servers are
configured to skip compression for these content types automatically.

:::note
This is why compressing an already-`.gz`'d asset, or re-compressing a JPEG at the HTTP layer, is
pure waste — always check whether a format is already compressed before assuming HTTP compression
will help it.
:::

## Minification — a build-time technique, not a protocol feature

Distinct from HTTP compression: **minification** strips unnecessary characters from source code
(whitespace, comments, shortens variable names) *before* it's ever served — it happens at build
time, not per-request, and produces a smaller file that then *also* gets HTTP-compressed on top.

```js title="Before minification"
function calculateTotal(price, quantity) {
    // apply the discount if eligible
    return price * quantity;
}
```

```js title="After minification"
function calculateTotal(e,t){return e*t}
```

## Why both together, not either alone

```text
Original file:        100 KB
After minification:     60 KB   (build-time, one-time cost)
After gzip/brotli:       15 KB   (per-request, transparent, on top of the minified file)
```

Minification and compression solve overlapping but not identical problems — minification removes
bytes that are genuinely never needed by the runtime (comments, whitespace); compression exploits
statistical redundancy in whatever bytes remain. Doing both stacks their benefit; skipping
minification and relying on compression alone still ships noticeably more bytes, because gzip/br
compress repetitive patterns well but don't specifically understand "this whitespace is
semantically meaningless" the way a minifier does.
