---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- A container keeps exiting immediately after `docker run -d my-app`. Walk through the debugging
  sequence from [Exec, Logs & Inspect](./exec-logs-and-inspect.md) — which commands, in which
  order, and why that order?

  <details>
  <summary>Answer</summary>

  First `docker ps -a` to confirm it exited and get its ID, then `docker logs` to see what it
  printed before dying, then `docker inspect --format '{{.State.ExitCode}}'` to check the exit
  code, and finally `docker run -it my-app sh` to watch it fail live interactively. Each step
  narrows the search before resorting to the most invasive one.
  </details>

- Why does `docker logs` show nothing useful for an app that writes its own log file inside the
  container instead of printing to stdout/stderr?

  <details>
  <summary>Answer</summary>

  `docker logs` only captures what a container's main process writes to stdout/stderr — a log
  file written elsewhere lives in the container's own writable layer, invisible to `docker logs`
  and lost entirely once the container is removed.
  </details>

- Why is baking `DATABASE_URL=postgres://user:realpassword@...` into a Dockerfile with `ENV` worse
  than passing it via `docker run -e`, beyond just "it's less flexible"?

  <details>
  <summary>Answer</summary>

  An `ENV` value becomes part of the image's own layer history — permanently recoverable by
  anyone who can inspect or pull that image, even if a later layer overwrites it. Passing it at
  `docker run` time keeps the image itself generic and secret-free, with the actual value supplied
  only when a container is created.
  </details>

- Restart policy `unless-stopped` is set on a container, and it crashes. Separately, someone runs
  `docker exec -it my-app bash` into it and then closes that shell. Does either of these stop the
  container, and why not the second one specifically?

  <details>
  <summary>Answer</summary>

  The crash triggers Docker's restart policy, which restarts the container automatically. Closing
  an `exec` shell does nothing to the container at all — `exec` starts a separate, independent
  process inside an already-running container; it isn't the container's main process, so exiting
  it doesn't affect the container's lifecycle.
  </details>

- Why does `docker ps -a --filter "status=exited"` still list a container that crashed five
  minutes ago, and what does that make possible that wouldn't be if Docker deleted it
  automatically?

  <details>
  <summary>Answer</summary>

  Docker never removes a container just because its process exited — it stays listed until
  explicitly `docker rm`'d. That's exactly what makes post-mortem debugging possible: `docker
  logs` and `docker inspect --format '{{.State.ExitCode}}'` still work on a stopped container,
  which wouldn't be true if it vanished the moment it exited.
  </details>

