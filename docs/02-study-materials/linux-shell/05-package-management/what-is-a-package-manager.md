---
sidebar_position: 1
title: What Is a Package Manager
---

# What Is a Package Manager

A **package manager** installs, updates, and removes software, and — critically — resolves and
installs whatever *else* that software depends on automatically, instead of you tracking that by
hand.

## What it actually solves

Without one, installing something means manually finding the right binary for your exact OS/CPU
architecture, figuring out every library it depends on, installing those too, and repeating that
recursively for their dependencies. A package manager turns that into:

```bash
sudo apt install docker.io
```

...and it works out the dependency graph, downloads everything needed, and puts it all in the
right place.

## Distro-level vs. language-level package managers

Easy to conflate — this section covers the **distro-level** kind (installing system software), not
the **language-level** kind you already know from other contexts:

| Level | Examples | Installs |
|---|---|---|
| Distro | `apt` (Debian/Ubuntu), `dnf` (Fedora/RHEL) | System packages: `docker`, `nginx`, `git`, `curl` itself |
| Language | `npm`, `pip`, `cargo` | Libraries for one specific project, in that project's own scope |

Both matter, but they're independent — `npm install` doesn't touch system packages, and `apt`
doesn't touch a Node project's `node_modules`.

## Repositories

A package manager doesn't search the whole internet — it looks in configured **repositories**
(repos), lists of available packages and where to download them from, defined in files like
`/etc/apt/sources.list` (Debian/Ubuntu) or `/etc/yum.repos.d/` (Fedora/RHEL). Adding a third-party
repository (e.g. Docker's official one) is how you get software newer than what your distro ships
by default.

## Why this matters for this org's server

The VPS this org's sites run on is Fedora/Ubuntu-based (see
[`/internal-operations/server-architecture`](/internal-operations/server-architecture)) — meaning
[`apt` or `dnf`](./apt-and-dnf.md) is how Docker itself, along with any other system-level tooling,
actually got installed and gets kept up to date on that machine.
