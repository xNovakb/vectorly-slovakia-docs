---
sidebar_position: 3
title: Troubleshooting Connectivity
---

# Troubleshooting Connectivity

"It doesn't work" almost always means one specific link in the
[chain](./deploying-a-static-site.md#the-full-chain) is broken. Test each link independently
instead of guessing at the whole thing.

## The toolkit

| Tool | Answers |
|---|---|
| `ping` | Is the host reachable at all, and how fast? |
| `dig` / `nslookup` | Does DNS resolve to the right IP? |
| `curl -v` | Does an actual HTTP(S) request succeed, and what does the server say? |
| `traceroute` / `tracert` | Where along the path does a connection stop? |
| `ss` / `netstat` | Is anything actually listening on the port I expect? |

## `ping` — is it there at all

```bash
ping docs.vectorly-slovakia.sk
```

Confirms basic reachability and DNS resolution together. Note: many servers deliberately block
`ping` (ICMP) for security reasons — no response doesn't always mean the server is down, just that
ICMP specifically is blocked. Don't stop here; move to the next tool.

## `dig` — is DNS the problem

```bash
dig docs.vectorly-slovakia.sk +short
```

Compare the returned IP against what you expect. Wrong or no IP → DNS problem (see
[How DNS Works](../03-domains-and-dns/how-dns-works.md)), not a server problem — no point
debugging the server yet.

## `curl -v` — is the actual request the problem

```bash
curl -v https://docs.vectorly-slovakia.sk
```

`-v` shows the full exchange: DNS resolution, TCP connect, TLS handshake, request headers,
response headers. Read it top to bottom — the *last* successful step tells you exactly where it
broke:

```text
*   Trying 203.0.113.42:443...
* Connected to docs.vectorly-slovakia.sk (203.0.113.42) port 443
* TLS handshake, Client hello (1):
...
> GET / HTTP/1.1
< HTTP/1.1 200 OK
```

Stops at "Trying..." with no "Connected" → nothing's listening / firewall blocking. Connects but
the TLS handshake fails → certificate problem (see [TLS & HTTPS](../04-web-serving/tls-https.md)).
Connects and completes TLS but gets a `502`/`504` → the reverse proxy is up but can't reach the
backend (see [Reverse Proxies](../04-web-serving/reverse-proxies.md)) — check the container is
actually running.

## `traceroute` — where does it stop

```bash
traceroute docs.vectorly-slovakia.sk     # Linux/macOS
tracert docs.vectorly-slovakia.sk         # Windows
```

Shows every router hop between you and the destination (see
[The Internet, in Brief](../01-basics/the-internet-in-brief.md)). Useful for "works from home,
not from the office" — the path differs, and the point where hops stop responding narrows down
whose network the block is in.

## `ss` — is anything actually listening (run **on** the server)

```bash
ssh docs-server "ss -tlnp"
```

If the port you expect isn't in the output at all, the app isn't running / crashed / bound to the
wrong interface (`127.0.0.1` only, not `0.0.0.0` — meaning it only accepts connections from
*inside* that machine) — a config problem in the app itself, not networking.

## Working from the client end inward

A reliable order: DNS → can I reach the IP at all → does TLS complete → does the proxy respond →
does the backend respond. Each step rules out an entire category of cause before you go looking
inside the app's own logs.
