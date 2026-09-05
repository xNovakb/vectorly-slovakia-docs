---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [What Is a Package Manager](./what-is-a-package-manager.md) distinguishes distro-level from
  language-level package managers. Which kind installed Docker itself in [Worked Example:
  Installing Docker](./installing-docker-example.md), and which kind would install a Node
  project's dependencies instead?

  <details>
  <summary>Answer</summary>

  Distro-level (`apt`/`dnf`) installed Docker as system software; a language-level manager
  (`npm`, for example) would install a Node project's own dependencies into that project's scope —
  the two never touch each other's territory.
  </details>

- Why does [apt & dnf](./apt-and-dnf.md)'s "adding a third-party repository" section verify GPG
  signatures before installing Docker's official packages, tying back to what [What Is a Package
  Manager](./what-is-a-package-manager.md) says about repositories?

  <details>
  <summary>Answer</summary>

  A repository is just a configured source of packages — adding one means trusting whoever
  controls it; verifying the GPG signature confirms packages actually came from Docker and weren't
  tampered with, since nothing about "it's a configured repo" alone guarantees that.
  </details>

- In [Worked Example: Installing Docker](./installing-docker-example.md), why is `sudo usermod -aG
  docker deploy` (step 3) necessary at all if `sudo apt install docker.io` (step 1) already
  installed everything?

  <details>
  <summary>Answer</summary>

  Installing the software and being authorized to talk to the Docker daemon as a non-root user are
  separate concerns — the package manager just puts the software on disk; group membership is what
  grants a regular user permission to use it without `sudo` for every command.
  </details>

- Why doesn't `dnf` need a separate `update` step the way `apt update` does, per [apt &
  dnf](./apt-and-dnf.md)?

  <details>
  <summary>Answer</summary>

  `dnf` checks repository metadata freshness automatically as part of every command; `apt`
  separates "refresh what's available" (`update`) from "actually install newer versions"
  (`upgrade`) into two explicit steps.
  </details>

- The worked example's final section says "none of these topics exist in isolation on a real
  server." Name the three subfolder-level topics (from elsewhere in this study-materials section)
  that combine in that one example.

  <details>
  <summary>Answer</summary>

  Package management (`apt`/`dnf` to install), Practical Shell (`systemctl` to run it as a
  service), and Permissions & Users (`usermod`/groups to grant access without `sudo`).
  </details>
