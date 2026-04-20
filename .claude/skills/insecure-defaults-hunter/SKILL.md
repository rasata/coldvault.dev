---
name: insecure-defaults-hunter
description: Find default/weak/insecure configurations — weak crypto, TLS disabled, permissive CORS, debug mode in prod paths, unsafe deserialization switches, open S3 buckets, etc. These are the low-hanging fruit most noisy scanners miss.
license: MIT (ZONOVA RESEARCH — coldvault.dev)
source_inspiration: trailofbits/skills/insecure-defaults
---

# insecure-defaults-hunter

## Pattern catalogue

### Crypto

- MD5, SHA1, DES, 3DES, RC4, ECB mode
- AES with static IV, AES-CBC without HMAC
- `Math.random()` / `random.random()` for security-critical values
- Hardcoded keys, IVs, salts

Grep seeds:
```bash
grep -rnEi "md5|sha-?1|DES|RC4|ECB|MD2|MD4" target --include='*.{js,ts,py,go,rs,java,php,rb,c,cpp}'
grep -rnE "Math\.random|random\.random\(|rand\(\)" target --include='*.{js,ts,py,c,cpp}'
```

### TLS / HTTPS

- `rejectUnauthorized: false` (Node)
- `verify=False` (requests), `ssl._create_unverified_context` (Python)
- `InsecureSkipVerify: true` (Go)
- Trust-all `X509TrustManager` (Java)
- Accepting self-signed certs in prod

```bash
grep -rnE "rejectUnauthorized\s*:\s*false" target
grep -rnE "verify\s*=\s*False" target --include='*.py'
grep -rnE "InsecureSkipVerify.*true" target --include='*.go'
```

### CORS / auth

- `Access-Control-Allow-Origin: *` + `Allow-Credentials: true`
- `cors({ origin: true })` in Express
- `@CrossOrigin` without args in Spring
- Disabled CSRF (`csrf: false`, `@EnableWebSecurity` without csrf)

### Web framework debug flags

- `DEBUG=True` in Django settings
- `app.debug = True` in Flask
- `NODE_ENV` check missing; `console.error(err.stack)` to the client
- Stack traces in 500 responses

### Deserialization / YAML

- `yaml.load` (Python, prefer `safe_load`)
- `pickle.loads` on untrusted input
- `unserialize` (PHP) on user input
- `ObjectInputStream` (Java) without class allow-list
- `JSON.parse(JSON.stringify(x))` used to "sanitize" — it doesn't

### Cloud / IaC

- S3 bucket with `PublicAccessBlock` missing or all false
- Security groups with `0.0.0.0/0` on 22/3389
- IAM policies with `*:*`
- Dockerfile `USER root`; `ADD` with remote URL; no `HEALTHCHECK`

Run scanners:
```bash
checkov -d target --framework all --output sarif -o reports/iac-checkov.sarif
tfsec target --format sarif > reports/iac-tfsec.sarif
terrascan scan -d target -o sarif > reports/iac-terrascan.sarif
hadolint target/Dockerfile --format sarif > reports/iac-hadolint.sarif 2>/dev/null || true
```

### Session / cookies

- `httpOnly: false`, `secure: false`, `sameSite: 'None'` without Secure
- JWT signed with `none` algorithm or with HS256 + hardcoded secret
- Session fixation: new auth doesn't rotate the session id

### Logging

- Passwords / tokens logged (`logger.info(req.body)`)
- PII in error messages sent to third-party tools

## Output

Each finding carries severity MEDIUM by default; upgrade to HIGH when the
insecure default is on an authentication/authorization path or directly yields
plaintext in flight.
