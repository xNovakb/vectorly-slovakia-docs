---
sidebar_position: 5
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- An SSH config alias points at a server with a specific `IdentityFile`. What does that alias
  actually save you from typing about key auth every time?

  <details>
  <summary>Answer</summary>

  Both the key selection (`-i path/to/key`) and any other per-connection flags (port, user) get
  bundled into one name — you type `ssh alias-name` instead of the full command with `-i`.
  </details>

- `-L` local port forwarding and a passphrase-protected private key both add a layer between "have
  the credential" and "get access." What's actually different about what each one protects
  against?

  <details>
  <summary>Answer</summary>

  A passphrase protects against a leaked private key file being usable without also knowing the
  passphrase; `-L` forwarding doesn't protect a credential at all — it exposes a normally
  unreachable remote service locally, assuming you're already authenticated.
  </details>

- Why would `ProxyJump` combined with key-based auth be safer than password auth through a
  bastion host?

  <details>
  <summary>Answer</summary>

  Password auth is phishable, brute-forceable, and often disabled entirely on production servers;
  key auth proves identity cryptographically instead, and `ProxyJump` just automates the routing
  through the bastion without weakening that authentication.
  </details>

- If a deploy key is passphrase-less (so CI can use it unattended), what compensates for the
  weaker protection that would otherwise create?

  <details>
  <summary>Answer</summary>

  Scoping it narrowly — one key, one purpose (e.g. only the deploy pipeline), rather than reusing
  a broad personal key that could do much more damage if it leaked.
  </details>

- Could you use `-D` (SOCKS proxy) instead of `-L` to reach one specific remote database port?
  Would it work, and would it be the better tool for that job?

  <details>
  <summary>Answer</summary>

  It would work — `-D` routes all traffic through the remote server, which includes reaching that
  one port. But `-L` is the better tool: it's scoped to exactly the one port/destination needed,
  rather than routing everything through the tunnel.
  </details>
