---
sidebar_position: 2
title: Comparing CI Platforms
---

# Comparing CI Platforms

[GitHub Actions Basics](./github-actions-basics.md) covered one specific platform concretely —
this page zooms out to how the major players actually compare, since the underlying concepts
covered throughout this topic apply to all of them, just with different vocabulary and config
formats.

## The major platforms, at a glance

| | Hosting model | Config format | Best fit when... |
|---|---|---|---|
| **GitHub Actions** | Hosted (managed runners) or self-hosted | YAML in `.github/workflows/` | Already using GitHub for source control — deepest native integration |
| **GitLab CI** | Hosted (GitLab.com) or self-hosted (GitLab instance) | YAML, `.gitlab-ci.yml` | Already using GitLab, or need a fully self-hostable, all-in-one DevOps platform |
| **Jenkins** | Self-hosted (traditionally) | Groovy-based `Jenkinsfile`, or UI-configured | Heavy legacy/enterprise environments, need for extensive plugin ecosystem, full self-hosted control |
| **CircleCI** | Hosted, with self-hosted runner options | YAML, `.circleci/config.yml` | Platform-agnostic (works with any git host), strong focus on build speed/caching |

## Hosted vs. self-hosted, as a platform-level default

GitHub Actions, GitLab CI, and CircleCI all default to a **hosted** model — the platform runs and
maintains the compute, you just define pipelines. Jenkins is traditionally **self-hosted only** —
you run the Jenkins server and its build agents yourself, on your own infrastructure, with no
managed-hosting default at all. This single difference explains much of why Jenkins persists
heavily in enterprises with strict infrastructure-control requirements, while newer platforms lean
hosted-first. See
[Self-Hosted vs. Managed Runners](./self-hosted-vs-managed-runners.md) for this tradeoff in depth
— it applies within any of these platforms, not just as a Jenkins-vs-the-rest distinction.

## Ecosystem and marketplace

```text
GitHub Actions:  actions/* and a large community marketplace of reusable actions
GitLab CI:         built-in templates, plus GitLab's own broader DevOps platform features
                    (issues, container registry, etc. all in one product)
Jenkins:             the largest, oldest plugin ecosystem — genuinely vast, but plugin quality
                       and maintenance varies widely
CircleCI:              "orbs" — CircleCI's own reusable-config-package concept, smaller ecosystem
                        than GitHub's but curated
```

A platform tightly integrated with your existing source host (GitHub Actions on GitHub, GitLab CI
on GitLab) tends to have the smoothest day-to-day experience, since triggers, PR/MR status checks,
and permissions are all native rather than bridged.

## Pricing model shape, generally

```text
Hosted platforms (GitHub Actions, GitLab CI, CircleCI): typically free tier with limited
  compute minutes/month, then pay for additional compute time or concurrency
Self-hosted (Jenkins, or self-hosted runners on any platform): no per-minute compute cost from
  the CI vendor, but you pay for and maintain the actual infrastructure yourself
```

Specific numbers change constantly and vary by plan — the shape that matters conceptually is
this tradeoff between paying a vendor per compute-minute versus owning and maintaining the compute
yourself, covered in more depth in
[Self-Hosted vs. Managed Runners](./self-hosted-vs-managed-runners.md).

## There's rarely one universally "best" choice

The natural choice is overwhelmingly driven by what source host a team already uses (strong
gravitational pull toward that platform's own CI product) and specific infrastructure/compliance
requirements (self-hosting mandates favor Jenkins or self-hosted runners on any platform) — not a
context-free "which CI tool is objectively best" ranking.
