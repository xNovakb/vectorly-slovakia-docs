---
sidebar_position: 1
title: Review Questions
---

# Review Questions

Synthesis questions across the whole topic. Answer out loud, connecting subfolders — that's the
point of this page, not repeating any single page's own questions.

- Trace what happens end-to-end: you commit locally, rebase to squash your messy WIP commits,
  then squash-merge a PR into `develop`. At which of these steps do commit hashes actually
  change?

  <details>
  <summary>Answer</summary>

  The local rebase (replaying/squashing your own commits) changes hashes for those commits; the
  squash-merge itself creates one brand-new commit on `develop` combining everything — a second
  point where new hashes appear.
  </details>

- Why is "never rebase a shared branch" and "never `reset --hard` a pushed commit" fundamentally
  the same rule, stated for two different commands?

  <details>
  <summary>Answer</summary>

  Both operations rewrite what the branch's history looks like from a given point onward,
  invalidating commit hashes anyone else has already pulled — the danger is identical, just
  triggered by different commands.
  </details>

- A hotfix needs to land on both `develop` and an already-cut `release/2.3` branch, without
  merging all of develop's other in-progress work into the release. Which tool solves this, and
  why not just merge?

  <details>
  <summary>Answer</summary>

  `git cherry-pick` — it copies just the one fix commit, whereas a full merge would bring over
  every other in-progress commit on `develop` too.
  </details>

- How does `git bisect`'s effectiveness depend on the commit hygiene practices from the
  Conventions subfolder?

  <details>
  <summary>Answer</summary>

  Bisect only pinpoints which commit introduced a bug — if commits are large and mixed (multiple
  unrelated changes), landing on the bad one doesn't tell you which specific change was actually
  responsible; atomic commits make the result of a bisect actually actionable.
  </details>

- If a secret is committed today, then removed tomorrow via `git filter-repo`, is it safe to
  consider the leak resolved as soon as the rewrite is pushed?

  <details>
  <summary>Answer</summary>

  No — anyone who already cloned/pulled still has the secret, and it may be cached by the hosting
  platform; the credential itself must be rotated, since rewriting history doesn't retroactively
  un-expose it.
  </details>

- What's the actual difference between what a fast-forward merge, a rebase, and a squash merge
  each do to a feature branch's individual commits?

  <details>
  <summary>Answer</summary>

  Fast-forward keeps every commit exactly as-is, just moves the pointer; rebase keeps every
  commit but gives each a new hash (replayed on a new parent); squash merge discards the
  individual commits entirely, replacing them with one new commit.
  </details>

- Why does this org's squash-and-rebase policy make `--force-with-lease` a routine part of the
  workflow, when a plain merge-only workflow would never need to force-push at all?

  <details>
  <summary>Answer</summary>

  Rebasing your own branch before opening/updating a PR rewrites its commit hashes, so pushing
  the result requires overwriting the remote branch's history — `--force-with-lease` does that
  safely by checking nobody else pushed to it since your last fetch.
  </details>

- Both a stash and a worktree let you set aside in-progress work to deal with something else.
  What's the actual tradeoff between reaching for one vs. the other?

  <details>
  <summary>Answer</summary>

  A stash shelves changes within the same working directory (fast, but you can't work on both at
  once); a worktree gives you a fully separate working directory for another branch
  simultaneously, at the cost of a bit more disk usage — worktree wins when you need to actually
  keep working on both at once, stash wins for a quick, short interruption.
  </details>

- How do PRs (a platform feature, not a Git concept) end up enforcing the squash-merge policy
  that's actually implemented at the Git level?

  <details>
  <summary>Answer</summary>

  The hosting platform's PR merge button (e.g. GitHub's "Squash and merge") is what actually
  performs the squash at merge time — the PR itself is just the review/approval gate; the squash
  mechanism underneath is the same `rebase -i`/squash logic covered in Rebasing and Squash &
  Rebase.
  </details>

- If a teammate force-pushes their feature branch after a rebase, and you had already pulled the
  old commits, what does your next `git pull` look like, and what should you do instead of just
  pulling?

  <details>
  <summary>Answer</summary>

  Your next plain pull likely fails or creates a confusing merge of old and new histories, since
  the commit hashes no longer match; you should instead fetch and reset your local branch to
  match the rewritten remote branch, rather than merge/pull normally.
  </details>

- Why does `git reflog` not help you recover a change that was only ever in a `git stash` you
  later dropped?

  <details>
  <summary>Answer</summary>

  Reflog tracks where HEAD (and branches) have pointed over time — commits and resets — but a
  stash lives in its own separate stash reference outside of that; dropping a stash removes it
  from that separate list, with no commit in the main history for the reflog to have recorded.
  </details>

- Why is `git revert` the only genuinely safe undo option once a bad commit is already on `main`,
  compared to every other undo tool covered across this topic?

  <details>
  <summary>Answer</summary>

  `restore`/`checkout -- file` are too narrow to safely undo a whole bad commit across branches;
  `reset --hard` and rebase-based fixes all rewrite existing commit hashes, unsafe once others
  have pulled; `revert` adds a new commit undoing the change without touching any existing hash,
  so it's safe regardless of who else has already pulled the bad commit.
  </details>
