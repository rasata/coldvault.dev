#!/usr/bin/env bash
# coldvault.dev — R / CRAN (renv) adapter (ZONOVA RESEARCH).
# Contract: cran_detect / cran_resolve / cran_materialize / cran_signals
#
# Installing R packages runs configure scripts and package R code, so we do NOT
# resolve a coordinate directly. Audit a project that commits renv.lock (or a
# DESCRIPTION) via local:/github: — the provenance analyzer parses renv.lock
# (Hash, Repository) and DESCRIPTION (Remotes:) without executing anything.
cran_detect() { [[ -n "$1" ]]; }
cran_resolve() {
  err "R package installation runs configure/install code. Not done directly."
  err "Audit a project that commits renv.lock or DESCRIPTION instead:"
  err "    local:/path/to/project   or   github:owner/repo@<sha>"
  err "The provenance analyzer parses renv.lock / DESCRIPTION from the source."
  exit 21
}
cran_materialize() { adapter_not_implemented cran; }
cran_signals()     { adapter_not_implemented cran; }
