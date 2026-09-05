---
sidebar_position: 5
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- Both `git filter-repo` and `git worktree` let you work with history/checkouts differently from
  the default. Which one actually creates new commit hashes, and which one doesn't touch history
  at all?

  <details>
  <summary>Answer</summary>

  `git filter-repo` rewrites every affected commit (new hashes); `git worktree` just gives you
  another checkout of the *same* existing history — no rewriting involved.
  </details>

- If a team needs to share Git hooks across every clone, which mechanism from this subfolder makes
  that automatic without manual setup per clone?

  <details>
  <summary>Answer</summary>

  A tool like Husky, which installs hooks via an `npm install` postinstall step — as opposed to
  `core.hooksPath` alone, which still requires each clone to run the config command once.
  </details>

- A submodule needs an extra step after cloning to actually get its file contents. Does a
  worktree have a similar "extra step" requirement?

  <details>
  <summary>Answer</summary>

  No — a worktree is immediately usable after `git worktree add`; the "extra step" problem is
  specific to submodules (`--recurse-submodules` or `submodule update --init`), not worktrees.
  </details>

- Why would `git filter-repo` be the tool of choice for removing a secret committed years ago,
  when `rebase -i HEAD~3` wouldn't be enough?

  <details>
  <summary>Answer</summary>

  `rebase -i` only reaches recent commits you specify (e.g. the last 3); a secret buried deep in
  history requires rewriting *every* commit that ever touched that file, which is what
  `filter-repo` does across the whole history.
  </details>

- Could a submodule and a worktree be combined — e.g. a worktree of a repo that itself has
  submodules?

  <details>
  <summary>Answer</summary>

  Yes, conceptually — a worktree is just another checkout of the same repo, so it still contains
  the same submodule pointers as any other checkout of that repo; each worktree would still need
  `submodule update --init` for the submodule's own content.
  </details>
