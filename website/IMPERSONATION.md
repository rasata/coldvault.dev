# Anti-impersonation & authenticity

> The Coldvault website source is public (MIT). Nothing prevents a fork from
> being deployed verbatim. These are the controls that make such a fork easy
> to spot and hard to monetise.

## 1. The only canonical origin

The single authoritative address is:

```
https://coldvault.dev
```

Anything else — GitHub Pages default URL (`rasata.github.io/coldvault.dev`),
IPFS gateways, Vercel previews, another custom domain — is **not** the
official site. The `ImpersonationBanner` component enforces this at runtime.

## 2. Controls shipped in this repo

| Control | File | What it does |
|---|---|---|
| Custom-domain lock | `website/public/CNAME` | Pages only serves `coldvault.dev` from the repo that verified the domain. |
| Runtime banner | `src/components/impersonation-banner.tsx` | Shows a red "unofficial copy" banner when `location.hostname` isn't `coldvault.dev`. |
| Canonical link | `index.html` | `<link rel="canonical" href="https://coldvault.dev/">` — search engines attribute value to the official origin. |
| Conditional `noindex` | `index.html` + banner | Non-canonical hosts inject `<meta name="robots" content="noindex,nofollow,noarchive">`. |
| Build provenance | `.github/workflows/deploy-pages.yml` | Every official deploy writes `dist/build-provenance.json` with commit SHA, repo, run ID. |
| Build fingerprint in bundle | `vite.config.ts` | `VITE_BUILD_COMMIT` / `VITE_BUILD_REPO` baked into the JS at CI build time. |

## 3. One-time operator setup on GitHub

Required to make the custom domain tamper-resistant:

1. **Verify `coldvault.dev` at the organisation / account level.**
   - GitHub → Settings → Pages → *Add a verified domain*
   - Add the provided `_github-pages-challenge-<user>` TXT record to DNS.
   - Once verified, **no other GitHub Pages site can claim `coldvault.dev`** —
     even if someone forks this repo and sets the same CNAME, GitHub will
     reject it.
2. **Enforce HTTPS** in Settings → Pages (checkbox).
3. **DNS at the registrar**: `A`/`ALIAS` pointing to GitHub Pages IPs, plus
   `AAAA` for IPv6. For apex `coldvault.dev`:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
4. **CAA record** — restrict who can issue a TLS certificate for the domain:
   ```
   coldvault.dev. CAA 0 issue "letsencrypt.org"
   ```
5. Optional but recommended: **publish a `.well-known/security.txt`** under
   `website/public/.well-known/security.txt` with a PGP-signed contact.

## 4. What this does *not* protect against

- **Look-alike domains** (`co1dvault.dev`, `coldvault.com`) — monitor via a
  service like URLScan, CertSpotter, or register the obvious squats yourself.
- **Screenshot + phishing page** — out of scope of the SPA.
- **MITM on first visit** — rely on HSTS preload (submit `coldvault.dev` to
  <https://hstspreload.org/> once the site is live).

## 5. If you spot an impersonation

Open an issue in this repo with the URL and a screenshot, or email the
address listed in `security.txt`. Do not interact with credentials or
downloads on the suspect site.
