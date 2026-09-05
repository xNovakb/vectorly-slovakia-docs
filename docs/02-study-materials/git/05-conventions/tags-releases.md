---
sidebar_position: 4
title: Tags & Releases
---

# Tags & Releases

A tag is a fixed, named pointer to a specific commit — unlike a branch, it doesn't move as new
commits are added. Used to mark release points.

## Semantic versioning

`MAJOR.MINOR.PATCH`, e.g. `v2.4.1`:

- **MAJOR** — breaking change (see the `BREAKING CHANGE:` footer convention in
  [Conventional Commits](./conventional-commits.md))
- **MINOR** — new backward-compatible feature (`feat`)
- **PATCH** — backward-compatible bug fix (`fix`)

## Lightweight vs. annotated tags

```bash
git tag v2.4.1                              # lightweight — just a name pointing at a commit
git tag -a v2.4.1 -m "Release 2.4.1"          # annotated — full object: tagger, date, message, can be GPG-signed
```

**Use annotated tags for releases.** Lightweight tags are fine for quick throwaway markers, but
annotated tags carry metadata (who tagged it, when, why) and are what tools like `git describe`
and GitHub Releases expect.

## Pushing tags

Tags aren't pushed automatically with `git push` — they need their own push:

```bash
git push origin v2.4.1          # push one tag
git push origin --tags           # push all local tags not yet on the remote
```

## Listing and inspecting

```bash
git tag                          # list all tags
git tag -l "v2.4.*"                # filter by pattern
git show v2.4.1                   # view the tagged commit + tag message
```

## Tying tags to a release workflow

A typical release sequence:

```bash
git checkout main
git pull origin main
git tag -a v2.4.1 -m "Release 2.4.1"
git push origin v2.4.1
```

From there, CI (e.g. a GitHub Actions workflow triggered `on: push: tags:`) can pick up the tag to
build and publish a release, and GitHub's "Releases" UI can attach release notes to it — often
auto-generated from Conventional Commit messages between this tag and the last one.

## Deleting a tag

```bash
git tag -d v2.4.1                    # delete locally
git push origin :refs/tags/v2.4.1     # delete from remote
```

Rare — only do this for a genuine mistake (wrong commit tagged), never to "redo" a release someone
may have already pulled.

## Check yourself

- What's the difference between a lightweight and an annotated tag, and which should you use for
  releases?

  <details>
  <summary>Answer</summary>

  A lightweight tag is just a name pointing at a commit; an annotated tag is a full object
  carrying metadata (tagger, date, message) and can be GPG-signed. Use annotated tags for
  releases.
  </details>

- Does `git push` automatically push your tags?

  <details>
  <summary>Answer</summary>

  No — tags need their own push (`git push origin <tag>` or `git push origin --tags`).
  </details>

- In `vMAJOR.MINOR.PATCH`, which part corresponds to a `fix` commit and which to a `feat` commit?

  <details>
  <summary>Answer</summary>

  A `fix` bumps PATCH; a `feat` bumps MINOR.
  </details>
