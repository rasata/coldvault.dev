#!/usr/bin/env bash
# Thin wrapper around scripts/render-report.py for the /audit pipeline.
# Fails soft when SUMMARY.md is missing (audit not yet run) and loud when
# inputs are malformed.
source "$(dirname "$0")/_lib.sh"

if ! has python3; then
  err "python3 not found — cannot render HTML report."
  exit 127
fi

if [[ ! -f "$REPORTS_DIR/SUMMARY.md" ]]; then
  warn "No reports/SUMMARY.md yet — skipping HTML rendering."
  warn "Run /audit (or scripts/audit-all.sh) first to produce SUMMARY.md."
  exit 0
fi

log "Rendering self-contained HTML report → reports/SUMMARY.html"
python3 "$REPO_ROOT/scripts/render-report.py"
