---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A postgres container is run with no `-v` flag at all, works fine for weeks, then loses all its
  data on the next redeploy. Using [Data Persistence](./data-persistence.md), explain exactly what
  happened and why Docker doesn't consider it an error.

  <details>
  <summary>Answer</summary>

  Without a mounted volume, postgres was writing its data into the container's own ephemeral
  writable layer. A redeploy that recreates the container (`docker rm` + a new `docker run`)
  discards that writable layer entirely — from Docker's perspective this is exactly what removing
  a container is supposed to do, not a malfunction.
  </details>

- What's the concrete difference between `docker volume create app-data` used with `-v
  app-data:/data` versus `-v /home/deploy/config:/data`, per
  [Volumes & Bind Mounts](./volumes-and-bind-mounts.md), and which one is right for a database's
  data directory vs. for live-editing source code in local dev?

  <details>
  <summary>Answer</summary>

  The first is a named volume — Docker manages where it lives on disk, and it's portable across
  hosts by name. The second is a bind mount to a specific, known host path you control directly.
  A database's data directory should use a named volume (production data, no need to touch it
  directly from the host); live-editing source code in dev needs a bind mount, since you're
  actively editing those exact files from the host.
  </details>

- Without `-p`, a container's port is only reachable by other containers on the same network, not
  from the host or internet. How does that same default explain why this org's `docs-app`
  container publishes no `ports:` at all in its Compose file?

  <details>
  <summary>Answer</summary>

  `docs-app` only needs to be reachable by Caddy, which is another container on the same
  `proxy-net` bridge network — so it never needs `-p`/`ports:` at all. Not publishing a port isn't
  a missing feature, it's what deliberately makes the app container unreachable from the internet
  except through Caddy.
  </details>

- Why does the *default* `bridge` network not let two containers reach each other by name, while a
  *custom* network (or a Compose-created one) does?

  <details>
  <summary>Answer</summary>

  Docker's built-in DNS-based name resolution for containers is only provided on user-created
  networks, not the default `bridge` network — which is exactly why real setups (including this
  org's `proxy-net`) create a named custom network rather than relying on the default one.
  </details>

- `docker rm -f my-app` is run on a container that had a named volume attached. Does the volume's
  data survive, and how does that connect to why a database container should always use a named
  volume rather than depending on its writable layer?

  <details>
  <summary>Answer</summary>

  Yes — removing a container does not remove volumes it had mounted, by default. That's precisely
  the property that makes a named volume the right fix: the data's lifecycle becomes independent
  of any specific container, surviving exactly the kind of removal that would otherwise destroy
  data living only in the writable layer.
  </details>

