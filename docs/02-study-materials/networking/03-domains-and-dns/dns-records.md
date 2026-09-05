---
sidebar_position: 2
title: DNS Records
---

# DNS Records

A domain's DNS entries are a list of **records** — each one answers a specific type of question
about that domain.

## Common record types

| Type | Answers | Example |
|---|---|---|
| `A` | What IPv4 address does this hostname point to? | `docs.vectorly-slovakia.sk → 203.0.113.42` |
| `AAAA` | What IPv6 address? | `docs.vectorly-slovakia.sk → 2001:db8::1` |
| `CNAME` | This hostname is an alias for another hostname | `www.vectorly-slovakia.sk → vectorly-slovakia.sk` |
| `MX` | Which server handles email for this domain | `vectorly-slovakia.sk → mail.provider.com (priority 10)` |
| `TXT` | Arbitrary text — commonly domain verification, SPF/DKIM for email | `v=spf1 include:_spf.google.com ~all` |
| `NS` | Which nameservers are authoritative for this domain | `vectorly-slovakia.sk → ns1.provider.com` |

## `A` vs. `CNAME`

An `A` record points straight at an IP. A `CNAME` points at *another hostname*, which then gets
resolved itself — one more hop, but means you only ever have to update the IP in one place if it
changes.

```
A       docs.vectorly-slovakia.sk       → 203.0.113.42
CNAME   www.docs.vectorly-slovakia.sk   → docs.vectorly-slovakia.sk
```

:::note
A `CNAME` can't coexist with other records on the same exact name (e.g. can't have both a `CNAME`
and an `MX` on the bare domain) — this is a real DNS protocol rule, not a provider quirk, which is
why the bare/root domain (`example.com`, no subdomain) is almost always an `A` record, with
`CNAME`s reserved for subdomains like `www`.
:::

## TXT records for verification

Services (Google Workspace, GitHub Pages custom domains, SSL certificate issuers) commonly ask you
to add a `TXT` record with a specific value to prove you control the domain, before they'll act on
its behalf:

```
TXT   vectorly-slovakia.sk   "google-site-verification=abc123..."
```

## Subdomains

Each subdomain is its own record — `docs.vectorly-slovakia.sk` and `vectorly-slovakia.sk` can
point at entirely different servers:

```
A   vectorly-slovakia.sk            → 203.0.113.10   (marketing site)
A   docs.vectorly-slovakia.sk       → 203.0.113.42   (this docs site)
```

This is exactly why this org's docs site lives on its own subdomain rather than a path on the
main site — different server, different deploy pipeline, fully independent.

## Propagation

Changing a record doesn't take effect everywhere instantly — every resolver that cached the old
value keeps serving it until that record's TTL expires (see
[How DNS Works](./how-dns-works.md)). "It's not working yet" right after a DNS change is almost
always this, not a misconfiguration — give it time proportional to the old TTL before assuming
something's actually wrong.

## Check yourself

- Why can't a bare/root domain usually have a `CNAME` record, forcing it to use an `A` record
  instead?

  <details>
  <summary>Answer</summary>

  A `CNAME` can't coexist with other records on the same exact name (like an `MX` record a root
  domain usually needs) — a real DNS protocol rule, not a provider quirk.
  </details>

- `docs.vectorly-slovakia.sk` and `vectorly-slovakia.sk` point at different servers. What DNS fact
  makes that possible?

  <details>
  <summary>Answer</summary>

  Each subdomain is its own record — nothing forces subdomains of the same domain to point at the
  same server.
  </details>

- You just changed an `A` record and it "isn't working yet" ten seconds later. Is that necessarily
  a misconfiguration?

  <details>
  <summary>Answer</summary>

  No — resolvers that already cached the old value keep serving it until that record's TTL
  expires; give it time proportional to the old TTL before assuming something's wrong.
  </details>

