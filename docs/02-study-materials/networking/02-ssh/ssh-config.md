---
sidebar_position: 3
title: SSH Config
---

# SSH Config

Typing `ssh -i ~/.ssh/deploy_key -p 2222 deploy@203.0.113.42` every time gets old fast.
`~/.ssh/config` lets you name that whole thing once and reuse it.

## Basic host aliases

```text title="~/.ssh/config"
Host docs-server
    HostName docs.vectorly-slovakia.sk
    User deploy
    IdentityFile ~/.ssh/id_ed25519
```

Now:

```bash
ssh docs-server
```

...connects with all of those settings applied. This is exactly the pattern behind the
`github-docs` SSH alias mentioned in this repo's own docs — see
[`/internal-operations/git-workflow`](/internal-operations/git-workflow) for how it's used with a
dedicated deploy key.

## Multiple keys for multiple services

A common need: a personal key for GitHub, a different key for a specific server.

```text title="~/.ssh/config"
Host github.com
    IdentityFile ~/.ssh/id_ed25519_personal

Host github-docs
    HostName github.com
    User git
    IdentityFile ~/.ssh/vectorly_docs_key

Host prod-vps
    HostName 203.0.113.42
    User deploy
    IdentityFile ~/.ssh/id_ed25519_deploy
```

`github-docs` here is a **fake hostname** that only exists in your SSH config — it points
`HostName` at the real `github.com` but forces a specific key, letting you have two different
GitHub identities (e.g. personal vs. a repo-specific deploy key) without them colliding.

```bash
git clone git@github-docs:example/vectorly-docs.git   # uses the vectorly_docs_key, not your personal one
```

## Jump hosts / bastions

If a server is only reachable through another machine (a bastion host), `ProxyJump` chains the
connection automatically instead of manually SSH-ing twice:

```text title="~/.ssh/config"
Host internal-db
    HostName 10.0.0.15
    User admin
    ProxyJump bastion

Host bastion
    HostName 203.0.113.10
    User jump-user
```

```bash
ssh internal-db      # transparently hops through `bastion` first
```

## Other useful options

```text
Host *
    ServerAliveInterval 60     # keep idle connections from timing out
    AddKeysToAgent yes          # auto-load keys into ssh-agent on first use
```

`Host *` applies to every connection — good for defaults you always want, layered under more
specific `Host` blocks above it.

## Check yourself

- `github-docs` in an SSH config points `HostName` at the real `github.com`. What problem does
  that fake hostname trick actually solve?

  <details>
  <summary>Answer</summary>

  It lets you force a specific key (e.g. a repo-specific deploy key) for one GitHub identity while
  keeping your personal key as the default for `github.com` itself — two identities without them
  colliding.
  </details>

- What does `ProxyJump` save you from doing manually?

  <details>
  <summary>Answer</summary>

  Manually SSH-ing into a bastion host first and then SSH-ing again from there to the internal
  target — `ProxyJump` chains that automatically in one command.
  </details>

- Where should a `Host *` block sit relative to more specific `Host` blocks, and why?

  <details>
  <summary>Answer</summary>

  It applies to every connection, so it acts as a set of defaults layered underneath the more
  specific blocks — a specific `Host` block's own settings take precedence for that host.
  </details>

