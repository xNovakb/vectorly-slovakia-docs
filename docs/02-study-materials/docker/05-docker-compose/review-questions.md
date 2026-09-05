---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- An `api` service `depends_on` a `db` service with no `condition:` set, and `api` occasionally
  fails to connect right after `docker compose up`. Per [Multi-Container Apps](./multi-container-apps.md),
  why does plain `depends_on` not prevent this, and what actually fixes it?

  <details>
  <summary>Answer</summary>

  Plain `depends_on` only guarantees start *order* — Docker starts `db`'s container before `api`'s,
  but doesn't wait for `db` to actually be ready to accept connections. `depends_on: db: condition:
  service_healthy` fixes it, since that waits for `db`'s own healthcheck to report healthy, not
  just "the process started."
  </details>

- Why can `api` and `worker` in a Compose file both connect to a database using the hostname `db`
  instead of an IP address, and how is that the *same* underlying mechanism as
  [Ports & Network Modes](../04-networking-and-storage/ports-and-network-modes.md)'s custom Docker
  network DNS?

  <details>
  <summary>Answer</summary>

  Compose automatically places every service in one `docker-compose.yml` on a shared network with
  built-in DNS resolving service names to the right container — exactly the same name-resolution
  mechanism a manually created custom Docker network provides, just set up automatically instead
  of by hand with `docker network create`.
  </details>

- `docker compose down` and `docker compose down -v` both stop and remove every service's
  containers. What's the one difference, and why does [Compose Basics](./compose-basics.md) call
  it out as a `:::warning`?

  <details>
  <summary>Answer</summary>

  `-v` additionally removes the project's volumes — for a service with a database, that destroys
  its data permanently, unlike plain `down`, which leaves volumes (and their data) intact for the
  next `up`.
  </details>

- Why does this org run its docs site and its main marketing site as two entirely separate Compose
  projects instead of one shared `docker-compose.yml`, per
  [Compose in This Org's Deploy](./compose-in-this-orgs-deploy.md)?

  <details>
  <summary>Answer</summary>

  Each site deploys independently (a push to one repo only rebuilds that site's container), each
  has its own build pipeline appropriate to that site, and a mistake in one site's Compose file
  can't accidentally break the other's deployment — benefits a single shared file would lose.
  </details>

- How do the two separate Compose projects in this org's setup still let Caddy reach both
  `docs-app` and `astro-app` by name, despite being deployed independently with no shared Compose
  file?

  <details>
  <summary>Answer</summary>

  Both declare the same external `proxy-net` network as `external: true` rather than each creating
  their own — attaching to that one pre-existing shared bridge network is what lets Caddy resolve
  `docs-app` and `astro-app` by name, entirely independent of which Compose project created which
  container.
  </details>

