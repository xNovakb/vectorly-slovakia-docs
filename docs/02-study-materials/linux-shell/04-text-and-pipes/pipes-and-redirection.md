---
sidebar_position: 3
title: Pipes & Redirection
---

# Pipes & Redirection

The idea that makes the shell genuinely powerful: small, single-purpose commands, chained
together, each doing one simple thing to the output of the last.

## Pipes (`|`) — feed one command's output into another

```bash
ps aux | grep node
```

`ps aux` lists every process; `|` sends that entire output as **input** to `grep node`, which
filters it down to matching lines. Neither command needs to know about the other — `grep` doesn't
care that its input came from `ps`, it just reads whatever text arrives.

```bash
cat access.log | grep "500" | wc -l
```

Three commands chained: `cat` prints the file, `grep "500"` filters to lines containing "500"
(e.g. HTTP 500 errors), `wc -l` counts the resulting lines. Reads left to right as a pipeline of
transformations.

## Redirection (`>`, `>>`) — send output to a file instead of the screen

```bash
echo "hello" > file.txt          # write "hello" to file.txt, OVERWRITING anything already there
echo "world" >> file.txt          # append "world" to file.txt, keeping existing content
ls -la > listing.txt                # save command output to a file instead of printing it
```

:::warning
`>` truncates the target file first, unconditionally — `command > file.txt` where `file.txt`
already has content you wanted **destroys** it before writing anything new. Use `>>` when you mean
"add to," not "replace."
:::

## Input redirection (`<`) — feed a file in as input

```bash
mysql mydb < backup.sql        # feed backup.sql's contents in as input to the mysql command
```

Less common day-to-day than `>`/`>>`/`|`, but shows up whenever a command's input is meant to come
from a file rather than being typed or piped.

## Combining stdout and stderr

Commands have two separate output streams: **stdout** (normal output) and **stderr** (errors).
Plain `>` only redirects stdout — errors still print to your screen:

```bash
command > output.txt              # stdout to file, stderr still shown on screen
command > output.txt 2>&1          # BOTH stdout and stderr redirected to the file
command 2>&1 | grep error            # merge them, THEN pipe the combined stream to grep
```

`2>&1` reads as "redirect stream 2 (stderr) to wherever stream 1 (stdout) is currently going" —
order matters: it has to come *after* the `>` that sets stdout's destination, or it redirects
stderr to the terminal instead of following stdout.

## A realistic combined example

```bash
docker logs docs-app 2>&1 | grep -i error | tee errors-found.txt
```

Grabs a container's logs (both streams), filters to error lines, and `tee` both prints them to
your screen **and** saves them to a file — useful when you want to see something live but also
keep a record of it.
