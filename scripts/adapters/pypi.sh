#!/usr/bin/env bash
# coldvault.dev — PyPI (Python) ecosystem adapter (ZONOVA RESEARCH).
# Contract: pypi_detect / pypi_resolve / pypi_materialize / pypi_signals
#
# "Scripts OFF" guarantee: we resolve WHEELS ONLY (--only-binary=:all:), so no
# sdist setup.py / build backend ever executes during resolution. Each artifact's
# sha256 is captured into requirements.lock. Wheels are zip archives, so unpacking
# them for SAST never runs code either.

# spec: "requests==2.31.0", "requests>=2,<3", or bare "requests"
pypi_detect() { [[ -n "$1" ]]; }

pypi_resolve() {
  local spec="$1" staging="$2"
  local PIP=""
  if has pip3; then PIP="pip3"; elif has pip; then PIP="pip"; fi
  [[ -n "$PIP" ]] || { err "pip/pip3 not found in container. Cannot resolve PyPI closure."; exit 30; }
  has python3 || { err "python3 not found."; exit 30; }

  mkdir -p "$staging/wheels"
  log "pypi: resolving wheel-only closure for '$spec' (no setup.py execution)"
  if ! scrubbed_env "$PIP" download --only-binary=:all: --dest "$staging/wheels" "$spec" \
        >"$staging/pip.log" 2>&1; then
    err "Wheel-only resolution failed (a dependency may be sdist-only)."
    err "Re-running audits with sdists would execute build code; that is intentionally refused."
    err "See $staging/pip.log for the failing package."
    tail -20 "$staging/pip.log" >&2 || true
    exit 31
  fi

  # Build a hash-pinned lock from the downloaded artifacts (what WILL install).
  ( cd "$staging/wheels" && for f in *; do
      [[ -f "$f" ]] || continue
      printf '# %s\n--hash=sha256:%s\n' "$f" "$(sha256sum "$f" | cut -d' ' -f1)"
    done ) > "$staging/requirements.lock" 2>/dev/null || true
  log "pypi: closure resolved ($(ls -1 "$staging/wheels" 2>/dev/null | wc -l | tr -d ' ') artifacts)"
}

pypi_materialize() {
  local staging="$1" target="$2"
  mkdir -p "$target/wheels" "$target/src"
  cp -a "$staging/wheels/." "$target/wheels/" 2>/dev/null || true
  cp -a "$staging/requirements.lock" "$target/" 2>/dev/null || true
  cp -a "$staging/pip.log" "$target/pip-resolve.log" 2>/dev/null || true
  # Unpack wheels (zip) so scanners see the actual Python code — no execution.
  if has python3; then
    ( cd "$target/wheels" && for w in *.whl; do
        [[ -f "$w" ]] || continue
        python3 -I -m zipfile -e "$w" "../src/${w%.whl}" 2>/dev/null || true
      done )
  fi
  log "pypi: closure materialised under $target (wheels/ + unpacked src/)"
}

pypi_signals() {
  local target="$1" out="$2"
  cat > "$out" <<JSON
{
  "ecosystem": "pypi",
  "resolver": "pip download --only-binary=:all:",
  "manifest": "requirements.lock",
  "lockfile": "requirements.lock",
  "installed_tree": "src/",
  "integrity_field": "sha256",
  "scripts_executed": false
}
JSON
}
