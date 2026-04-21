#!/usr/bin/env python3
"""
render-report.py — turn reports/findings.json + reports/SUMMARY.md into a
single-file, self-contained reports/SUMMARY.html whose visual quality
matches the /reports/example-summary page on coldvault.dev.

Stdlib-only. Safe to run from any CWD that contains a reports/ directory.
Never reads from or writes to target/. Never makes network calls.
"""
from __future__ import annotations

import html
import json
import os
import re
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable


REPO_ROOT = Path(__file__).resolve().parent.parent
REPORTS_DIR = Path(os.environ.get("REPORTS_DIR", REPO_ROOT / "reports"))
OUT_PATH = REPORTS_DIR / "SUMMARY.html"


# ─────────────────────────────── data loading ──────────────────────────────


@dataclass
class Finding:
    file: str = ""
    line: int | None = None
    severity: str = "MEDIUM"
    category: str = ""
    description: str = ""
    exploit_scenario: str = ""
    recommendation: str = ""
    confidence: float | None = None
    source_tool: str = ""


@dataclass
class Audit:
    target_commit: str = ""
    target_name: str = ""
    files_reviewed: int | None = None
    findings: list[Finding] = field(default_factory=list)
    summary_md: str = ""
    verdict: str = ""  # "NO-GO" | "GO" | "BLOCK" | ""

    @property
    def counts(self) -> dict[str, int]:
        c = {"HIGH": 0, "MEDIUM": 0, "LOW": 0, "INFO": 0}
        for f in self.findings:
            sev = (f.severity or "").upper()
            if sev in c:
                c[sev] += 1
        return c


def load_findings(path: Path) -> tuple[list[Finding], dict, str | None]:
    if not path.exists():
        return [], {}, None
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        return [], {}, f"findings.json is not valid JSON: {e}"

    raw_findings = raw.get("findings", []) if isinstance(raw, dict) else []
    out: list[Finding] = []
    for item in raw_findings:
        if not isinstance(item, dict):
            continue
        out.append(
            Finding(
                file=str(item.get("file", "")),
                line=item.get("line") if isinstance(item.get("line"), int) else None,
                severity=str(item.get("severity", "MEDIUM")).upper(),
                category=str(item.get("category", "")),
                description=str(item.get("description", "")),
                exploit_scenario=str(item.get("exploit_scenario", "")),
                recommendation=str(item.get("recommendation", "")),
                confidence=item.get("confidence") if isinstance(item.get("confidence"), (int, float)) else None,
                source_tool=str(item.get("source_tool", "")),
            )
        )
    meta = raw.get("analysis_summary", {}) if isinstance(raw, dict) else {}
    return out, meta if isinstance(meta, dict) else {}, None


VERDICT_RE = re.compile(r"\b(NO-?GO|BLOCK|GO)\b", re.IGNORECASE)


def detect_verdict(md: str) -> str:
    for line in md.splitlines():
        stripped = line.strip("# ").strip()
        if not stripped:
            continue
        m = VERDICT_RE.search(line)
        if m:
            v = m.group(1).upper().replace("NOGO", "NO-GO")
            return v
    return ""


def detect_target(md: str) -> tuple[str, str]:
    m = re.search(r"\*\*Target\*\*\s*[:：]\s*`?([^`\n]+)`?.*?@\s*`([^`\s]+)`", md)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    m = re.search(r"target[\s:]+([^\s]+)", md, re.IGNORECASE)
    if m:
        return m.group(1).strip(), ""
    return "", ""


# ─────────────────────────── minimal Markdown → HTML ───────────────────────


_INLINE_CODE = re.compile(r"`([^`]+)`")
_BOLD = re.compile(r"\*\*([^*]+)\*\*|__([^_]+)__")
_ITALIC = re.compile(r"(?<!\*)\*([^*\n]+)\*(?!\*)|(?<!_)_([^_\n]+)_(?!_)")
_LINK = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
_AUTOLINK = re.compile(r"(?<![\"'(>])\b(https?://[^\s<>\"'`)]+)")


