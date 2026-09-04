---
sidebar_position: 2
title: Searching
---

# Searching

Two different kinds of "search" you'll reach for constantly: searching **inside** files for text
(`grep`), and searching the filesystem for files **by name/attribute** (`find`).

## `grep` — search inside files

```bash
grep "error" app.log                  # lines containing "error"
grep -i "error" app.log                 # case-insensitive
grep -r "TODO" src/                       # recursive, search every file under src/
grep -n "error" app.log                     # show line numbers
grep -v "debug" app.log                       # invert match: lines that DON'T contain "debug"
grep -c "error" app.log                         # just count matching lines, don't print them
```

```bash
grep -E "error|warning" app.log      # -E enables extended regex, so | means "or"
```

Real example — filtering a container's logs down to just the interesting lines:

```bash
docker logs docs-app 2>&1 | grep -i error
```

## `find` — search for files

```bash
find . -name "*.md"                    # every .md file, recursively, from the current directory
find /opt -name "docker-compose.yml"     # search a specific directory tree
find . -type d -name "node_modules"        # find directories (not files) named node_modules
find . -mtime -1                             # files modified in the last 1 day
find . -size +10M                              # files larger than 10 MB
```

`find` recurses into subdirectories by default — the key difference from a plain `ls *.md`
wildcard (see [Navigating & Files](../01-basics/navigating-and-files.md#wildcards)), which only
matches within one directory.

## Combining `find` with an action

```bash
find . -name "*.log" -delete                          # delete every matching file
find . -name "*.tmp" -exec rm {} \;                       # same idea, more general form
```

`-exec ... {} \;` runs the given command once per matched file, with `{}` substituted for that
file's path — more flexible than `-delete` since it can run *any* command, not just delete.

## grep vs. find, at a glance

| | Searches | Answers |
|---|---|---|
| `grep` | Contents of files | "Which lines mention X?" |
| `find` | The filesystem itself | "Which files are named/sized/dated X?" |

They combine well: find a set of files, then grep inside them —

```bash
find . -name "*.log" -exec grep -l "OutOfMemoryError" {} \;
```

...lists every `.log` file that contains that string.
