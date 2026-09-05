---
sidebar_position: 2
title: Git Hooks
---

# Git Hooks

Hooks are scripts Git runs automatically at points in the commit/push lifecycle — `.git/hooks/`
in any repo, each one just an executable script (any language, as long as it has a shebang).

## Common hooks

| Hook | Runs when | Typical use |
|---|---|---|
| `pre-commit` | Before a commit is created | Lint/format staged files, run fast tests |
| `commit-msg` | After the message is written, before commit finalizes | Enforce a message format (e.g. Conventional Commits) |
| `pre-push` | Before `git push` sends anything | Run the full test suite, block push on failure |

## A `pre-commit` example

```bash title=".git/hooks/pre-commit"
#!/bin/sh
npx eslint $(git diff --cached --name-only --diff-filter=ACM -- '*.ts' '*.tsx')
```

Make it executable: `chmod +x .git/hooks/pre-commit`. A nonzero exit code from the script blocks
the commit.

## Enforcing Conventional Commits with `commit-msg`

```bash title=".git/hooks/commit-msg"
#!/bin/sh
commit_msg=$(cat "$1")
pattern="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+"
if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo "Commit message doesn't follow Conventional Commits format:"
  echo "  <type>(<scope>): <description>"
  exit 1
fi
```

See [Conventional Commits](../05-conventions/conventional-commits.md) for the format this checks.

## Local vs. shared hooks

`.git/hooks/` is **not** committed — it lives inside the local `.git` folder, so hooks placed there
only apply to that one clone and aren't shared automatically with teammates.

To share hooks across a team, keep the scripts in a tracked folder (e.g. `.githooks/`) and either:

```bash
git config core.hooksPath .githooks     # tell Git to use this folder instead of .git/hooks
```

or use a tool like [Husky](https://typicode.github.io/husky/) (common in Node projects) that
installs hooks automatically via an `npm install` postinstall step, so every clone gets them
without manual setup.

## Bypassing a hook

```bash
git commit --no-verify -m "..."
```

Skips `pre-commit`/`commit-msg`. Useful in genuine emergencies, but a hook you're routinely
bypassing is a sign the hook itself needs fixing, not that `--no-verify` is the right habit.

## Check yourself

- Are `.git/hooks/` scripts committed and shared with teammates automatically?

  <details>
  <summary>Answer</summary>

  No — they live inside the local `.git` folder and aren't committed, so they only apply to that
  one clone unless the team explicitly shares them via a tracked folder + `core.hooksPath`, or a
  tool like Husky.
  </details>

- What does a nonzero exit code from a `pre-commit` hook do?

  <details>
  <summary>Answer</summary>

  It blocks the commit from being created.
  </details>

- What does `git commit --no-verify` do, and when is it appropriate?

  <details>
  <summary>Answer</summary>

  It bypasses `pre-commit`/`commit-msg` hooks — useful in genuine emergencies, but routinely
  bypassing a hook signals the hook itself needs fixing.
  </details>
