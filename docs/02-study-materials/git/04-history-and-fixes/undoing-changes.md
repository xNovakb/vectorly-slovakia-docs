---
sidebar_position: 1
title: Undoing Changes
---

# Undoing Changes

Four commands that look similar but act at different levels — mixing them up is the #1 way people
lose work by accident. Picture the three states from
[Core Workflow](../01-basics/core-workflow.md): working directory → staging area → commit history.

## `git restore` — undo in working directory / staging area

Doesn't touch history at all. Safe for "I haven't committed yet."

```bash
git restore file.txt              # discard uncommitted changes in working directory (back to last commit)
git restore --staged file.txt      # unstage a file (keeps the edits, just removes from staging)
```

## `git checkout <commit> -- file` — pull an old version of one file

```bash
git checkout a1b2c3d -- file.txt   # restore file.txt to how it looked at that commit, stages it
```

Doesn't move your branch or HEAD — just brings one file's content back from history.

## `git reset` — move the branch pointer

Rewrites what your **current branch** points at. Three modes, increasingly destructive:

```bash
git reset --soft HEAD~1     # undo last commit, keep changes staged
git reset --mixed HEAD~1    # undo last commit, keep changes in working dir, unstaged (default mode)
git reset --hard HEAD~1     # undo last commit, DISCARD the changes entirely
```

`--hard` throws away uncommitted work with no confirmation — always `git status`/`git diff` first
to make sure nothing you care about is sitting there uncommitted.

**Never `reset` a commit that's already been pushed and pulled by someone else** — it rewrites
history out from under them, same danger as rebasing shared commits (see
[Rebasing](../02-branching-merging/rebasing.md)).

## `git revert` — undo by adding a new commit

```bash
git revert a1b2c3d
```

Creates a **new** commit that applies the inverse of the given commit. History isn't rewritten —
it grows forward with an "undo" commit. This is the safe choice for undoing something already
pushed/shared, because it doesn't change any existing commit hash.

## Which one do I want?

| Situation | Command |
|---|---|
| Discard uncommitted edits | `git restore file.txt` |
| Undo `git add` | `git restore --staged file.txt` |
| Undo my last local commit, not pushed yet | `git reset --soft HEAD~1` |
| Undo a commit already pushed/shared | `git revert <commit>` |
| Get one file back from an old commit | `git checkout <commit> -- file.txt` |

If you did use `--hard` by mistake and lost something, [Reflog & Recovery](./reflog-recovery.md)
is often your way back.
