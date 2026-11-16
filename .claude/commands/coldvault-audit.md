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

Ecosystems: **npm, PyPI, Go, Cargo, NuGet, Maven** resolve a full integrity-pinned
closure (the matching toolchain must be present in the container — npm/pip are
baked in, the rest install via `.devcontainer/install-optional-tools.sh`).
**github/url/local** audit the exact source but do not resolve a registry closure.
