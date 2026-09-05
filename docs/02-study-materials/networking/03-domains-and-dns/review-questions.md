---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- You just added an `A` record pointing a new subdomain at a server. `dig` from your own machine
  shows the right IP immediately, but a colleague says it's not resolving yet. Is that a
  contradiction?

  <details>
  <summary>Answer</summary>

  No — DNS propagation isn't instantaneous everywhere; your resolver may not have had the old
  value cached (or the TTL already expired for you), while your colleague's resolver is still
  serving a cached answer until its TTL runs out.
  </details>

- Why does the registrar/nameserver split from How DNS Works matter when you're the one adding the
  `A` record from DNS Records?

  <details>
  <summary>Answer</summary>

  The `A` record gets added at the nameservers (your DNS provider), not at the registrar — the
  registrar only controls which nameservers the domain points to, so you need to know which
  company actually hosts your DNS records before you can edit them.
  </details>

- A root domain needs both an `MX` record (for email) and to point somewhere for the website. Why
  can't the website part just use a `CNAME` to simplify updates?

  <details>
  <summary>Answer</summary>

  A `CNAME` can't coexist with other records (like `MX`) on the same exact name — the root domain
  has to use an `A` record for the website, reserving `CNAME` for subdomains that don't also need
  an `MX` on that same name.
  </details>

- If you set a record's TTL very low right before a migration, then raise it again afterward, what
  are you actually trading off at each stage?

  <details>
  <summary>Answer</summary>

  Low TTL before the change: faster propagation once you cut over, at the cost of more repeated
  queries hitting the nameserver. Raising it back afterward: less nameserver load, at the cost of
  slower propagation for the next change.
  </details>
