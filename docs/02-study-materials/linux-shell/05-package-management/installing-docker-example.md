---
sidebar_position: 3
title: "Worked Example: Installing Docker"
---

# Worked Example: Installing Docker

A concrete, end-to-end example tying package management, users/groups, and permissions together —
exactly how Docker itself, the thing every container in this org's stack runs on (see
[`/internal-operations/server-architecture`](/internal-operations/server-architecture)), actually
gets onto a fresh server.

## 1. Install it via the package manager

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io

# Fedora/RHEL
sudo dnf install docker
```

See [apt & dnf](./apt-and-dnf.md) for what each of these steps actually does, and note the
distro-bundled version can lag behind Docker's own official repo — see that page's "Adding a
third-party repository" section if a newer version is specifically needed.

## 2. Start it and enable it on boot

Docker runs as a background **service**, managed by systemd (covered properly in
[systemd & Services](../06-practical-shell/systemd-and-services.md)):

```bash
sudo systemctl start docker      # start it now
sudo systemctl enable docker       # start it automatically on every future boot
sudo systemctl status docker         # confirm it's actually running
```

## 3. Let a non-root user run `docker` commands

By default, only `root` can talk to the Docker daemon — running `docker ps` as a regular user
fails with a permission error. The fix ties directly back to
[Users & Groups](../02-permissions-and-users/users-and-groups.md):

```bash
sudo usermod -aG docker deploy      # add "deploy" to the docker group
```

You have to **log out and back in** (or start a new shell session) for a new group membership to
take effect — a very common "I ran the command but it still doesn't work" trap.

```bash
groups        # confirm "docker" now shows up in your group list
docker ps       # should now work without sudo
```

:::note
Being in the `docker` group is functionally equivalent to having root access on that machine — any
container can be configured to mount the host filesystem. This is a deliberate, understood
tradeoff for developer convenience, not an oversight — treat docker-group membership with the same
care as sudo rights (see [Sudo & Root](../02-permissions-and-users/sudo-and-root.md)), not as a
harmless convenience toggle.
:::

## 4. Verify with a real container

```bash
docker run hello-world
```

Pulls a tiny test image and runs it — a successful run confirms the daemon is reachable, your user
has permission, and networking/image-pulling all work end to end.

## What this example demonstrates

Every piece from this section shows up in one realistic task: `apt`/`dnf` to install the software,
`systemctl` to run it as a persistent service, `usermod`/groups to grant a regular user access
without needing `sudo` for every single command. None of these topics exist in isolation on a real
server.
