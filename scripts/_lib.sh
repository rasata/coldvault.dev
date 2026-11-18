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

# ---------------------------------------------------------------------------
# require_container — the fetch/resolve phase may trigger execution of untrusted
# code (postinstall hooks, setup.py, build.rs). It MUST only ever run inside a
# disposable, isolated container (GitHub Actions runner, Codespace, or the
# coldvault devcontainer) — NEVER on the analyst's host machine.
# Set COLDVAULT_ALLOW_UNSAFE_HOST=1 only if you fully own the throw-away box.
# ---------------------------------------------------------------------------
in_container() {
  [[ -f /.dockerenv ]] && return 0
  [[ -n "${CODESPACES:-}" ]] && return 0
  [[ -n "${GITHUB_ACTIONS:-}" ]] && return 0
  [[ -n "${REMOTE_CONTAINERS:-}" || -n "${DEVCONTAINER:-}" ]] && return 0
  [[ -n "${COLDVAULT_IN_CONTAINER:-}" ]] && return 0
  if [[ -r /proc/1/cgroup ]] && grep -qaE '(docker|containerd|kubepods|lxc)' /proc/1/cgroup 2>/dev/null; then
    return 0
  fi
  return 1
}

require_container() {
  if in_container; then
    return 0
  fi
  if [[ "${COLDVAULT_ALLOW_UNSAFE_HOST:-}" == "1" ]]; then
    warn "COLDVAULT_ALLOW_UNSAFE_HOST=1 — running the fetch/resolve phase OUTSIDE a container."
    warn "Untrusted install hooks may execute on THIS machine. You accepted the risk."
    return 0
  fi
  err "Refusing to fetch/resolve untrusted code outside a container."
  err "Dependency resolution can execute install hooks (postinstall, setup.py, build.rs)."
  err "Run this inside a disposable container: GitHub Actions, a Codespace, or the"
  err "coldvault devcontainer. Dispatch from your host with:"
  err "    gh workflow run coldvault-audit.yml -f source=<coordinate>"
  err "Override ONLY on a throw-away box you own: COLDVAULT_ALLOW_UNSAFE_HOST=1"
  exit 5
}

# ---------------------------------------------------------------------------
# scrub_sensitive_env — strip Anthropic/Claude credentials (and other high-value
# secrets) from the environment BEFORE any step that touches untrusted code.
# A malicious postinstall/setup.py can read process env and exfiltrate it, so
# the resolve/scan phase must never carry an API key. Call via `scrubbed_env ...`
# to run a command with a filtered environment.
# ---------------------------------------------------------------------------
SENSITIVE_ENV_PREFIXES=(ANTHROPIC CLAUDE AWS GCP GOOGLE AZURE OPENAI NPM_TOKEN PYPI)
SENSITIVE_ENV_EXACT=(GH_TOKEN GITHUB_TOKEN NODE_AUTH_TOKEN HF_TOKEN SLACK_TOKEN)

# Hard-abort only on *credential-bearing* variables (keys/tokens/secrets), NOT on
# harness session identifiers like CLAUDE_CODE_SESSION_ID — otherwise this would
# wrongly fire inside a Codespace where Claude Code legitimately runs. The broad
# ANTHROPIC_*/CLAUDE_* strip is still applied to the untrusted-code subprocess via
# scrubbed_env(); this is the extra belt-and-suspenders for obvious secrets.
assert_no_claude_key() {
  local leaked="" name
  while IFS='=' read -r name _; do
    case "$name" in
      ANTHROPIC_API_KEY|ANTHROPIC_AUTH_TOKEN|CLAUDE_API_KEY|CLAUDE_CODE_OAUTH_TOKEN) leaked+=" $name" ;;
      ANTHROPIC_*KEY|ANTHROPIC_*TOKEN|ANTHROPIC_*SECRET|CLAUDE_*API_KEY|CLAUDE_*AUTH_TOKEN) leaked+=" $name" ;;
    esac
  done < <(env)
  if [[ -n "$leaked" ]]; then
    err "Claude/Anthropic credential(s) present in environment:$leaked"
    err "They must NOT be visible to untrusted-code steps. Unset them first. Aborting."
    exit 6
  fi
}

# Run a command with sensitive variables unset (defence in depth). Portable:
# unsets matching vars inside a subshell, then execs — no reliance on GNU `env
# --unset`. Used by every adapter's resolve step so a triggered install hook
# cannot read a credential from the environment.
scrubbed_env() {
  (
    local name p
    for name in $(compgen -v); do
      for p in "${SENSITIVE_ENV_PREFIXES[@]}"; do
        [[ "$name" == "${p}"* ]] && { unset "$name" 2>/dev/null || true; continue 2; }
      done
      for p in "${SENSITIVE_ENV_EXACT[@]}"; do
        [[ "$name" == "$p" ]] && { unset "$name" 2>/dev/null || true; }
      done
    done
    exec "$@"
  )
}

USAGE_ACK_TOKEN="defensive-security-research-only"

enforce_usage_policy_ack() {
  local ack_normalized
  ack_normalized="$(printf '%s' "${COLDVAULT_ACCEPTABLE_USE:-}" | xargs)"
  if [[ "$ack_normalized" != "$USAGE_ACK_TOKEN" ]]; then
    err "Usage policy acknowledgement is required."
    err "Set COLDVAULT_ACCEPTABLE_USE=$USAGE_ACK_TOKEN before running scans."
    err "By setting it, you confirm this project is used only for authorized defensive security work."
    exit 4
  fi
}
