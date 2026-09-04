---
sidebar_position: 2
title: Managing Processes
---

# Managing Processes

## Listing what's running

```bash
ps aux              # every process on the system, one line each
ps aux | grep node    # filter to just processes matching "node" (see Pipes & Redirection)
```

```text title="Reading `ps aux` output"
USER   PID  %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
deploy 4821  0.2  1.4 812340 58020 ?        Sl   09:14   0:12 node server.js
```

`PID` is what you'll need to target it with `kill`; `%CPU`/`%MEM` are the first thing worth
checking on a server that "feels slow."

## Live view: `top` / `htop`

```bash
top          # built-in on virtually every Linux system
htop          # nicer interface, often needs installing (see Package Management)
```

Both refresh continuously, sorted by CPU usage by default — the fastest way to answer "what's
actually eating resources right now" on a server that's struggling.

## Killing a process

```bash
kill 4821          # ask process 4821 to terminate gracefully (SIGTERM)
kill -9 4821         # force-kill it immediately (SIGKILL), no cleanup allowed
```

`kill` sends a **signal**, not a direct "stop now" command — plain `kill` (SIGTERM) asks the
process to shut down cleanly (close files, finish a request, save state), which well-behaved
programs handle. `-9` (SIGKILL) can't be caught or ignored by the process at all — the kernel just
ends it, no chance to clean up.

:::warning
Reach for `kill -9` only after a plain `kill` doesn't work. A database or app killed with `-9`
mid-write can leave corrupted state behind, because it never got the chance to finish or roll back
what it was doing.
:::

## Killing by name instead of PID

```bash
pkill node             # kill every process whose name matches "node"
killall node             # similar, slightly different matching rules by distro
```

Convenient, but be specific — `pkill node` on a server running multiple unrelated Node processes
kills all of them, not just the one you meant.

## Checking a specific service

For anything managed by systemd (see
[systemd & Services](../06-practical-shell/systemd-and-services.md)) — including Docker itself —
`systemctl status` is usually more informative than hunting for its PID manually:

```bash
systemctl status docker
```