def _esc(s: str) -> str:
    return html.escape(s, quote=True)


def render_inline(s: str) -> str:
    s = _esc(s)
    # code spans first (so we don't double-escape their contents)
    s = _INLINE_CODE.sub(lambda m: f"<code>{m.group(1)}</code>", s)
    # links before bold/italic to avoid mangling URL chars
    s = _LINK.sub(
        lambda m: f'<a href="{m.group(2)}" target="_blank" rel="noreferrer noopener">{m.group(1)}</a>',
        s,
    )
    s = _AUTOLINK.sub(
        lambda m: f'<a href="{m.group(1)}" target="_blank" rel="noreferrer noopener">{m.group(1)}</a>',
        s,
    )
    s = _BOLD.sub(lambda m: f"<strong>{m.group(1) or m.group(2)}</strong>", s)
    s = _ITALIC.sub(lambda m: f"<em>{m.group(1) or m.group(2)}</em>", s)
    return s


def render_markdown(md: str) -> str:
    """Minimal but complete enough for our SUMMARY.md. Stdlib-only."""
    lines = md.splitlines()
    out: list[str] = []
    i = 0
    n = len(lines)

    def flush_paragraph(buf: list[str]):
        if buf:
            out.append(f"<p>{render_inline(' '.join(buf).strip())}</p>")
            buf.clear()

    para: list[str] = []

    while i < n:
        line = lines[i]
        stripped = line.strip()

        # fenced code
        if stripped.startswith("```"):
            flush_paragraph(para)
            lang = stripped[3:].strip()
            i += 1
            code_lines: list[str] = []
            while i < n and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            i += 1  # skip closing fence
            cls = f' class="lang-{_esc(lang)}"' if lang else ""
            out.append(f"<pre><code{cls}>{_esc(chr(10).join(code_lines))}</code></pre>")
            continue

        # headings
        h = re.match(r"^(#{1,6})\s+(.+?)\s*#*\s*$", line)
        if h:
            flush_paragraph(para)
            level = len(h.group(1))
            out.append(f"<h{level}>{render_inline(h.group(2))}</h{level}>")
            i += 1
            continue

        # horizontal rule
        if re.match(r"^(\s*[-*_]){3,}\s*$", line) and stripped:
            flush_paragraph(para)
            out.append("<hr>")
            i += 1
            continue

        # GFM table
        if "|" in line and i + 1 < n and re.match(r"^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$", lines[i + 1]):
            flush_paragraph(para)
            header_cells = [c.strip() for c in line.strip().strip("|").split("|")]
            i += 2  # skip header and separator
            rows: list[list[str]] = []
            while i < n and "|" in lines[i] and lines[i].strip():
                row = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                rows.append(row)
                i += 1
            out.append('<div class="table-wrap"><table>')
            out.append("<thead><tr>")
            for c in header_cells:
                out.append(f"<th>{render_inline(c)}</th>")
            out.append("</tr></thead><tbody>")
            for r in rows:
                out.append("<tr>")
                for c in r:
                    out.append(f"<td>{render_inline(c)}</td>")
                out.append("</tr>")
            out.append("</tbody></table></div>")
            continue

        # blockquote
        if stripped.startswith(">"):
            flush_paragraph(para)
            bq: list[str] = []
            while i < n and lines[i].strip().startswith(">"):
                bq.append(lines[i].strip()[1:].lstrip())
                i += 1
            out.append(f"<blockquote>{render_inline(' '.join(bq))}</blockquote>")
            continue

        # unordered list
        if re.match(r"^\s*[-*+]\s+", line):
            flush_paragraph(para)
            out.append("<ul>")
            while i < n and re.match(r"^\s*[-*+]\s+", lines[i]):
                item = re.sub(r"^\s*[-*+]\s+", "", lines[i])
                out.append(f"<li>{render_inline(item)}</li>")
                i += 1
            out.append("</ul>")
            continue

        # ordered list
        if re.match(r"^\s*\d+\.\s+", line):
            flush_paragraph(para)
            out.append("<ol>")
            while i < n and re.match(r"^\s*\d+\.\s+", lines[i]):
                item = re.sub(r"^\s*\d+\.\s+", "", lines[i])
                out.append(f"<li>{render_inline(item)}</li>")
                i += 1
            out.append("</ol>")
            continue

        # blank line → paragraph boundary
        if not stripped:
            flush_paragraph(para)
            i += 1
            continue

        para.append(stripped)
        i += 1

    flush_paragraph(para)
    return "\n".join(out)


