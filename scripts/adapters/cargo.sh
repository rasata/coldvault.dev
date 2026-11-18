#!/usr/bin/env bash
# coldvault.dev — Rust/Cargo ecosystem adapter (ZONOVA RESEARCH).
# Contract: cargo_detect / cargo_resolve / cargo_materialize / cargo_signals
#
# `cargo generate-lockfile` + `cargo vendor` resolve and copy crate sources WITHOUT
# compiling, so no build.rs ever runs during resolution. Cargo.lock carries each
# crate's checksum. build.rs presence is reported as an install/build-time exec
# surface signal by the Python analyzer.

# spec: "serde@1.0.197" or bare "serde"
cargo_detect() { [[ -n "$1" ]]; }

cargo_resolve() {
  local spec="$1" staging="$2"
  has cargo || { err "cargo not found in container. Cannot resolve Rust closure."; exit 30; }
  local name="${spec%@*}" ver=""
  [[ "$spec" == *@* ]] && ver="${spec##*@}"
  [[ -n "$name" ]] || { err "could not parse crate name from '$spec'"; exit 30; }

  mkdir -p "$staging/src"
  cat > "$staging/Cargo.toml" <<TOML
[package]
name = "coldvault-audit-subject"
version = "0.0.0"
edition = "2021"

[dependencies]
$(printf '%s' "$name") = "$(printf '%s' "${ver:-*}")"
TOML
  echo 'fn main() {}' > "$staging/src/main.rs"

  log "cargo: resolving lockfile for '$spec' (no compilation)"
  ( cd "$staging"
    if ! scrubbed_env cargo generate-lockfile >"$staging/cargo.log" 2>&1; then
      err "cargo generate-lockfile failed. See $staging/cargo.log"; tail -20 "$staging/cargo.log" >&2 || true; exit 31
    fi
    scrubbed_env cargo fetch >>"$staging/cargo.log" 2>&1 || true
    # vendor copies crate sources WITHOUT building them.
    scrubbed_env cargo vendor "$staging/vendor" >>"$staging/cargo.log" 2>&1 || warn "cargo vendor incomplete"
  )
  [[ -f "$staging/Cargo.lock" ]] || { err "no Cargo.lock produced — cannot certify closure"; exit 31; }
  log "cargo: closure resolved"
}

cargo_materialize() {
  local staging="$1" target="$2"
  mkdir -p "$target"
  cp -a "$staging/Cargo.toml" "$target/" 2>/dev/null || true
  cp -a "$staging/Cargo.lock" "$target/" 2>/dev/null || true
  [[ -d "$staging/vendor" ]] && cp -a "$staging/vendor" "$target/" 2>/dev/null || true
  cp -a "$staging/cargo.log" "$target/cargo-resolve.log" 2>/dev/null || true
  log "cargo: closure materialised under $target (Cargo.lock + vendor/)"
}

cargo_signals() {
  local target="$1" out="$2"
  cat > "$out" <<JSON
{
  "ecosystem": "cargo",
  "resolver": "cargo generate-lockfile + cargo vendor",
  "manifest": "Cargo.toml",
  "lockfile": "Cargo.lock",
  "installed_tree": "vendor/",
  "integrity_field": "checksum (sha256)",
  "scripts_executed": false
}
JSON
}
