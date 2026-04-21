#!/usr/bin/env bash
# IaC / container / Kubernetes scan.
source "$(dirname "$0")/_lib.sh"
require_target
enforce_usage_policy_ack

log "checkov"
has checkov && checkov -d "$TARGET_DIR" --framework all \
  --output sarif --output-file-path "$REPORTS_DIR/iac-checkov.sarif" \
  --soft-fail 2>/dev/null || true

log "tfsec"
has tfsec && tfsec "$TARGET_DIR" --format sarif \
  > "$REPORTS_DIR/iac-tfsec.sarif" 2>/dev/null || true

log "terrascan"
has terrascan && terrascan scan -d "$TARGET_DIR" -o sarif \
  > "$REPORTS_DIR/iac-terrascan.sarif" 2>/dev/null || true

log "hadolint — Dockerfiles"
if has hadolint; then
  find "$TARGET_DIR" -type f \( -name 'Dockerfile' -o -name 'Dockerfile.*' -o -name '*.Dockerfile' \) -print0 \
    | while IFS= read -r -d '' df; do
        hadolint --format sarif "$df" >> "$REPORTS_DIR/iac-hadolint.sarif" 2>/dev/null || true
      done
fi

log "dockle — built images (skip: needs a built image)"

log "kubesec + kube-score — K8s manifests"
if has kubesec; then
  find "$TARGET_DIR" \( -name '*.yaml' -o -name '*.yml' \) -path '*k8s*' -o -path '*kubernetes*' 2>/dev/null \
    | head -100 | while IFS= read -r m; do
        kubesec scan "$m" >> "$REPORTS_DIR/iac-kubesec.json" 2>/dev/null || true
      done
fi

log "done — reports/iac-*.{sarif,json}"
