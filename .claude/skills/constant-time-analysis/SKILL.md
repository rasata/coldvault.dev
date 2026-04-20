---
name: constant-time-analysis
description: Inspect cryptographic code for timing leaks. Flags variable-time comparisons on secrets, early-exit loops, and library calls known to be variable-time. Limited static scope — the definitive check is micro-benchmarks on compiled binaries, but ~70% of timing bugs show up in source review.
license: MIT (ZONOVA RESEARCH — coldvault.dev)
source_inspiration: trailofbits/skills/constant-time-analysis
---

# constant-time-analysis

## Target operations

- HMAC / MAC verification
- Password / token comparison
- Key-derivation length checks
- Signature verification
- Session ID comparison
- Coupon / voucher validation

## Bad patterns (grep seeds)

```bash
# Direct equality on secret-bearing variables
grep -rnE "(password|pwd|token|secret|hmac|signature|sig|mac|key|nonce)\s*(==|!=|===|!==)" \
    target --include='*.{js,ts,py,go,rs,java,c,cpp,php,rb}'

# String.equals / strcmp on secrets
grep -rnE "(strcmp|memcmp|String\.equals|\.equals\()" target

# Python early-exit loops on bytes (classic timing leak)
grep -rnPzo "for .*:\s*\n\s*if .*\s==\s.*:\s*\n\s*return False" target --include='*.py'
```

## Good patterns (acceptable)

- Python: `hmac.compare_digest(a, b)`
- Node: `crypto.timingSafeEqual(a, b)`
- Go: `subtle.ConstantTimeCompare`
- Java: `MessageDigest.isEqual`
- .NET: `CryptographicOperations.FixedTimeEquals`
- Rust: `subtle::ConstantTimeEq`

## Report template

```json
{
  "file": "target/src/session.ts",
  "line": 88,
  "severity": "MEDIUM",
  "category": "timing_side_channel",
  "description": "Session token compared with === — variable-time, leaks prefix length",
  "exploit_scenario": "Local attacker (or attacker on the same TCP path) can distinguish matching prefixes by measuring request-processing time. Combined with a reuse oracle, token can be reconstructed byte-by-byte in < 2^16 requests.",
  "recommendation": "Replace with crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b)).",
  "confidence": 0.85,
  "source_tool": "manual+semgrep"
}
```

## Caveats

- JITed languages (JS, JVM, CLR) have runtime-level timing variance that can
  mask some leaks — but source-level patterns are still worth fixing.
- Side channels beyond timing (power, cache, branch prediction) are out of
  scope for this static pass — flag suspect code for downstream review.