# ──────────────────────────── HTML rendering ───────────────────────────────


CSS = r"""
:root {
  --bg: #0a0a0f;
  --bg-2: #11111a;
  --surface: rgba(255,255,255,0.03);
  --surface-2: rgba(255,255,255,0.06);
  --border: rgba(255,255,255,0.10);
  --text: #e8e8ef;
  --muted: #9aa0b4;
  --cyan: #00e5ff;
  --magenta: #ff2fb4;
  --violet: #8b5cf6;
  --red: #ff4d64;
  --green: #34d399;
  --mono: ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  --sans: system-ui, -apple-system, "Segoe UI", Roboto, Inter, sans-serif;
}
* { box-sizing: border-box; }
html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
body {
  background:
    radial-gradient(60% 50% at 10% 0%, rgba(0,229,255,0.08), transparent 60%),
    radial-gradient(50% 40% at 90% 20%, rgba(255,47,180,0.07), transparent 60%),
    radial-gradient(40% 30% at 50% 100%, rgba(139,92,246,0.08), transparent 60%),
    var(--bg);
  min-height: 100vh;
}
main {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 20px 80px;
}
.topbar {
  position: sticky; top: 0; z-index: 10;
  backdrop-filter: blur(12px);
  background: rgba(10,10,15,0.7);
  border-bottom: 1px solid var(--border);
}
.topbar-inner {
  max-width: 960px; margin: 0 auto;
  padding: 12px 20px;
  display: flex; align-items: center; justify-content: space-between;
  font-family: var(--mono); font-size: 12px;
}
.brand { display: inline-flex; align-items: center; gap: 8px; }
.brand .dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: linear-gradient(135deg, var(--cyan), var(--magenta));
  box-shadow: 0 0 12px rgba(0,229,255,0.6);
}
.brand strong {
  background: linear-gradient(90deg, var(--cyan), var(--magenta));
  -webkit-background-clip: text; background-clip: text; color: transparent;
  font-family: var(--sans); font-size: 13px; letter-spacing: 0.04em;
}
.brand small { color: var(--muted); }
.actions button {
  background: var(--surface); border: 1px solid var(--border); color: var(--text);
  font-family: var(--mono); font-size: 11px;
  padding: 6px 10px; border-radius: 6px; cursor: pointer;
}
.actions button:hover { border-color: var(--cyan); color: var(--cyan); }

/* badges */
.badges { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px; border-radius: 999px;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.04em;
  border: 1px solid var(--border); background: var(--surface);
  color: var(--muted);
}
.badge.cyan { border-color: rgba(0,229,255,0.35); background: rgba(0,229,255,0.08); color: var(--cyan); }
.badge.magenta { border-color: rgba(255,47,180,0.35); background: rgba(255,47,180,0.08); color: var(--magenta); }
.badge.violet { border-color: rgba(139,92,246,0.35); background: rgba(139,92,246,0.08); color: var(--violet); }
.badge.red { border-color: rgba(255,77,100,0.45); background: rgba(255,77,100,0.12); color: var(--red); }
.badge.green { border-color: rgba(52,211,153,0.45); background: rgba(52,211,153,0.10); color: var(--green); }

/* header */
.report-header h1 {
  margin: 8px 0 12px;
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-weight: 700;
}
.report-header h1 .accent {
  background: linear-gradient(90deg, var(--cyan), var(--violet) 50%, var(--magenta));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.report-header .lede { color: var(--muted); font-size: 16px; max-width: 68ch; }
.meta {
  margin-top: 20px; padding: 14px 16px; border-radius: 10px;
  background: var(--surface); border: 1px solid var(--border);
  font-family: var(--mono); font-size: 12px; color: var(--muted);
  line-height: 1.8;
}
.meta b { color: var(--cyan); font-weight: 600; }

/* verdict banner */
.verdict {
  margin: 32px 0 28px;
  padding: 22px 24px; border-radius: 18px;
  display: flex; gap: 16px; align-items: flex-start;
  border: 2px solid rgba(255,77,100,0.45);
  background: linear-gradient(135deg, rgba(255,77,100,0.12), rgba(255,47,180,0.05));
}
.verdict.go { border-color: rgba(52,211,153,0.45);
  background: linear-gradient(135deg, rgba(52,211,153,0.12), rgba(0,229,255,0.04)); }
.verdict.none { border-color: var(--border); background: var(--surface); }
.verdict .icon {
  flex: 0 0 auto; width: 48px; height: 48px; border-radius: 12px;
  display: grid; place-items: center;
  background: rgba(255,77,100,0.18); color: var(--red);
  font-weight: 800;
}
.verdict.go .icon { background: rgba(52,211,153,0.15); color: var(--green); }
.verdict .label {
  font-family: var(--mono); font-size: 11px; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase; color: var(--red);
}
.verdict.go .label { color: var(--green); }
.verdict h2 { margin: 4px 0 8px; font-size: 32px; line-height: 1; font-weight: 800; }
.verdict p { margin: 6px 0; color: var(--text); }

/* scorecard */
.scorecard {
  display: grid; gap: 12px; grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 32px;
}
@media (max-width: 640px) { .scorecard { grid-template-columns: repeat(2, 1fr); } }
.score {
  padding: 18px; border-radius: 14px;
  border: 1px solid var(--border); background: var(--surface);
}
.score .k {
  font-family: var(--mono); font-size: 11px; color: var(--muted);
  letter-spacing: 0.1em; text-transform: uppercase;
}
.score .v { margin-top: 6px; font-size: 40px; font-weight: 800; line-height: 1; }
.score .h { margin-top: 4px; color: var(--muted); font-size: 12px; }
.score.high { border-color: rgba(255,77,100,0.4); background: rgba(255,77,100,0.05); }
.score.high .v { color: var(--red); }
.score.med { border-color: rgba(255,47,180,0.35); background: rgba(255,47,180,0.05); }
.score.med .v { color: var(--magenta); }
.score.low { border-color: rgba(139,92,246,0.35); background: rgba(139,92,246,0.05); }
.score.low .v { color: var(--violet); }
.score.info .v { color: var(--muted); }

/* sections */
section.block { margin-top: 40px; }
section.block .head {
  display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px;
}
section.block .head .dot {
  width: 36px; height: 36px; border-radius: 10px; flex: 0 0 auto;
  display: grid; place-items: center;
  background: linear-gradient(135deg, rgba(0,229,255,0.15), rgba(255,47,180,0.15));
  color: var(--cyan); font-family: var(--mono); font-weight: 700;
}
section.block .head h2 { margin: 0; font-size: 24px; letter-spacing: -0.01em; }
section.block .head .sub {
  color: var(--magenta); font-family: var(--mono); font-size: 11px;
  letter-spacing: 0.05em; margin-top: 2px;
}

/* findings table */
.findings {
  overflow: hidden; border-radius: 12px; border: 1px solid var(--border);
}
.findings table { width: 100%; border-collapse: collapse; font-size: 14px; }
.findings thead { background: rgba(255,255,255,0.04); }
.findings th {
  text-align: left; padding: 10px 12px; font-weight: 600;
  color: var(--muted); font-size: 12px; letter-spacing: 0.04em;
}
.findings td { padding: 12px; vertical-align: top; border-top: 1px solid var(--border); }
.findings tr:hover td { background: rgba(255,255,255,0.02); }
.findings .loc { font-family: var(--mono); font-size: 12px; color: var(--cyan); }
.findings .cat { font-weight: 600; }
.sev {
  display: inline-block; padding: 2px 8px; border-radius: 4px;
  font-family: var(--mono); font-size: 10px; font-weight: 700;
  letter-spacing: 0.1em;
}
.sev.HIGH { background: rgba(255,77,100,0.15); color: var(--red); border: 1px solid rgba(255,77,100,0.5); }
.sev.MEDIUM { background: rgba(255,47,180,0.15); color: var(--magenta); border: 1px solid rgba(255,47,180,0.5); }
.sev.LOW { background: rgba(139,92,246,0.15); color: var(--violet); border: 1px solid rgba(139,92,246,0.5); }
.sev.INFO { background: var(--surface); color: var(--muted); border: 1px solid var(--border); }

/* markdown narrative */
.markdown {
  margin-top: 40px;
  padding-top: 24px; border-top: 1px solid var(--border);
}
.markdown h1, .markdown h2, .markdown h3, .markdown h4 {
  margin-top: 32px; margin-bottom: 12px; letter-spacing: -0.01em;
}
.markdown h1 { font-size: 28px; }
.markdown h2 {
  font-size: 22px;
  padding-bottom: 6px; border-bottom: 1px solid var(--border);
}
.markdown h3 { font-size: 17px; color: var(--text); }
.markdown p { margin: 10px 0; color: var(--text); }
.markdown ul, .markdown ol { padding-left: 24px; }
.markdown li { margin: 4px 0; }
.markdown a { color: var(--cyan); text-decoration: underline; text-underline-offset: 2px; }
.markdown code {
  background: var(--surface-2); padding: 1px 6px; border-radius: 4px;
  font-family: var(--mono); font-size: 0.92em; color: var(--magenta);
}
.markdown pre {
  background: #07070c; border: 1px solid var(--border);
  padding: 14px 16px; border-radius: 10px;
  overflow-x: auto; font-size: 13px; line-height: 1.55;
}
.markdown pre code { background: transparent; color: var(--cyan); padding: 0; }
.markdown blockquote {
  margin: 12px 0; padding: 8px 14px; border-left: 3px solid var(--magenta);
  background: var(--surface); color: var(--muted);
}
.markdown hr { border: 0; border-top: 1px solid var(--border); margin: 24px 0; }
.markdown .table-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: 10px; margin: 12px 0; }
.markdown table { width: 100%; border-collapse: collapse; font-size: 14px; }
.markdown thead { background: rgba(255,255,255,0.04); }
.markdown th { text-align: left; padding: 10px 12px; font-weight: 600; color: var(--muted); }
.markdown td { padding: 10px 12px; border-top: 1px solid var(--border); vertical-align: top; }
.markdown strong { color: var(--text); }

/* footer */
footer {
  margin-top: 64px; padding-top: 24px; border-top: 1px solid var(--border);
  color: var(--muted); font-size: 13px; text-align: center;
}
footer a { color: var(--cyan); }

@media print {
  body { background: #fff; color: #000; }
  .topbar, .actions { display: none; }
  main { max-width: 100%; padding: 0; }
  .verdict, .score, section.block, .findings, .markdown pre {
    break-inside: avoid;
  }
  a { color: #000; }
}
"""


