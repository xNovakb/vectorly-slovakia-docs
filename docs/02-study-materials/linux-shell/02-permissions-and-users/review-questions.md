---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [Users & Groups](./users-and-groups.md) says being in the `docker` group is "functionally
  equivalent to root." How does that connect to what [File Permissions](./file-permissions.md)
  says about `x` on a directory vs. `x` on a file?

  <details>
  <summary>Answer</summary>

  It doesn't come from directory `x` bits at all — it's a special case where the Docker daemon
  itself runs as root and grants full host access to anyone who can talk to it, so group
  membership alone bypasses the normal permission-bit model entirely.
  </details>

- Why does `chmod 600` matter specifically for an SSH private key, tying [File
  Permissions](./file-permissions.md) to a concrete consequence rather than just "good practice"?

  <details>
  <summary>Answer</summary>

  SSH itself refuses to use a private key file that group or others can read — it's an enforced
  requirement, not a stylistic recommendation, so a wrong permission mode breaks SSH login
  outright.
  </details>

- A command "needs" `sudo` to run. [Sudo & Root](./sudo-and-root.md) says that's often a sign of
  something else being wrong. Using what [File Permissions](./file-permissions.md) and [Users &
  Groups](./users-and-groups.md) cover, what's the more likely underlying issue?

  <details>
  <summary>Answer</summary>

  Wrong file/directory ownership or permissions for your own user — the fix is usually `chown`ing
  the files to the right owner or adding your user to the right group, not routinely prefixing
  commands with `sudo`.
  </details>

- Why does `usermod -aG docker deploy` require logging out and back in before `docker ps` works
  without `sudo`, given what [Users & Groups](./users-and-groups.md) says about `id` and group
  membership?

  <details>
  <summary>Answer</summary>

  A running shell session's group membership is fixed at login time; `id`/`groups` for that
  session won't reflect a newly added group until a new login (or new shell) re-reads the updated
  group list.
  </details>

- Both `/etc/sudoers` and `~/.ssh/id_ed25519` have "one wrong move breaks everything" warnings
  attached. What's the actual failure mode in each case, and why does one use a dedicated tool
  (`visudo`) to prevent it while the other doesn't need one?

  <details>
  <summary>Answer</summary>

  A syntax error in `/etc/sudoers` can lock out every user's ability to use `sudo`, including
  root — `visudo` validates syntax before saving specifically to prevent that. A wrong permission
  mode on a private key just makes SSH refuse to use that one key; it's a single `chmod` to fix, no
  validation step needed.
  </details>

- If a script run as a limited user does `rm -rf` on the wrong path, [Users &
  Groups](./users-and-groups.md) says the damage is bounded. Bounded by what, exactly?

  <details>
  <summary>Answer</summary>

  By what that user owns and has write permission to — a non-root user's mistake can't touch files
  owned by other users or system files it lacks write access to, unlike the same mistake run as
  root.
  </details>
