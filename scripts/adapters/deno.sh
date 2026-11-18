#!/usr/bin/env bash
# coldvault.dev — Deno (TypeScript/JS) adapter (ZONOVA RESEARCH).
# Contract: deno_detect / deno_resolve / deno_materialize / deno_signals
#
# Deno resolution needs an entry module, and `deno cache` can run import-time code,
# so we do NOT resolve a bare coordinate directly. Audit a project that commits
# deno.lock via local:/github: — the provenance analyzer parses deno.lock (remote
# URL integrity hashes, npm/jsr specifiers) without executing anything.
# (TypeScript libraries published to npm are audited via the npm: adapter.)
deno_detect() { [[ -n "$1" ]]; }
deno_resolve() {
  err "Deno needs an entry module and may run import-time code. Not resolved directly."
  err "Audit a project that commits deno.lock instead:"
  err "    local:/path/to/project   or   github:owner/repo@<sha>"
  err "For a TypeScript package published to npm, use:  npm:<pkg>@<version>"
  exit 21
}
deno_materialize() { adapter_not_implemented deno; }
deno_signals()     { adapter_not_implemented deno; }