COPY_JS = r"""
(function() {
  try {
    var btn = document.getElementById('copy-btn');
    if (!btn) return;
    btn.addEventListener('click', function() {
      try {
        var text = document.body.innerText;
        navigator.clipboard.writeText(text).then(function() {
          btn.textContent = 'copied';
          setTimeout(function() { btn.textContent = 'copy plain'; }, 1500);
        });
      } catch (e) { /* silent */ }
    });
    var printBtn = document.getElementById('print-btn');
    if (printBtn) { printBtn.addEventListener('click', function() { window.print(); }); }
  } catch (e) { /* silent */ }
})();
"""


def render_scorecard(counts: dict[str, int]) -> str:
    return f"""
<div class="scorecard">
  <div class="score high"><div class="k">High</div><div class="v">{counts['HIGH']}</div>
    <div class="h">Independently exploitable</div></div>
  <div class="score med"><div class="k">Medium</div><div class="v">{counts['MEDIUM']}</div>
    <div class="h">Exploitable under specific conditions</div></div>
  <div class="score low"><div class="k">Low</div><div class="v">{counts['LOW']}</div>
    <div class="h">Defense-in-depth</div></div>
  <div class="score info"><div class="k">Info</div><div class="v">{counts['INFO']}</div>
    <div class="h">Non-security / product</div></div>
</div>""".strip()


