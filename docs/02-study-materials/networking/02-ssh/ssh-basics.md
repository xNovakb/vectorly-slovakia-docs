---
sidebar_position: 1
title: SSH Basics
---

# SSH Basics

**SSH** (Secure Shell) is a protocol for getting an encrypted terminal session on a remote
machine — the standard way to administer a server that isn't sitting in front of you.

```bash
ssh user@203.0.113.42                 # connect by IP
ssh deploy@docs.vectorly-slovakia.sk   # connect by hostname
```

Everything after that runs commands on the **remote** machine, not your own — a common source of
confusion when a command "doesn't work" because it was run in the wrong shell.

## Password vs. key authentication

- **Password auth** — type a password on connect. Works, but weaker (phishable, brute-forceable,
  often disabled entirely on production servers) and can't be automated safely.
- **Key auth** — a cryptographic keypair proves identity instead. The standard for anything beyond
  a quick personal test box. Covered in depth in [SSH Keys](./ssh-keys.md).

## What a session actually gives you

Once connected, you have a normal shell on the remote machine — same as sitting at its keyboard:

```bash
ssh deploy@docs.vectorly-slovakia.sk
whoami              # runs on the REMOTE machine
pwd
docker ps            # e.g. checking running containers, see server-architecture docs
exit                  # back to your own machine
```

## Running one command without a full session

```bash
ssh deploy@docs.vectorly-slovakia.sk "docker ps"
```

Runs `docker ps` remotely, prints the output locally, and disconnects — useful in scripts or CI
where you don't want an interactive shell.

## Copying files over SSH

```bash
scp local-file.txt deploy@docs.vectorly-slovakia.sk:/opt/vectorly-docs/    # upload
scp deploy@docs.vectorly-slovakia.sk:/opt/vectorly-docs/backup.tar.gz .     # download
```

`scp` reuses the same authentication as `ssh` — if key-based `ssh` login works, `scp` works too,
no separate setup.

## Where SSH access fits into this org

The deploy pipeline uses a dedicated SSH key (`vectorly_docs_key`) to connect from GitHub Actions
to the VPS and run the deploy — see
[`/internal-operations/git-workflow`](/internal-operations/git-workflow) and
[`/internal-operations/server-architecture`](/internal-operations/server-architecture) for the
real setup this describes in general terms.
