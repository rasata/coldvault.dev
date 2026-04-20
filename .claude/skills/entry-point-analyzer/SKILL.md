---
name: entry-point-analyzer
description: Map the attack surface of target/ — HTTP routes, CLI commands, exported library symbols, message-queue consumers, GitHub Actions triggers, IPC sockets. Produces reports/entry-points.md.
license: MIT (ZONOVA RESEARCH — coldvault.dev)
source_inspiration: trailofbits/skills/entry-point-analyzer
---

# entry-point-analyzer

## HTTP servers

Grep for known route-registration patterns:

```bash
# Express / Fastify / Koa / Hono
grep -rnE "(app|router|fastify|koa|hono)\.(get|post|put|patch|delete|all|use)\(" target --include='*.{js,ts}'

# Flask / FastAPI
grep -rnE "@(app|router|bp)\.(get|post|put|delete|route)" target --include='*.py'

# Django urls.py
find target -name urls.py -exec grep -Hn "path\|url\|re_path" {} \;

# Spring
grep -rnE "@(Request|Get|Post|Put|Delete)Mapping" target --include='*.java'

# Go net/http / gin / chi / echo
grep -rnE "\.(GET|POST|PUT|DELETE|Handle|HandleFunc)\(" target --include='*.go'

# Rails routes.rb
find target -name routes.rb -exec cat {} \;
```

For each route, record: method, path, handler function, auth middleware.

## CLI / binaries

```bash
# package.json bin entries
jq -r '.bin // {} | to_entries[] | "\(.key) → \(.value)"' target/package.json 2>/dev/null

# pyproject.toml entry points
grep -A 20 '\[project.scripts\]' target/pyproject.toml 2>/dev/null

# Go main packages
grep -rln "^package main" target --include='*.go'

# Rust bin targets
grep -A 2 '\[\[bin\]\]' target/Cargo.toml 2>/dev/null
```

## Exported library surface

```bash
# Node ESM exports
jq '.exports' target/package.json 2>/dev/null

# Python __all__
grep -rn "__all__" target --include='*.py'

# Rust pub items in lib.rs
grep -rnE "^pub (fn|struct|enum|trait|mod)" target --include='lib.rs'
```

## CI / agentic entry points

- `.github/workflows/**` — list every `on:` trigger; call out `pull_request_target`,
  `workflow_run`, `schedule`, `issue_comment`.
- `.gitlab-ci.yml`, `.circleci/config.yml`, `azure-pipelines.yml`.
- Dependabot / Renovate configs (these run under your token!).

## Message brokers / queues

- Kafka topic consumers: `@KafkaListener`, `kafka.consumer.subscribe`
- RabbitMQ: `channel.consume`, `@RabbitListener`
- AWS SQS: `sqs.receiveMessage` / Lambda event sources
- Redis pub/sub: `subscribe`, `psubscribe`

## Output

Produce `reports/entry-points.md` with one section per category and, for each
entry point, a confidence-weighted risk tag:

| Entry point                         | Auth  | Input sources        | Risk   |
|-------------------------------------|-------|----------------------|--------|
| `POST /api/exec`                    | none  | JSON body `cmd`      | HIGH   |
| `GET /health`                       | none  | —                    | LOW    |
| GHA `.github/workflows/pr.yml` `pull_request_target` | N/A | fork PR body | HIGH |

Cross-reference with SAST findings: a route with no auth + a HIGH SAST
finding on its handler is a P0.
