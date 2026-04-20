---
name: static-analysis-orchestrator
description: Drives the per-language SAST fleet. Decides which analyzers to run based on audit-context-building output, merges SARIF, deduplicates, and produces a single ranked list in reports/sast-merged.sarif.
license: MIT (ZONOVA RESEARCH — coldvault.dev)
source_inspiration: trailofbits/skills/static-analysis
---

# static-analysis-orchestrator

## When to invoke

After `audit-context-building` has populated `reports/00-context.md`.

## Decision logic

```text
for each language detected:
    run Semgrep with language pack
    run language-native analyzer (see table below)
    write SARIF to reports/sast-<lang>-<tool>.sarif
merge → reports/sast-merged.sarif
dedupe by (file, line, rule_id)
```

| Language     | Native analyzer(s)                               |
|--------------|--------------------------------------------------|
| Python       | bandit, dlint                                    |
| JS / TS      | njsscan, eslint (security plugins), retire       |
| Go           | gosec, staticcheck                               |
| Rust         | cargo-geiger (unsafe counter), clippy            |
| C / C++      | cppcheck, flawfinder, clang-tidy                 |
| Java / JVM   | semgrep (community pack)                         |
| PHP          | psalm, phpstan (level max)                       |
| Ruby         | brakeman                                         |
| Shell        | shellcheck (plus semgrep shell)                  |
| Dockerfiles  | hadolint                                         |
| YAML (CI)    | semgrep `p/github-actions`, actionlint (if installed) |

## Merge recipe

```bash
# After all sarif files are produced in reports/:
jq -s '
  {
    version: "2.1.0",
    runs: ( [.[].runs // []] | add )
  }
' reports/sast-*.sarif > reports/sast-merged.sarif
```

## Ranking

After merge, rank findings by:

1. Severity (HIGH > MEDIUM > LOW)
2. Confidence (from Semgrep metadata or inferred)
3. Exploitability signals (is it on a network-reachable path, is the sink
   user-controlled, …) — this is where you earn your pay with a few manual
   sentences per finding.

## Anti-noise

- Drop rule IDs known to be chatty (style/performance/complexity buckets).
- Tests directory → max severity = MEDIUM.
- Generated code (`*.pb.go`, `*_pb2.py`, `*.g.dart`, minified JS) → skip by
  default, list exclusions at top of `reports/SUMMARY.md`.
