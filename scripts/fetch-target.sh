#!/usr/bin/env bash
# coldvault.dev — fetch & freeze an audit subject into target/ (ZONOVA RESEARCH).
#
# Usage:  scripts/fetch-target.sh <ecosystem>:<spec>
#   e.g.  scripts/fetch-target.sh npm:lodash@4.17.21
#
# Resolves the FULL transitive dependency closure to exact versions + integrity
# hashes and materialises it under target/ WITHOUT ever running a lifecycle
# script. This is the "scanned == executed" guarantee: the audit then runs over
# the exact bytes that would actually install.
#
# SAFETY:
#   * Refuses to run outside a disposable container (require_container) — the
#     resolve step can trigger untrusted code.
#   * Scrubs Claude/cloud credentials from the environment first
#     (assert_no_claude_key) so a hook can never exfiltrate a key.
#   * Never executes code from target/.

source "$(dirname "$0")/_lib.sh"
# shellcheck source=adapters/_registry.sh
source "$(dirname "$0")/adapters/_registry.sh"

main() {
  local coordinate="${1:-}"
  if [[ -z "$coordinate" ]]; then
    err "Usage: scripts/fetch-target.sh <ecosystem>:<spec>   (e.g. npm:lodash@4.17.21)"
    exit 64
  fi

  enforce_usage_policy_ack     # COLDVAULT_ACCEPTABLE_USE gate (same as scans)
  require_container            # never resolve untrusted code on the host
  assert_no_claude_key         # no ANTHROPIC_*/CLAUDE_* in env for this phase

  parse_coordinate "$coordinate"   # -> COORD_ECO / COORD_SPEC
  log "Audit subject: ecosystem=$COORD_ECO spec=$COORD_SPEC"

  load_adapter "$COORD_ECO"
  require_adapter_fns "$COORD_ECO"

  if ! "${COORD_ECO}_detect" "$COORD_SPEC"; then
    err "Adapter '$COORD_ECO' rejected spec '$COORD_SPEC'."
    exit 13
  fi

  # Fresh target/ — never mix two subjects. Guarded: refuse if it's a git
  # submodule checkout the user expects to keep (presence of .git handled by git).
  if [[ -e "$TARGET_DIR" && -n "$(ls -A "$TARGET_DIR" 2>/dev/null || true)" ]]; then
    if [[ "${COLDVAULT_OVERWRITE_TARGET:-}" != "1" ]]; then
      err "target/ is not empty. Refusing to overwrite."
      err "Set COLDVAULT_OVERWRITE_TARGET=1 to replace it with the new subject."
      exit 14
    fi
    warn "Overwriting existing target/ (COLDVAULT_OVERWRITE_TARGET=1)"
    rm -rf "${TARGET_DIR:?}/"* "${TARGET_DIR:?}/".[!.]* 2>/dev/null || true
  fi
  mkdir -p "$TARGET_DIR"

  local staging
  staging="$(mktemp -d "${TMPDIR:-/tmp}/coldvault-staging.XXXXXX")"
  trap 'rm -rf "$staging"' EXIT

  log "Resolving closure in staging: $staging"
  "${COORD_ECO}_resolve" "$COORD_SPEC" "$staging"

  log "Materialising closure into target/"
  "${COORD_ECO}_materialize" "$staging" "$TARGET_DIR"

  # Ecosystem signal metadata for provenance-check.py.
  local eco_meta="$REPORTS_DIR/00-provenance-adapter.json"
  "${COORD_ECO}_signals" "$TARGET_DIR" "$eco_meta"

  # Top-level closure descriptor (coordinate pin + provenance inputs).
  local now; now="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  cat > "$REPORTS_DIR/00-provenance-closure.json" <<JSON
{
  "coordinate": "$coordinate",
  "ecosystem": "$COORD_ECO",
  "spec": "$COORD_SPEC",
  "resolved_at": "$now",
  "scripts_executed": false,
  "adapter_meta": "00-provenance-adapter.json",
  "note": "Closure materialised under target/ with lifecycle scripts disabled."
}
JSON

  log "Done. Subject frozen under target/. Next: provenance-check.py, then audit-all.sh"
}

main "$@"
