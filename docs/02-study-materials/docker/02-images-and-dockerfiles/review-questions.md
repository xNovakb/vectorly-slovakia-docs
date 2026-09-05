---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- Why does [Dockerfile Basics](./dockerfile-basics.md) put `COPY package*.json ./` and
  `RUN npm install` *before* `COPY . .`, tying directly into how
  [Image Layers & Caching](./image-layers-and-caching.md) says the build cache works?

  <details>
  <summary>Answer</summary>

  Each instruction's cache is keyed on its own inputs, and invalidating one layer invalidates
  every layer after it. Application code changes far more often than dependencies, so copying
  `package.json` and installing first means that expensive step stays cached across most
  rebuilds — reversing the order would invalidate the install step on every single code change.
  </details>

- What's the actual difference between `RUN npm install` and `CMD ["node", "server.js"]` in terms
  of *when* each one executes, and how does that map onto layers from
  [Image Layers & Caching](./image-layers-and-caching.md)?

  <details>
  <summary>Answer</summary>

  `RUN` executes once, during the build, and its result becomes a permanent image layer. `CMD`
  doesn't run at build time at all — it's metadata describing what to run every time a container
  starts from the image, and produces no layer of its own.
  </details>

- You tag a fresh build `my-app:latest`, matching last week's build which was also tagged
  `latest`. According to [Building & Tagging Images](./building-and-tagging-images.md), what
  happened to last week's `latest` tag?

  <details>
  <summary>Answer</summary>

  It moved — a tag is just a label pointing at a specific image, not a permanent name for one
  build. Pushing a new build tagged `latest` re-points that same label at the new image; the old
  image still exists, just no longer reachable by the name `latest`.
  </details>

- Why doesn't splitting a cleanup step into its own `RUN rm -rf /var/lib/apt/lists/*` actually
  shrink an image, given how layers work?

  <details>
  <summary>Answer</summary>

  Each `RUN` is its own layer, and a layer's contents are frozen once created. Files deleted in a
  *later* layer still exist in the *earlier* layer that added them — the image still has to ship
  every layer, so the deleted files' bytes are still there, just hidden from the final filesystem
  view. Only combining install-and-cleanup into one `RUN` (one layer) actually removes them from
  what ships.
  </details>

- Why is a large, un-ignored build context a caching problem as well as a size problem — connecting
  `.dockerignore` from Dockerfile Basics to what the build context actually is?

  <details>
  <summary>Answer</summary>

  The entire build context is sent to the Docker daemon before any instruction runs, and
  `COPY . .`'s cache key is based on everything it copies — a stray `node_modules` or `.git`
  directory in the context both slows down every build's upload and can spuriously invalidate the
  cache if any of those unrelated files change between builds.
  </details>

