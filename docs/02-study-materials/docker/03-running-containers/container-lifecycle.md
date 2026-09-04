---
sidebar_position: 1
title: Container Lifecycle
---

# Container Lifecycle

## The core commands

```bash
docker run -d --name my-app nginx      # create AND start a new container, in the background
docker stop my-app                       # gracefully stop it (sends SIGTERM, then SIGKILL after a timeout)
docker start my-app                        # start an existing, stopped container again
docker restart my-app                        # stop then start
docker rm my-app                               # remove a stopped container entirely
docker rm -f my-app                              # force-remove, even if still running
```

## `docker run` vs. `docker start` — a common mix-up

`docker run` **creates a brand-new container** from an image every time — running it twice
creates two separate containers, unless `--name` is reused (which then errors, since names must
be unique):

```bash
docker run -d --name web nginx     # creates + starts container "web"
docker run -d --name web nginx       # ERROR: name "web" already in use
docker start web                       # correct way to start that SAME container again
```

`docker start` only works on a container that already exists (see
[Images vs. Containers](../01-basics/images-vs-containers.md) — this is exactly the
image/container distinction in practice).

## Common flags on `docker run`

```bash
docker run -d nginx                  # detached — runs in the background, returns your shell immediately
docker run -it ubuntu bash             # interactive + a TTY — for a shell you'll actually type into
docker run --rm alpine echo hi           # automatically remove the container once it exits — good for one-off commands
docker run --name my-app nginx             # give it a memorable name instead of a random one
docker run -p 8080:80 nginx                  # publish a port (see Ports & Network Modes)
docker run -e NODE_ENV=production my-app       # set an environment variable (see Environment & Secrets)
```

## Restart policies

```bash
docker run -d --restart unless-stopped my-app
```

```text
no              — never restart automatically (the default)
on-failure        — restart only if it exits with a non-zero code
always              — always restart, even after a reboot of the host (if Docker itself is set to start on boot)
unless-stopped        — like always, but won't restart if it was manually stopped
```

For anything meant to run continuously (a web server, a database), `unless-stopped` is usually the
right default — see
[Health Checks & Restart Policies](../06-production-practices/health-checks-and-restart-policies.md)
for combining this with an actual health check instead of just "the process didn't crash."

## Listing containers

```bash
docker ps                # running containers only
docker ps -a               # every container, including stopped ones
docker ps -a --filter "status=exited"    # just the stopped/exited ones
```

A container that exited (crashed, or its main process finished) doesn't disappear — it stays
listed in `docker ps -a` until explicitly removed, which is exactly what makes it possible to
inspect *why* it exited afterward (see
[Exec, Logs & Inspect](./exec-logs-and-inspect.md)).
