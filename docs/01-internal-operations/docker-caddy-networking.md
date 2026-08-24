---
sidebar_position: 2
title: Docker & Caddy Networking
---

# Docker & Caddy Networking

All services share one external Docker bridge network, `proxy-net`, with Caddy as the single reverse-proxy entry point handling TLS termination and routing by hostname.

## Caddy container

`docker-compose.yml` for the Caddy container itself:

```yaml
services:
  caddy:
    image: caddy:2-alpine
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp" # Required for HTTP/3 performance
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - ./data:/data     # Stores your SSL certificates permanently
      - ./config:/config
    networks:
      - proxy-net

networks:
  proxy-net:
    external: true
```

- Only container on `proxy-net` that publishes host ports — every other service stays internal, reached only through Caddy.
- `./data` persists Let's Encrypt certs across container recreation — never delete it without a backup.
- `443:443/udp` enables HTTP/3 (QUIC).

## `proxy-net` setup

```bash
docker network create proxy-net
```

Every `docker-compose.yml` for a public-facing service attaches to it as external:

```yaml
networks:
  proxy-net:
    external: true

services:
  app:
    # ...
    networks:
      - proxy-net
```

## Adding a new service

1. Container joins `proxy-net`, exposes its port internally only (no host port publish needed).
2. Add a Caddy site block routing the hostname to `<container-name>:<port>`.
3. Reload Caddy (`docker exec caddy caddy reload --config /etc/caddy/Caddyfile`) or restart the container.

See [Server Architecture](./server-architecture.md) for the current Caddy routes per service.
