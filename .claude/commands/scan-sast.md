---
description: Multi-language SAST — Semgrep + bandit/gosec/njsscan/cppcheck/brakeman/psalm/…
---

Invoke `static-analysis-orchestrator`, `snyk-sast`, and `insecure-defaults-hunter`.
Runs `scripts/scan-sast.sh`. Output: `reports/sast-merged.sarif` plus raw
per-tool reports.
