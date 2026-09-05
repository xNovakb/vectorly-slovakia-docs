---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- What's the resource-oriented alternative to `POST /createUser`, and which REST constraint is
  that shift actually demonstrating?

  <details>
  <summary>Answer</summary>

  `POST /users` — the "uniform interface" constraint: resources identified by URLs, manipulated by
  a small standard set of methods, instead of one action-named endpoint per verb.
  </details>

- Why does wrapping a collection response in `{"data": [...], "meta": {...}}` matter more once
  pagination — offset or cursor — enters the picture?

  <details>
  <summary>Answer</summary>

  A bare array response has nowhere to put pagination metadata (total count, next cursor) without
  changing the response's fundamental top-level shape — a breaking change. The wrapped shape
  already has room reserved for it.
  </details>

- An API bumps its URL from `/v1/users` to `/v2/users` because a field was renamed. Was that a
  correct reason for a version bump, per this subfolder's rule of thumb?

  <details>
  <summary>Answer</summary>

  Yes — renaming a field is exactly the kind of breaking change the rule of thumb says does
  warrant a version bump.
  </details>

- Returning `200 OK` with `{"success": false}` in the body breaks more than just "REST purity" —
  name the actual tooling it breaks.

  <details>
  <summary>Answer</summary>

  Generic HTTP tooling — monitoring, caching, retry logic — that checks the actual status code,
  not each response's own ad-hoc body shape, to determine success or failure.
  </details>

- Which pagination style would you pick for a live, high-write social feed, and specifically why
  does the other style fail there?

  <details>
  <summary>Answer</summary>

  Cursor-based. Offset pagination breaks under concurrent inserts/deletes — items shift under you,
  causing skipped or duplicated results — which is exactly the environment a live feed creates.
  </details>
