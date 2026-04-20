#!/usr/bin/env bash
# Full pipeline. Runs secrets → deps → SAST → IaC → malware.
# Intended to be invoked by Claude's /audit command, or manually.
source "$(dirname "$0")/_lib.sh"
require_target

START=$(date +%s)
log "coldvault.dev — full audit starting"
log "Target: $TARGET_DIR"
log "Reports: $REPORTS_DIR"

bash "$REPO_ROOT/scripts/scan-secrets.sh"
bash "$REPO_ROOT/scripts/scan-deps.sh"
bash "$REPO_ROOT/scripts/scan-sast.sh"
bash "$REPO_ROOT/scripts/scan-iac.sh"
bash "$REPO_ROOT/scripts/scan-malware.sh"

END=$(date +%s)
log "All scans complete in $((END-START))s"
log "Next: let Claude synthesise findings.json + SUMMARY.md from reports/"
