# Ecosystem adapter interface

`fetch-target.sh` and `provenance-check.py` are ecosystem-agnostic. Supporting a
new stack = adding one adapter; no other file changes. Implemented today:
- **Direct resolution** (full closure + integrity): npm, pypi, go, cargo, nuget,
  maven, composer, pub, rubygems, swift.
- **Source-audited** (coordinate resolve guides to `local:`/`github:`; analyzer
  parses the committed lockfile): julia, conan, vcpkg, cran, deno, cocoapods.
- **Source modes**: github, url, local — plus native build-system detection
  (Makefile/configure/CMake/binding.gyp/PHP config.m4/nginx config) for C/C++,
  nginx modules and native extensions.

A further stack (e.g. hex/Elixir, pub alternatives, a dedicated gradle adapter) is
one more file registered in `COLDVAULT_ECOSYSTEMS` + one `analyze_<eco>`.

## Where

- Shell side: `scripts/adapters/<eco>.sh`, registered in
  `scripts/adapters/_registry.sh` (`COLDVAULT_ECOSYSTEMS`).
- Python side: `scripts/provenance-check.py` → add `analyze_<eco>(target)` to the
  `ANALYZERS` dict.

## Shell contract (each adapter must define)

```bash
<eco>_detect "<spec>"                      # 0 if this adapter handles the spec
<eco>_resolve "<spec>" "<staging_dir>"     # resolve FULL closure; NO script exec
<eco>_materialize "<staging_dir>" "<target_dir>"  # deposit closure; no exec
<eco>_signals "<target_dir>" "<out_json>"  # write ecosystem metadata JSON
```

Rules:
- `resolve` must pin to exact versions and capture integrity/hashes, with lifecycle
  scripts/build steps **disabled** (`--ignore-scripts`, no build isolation bypass,
  no `go build`, no MSBuild run…).
- Run all registry/network I/O through `scrubbed_env` (strips `ANTHROPIC_*`/`CLAUDE_*`
  and other secrets) so a triggered hook can never read a credential.
- `materialize` is a pure copy — never execute anything from the closure.
- On "not yet implemented", call `adapter_not_implemented <eco>` (clean exit 20).

## Python contract

`analyze_<eco>(target: Path) -> {"findings": [...], "signals": {...}}` where each
finding uses the CLAUDE.md §4 schema with `source_tool: "provenance"`. Return HIGH
for anything that breaks "scanned == executed" (non-registry override, integrity
mismatch), MEDIUM for install-time execution surface, LOW/info for range drift.

## Skeleton for a new ecosystem

```bash
# scripts/adapters/<eco>.sh
<eco>_detect()      { [[ -n "$1" ]]; }                 # recognise the spec
<eco>_resolve()     { adapter_not_implemented <eco>; } # resolve closure, scripts OFF
<eco>_materialize() { adapter_not_implemented <eco>; } # copy into target/, no exec
<eco>_signals()     { adapter_not_implemented <eco>; } # write metadata JSON
```

Fill in the bodies following an existing adapter (`npm.sh`, `cargo.sh`, …), add the
name to `COLDVAULT_ECOSYSTEMS` in `_registry.sh`, and add `analyze_<eco>` to
`provenance-check.py`. `adapter_not_implemented` remains available for a stack you
scaffold but have not finished.
