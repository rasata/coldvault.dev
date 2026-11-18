---
name: coldvault-audit
description: Audit an untrusted library (npm first; PyPI/GitHub/Go/Rust/.NET/Java via adapters) before you add it to a project. Pins the exact coordinate, resolves the FULL dependency closure with integrity hashes inside a disposable GitHub container (Actions or Codespaces), certifies that "what is scanned is what will execute", then runs the coldvault static pipeline and returns a go/no-go report. Never executes untrusted code on the user's machine and never exposes a Claude API key to it.
license: MIT (ZONOVA RESEARCH — coldvault.dev)
---

# coldvault-audit

One-command, GitHub-driven audit of a library you are about to depend on.

## When to invoke

- "Audit this npm/pip package before I add it", "is `<lib>` safe to depend on?",
  "check this dependency / this GitHub repo", "/coldvault-audit <coordinate>".
- Any time a new third-party dependency is about to enter a project and the user
  wants assurance it is not a supply-chain / malware / credential-theft risk.

## Prime directives (inherit from CLAUDE.md §0)

1. **Never execute untrusted code on the user's host.** All fetch/resolve/scan
   work happens in a disposable container on GitHub.
2. **Never let a Claude/Anthropic credential reach the untrusted-code steps.**
   The synthesis that needs Claude runs *in this session*, after results are
   downloaded — not in CI. See "API-key safety" below.
3. **Certify provenance.** Resolve and freeze the exact closure; report every
   divergence between declared ↔ locked/installed ↔ registry. See
   `references/provenance-protocol.md`.

## Step 1 — Intake (pin the subject, defeat the "mirage")

Ask the user for an **explicit, pinned coordinate** — do not guess. The format is
`<ecosystem>:<spec>`:

**A. Direct coordinate resolution** (full integrity-pinned closure, scripts OFF):

| Ecosystem | Coordinate example | Resolver needs (in container) |
|---|---|---|
| npm (incl. TypeScript) | `npm:lodash@4.17.21` | `npm` (base image) |
| PyPI (Python) | `pypi:requests==2.31.0` | `pip` (wheels only) |
| Go | `go:github.com/pkg/errors@v0.9.1` | `go` (base image) |
| Rust / Cargo | `cargo:serde@1.0.197` | `cargo` (group `rust`) |
| .NET / NuGet | `nuget:Newtonsoft.Json@13.0.3` | `dotnet` (group `dotnet`) |
| Java / Maven | `maven:com.google.guava:guava:33.0.0-jre` | `mvn` (group `java`) |
| PHP / Composer | `composer:monolog/monolog@3.5.0` | `composer` (group `php`) |
| Dart / pub | `pub:http@1.2.0` | `dart` (group `dart`) |
| Ruby / RubyGems | `rubygems:rails@7.1.0` | `bundler` (group `ruby`) |
| Swift / SwiftPM | `swift:apple/swift-argument-parser@1.3.0` | `swift` |

**B. Source-audited** (resolution would run recipe/build code, so audit the
committed lockfile via `local:`/`github:` — the analyzer parses it without
executing anything): **Julia** (`Manifest.toml`), **Conan** & **vcpkg** (C/C++),
**R/CRAN** (`renv.lock`/`DESCRIPTION`), **Deno** (`deno.lock`), **CocoaPods**
(`Podfile.lock`). Their coordinate form prints guidance pointing you to `local:`/`github:`.

**C. Generic source modes** (exact source, no registry closure):

| Intent | Coordinate example | Resolver needs |
|---|---|---|
| A GitHub repo at a commit | `github:owner/repo@<sha>` | `git` |
| A raw tarball/sdist/archive URL | `url:https://…/pkg.tgz` | `curl`/`unzip` |
| A library already in a project | `local:./path/to/lib` | — |

For source modes, coldvault also runs **native build-system detection** (Makefile,
configure, CMake, `binding.gyp`, `config.m4`/`config.w32` for PHP C extensions,
nginx `config` module files, …) and flags build-time code execution — so C/C++
libraries, **nginx modules** and **PHP native extensions** are covered via source.

The matching toolchain must be present in the container — npm/pip/go are in the base
image, the rest install via `.devcontainer/install-optional-tools.sh`; an adapter
fails cleanly if its toolchain is missing. Source modes report the closure as
uncertified unless a lockfile is committed — recommend also running the published
coordinate.

Insist on an exact version / commit SHA — a floating range is itself a provenance
risk (what resolves tomorrow may differ). If the user only names a package, offer
to pin to the latest published version and record that choice.

