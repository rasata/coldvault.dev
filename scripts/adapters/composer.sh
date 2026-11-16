#!/usr/bin/env bash
# coldvault.dev — PHP / Composer ecosystem adapter (ZONOVA RESEARCH).
# Contract: composer_detect / composer_resolve / composer_materialize / composer_signals
#
# `composer require --no-scripts --no-plugins` resolves the closure and writes
# composer.lock (dist.shasum per package) + vendor/, without running any Composer
# scripts or plugins. Scripts/plugins and custom repositories are reported as
# install-time execution / non-registry risks by the Python analyzer.

# spec: "vendor/package@version" or "vendor/package"
composer_detect() { [[ "$1" == */* ]]; }

composer_resolve() {
  local spec="$1" staging="$2"
  has composer || { err "composer not found in container. Cannot resolve PHP closure."; exit 30; }
  local name="${spec%@*}" ver=""
  [[ "$spec" == *@* ]] && ver="${spec##*@}"
  [[ "$name" == */* ]] || { err "composer spec must be vendor/package[@version], got '$spec'"; exit 30; }

  mkdir -p "$staging"
  export COMPOSER_HOME="$staging/.composer" COMPOSER_NO_INTERACTION=1
  ( cd "$staging"
    scrubbed_env composer init --no-interaction --name=coldvault/audit-subject >/dev/null 2>&1 || true
    local req="$name"; [[ -n "$ver" ]] && req="$name:$ver"
    log "composer: resolving '$req' (--no-scripts --no-plugins)"
    if ! scrubbed_env composer require --no-interaction --no-scripts --no-plugins --no-audit "$req" \
          >"$staging/composer.log" 2>&1; then
      err "composer require failed. See $staging/composer.log"; tail -20 "$staging/composer.log" >&2 || true; exit 31
    fi
  )
  [[ -f "$staging/composer.lock" ]] || { err "no composer.lock produced — cannot certify closure"; exit 31; }
  log "composer: closure resolved"
}

composer_materialize() {
  local staging="$1" target="$2"
  mkdir -p "$target"
  cp -a "$staging/composer.json" "$target/" 2>/dev/null || true
  cp -a "$staging/composer.lock" "$target/" 2>/dev/null || true
  [[ -d "$staging/vendor" ]] && cp -a "$staging/vendor" "$target/" 2>/dev/null || true
  cp -a "$staging/composer.log" "$target/composer-resolve.log" 2>/dev/null || true
  log "composer: closure materialised under $target (composer.lock + vendor/)"
}

composer_signals() {
  local target="$1" out="$2"
  cat > "$out" <<JSON
{
  "ecosystem": "composer",
  "resolver": "composer require --no-scripts --no-plugins",
  "manifest": "composer.json",
  "lockfile": "composer.lock",
  "installed_tree": "vendor/",
  "integrity_field": "dist.shasum",
  "scripts_executed": false
}
JSON
}
