#!/usr/bin/env bash
# Supply-chain / SCA pass. Parses lockfiles — never resolves or installs.
source "$(dirname "$0")/_lib.sh"
require_target

log "osv-scanner (recursive)"
if has osv-scanner; then
  osv-scanner --recursive --format sarif --output "$REPORTS_DIR/sca-osv.sarif" "$TARGET_DIR" || true
  osv-scanner --recursive --format json  --output "$REPORTS_DIR/sca-osv.json"  "$TARGET_DIR" || true
else warn "osv-scanner missing"; fi

log "trivy fs"
if has trivy; then
  trivy fs --scanners vuln,license,secret,misconfig --format sarif \
    --output "$REPORTS_DIR/sca-trivy.sarif" "$TARGET_DIR" || true
else warn "trivy missing"; fi

log "syft SBOM + grype"
if has syft; then
  syft "$TARGET_DIR" -o cyclonedx-json > "$REPORTS_DIR/sbom.cdx.json"  || true
  syft "$TARGET_DIR" -o spdx-json      > "$REPORTS_DIR/sbom.spdx.json" || true
fi
if has grype; then
  grype "sbom:$REPORTS_DIR/sbom.cdx.json" -o sarif > "$REPORTS_DIR/sca-grype.sarif" 2>/dev/null || \
  grype dir:"$TARGET_DIR" -o sarif > "$REPORTS_DIR/sca-grype.sarif" || true
fi

log "Python deps"
for f in "$TARGET_DIR"/requirements*.txt; do
  [[ -f "$f" ]] || continue
  has pip-audit && pip-audit -r "$f" -f sarif -o "$REPORTS_DIR/sca-pip-audit-$(basename "$f").sarif" || true
done
[[ -f "$TARGET_DIR/pyproject.toml" ]] && has safety && \
  safety check --json -r "$TARGET_DIR/pyproject.toml" > "$REPORTS_DIR/sca-safety.json" 2>/dev/null || true

log "Go deps"
if [[ -f "$TARGET_DIR/go.sum" ]] && has govulncheck; then
  ( cd "$TARGET_DIR" && GOFLAGS=-mod=mod govulncheck -json ./... ) \
    > "$REPORTS_DIR/sca-govulncheck.json" 2>/dev/null || true
fi

log "Rust deps"
if [[ -f "$TARGET_DIR/Cargo.lock" ]] && has cargo-audit; then
  cargo audit --file "$TARGET_DIR/Cargo.lock" --json \
    > "$REPORTS_DIR/sca-cargo-audit.json" || true
fi

log "Ruby deps"
if [[ -f "$TARGET_DIR/Gemfile.lock" ]] && has bundler-audit; then
  bundler-audit check --gemfile-lock "$TARGET_DIR/Gemfile.lock" \
    > "$REPORTS_DIR/sca-bundler-audit.txt" || true
fi

log "PHP deps"
if [[ -f "$TARGET_DIR/composer.lock" ]]; then
  has security-checker && security-checker security:check "$TARGET_DIR/composer.lock" \
    --format=json > "$REPORTS_DIR/sca-php-check.json" 2>/dev/null || true
fi

log "OWASP Dependency-Check (Java/JS/Python/Ruby, slow)"
if [[ "${WITH_DEPCHECK:-0}" == "1" ]] && has dependency-check; then
  dependency-check --scan "$TARGET_DIR" \
    --format SARIF --out "$REPORTS_DIR/sca-depcheck.sarif" --disableAssembly || true
fi

log "Snyk (optional, needs SNYK_TOKEN)"
if has snyk && [[ -n "${SNYK_TOKEN:-}" ]]; then
  snyk test --all-projects --sarif-file-output="$REPORTS_DIR/sca-snyk.sarif" \
    "$TARGET_DIR" || true
fi

log "done — see reports/sca-*.{sarif,json} and reports/sbom.cdx.json"
