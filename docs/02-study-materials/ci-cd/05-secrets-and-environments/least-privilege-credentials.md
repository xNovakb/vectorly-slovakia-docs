---
sidebar_position: 3
title: Least-Privilege Credentials
---

# Least-Privilege Credentials

Beyond just keeping a secret's *value* protected (see
[Managing Secrets in CI](./managing-secrets-in-ci.md)), a genuinely safe pipeline also scopes what
that credential can actually **do** — the principle of least privilege: grant exactly the access a
specific pipeline needs, and nothing more.

## The core question for every CI credential

Not just "is this secret protected," but "if this specific secret leaked right now, what's the
actual blast radius?" A credential scoped narrowly limits the answer; a broad, powerful credential
used for convenience turns any leak into a much larger incident than it needed to be.

## Scoping by permission level

```text
❌ A single admin/owner-level token used for every pipeline task
✅ A read-only token for a job that only needs to fetch data
✅ A write-scoped-to-one-repo token for a job that only deploys that one repo
✅ A deploy-only token that can trigger a deploy but can't, say, delete the repository or
    change other users' access
```

Most platforms (cloud providers, package registries, deploy targets) support creating a credential
scoped to a specific, narrow set of permissions rather than issuing only broad admin-level access —
using the narrowest one that actually satisfies the pipeline's real need is the concrete
application of least privilege.

## Scoping by resource

```text
❌ One organization-wide deploy key, usable against every repository the org owns
✅ A deploy key generated per-repository, scoped to exactly that repository, and nothing else
```

This is the same pattern behind "one deploy key per repo" that shows up in real-world CI/CD setups
generally — a credential compromised from one pipeline shouldn't automatically hand over access to
every other unrelated project just because they happened to share a credential for convenience.

## Short-lived and rotatable over long-lived static credentials

```text
Long-lived static credential:   valid indefinitely until manually revoked — if it leaks,
                                   the exposure window is unbounded until someone notices
Short-lived/rotatable credential: expires automatically after a set window, or is
                                     re-issued fresh for each run — a leaked credential is
                                     only useful for a limited time regardless of when the
                                     leak is discovered
```

Some platforms support generating a fresh, temporary credential scoped to just one pipeline run,
valid only for its duration — the strongest practical version of least privilege, since there's no
long-lived secret sitting in a secret store to leak in the first place.

## Read vs. write access — a distinction worth being deliberate about

```text
A job that only builds and tests:    needs READ access to the repo, nothing more
A job that deploys:                    needs WRITE access to the deploy target specifically,
                                          not necessarily to the source repo itself
A job that publishes a release:          needs WRITE access to the package registry/release
                                            target, scoped to that specific package if possible
```

Defaulting every job to the same broad credential "because it's simpler" is a common shortcut that
directly undermines this principle — the setup cost of scoping credentials per job is a one-time
cost; an overprivileged credential is an ongoing, compounding risk for as long as it exists.

## This is the same principle behind real deploy-key patterns

A single repository using a credential scoped specifically to that repo, with only the permissions
its deploy step actually needs (rather than a broad personal or org-wide credential reused
everywhere), is exactly this principle applied in practice — the general theory covered here, and
a concrete instance of it, are the same idea at different levels of abstraction.
