---
sidebar_position: 4
title: Reflog & Recovery
---

# Reflog & Recovery

Git almost never actually deletes a commit the moment you "lose" it — a bad `reset --hard`, a
rebase gone wrong, deleting a branch too early. The commit object usually still exists on disk; you
just no longer have a pointer (branch/tag) aimed at it. `git reflog` is the tool for finding it
again.

## What reflog tracks

The reflog is a local log of everywhere `HEAD` has pointed, in order — every commit, checkout,
rebase step, and reset, for roughly the last 90 days by default.

```bash
git reflog
# a1b2c3d HEAD@{0}: reset: moving to HEAD~1
# f4e5d6c HEAD@{1}: commit: fix login validation bug
# 9h8g7f6 HEAD@{2}: checkout: moving from main to feature/login
```

## Recovering after a bad `reset --hard`

```bash
git reset --hard HEAD~1    # oops — meant to undo staging, not lose the whole commit
git reflog
# f4e5d6c HEAD@{1}: commit: fix login validation bug   <- there it is
git reset --hard f4e5d6c    # restore to that commit
```

## Recovering a deleted branch

Deleting a branch doesn't delete its commits, only the pointer:

```bash
git branch -D feature/login          # oops, wasn't actually merged
git reflog | grep feature/login       # find a commit that was on it
# or just find the last commit hash you remember from `git log` history / PR link
git switch -c feature/login f4e5d6c    # recreate the branch at that commit
```

## Recovering after a rebase that went wrong

```bash
git rebase -i HEAD~5    # something got squashed/dropped by mistake
git reflog
# ...
# 9h8g7f6 HEAD@{6}: rebase (start): checkout HEAD~5    <- state right before the rebase started
git reset --hard 9h8g7f6
```

## Dangling commits

A commit with nothing pointing at it is "dangling." Reflog is the easiest way to find one by
context, but you can also list them directly:

```bash
git fsck --lost-found
```

## The safety net's limits

Reflog is **local only** — it isn't pushed, isn't in your clone if you clone fresh, and entries do
eventually expire (default ~90 days, configurable via `gc.reflogExpire`). It's a great "I made a
mistake five minutes ago" tool, not permanent storage.

## Check yourself

- When you "lose" a commit (bad reset, botched rebase, deleted branch), is the commit object
  usually actually gone?

  <details>
  <summary>Answer</summary>

  Usually not — the commit object typically still exists on disk, you just no longer have a
  pointer (branch/tag) aimed at it. `git reflog` helps find it again.
  </details>

- Is the reflog pushed to the remote or included in a fresh clone?

  <details>
  <summary>Answer</summary>

  No — it's local only; it isn't pushed and a fresh clone won't have it, and entries eventually
  expire (default ~90 days).
  </details>

- After deleting a branch by mistake with `git branch -D`, how do you get it back?

  <details>
  <summary>Answer</summary>

  Find its last commit via `git reflog` (or a remembered hash/PR link) and recreate the branch
  there with `git switch -c <name> <hash>`.
  </details>
