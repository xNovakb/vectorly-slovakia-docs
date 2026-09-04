---
sidebar_position: 2
title: "Exec, Logs & Inspect"
---

# Exec, Logs & Inspect

The core toolkit for figuring out what a running (or crashed) container is actually doing —
directly analogous to the Linux troubleshooting habits in the
[Linux & Shell](/study-materials/linux-shell/basics/what-is-a-shell) topic, just aimed at one container instead of the
whole host.

## Getting a shell inside a running container

```bash
docker exec -it my-app bash        # a shell inside the container, if bash is available
docker exec -it my-app sh            # fall back to sh — many minimal images (alpine) don't have bash
```

`docker exec` runs a **new** process inside an *already-running* container — it doesn't start the
container, and it exits independently of the container's own main process. Closing this shell
doesn't stop the container, unlike the main process exiting.

```bash
docker exec my-app cat /app/config.json     # run one command, no interactive shell needed
```

## Reading logs

```bash
docker logs my-app              # everything the container's main process has printed to stdout/stderr
docker logs -f my-app             # follow live — same idea as `tail -f` (see Viewing & Editing in Linux & Shell)
docker logs --tail 100 my-app       # just the last 100 lines
docker logs --since 1h my-app         # only the last hour
```

This is why a well-behaved containerized app logs to **stdout/stderr** rather than writing to its
own log file inside the container — `docker logs` only captures what's printed to those two
streams, and a log file written elsewhere inside the container's writable layer is lost the moment
the container is removed (see [Images vs. Containers](../01-basics/images-vs-containers.md)).

## Inspecting a container's configuration

```bash
docker inspect my-app
```

Dumps the container's full configuration as JSON — mounted volumes, network settings, environment
variables, restart policy, exit code if it stopped. Usually easier to query a specific field
directly instead of reading the whole thing:

```bash
docker inspect my-app --format '{{.State.ExitCode}}'      # why did it stop?
docker inspect my-app --format '{{.NetworkSettings.IPAddress}}'   # what's its internal IP?
```

## Debugging a container that keeps crashing

```bash
docker ps -a                              # 1. confirm it actually exited, and note the container ID
docker logs my-app                          # 2. what did it print before dying?
docker inspect my-app --format '{{.State.ExitCode}}'   # 3. what exit code? (0 = clean exit, non-zero = error)
docker run -it my-app sh                        # 4. run it interactively instead of detached, to watch it fail live
```

If step 4's interactive run also exits immediately, the container's main process itself is
crashing on startup (a config problem, a missing dependency) — not a Docker problem at all, which
narrows the search significantly before touching application code.

## Copying files in and out

```bash
docker cp my-app:/app/logs/error.log ./error.log     # copy FROM the container to your host
docker cp ./config.json my-app:/app/config.json         # copy TO the container
```

Useful for a one-off inspection, but not a substitute for
[Volumes & Bind Mounts](../04-networking-and-storage/volumes-and-bind-mounts.md) when files need to
persist or sync continuously.
