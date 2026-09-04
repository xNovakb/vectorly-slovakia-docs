---
sidebar_position: 1
title: Environment Variables & PATH
---

# Environment Variables & PATH

An **environment variable** is a named value available to a process and everything it starts —
configuration passed in from outside the program itself, rather than hardcoded.

## Setting and reading

```bash
export API_KEY="abc123"        # set it for this shell session and anything it launches
echo $API_KEY                    # read it
env                                # list every environment variable currently set
```

`export` matters — a plain `API_KEY="abc123"` (no `export`) only exists inside the current shell,
invisible to any program it launches. `export` is what makes it part of the environment those
child processes inherit.

## `$PATH` — how the shell finds commands

```bash
echo $PATH
# /usr/local/bin:/usr/bin:/bin:/home/deploy/.local/bin
```

A colon-separated list of directories. When you type `docker`, the shell searches each of these
directories **in order** until it finds an executable named `docker` — this is why installing
something can leave you with "command not found" if it wasn't placed somewhere on `$PATH`.

```bash
which docker              # shows exactly which file on $PATH will actually run
```

Adding a new directory (e.g. after installing something to a nonstandard location):

```bash
export PATH="$HOME/.local/bin:$PATH"
```

Prepending (`$HOME/.local/bin:$PATH`, new path first) means that directory is searched **before**
the existing ones — useful when you specifically want your own version of a tool to take priority
over a system-installed one with the same name.

## Making it permanent

Anything set with plain `export` in a terminal only lasts for that session — closing the terminal
loses it. To persist it, add the `export` line to a shell startup file:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
```

## `.bashrc` vs. `.bash_profile`

A common point of confusion:

- **`.bashrc`** — runs for every new **interactive** shell (e.g. every new terminal window/tab, or
  every new SSH session).
- **`.bash_profile`** (or `.profile`) — runs specifically for a **login** shell (e.g. the very
  first shell after logging in, before any terminal multiplexer or sub-shell).

In practice, most setups just source `.bashrc` from `.bash_profile` so everything ends up in one
place regardless of which technically fires — but knowing the distinction explains why a variable
set in the "wrong" file sometimes doesn't show up where expected (e.g. missing in a `tmux` pane
that only ran `.bashrc`, not the full login sequence).

## Environment variables in CI/CD

The same mechanism is exactly how secrets get into a deploy pipeline without being committed to
the repo — see
[`/internal-operations/git-workflow`](/internal-operations/git-workflow) for how this org's GitHub
Actions workflow uses environment variables/secrets to hold the SSH deploy key rather than
hardcoding it into any script.
