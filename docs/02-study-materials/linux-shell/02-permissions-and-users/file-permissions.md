---
sidebar_position: 2
title: File Permissions
---

# File Permissions

Every file and directory has an owner, a group, and three sets of permissions — what the owner,
the group, and everyone else can do with it.

## Reading `ls -l` permission bits

```text
-rw-r--r--  1 deploy deploy  1.2K Sep 4 10:03 README.md
drwxr-x---  2 deploy deploy  4.0K Sep 4 10:03 secrets/
```

```
d rwx r-x ---
^ ^   ^   ^
| |   |   others
| |   group
| owner
type (d = directory, - = regular file)
```

Each triplet is **r**ead, **w**rite, e**x**ecute, in that order — a `-` means that permission is
absent.

- **On a file**: `r` = can read its contents, `w` = can modify it, `x` = can execute it as a
  program/script.
- **On a directory**: `r` = can list its contents, `w` = can create/delete files inside it, `x` =
  can `cd` into it / access files inside by name (yes, `x` on a directory means something
  different from `x` on a file — a very common point of confusion).

## `chmod` — changing permissions

### Symbolic mode

```bash
chmod u+x script.sh        # add execute for the owner (user)
chmod g-w file.txt           # remove write for the group
chmod o-rwx secrets/           # remove all access for others
chmod a+r file.txt              # add read for everyone (all)
```

### Numeric (octal) mode

Each permission is a bit: `r=4`, `w=2`, `x=1` — sum them per triplet.

```
rwx = 4+2+1 = 7
rw- = 4+2+0 = 6
r-x = 4+0+1 = 5
r-- = 4+0+0 = 4
```

```bash
chmod 755 script.sh    # rwxr-xr-x — owner: full, group/others: read+execute
chmod 644 file.txt       # rw-r--r-- — owner: read+write, group/others: read only
chmod 600 id_ed25519       # rw------- — owner only, standard for private SSH keys (see SSH Keys)
```

:::note
`chmod 600` on `~/.ssh/id_ed25519` isn't just good practice — SSH itself **refuses** to use a
private key file that group/others can read, and will error out until you fix the permissions.
This is the concrete reason this specific chmod shows up in every SSH setup guide.
:::

## `chown` — changing ownership

```bash
sudo chown deploy:deploy file.txt     # set owner to deploy, group to deploy
sudo chown -R deploy:deploy /opt/vectorly-docs/   # recursively, for a whole directory tree
```

Only root (or via `sudo`) can change a file's owner to someone else — you can't give a file away
to another user as a regular user, which prevents disk-quota and accountability tricks.

## A practical example

A deploy script needs to be executable but nothing else should be able to modify it:

```bash
chmod 744 deploy.sh
ls -l deploy.sh
# -rwxr--r--  1 deploy deploy  312 Sep 4 10:03 deploy.sh
```

Owner (`deploy`) can read/write/execute; everyone else can only read.
