---
description: Full security audit pipeline on target/ — context → secrets → SCA → SAST → malware → IaC → payload-analysis → report (SUMMARY.md + SUMMARY.html)
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
9. `defensive-payload-analysis` — read-only forensic pass over build
   configs (`tailwind.config.js`, `postcss.config.js`, `vite.config.js`,
   `package.json` lifecycle scripts, single-line >2000-char files, base64
   blobs passed to `Function`/`eval`). If anything is found, produce
   `forensic/<target>/ALERTE-MALWARE.md` + the numbered phase files
   (01-inventory → 04-iocs) and **reflect the findings in
   `reports/findings.json`** with `source_tool: "defensive-payload-analysis"`.
10. `variant-analysis` — expand each HIGH/MEDIUM finding
11. Synthesise → `reports/findings.json` + `reports/SUMMARY.md`
12. `html-report-renderer` — run `scripts/render-report.sh` (or
    `python3 scripts/render-report.py`) to produce a single-file,
    self-contained `reports/SUMMARY.html` that the user can open,
    email, or download. The file uses the same visual language as
    `/reports/example-summary` on coldvault.dev — NO-GO banner,
    scorecard, severity-coded findings table, verbatim Markdown
    narrative. No network, no external fonts, no JS framework.

At the end, print an executive summary (top risks, counts by severity,
go/no-go recommendation) and tell the user where to find
`reports/SUMMARY.html`.

Argument (optional): $ARGUMENTS
- If it contains `deps-only`, skip SAST/malware/IaC/payload-analysis.
- If it contains `fast`, skip variant analysis and use Semgrep's fastest pack.
- `html-report-renderer` (step 12) always runs — it's cheap and the
  primary deliverable.
