#!/usr/bin/env bash
# Shared helpers for coldvault.dev audit scripts (ZONOVA RESEARCH).
# CRITICAL: never cd into target/, never run install/build commands from it.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export REPO_ROOT
export TARGET_DIR="${TARGET_DIR:-${REPO_ROOT}/target}"
export REPORTS_DIR="${REPO_ROOT}/reports"
export SEMGREP_RULES_DIR="${SEMGREP_RULES_DIR:-/opt/semgrep-rules}"
export YARA_RULES_DIR="${YARA_RULES_DIR:-/opt/yara-rules}"

mkdir -p "$REPORTS_DIR"

log()  { printf "\033[1;36m[audit]\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m[warn]\033[0m  %s\n" "$*"; }
err()  { printf "\033[1;31m[err]\033[0m   %s\n" "$*" >&2; }

require_target() {
  if [[ ! -d "$TARGET_DIR" ]] || [[ -z "$(ls -A "$TARGET_DIR" 2>/dev/null || true)" ]]; then
    err "No target/ submodule present. Run:  git submodule add <url> target/"
    exit 2
  fi
}

has() { command -v "$1" >/dev/null 2>&1; }

# Refuse to run anything that would execute target/ code.
abort_if_in_target() {
  case "$PWD" in
    "$TARGET_DIR"*|*/target|*/target/*)
      err "Refusing to run from inside target/ — audit scripts must stay in the host repo."
      exit 3
      ;;
  esac
}
abort_if_in_target

USAGE_ACK_TOKEN="defensive-security-research-only"

enforce_usage_policy_ack() {
  local ack_normalized
  ack_normalized="$(printf '%s' "${COLDVAULT_ACCEPTABLE_USE:-}" | tr '[:upper:]' '[:lower:]' | xargs)"
  if [[ "$ack_normalized" != "$USAGE_ACK_TOKEN" ]]; then
    err "Usage policy acknowledgement is required."
    err "Set COLDVAULT_ACCEPTABLE_USE=$USAGE_ACK_TOKEN before running scans."
    err "By setting it, you confirm this project is used only for authorized defensive security work."
    exit 4
  fi
}
