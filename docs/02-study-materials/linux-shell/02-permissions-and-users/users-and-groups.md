---
sidebar_position: 1
title: Users & Groups
---

# Users & Groups

Linux is multi-user by design, even on a server only one person actually logs into — every
process and file is owned by a specific user, and that ownership is what permissions (see
[File Permissions](./file-permissions.md)) actually check.

## Who am I

```bash
whoami          # your username
id               # your user ID (UID), group ID (GID), and every group you belong to
```

```text
$ id
uid=1000(deploy) gid=1000(deploy) groups=1000(deploy),999(docker)
```

That `groups=...,999(docker)` matters in practice — being in the `docker` group is what lets a
non-root user run `docker` commands at all (see
[Sudo & Root](./sudo-and-root.md) for why that's a deliberate alternative to using `sudo` for
every Docker command).

## Users and groups as files

```bash
cat /etc/passwd | grep deploy
# deploy:x:1000:1000::/home/deploy:/bin/bash
```

Format: `username:password-placeholder:UID:GID:comment:home-dir:default-shell`. The actual
password hash lives in `/etc/shadow` (readable only by root) — `/etc/passwd` just holds account
metadata, historically readable by everyone.

```bash
cat /etc/group | grep docker
# docker:x:999:deploy
```

## Why servers use a dedicated non-root user

This org's VPS runs everything as a user named `bnovak`, not as `root` (see
[`/internal-operations/server-architecture`](/internal-operations/server-architecture)) — this is
standard practice, not an arbitrary choice:

- A mistake (`rm -rf` in the wrong place, a bad script) run as a limited user can only damage what
  that user owns — as root, it can damage the entire system.
- A compromised service running as a limited user hands an attacker limited access, not full
  control of the machine.
- Anything that genuinely needs elevated privileges asks for it explicitly via `sudo` (see
  [Sudo & Root](./sudo-and-root.md)) — a deliberate, logged action, not the default state.

## Creating and managing users

```bash
sudo useradd -m deploy         # create a user, -m makes their home directory
sudo passwd deploy               # set their password
sudo usermod -aG docker deploy    # add an existing user to the docker group
```

`-aG` (append + groups) matters — plain `-G` *replaces* all of a user's existing group
memberships instead of adding one, a common and disruptive mistake.

## Switching users

```bash
su - deploy         # switch to the deploy user's login shell (asks for deploy's password)
sudo -u deploy whoami   # run one command as deploy (asks for YOUR password, if you have sudo rights)
```
