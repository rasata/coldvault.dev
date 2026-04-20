---
description: Supply-chain / SCA pass — osv-scanner + trivy + grype + snyk (opt) + language-native audits + SBOM
---

Invoke `supply-chain-risk-auditor` and `snyk-sca` skills. Runs
`scripts/scan-deps.sh`. Parses lockfiles only — never resolves or installs
dependencies.

Output: `reports/sca-*.{sarif,json}`, `reports/sbom.cdx.json`,
consolidated section in `reports/SUMMARY.md`.
