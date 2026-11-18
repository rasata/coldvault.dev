#!/usr/bin/env bash
# coldvault.dev — vcpkg (C/C++) adapter (ZONOVA RESEARCH).
# Contract: vcpkg_detect / vcpkg_resolve / vcpkg_materialize / vcpkg_signals
#
# vcpkg builds ports from source (portfiles run CMake/shell), so we do NOT resolve
# a coordinate directly. Audit a project that commits vcpkg.json (+ baseline) via
# local:/github: — the provenance analyzer parses vcpkg.json / vcpkg-configuration
# (registries, overrides, baseline) without building anything.
vcpkg_detect() { [[ -n "$1" ]]; }
vcpkg_resolve() {
  err "vcpkg installs build ports from source (portfiles run code). Not done directly."
  err "Audit a project that commits vcpkg.json (+ vcpkg-configuration.json) instead:"
  err "    local:/path/to/project   or   github:owner/repo@<sha>"
  err "The provenance analyzer parses vcpkg.json from the source."
  exit 21
}
vcpkg_materialize() { adapter_not_implemented vcpkg; }
vcpkg_signals()     { adapter_not_implemented vcpkg; }
