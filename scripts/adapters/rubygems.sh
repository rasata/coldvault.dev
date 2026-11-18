#!/usr/bin/env bash
# coldvault.dev — Ruby / RubyGems (Bundler) ecosystem adapter (ZONOVA RESEARCH).
# Contract: rubygems_detect / rubygems_resolve / rubygems_materialize / rubygems_signals
#
# `bundle lock` + `bundle cache --no-install` resolve the closure and download the
# .gem files WITHOUT compiling native extensions (which would run code). Gemfile.lock
# pins versions; newer Bundler records a CHECKSUMS block. git sources and non-
# rubygems.org remotes are reported as non-registry (mirage) risks.

# spec: "rails@7.1.0" or bare "rails"
rubygems_detect() { [[ -n "$1" ]]; }

rubygems_resolve() {
  local spec="$1" staging="$2"
  has bundle || { err "bundler not found in container. Cannot resolve RubyGems closure."; exit 30; }
  local name="${spec%@*}" ver=""
  [[ "$spec" == *@* ]] && ver="${spec##*@}"

  mkdir -p "$staging"
  {
    echo 'source "https://rubygems.org"'
    if [[ -n "$ver" ]]; then printf 'gem "%s", "%s"\n' "$name" "$ver"; else printf 'gem "%s"\n' "$name"; fi
  } > "$staging/Gemfile"

  log "rubygems: resolving closure for '$spec' (no native builds)"
  ( cd "$staging"
    export BUNDLE_GEMFILE="$staging/Gemfile" BUNDLE_PATH="$staging/.bundle"
    if ! scrubbed_env bundle lock >"$staging/bundle.log" 2>&1; then
      err "bundle lock failed. See $staging/bundle.log"; tail -20 "$staging/bundle.log" >&2 || true; exit 31
    fi
    scrubbed_env bundle cache --no-install >>"$staging/bundle.log" 2>&1 || warn "bundle cache incomplete"
  )
  [[ -f "$staging/Gemfile.lock" ]] || { err "no Gemfile.lock produced — cannot certify closure"; exit 31; }
  log "rubygems: closure resolved"
}

rubygems_materialize() {
  local staging="$1" target="$2"
  mkdir -p "$target"
  cp -a "$staging/Gemfile" "$target/" 2>/dev/null || true
  cp -a "$staging/Gemfile.lock" "$target/" 2>/dev/null || true
  [[ -d "$staging/vendor/cache" ]] && cp -a "$staging/vendor/cache" "$target/gems-cache" 2>/dev/null || true
  cp -a "$staging/bundle.log" "$target/bundle-resolve.log" 2>/dev/null || true
  log "rubygems: closure materialised under $target (Gemfile.lock + gems-cache/)"
}

rubygems_signals() {
  local target="$1" out="$2"
  cat > "$out" <<JSON
{
  "ecosystem": "rubygems",
  "resolver": "bundle lock + bundle cache --no-install",
  "manifest": "Gemfile",
  "lockfile": "Gemfile.lock",
  "installed_tree": "gems-cache/",
  "integrity_field": "CHECKSUMS (bundler >= 2.5)",
  "scripts_executed": false
}
JSON
}
