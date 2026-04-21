---
name: html-report-renderer
description: Render reports/findings.json + reports/SUMMARY.md into a single-file, self-contained reports/SUMMARY.html whose visual quality matches the /reports/example-summary page on coldvault.dev. No external fonts, no JS framework, no network fetches — the user can double-click the file, email it, or host it anywhere.
license: MIT (ZONOVA RESEARCH — coldvault.dev)
---

# html-report-renderer

**Goal** — turn the audit artefacts (`reports/findings.json`,
`reports/SUMMARY.md`) into a **single** self-contained HTML file at
`reports/SUMMARY.html`. The file must open correctly via
`file://` in any modern browser, with zero network requests.

This is the last step of `/audit`. Run it after SUMMARY.md and findings.json
have been synthesised.

## Hard constraints

- **Self-contained**: all CSS inlined inside `<style>`. No external fonts,
  no `<link rel="stylesheet">`, no remote images, no JS, no CDN.
- **Offline-first**: opens from the filesystem (`file://…/SUMMARY.html`)
  without internet.
- **Static**: no JavaScript required for layout or content. Optional
  progressive enhancement (print button, clipboard copy) must be
  defensive — fail silent when disabled.
- **Do not execute target/ code**. The renderer reads only from
  `reports/` and writes only to `reports/`.
- **Do not phone home**. Never embed analytics, no `fetch()`, no
  `navigator.sendBeacon`, no tracking pixels.

## Visual language

Mirror the `/reports/example-summary` page on coldvault.dev:

- Dark background (`#0a0a0f` range), neon cyan `#00e5ff`, neon magenta
  `#ff2fb4`, neon violet `#8b5cf6` accents.
- Glass cards (semi-transparent white over dark with subtle border).
- NO-GO / GO verdict banner at the top, colour-coded.
- Scorecard with HIGH / MED / LOW counts.
- Kill-chain block when `findings.json` enumerates ≥ 3 HIGH findings
  that chain into each other (heuristic: shared category × sequential
  location).
- Severity tables with colour-coded icons.
- System-font stack — no Google Fonts. Typography falls back to
  `ui-monospace`, `SF Mono`, `Menlo` for code; `system-ui`, `-apple-system`,
  `Segoe UI` for body.

## How to invoke

```bash
python3 scripts/render-report.py   # primary path
# or
bash scripts/render-report.sh      # bash wrapper, same behaviour
```

Both commands are idempotent and non-destructive — they overwrite
`reports/SUMMARY.html` only. Exit codes:

- `0` — success, file written
- `2` — `reports/SUMMARY.md` missing (run the audit first)
- `3` — `reports/findings.json` malformed (HTML still rendered from
  SUMMARY.md alone, warning printed)

## What the script does

1. Load `reports/findings.json` if present. Tolerate missing/invalid
   files — degrade gracefully.
2. Load `reports/SUMMARY.md`. If absent, bail with exit 2.
3. Extract the verdict line (first occurrence of `NO-GO` / `GO` /
   `BLOCK` / `Verdict` in the Markdown) for the banner.
4. Compute severity counts from `findings.json` (fallback: parse the
   `Finding counts` table from SUMMARY.md).
5. Render Markdown → HTML with a minimal stdlib-only converter
   (headings, paragraphs, lists, code, tables, blockquotes, inline
   emphasis, links). No `pip install` — the devcontainer does not run
   `pip` during audit.
6. Emit `reports/SUMMARY.html` with inline CSS, structured header,
   scorecard, rendered narrative, findings table, footer.

## When to re-run

- After every full `/audit` run (the pipeline does this automatically).
- After hand-editing `reports/SUMMARY.md` to include reviewer notes.
- Never in CI against untrusted `reports/` written by the target —
  the renderer escapes HTML, but keep the trust boundary clean.

## Deliverable shape

`reports/SUMMARY.html` — typical size 50–150 KB depending on findings
count. Opens in any browser. Can be:

- Double-clicked from a file manager.
- Attached to email.
- Uploaded to a GitHub release as an asset.
- Served as a static artefact on the audit dashboard.

## Do not

- Render `target/` source directly into the HTML. Only reference
  files by path/line (e.g. `backend/config.js:7`).
- Include raw stack traces or command output without escaping.
- Embed images from `target/`. If a screenshot is needed, the analyst
  copies it into `reports/` manually first.
