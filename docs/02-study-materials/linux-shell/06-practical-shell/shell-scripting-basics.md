---
sidebar_position: 2
title: Shell Scripting Basics
---

# Shell Scripting Basics

A shell script is just a text file of the same commands you'd type interactively, run all at once.
Nothing about it is a separate language you have to learn from scratch — it's bash, saved to a
file.

## The shebang

```bash title="deploy.sh"
#!/bin/bash

echo "Starting deploy..."
```

`#!/bin/bash` (the "shebang") on the very first line tells the system which interpreter should run
this file — without it, running the script directly might use the wrong shell, or fail entirely
depending on how it's invoked.

## Making it executable and running it

```bash
chmod +x deploy.sh     # see File Permissions — adds execute permission
./deploy.sh              # run it (the ./ is required unless it's on $PATH)
# or, without making it executable at all:
bash deploy.sh
```

## Variables

```bash
NAME="deploy"
echo "Hello, $NAME"
echo "Hello, ${NAME}!"      # braces avoid ambiguity when text follows immediately
```

No spaces around `=` — `NAME = "deploy"` (with spaces) is a syntax error in bash, not just a style
issue.

## Command-line arguments

```bash title="greet.sh"
#!/bin/bash
echo "First argument: $1"
echo "All arguments: $@"
echo "Number of arguments: $#"
```

```bash
./greet.sh hello world
# First argument: hello
# All arguments: hello world
# Number of arguments: 2
```

## Conditionals

```bash
if [ -f "docker-compose.yml" ]; then
    echo "Found it"
else
    echo "Missing docker-compose.yml"
    exit 1
fi
```

`-f` tests "is this a regular file that exists" — other common tests: `-d` (directory exists),
`-z` (string is empty), `-eq`/`-ne` (numeric equal/not-equal).

## Checking if a command succeeded

```bash
docker compose up -d --build
if [ $? -ne 0 ]; then
    echo "Deploy failed"
    exit 1
fi
```

`$?` holds the exit code of the previous command (see
[What Is a Process](../03-processes/what-is-a-process.md)) — `0` means success. A shorter,
equivalent idiom:

```bash
docker compose up -d --build || { echo "Deploy failed"; exit 1; }
```

`||` runs the right side **only if** the left side failed (nonzero exit code) — `&&` is the
opposite, running the right side only if the left side succeeded.

## Loops

```bash
for file in *.log; do
    echo "Processing $file"
done
```

## A realistic small script

```bash title="backup.sh"
#!/bin/bash
set -e    # exit immediately if any command fails, instead of continuing past an error

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y-%m-%d)

mkdir -p "$BACKUP_DIR"
docker exec docs-app tar czf - /opt/vectorly-docs > "$BACKUP_DIR/backup-$DATE.tar.gz"
echo "Backup saved to $BACKUP_DIR/backup-$DATE.tar.gz"
```

`set -e` is worth using in almost every real script — without it, a failed command partway through
still lets the rest of the script keep running against a state it didn't expect.
