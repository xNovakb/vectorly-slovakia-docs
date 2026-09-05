---
sidebar_position: 1
title: Remotes
---

# Remotes

A remote is just a named URL pointing at another copy of the repo — usually one hosted on
GitHub/GitLab.

```bash
git remote -v                                        # list remotes
git remote add origin git@github.com:example/project.git
```

`origin` is the conventional name for "the main remote you cloned from" — nothing forces that
name, it's just what `git clone` sets up automatically.

## Fetch vs. pull

```bash
git fetch origin       # download new commits/branches from origin, don't touch your working files
git pull origin main     # fetch + merge (or rebase) into your current branch, in one step
```

`fetch` is always safe — it only updates your local record of what the remote has, it never
changes your working directory. `pull` = `fetch` + integrate, so it *can* create a merge commit or
conflict. When in doubt, `fetch` first and look at what changed (`git log origin/main`) before
deciding how to integrate it.

```bash
git pull --rebase origin main    # fetch + rebase instead of merge — keeps history linear
```

## Pushing

```bash
git push origin feature/login             # push a branch to origin
git push -u origin feature/login           # + set up tracking, so future `git push` alone knows where to go
```

After `-u` once, plain `git push` / `git pull` on that branch know which remote branch to talk to.

## Tracking branches

A local branch can be linked to a remote branch it "tracks" — `git status` then tells you if
you're ahead/behind:

```bash
git branch -vv                # shows tracking info per branch
# feature/login  a1b2c3d [origin/feature/login: ahead 2] Add validation
```

## `origin` vs. `upstream`

Shows up in the **fork workflow** (see [Pull / Merge Requests](./pull-requests.md)): when you fork
someone else's repo, `origin` conventionally points at *your* fork, and you add a second remote
named `upstream` pointing at the original repo, so you can pull in its latest changes:

```bash
git remote add upstream git@github.com:original-owner/project.git
git fetch upstream
git merge upstream/main       # bring upstream's changes into your local main
```

## Renaming or removing a remote

```bash
git remote rename origin old-origin
git remote remove old-origin
```

## Check yourself

- Why is `git fetch` always safe but `git pull` isn't necessarily?

  <details>
  <summary>Answer</summary>

  `fetch` only updates your local record of what the remote has and never touches your working
  directory; `pull` is fetch + integrate, which can create a merge commit or a conflict.
  </details>

- After `git push -u origin feature/login` once, what changes about future `git push`/`git pull`
  on that branch?

  <details>
  <summary>Answer</summary>

  They no longer need the remote/branch name specified — the branch now tracks that remote branch
  automatically.
  </details>

- In the fork workflow, what do `origin` and `upstream` conventionally point to?

  <details>
  <summary>Answer</summary>

  `origin` points at your own fork; `upstream` points at the original repo you forked from, so you
  can pull in its latest changes.
  </details>
