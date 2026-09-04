---
sidebar_position: 4
title: Worktrees
---

# Worktrees

Normally, one clone = one checked-out branch at a time; switching branches means `git switch` and
your working directory changes underneath you. `git worktree` lets you check out **multiple
branches at once**, each in its own separate folder, all sharing the same underlying repo/history.

## Why

Common case: you're mid-way through a feature (uncommitted changes you don't want to stash) and
need to urgently check out `main` to reproduce a bug, without disturbing your in-progress work.

```bash
git worktree add ../project-hotfix main
```

This creates a new folder `../project-hotfix`, checked out to `main`, as a full working directory
— separate from your current one, but still part of the same repo (same `.git` history, same
remotes, same objects).

```bash
cd ../project-hotfix
# fix the bug on main here, completely isolated from your other working directory
git commit -m "fix: urgent null check"
git push origin main
```

Meanwhile your original folder still has your feature branch's uncommitted changes untouched.

## Creating a worktree for a new branch

```bash
git worktree add ../project-experiment -b experiment/new-idea
```

## Listing and removing worktrees

```bash
git worktree list
git worktree remove ../project-hotfix       # once done with it
```

A worktree folder deleted by hand (instead of `git worktree remove`) leaves stale metadata behind
— clean it up with:

```bash
git worktree prune
```

## Worktrees vs. stash vs. just cloning again

| | Worktree | `git stash` | Second `git clone` |
|---|---|---|---|
| Shares history/objects with original | Yes | Yes (same repo) | No — fully separate copy |
| Keeps uncommitted work untouched | Yes | Moves it aside | Yes, but duplicates the whole `.git` |
| Disk usage | Low (shares objects) | None extra | Full second copy |

Worktrees are the more efficient version of "just clone it again into another folder" — same
benefit (two working directories at once), without duplicating the entire repo's history on disk.
