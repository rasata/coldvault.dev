---
name: audit-context-building
description: Inventory the suspect repository (languages, frameworks, package managers, entry points, build system, CI) before any scan. Always run this first — subsequent skills depend on its output.
license: MIT (ZONOVA RESEARCH — coldvault.dev)
source_inspiration: trailofbits/skills/audit-context-building
---

# audit-context-building

**Goal** — produce `reports/00-context.md` that answers:

1. What languages are present (LOC per language via `tokei` / `cloc` / `file`)?
2. What package managers / lockfiles exist?
3. What is the declared entry point(s) — `main`, `bin`, `scripts.start`, exported
   library surface, CLI subcommands, HTTP routes, CI workflows?
4. What is the build system? What runs at install time (`postinstall`,
   `preinstall`, `setup.py`, `build.rs`, `Makefile` targets)?
5. Who are the top contributors (`git log --format='%an' | sort -u | head`)?
   When was the last commit? Any rewritten history?
6. What external services does it talk to (grep for URLs, domains, S3 buckets,
   webhook endpoints, hardcoded IPs)?

## Procedure

```bash
# All commands are READ-ONLY — safe on target/.
find target -maxdepth 3 -name 'package.json' -o -name 'pyproject.toml' \
     -o -name 'go.mod' -o -name 'Cargo.toml' -o -name 'pom.xml' \
     -o -name 'build.gradle*' -o -name 'composer.json' -o -name 'Gemfile'

git -C target log --oneline --all | head -50
git -C target shortlog -sne | head -20

# URLs & network endpoints
grep -rEn "https?://|wss?://|ssh://|git\+" target --include='*.{js,ts,py,go,rs,json,yaml,yml,toml,md}' | head -100
```

## Output

Write `reports/00-context.md`:

```markdown
# Audit context — <target name> @ <commit>

## Languages
| Language | Files | LOC |
|---|---|---|
| TypeScript | 142 | 18,904 |

## Package managers
- npm (package-lock.json v3) — 812 deps (direct: 47)
- pip (requirements.txt) — 23 deps

## Entry points
- HTTP: `src/server.ts:42` — Express, routes mounted in `src/routes/*.ts`
- CLI: `bin/cli.js`
- Library: `exports` in `package.json`

## Install-time hooks (⚠ high risk)
- `package.json` scripts.postinstall → `node scripts/setup.js`
- `Cargo.toml` build.rs present

## Contributors / history
- 3 authors, last commit 2026-03-14, force-push detected (see §…)

## Network endpoints referenced
- telemetry.example.com
- raw.githubusercontent.com/<user>/<repo>
```

## Red flags to surface immediately

- Install-time scripts that execute code
- `git+ssh://` or `github:user/repo#commit` deps pointing outside known orgs
- Minified / obfuscated source checked in
- `.npmrc` / `.yarnrc` pointing to non-public registries
- Recent force-pushes (history rewriting)
- Single-author repos with no test suite
