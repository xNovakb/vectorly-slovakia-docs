---
sidebar_position: 1
title: What Is a Shell
---

# What Is a Shell

A **shell** is a program that reads commands you type and asks the operating system to run them.
It's the layer between you and the OS kernel — you don't touch the kernel directly, you talk to a
shell, which talks to the kernel on your behalf.

```mermaid
graph LR
    You[You, typing] --> Shell[Shell — e.g. bash]
    Shell --> Kernel[Linux kernel]
    Kernel --> Hardware[CPU, disk, network...]
```

## Shell vs. terminal vs. OS

Easy to conflate, genuinely different things:

- **Terminal** — the window/app you type into (e.g. GNOME Terminal, Windows Terminal, iTerm). Just
  displays text in and out; does nothing on its own.
- **Shell** — the program running *inside* that terminal that actually interprets what you type
  (`bash`, `zsh`, `sh`). This is what actually parses `ls -la` and decides what to do with it.
- **OS / kernel** — what the shell asks to actually do the work (open a file, list a directory,
  start a process).

You can run a shell without a terminal (a script executed by `cron`, or the shell GitHub Actions
uses to run each step of a workflow) — "shell" and "terminal" aren't the same thing even though
they're almost always seen together.

## bash specifically

**bash** (Bourne Again SHell) is the default shell on most Linux distributions, including the
Fedora/Ubuntu-based VPS this org's server runs (see
[`/internal-operations/server-architecture`](/internal-operations/server-architecture)). Nearly
everything in this section assumes bash unless stated otherwise — `zsh` (macOS default since
Catalina) is close enough in everyday use that almost all of it transfers directly.

## Interactive vs. script mode

The same shell runs two ways:

```bash
# interactive — you type a command, see the result, type the next one
$ ls
$ cd /opt/vectorly-docs

# script — a file of commands run all at once, no human in the loop
#!/bin/bash
cd /opt/vectorly-docs
docker compose up -d --build
```

[Shell Scripting Basics](../06-practical-shell/shell-scripting-basics.md) covers writing the
second kind.

## The prompt

```
deploy@docs-server:/opt/vectorly-docs$
```

Reading it: `deploy` (logged-in user) `@` `docs-server` (hostname) `:` `/opt/vectorly-docs`
(current directory) `$` (a regular user — `#` instead means you're root, see
[Sudo & Root](../02-permissions-and-users/sudo-and-root.md)).

## Where to go next

[The Filesystem](./the-filesystem.md) covers what that `/opt/vectorly-docs` path actually means;
[Navigating & Files](./navigating-and-files.md) covers moving around and manipulating what's
there.
