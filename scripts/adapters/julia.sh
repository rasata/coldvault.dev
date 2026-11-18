#!/usr/bin/env bash
# coldvault.dev — Julia (Pkg) adapter (ZONOVA RESEARCH).
# Contract: julia_detect / julia_resolve / julia_materialize / julia_signals
#
# Pkg.add compiles/builds packages (build.jl runs code), so we do NOT resolve a
# coordinate directly. Audit a project that commits Manifest.toml via local:/github:
# — the provenance analyzer parses Manifest.toml (git-tree-sha1 pins, git repos,
# build.jl) without executing anything.
julia_detect() { [[ -n "$1" ]]; }
julia_resolve() {
  err "Julia coordinate resolution runs build.jl (arbitrary code). Not done directly."
  err "Audit a project that commits Project.toml + Manifest.toml instead:"
  err "    local:/path/to/project   or   github:owner/repo@<sha>"
  err "The provenance analyzer parses Manifest.toml from the source."
  exit 21
}
julia_materialize() { adapter_not_implemented julia; }
julia_signals()     { adapter_not_implemented julia; }
