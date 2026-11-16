#!/usr/bin/env bash
# coldvault.dev — Swift / SwiftPM ecosystem adapter (ZONOVA RESEARCH).
# Contract: swift_detect / swift_resolve / swift_materialize / swift_signals
#
# `swift package resolve` pins every dependency to an exact git revision in
# Package.resolved and checks the sources out under .build/checkouts WITHOUT
# building. NOTE: SwiftPM evaluates each dependency's Package.swift manifest (Swift
# code) during resolution — this is reported as a resolve-time execution surface by
# the Python analyzer. SwiftPM is inherently git-based, so the "integrity" pin is
# the commit revision.

# spec: "apple/swift-argument-parser@1.3.0" or "https://host/repo.git@<tag>"
swift_detect() { [[ "$1" == */* || "$1" == http*://* ]]; }

swift_resolve() {
  local spec="$1" staging="$2"
  has swift || { err "swift toolchain not found in container. Cannot resolve SwiftPM closure."; exit 30; }
  local url="${spec%@*}" ver=""
  [[ "$spec" == *@* ]] && ver="${spec##*@}"
  [[ -n "$ver" ]] || { err "SwiftPM audits require an exact version/tag: swift:owner/repo@<version>"; exit 30; }
  [[ "$url" == http*://* ]] || url="https://github.com/$url.git"

  mkdir -p "$staging/Sources/subject"
  cat > "$staging/Package.swift" <<SWIFT
// swift-tools-version:5.7
import PackageDescription
let package = Package(
    name: "coldvault-audit-subject",
    dependencies: [ .package(url: "$url", exact: "$ver") ],
    targets: [ .target(name: "subject", dependencies: []) ]
)
SWIFT
  echo '// coldvault audit subject' > "$staging/Sources/subject/empty.swift"

  log "swift: resolving '$url@$ver' (no build; manifests are evaluated by SwiftPM)"
  ( cd "$staging"; scrubbed_env swift package resolve >"$staging/swift.log" 2>&1 ) \
    || { err "swift package resolve failed. See $staging/swift.log"; tail -20 "$staging/swift.log" >&2 || true; exit 31; }
  [[ -f "$staging/Package.resolved" ]] || { err "no Package.resolved produced — cannot certify closure"; exit 31; }
  log "swift: closure resolved"
}

swift_materialize() {
  local staging="$1" target="$2"
  mkdir -p "$target"
  cp -a "$staging/Package.swift" "$target/" 2>/dev/null || true
  cp -a "$staging/Package.resolved" "$target/" 2>/dev/null || true
  [[ -d "$staging/.build/checkouts" ]] && cp -a "$staging/.build/checkouts" "$target/checkouts" 2>/dev/null || true
  cp -a "$staging/swift.log" "$target/swift-resolve.log" 2>/dev/null || true
  log "swift: closure materialised under $target (Package.resolved + checkouts/)"
}

swift_signals() {
  local target="$1" out="$2"
  cat > "$out" <<JSON
{
  "ecosystem": "swift",
  "resolver": "swift package resolve",
  "manifest": "Package.swift",
  "lockfile": "Package.resolved",
  "installed_tree": "checkouts/",
  "integrity_field": "git revision (commit SHA)",
  "scripts_executed": false,
  "manifest_evaluated_at_resolve": true
}
JSON
}