**Why the coordinate matters (the mirage):** a library can look safe on disk yet
be overwritten at install time by a transitive dependency, a lifecycle hook, or a
non-registry source. We therefore audit *what actually installs*, not what the
author shows you — see Step 3.

## Step 2 — Choose the execution backend (GitHub)

Prereq: `gh auth status` must succeed (a GitHub account). Pick a backend:

- **GitHub Actions (default, headless).** Dispatch the audit workflow to the
  user's coldvault fork and pull the results back:
  ```bash
  gh workflow run coldvault-audit.yml -f source=<coordinate> [-f ref=<sha>]
  gh run watch "$(gh run list --workflow=coldvault-audit.yml -L1 --json databaseId -q '.[0].databaseId')"
  gh run download -n coldvault-reports -D reports/
  ```
  The workflow builds the devcontainer, runs `fetch-target.sh` → `provenance-check.py`
  → `audit-all.sh`, and uploads `reports/`. **No Claude key is present in CI.**

- **GitHub Codespaces (interactive).** When the user wants to explore:
  ```bash
  gh codespace create -R <owner>/coldvault.dev --devcontainer-path .devcontainer/devcontainer.json
  # then, inside the Codespace terminal:
  export COLDVAULT_ACCEPTABLE_USE=defensive-security-research-only
  bash scripts/fetch-target.sh <coordinate> && python3 scripts/provenance-check.py && /audit
  ```

If this session is already running **inside the coldvault repo in a container**
(devcontainer / Codespace — check `in_container` conditions), you may run the
steps directly instead of dispatching.

**Portability:** the skill is invokable from any project. The sandbox lives in the
user's **coldvault fork** on GitHub; the suspect code is never materialised in the
user's own project. If no fork exists, tell the user to fork
`coldvault.dev` once (or run `install-skill.sh` which records the fork slug).

## Step 3 — Provenance certification (runs in the container)

`fetch-target.sh <coordinate>` (via the ecosystem adapter) resolves the full
transitive closure to exact versions + integrity hashes and materialises it under
`target/` **with lifecycle scripts / builds disabled** (e.g. npm `npm ci
--ignore-scripts`, PyPI wheels-only, `go mod vendor`, `cargo vendor`, `dotnet
restore --use-lock-file`, `mvn dependency:copy-dependencies` — each verifies or
captures integrity without executing the package). Then `provenance-check.py`
writes `reports/00-provenance.json` with a verdict and a list of divergences
(each a `source_tool: "provenance"` finding):

- declared version ≠ resolved version;
- lockfile integrity missing / ≠ registry;
- install-time lifecycle hooks (`preinstall`/`install`/`postinstall`, `setup.py`,
  `build.rs`);
- non-registry dependencies (git+ssh, http URL, file:, link);
- `overrides`/`resolutions` that rewrite a nested dependency (**the mirage**).

The verdict `scanned_equals_executed` is **NO** if any HIGH divergence exists.

## Step 4 — Static pipeline (reuse existing)

`audit-all.sh` runs the unchanged coldvault scanners (secrets → deps → SAST → IaC
→ malware). Do not reimplement them.

## Step 5 — Synthesis (in this session, with Claude)

After `gh run download`, synthesise **in-session** (never in CI):

1. Merge `reports/00-provenance.json → provenance_findings` into `reports/findings.json`.
2. Invoke the analysis skills as `/audit` does: `defensive-payload-analysis`,
   `supply-chain-risk-auditor`, `variant-analysis`, etc.
3. Write `reports/SUMMARY.md` and run `html-report-renderer` → `reports/SUMMARY.html`.
4. Lead the report with the provenance verdict: **"Scanned == what will execute? YES/NO"**,
   then severity counts and a go/no-go recommendation.

## API-key safety (do not skip)

- The runner/Codespace that touches untrusted code must carry **no** Claude
  credential. `fetch-target.sh` calls `assert_no_claude_key` and runs the resolver
  through `scrubbed_env` (strips `ANTHROPIC_*`/`CLAUDE_*`).
- Never write a key to a file in the repo, a `.env`, an artifact, or a log.
- Default synthesis is **in-session**. Only if the user explicitly wants Claude to
  run *in CI* do you discuss it — and then require a short-lived OIDC secret, never
  a long-lived key, with `--ignore-scripts` enforced. This is not the default path.

## Guard rails

- If tempted to run `npm install` / `pip install` / the target's scripts locally:
  stop (see `untrusted-code-isolation`). The container does resolution; your host
  never does.
- Adding a new ecosystem = write one adapter in `scripts/adapters/` against
  `references/adapter-interface.md`. Nothing else changes.
