---
sidebar_position: 3
title: Rewriting History
---

# Rewriting History

Several tools let you change commits that already exist, rather than just adding new ones on top.
Powerful, and the single easiest way to cause real trouble on a shared branch.

## `rebase -i` for editing your own recent commits

Already covered in depth at
[Rebasing → Interactive rebase](../02-branching-merging/rebasing.md#interactive-rebase) — the
`pick`/`reword`/`squash`/`fixup`/`drop` verbs for editing, combining, or removing commits.

One more verb worth knowing: `edit`, which pauses the rebase at that commit so you can amend it
directly:

```bash
git rebase -i HEAD~3
# mark a commit as `edit`, then:
git commit --amend         # change the commit's content/message
git rebase --continue        # resume replaying the rest
```

## `git filter-repo` — rewriting *all* of history

For something `rebase -i` can't do — like removing a file that was accidentally committed
everywhere in history (a secret, a huge binary) — use
[`git filter-repo`](https://github.com/newren/git-filter-repo) (the modern replacement for the
older, slower `git filter-branch`):

```bash
git filter-repo --path secrets.env --invert-paths
```

This rewrites **every** commit that touched `secrets.env`, removing it entirely, and gives every
affected commit a new hash.

:::warning
If a real secret was committed, rewriting history removes it from *future* clones, but anyone who
already cloned/pulled still has it, and it may be cached by the hosting platform. Rewriting history
is not a substitute for **rotating the leaked credential** — treat it as compromised regardless.
:::

## Why rewriting shared history is dangerous

Every command above changes commit hashes. If those commits have already been pushed and someone
else has pulled them, rewriting creates a fork: your history and theirs no longer share the same
commits, even though the *content* looks similar. Their next pull either fails or (with certain
merge settings) reintroduces the old, "removed" commits right back in.

**Rule**: only rewrite commits that exist solely on your own branch, not yet pulled by anyone else.
Once something is on `main`/`develop` or another shared branch, treat it as permanent — use
`git revert` (see [Undoing Changes](../04-history-and-fixes/undoing-changes.md)) instead.

If a rewrite on a shared branch is genuinely unavoidable (e.g. purging a leaked secret repo-wide),
it has to be coordinated: announce it, have everyone re-clone or carefully rebase their own
in-progress branches afterward, and force-push with the whole team's awareness — never silently.
