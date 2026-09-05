---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- Rebasing gives replayed commits new hashes. How does that connect to why rebase is unsafe on
  shared branches while merge always is safe?

  <details>
  <summary>Answer</summary>

  Merge never rewrites existing commit hashes, only adds a new merge commit on top — safe for
  anyone who already pulled. Rebase changes the hashes of the replayed commits, so anyone who
  pulled the old ones now has a history that's diverged from yours.
  </details>

- A branch is fast-forwarded during a merge. Could the same branch history have been produced by
  a rebase instead?

  <details>
  <summary>Answer</summary>

  Yes — a fast-forward merge and a rebase followed by a fast-forward both leave a single linear
  history; the difference only shows up when the target branch has moved and a real three-way
  merge/rebase-replay is needed.
  </details>

- If a rebase conflicts, do you resolve it the same way as a merge conflict?

  <details>
  <summary>Answer</summary>

  The conflict markers are identical, but finishing differs — a rebase conflict is resolved with
  `git rebase --continue` (not `git commit`), since rebase finalizes each replayed commit itself.
  </details>

- Why does HEAD staying attached to a branch (rather than being detached) matter for how
  `git commit` and `git switch` behave?

  <details>
  <summary>Answer</summary>

  When HEAD points at a branch, committing moves that branch's pointer forward automatically; in
  detached HEAD, new commits aren't tracked by any branch and can become unreachable once you
  switch away — you'd need to explicitly create a branch to keep them.
  </details>

- You need to combine three commits on a feature branch into two clean ones before merging.
  Which of this subfolder's tools does that, and how does it relate to what a plain merge would
  preserve?

  <details>
  <summary>Answer</summary>

  Interactive rebase (`rebase -i`, squash/fixup) — a plain merge would keep all three original
  commits intact; the interactive rebase actually rewrites the branch's own history down to two
  before it's merged.
  </details>
