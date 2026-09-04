---
sidebar_position: 2
title: Installation & Config
---

# Installation & Config

## Installing Git

- **Windows**: [git-scm.com](https://git-scm.com/download/win) or `winget install Git.Git`
- **macOS**: `brew install git` (or it ships with Xcode Command Line Tools)
- **Linux**: `apt install git` / `dnf install git` depending on distro

Verify it worked:

```bash
git --version
```

## Identity (`user.name` / `user.email`)

Git stamps every commit with an author name and email. Set this once per machine:

```bash
git config --global user.name "Jane Doe"
git config --global user.email "jane@example.com"
```

`--global` writes to `~/.gitconfig` and applies to every repo on the machine. Drop `--global` to
set it for just the current repo (useful if a work project needs a different email than personal
projects) — a local `git config user.email work@company.com` run *inside* a repo overrides the
global value for that repo only.

Check what's currently set:

```bash
git config --list
git config user.email          # just this one key
```

## SSH keys for remotes

Pushing to GitHub/GitLab over SSH avoids typing a password/token every time.

```bash
ssh-keygen -t ed25519 -C "jane@example.com"   # generates ~/.ssh/id_ed25519(.pub)
```

Then add the **public** key (`id_ed25519.pub`) contents to your GitHub/GitLab account under SSH
keys. Test it:

```bash
ssh -T git@github.com
```

Clone using the SSH URL (not the HTTPS one) to use the key:

```bash
git clone git@github.com:example/project.git
```

## `.gitignore`

Tells Git which files to never track — build output, dependencies, local secrets, editor files.

```gitignore title=".gitignore"
node_modules/
dist/
.env
*.log
.DS_Store
```

Add it **before** you first commit those files — once a file is already tracked, adding it to
`.gitignore` won't stop Git from tracking it (you'd need `git rm --cached <file>` first).

Useful starting points: [github.com/github/gitignore](https://github.com/github/gitignore) has
ready-made `.gitignore` files per language/framework.
