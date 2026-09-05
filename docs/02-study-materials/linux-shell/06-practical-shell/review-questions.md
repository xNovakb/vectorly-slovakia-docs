---
sidebar_position: 5
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [Environment Variables & PATH](./environment-variables-and-path.md) says `export` is required
  for a child process to see a variable. Why does that matter specifically for [Shell Scripting
  Basics](./shell-scripting-basics.md)'s `$API_KEY`-style values passed into a script run via
  `bash deploy.sh`?

  <details>
  <summary>Answer</summary>

  A script run as a new process only inherits variables that were exported from the parent shell;
  a plain (non-exported) variable set in the calling shell is invisible inside the script's own
  process.
  </details>

- [Shell Scripting Basics](./shell-scripting-basics.md)'s `if [ $? -ne 0 ]` check relies on a
  concept covered elsewhere in this whole topic, not in this subfolder. Which one, and where?

  <details>
  <summary>Answer</summary>

  Exit codes, covered in [What Is a Process](../03-processes/what-is-a-process.md) — `$?` holds
  the previous command's exit code, `0` for success, nonzero for failure.
  </details>

- [systemd & Services](./systemd-and-services.md) says `Restart=always` is systemd's advantage
  over a plain background process. Which tool from [Background &
  Jobs](../03-processes/background-and-jobs.md) is it being implicitly compared against, and what
  exactly does that tool fail to do that systemd does?

  <details>
  <summary>Answer</summary>

  `nohup` (or a bare `&`) — neither restarts a process automatically if it crashes; they only keep
  it running through a disconnect, they don't supervise or revive it afterward.
  </details>

- [Troubleshooting a Server](./troubleshooting-a-server.md)'s six-command worked example checks
  disk, then Docker's systemd status, then container state, then logs, then connectivity — in that
  order. Why check disk space before anything Docker-related?

  <details>
  <summary>Answer</summary>

  A full disk is a disproportionately common root cause of a service silently failing or a deploy
  not completing, and `df -h` rules it in or out in seconds — cheaper to eliminate first than to
  debug Docker-level symptoms that might just be a downstream effect of no free disk space.
  </details>

- Why does `journalctl -u docker` matter as a *separate* check from `docker logs docs-app`, per
  [systemd & Services](./systemd-and-services.md) and [Troubleshooting a
  Server](./troubleshooting-a-server.md)?

  <details>
  <summary>Answer</summary>

  `journalctl -u docker` shows whether the Docker daemon itself (a systemd-managed service) is
  healthy; `docker logs docs-app` shows one specific container's own output — checking the daemon
  first tells you whether a problem is in Docker itself or isolated to one container.
  </details>

- A variable exported in a terminal session works fine, but disappears in a new `tmux` pane on the
  same machine. Using [Environment Variables & PATH](./environment-variables-and-path.md)'s
  `.bashrc` vs. `.bash_profile` distinction, what's the likely cause?

  <details>
  <summary>Answer</summary>

  The variable was set with a plain `export` in the terminal (session-only) rather than added to a
  startup file like `.bashrc` — or it was added to `.bash_profile` specifically, which only runs
  for a login shell, not for every new interactive shell/pane that only sources `.bashrc`.
  </details>
