---
sidebar_position: 5
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- How does atomic commit hygiene make the squash-merge workflow this org uses actually make
  sense?

  <details>
  <summary>Answer</summary>

  Squash-merge collapses a whole branch into one commit regardless of how messy the individual
  commits were — atomic hygiene matters most for making the PR's own diff easier to review before
  it's squashed.
  </details>

- A commit message says `fix(cart): recalculate total after coupon removal`. Which Conventional
  Commits type is this, and would it bump a patch or minor version?

  <details>
  <summary>Answer</summary>

  `fix` — a patch version bump.
  </details>

- Why does squash-merging make `git bisect` easier to use later, tying conventions back to
  history tools?

  <details>
  <summary>Answer</summary>

  Each commit on `main` corresponds to exactly one PR/logical change, so a bisect landing on a
  commit points at one coherent change instead of a jumble of "wip"/"fix typo" commits.
  </details>

- You need to release v2.5.0 after only adding backward-compatible features (no breaking changes,
  no bug fixes). Which version segment moves?

  <details>
  <summary>Answer</summary>

  MINOR (from `feat` commits) — v2.4.1 → v2.5.0.
  </details>

- Why does `--force-with-lease` matter specifically in a squash-and-rebase workflow, more than in
  a merge-only workflow?

  <details>
  <summary>Answer</summary>

  Squash-and-rebase requires rewriting your branch's commits (via `rebase -i`) before pushing,
  which needs a force-push — `--force-with-lease` protects against silently overwriting someone
  else's work pushed to that branch since your last fetch, something a merge-only workflow never
  needs since it never rewrites hashes.
  </details>
