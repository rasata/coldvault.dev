#!/usr/bin/env bash
# Secrets pass. Never runs verification against live APIs unless VERIFY=1.
source "$(dirname "$0")/_lib.sh"
require_target
enforce_usage_policy_ack

log "gitleaks — current tree"
if has gitleaks; then
  gitleaks detect --source "$TARGET_DIR" --no-git \
    --report-format sarif --report-path "$REPORTS_DIR/secrets-gitleaks.sarif" || true
  log "gitleaks — with history"
  gitleaks detect --source "$TARGET_DIR" \
    --report-format sarif --report-path "$REPORTS_DIR/secrets-gitleaks-history.sarif" || true
else warn "gitleaks missing"; fi

log "trufflehog (no verification)"
if has trufflehog; then
  VERIFY_FLAG="--no-verification"
  [[ "${VERIFY:-0}" == "1" ]] && VERIFY_FLAG="--only-verified"
  trufflehog filesystem "$TARGET_DIR" --json $VERIFY_FLAG \
    > "$REPORTS_DIR/secrets-trufflehog.json" || true
else warn "trufflehog missing"; fi

log "detect-secrets"
if has detect-secrets; then
  detect-secrets scan "$TARGET_DIR" > "$REPORTS_DIR/secrets-detect.json" || true
else warn "detect-secrets missing"; fi

log "ggshield (optional, needs GITGUARDIAN_API_KEY)"
if has ggshield && [[ -n "${GITGUARDIAN_API_KEY:-}" ]]; then
  ggshield secret scan path -r --json "$TARGET_DIR" \
    > "$REPORTS_DIR/secrets-ggshield.json" || true
fi

log "done — see reports/secrets-*.{sarif,json}"
