---
sidebar_position: 1
title: What Is Git
---

# What Is Git

Git is a **version control system (VCS)**: it records the history of a project's files over time,
so you can see what changed, who changed it, and roll back if needed.

## Snapshots, not diffs

A common misconception is that Git stores a list of file *diffs* (patches). It doesn't — every
commit is a **full snapshot** of the entire project at that point in time. If a file didn't
change between two commits, Git just points both commits at the same stored file instead of
copying it again. This is why commits are cheap and why operations like checking out an old
commit are fast — Git isn't replaying a chain of patches, it's just handing you a saved snapshot.

## Distributed, not centralized

Older tools like SVN or CVS keep one central copy of history on a server; your local machine only
has the current files. Git is **distributed**: every clone contains the *entire* history, not just
the latest snapshot.

```bash
git clone https://github.com/example/project.git
```

After this, you have:
- every commit ever made,
- every branch and tag,
- the full history — all on your own disk, no network needed to browse it.

This is why `git log`, `git diff` between old commits, and switching branches all work offline.

## Why this matters day to day

- You can commit, branch, and inspect history with no network connection — you only need one when
  you `push`/`pull`/`fetch` to sync with others.
- Losing the server doesn't lose history — any clone can restore it.
- Branching is cheap (a branch is just a movable pointer to a commit), which is why Git-based
  workflows lean so heavily on branches — see [Branches](../02-branching-merging/branches.md).

## The three states of a file

Git tracks a file as being in one of three states, which becomes important once you start
committing:

| State | Meaning |
|---|---|
| **Working directory** | The file as it sits on disk, possibly edited |
| **Staging area (index)** | Changes you've marked with `git add`, ready to be committed |
| **Committed** | Changes saved into the project history |

The next page, [Installation & Config](./installation-config.md), gets you set up to actually try
this; [Core Workflow](./core-workflow.md) walks through moving a file through these three states.

## Check yourself

- Why does Git store commits as snapshots rather than diffs, and what practical benefit does that
  give?

  <details>
  <summary>Answer</summary>

  Every commit is a full snapshot — an unchanged file just points at the same stored blob as
  before instead of being copied again. This is why commits are cheap and checking out an old
  commit is fast: Git hands you a saved snapshot instead of replaying a chain of patches.
  </details>

- What does "distributed" mean for Git specifically, contrasted with SVN/CVS?

  <details>
  <summary>Answer</summary>

  Every clone contains the entire history — every commit, branch, and tag — not just the latest
  snapshot. SVN/CVS keep the real history on a central server; your local machine only has the
  current files.
  </details>

- Name the three states a file can be in, and which command moves it from the first to the
  second.

  <details>
  <summary>Answer</summary>

  Working directory, staging area (index), and committed. `git add` moves a file from the working
  directory into the staging area.
  </details>

- Why can you `git log` and switch branches with no network connection?

  <details>
  <summary>Answer</summary>

  Your clone already holds the full history locally — a network connection is only needed to sync
  with others via push/pull/fetch.
  </details>
