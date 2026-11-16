#!/usr/bin/env bash
# coldvault.dev — Conan (C/C++) adapter (ZONOVA RESEARCH).
# Contract: conan_detect / conan_resolve / conan_materialize / conan_signals
#
# conanfile.py recipes execute Python during graph resolution, so we do NOT resolve
# a coordinate directly. Audit a project that commits conan.lock / conanfile via
# local:/github: — the provenance analyzer parses conan.lock (recipe revisions,
# remotes) and flags conanfile.py (code recipe) without executing anything.
conan_detect() { [[ -n "$1" ]]; }
conan_resolve() {
  err "Conan graph resolution evaluates conanfile.py recipes (arbitrary code)."
  err "Audit a project that commits conan.lock / conanfile.{py,txt} instead:"
  err "    local:/path/to/project   or   github:owner/repo@<sha>"
  err "The provenance analyzer parses conan.lock from the source."
  exit 21
}
conan_materialize() { adapter_not_implemented conan; }
conan_signals()     { adapter_not_implemented conan; }
