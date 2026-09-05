---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- You `git fetch` and see `origin/main` has new commits, but you haven't pulled yet. Has your
  working directory changed at all?

  <details>
  <summary>Answer</summary>

  No — `fetch` only updates your local record of the remote; nothing changes in your working
  directory until you actually merge or rebase (e.g. via `pull`).
  </details>

- In the fork-based PR model, which remote name do you push your feature branch to, and which do
  you fetch upstream changes from?

  <details>
  <summary>Answer</summary>

  You push to `origin` (your fork); you fetch/merge from `upstream` (the original repo).
  </details>

- After `git push -u origin feature/login`, what allows a plain `git push` on that branch to work
  without specifying origin/branch again?

  <details>
  <summary>Answer</summary>

  The tracking relationship set up by `-u` — the local branch now knows which remote branch it
  corresponds to.
  </details>

- Does opening a PR require any special Git command beyond a normal push?

  <details>
  <summary>Answer</summary>

  No — pushing the branch is a plain Git operation; the PR itself is created afterward through the
  hosting platform's UI, since PRs aren't a Git concept.
  </details>

- Which workflow model (from Git Workflow Models) does this org's PR process, described here,
  actually correspond to?

  <details>
  <summary>Answer</summary>

  The shared-repo model with a `main`/`develop`/`feature` branch structure, closest to a
  lightweight GitFlow.
  </details>
