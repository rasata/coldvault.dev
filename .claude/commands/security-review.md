---
description: PR-mode security review — diff HEAD vs. base inside target/
argument-hint: "<base-ref, default origin/main>"
---

Invoke the `security-review` skill. Reviews only the diff between `HEAD` and
`${ARGUMENTS:-origin/main}` inside `target/`, using the Anthropic security-
review finding schema.

Output: `reports/pr-findings.json`, `reports/pr-review.md`.
