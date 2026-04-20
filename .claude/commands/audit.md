---
description: Full security audit pipeline on target/ — context → secrets → SCA → SAST → malware → IaC → report
argument-hint: "[optional focus: e.g. 'deps-only' or 'fast']"
---

Run the complete audit against `./target/`. Follow CLAUDE.md strictly —
never execute code from `target/`.

Steps (invoke the matching skill for each):

1. `audit-context-building` — write `reports/00-context.md`
2. `secrets-hunter` — run `scripts/scan-secrets.sh`
3. `supply-chain-risk-auditor` + `snyk-sca` — run `scripts/scan-deps.sh`
4. `static-analysis-orchestrator` + `snyk-sast` — run `scripts/scan-sast.sh`
5. `entry-point-analyzer` — produce `reports/entry-points.md`
6. `yara-malware-hunter` — run `scripts/scan-malware.sh`
7. `insecure-defaults-hunter` — pattern grep + `scripts/scan-iac.sh`
8. `agentic-actions-auditor` — audit `.github/workflows/**`
9. `variant-analysis` — expand each HIGH/MEDIUM finding
10. Synthesise → `reports/findings.json` + `reports/SUMMARY.md`

At the end, print an executive summary (top risks, counts by severity,
go/no-go recommendation).

Argument (optional): $ARGUMENTS
- If it contains `deps-only`, skip SAST/malware/IaC.
- If it contains `fast`, skip variant analysis and use Semgrep's fastest pack.
