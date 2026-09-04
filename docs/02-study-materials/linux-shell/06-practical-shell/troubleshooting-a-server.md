---
sidebar_position: 4
title: Troubleshooting a Server
---

# Troubleshooting a Server

A short, practical checklist for "the server is acting weird" — pulling together commands from
across this whole section into the order that actually diagnoses something.

## Disk space

```bash
df -h              # disk usage per mounted filesystem, human-readable
du -sh /opt/*         # size of each top-level folder under /opt, human-readable
du -sh /var/log/*       # a very common culprit — logs that were never rotated/cleaned
```

A server that's "acting weird" — a service silently failing, a deploy that doesn't complete — is
disproportionately often just a full disk, and `df -h` is a five-second check that rules that in
or out before looking anywhere else.

## Memory

```bash
free -h             # total/used/free RAM, human-readable
top                    # live view, sorted by resource usage (see Managing Processes)
```

## What's actually running

```bash
ps aux                          # every process
systemctl status docker           # is the core service even up? (see systemd & Services)
docker ps                           # every running container
docker ps -a                          # every container, including stopped ones — a container that exited is easy to miss with plain `docker ps`
```

## Reading logs

```bash
journalctl -xe                    # recent system log, with extra context on errors
journalctl -u docker -n 100         # last 100 lines from Docker's own service log
docker logs docs-app --tail 100       # last 100 lines from one specific container
docker logs docs-app -f                 # follow a container's logs live
```

## Network-level checks

Covered in depth in the SSH & Networking topic — the short version, from inside the server:

```bash
ss -tlnp                     # what's actually listening, and on which port
curl -sI http://localhost:80    # is the app answering locally, at all?
```

See [Troubleshooting Connectivity](/study-materials/networking/practical-setups/troubleshooting-connectivity) for
the full external-facing version of this (DNS, TLS, reverse proxy) — this page is specifically the
"I'm already logged into the server" half.

## A worked example: "the docs site is down"

```bash
ssh docs-server                                    # 1. can I even get in?
df -h                                                # 2. is the disk full?
systemctl status docker                               # 3. is Docker itself running?
docker ps -a                                             # 4. is docs-app running, or did it exit?
docker logs docs-app --tail 50                             # 5. why did it exit / what's it doing?
curl -sI http://localhost:80                                 # 6. is it actually answering, even locally?
```

Six commands, each ruling out one layer, before ever touching application code — the same
"work backwards through the chain" principle as
[Troubleshooting Connectivity](/study-materials/networking/practical-setups/troubleshooting-connectivity), applied
from inside the machine instead of outside it.

## The general principle

Every command on this page answers exactly one question: is there space, is there memory, is the
right thing running, what does it say about itself, is it reachable. Work through them in that
order rather than guessing — each one rules out an entire category of cause.
