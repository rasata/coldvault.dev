#!/usr/bin/env bash
# coldvault.dev — Dart / Flutter (pub) ecosystem adapter (ZONOVA RESEARCH).
# Contract: pub_detect / pub_resolve / pub_materialize / pub_signals
#
# `dart pub get` resolves pubspec.lock (sha256 per hosted package) without running
# any package code (build steps are a separate, explicit action). git/path sources
# are reported as non-registry (mirage) risks by the Python analyzer.

# spec: "http@1.2.0" or bare "http"
pub_detect() { [[ -n "$1" ]]; }

pub_resolve() {
  local spec="$1" staging="$2"
  local PUB=""
  if has dart; then PUB="dart"; elif has flutter; then PUB="flutter"; fi
  [[ -n "$PUB" ]] || { err "dart/flutter not found in container. Cannot resolve pub closure."; exit 30; }
  local name="${spec%@*}" ver=""
  [[ "$spec" == *@* ]] && ver="${spec##*@}"

  mkdir -p "$staging"
  export PUB_CACHE="$staging/pub-cache"
  cat > "$staging/pubspec.yaml" <<YAML
name: coldvault_audit_subject
environment:
  sdk: '>=2.17.0 <4.0.0'
dependencies:
  $(printf '%s' "$name"): $(printf '%s' "${ver:-any}")
YAML
  log "pub: resolving closure for '$spec'"
  ( cd "$staging"; scrubbed_env "$PUB" pub get --no-precompile >"$staging/pub.log" 2>&1 ) \
    || { err "pub get failed. See $staging/pub.log"; tail -20 "$staging/pub.log" >&2 || true; exit 31; }
  [[ -f "$staging/pubspec.lock" ]] || { err "no pubspec.lock produced — cannot certify closure"; exit 31; }
  log "pub: closure resolved"
}

pub_materialize() {
  local staging="$1" target="$2"
  mkdir -p "$target"
  cp -a "$staging/pubspec.yaml" "$target/" 2>/dev/null || true
  cp -a "$staging/pubspec.lock" "$target/" 2>/dev/null || true
  [[ -d "$staging/pub-cache/hosted" ]] && cp -a "$staging/pub-cache/hosted" "$target/pub-hosted" 2>/dev/null || true
  [[ -d "$staging/pub-cache/git" ]] && cp -a "$staging/pub-cache/git" "$target/pub-git" 2>/dev/null || true
  cp -a "$staging/pub.log" "$target/pub-resolve.log" 2>/dev/null || true
  log "pub: closure materialised under $target (pubspec.lock + package sources)"
}

pub_signals() {
  local target="$1" out="$2"
  cat > "$out" <<JSON
{
  "ecosystem": "pub",
  "resolver": "dart pub get",
  "manifest": "pubspec.yaml",
  "lockfile": "pubspec.lock",
  "installed_tree": "pub-hosted/",
  "integrity_field": "sha256",
  "scripts_executed": false
}
JSON
}
