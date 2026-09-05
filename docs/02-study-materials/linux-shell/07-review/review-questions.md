---
sidebar_position: 1
title: Review Questions
---

# Review Questions

Synthesis questions across the whole topic. Answer out loud, connecting subfolders — that's the
point of this page, not repeating any single page's own questions.

- Trace `docker logs docs-app 2>&1 | grep -i error | tee errors-found.txt` end to end: which
  subfolder covers what `docker logs` returns as a *process's* output streams, which covers the
  `|`/`2>&1` mechanics, and which covers `grep`'s matching?

  <details>
  <summary>Answer</summary>

  Processes (a process has stdout/stderr as streams — the concept underlying "2>&1"); Text & Pipes
  covers the pipe/redirection syntax itself and `grep`'s pattern matching. `tee` is also Text &
  Pipes — writing to screen and file at once.
  </details>

- Why does adding a user to the `docker` group (Permissions & Users) matter for *running* Docker
  commands day to day, while `systemctl enable docker` (Practical Shell) matters for a completely
  different concern? What would break if only one of the two were done?

  <details>
  <summary>Answer</summary>

  Group membership controls who can talk to the Docker daemon without `sudo`; `enable` controls
  whether the daemon itself starts automatically on boot. Skipping group membership means every
  `docker` command needs `sudo`; skipping `enable` means Docker doesn't come back up after a
  reboot even though a user could otherwise run it fine.
  </details>

- `find . -name "*.tmp" -exec rm {} \;` combines Text & Pipes content with the same underlying risk
  covered in Basics. What's the shared danger, and how does it manifest differently in each case?

  <details>
  <summary>Answer</summary>

  Both are "an unconfirmed destructive command acting on more than you intended" — `rm -rf` in
  Basics risks acting on the wrong directory after a `cd`; `find -exec rm` risks an overly broad
  `-name` pattern matching more files than expected, with no per-file confirmation either way.
  </details>

- A deploy script fails partway through. Walk through which commands from Processes, Practical
  Shell, and Package Management you'd run, in order, to find out why — and justify the order using
  the "work backwards through layers" principle from Troubleshooting a Server.

  <details>
  <summary>Answer</summary>

  Check disk/memory first (cheapest, most common cause), then whether the relevant systemd service
  is even running (`systemctl status`), then process-level state (`ps aux`/`docker ps -a`), then
  logs (`journalctl`/`docker logs`) — each step rules out one whole category before spending time
  investigating the next, rather than jumping straight to reading application logs.
  </details>

- Why does `sudo usermod -aG docker deploy` require a new login to take effect, but `export
  PATH=...` takes effect immediately in the same shell? What's the actual difference in when each
  one is read?

  <details>
  <summary>Answer</summary>

  Group membership is resolved once, at login/session start; `export` immediately updates the
  current shell's own environment, which any process it launches from that point on inherits — no
  new login needed because nothing about `export` depends on session-start-time state.
  </details>

- `chmod 600 id_ed25519` (Permissions) and `set -e` in a deploy script (Practical Shell) are both
  described as "small thing that prevents a much worse failure." What specifically does each one
  prevent?

  <details>
  <summary>Answer</summary>

  `chmod 600` prevents SSH from refusing to use a private key it considers too permissively
  readable; `set -e` prevents a script from continuing past a failed command into a state built on
  a false assumption that an earlier step succeeded.
  </details>

- How does `kill` vs. `kill -9` (Processes) relate to why `visudo` exists instead of editing
  `/etc/sudoers` directly (Permissions & Users)? What's the common theme?

  <details>
  <summary>Answer</summary>

  Both pairs contrast a "graceful, checked" option against a "raw, no-safety-net" option: SIGTERM
  lets a process clean up before exiting where SIGKILL doesn't, and `visudo` validates syntax
  before saving where a plain editor doesn't — in both cases the safer option costs nothing extra
  in the common case but prevents real damage in the failure case.
  </details>

- A background job started with plain `&` (Processes) dies when you disconnect from SSH. Which two
  different fixes does the topic offer, and what's the actual tradeoff between them (not just "one
  works, one doesn't")?

  <details>
  <summary>Answer</summary>

  `nohup`/`disown` keep that one specific process running unattended after disconnect; `tmux`/
  `screen` keep a whole interactive session alive that you can reconnect to and keep working in —
  the first is simpler for a one-off task, the second is the right tool when you need to actually
  check back in and keep issuing commands.
  </details>

- Why does the topic cover `apt`/`dnf` (Package Management) as separate from `npm`/`pip`, and how
  does that distinction show up again in the Docker worked example's step 1 vs. what a
  `docker-compose.yml`-driven app deployment would use instead?

  <details>
  <summary>Answer</summary>

  `apt`/`dnf` install system-level software (Docker itself, onto the host OS); a Node/Python app's
  own dependencies inside a container come from a language-level manager (`npm`/`pip`) running
  *inside* that container's build — the two operate at entirely different layers and never
  substitute for each other.
  </details>

- `journalctl -u docker` (Practical Shell) and `ps aux | grep node` (Processes/Text & Pipes) both
  answer "what's going on with a specific thing," but from different angles. What's the actual
  difference in what each one can tell you that the other can't?

  <details>
  <summary>Answer</summary>

  `journalctl -u docker` shows a service's historical and structured log output over time (why it
  started, stopped, or errored); `ps aux | grep node` shows a live snapshot of whether a matching
  process is currently running at all, with no history — one answers "what happened," the other
  answers "what's running right now."
  </details>

- Given everything in Package Management and Permissions & Users, explain why a freshly installed
  Docker on a new server initially requires `sudo` for every `docker` command, and exactly which
  single step removes that requirement.

  <details>
  <summary>Answer</summary>

  By default only root can talk to the Docker daemon's socket; `sudo usermod -aG docker <user>`
  (followed by a new login) adds the user to the group that's granted access to that socket,
  removing the need for `sudo` on every subsequent `docker` command.
  </details>

- Why does understanding "everything is a file" (Basics) make `/proc/1234` a meaningful thing to
  `cat`, and how does that connect to how `ps aux` (Processes) actually gets its information?

  <details>
  <summary>Answer</summary>

  Linux exposes live process information as pseudo-files under `/proc/<pid>`, so the same
  file-reading tools work on process state as on ordinary files; `ps` itself is essentially reading
  and formatting data from exactly that `/proc` filesystem rather than some separate hidden API.
  </details>
