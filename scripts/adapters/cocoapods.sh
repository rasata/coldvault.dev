#!/usr/bin/env bash
# coldvault.dev — CocoaPods (Swift/Obj-C) adapter (ZONOVA RESEARCH).
# Contract: cocoapods_detect / cocoapods_resolve / cocoapods_materialize / cocoapods_signals
#
# `pod install` runs Ruby + post_install hooks, so we do NOT resolve a coordinate
# directly. Audit a project that commits Podfile.lock via local:/github: — the
# provenance analyzer parses Podfile.lock (SPEC CHECKSUMS, EXTERNAL SOURCES :git/
# :path) without executing anything. (For a pure SwiftPM package use swift:.)
cocoapods_detect() { [[ -n "$1" ]]; }
cocoapods_resolve() {
  err "'pod install' runs Ruby and post_install hooks. Not resolved directly."
  err "Audit a project that commits Podfile.lock instead:"
  err "    local:/path/to/project   or   github:owner/repo@<sha>"
  err "For a SwiftPM package, use:  swift:owner/repo@<version>"
  exit 21
}
cocoapods_materialize() { adapter_not_implemented cocoapods; }
cocoapods_signals()     { adapter_not_implemented cocoapods; }
