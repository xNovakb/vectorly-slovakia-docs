---
sidebar_position: 3
title: Background & Jobs
---

# Background & Jobs

By default, a command you run **blocks** your shell until it finishes — you can't type another
command until it's done. Sometimes that's wrong: a long-running server process, or something you
want to keep running after you disconnect.

## Running something in the background

```bash
long-task.sh &        # trailing & backgrounds it immediately
```

```bash
jobs                    # list background jobs started from this shell session
fg %1                     # bring job 1 back to the foreground
bg %1                       # resume a stopped job in the background
```

`Ctrl+Z` suspends (pauses, doesn't kill) whatever's running in the foreground — `bg` then resumes
it in the background from where it was paused.

## The problem: background jobs die when you disconnect

A plain `&` background job is still a **child** of your shell (see
[What Is a Process](./what-is-a-process.md)) — when your SSH session ends, the shell exits, and by
default its children get a `SIGHUP` (hangup) signal and die too. Not what you want for something
meant to keep running after you log off.

## `nohup` — survive a hangup

```bash
nohup long-task.sh &
```

`nohup` makes the process ignore the `SIGHUP` signal specifically — it keeps running after you
disconnect. Output that would normally print to your terminal gets redirected to a file
(`nohup.out` by default) since there's no terminal left to print to.

## `disown` — detach a job that's already running

```bash
long-task.sh &
disown %1        # remove job 1 from this shell's job table — it survives the shell exiting
```

## `tmux` / `screen` — persistent sessions (the better answer)

Both `nohup` and `disown` only solve "keep this one command running." `tmux` and `screen` solve a
broader problem: a whole **persistent terminal session** that keeps running on the server whether
or not you're connected to it.

```bash
tmux new -s deploy        # start a new named session
# ...work normally, run multiple commands, even multiple panes...
# Ctrl+B then D            <- detach, session keeps running
```

```bash
tmux attach -t deploy       # reconnect to it later — even after closing your laptop entirely
tmux ls                        # list all sessions currently running
```

This is the practical answer to "I want to start something long-running over SSH and not worry
about my connection dropping" — genuinely a full shell that persists on the server, not just one
detached process.

## When to use which

| Need | Tool |
|---|---|
| One quick command, don't want to wait | `&` |
| One command that must survive disconnect | `nohup ... &` |
| An interactive session (multiple commands, want to check back in) | `tmux`/`screen` |
