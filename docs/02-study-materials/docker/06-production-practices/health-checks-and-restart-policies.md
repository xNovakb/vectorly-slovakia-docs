---
sidebar_position: 2
title: Health Checks & Restart Policies
---

# Health Checks & Restart Policies

"The container is running" and "the app inside it is actually working" are genuinely different
facts — a `HEALTHCHECK` is how Docker learns the difference, instead of only knowing whether the
main process has crashed outright.

## Defining a healthcheck

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

```yaml title="Or in docker-compose.yml"
services:
  api:
    build: .
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

Docker runs this command on a schedule; a non-zero exit code counts as unhealthy. After enough
consecutive failures (`retries`), the container is marked `unhealthy` in `docker ps` — visible to
anything watching (an orchestrator, `depends_on: condition: service_healthy` as covered in
[Multi-Container Apps](../05-docker-compose/multi-container-apps.md), monitoring tooling).

## What a `/health` endpoint should actually check

```js title="A meaningfully useful health endpoint"
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');       // can it actually reach its real dependencies?
    res.status(200).send('ok');
  } catch (err) {
    res.status(503).send('unavailable');
  }
});
```

A health endpoint that only returns `200 OK` unconditionally (without checking anything real)
provides no more information than the process simply being alive — the entire point is catching
the case where the process is running but genuinely can't do its job (lost its database
connection, ran out of disk, a dependency is down).

## `docker ps` reflecting health status

```bash
docker ps
# CONTAINER ID   IMAGE      STATUS
# a1b2c3d4       my-api     Up 5 minutes (healthy)
# e5f6g7h8       my-worker  Up 2 minutes (unhealthy)
```

This status alone is often the fastest first check when something's wrong — an `(unhealthy)`
container tells you immediately to look at *that* service's own logs
(see [Exec, Logs & Inspect](../03-running-containers/exec-logs-and-inspect.md)) rather than
guessing across an entire multi-container app.

## Restart policies, revisited with health in mind

Covered at a basic level in
[Container Lifecycle](../03-running-containers/container-lifecycle.md) — the connection to
healthchecks specifically:

```text
restart: unless-stopped   — restarts if the container CRASHES (process exits)
HEALTHCHECK               — detects the process is running but not actually WORKING
```

A restart policy alone doesn't help a container that's stuck running but unresponsive (deadlocked,
hung on a dependency) — the process never actually exits, so Docker never has a reason to restart
it. This is exactly the gap a healthcheck closes: Docker (or an orchestrator built on top of it)
can act on "unhealthy," not just "crashed."

:::note
Plain Docker Compose doesn't automatically *restart* a container just because it's marked
unhealthy — `HEALTHCHECK` reports status, it doesn't by itself trigger a restart. Orchestration
platforms built on top of container health status (Kubernetes, Docker Swarm) do act on it
automatically; plain `docker compose` mostly uses it for `depends_on: condition: service_healthy`
and for visibility in `docker ps`.
:::

## A sensible default for most services

```yaml
services:
  api:
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s     # grace period before failed checks count, while the app is still starting up
```

`start_period` matters for apps with any real startup time — without it, a slow-starting app can
get marked unhealthy (or even restarted) before it's had a fair chance to finish booting.
