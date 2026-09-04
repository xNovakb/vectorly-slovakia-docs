---
sidebar_position: 1
title: Viewing & Editing
---

# Viewing & Editing

## Viewing a whole file

```bash
cat file.txt          # dump the entire file to the terminal
```

Fine for short files; unusable for anything long — it just floods the screen with no way to scroll
back within the command itself.

## Viewing a long file — `less`

```bash
less docker-compose.yml
```

Opens the file in a scrollable pager, without loading the whole thing into memory or your
terminal's scrollback:

| Key | Does |
|---|---|
| `Space` / `b` | Page down / up |
| `/searchterm` | Search forward |
| `n` | Next search match |
| `q` | Quit |

`less` is the default choice for reading any file longer than a screen — including what `git log`,
`man`, and many other commands pipe their output through automatically.

## Viewing part of a file

```bash
head file.txt              # first 10 lines
head -n 50 file.txt           # first 50 lines
tail file.txt                  # last 10 lines
tail -n 50 file.txt              # last 50 lines
tail -f app.log                   # keep showing NEW lines as they're written — the standard way to watch a live log
```

`tail -f` is one of the most-used commands on a running server — it's how you watch a log file in
real time while reproducing an issue or watching a deploy happen.

## Editing — `nano`

```bash
nano file.txt
```

Beginner-friendly: the available commands are listed on-screen at the bottom the whole time
(`^O` = write out/save, `^X` = exit, `^` meaning Ctrl). Good default for a quick server-side edit.

## Editing — `vim`, just enough to survive it

`vim` is far more powerful but has a famously unforgiving learning curve — the bare minimum to not
get stuck:

```bash
vim file.txt
```

- Opens in **normal mode** (keys are commands, not text) — you are *not* typing text yet.
- Press `i` to enter **insert mode** (now you can actually type).
- Press `Esc` to get back to normal mode.
- Type `:wq` + `Enter` to save and quit. `:q!` to quit **without** saving (discard changes).

```text
Esc  →  :wq  →  Enter        (save and quit)
Esc  →  :q!  →  Enter          (quit, discard changes)
```

Worth knowing even if you prefer `nano`, because `vim` (or `vi`) is what you'll land in by default
on almost any minimal Linux install — e.g. `git commit` without `-m` opens your configured editor,
often `vim` by default.

## Which one to reach for

- Quick look at a short file → `cat`
- Anything longer, or you just want to read/search → `less`
- Watching a log update live → `tail -f`
- A quick edit, no strong preference → `nano`
- Already comfortable with `vim`, or it's what's already open → `vim`
