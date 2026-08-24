---
sidebar_position: 1
title: Server Architecture
---

# Server Architecture

## Core infrastructure

- **Hosting:** Netcup VPS, Linux (Fedora/Ubuntu-based), Docker.
- **Server user:** `bnovak`
- **Network:** all public-facing services run as isolated Docker containers attached to a shared external Docker bridge network, `proxy-net`.
- **Reverse proxy:** Caddy container is the single entry point for all incoming web traffic — automated SSL/TLS certs + routing.
- **DNS:** wildcard `*.vectorly-slovakia.sk` maps to the server's public IP.

## Active services

### Main site — `vectorly-slovakia.sk`

| | |
|---|---|
| Repository | `xNovakb/vectorly-slovakia-main-page` (private) |
| Deploy directory | `/opt/vectorly-main-site` |
| Stack | Astro (SSG) + Node.js 22 builder → Nginx (Alpine) runner |
| Container | `astro-app` |

Caddy route:

```caddyfile
vectorly-slovakia.sk, www.vectorly-slovakia.sk {
    reverse_proxy astro-app:80
}
```

CI/CD: GitHub Actions on push to `develop` → SSH via `appleboy/ssh-action` → git pull/clone using the default `~/.ssh/github_actions` key → `docker compose up -d --build`.

### Docs portal — `docs.vectorly-slovakia.sk` (this site)

| | |
|---|---|
| Repository | `xNovakb/vectorly-docs` (private, TypeScript) |
| Deploy directory | `/opt/vectorly-docs` |
| Stack | Docusaurus (TypeScript) + Node.js 22 builder → Nginx (Alpine) runner |
| Container | `docs-app` |
| Security | Caddy HTTP Basic Auth (bcrypt hash) |

Caddy route:

```caddyfile
docs.vectorly-slovakia.sk {
    basicauth /* {
        bnovak <secure-bcrypt-hash>
    }
    reverse_proxy docs-app:80
}
```

CI/CD: GitHub Actions on push to `main` → SSH deploy using a dedicated deploy key (`vectorly_docs_key`) via SSH config alias `github-docs`, to avoid key collision with the main-site repo. See [Git & CI/CD Workflow](./git-workflow.md).

## SSH key architecture

Multiple private repos on one host, one deploy key per repo (GitHub restriction) → multi-key `~/.ssh/config`:

```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_actions
    IdentitiesOnly yes

Host github-docs
    HostName github.com
    User git
    IdentityFile ~/.ssh/vectorly_docs_key
    IdentitiesOnly yes
```

- `github_actions` — tied to the main marketing site repo.
- `vectorly_docs_key` — read-only deploy key, scoped strictly to `vectorly-docs`.
