---
sidebar_position: 3
title: systemd & Services
---

# systemd & Services

**systemd** is the init system on most modern Linux distributions — the very first process that
starts at boot (PID 1, see
[What Is a Process](../03-processes/what-is-a-process.md)), responsible for starting, stopping,
and supervising every other long-running background service, including Docker itself.

## Checking a service

```bash
systemctl status docker
```

```text
● docker.service - Docker Application Container Engine
     Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2026-09-04 08:12:03 UTC; 2 days ago
```

`Loaded` + `enabled` = it's configured to start automatically on boot. `Active: running` = it's
currently up. This single command answers most "is X actually running" questions on a server
faster than hunting for a PID manually.

## Controlling a service

```bash
sudo systemctl start docker         # start it now
sudo systemctl stop docker            # stop it now
sudo systemctl restart docker           # stop then start — the standard way to apply a config change
sudo systemctl reload docker              # re-read config WITHOUT a full restart (not every service supports this)
sudo systemctl enable docker                # start automatically on every future boot
sudo systemctl disable docker                 # stop starting automatically on boot
```

`restart` vs. `reload`: `restart` briefly interrupts the service entirely (any in-flight
connections drop); `reload` asks the service to re-read its config in place, if it supports doing
so gracefully — check the service's own docs before assuming `reload` is safe/sufficient for a
given change.

## Reading logs — `journalctl`

systemd captures a managed service's logs centrally, rather than each service writing its own log
file independently:

```bash
journalctl -u docker              # every log entry for the docker service
journalctl -u docker -f             # follow live, like tail -f (see Viewing & Editing)
journalctl -u docker --since "1 hour ago"
journalctl -u docker -n 100          # last 100 lines
```

## Why this matters for this org's stack

Docker itself is a systemd-managed service on this org's VPS — if a deploy seems to hang or a
container won't start, `systemctl status docker` and `journalctl -u docker` are the first two
commands worth running, *before* digging into the app-level `docker logs docs-app` (see
[`/internal-operations/server-architecture`](/internal-operations/server-architecture)) — they
tell you whether the problem is Docker itself, or something inside a specific container.

## A minimal custom service (context, not something this org currently needs)

For completeness — this is how you'd wire up your *own* long-running script to be managed by
systemd the same way, rather than relying on `nohup`/`tmux` (see
[Background & Jobs](../03-processes/background-and-jobs.md)):

```ini title="/etc/systemd/system/my-script.service"
[Unit]
Description=My long-running script

[Service]
ExecStart=/opt/scripts/my-script.sh
Restart=always
User=deploy

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload      # tell systemd to notice the new unit file
sudo systemctl enable --now my-script
```

`Restart=always` is the key advantage over a plain background process — systemd automatically
restarts it if it crashes, something `nohup` alone doesn't do.
