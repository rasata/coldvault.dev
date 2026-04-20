---
name: snyk-sast
description: Snyk Code-parity workflow for static application security testing. Uses Semgrep with curated rulesets plus language-native analyzers to produce findings equivalent to Snyk Code's categories (injection, crypto, authn, etc.).
license: MIT (ZONOVA RESEARCH — coldvault.dev)
source_inspiration: snyk.io/product/snyk-code
---

# snyk-sast

## Procedure

```bash
# 1. Semgrep with Snyk-equivalent rule packs
semgrep \
  --config p/owasp-top-ten \
  --config p/security-audit \
  --config p/cwe-top-25 \
  --config p/command-injection \
  --config p/xss \
  --config p/sqli \
  --config p/jwt \
  --config p/secrets \
  --config p/insecure-transport \
  --config p/javascript \
  --config p/typescript \
  --config p/python \
  --config p/golang \
  --config p/ruby \
  --config p/php \
  --config p/java \
  --config p/kotlin \
  --config p/swift \
  --config p/rust \
  --sarif --output reports/sast-semgrep.sarif \
  --error target/ || true

# 2. Language-specific deep passes
[ -n "$(find target -name '*.py' -print -quit)" ] && \
  bandit -r target -f json -o reports/sast-bandit.json || true

[ -n "$(find target -name '*.go' -print -quit)" ] && \
  gosec -fmt sarif -out reports/sast-gosec.sarif target/... || true

[ -n "$(find target -name '*.js' -o -name '*.jsx' -o -name '*.ts' -o -name '*.tsx' -print -quit)" ] && \
  njsscan --sarif -o reports/sast-njsscan.sarif target/ || true

[ -n "$(find target -name '*.c' -o -name '*.cpp' -o -name '*.h' -print -quit)" ] && {
  cppcheck --enable=all --inconclusive --xml target/ 2> reports/sast-cppcheck.xml
  flawfinder --html --context target/ > reports/sast-flawfinder.html
}

[ -n "$(find target -name '*.rb' -print -quit)" ] && \
  brakeman -o reports/sast-brakeman.json -f json target/ || true

[ -n "$(find target -name '*.php' -print -quit)" ] && \
  psalm --output-format=sarif --report=reports/sast-psalm.sarif target/ || true
```

## Snyk Code categories → Semgrep rule mapping

| Snyk category              | Semgrep packs used                           |
|----------------------------|----------------------------------------------|
| SQL injection              | `p/sqli`                                     |
| Command injection          | `p/command-injection`                        |
| Cross-site scripting       | `p/xss`                                      |
| Path traversal             | `p/security-audit` + `p/<lang>`              |
| Hardcoded secrets          | `p/secrets`                                  |
| Broken authentication      | `p/jwt`, `p/security-audit`                  |
| Weak crypto                | `p/insecure-transport`, `p/<lang>`           |
| Deserialization            | `p/<lang>` + custom rules                    |
| Unsafe regex (ReDoS)       | `p/security-audit`                           |
| Open redirect              | `p/<lang>`                                   |

## Post-processing

- Merge SARIF files: `jq -s 'reduce .[] as $x ({"runs":[]}; .runs += $x.runs)' reports/sast-*.sarif > reports/sast-merged.sarif`
- De-duplicate by `(file, line, rule_id)`.
- Drop findings with rule severity `info` or `note` unless the category matches
  a HIGH-impact family (RCE, injection, authn).

## Anti-false-positive rules (Anthropic-inspired)

- Do **not** report style findings (`prefer-const`, `no-var`, etc.).
- Do **not** report missing validation without an exploit path.
- Confidence < 0.7 → drop.
- Test files (`*/tests/**`, `*_test.py`, `*.spec.ts`) → severity auto-downgraded
  by one level unless the finding is "secret in code".
