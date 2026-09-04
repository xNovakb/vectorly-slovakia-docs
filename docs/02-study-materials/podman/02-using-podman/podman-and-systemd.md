---
sidebar_position: 3
title: Podman & systemd
---

# Podman & systemd

A direct consequence of Podman's daemonless architecture (see
[What Is Podman](../01-basics/what-is-podman.md)): since there's no central daemon already
supervising containers, Podman leans on **systemd** — the same init system covered in
[systemd & Services](/study-materials/linux-shell/practical-shell/systemd-and-services) in the
Linux & Shell topic — to do that job instead, for anything meant to run as a persistent, managed
service.

## Why this matters, compared to Docker

Docker's daemon already provides its own restart-policy mechanism (`--restart unless-stopped`,
covered in [Container Lifecycle](/study-materials/docker/running-containers/container-lifecycle) in
the Docker topic) — the daemon itself supervises containers and restarts them per that policy.
Podman has no daemon to do that supervising, so a rootless Podman container started by hand simply
stops existing when the shell that started it exits, with nothing watching to restart it. systemd
is Podman's answer to that gap.

## Generating a systemd unit from a container

```bash
podman run -d --name web nginx
podman generate systemd --name web --files --new
```

Produces a `.service` unit file describing exactly how to (re)create and run that container —
`--new` means the generated unit creates a fresh container each time it starts, rather than
starting/stopping a pre-existing one, which plays more naturally with systemd's own
start/stop/restart model.

```ini title="container-web.service (generated)"
[Unit]
Description=Podman container-web.service

[Service]
Restart=on-failure
ExecStart=/usr/bin/podman run --name web nginx
ExecStop=/usr/bin/podman stop web

[Install]
WantedBy=default.target
```

## Installing and managing it

```bash
mkdir -p ~/.config/systemd/user/
cp container-web.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now container-web.service
```

`systemctl --user` (rather than plain `systemctl`) manages a **user-level** systemd service —
matching Podman's rootless-by-default model (see
[Rootless by Default](../01-basics/rootless-by-default.md)): the container and the service
managing it both run as your regular user, no root or system-wide service needed.

```bash
systemctl --user status container-web.service     # exact same systemctl commands from Linux & Shell
journalctl --user -u container-web.service -f        # same journalctl workflow too
```

Everything from
[systemd & Services](/study-materials/linux-shell/practical-shell/systemd-and-services) in the
Linux & Shell topic — `systemctl status`/`restart`/`enable`, reading logs with `journalctl` —
applies directly here, just scoped to the current user instead of the whole system.

## Running at boot, without the user being logged in

```bash
loginctl enable-linger deploy
```

By default, user-level systemd services stop when that user logs out. `loginctl enable-linger`
keeps a user's systemd services (including Podman containers managed this way) running even
without an active login session — the practical equivalent of Docker's daemon-managed containers
surviving independently of any particular SSH session.
