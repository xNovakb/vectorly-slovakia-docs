---
sidebar_position: 3
title: Sudo & Root
---

# Sudo & Root

**root** is the Linux superuser — UID 0, unrestricted by normal permission checks, can read/write/
execute anything on the system. **sudo** ("superuser do") lets an authorized regular user run a
*specific command* as root, temporarily, instead of logging in as root itself.

## Why sudo instead of just logging in as root

```bash
sudo systemctl restart docker
```

vs. logging in directly as root and running commands with no `sudo` prefix at all. sudo is
preferred because:

- **It's logged** — every `sudo` command is recorded (typically in `/var/log/auth.log` or via
  `journalctl`), so there's an audit trail of who ran what, as opposed to an anonymous root
  session.
- **It's scoped per-command** — you elevate for exactly one command, then you're back to your
  normal, limited user — you don't accidentally run an unrelated command with full privileges just
  because you forgot you were still logged in as root.
- **Direct root SSH login is commonly disabled entirely** on production servers — an attacker who
  guesses/steals a regular user's credentials still needs the sudo password (or sudo rights at
  all) to do real damage, an extra barrier a shared root login doesn't have.

## Using it

```bash
sudo apt update                    # run one command as root
sudo -i                              # start an interactive root shell (use sparingly)
sudo -u deploy whoami                 # run a command as a specific OTHER user, not root
```

sudo asks for **your own** password (not root's) — it works by checking whether *you* are
authorized to elevate, not by knowing a shared root password.

## `/etc/sudoers` — who's allowed

```bash
sudo visudo          # the ONLY safe way to edit sudoers — validates syntax before saving
```

```text title="/etc/sudoers excerpt"
deploy  ALL=(ALL:ALL) ALL      # deploy can run any command, as any user, on any host
```

:::danger
Never edit `/etc/sudoers` directly with a regular text editor. A syntax error in this file can
lock **every** user, including root, out of using `sudo` at all — `visudo` checks the syntax
before it lets the save go through, a plain editor doesn't.
:::

## Common mistake: overusing `sudo`

```bash
sudo npm install     # ❌ almost never actually needed, and can leave root-owned files in your project
npm install            # ✅ correct in virtually every case
```

If a command "needs" `sudo` to work and you don't understand why, that's usually a sign something
is misconfigured (wrong file ownership, wrong install location) — not that `sudo` is the fix.
Reach for it deliberately (system package installs, service management, editing files under
`/etc`), not reflexively whenever something errors.
