---
sidebar_position: 1
title: Managing Secrets in CI
---

# Managing Secrets in CI

A pipeline routinely needs credentials — an API key, a deploy key, a database password — to
actually do its job. Handling these safely is a distinct concern from everything else about
pipeline design.

## Why secrets don't belong in the pipeline YAML itself

```yaml
❌ jobs:
     deploy:
       steps:
         - run: curl -H "Authorization: Bearer sk_live_abc123..." https://api.example.com/deploy
```

The pipeline configuration file lives in the repository — anyone with read access to the repo (and
its full git history, forever) can read a secret hardcoded here. This is the exact same principle
covered for [Docker images](/study-materials/docker/running-containers/environment-and-secrets):
never bake a real credential into something that gets stored/shared/versioned.

## CI secret stores — the actual mechanism

```yaml
jobs:
  deploy:
    steps:
      - run: curl -H "Authorization: Bearer ${{ secrets.DEPLOY_TOKEN }}" https://api.example.com/deploy
```

Every major CI platform provides an encrypted secret store, separate from the repository itself —
secrets are configured through the platform's UI/API, referenced by name in the pipeline config,
and injected as environment variables (or equivalent) **only at runtime**, never written into the
config file or the repository's history.

## Automatic log masking

```text
$ curl -H "Authorization: Bearer ***" https://api.example.com/deploy
```

Most platforms automatically detect when a known secret value would appear in log output and
replace it with `***` (or similar) before displaying logs — a real safety net, but not an
absolute guarantee:

:::warning
Log masking generally only catches the **exact** secret string appearing verbatim. A secret that's
been transformed first (base64-encoded, concatenated with other text, split across multiple log
lines) can still leak through masking that only pattern-matches the literal value. Never
deliberately `echo`/print a secret "just to debug it" — even with masking active, this is a
habit worth avoiding entirely.
:::

## Secrets vs. plain configuration

```text
Plain config (fine to commit):    NODE_ENV, API base URL, feature flags, log level
Secrets (never commit, use the
  secret store):                    API keys, database passwords, deploy credentials, tokens
```

Not everything a pipeline needs is sensitive — over-treating ordinary configuration as a secret
just adds friction (needing platform access to change a non-sensitive value) without adding real
security.

## Least privilege applies here too

A secret's *value* being protected doesn't mean its *scope* is automatically appropriate — see
[Least-Privilege Credentials](./least-privilege-credentials.md) for scoping what a given secret
can actually access, which matters independently of how well the value itself is protected.

## Rotating secrets

A secret that's been used in a pipeline for years without ever being rotated is a larger risk than
one rotated regularly — if it ever does leak (a misconfigured log, a compromised runner), the
exposure window for an unrotated long-lived secret is unbounded. Treating secret rotation as a
routine, scheduled practice rather than an emergency-only response is part of what makes a
pipeline's credential handling genuinely safe over time, not just safe on paper.
