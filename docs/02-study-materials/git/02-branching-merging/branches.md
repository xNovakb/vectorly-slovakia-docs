---
sidebar_position: 1
title: Branches
---

# Branches

A branch is just a **movable pointer to a commit**. `main` isn't special to Git internally — it's
a pointer like any other, it just happens to be the conventional default.

## Creating and switching

```bash
git branch feature/login          # create a branch (doesn't switch to it)
git switch feature/login           # switch to it
# or in one step:
git switch -c feature/login        # create + switch
```

`git checkout` does the same job as `git switch` (and more) — `switch`/`restore` were split out of
`checkout` in newer Git specifically to make each command's intent clearer.  You'll see both in
the wild; `switch` for changing branches is the more modern, less ambiguous choice.

```bash
git branch                # list local branches, * marks current
git branch -a              # + remote-tracking branches
git branch -d feature/login   # delete a branch (only if merged)
git branch -D feature/login   # force-delete (even if not merged)
```

## What HEAD actually is

`HEAD` is a pointer to "whatever commit I currently have checked out" — normally that means it
points *at a branch*, which in turn points at a commit:

```
HEAD -> main -> commit a1b2c3d
```

When you `git switch other-branch`, HEAD moves to point at `other-branch` instead. When you
`git commit`, the *branch* HEAD points to moves forward to the new commit — HEAD itself doesn't
move, it just follows its branch along.

## Detached HEAD

If you check out a specific commit (not a branch), HEAD points directly at that commit instead of
at a branch:

```bash
git checkout a1b2c3d
# You are in 'detached HEAD' state...
```

You can look around and even make commits here, but nothing points at them once you switch away —
they become unreachable and eventually get garbage-collected. Fine for "let me just peek at old
code", risky if you meant to keep new work. If you commit something you want to keep while
detached:

```bash
git switch -c rescue-branch      # turns your detached commits into a real branch
```

## Naming conventions

Common pattern, not enforced by Git itself:

```
feature/short-description
fix/short-description
chore/short-description
```

Keep names short and hyphenated — they show up in URLs, CI job names, and `git log --graph`
output where long names get cramped.
