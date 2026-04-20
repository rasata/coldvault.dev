---
name: variant-analysis
description: Given a confirmed finding, search the whole target/ for semantically similar bugs. Applies the trailofbits variant-analysis approach — one root cause usually breeds siblings.
license: MIT (ZONOVA RESEARCH — coldvault.dev)
source_inspiration: trailofbits/skills/variant-analysis
---

# variant-analysis

## Why

Most real audits discover a bug once and miss its five siblings. Variant
analysis closes that gap systematically.

## Procedure

For each HIGH/MEDIUM finding:

1. **Extract the smallest characterising pattern.** Not the specific code, the
   *shape*. Example — finding: `child_process.exec(req.body.cmd)`. Shape:
   "user-controlled input flows into an exec-family call without escaping."
2. **Codify the shape as a Semgrep rule** (see `semgrep-rule-creator`).
3. **Run repo-wide.** Log the new hits in `reports/variants/<finding-id>.sarif`.
4. **For each hit, determine:**
   - Same root cause (e.g. shared helper) → collapse into a single finding
     with a list of call-sites.
   - Independent occurrence → create a new finding with reduced confidence
     (cap 0.85) unless you verified the taint path.
5. **Broaden the search.** If the language uses a different idiom for the same
   operation (Python `subprocess.run(..., shell=True)` vs. `os.system` vs.
   `commands.getoutput`), add each to the rule and re-run.

## Example — expanding a single finding

Initial finding:
```python
# target/app/handlers.py:42
subprocess.call(request.form['cmd'], shell=True)  # CMD-INJECTION
```

Shape:
- source: `request.form[*]`, `request.args[*]`, `request.json[*]`
- sink: `subprocess.(call|run|Popen|check_output)` with `shell=True` OR
        `os.system(*)` OR `os.popen(*)` OR `commands.getoutput(*)`

Run the taint rule. Possible variants found:
- `handlers.py:88` — same pattern via `os.system`
- `admin/utils.py:14` — helper `run_cmd(s)` called from 7 sites with user-supplied `s`
- `worker.py:120` — same pattern but sanitised by `shlex.quote` — **not a bug**

## Output

Append to `reports/findings.json`:
- a `variants` array inside the parent finding listing all call sites, OR
- separate findings with `metadata.parent_id` pointing to the original.

Ensure `reports/SUMMARY.md` links every HIGH finding to its variant list.
