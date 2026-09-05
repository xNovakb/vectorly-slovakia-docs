---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [What Is a Shell](./what-is-a-shell.md) says the shell talks to the kernel on your behalf. Where
  does [The Filesystem](./the-filesystem.md)'s single rooted tree (`/`) fit into that — is it
  something the shell invents, or something the kernel exposes?

  <details>
  <summary>Answer</summary>

  The kernel maintains and exposes the single filesystem tree; the shell doesn't invent it, it
  just interprets paths you type and asks the kernel to resolve/act on them.
  </details>

- A relative path like `docs/README.md` behaves differently depending on one specific piece of
  shell state. Which one, and which command from [Navigating & Files](./navigating-and-files.md)
  reports it?

  <details>
  <summary>Answer</summary>

  The current working directory — `pwd` reports it, and every relative path is resolved starting
  from there.
  </details>

- Why does `ls *.md` only catch files in the current directory, while `find . -name "*.md"`
  (mentioned in Navigating & Files, covered fully later) recurses into subdirectories?

  <details>
  <summary>Answer</summary>

  `*` is a shell wildcard that matches within one path segment only — it never crosses a `/`;
  `find` is a program that walks the directory tree itself, so it naturally recurses.
  </details>

- You `cd /opt/vectorly-docs`, then a teammate says "check `~/.ssh`". Using what The Filesystem
  says about `~`, is that the same directory you just moved into?

  <details>
  <summary>Answer</summary>

  No — `~` always means your home directory (e.g. `/home/deploy`), regardless of what your current
  working directory happens to be after a `cd`.
  </details>

- Why is `rm -rf` specifically dangerous right after a `cd`, tying together what both pages say
  about relative paths and about hidden state?

  <details>
  <summary>Answer</summary>

  `rm -rf` takes a relative path at face value with no confirmation; if a `cd` changed the current
  directory to something other than what you assumed, that same relative path now points somewhere
  completely different — and the command still runs.
  </details>
