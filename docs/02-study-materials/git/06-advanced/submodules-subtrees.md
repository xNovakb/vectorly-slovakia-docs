---
sidebar_position: 1
title: Submodules & Subtrees
---

# Submodules & Subtrees

Both let you embed one Git repo inside another. Different tradeoffs.

## Submodules

A submodule is a **pointer to a specific commit** of another repo, stored as a special entry in
your repo (not the other repo's files themselves).

```bash
git submodule add git@github.com:example/shared-lib.git libs/shared-lib
git commit -m "chore: add shared-lib as submodule"
```

Cloning a repo with submodules doesn't pull their contents by default — an extra step is needed:

```bash
git clone --recurse-submodules git@github.com:example/project.git
# or, after a plain clone:
git submodule update --init --recursive
```

Updating a submodule to a newer commit of the inner repo:

```bash
cd libs/shared-lib
git pull origin main
cd ../..
git add libs/shared-lib
git commit -m "chore: bump shared-lib submodule"
```

Pros: the inner repo stays a fully independent Git repo, with its own history and remote. Cons:
every clone/pull needs the extra submodule step, and it's a common source of "why is this folder
empty" confusion for anyone unfamiliar with submodules.

## Subtrees

A subtree copies another repo's files **directly into** your repo's history, no special pointer —
just regular committed files.

```bash
git subtree add --prefix=libs/shared-lib git@github.com:example/shared-lib.git main --squash
```

Pulling in upstream changes later:

```bash
git subtree pull --prefix=libs/shared-lib git@github.com:example/shared-lib.git main --squash
```

Pros: works with zero extra steps for anyone cloning — files are just there. Cons: the inner
repo's history gets folded into yours (messier `git log`), and pushing changes back upstream is
more involved than with a submodule.

## Which one

| | Submodule | Subtree |
|---|---|---|
| Extra clone/pull steps | Yes | No |
| Inner repo stays independent | Yes | Blended in |
| Good for | A library you version and update deliberately | Vendoring code you rarely need to push changes back to |

For most internal "shared code between our own repos" needs, a published package (npm, etc.) is
usually simpler than either — reach for submodules/subtrees only when publishing a package isn't
practical.

## Check yourself

- What does a submodule actually store in your repo — the other repo's files, or something else?

  <details>
  <summary>Answer</summary>

  A pointer to a specific commit of the other repo, not the other repo's files themselves —
  cloning needs an extra step (`--recurse-submodules` or `submodule update --init`) to actually
  pull the contents.
  </details>

- Does a subtree keep the inner repo as an independent Git repo?

  <details>
  <summary>Answer</summary>

  No — a subtree copies the other repo's files directly into your repo's history as regular
  committed files, blending its history into yours.
  </details>

- For most internal "shared code between our own repos" needs, what's usually simpler than
  either submodules or subtrees?

  <details>
  <summary>Answer</summary>

  A published package (e.g. an npm package).
  </details>