def render_findings_table(findings: list[Finding]) -> str:
    if not findings:
        return ""
    rank = {"HIGH": 0, "MEDIUM": 1, "LOW": 2, "INFO": 3}
    ordered = sorted(findings, key=lambda f: (rank.get(f.severity, 9), -(f.confidence or 0)))
    rows: list[str] = []
    for idx, f in enumerate(ordered, 1):
        loc = _esc(f.file)
        if f.line:
            loc = f'{loc}:<span style="color:var(--muted)">{f.line}</span>'
        conf = f'<span style="color:var(--muted)">conf {f.confidence:.2f}</span>' if f.confidence is not None else ""
        rows.append(
            f"""<tr>
              <td style="color:var(--muted); font-family: var(--mono); font-size: 12px;">{idx:02d}</td>
              <td><span class="sev {f.severity}">{f.severity}</span></td>
              <td class="cat">{_esc(f.category)}</td>
              <td class="loc">{loc}</td>
              <td>{_esc(f.description)}<br><span style="color:var(--muted); font-size:12px;">{_esc(f.recommendation)}</span> {conf}</td>
            </tr>"""
        )
    return f"""
<section class="block"><div class="head">
  <div class="dot">§</div>
  <div><h2>Findings</h2><div class="sub">Sorted by severity, then confidence</div></div>
</div>
<div class="findings"><table>
  <thead><tr>
    <th style="width:5%">#</th><th style="width:9%">Severity</th><th style="width:22%">Category</th>
    <th style="width:26%">Location</th><th>Impact &amp; recommendation</th>
  </tr></thead>
  <tbody>{''.join(rows)}</tbody>
</table></div></section>""".strip()


