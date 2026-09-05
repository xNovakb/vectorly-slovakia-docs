---
sidebar_position: 1
title: Review Questions
---

# Review Questions

Synthesis questions across the whole topic. Answer out loud, connecting subfolders — that's the
point of this page, not repeating any single page's own questions.

- Trace one full deploy of this docs site end-to-end: `git push`, `docker compose up -d --build`
  runs on the VPS, Caddy keeps routing to it with no config change. Name one concept from
  each of Basics, Images & Dockerfiles, Docker Compose, and Networking & Storage that this single
  deploy actually exercises.

  <details>
  <summary>Answer</summary>

  Basics: the new container is a fresh instance of a newly built image, sharing the host kernel.
  Images & Dockerfiles: the multi-stage build produces a minimal runtime image. Docker Compose:
  `docker compose up -d --build` recreates the `docs-app` service declaratively. Networking &
  Storage: Caddy keeps working unchanged because it routes to the container *name* `docs-app` on
  the shared `proxy-net`, not to a specific container instance.
  </details>

- Why does forgetting a volume on a database container and forgetting `.dockerignore` both produce
  "it worked fine until it didn't" bugs, even though one is a data-loss problem and the other is a
  build-hygiene problem?

  <details>
  <summary>Answer</summary>

  Both are silent by construction: a database with no volume works perfectly until the first
  container recreation wipes it, and a missing `.dockerignore` works fine until a stray local file
  (a `.env`, a platform-specific `node_modules`) happens to get copied into a build and causes a
  hard-to-trace failure or leak. Neither one errors at the moment the mistake is made — only later,
  when the consequence actually triggers.
  </details>

- A container is marked `(unhealthy)` in `docker ps`, but its restart policy is `unless-stopped`
  and it hasn't restarted. Why not, and what would need to be true for it to actually restart
  automatically?

  <details>
  <summary>Answer</summary>

  `unless-stopped` only reacts to the container's process actually exiting — a `HEALTHCHECK`
  failure alone doesn't trigger a restart under plain Docker or Compose, it just reports status.
  Automatically restarting on unhealthy status requires an orchestration layer built on top of
  that health signal (Kubernetes, Docker Swarm), not plain `docker compose` by itself.
  </details>

- Why does `docker build -t my-app:latest .` producing a bloated, slow-to-rebuild image usually
  trace back to Dockerfile instruction *order*, not to anything actually wrong with the
  application code?

  <details>
  <summary>Answer</summary>

  Because every layer after the first *changed* one is invalidated, an app that copies all its
  source before installing dependencies re-runs the expensive install step on every single code
  change, regardless of how good that code is — the fix (dependency files copied and installed
  before the rest of the app) is purely a Dockerfile ordering change, exercising exactly the layer
  caching mechanism covered in Images & Dockerfiles.
  </details>

- This org's production containers publish no `ports:` and always rebuild via multi-stage builds.
  Which subfolder's concept explains "why no port is published," and which explains "why the image
  is still small despite a Node.js build step"?

  <details>
  <summary>Answer</summary>

  Networking & Storage's port-publishing model explains why not publishing a port makes the app
  container unreachable from the internet by construction, reachable only via Caddy on the shared
  network. Production Practices' multi-stage builds explain why the final image ships only the
  built static output on a minimal Nginx runtime, discarding the entire Node.js build toolchain.
  </details>

- If this org later needed rootless container execution — say, a CI runner executing untrusted
  third-party code — would anything covered in this Docker topic change, or does that push toward
  the Podman topic instead?

  <details>
  <summary>Answer</summary>

  Nothing in this topic's Docker model provides rootless-by-default operation — Docker's daemon
  traditionally runs as root, with rootless as an opt-in mode most setups don't enable. A genuine
  need for rootless-by-default, especially for untrusted workloads, is exactly the scenario the
  Podman topic's Rootless by Default page is written for.
  </details>

- Why does `docker exec -it my-app bash` sometimes fail with "executable file not found," and how
  does that connect back to what an image actually contains, from Basics?

  <details>
  <summary>Answer</summary>

  Many minimal images (like `alpine`-based ones) don't ship `bash` at all, only `sh` — an image is
  exactly the filesystem snapshot it was built with, and `exec` can only run a binary that actually
  exists in that filesystem. The fix (`sh` instead of `bash`) isn't a Docker limitation, it's a
  direct consequence of what that specific image's layers do and don't include.
  </details>

- A stateless API container and a database container are both redeployed the same way
  (`docker compose up -d --build`). Why is losing the API's writable-layer contents a non-event,
  while losing the database's would be a production incident?

  <details>
  <summary>Answer</summary>

  A stateless service is designed to keep nothing important in its writable layer — anything it
  "writes" is disposable (logs to stdout, temp files) — so recreating it loses nothing that
  matters. A database's data directory is exactly the kind of state Data Persistence says must
  live in a volume; if it doesn't, the very same redeploy mechanism that's harmless for the API
  silently destroys the database's actual data.
  </details>

