#!/usr/bin/env bash
# coldvault.dev — ecosystem adapter registry (ZONOVA RESEARCH).
#
# An adapter turns a pinned coordinate into a materialised, scripts-OFF dependency
# closure under target/, and reports provenance signals. The rest of the audit
# pipeline is ecosystem-agnostic: to support a new stack, add one adapter file
# and register it here — nothing else changes.
#
# Adapter contract (see .claude/skills/coldvault-audit/references/adapter-interface.md):
#   <eco>_detect   "<spec>"                 -> 0 if this adapter handles the spec
#   <eco>_resolve  "<spec>" "<staging_dir>" -> resolve closure (NO script exec)
#   <eco>_materialize "<staging_dir>" "<target_dir>" -> deposit closure, no exec
#   <eco>_signals  "<target_dir>" "<prov_json_fragment_out>" -> provenance signals
#
# Coordinate syntax understood by the CLI:  <ecosystem>:<spec>
#   npm:lodash@4.17.21        pypi:requests==2.31.0
#   github:owner/repo@<sha>   url:https://.../pkg.tgz
#   local:./path/to/lib
#
# This file is sourced by fetch-target.sh; it assumes _lib.sh is already loaded
# (log/warn/err/has, REPO_ROOT, TARGET_DIR, REPORTS_DIR).

ADAPTERS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Ordered list of known ecosystems. Package managers resolve a full integrity-
# pinned closure (npm pypi go cargo nuget maven); source modes audit exact source
# without a registry closure (github url local). Add a stack = one more adapter file.
COLDVAULT_ECOSYSTEMS=(npm pypi go cargo nuget maven github url local)

# Parse "<ecosystem>:<spec>" into COORD_ECO / COORD_SPEC. If no "<eco>:" prefix,
# we refuse to guess — pinning the ecosystem is part of provenance certification.
parse_coordinate() {
  local raw="$1"
  if [[ "$raw" != *:* ]]; then
    err "Ambiguous coordinate '$raw'. Prefix the ecosystem explicitly, e.g.:"
    err "    npm:lodash@4.17.21 | pypi:requests==2.31.0 | github:owner/repo@<sha>"
    exit 10
  fi
  COORD_ECO="${raw%%:*}"
  COORD_SPEC="${raw#*:}"
  local known=0 e
  for e in "${COLDVAULT_ECOSYSTEMS[@]}"; do
    [[ "$e" == "$COORD_ECO" ]] && known=1 && break
  done
  if [[ "$known" -ne 1 ]]; then
    err "Unknown ecosystem '$COORD_ECO'. Known: ${COLDVAULT_ECOSYSTEMS[*]}"
    exit 10
  fi
  if [[ -z "$COORD_SPEC" ]]; then
    err "Empty spec after '$COORD_ECO:'."
    exit 10
  fi
  export COORD_ECO COORD_SPEC
}

load_adapter() {
  local eco="$1" f="$ADAPTERS_DIR/$1.sh"
  if [[ ! -r "$f" ]]; then
    err "No adapter file for ecosystem '$eco' (expected $f)."
    exit 11
  fi
  # shellcheck source=/dev/null
  source "$f"
}

# Every adapter must define these four functions. A stub defines them too, but
# its resolve/materialize call `adapter_not_implemented`.
require_adapter_fns() {
  local eco="$1" fn
  for fn in "${eco}_detect" "${eco}_resolve" "${eco}_materialize" "${eco}_signals"; do
    if ! declare -F "$fn" >/dev/null; then
      err "Adapter '$eco' is missing required function: $fn()"
      exit 12
    fi
  done
}

# Clean exit for an adapter you have scaffolded but not finished, so the extension
# point is obvious and never crashes mid-run. (All shipped adapters are complete.)
adapter_not_implemented() {
  local eco="$1"
  err "Ecosystem '$eco' is declared but its adapter body is not implemented."
  err "Implement scripts/adapters/$eco.sh against the adapter contract:"
  err "  .claude/skills/coldvault-audit/references/adapter-interface.md"
  exit 20
}
