---
sidebar_position: 5
title: Bisect
---

# Bisect

`git bisect` finds the exact commit that introduced a bug by binary-searching through history —
instead of scrolling through hundreds of commits by eye.

## The idea

You tell Git one commit you know is **bad** (bug present) and one you know is **good** (bug
absent). Git checks out the commit halfway between them and asks you: good or bad? Based on the
answer it halves the range again, repeating until it lands on the exact first bad commit.

For history between a known-good and known-bad point of *n* commits, this takes about
`log2(n)` steps — e.g. ~10 steps to search 1,000 commits, instead of checking each one.

## Running it

```bash
git bisect start
git bisect bad                    # current commit (e.g. HEAD) has the bug
git bisect good v1.2.0             # this old tag/commit was fine
```

Git checks out a commit in the middle. Test it (run the app, run a test, whatever reproduces the
bug), then tell Git the result:

```bash
git bisect good      # bug not present here
# or
git bisect bad        # bug present here
```

Repeat — Git keeps narrowing the range and checking out the new midpoint — until it reports:

```text
a1b2c3d is the first bad commit
```

Then stop and return to where you started:

```bash
git bisect reset
```

## Automating it with a script

If the bug is something a script/test can detect (not just "look at it and judge"), bisect can run
entirely unattended:

```bash
git bisect start
git bisect bad HEAD
git bisect good v1.2.0
git bisect run npm test -- --grep "login validation"
```

Git runs the command at each step; a zero exit code means "good", nonzero means "bad" — same
convention as any shell script/CI check. It'll finish and report the bad commit with no further
input from you.

## Practical tips

- Works best when you have a **fast, reliable** way to check good/bad — a slow manual repro makes
  each step painful.
- Skip a commit that can't be tested (e.g. it doesn't build) with `git bisect skip` instead of
  guessing.
- `git bisect log` shows the steps so far; `git bisect replay <file>` can replay a saved session.
