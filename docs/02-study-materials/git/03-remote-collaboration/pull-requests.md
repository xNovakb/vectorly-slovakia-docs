---
sidebar_position: 2
title: Pull / Merge Requests
---

# Pull / Merge Requests

A **pull request** (GitHub) or **merge request** (GitLab) — same concept, different name — is a
request to merge one branch into another, opened *before* the merge happens, so others can review
the diff first. It's not a Git concept at all — it's a feature the hosting platform (GitHub/GitLab)
adds on top of plain Git.

## Typical flow

```bash
git switch -c feature/login main    # branch off main
# ... commit work ...
git push -u origin feature/login    # push the branch
```

Then, on GitHub/GitLab: open a PR/MR from `feature/login` into `main`. This gives:

- a diff view of everything the branch changes,
- a place for comments/review threads on specific lines,
- CI status checks (tests, linting) run automatically against the branch,
- a single button to merge once approved.

## Code review flow

1. Author opens the PR, ideally with a description of *what* and *why*.
2. Reviewer(s) leave inline comments on specific lines, or approve.
3. Author pushes more commits addressing feedback — the PR updates automatically, no need to
   reopen anything.
4. Once approved and checks pass, merge (see
   [Squash & Rebase](../05-conventions/squash-and-rebase.md) for *how* we merge here).

```bash
# addressing review feedback:
git add src/login.ts
git commit -m "fix: address review comment on error message wording"
git push origin feature/login       # PR updates automatically
```

## Forking vs. shared repo

Two common models for who can push branches:

- **Shared repo** (typical for a small team with write access): everyone pushes feature branches
  directly to the same repo, opens a PR from `feature/x` → `main`.
- **Fork-based** (typical for open source, or contributors without write access): you fork the
  repo into your own account, push branches there, and open a PR *from your fork* into the
  original repo. Requires the `origin`/`upstream` remote setup covered in
  [Remotes](./remotes.md).

This org uses the shared-repo model with a `main`/`develop`/`feature` branch structure — see
[Git Workflow Models](./git-workflow-models.md) and the actual policy at
[`/internal-operations/git-workflow`](/internal-operations/git-workflow).

## Check yourself

- Is a pull/merge request a Git concept?

  <details>
  <summary>Answer</summary>

  No — it's a feature the hosting platform (GitHub/GitLab) adds on top of plain Git; Git itself
  has no concept of a PR.
  </details>

- If you push more commits to a branch that already has an open PR, do you need to reopen
  anything?

  <details>
  <summary>Answer</summary>

  No — the PR updates automatically to include the new commits.
  </details>

- What's the key difference between the shared-repo and fork-based collaboration models?

  <details>
  <summary>Answer</summary>

  In shared-repo, everyone pushes feature branches directly to the same repo; in fork-based, you
  push to your own forked copy and open a PR from your fork into the original repo — requiring an
  `origin`/`upstream` remote setup.
  </details>