def render_html(audit: Audit, warnings: list[str]) -> str:
    generated = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    verdict = audit.verdict.upper()
    verdict_class = "go" if verdict == "GO" else ("none" if not verdict else "")
    verdict_body = ""
    if verdict:
        verdict_body = f"""
<section class="verdict {verdict_class}">
  <div class="icon">!</div>
  <div>
    <div class="label">Verdict</div>
    <h2>{_esc(verdict)}</h2>
    <p>{'Independently-exploitable findings detected. Do not deploy in current state; treat any running instance as potentially compromised.' if verdict in ('NO-GO','BLOCK') else 'Audit cleared under ColdVault thresholds. Re-run after material changes.'}</p>
  </div>
</section>""".strip()

    target_line = ""
    if audit.target_name or audit.target_commit:
        target_line = f"<div><b>target:</b> {_esc(audit.target_name)}" + (
            f" @ <code>{_esc(audit.target_commit)}</code>" if audit.target_commit else ""
        ) + "</div>"

    warning_block = ""
    if warnings:
        warning_block = '<div class="meta" style="border-color: rgba(255,47,180,0.4); color: var(--magenta)">'
        for w in warnings:
            warning_block += f"⚠ {_esc(w)}<br>"
        warning_block += "</div>"

    body_md_html = render_markdown(audit.summary_md) if audit.summary_md else ""

    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ColdVault audit report — {_esc(audit.target_name or 'unknown target')}</title>
