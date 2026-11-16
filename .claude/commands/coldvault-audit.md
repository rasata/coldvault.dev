---
description: Audit an untrusted library before adding it as a dependency — pins the coordinate, resolves the full closure in a disposable GitHub container, certifies "scanned == executed", runs the coldvault pipeline, returns a go/no-go report.
argument-hint: "<ecosystem>:<spec>  e.g. npm:lodash@4.17.21"
---

Invoke the **`coldvault-audit`** skill to audit a library the user is about to
depend on. Follow the skill exactly — never execute untrusted code on the host and
never expose a Claude credential to it.

Coordinate (optional): $ARGUMENTS

- If `$ARGUMENTS` holds an `<ecosystem>:<spec>` coordinate (e.g.
  `npm:lodash@4.17.21`), use it as the audit subject.
- If it is empty or ambiguous, ask the user for an explicit, pinned coordinate
  (Step 1 of the skill) — do not guess a version.
- Confirm `gh auth status` (a GitHub account is required), then dispatch to the
  user's coldvault fork via GitHub Actions (default) or Codespaces, as the skill
  describes. Default synthesis runs in this session after `gh run download`.

Ecosystems — direct resolution (full integrity-pinned closure): **npm (TS), PyPI,
Go, Cargo, NuGet, Maven, Composer (PHP), pub (Dart), RubyGems, SwiftPM**. Source-
audited via `local:`/`github:` (resolution would run recipe/build code): **Julia,
Conan, vcpkg (C/C++), CRAN (R), Deno, CocoaPods**. Generic **github/url/local**
modes audit exact source + detect native build systems (C/C++, nginx modules, PHP
native extensions). Toolchains: npm/pip/go are baked in; the rest install via
`.devcontainer/install-optional-tools.sh`.
