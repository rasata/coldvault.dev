#!/usr/bin/env bash
# coldvault.dev — local path ecosystem adapter (ZONOVA RESEARCH).
# Contract: local_detect / local_resolve / local_materialize / local_signals
#
# Copies an on-disk library tree into the container and audits its CURRENT state.
# The Python analyzer detects the inner ecosystem and — crucially — flags when
# there is no committed lockfile (so the closure cannot be certified) and
# recommends a fresh registry resolution (npm:/pypi:/…) of the same coordinate to
# diff against: this is the direct check for the "local copy looks safe but a
# transitive dependency overwrites it at install time" mirage.

# spec: a filesystem path
local_detect() { [[ -n "$1" ]]; }

local_resolve() {
  local spec="$1" staging="$2"
  [[ -e "$spec" ]] || { err "local path not found: $spec"; exit 30; }
  mkdir -p "$staging/tree"
  if [[ -d "$spec" ]]; then
    # copy contents, excluding heavy/irrelevant VCS + build dirs
    ( cd "$spec" && tar --exclude='./.git' --exclude='./node_modules/.cache' -cf - . ) \
      | ( cd "$staging/tree" && tar -xf - ) \
      || { err "failed to copy local tree"; exit 31; }
  else
    cp -a "$spec" "$staging/tree/" || { err "failed to copy local file"; exit 31; }
  fi
  log "local: copied on-disk library into staging"
}

local_materialize() {
  local staging="$1" target="$2"
  mkdir -p "$target"
  cp -a "$staging/tree/." "$target/" 2>/dev/null || true
  log "local: on-disk library materialised under $target (current state)"
}

local_signals() {
  local target="$1" out="$2"
  cat > "$out" <<JSON
{
  "ecosystem": "local",
  "resolver": "on-disk copy (no resolution)",
  "manifest": "(detected from tree)",
  "lockfile": "(committed lockfile, if any)",
  "installed_tree": ".",
  "integrity_field": "(none — on-disk state)",
  "scripts_executed": false,
  "closure_certified": false
}
JSON
}