<meta name="generator" content="coldvault.dev html-report-renderer">
<meta name="robots" content="noindex">
<style>{CSS}</style>
</head>
<body>
<header class="topbar"><div class="topbar-inner">
  <span class="brand"><span class="dot"></span><strong>COLDVAULT</strong><small>· audit report</small></span>
  <span class="actions">
    <button id="copy-btn" type="button">copy plain</button>
    <button id="print-btn" type="button">print / save PDF</button>
  </span>
</div></header>

<main>
  <section class="report-header">
    <div class="badges">
      <span class="badge cyan">self-contained</span>
      {f'<span class="badge red">{_esc(verdict)}</span>' if verdict in ('NO-GO','BLOCK') else ''}
      {f'<span class="badge green">{_esc(verdict)}</span>' if verdict == 'GO' else ''}
      <span class="badge violet">coldvault.dev</span>
    </div>
    <h1>ColdVault — <span class="accent">Security Audit Report</span></h1>
    <p class="lede">Auto-generated from <code>reports/findings.json</code> and <code>reports/SUMMARY.md</code>. No network calls. No external assets. Hand this file to a stakeholder; it renders the same from an email attachment as from a web server.</p>
    <div class="meta">
      {target_line}
      <div><b>generated:</b> {generated}</div>
      <div><b>findings:</b> {len(audit.findings)} total — HIGH {audit.counts['HIGH']} · MED {audit.counts['MEDIUM']} · LOW {audit.counts['LOW']} · INFO {audit.counts['INFO']}</div>
      <div><b>protocol:</b> static-only (CLAUDE.md §0) — no install, no run, no outbound URL followed</div>
    </div>
  </section>

  {warning_block}
  {verdict_body}
  {render_scorecard(audit.counts)}
  {render_findings_table(audit.findings)}

  <section class="block markdown">
    <div class="head">
      <div class="dot">md</div>
      <div><h2>Executive summary</h2><div class="sub">reports/SUMMARY.md — verbatim, re-rendered</div></div>
    </div>
    {body_md_html or '<p style="color:var(--muted)">No SUMMARY.md content was found.</p>'}
  </section>

  <footer>
    Generated by <a href="https://coldvault.dev" target="_blank" rel="noreferrer noopener">coldvault.dev</a> ·
    Static HTML, zero network, safe to archive · ZONOVA RESEARCH
  </footer>
</main>
<script>{COPY_JS}</script>
</body>
</html>
"""


# ───────────────────────────────── main ────────────────────────────────────


def main() -> int:
    warnings: list[str] = []
    summary_path = REPORTS_DIR / "SUMMARY.md"
    findings_path = REPORTS_DIR / "findings.json"

    if not summary_path.exists():
        print(f"[render-report] missing: {summary_path}", file=sys.stderr)
        print("[render-report] run the audit first (/audit)", file=sys.stderr)
        return 2

    summary_md = summary_path.read_text(encoding="utf-8")
    findings, meta, err = load_findings(findings_path)
    exit_code = 0
    if err:
        warnings.append(err + " — HTML rendered from SUMMARY.md only.")
        exit_code = 3

    target_name, target_commit = detect_target(summary_md)
    audit = Audit(
        target_commit=str(meta.get("target_commit", target_commit)),
        target_name=target_name,
        files_reviewed=meta.get("files_reviewed") if isinstance(meta.get("files_reviewed"), int) else None,
        findings=findings,
        summary_md=summary_md,
        verdict=detect_verdict(summary_md),
    )

    html_out = render_html(audit, warnings)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(html_out, encoding="utf-8")

    size_kb = OUT_PATH.stat().st_size / 1024
    print(f"[render-report] wrote {OUT_PATH} ({size_kb:.1f} KB)")
    print(f"[render-report] verdict={audit.verdict or '—'} findings={len(audit.findings)} "
          f"(HIGH {audit.counts['HIGH']} · MED {audit.counts['MEDIUM']} · LOW {audit.counts['LOW']})")
    return exit_code


if __name__ == "__main__":
    sys.exit(main())
