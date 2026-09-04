---
sidebar_position: 2
title: apt & dnf
---

# apt & dnf

Two different package managers, same job — which one you use depends on the Linux distribution:
`apt` on Debian/Ubuntu, `dnf` on Fedora/RHEL. This org's VPS is Fedora/Ubuntu-based (see
[`/internal-operations/server-architecture`](/internal-operations/server-architecture)), so
whichever it's running dictates which of these applies.

## Core commands, side by side

| Task | apt (Debian/Ubuntu) | dnf (Fedora/RHEL) |
|---|---|---|
| Refresh package list | `sudo apt update` | (dnf checks automatically) |
| Install a package | `sudo apt install docker.io` | `sudo dnf install docker` |
| Remove a package | `sudo apt remove docker.io` | `sudo dnf remove docker` |
| Upgrade everything | `sudo apt upgrade` | `sudo dnf upgrade` |
| Search for a package | `apt search nginx` | `dnf search nginx` |
| Show package info | `apt show nginx` | `dnf info nginx` |
| List installed packages | `apt list --installed` | `dnf list installed` |

## `apt update` vs. `apt upgrade` — a common mix-up

- `apt update` — refreshes the local list of *what's available* in the configured repositories. It
  installs nothing itself.
- `apt upgrade` — actually installs newer versions of packages you already have, based on that
  refreshed list.

`dnf` doesn't need the separate `update` step — it checks repository metadata freshness
automatically as part of every command, which is a real behavioral difference, not just a naming
one.

```bash
sudo apt update && sudo apt upgrade -y     # the standard "get everything current" pair, in one line
```

## Adding a third-party repository

The default repos don't have everything — Docker's own official packages are the clearest example
(distro-bundled Docker packages are often older):

```bash
# Ubuntu/Debian, simplified
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker.gpg
echo "deb [signed-by=/usr/share/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update
sudo apt install docker-ce
```

The `gpg`/`signed-by` steps matter — they verify packages from this new repository are actually
signed by Docker, not tampered with; skipping that verification step is how supply-chain attacks
happen.

## Cleaning up

```bash
sudo apt autoremove       # remove packages that were installed as dependencies and are no longer needed
sudo apt clean               # clear the local cache of downloaded .deb files
```

```bash
sudo dnf autoremove
sudo dnf clean all
```

Worth running occasionally on a long-lived server — package caches and orphaned dependencies
accumulate disk usage over time (see
[Troubleshooting a Server](../06-practical-shell/troubleshooting-a-server.md) for checking disk
usage generally).
