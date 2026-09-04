---
sidebar_position: 3
title: Navigating & Files
---

# Navigating & Files

The small set of commands you'll type more than anything else.

## Moving around

```bash
pwd                    # print current directory
cd /opt/vectorly-docs    # go to an absolute path
cd docs                  # go into a subfolder (relative)
cd ..                     # go up one level
cd -                       # jump back to the previous directory
cd                          # go home (~)
```

## Listing

```bash
ls                      # list current directory
ls -l                     # long format: permissions, owner, size, date
ls -la                     # long format + hidden files
ls -lh                      # long format with human-readable sizes (K/M/G instead of bytes)
ls /opt/vectorly-docs         # list a specific path without cd-ing into it
```

```text title="Reading `ls -l` output"
-rw-r--r--  1 deploy deploy  1.2K Sep 4 10:03 README.md
drwxr-xr-x  2 deploy deploy  4.0K Sep 4 10:03 docs
^         ^ ^ ^      ^       ^    ^            ^
type+perms | owner   group   size modified     name
           links
```

The leading character is `-` for a regular file, `d` for a directory — permission details covered
in [File Permissions](../02-permissions-and-users/file-permissions.md).

## Creating and removing

```bash
mkdir new-folder                 # create a directory
mkdir -p a/b/c                     # create nested directories, no error if parents don't exist yet
touch newfile.txt                   # create an empty file (or update its timestamp if it exists)
rm file.txt                          # remove a file
rm -r some-folder                     # remove a directory and everything in it, recursively
rm -rf some-folder                     # same, but never ask for confirmation
```

:::warning
`rm -rf` has no undo, no trash bin, no confirmation — it's gone the moment the command returns.
Double-check the path (especially after `cd`, where a stale assumption about your current
directory is the classic way this goes wrong) before running it, and never run it with a variable
that might be empty (`rm -rf $DIR/` when `$DIR` is unset expands to `rm -rf /`).
:::

## Copying and moving

```bash
cp file.txt backup.txt              # copy a file
cp -r folder/ backup-folder/          # copy a directory recursively
mv file.txt renamed.txt                # rename (mv is also how you rename — no separate "rename" command)
mv file.txt /opt/other-place/           # move to a different directory
```

## Wildcards

```bash
ls *.md               # every file ending in .md in the current directory
rm *.log                # remove every .log file
cp docs/*.md backup/      # copy every .md file from docs/ into backup/
```

`*` matches any sequence of characters within one path segment — it doesn't recurse into
subdirectories on its own (that needs `find`, covered in
[Searching](../04-text-and-pipes/searching.md)).

## A quick worked example

```bash
cd /opt/vectorly-docs
ls -la                        # see what's here, including hidden files
mkdir backups
cp docker-compose.yml backups/docker-compose.yml.bak
ls -lh backups/                # confirm it copied, check the size
```
