---
sidebar_position: 2
title: Stash
---

# Stash

`git stash` shelves your uncommitted changes (both staged and unstaged) so your working directory
goes back to matching the last commit — without actually committing anything. Useful when you need
to switch branches but aren't ready to commit what you're mid-way through.

## Basic use

```bash
git stash              # shelve current changes
# working directory is now clean...
git switch main
# ... do something else ...
git switch feature/login
git stash pop           # bring the changes back and remove them from the stash list
```

`git stash pop` applies the most recent stash and deletes it from the stash list. Use
`git stash apply` instead if you want to apply it but **keep** it in the list too (e.g. to apply
the same stash to more than one branch).

## Naming and listing stashes

Stashes stack — you can have several at once, so name them if you'll have more than one around:

```bash
git stash push -m "WIP: login form validation"
git stash list
# stash@{0}: On feature/login: WIP: login form validation
# stash@{1}: On main: WIP: quick debug logging
git stash pop stash@{1}      # pop a specific one, not just the latest
```

## Stashing only part of your changes

```bash
git stash push -p     # interactively choose which hunks to stash, like `git add -p`
```

## Dropping a stash without applying it

```bash
git stash drop stash@{0}
git stash clear         # remove all stashes
```

## Stash vs. a WIP commit

Both let you "save and come back later" — the difference is scope and visibility:

| | Stash | WIP commit |
|---|---|---|
| Shows in `git log` | No | Yes (until you clean it up) |
| Survives a `git clone` / gets pushed | No — stashes are local only | Yes, once pushed |
| Good for | A quick branch-switch detour | Work you want backed up remotely, or plan to `rebase -i --fixup` into a real commit later |

Rule of thumb: stash for a five-minute interruption, commit (even messily, to be squashed later —
see [Squash & Rebase](../05-conventions/squash-and-rebase.md)) for anything you'd be upset to lose
if your laptop died.
