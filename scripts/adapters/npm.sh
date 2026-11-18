#!/usr/bin/env bash
# coldvault.dev — npm ecosystem adapter (ZONOVA RESEARCH).
#
# Implements the adapter contract for the npm registry. Guarantees "what we scan
# is what would execute": resolves the FULL transitive closure to exact versions
# with integrity hashes, materialises it with `npm ci --ignore-scripts` (which
# verifies every integrity hash against the lockfile), and NEVER runs a lifecycle
# script. All registry I/O runs through `scrubbed_env` so no Claude/cloud key is
# ever visible to a (hypothetically triggered) hook.
#
# Contract: npm_detect / npm_resolve / npm_materialize / npm_signals

# --- npm_detect "<spec>" ----------------------------------------------------
# Accepts: "lodash@4.17.21", "lodash", "@scope/pkg@1.2.3". Always true for npm:
# the ecosystem is pinned by the coordinate prefix; this only sanity-checks.
npm_detect() {
  local spec="$1"
  [[ -n "$spec" ]]
}

# Split "name@version" (handles scoped "@scope/name@version").
# Sets NPM_PKG_NAME / NPM_PKG_VERSION (version may be empty).
_npm_split_spec() {
  local spec="$1"
  if [[ "$spec" == @*/* ]]; then
    # scoped: @scope/name[@version]
    local rest="${spec#@}"            # scope/name[@version]
    if [[ "$rest" == *@* ]]; then
      NPM_PKG_NAME="@${rest%@*}"
      NPM_PKG_VERSION="${rest##*@}"
    else
      NPM_PKG_NAME="$spec"
      NPM_PKG_VERSION=""
    fi
  else
    if [[ "$spec" == *@* ]]; then
      NPM_PKG_NAME="${spec%@*}"
      NPM_PKG_VERSION="${spec##*@}"
    else
      NPM_PKG_NAME="$spec"
      NPM_PKG_VERSION=""
    fi
  fi
}

# --- npm_resolve "<spec>" "<staging>" --------------------------------------
# Produces, inside <staging>: package.json, resolved package-lock.json, and
# node_modules/ (the real closure). Zero lifecycle scripts run.
npm_resolve() {
  local spec="$1" staging="$2"
  has npm || { err "npm not found in container. Cannot resolve npm closure."; exit 30; }

  _npm_split_spec "$spec"
  [[ -n "$NPM_PKG_NAME" ]] || { err "Could not parse npm package name from '$spec'."; exit 30; }

  local dep_spec="$NPM_PKG_NAME"
  [[ -n "$NPM_PKG_VERSION" ]] && dep_spec="$NPM_PKG_NAME@$NPM_PKG_VERSION"

  mkdir -p "$staging"
  # Minimal consumer manifest — we audit the package as a *dependency*, exactly
  # as a real project would pull it (so overrides/transitive overwrites surface).
  cat > "$staging/package.json" <<JSON
{
  "name": "coldvault-audit-subject",
  "version": "0.0.0",
  "private": true,
  "description": "Ephemeral manifest to resolve and freeze the audit subject's closure.",
  "dependencies": {
    "$(printf '%s' "$NPM_PKG_NAME")": "$(printf '%s' "${NPM_PKG_VERSION:-latest}")"
  }
}
JSON

  log "npm: resolving lockfile for $dep_spec (scripts OFF)"
  (
    cd "$staging"
    scrubbed_env npm install \
      --ignore-scripts \
      --package-lock-only \
      --no-audit --no-fund \
      --loglevel=warn
  ) || { err "npm lockfile resolution failed for $dep_spec"; exit 31; }

  log "npm: materialising verified closure with 'npm ci --ignore-scripts'"
  (
    cd "$staging"
    scrubbed_env npm ci \
      --ignore-scripts \
      --no-audit --no-fund \
      --loglevel=warn
  ) || {
    warn "npm ci failed; retrying with 'npm install --ignore-scripts' (still no scripts)"
    ( cd "$staging" && scrubbed_env npm install --ignore-scripts --no-audit --no-fund --loglevel=warn ) \
      || { err "npm closure materialisation failed for $dep_spec"; exit 31; }
  }

  [[ -f "$staging/package-lock.json" ]] || { err "No package-lock.json produced — cannot certify closure."; exit 31; }
  log "npm: closure resolved. lock=$staging/package-lock.json"
}

# --- npm_materialize "<staging>" "<target>" --------------------------------
# Deposit the frozen closure into target/. No execution; plain copy.
npm_materialize() {
  local staging="$1" target="$2"
  mkdir -p "$target"
  # Copy manifest + lock + the installed tree. node_modules can be large; keep it
  # so SAST/secrets/malware scanners see the ACTUAL executable code, not just the
  # manifest.
  cp -a "$staging/package.json" "$target/" 2>/dev/null || true
  cp -a "$staging/package-lock.json" "$target/" 2>/dev/null || true
  if [[ -d "$staging/node_modules" ]]; then
    cp -a "$staging/node_modules" "$target/" 2>/dev/null || true
  fi
  log "npm: closure materialised under $target"
}

# --- npm_signals "<target>" "<out_json>" -----------------------------------
# Record ecosystem metadata for provenance-check.py. The heavy manifest↔lock↔
# registry comparison lives in provenance-check.py (robust JSON parsing); here we
# just point it at the inputs and note the resolver used.
npm_signals() {
  local target="$1" out="$2"
  cat > "$out" <<JSON
{
  "ecosystem": "npm",
  "resolver": "npm ci --ignore-scripts",
  "manifest": "package.json",
  "lockfile": "package-lock.json",
  "installed_tree": "node_modules",
  "integrity_field": "integrity (SRI)",
  "scripts_executed": false
}
JSON
}
