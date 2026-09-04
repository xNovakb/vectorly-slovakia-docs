---
sidebar_position: 2
title: Commit Hygiene
---

# Commit Hygiene

Good commit hygiene means each commit is a self-contained, understandable unit — not a raw diary
of every keystroke.

## Atomic commits

An atomic commit does **one logical thing**. If you have to write "and" in the commit message,
it's often two commits:

```
❌ fix(login): fix validation bug and update dependencies and tweak CSS
✅ fix(login): reject empty password on login
✅ chore(deps): bump lodash to 4.17.21
✅ style(login): align submit button with form width
```

Why this matters in practice:
- `git revert` on one commit doesn't accidentally undo unrelated work.
- Code review is easier — a reviewer can evaluate "does this one thing make sense" instead of
  untangling three concerns at once.
- `git bisect` (see [Bisect](../04-history-and-fixes/bisect.md)) only works well if commits are
  small and isolated — a bisect landing on a giant mixed commit doesn't tell you much.

## Splitting one edit session into multiple commits

You don't have to commit in the order you wrote code — stage selectively:

```bash
git add -p            # stage hunk by hunk, choosing what belongs in this commit
git commit -m "fix(login): reject empty password on login"
git add -p             # stage the rest
git commit -m "chore(deps): bump lodash to 4.17.21"
```

## Writing the message itself

- **Summary line**: imperative mood ("add", "fix", "remove" — not "added"/"fixes"), under ~72
  characters, no trailing period.
- **Body** (optional, blank line after summary): explain *why*, not *what* — the diff already
  shows what changed.

```
fix(cart): recalculate total after coupon removal

Previously the cached total wasn't invalidated when a coupon was
removed, so the UI kept showing the discounted price after checkout
had already reverted to full price server-side.
```

## Messy local history is fine — clean it before it's shared

It's completely normal to commit `wip`, `fix typo`, `actually fix it` while working. The hygiene
rule applies to what lands in **permanent, shared history** — clean these up with
`rebase -i` before opening a PR, or let a squash-merge do it for you. See
[Squash & Rebase](./squash-and-rebase.md).
