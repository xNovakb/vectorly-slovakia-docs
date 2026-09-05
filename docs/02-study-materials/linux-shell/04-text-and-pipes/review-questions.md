---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [Pipes & Redirection](./pipes-and-redirection.md)'s `ps aux | grep node` and [Searching](./searching.md)'s
  `grep -r "TODO" src/` both use `grep`, but feed it input two different ways. What's the
  difference?

  <details>
  <summary>Answer</summary>

  The piped version feeds `grep` text arriving from another command's stdout; the `-r` version has
  `grep` open and read files itself directly from disk — same tool, two different input sources.
  </details>

- `docker logs docs-app 2>&1 | grep -i error | tee errors-found.txt` from [Pipes &
  Redirection](./pipes-and-redirection.md) combines redirection order and a pipeline. Why must
  `2>&1` come immediately after the command rather than after the whole pipeline?

  <details>
  <summary>Answer</summary>

  `2>&1` redirects stderr to wherever stdout is *currently* going at the point it's evaluated —
  placed right after the command, stdout is still headed to the pipe, so stderr joins it there;
  placed later it would have nothing meaningful left to attach to for that command's own streams.
  </details>

- [Viewing & Editing](./viewing-and-editing.md) recommends `less` over `cat` for long files. Why
  does that same reasoning make `less` the better choice for `find`'s output in
  [Searching](./searching.md) when a search matches hundreds of files?

  <details>
  <summary>Answer</summary>

  `cat`-style unbounded output floods the terminal with no way to scroll back within the command;
  piping a long `find` result into `less` gives a scrollable, searchable view instead, the same
  advantage `less` has over `cat` for a long file.
  </details>

- Why does `find . -name "*.tmp" -exec rm {} \;` from [Searching](./searching.md) risk more damage
  than `find . -name "*.tmp" -delete`, given [Navigating & Files](../01-basics/navigating-and-files.md)'s
  warning about `rm -rf`?

  <details>
  <summary>Answer</summary>

  It doesn't inherently risk more than `-delete` for this exact pattern, but `-exec ... {} \;`
  generalizes to running *any* command per matched file — a typo or overly broad `-name` pattern
  combined with a destructive `-exec` command (like `rm -rf {}`) can delete far more than intended,
  the same "double-check before it runs" risk as a bare `rm -rf`.
  </details>

- `find . -name "*.log" -exec grep -l "OutOfMemoryError" {} \;` from [Searching](./searching.md)
  combines both tools from this subfolder. Which one is answering "which files," and which is
  answering "which lines"?

  <details>
  <summary>Answer</summary>

  `find` answers "which files" (matched by name); `grep -l` (inside `-exec`) answers "which of
  those files contain a given string" — `find` narrows by filesystem attributes first, `grep`
  narrows by content second.
  </details>

- Why does `command > output.txt` from [Pipes & Redirection](./pipes-and-redirection.md) still
  print errors to your screen even though you redirected its output?

  <details>
  <summary>Answer</summary>

  `>` only redirects stdout; stderr is a separate stream that keeps going to the terminal unless
  it's explicitly redirected too (with `2>&1` or a similar construct).
  </details>
