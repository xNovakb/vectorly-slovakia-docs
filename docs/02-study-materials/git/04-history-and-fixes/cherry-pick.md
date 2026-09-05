---
sidebar_position: 3
title: Cherry-Pick
---

# Cherry-Pick

`git cherry-pick` copies **one specific commit** from anywhere in history onto your current branch
— without bringing along everything else that branch has.

```bash
git switch main
git cherry-pick a1b2c3d
```

This creates a new commit on `main` with the same changes (and message) as `a1b2c3d`, but a new
commit hash (its parent is different now).

## Common use case: backporting a hotfix

Say a critical bug fix landed on `develop`, but there's already a `release/2.3` branch out that
also needs it, and you don't want to merge all of `develop`'s other in-progress work into the
release branch.

```bash
git log develop --oneline -5
# f9e8d7c fix: null pointer on empty cart (the one we need)
# ... other unrelated commits ...

git switch release/2.3
git cherry-pick f9e8d7c
git push origin release/2.3
```

Only that one fix moves over — the release branch stays isolated from everything else on
`develop`.

## Multiple commits

```bash
git cherry-pick a1b2c3d f4e5d6c        # two specific commits
git cherry-pick a1b2c3d^..f4e5d6c       # a range (inclusive of a1b2c3d)
```

## Conflicts

Same markers as a merge/rebase (see [Merging](../02-branching-merging/merging.md)) — the commit
you're picking might touch code that's diverged on the target branch.

```bash
# fix the conflict markers in the file, then:
git add file.txt
git cherry-pick --continue
# or bail out:
git cherry-pick --abort
```

## Watch out for

- Cherry-picking creates a **duplicate** commit (new hash, same content). If that commit later
  gets merged normally too (e.g. `develop` eventually merges into `release/2.3`), Git usually
  handles the duplicate fine — but it can occasionally cause a conflict on an already-applied
  change. Not a correctness problem, just something to expect.
- Don't reach for cherry-pick as a substitute for merging/rebasing a whole branch — it's a
  scalpel for one commit, not a general integration tool.

## Check yourself

- Does cherry-picking a commit bring along the other commits from its original branch?

  <details>
  <summary>Answer</summary>

  No — it copies just that one specific commit onto your current branch, creating a new commit
  with the same changes but a new hash.
  </details>

- What's a classic legitimate use case for cherry-pick?

  <details>
  <summary>Answer</summary>

  Backporting a hotfix that landed on `develop` onto an already-cut release branch, without
  merging all of develop's other in-progress work into the release branch.
  </details>

- Should cherry-pick be used as a general substitute for merging or rebasing a whole branch?

  <details>
  <summary>Answer</summary>

  No — it's a scalpel for one commit, not a general integration tool.
  </details>
