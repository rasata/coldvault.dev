#!/usr/bin/env bash
# Full pipeline. Runs secrets → deps → SAST → IaC → malware → render.
# Intended to be invoked by Claude's /audit command, or manually.
# Claude-driven skills (defensive-payload-analysis, synthesis into
# findings.json + SUMMARY.md) are orchestrated from the /audit
# prompt, not this shell script.
source "$(dirname "$0")/_lib.sh"
require_target
enforce_usage_policy_ack

START=$(date +%s)
log "coldvault.dev — full audit starting"
log "Target: $TARGET_DIR"
log "Reports: $REPORTS_DIR"

bash "$REPO_ROOT/scripts/scan-secrets.sh"
bash "$REPO_ROOT/scripts/scan-deps.sh"
bash "$REPO_ROOT/scripts/scan-sast.sh"
bash "$REPO_ROOT/scripts/scan-iac.sh"
bash "$REPO_ROOT/scripts/scan-malware.sh"

log "Shell scans complete — now running Claude-driven synthesis (defensive-payload-analysis, findings.json, SUMMARY.md)"
log "Once SUMMARY.md exists in reports/, render-report.sh will produce reports/SUMMARY.html."

# Best-effort HTML render. Safe no-op if Claude has not yet written SUMMARY.md.
bash "$REPO_ROOT/scripts/render-report.sh" || true

END=$(date +%s)
log "Pipeline wall-clock: $((END-START))s"
log "Deliverables:"
log "  - reports/findings.json  (machine-readable)"
log "  - reports/SUMMARY.md     (human narrative)"
log "  - reports/SUMMARY.html   (self-contained, shareable)"
log "  - forensic/              (only if defensive-payload-analysis found something)"
