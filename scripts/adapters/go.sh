#!/usr/bin/env bash
# coldvault.dev — Go modules ecosystem adapter (ZONOVA RESEARCH).
# Contract: go_detect / go_resolve / go_materialize / go_signals
#
# Go downloads and vendors modules WITHOUT building them, so no package code runs
# during resolution (building would run code; we never build). go.sum carries the
# verified module hashes. `go mod vendor` copies sources into vendor/ for scanning.

# spec: "github.com/pkg/errors@v0.9.1" or "golang.org/x/text@latest"
go_detect() { [[ "$1" == *.*/* || "$1" == */* ]]; }

go_resolve() {
  local spec="$1" staging="$2"
  has go || { err "go toolchain not found in container. Cannot resolve Go closure."; exit 30; }
  mkdir -p "$staging"
  (
    cd "$staging"
    export GOFLAGS=-mod=mod GONOSUMDB="" GOFLAGS=-mod=mod
    scrubbed_env go mod init coldvault.audit/subject >/dev/null 2>&1 || true
    log "go: resolving module graph for '$spec' (download only, no build)"
    if ! scrubbed_env go get "$spec" >"$staging/go.log" 2>&1; then
      err "go get failed for '$spec'. See $staging/go.log"; tail -20 "$staging/go.log" >&2 || true; exit 31
    fi
    scrubbed_env go mod download all >>"$staging/go.log" 2>&1 || true
    # vendor copies dependency sources WITHOUT building them.
    scrubbed_env go mod vendor >>"$staging/go.log" 2>&1 || warn "go mod vendor incomplete (see go.log)"
  )
  [[ -f "$staging/go.sum" ]] || warn "go: no go.sum produced — closure hashes unavailable"
  log "go: closure resolved"
}

go_materialize() {
  local staging="$1" target="$2"
  mkdir -p "$target"
  cp -a "$staging/go.mod" "$target/" 2>/dev/null || true
  cp -a "$staging/go.sum" "$target/" 2>/dev/null || true
  [[ -d "$staging/vendor" ]] && cp -a "$staging/vendor" "$target/" 2>/dev/null || true
  cp -a "$staging/go.log" "$target/go-resolve.log" 2>/dev/null || true
  log "go: closure materialised under $target (go.mod/go.sum + vendor/)"
}

go_signals() {
  local target="$1" out="$2"
  cat > "$out" <<JSON
{
  "ecosystem": "go",
  "resolver": "go mod download + go mod vendor",
  "manifest": "go.mod",
  "lockfile": "go.sum",
  "installed_tree": "vendor/",
  "integrity_field": "h1: (dirhash)",
  "scripts_executed": false
}
JSON
}
