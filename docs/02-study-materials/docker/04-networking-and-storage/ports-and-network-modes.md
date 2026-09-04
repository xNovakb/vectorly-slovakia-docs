---
sidebar_position: 1
title: Ports & Network Modes
---

# Ports & Network Modes

For the shared-bridge-network model this org actually uses in production (`proxy-net`,
containers reaching each other by name), see
[Docker Networking Basics](/study-materials/networking/practical-setups/docker-networking-basics)
in the Networking topic — this page covers the port-publishing and network-mode mechanics
underneath that.

## Publishing a port

```bash
docker run -p 8080:80 nginx
```

`-p HOST:CONTAINER` maps a port on the **host** to a port **inside the container**. Without `-p`,
a container's port is reachable by other containers on the same Docker network (see below), but
not from the host machine or the internet at all.

```bash
docker run -p 127.0.0.1:8080:80 nginx      # only reachable from the host itself, not the network
docker run -p 8080:80 -p 8443:443 nginx      # publish multiple ports
docker run -P nginx                            # publish EVERY exposed port to random host ports
```

## The three built-in network modes

```bash
docker run --network bridge nginx     # default — isolated virtual network, containers reach each other by name
docker run --network host nginx         # no isolation — container shares the host's network stack directly
docker run --network none nginx           # no networking at all
```

### `bridge` — the default, and usually the right choice

Containers get their own IP on a private virtual network; reaching them from outside requires
explicit `-p` publishing. Containers on the *same* bridge network can reach each other **by
container name** without any publishing at all — this is exactly the mechanism
[Docker Networking Basics](/study-materials/networking/practical-setups/docker-networking-basics)
covers for this org's `proxy-net`.

### `host` — no isolation, direct access to the host's network

```bash
docker run --network host nginx
```

The container uses the host's network interfaces directly — no port mapping needed, but also no
network isolation at all. Faster (skips the bridge's network translation overhead) but loses one
of the main benefits of containerizing in the first place; generally reserved for cases where that
overhead genuinely matters, not a default choice.

### `none` — fully isolated

```bash
docker run --network none alpine echo hi
```

No network access whatsoever — useful for a job that genuinely shouldn't be able to reach the
network at all (a pure computation task, or a deliberately sandboxed process).

## Custom networks — beyond the default `bridge`

```bash
docker network create my-app-net
docker run --network my-app-net --name api my-api-image
docker run --network my-app-net --name db postgres
```

A container on `my-app-net` can reach `db` by that name, thanks to Docker's built-in DNS for
custom networks — the *default* `bridge` network doesn't provide this name resolution, which is
part of why most real setups (including this org's `proxy-net`) create a named custom network
rather than relying on the default one.

## Checking what's actually published

```bash
docker port my-app                # what ports are published, and to where
docker inspect my-app --format '{{.NetworkSettings.Ports}}'
```
