---
sidebar_position: 4
title: Review Questions
---

# Review Questions

Talk through these out loud, not by re-reading the pages — that's what actually tests whether the
concept stuck.

- [What Is CI/CD](./what-is-ci-cd.md) draws a line between Continuous Delivery and Continuous
  Deployment. Which of the two actually removes a manual approval step before production?

  <details>
  <summary>Answer</summary>

  Continuous Deployment. Continuous Delivery still stops at "release-ready, human clicks deploy" —
  only Continuous Deployment goes straight to production with no manual gate.
  </details>

- Why does [The Pipeline Concept](./the-pipeline-concept.md) insist the pipeline definition lives
  in the repository itself, rather than being clicked together in an external CI tool's UI?

  <details>
  <summary>Answer</summary>

  So it's versioned, reviewable, and reproducible alongside the code it builds — checking out an
  old commit gets you the pipeline that actually ran for that commit, not today's version.
  </details>

- A push to `main` and a pull request against `main` both trigger a pipeline. What does the
  pull-request trigger actually test that the push trigger alone wouldn't catch?

  <details>
  <summary>Answer</summary>

  A PR-triggered run tests the *merge result* of the PR branch into its target, catching
  integration problems that only show up once the two branches are combined — the PR branch alone
  wouldn't reveal those.
  </details>

- Path filters on a trigger (e.g. only running when `src/**` changes) connect to which idea from
  [What Is CI/CD](./what-is-ci-cd.md) — faster feedback, or lower-risk releases?

  <details>
  <summary>Answer</summary>

  Neither directly — path filters are about not wasting time/compute on a pipeline run that can't
  possibly be affected by the change (e.g. a README typo), which is really about efficient use of
  the automation, not about feedback speed or release risk per se.
  </details>

- Why is a scheduled trigger (e.g. a nightly cron run) fundamentally different in *purpose* from a
  push or pull-request trigger?

  <details>
  <summary>Answer</summary>

  Push/PR triggers respond to a code change; a scheduled trigger runs independent of any code
  change at all — useful for things that need to happen periodically regardless of whether
  anything changed (nightly full suites, dependency scans, backups).
  </details>

- If a pipeline's failure routinely requires guessing or reproducing locally to understand, what
  does that suggest is wrong, according to [The Pipeline Concept](./the-pipeline-concept.md)?

  <details>
  <summary>Answer</summary>

  That the pipeline itself needs better logging or clearer step separation — a failure should be
  diagnosable from its logs alone in the large majority of cases.
  </details>
