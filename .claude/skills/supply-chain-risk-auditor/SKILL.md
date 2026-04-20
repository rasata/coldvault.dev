---
name: supply-chain-risk-auditor
description: Evaluate third-party dependencies for known CVEs, typo-squats, malicious maintainers, install-time hooks, unusual registries, and git-URL dependencies. Combines lockfile parsing with OSV / Trivy / Snyk data.
license: MIT (ZONOVA RESEARCH — coldvault.dev)
source_inspiration: trailofbits/skills/supply-chain-risk-auditor
---

# supply-chain-risk-auditor

## Inputs

All lockfiles under `target/`:
- `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`
- `requirements*.txt`, `poetry.lock`, `Pipfile.lock`, `uv.lock`
- `go.sum`, `go.mod`
- `Cargo.lock`
- `Gemfile.lock`
- `composer.lock`
- `pom.xml`, `gradle.lockfile`

## Pipeline

```bash
# 1. Known CVE scan — broad net
osv-scanner --recursive --format json target/ > reports/osv.json
trivy fs --scanners vuln,license,secret --format json target/ > reports/trivy-fs.json

# 2. Ecosystem-native
[ -f target/package-lock.json ] && (cd target && npm audit --json) > reports/npm-audit.json 2>/dev/null || true
[ -f target/Cargo.lock ] && cargo-audit audit --file target/Cargo.lock --json > reports/cargo-audit.json
[ -f target/Gemfile.lock ] && bundler-audit check --gemfile-lock target/Gemfile.lock > reports/bundler-audit.txt || true
[ -f target/go.mod ] && GOFLAGS=-mod=mod govulncheck -C target ./... > reports/govuln.txt || true

# 3. SBOM
syft target -o cyclonedx-json > reports/sbom.cdx.json
grype sbom:reports/sbom.cdx.json -o json > reports/grype.json
```

## Beyond known CVEs — manual signals (this is where you earn your pay)

For each direct dependency, answer:

1. **Typo-squat?** Compare name to popular packages (levenshtein ≤ 2). Flag
   `lodahs`, `reqeusts`, `colors-js`, `node-ipc-lite`, etc.
2. **Install-time code?**
   - npm: `scripts.postinstall|preinstall|install|prepare` in the dependency's
     published `package.json`. (You can inspect the tarball contents via
     `npm view <pkg>@<v> dist.tarball` URL — *do not download and extract*
     unless in a nested sandbox.)
   - Python: `setup.py` executes on install. Prefer `pyproject.toml`-only deps.
   - Rust: `build.rs` executes on `cargo build`.
3. **Unusual registry?** `.npmrc`, `.yarnrc.yml`, `pip.conf`, `Cargo.toml`
   `[source]` pointing to private/unknown mirrors.
4. **Git-URL deps?** In `package.json`:
   - `"foo": "github:user/repo#commit"` → pinned OK, branch-ref NOT OK
   - `"foo": "git+ssh://…"` → treat as HIGH risk
5. **Maintainer footprint.** A dep with 1 maintainer, <50 weekly downloads,
   recently updated, that pulls in system-level APIs (`child_process`, `fs`,
   `crypto`, `http`), deserves a hand review.
6. **License risk.** `trivy fs --scanners license` — flag non-permissive
   (AGPL, GPL-3.0, Commercial, "UNLICENSED") for the analyst's legal review.
7. **Transitive depth.** Deps buried 6+ levels deep that reach privileged APIs
   — note in the report.

## Snyk-parity checks

Use the bundled `snyk` CLI (if a token is configured) for:

```bash
snyk test --json target > reports/snyk-oss.json || true
snyk code test --json target > reports/snyk-code.json || true
```

…but do **not** block the audit on Snyk token presence — the OSV/Trivy path
above is Snyk-independent.

## Output

Add to `reports/findings.json` any dep-level finding with:
- severity = CVE's CVSS → HIGH (≥7.0), MEDIUM (4–7), LOW (<4)
- category: `vuln_dependency` | `typosquat` | `install_hook` | `git_url_dep` |
  `unusual_registry` | `license_risk`
- file: the lockfile, with the line of the offending entry when possible.

Write a narrative summary to `reports/01-supply-chain.md`.
