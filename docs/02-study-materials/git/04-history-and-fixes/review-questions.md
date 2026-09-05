---
sidebar_position: 6
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- You ran `git reset --hard` and lost a commit you needed. Which tool from this subfolder gets it
  back, and why does it still work even though the commit "disappeared"?

  <details>
  <summary>Answer</summary>

  `git reflog` — the commit object usually still exists on disk, reset just moved the pointer away
  from it; reflog finds the old HEAD position so you can `reset --hard` back to it.
  </details>

- How is `git bisect`'s binary search related to the kind of history `git cherry-pick` or
  `undoing-changes` might need to act on afterward?

  <details>
  <summary>Answer</summary>

  Bisect identifies the exact bad commit; once found, you might cherry-pick a fix commit onto a
  release branch, or use the undoing-changes tools (revert/reset) to actually undo the bad
  commit's effect.
  </details>

- Both `git stash` and a WIP commit let you "save and come back later." Would reflog help you
  recover a stash you accidentally dropped, the same way it recovers a lost commit?

  <details>
  <summary>Answer</summary>

  Not the same way — reflog tracks HEAD movements and branch history; a stash lives in its own
  separate stash reference outside of that. A committed change (including a WIP commit) reliably
  shows up in the main reflog; a dropped stash is much easier to lose entirely.
  </details>

- Cherry-picking creates a duplicate commit. If that same change later gets properly merged via
  the normal branch history, does Git break?

  <details>
  <summary>Answer</summary>

  No — Git usually handles the duplicate content fine, though it can occasionally cause a
  conflict on an already-applied change; it's not a correctness problem.
  </details>

- Which command from Undoing Changes is the safe choice for undoing a commit that's already been
  pushed and pulled by others, and why doesn't the same logic apply to `reset --hard`?

  <details>
  <summary>Answer</summary>

  `git revert` — it adds a new commit instead of rewriting history, so it's safe on shared
  commits. `reset --hard` rewrites what the branch pointer refers to and discards commits, which
  is dangerous on anything already pulled elsewhere.
  </details>
