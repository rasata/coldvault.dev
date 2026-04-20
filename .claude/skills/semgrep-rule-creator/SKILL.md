---
name: semgrep-rule-creator
description: Author custom Semgrep rules on the fly to hunt for patterns specific to the current audit. Drops the rule into rules/semgrep/ and runs it against target/. Useful for variant analysis and for codifying a manual finding.
license: MIT (ZONOVA RESEARCH — coldvault.dev)
source_inspiration: trailofbits/skills/semgrep-rule-creator
---

# semgrep-rule-creator

## When to invoke

1. You spotted a dangerous pattern manually and want to know whether it recurs.
2. A CVE affects a specific function signature — you want a fleet-wide sweep.
3. The bundled rulepacks miss a framework-specific sink (custom ORM, internal
   RPC layer, …).

## Rule template

```yaml
# rules/semgrep/<slug>.yml
rules:
  - id: <org>.<slug>
    message: <one-line impact statement>
    severity: ERROR  # or WARNING
    languages: [python]  # or [javascript, typescript], etc.
    metadata:
      category: security
      cwe: "CWE-78"
      confidence: HIGH
      references:
        - <CVE or blog URL>
    pattern-either:
      - pattern: os.system($CMD)
      - pattern: subprocess.call($CMD, shell=True)
    pattern-not:
      - pattern: os.system("static string")
```

Key knobs:

- `pattern`, `patterns` (AND), `pattern-either` (OR), `pattern-not`, `pattern-inside`
- `metavariable-regex` to narrow e.g. `$CMD` to user-controlled names
- `pattern-sources` + `pattern-sinks` for taint mode

## Taint-mode example (user input → command exec)

```yaml
rules:
  - id: zonova.nodejs-cmd-injection
    message: User-controlled input reaches child_process.exec
    severity: ERROR
    languages: [javascript, typescript]
    mode: taint
    pattern-sources:
      - pattern: req.body
      - pattern: req.query
      - pattern: req.params
      - pattern: req.headers
    pattern-sinks:
      - pattern: child_process.exec($X)
      - pattern: child_process.execSync($X)
    pattern-sanitizers:
      - pattern: shellEscape($X)
```

## Workflow

```bash
# 1. Write rule
$EDITOR rules/semgrep/zonova-<slug>.yml

# 2. Smoke test on a small folder
semgrep --config rules/semgrep/zonova-<slug>.yml target/ --severity ERROR

# 3. Merge into the SAST run
semgrep --config rules/semgrep/ --sarif --output reports/sast-custom.sarif target/
```

## Tips

- Prefer precise, high-confidence rules over loose "contains `eval`" catches.
- Add `pattern-not` for known-safe wrappers in this codebase.
- Cite a CVE/advisory in `metadata.references` — it helps triage.
- Commit the rule into `rules/semgrep/` — it becomes part of the audit artefact.
