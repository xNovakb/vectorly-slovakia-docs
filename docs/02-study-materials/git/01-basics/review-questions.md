---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- How does the "three states" model from [What Is Git](./what-is-git.md) map onto the
  staging/commit steps from [Core Workflow](./core-workflow.md)?

  <details>
  <summary>Answer</summary>

  Working directory is the file as edited on disk; the staging area is what `git add` has queued
  (Core Workflow's staging step); committed is what `git commit` saves into history — Core
  Workflow is literally moving a file through those three states.
  </details>

- You set `user.email` globally, then run `git config user.email work@company.com` inside one
  specific repo. Which email does that repo's commits use?

  <details>
  <summary>Answer</summary>

  The local repo-specific value overrides the global one — only within that repo.
  </details>

- Why does adding a file to `.gitignore` after it's already committed do nothing, tying back to
  what Git actually tracks?

  <details>
  <summary>Answer</summary>

  `.gitignore` only prevents Git from starting to track a currently-untracked file; an
  already-tracked file needs to be explicitly untracked first with `git rm --cached`.
  </details>

- Why can `git log` and `git diff` between old commits work with no network connection, given
  Git's distributed nature?

  <details>
  <summary>Answer</summary>

  Because a clone already contains the full history locally — no need to contact a server to
  browse commits you already have on disk.
  </details>

- What relationship does `git status` show, in terms of the three pointers Core Workflow
  describes?

  <details>
  <summary>Answer</summary>

  It reports the diff between the working directory, the index (staging area), and HEAD.
  </details>
