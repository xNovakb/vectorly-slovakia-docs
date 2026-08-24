---
sidebar_position: 3
title: Backup & Recovery Plan
---

# Backup & Recovery Plan

> TODO: fill in — backup schedule, retention, storage target, and step-by-step server recovery procedure.

## Scope

- VPS-level (Netcup) snapshot/backup coverage
- Per-service Docker volume backups (databases, uploaded files)
- Client-specific backup scripts — see each client's handbook under [Clients](/clients/mbm-group/overview)

## Recovery runbook

> TODO: document rebuild-from-scratch steps: reprovision VPS, restore `~/.ssh/config` + deploy keys (see [Server Architecture](./server-architecture.md)), re-create `proxy-net`, redeploy each service via its CI/CD pipeline or `docker compose up -d --build`.
