---
sidebar_position: 3
title: Core Workflow
---

# Core Workflow

This is the loop you'll run dozens of times a day: edit files, stage what you want to save, commit
it, repeat.

## Starting a repository

```bash
git init                                    # start tracking a new project
# or
git clone git@github.com:example/project.git   # get an existing one
```

## The staging area

The staging area (a.k.a. "the index") is a middle step between your working directory and a
commit. It lets you build a commit out of *some* of your changes, not necessarily everything
you've touched.

```bash
git status              # what's changed, what's staged
git add file.txt         # stage one file
git add src/             # stage a whole folder
git add -A                # stage everything (new, modified, deleted)
git add -p                 # stage interactively, hunk by hunk — great for splitting one big edit into two clean commits
```

## Committing

```bash
git commit -m "Add login form validation"
```

This takes whatever is **staged** (not your whole working directory) and saves it as a new
snapshot in history. Anything you edited but didn't `git add` stays out of the commit.

## Inspecting history

```bash
git log                       # full history
git log --oneline             # one line per commit, compact
git log --oneline --graph     # + ASCII branch graph
git diff                      # unstaged changes vs last commit
git diff --staged             # staged changes vs last commit
git show <commit-hash>        # full diff of one commit
```

## A typical sequence

```bash
# edit some files...
git status                          # see what changed
git add src/login.ts                # stage just this file
git diff --staged                   # sanity-check what you're about to commit
git commit -m "fix: validate empty password on login"
git log --oneline -5                # confirm it landed
```

## Working tree vs. index vs. HEAD

Three pointers, worth keeping straight because later topics (`reset`, `restore`, `checkout` — see
[Undoing Changes](../04-history-and-fixes/undoing-changes.md)) are really just different ways of
moving data between them:

- **Working directory** — the files as they sit on disk right now.
- **Index / staging area** — what `git add` has queued up for the next commit.
- **HEAD** — a pointer to the last commit on your current branch.

`git status` is, in effect, a diff report between all three.
