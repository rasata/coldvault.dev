---
name: snyk-sca
description: Snyk Open Source-parity workflow for software composition analysis. Produces a dependency vulnerability report using open-source tooling (osv-scanner, trivy, grype) plus the bundled snyk CLI if authenticated. Use when the analyst is familiar with the Snyk workflow and wants a drop-in replacement.
license: MIT (ZONOVA RESEARCH — coldvault.dev)
source_inspiration: snyk.io/product/open-source-security-management
---

# snyk-sca

## Rationale

Snyk Open Source is a benchmark for SCA UX. This skill reproduces its key
workflows without requiring a Snyk license, and opportunistically uses the
Snyk CLI when `SNYK_TOKEN` is present.

## Procedure

```bash
# 1. Inventory manifests
find target -maxdepth 4 \( \
  -name 'package.json' -o -name 'pnpm-lock.yaml' -o -name 'yarn.lock' \
  -o -name 'requirements*.txt' -o -name 'poetry.lock' -o -name 'Pipfile.lock' \
  -o -name 'go.mod' -o -name 'Cargo.toml' -o -name 'pom.xml' \
  -o -name 'build.gradle*' -o -name 'composer.json' -o -name 'Gemfile.lock' \
  \) -not -path '*/node_modules/*' -not -path '*/vendor/*'

# 2. Canonical scan (OSV = same vuln DB Snyk queries upstream for OSS)
osv-scanner --recursive --format sarif target/ > reports/sca-osv.sarif

# 3. Duplicate with Trivy FS for cross-validation (sometimes catches CVEs OSV
#    doesn't yet have, and adds license info)
trivy fs --scanners vuln,license --format sarif target/ > reports/sca-trivy.sarif

# 4. If Snyk token present, add Snyk's own findings
if [ -n "$SNYK_TOKEN" ]; then
  snyk test --all-projects --sarif-file-output=reports/sca-snyk.sarif target/ || true
fi

# 5. SBOM — CycloneDX & SPDX
syft target -o cyclonedx-json > reports/sbom.cdx.json
syft target -o spdx-json      > reports/sbom.spdx.json
```

## Triage rubric (Snyk-style)

For each CVE:

1. **Is the vulnerable function reachable?** Snyk calls this "reachability".
   Without Snyk's call-graph data, use:
   - `semgrep --config=auto` with the CVE's package in scope
   - manual grep for the vulnerable symbol imports
2. **Is there a patched version?** Extract from `osv-scanner` output.
3. **Is there a non-breaking upgrade path?** `npm outdated`, `pip list
   --outdated`, `cargo outdated`.
4. **Workaround available?** Check CVE references for mitigation snippets.

## Output fields

```json
{
  "file": "target/package-lock.json",
  "line": 1024,
  "severity": "HIGH",
  "category": "vuln_dependency",
  "description": "lodash < 4.17.21 — prototype pollution (CVE-2020-8203)",
  "exploit_scenario": "Path 'src/utils/merge.ts:14' calls _.merge(req.body, …)",
  "recommendation": "Upgrade to lodash@^4.17.21 — non-breaking.",
  "confidence": 0.92,
  "source_tool": "osv-scanner"
}
```
