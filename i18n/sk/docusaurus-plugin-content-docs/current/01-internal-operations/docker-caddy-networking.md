---
sidebar_position: 2
title: Docker a Caddy sieťovanie
---

# Docker a Caddy sieťovanie

Všetky služby zdieľajú jednu externú Docker bridge sieť, `proxy-net`, s Caddy ako jediným reverzným proxy vstupným bodom, ktorý rieši TLS terminovanie a smerovanie podľa hostname.

## Kontajner Caddy

`docker-compose.yml` pre samotný kontajner Caddy:

```yaml
services:
  caddy:
    image: caddy:2-alpine
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp" # Potrebné pre výkon HTTP/3
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - ./data:/data     # Trvalé úložisko SSL certifikátov
      - ./config:/config
    networks:
      - proxy-net

networks:
  proxy-net:
    external: true
```

- Jediný kontajner na `proxy-net`, ktorý publikuje porty na hosta — všetky ostatné služby zostávajú interné, dostupné len cez Caddy.
- `./data` uchováva Let's Encrypt certifikáty naprieč znovuvytvorením kontajnera — nikdy ho nemazať bez zálohy.
- `443:443/udp` zapína HTTP/3 (QUIC).

## Nastavenie `proxy-net`

```bash
docker network create proxy-net
```

Každý `docker-compose.yml` pre verejne dostupnú službu sa k nej pripája ako externej:

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

## Pridanie novej služby

1. Kontajner sa pripojí na `proxy-net`, port vystaví len interne (nie je potrebné publikovať port na hosta).
2. Do Caddy pridať site block smerujúci hostname na `<názov-kontajnera>:<port>`.
3. Reload Caddy (`docker exec caddy caddy reload --config /etc/caddy/Caddyfile`) alebo reštart kontajnera.

Aktuálne Caddy routy pre jednotlivé služby pozri v [Architektúra servera](./server-architecture.md).
