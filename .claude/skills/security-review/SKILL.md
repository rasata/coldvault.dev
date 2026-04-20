---
name: security-review
description: Produce a PR-style security review of a diff (HEAD vs. base) inside target/, emitting findings in the Anthropic claude-code-security-review JSON schema. Use when the analyst only cares about what changed, not the whole repo.
license: MIT (ZONOVA RESEARCH — coldvault.dev)
source_inspiration: anthropics/claude-code-security-review
---

# security-review (PR-mode)

## When to invoke

- The user supplies a base ref: `/security-review <base-ref>`.
- Default base: `origin/main` (inside `target/`).

## Pipeline

```bash
BASE="${1:-origin/main}"

# 1. Diff
git -C target diff --unified=0 "$BASE"...HEAD > reports/pr-diff.patch
git -C target diff --name-only "$BASE"...HEAD > reports/pr-files.txt

# 2. Scope scanners to changed files
mapfile -t CHANGED < reports/pr-files.txt

semgrep --config p/security-audit --config p/owasp-top-ten --sarif \
    --output reports/pr-semgrep.sarif \
    $(printf 'target/%s\n' "${CHANGED[@]}") 2>/dev/null || true

# 3. Narrow secret / dep checks
gitleaks detect --source target --no-git --report-format sarif \
    --report-path reports/pr-gitleaks.sarif

# 4. Manual review loop — Claude reads each changed hunk and applies the
#    taxonomy below.
```

## Review taxonomy (Anthropic convention)

Focus **only on security implications introduced by the diff**. Do not flag
pre-existing issues unless they're on the changed path.

- **Input validation**: SQLi, command injection, XXE, SSTI, NoSQLi, path traversal
- **Authn / authz**: bypass, privilege escalation, session flaws, JWT, authz logic
- **Crypto / secrets**: hardcoded creds, weak algos, improper key storage, RNG
- **Code execution**: deserialization, pickle, YAML, `eval`, XSS (reflected/stored/DOM)
- **Data exposure**: PII handling, logging of sensitive data, debug leakage

## Exclusions (do NOT report)

- DoS / resource exhaustion
- Rate-limiting absence
- "Secrets at rest on disk"
- Style / lint / missing input validation without proven impact

## Confidence & severity

- HIGH — direct exploit → RCE / data breach / authn bypass
- MEDIUM — exploitable under realistic conditions
- LOW — defense-in-depth only

**Do not report below 0.7 confidence.**

## Output

`reports/pr-findings.json` — matches the schema in `CLAUDE.md §4`:

```json
{
  "findings": [
    {
      "file": "target/src/auth.ts",
      "line": 42,
      "severity": "HIGH",
      "category": "authn_bypass",
      "description": "New isAdmin() checks cookie 'role' directly without signature verification.",
      "exploit_scenario": "Client sets Cookie: role=admin to bypass authz.",
      "recommendation": "Verify JWT signature; read role from verified claims.",
      "confidence": 0.95
    }
  ],
  "analysis_summary": {
    "files_reviewed": 12,
    "high_severity": 1,
    "medium_severity": 0,
    "low_severity": 0,
    "review_completed": true
  }
}
```

End by writing the JSON to `reports/pr-findings.json` and a Markdown comment-
ready summary to `reports/pr-review.md`.
