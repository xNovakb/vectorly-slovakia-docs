---
sidebar_position: 2
title: Running Tests in CI
---

# Running Tests in CI

Automated tests only provide their real value once they run **automatically, on every change** —
a test suite that only ever runs when a developer remembers to run it locally catches far fewer
regressions than the exact same suite wired into CI.

## The basic setup

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npm test
```

Simple in concept — the value is entirely in this running **reliably, on every push/PR**, not in
any special CI-specific test-writing technique.

## Exit codes are what CI actually checks

```bash
npm test
echo $?    # 0 = all tests passed, non-zero = at least one failed
```

CI doesn't "understand" test output semantically — it checks the **exit code** of the test
command (see
[What Is a Process](/study-materials/linux-shell/processes/what-is-a-process) in the Linux & Shell
topic for exactly what an exit code is). A test runner that exits `0` even when tests fail (a
misconfigured runner, or one that only prints failures without failing the process) will make CI
report success on a genuinely broken build — a real, if uncommon, footgun worth knowing about.

## Different kinds of tests, different CI treatment

```text
Unit tests        — fast, no external dependencies, run on every single push/PR
Integration tests   — slower, may need a real database/service, often run less frequently
                       (e.g. only on PRs targeting main, not every single commit)
End-to-end tests      — slowest, need a full running app, often run on a schedule or before
                          a release rather than on every push
```

Running the full, slowest test suite on every single push doesn't scale well as a codebase grows —
a common pattern is running fast unit tests on every push, and reserving slower suites for less
frequent triggers (see [Triggers & Events](../01-basics/triggers-and-events.md)).

## Flaky tests — a genuine, common CI problem

A **flaky test** passes and fails inconsistently with no actual code change — usually caused by
timing assumptions, shared state between tests, or dependence on external services that aren't
perfectly reliable.

:::warning
The tempting "fix" — just re-run the pipeline until it passes — actively erodes trust in the test
suite over time. Once a team gets used to ignoring a "probably flaky" red build, genuine failures
start getting waved away the same way. Flaky tests need to be fixed or explicitly quarantined
(marked and tracked separately), not routinely worked around by re-running.
:::

## Test reports and visibility

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: test-results.xml
```

Beyond a bare pass/fail, most CI platforms can display structured test results (which specific
tests failed, how long each took) — far more useful for debugging than scrolling through raw log
output, and this is exactly the kind of output covered as an
[artifact](./artifacts.md) in the next page.

## Blocking merges on test results

```text
Branch protection rule: "test" check must pass before merging
```

The actual enforcement mechanism that makes CI matter in practice — a passing test suite that
nobody's required to wait for before merging is easy to quietly ignore under deadline pressure.
Most platforms let a specific job's pass/fail status gate whether a PR is even mergeable at all.
