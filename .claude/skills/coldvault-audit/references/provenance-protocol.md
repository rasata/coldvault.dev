# Provenance protocol — "what is scanned is what will execute"

The central guarantee of `coldvault-audit`. A library can pass a naive read of its
source yet install something different: a transitive dependency overwrites it, a
lifecycle hook pulls code at install time, or a dependency resolves from a mutable
non-registry source. This protocol makes the audited bytes equal to the installed
bytes, and flags every residual divergence.

## The three states we compare

1. **Declared** — what the manifest asks for (`package.json` dependency ranges,
   `requirements.txt` specifiers, `go.mod` requires…).
2. **Locked / installed** — what actually resolves and lands on disk
   (`package-lock.json` + `node_modules/`, a hash-pinned `requirements.lock` +
   wheels, `go.sum` + module cache…).
3. **Registry** — what the public registry serves for that exact version
   (integrity / sha256 / checksum).

Any mismatch between these is a provenance finding.

## How we freeze the closure without executing code

- **npm:** minimal consumer manifest, `npm install --ignore-scripts
  --package-lock-only` then `npm ci --ignore-scripts` (verifies every `integrity`
  hash). Scanned `node_modules/` == a real `npm ci`, minus the flagged scripts.
- **PyPI:** `pip download --only-binary=:all:` (wheels only → no setup.py/build
  backend runs), sha256 per artifact into `requirements.lock`, wheels unpacked for
  SAST.
- **Go:** `go mod download` + `go mod vendor` (copies sources, never builds);
  `go.sum` carries hashes; `replace` directives flagged.
- **Cargo:** `cargo generate-lockfile` + `cargo vendor` (no compilation);
  `Cargo.lock` checksums; `build.rs`, git sources and `[patch]`/`[replace]` flagged.
- **NuGet:** `dotnet restore --use-lock-file` (never build); `packages.lock.json`
  contentHash; package MSBuild `.targets`/`.props` flagged.
- **Maven:** `mvn dependency:copy-dependencies` + `dependency:tree` (no build);
  `.sha1` checksums; SNAPSHOT (mutable) versions flagged.
- **Composer (PHP):** `composer require --no-scripts --no-plugins`; `dist.shasum`;
  VCS sources, plugins, lifecycle scripts and custom repositories flagged.
- **pub (Dart):** `dart pub get`; sha256 per hosted package; git/path sources flagged.
- **RubyGems:** `bundle lock` + `bundle cache --no-install` (no native builds);
  GIT sources and non-rubygems.org remotes flagged.
- **SwiftPM:** `swift package resolve`; git revision pins; branch pins flagged, and
  manifest evaluation at resolve time noted.
- **Source-audited (no coordinate resolution — read a committed lockfile):**
  Julia (`Manifest.toml`: repo-url, build.jl), Conan (`conan.lock`: recipe revisions,
  conanfile.py), vcpkg (`vcpkg.json`: baseline, custom registries), CRAN
  (`renv.lock`/`DESCRIPTION`: non-CRAN sources, Remotes), Deno (`deno.lock`: http,
  missing integrity), CocoaPods (`Podfile.lock`: external sources, checksums).
- **github / url / local:** fetch the exact source (clone at SHA / download by
  sha256 / copy on-disk) and audit it as-is — no registry closure, so the closure
  is reported uncertified unless a lockfile is committed. **Native build detection**
  (Makefile/configure/CMake/binding.gyp/PHP config.m4/nginx config) flags build-time
  code execution for C/C++, nginx modules and native extensions.

Resolution can still *attempt* to run code (npm is safe with `--ignore-scripts`,
but sdists/`build.rs`/MSBuild targets are riskier), so it only ever runs inside a
disposable container (`require_container`) with credentials scrubbed
(`scrubbed_env`, `assert_no_claude_key`).

## Divergences we report (npm shown; other ecosystems analogous)

| Signal | Severity | Why it is the "mirage" |
|---|---|---|
| `overrides` / `resolutions` rewriting a nested dep | HIGH | Swaps a safe transitive dep for another version — top-level lib looks fine, install does not |
| Non-registry source (git+, http, file:, link) | HIGH | Bypasses registry integrity; mutable source can serve different code |
| Install hook (`preinstall`/`install`/`postinstall`) | MEDIUM | Runs arbitrary code at install time — primary npm RCE vector |
| Missing integrity (SRI) on a registry tarball | MEDIUM | Tampered tarball undetectable at install |
| Declared range ≠ resolved exact version | LOW/info | What installs tomorrow may differ |

The verdict `scanned_equals_executed` is **NO** when any HIGH divergence exists,
**YES** otherwise (MEDIUM items are residual install-time behaviour to review).

Output: `reports/00-provenance.json` with `verdict`, `signals`, and
`provenance_findings` (CLAUDE.md §4 schema, `source_tool: "provenance"`). The
HIGH/MEDIUM items are merged into `reports/findings.json` during synthesis.
