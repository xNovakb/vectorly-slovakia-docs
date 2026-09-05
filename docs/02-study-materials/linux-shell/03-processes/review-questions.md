---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [What Is a Process](./what-is-a-process.md) says closing a terminal can kill everything started
  from it. Which specific signal from [Background & Jobs](./background-and-jobs.md) causes that,
  and why?

  <details>
  <summary>Answer</summary>

  `SIGHUP` (hangup) — when the parent shell exits, its child processes get sent `SIGHUP` by
  default and die, since a plain background job (`&`) is still a child of that shell.
  </details>

- Why does `nohup long-task.sh &` solve the disconnect problem while a plain `long-task.sh &` from
  [Background & Jobs](./background-and-jobs.md) doesn't, given what [What Is a
  Process](./what-is-a-process.md) says about parent/child relationships?

  <details>
  <summary>Answer</summary>

  Both start the process as a child of the shell, but `nohup` makes that child specifically ignore
  `SIGHUP`, so it survives the shell exiting — the parent/child relationship is identical, only the
  signal-handling differs.
  </details>

- [Managing Processes](./managing-processes.md) distinguishes `kill` (SIGTERM) from `kill -9`
  (SIGKILL). Which one risks the "zombie" state [What Is a Process](./what-is-a-process.md)
  describes, and which one risks corrupted data instead?

  <details>
  <summary>Answer</summary>

  Neither directly causes a zombie (that's about a parent not collecting an already-finished
  child's exit status) — but SIGKILL is the one that risks corrupted data, since it gives the
  process no chance to finish a write or clean up; SIGTERM lets it shut down gracefully.
  </details>

- `tmux` is described in [Background & Jobs](./background-and-jobs.md) as solving a "broader
  problem" than `nohup`. What's the actual difference in what survives a disconnect?

  <details>
  <summary>Answer</summary>

  `nohup` keeps one specific command running after disconnect; `tmux` keeps an entire persistent
  terminal session alive — multiple commands, panes, and the ability to reconnect and keep working
  interactively, not just let one process finish unattended.
  </details>

- Given the process tree diagram in [What Is a Process](./what-is-a-process.md)
  (`sshd → bash → docker compose up → container process`), which process is `pkill node` from
  [Managing Processes](./managing-processes.md) actually targeting, and why is name-based killing
  riskier on a shared server than PID-based killing?

  <details>
  <summary>Answer</summary>

  It targets any process anywhere in that tree (or elsewhere on the system) whose name matches
  "node" — since it matches by name rather than a specific PID, it can kill unrelated Node
  processes belonging to other services running on the same server.
  </details>
