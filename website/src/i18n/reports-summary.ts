import type { Locale } from "./translations";

/**
 * Translations for /reports/example-summary.
 *
 * Strings may contain inline markers:
 *   `code` — wrapped in <code> at render time.
 *   **bold** — wrapped in <strong> at render time.
 *
 * Non-en locales that have not yet been localized fall back to the English
 * dict via spread. Add real translations progressively.
 */

export type ReportsSummaryDict = {
  // meta
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  // nav
  navHome: string;
  navScaDetail: string;
  // badges
  badgeExample: string;
  // header
  titleLead: string;
  titleAccent: string;
  headerP: string;
  labelTarget: string;
  labelScope: string;
  labelProtocol: string;
  labelTools: string;
  scopeValue: string;
  protocolValue: string;
  // verdict
  verdictLabel: string;
  verdictP1: string;
  verdictP2: string;
  // kill chain
  killChainLabel: string;
  killChainHeading: string;
  killChainSteps: { title: string; body: string }[];
  whatEachLabel: string;
  whatItems: string[];
  // counts
  countHighLabel: string;
  countHighHint: string;
  countMedLabel: string;
  countMedHint: string;
  countLowLabel: string;
  countLowHint: string;
  // sections
  s1Title: string;
  s1Sub: string;
  s2Title: string;
  s2Sub: string;
  s3Title: string;
  s3Sub: string;
  s4Title: string;
  s4Sub: string;
  s5Title: string;
  s5Sub: string;
  s6Title: string;
  s6Sub: string;
  s7Title: string;
  s7Sub: string;
  // finding table
  thCategory: string;
  thLocation: string;
  thImpact: string;
  // findings
  highFindings: { category: string; impact: string }[];
  medFindings: { category: string; impact: string }[];
  // exclusions
  exclusionsTitle: string;
  exclusionsItems: string[];
  signalOverNoise: string;
  // immediate actions
  beforeLabel: string;
  actionSteps: { title: string; body: string }[];
  thenRewriteLabel: string;
  rewriteItems: string[];
  // supply chain
  scP1: string;
  scP2: string;
  scCTA: string;
  scCTAButton: string;
  // prompt injection
  piP1: string;
  piP2: string;
  // artifacts
  artifactsNotes: string[];
  artifactsViewLink: string;
  // cta
  ctaTitle: string;
  ctaTitleAccent: string;
  ctaBody: string;
  ctaButtonSCA: string;
  ctaButtonCase: string;
  ctaButtonPlaybook: string;
  // footer
  footerPublishedBy: string;
  footerSuffix: string;
};

const en: ReportsSummaryDict = {
  metaTitle:
    "Example ColdVault report — Security Audit Summary (NO-GO verdict, 16 findings)",
  metaDescription:
    "Full SUMMARY.md produced by a ColdVault audit against a DeceptiveDevelopment-style Web3 repository: 11 HIGH + 5 MEDIUM findings, a five-finding kill chain from anonymous traffic to treasury drain, and a NO-GO verdict.",
  ogTitle: "Example ColdVault audit — SUMMARY.md",
  navHome: "Home",
  navScaDetail: "SCA detail",
  badgeExample: "Example report",
  titleLead: "ColdVault —",
  titleAccent: "Security Audit Summary",
  headerP:
    "The top-level `SUMMARY.md` ColdVault produces after a full `/audit` run — the one you hand to stakeholders. Verdict, chained kill chain, 16 findings, triage-ordered remediation.",
  labelTarget: "target:",
  labelScope: "scope:",
  labelProtocol: "protocol:",
  labelTools: "tools:",
  scopeValue:
    "full repository — frontend pro_lmng/ (React CRA) + backend backend/ (Express/Socket.IO)",
  protocolValue:
    "static-only (CLAUDE.md §0) — no install, no run, no outbound URL followed",
  verdictLabel: "Verdict",
  verdictP1:
    "This application must **not** be deployed in its current state, and the current production deployment (if any) should be treated as **already compromised**.",
  verdictP2:
    "Five findings are independently sufficient to cause total loss of customer funds. Together they chain into an end-to-end path from anonymous Internet traffic to draining the treasury wallet.",
  killChainLabel: "Kill chain",
  killChainHeading: "Anonymous traffic → treasury drain",
  killChainSteps: [
    {
      title: "Empty JWT secret",
      body: "`JWT_SECRET_KEY: ''`. Every token is forgeable by any caller.",
    },
    {
      title: "Unauthenticated admin routes",
      body: "Seven admin endpoints (`approvewithdrawrequest`, `rejectwithdrawrequest`, `getuserlist`, …) registered with no auth middleware.",
    },
    {
      title: "SQL injection in every legacy model",
      body: "39 template-literal SQL sites, reached from both unauthenticated and pseudo-authenticated routes.",
    },
    {
      title: "Unauthenticated deposit webhook",
      body: "`POST /api/v1/webhooks/bsc/deposit-confirmed` credits `users.MBUSD_balance` with an attacker-supplied amount. No signature, no IP allow-list, no idempotency.",
    },
    {
      title: "Treasury private key over plaintext HTTP",
      body: "`fetch('http://blockchainexpert.co.in:7003/api/bep20/mainnet/transfer', …)` POSTs the decrypted treasury private key in JSON on every withdrawal.",
    },
  ],
  whatEachLabel: "What each step buys an unauthenticated attacker",
  whatItems: [
    "Forge an admin JWT and call protected v1 endpoints.",
    "Bypass the need for auth entirely on the legacy admin surface.",
    "Dump the users table, mint balances, rewrite transactions.",
    "Mint arbitrary `MBUSD_balance` for any user with a single POST.",
    "Passively sniff the treasury private key from any on-path position — a one-shot, **irreversible** theft.",
  ],
  countHighLabel: "High",
  countHighHint: "Independently exploitable",
  countMedLabel: "Medium",
  countMedHint: "Exploitable under specific conditions",
  countLowLabel: "Low",
  countLowHint: "Excluded per CLAUDE.md §3",
  s1Title: "High-severity findings",
  s1Sub: "11 × HIGH — any one alone breaks the application",
  s2Title: "Medium-severity findings",
  s2Sub: "5 × MEDIUM — exploitable under specific conditions",
  s3Title: "What was NOT flagged",
  s3Sub: "Per CLAUDE.md §3 exclusions — noise control",
  s4Title: "Recommended immediate actions",
  s4Sub: "Triage order — do #1 now, not after the rewrite",
  s5Title: "Supply-chain attestation",
  s5Sub: "Declared-only — no lockfile committed",
  s6Title: "Prompt-injection resistance",
  s6Sub: "Static-only protocol upheld",
  s7Title: "Artifacts",
  s7Sub: "What ColdVault writes to reports/",
  thCategory: "Category",
  thLocation: "Location",
  thImpact: "Impact",
  highFindings: [
    { category: "Broken authentication", impact: "Total auth bypass via empty JWT_SECRET_KEY" },
    { category: "Broken access control", impact: "Seven admin endpoints reachable unauthenticated" },
    { category: "SQL injection", impact: "Arithmetic injection → mint token_balance" },
    { category: "SQL injection", impact: "Mass-approve withdrawals" },
    { category: "SQL injection (pervasive)", impact: "Dump users, mint balances, rewrite tx" },
    { category: "SQL injection", impact: "Socket.IO untrusted client → SQL" },
    { category: "Broken access control", impact: "Unauth mint of MBUSD_balance" },
    { category: "Sensitive data exposure", impact: "Treasury private key over plaintext HTTP" },
    { category: "Business-logic flaw", impact: "Reject-refund without prior debit → mint" },
    { category: "Secrets in source", impact: "Cleartext Mailtrap + Gmail creds in repo" },
    { category: "Sensitive data exposure", impact: "Unauth /test oracle + weak PBKDF2 format disclosure" },
  ],
  medFindings: [
    { category: "Path traversal", impact: "getImage exports path.resolve(cwd,'uploads',req.params.image) → arbitrary file read if wired" },
    { category: "Insecure default", impact: "Wildcard CORS" },
    { category: "Weak cryptography", impact: "PBKDF2 iterations=100 on treasury wrapper" },
    { category: "Secrets in source", impact: "Hardcoded MySQL host 13.233.12.75 (AWS ap-south-1)" },
    { category: "Vulnerable dependencies", impact: "request, xlsx, ethereumjs-util, WalletConnect v1" },
  ],
  exclusionsTitle: "Deliberately omitted",
  exclusionsItems: [
    "DoS / resource exhaustion (e.g. unguarded `JSON.parse` on socket messages at `app.js:103,139`).",
    "Rate-limiting gaps.",
    "Stylistic issues — e.g. the `typeof x !== undefined` bug at `routes.js:157,186` is a dead-code smell (the following `jwt.verify` still rejects), so no direct auth impact.",
    "Missing input validation without a proven exploit path.",
  ],
  signalOverNoise:
    "Signal over noise: ColdVault reports what's exploitable, not everything that's imperfect.",
  beforeLabel: "Before any other remediation work:",
  actionSteps: [
    {
      title: "Rotate the treasury wallet",
      body: "Assume the private key is **already stolen** (finding #8). Move remaining funds to a new wallet whose key has never been processed by this application.",
    },
    {
      title: "Revoke and rotate credentials",
      body: "Mailtrap SMTP + Gmail credentials in `backend/production.env` (finding #10). Enable 2FA on both.",
    },
    {
      title: "Take the backend offline",
      body: "Or block all `/api/*` except `/api/v1/healthz` at the load balancer until auth is fixed.",
    },
    {
      title: "Purge secrets from git history",
      body: "`git filter-repo --path backend/production.env --invert-paths`.",
    },
    {
      title: "Audit on-chain history",
      body: "Of the current treasury address for suspicious outbound transfers during the deployment window.",
    },
  ],
  thenRewriteLabel: "Then, the rewrite:",
  rewriteItems: [
    "Generate a ≥ 32-byte random `JWT_SECRET_KEY`, load it from a secrets manager, fail-closed on boot if missing or empty.",
    "Gate every admin route with `ensureWebTokenForAdmin`; move admin endpoints behind a dedicated `/api/admin/*` router that applies the middleware with `router.use`.",
    "Rewrite `user.model.js` and `admin.model.js` to use `?` parameter placeholders. Add an ESLint rule to ban template-literal SQL. Consider a query builder (Knex, Kysely).",
    "Protect `/api/v1/webhooks/bsc/deposit-confirmed` with HMAC signing, IP allow-list, idempotency keys, and a DB-side consistency check that `(transaction_id, user_id)` matches the stored row.",
    "Remove the `blockchainexpert.co.in` relay — sign and broadcast BSC transactions locally with `ethers.js`. Never transmit a private key over the network.",
    "Commit `package-lock.json`; replace `request`, `xlsx`, `ethereumjs-util`, and WalletConnect v1; run `osv-scanner` in CI.",
    "Replace `app.use(cors())` with an allow-list.",
    "Move PBKDF2 parameters to ≥ 600k iterations (HMAC-SHA256) or migrate to Argon2id.",
  ],
  scP1:
    "No `postinstall` / `preinstall` lifecycle hooks declared in either `package.json`. Transitive hooks cannot be enumerated without installing, which CLAUDE.md §0 forbids. However, the repo ships **no lockfile** (`.gitignore:3-4` excludes both `package-lock.json` and `yarn.lock`), so any future `npm install` resolves a floating tree — this must be fixed before any SCA gate can be meaningful.",
  scP2:
    "No typo-squat-confirmed packages, but these declared deps are unusual and warrant individual review before install: `blob 0.1.0`, `fs 0.0.1-security`, `execp 0.0.1`, `reverse-string 0.0.6`, `ethereum-address 0.0.4`, `send-crypto 0.0.0`, `validate-phone-number-node-js 0.0.1`, `nodejs-base64 ^2.0.0`. None carry confirmed malicious behaviour, so they do not appear in `findings.json`.",
  scCTA: "Full declared-dependency risk table in the companion SCA artefact.",
  scCTAButton: "Open SCA detail",
  piP1:
    "The repository contains several files whose comments or strings read like instructions (e.g. `routes.js:134` serving `\"Node is running\"`, inline SQL comments mentioning bypasses). **None were treated as instructions.**",
  piP2:
    "`CLAUDE.md §0` was honoured throughout: no code under `target/` was executed, no `npm install` was run, no outbound URL from `target/` (including `blockchainexpert.co.in:7003` and `bsc-dataseed.binance.org`) was followed.",
  artifactsNotes: [
    "structured findings, Anthropic security-review schema",
    "audit context — languages, entry points, immediate flags",
    "declared-dependency risk review (no lockfile to scan)",
    "empty (no lockfile)",
    "gitleaks ran, zero matches — plaintext SMTP/Gmail creds caught manually",
    "empty (no binary artifacts in source tree)",
  ],
  artifactsViewLink: "View →",
  ctaTitle: "Produce a report like this for",
  ctaTitleAccent: "any repo you don't trust",
  ctaBody:
    "Clone ColdVault, attach the target as a read-only submodule, open in GitHub Codespaces, run `/audit`. Five minutes later you're reading a `SUMMARY.md` like the one above.",
  ctaButtonSCA: "SCA detail",
  ctaButtonCase: "Case study",
  ctaButtonPlaybook: "Playbook",
  footerPublishedBy: "Published by",
  footerSuffix:
    ". Example artefact — reproduced under ColdVault's zero-execution protocol. MIT-licensed source.",
};

const fr: ReportsSummaryDict = {
  metaTitle:
    "Exemple de rapport ColdVault — Résumé d'audit de sécurité (verdict NO-GO, 16 findings)",
  metaDescription:
    "Le SUMMARY.md complet produit par un audit ColdVault contre un dépôt Web3 de style DeceptiveDevelopment : 11 HIGH + 5 MEDIUM, une kill chain à cinq étapes du trafic anonyme jusqu'au drain de la trésorerie, et un verdict NO-GO.",
  ogTitle: "Exemple d'audit ColdVault — SUMMARY.md",
  navHome: "Accueil",
  navScaDetail: "Détail SCA",
  badgeExample: "Rapport d'exemple",
  titleLead: "ColdVault —",
  titleAccent: "Résumé d'audit de sécurité",
  headerP:
    "Le `SUMMARY.md` de plus haut niveau que ColdVault produit après un `/audit` complet — celui que l'on remet aux décideurs. Verdict, kill chain enchaînée, 16 findings, remédiation triée par urgence.",
  labelTarget: "target :",
  labelScope: "périmètre :",
  labelProtocol: "protocole :",
  labelTools: "outils :",
  scopeValue:
    "dépôt complet — frontend pro_lmng/ (React CRA) + backend backend/ (Express/Socket.IO)",
  protocolValue:
    "100 % statique (CLAUDE.md §0) — aucune installation, aucune exécution, aucune URL sortante suivie",
  verdictLabel: "Verdict",
  verdictP1:
    "Cette application ne doit **pas** être déployée en l'état, et tout déploiement de production actuel doit être considéré comme **déjà compromis**.",
  verdictP2:
    "Cinq findings suffisent indépendamment à provoquer la perte totale des fonds clients. Ensemble elles forment un chemin de bout en bout qui va du trafic Internet anonyme au vidage du wallet de trésorerie.",
  killChainLabel: "Kill chain",
  killChainHeading: "Trafic anonyme → drain de la trésorerie",
  killChainSteps: [
    {
      title: "Secret JWT vide",
      body: "`JWT_SECRET_KEY: ''`. N'importe quel appelant peut forger un jeton.",
    },
    {
      title: "Routes admin non authentifiées",
      body: "Sept endpoints admin (`approvewithdrawrequest`, `rejectwithdrawrequest`, `getuserlist`, …) enregistrés sans aucun middleware d'authentification.",
    },
    {
      title: "Injection SQL dans tous les modèles historiques",
      body: "39 sites SQL en template-literal, atteints depuis des routes non authentifiées et pseudo-authentifiées.",
    },
    {
      title: "Webhook de dépôt non authentifié",
      body: "`POST /api/v1/webhooks/bsc/deposit-confirmed` crédite `users.MBUSD_balance` avec un montant fourni par l'attaquant. Aucune signature, aucune allow-list d'IP, aucune idempotence.",
    },
    {
      title: "Clé privée de trésorerie en clair sur HTTP",
      body: "`fetch('http://blockchainexpert.co.in:7003/api/bep20/mainnet/transfer', …)` envoie en POST la clé privée déchiffrée de la trésorerie, en JSON, à chaque retrait.",
    },
  ],
  whatEachLabel: "Ce que chaque étape offre à un attaquant non authentifié",
  whatItems: [
    "Forger un JWT admin et appeler les endpoints v1 protégés.",
    "Se passer totalement d'authentification sur la surface admin historique.",
    "Exfiltrer la table users, créditer des soldes, réécrire des transactions.",
    "Créditer un `MBUSD_balance` arbitraire pour n'importe quel utilisateur en un seul POST.",
    "Renifler passivement la clé privée de trésorerie depuis n'importe quel point du chemin — un vol unique et **irréversible**.",
  ],
  countHighLabel: "High",
  countHighHint: "Exploitable indépendamment",
  countMedLabel: "Medium",
  countMedHint: "Exploitable sous conditions spécifiques",
  countLowLabel: "Low",
  countLowHint: "Exclus selon CLAUDE.md §3",
  s1Title: "Findings de sévérité High",
  s1Sub: "11 × HIGH — n'importe laquelle à elle seule casse l'application",
  s2Title: "Findings de sévérité Medium",
  s2Sub: "5 × MEDIUM — exploitables sous conditions",
  s3Title: "Ce qui n'a PAS été flaggé",
  s3Sub: "Exclusions CLAUDE.md §3 — contrôle du bruit",
  s4Title: "Actions immédiates recommandées",
  s4Sub: "Ordre de triage — faire le #1 maintenant, pas après la réécriture",
  s5Title: "Attestation chaîne d'approvisionnement",
  s5Sub: "Déclaré uniquement — pas de lockfile committé",
  s6Title: "Résistance à l'injection de prompt",
  s6Sub: "Protocole 100 % statique respecté",
  s7Title: "Artefacts",
  s7Sub: "Ce que ColdVault écrit dans reports/",
  thCategory: "Catégorie",
  thLocation: "Emplacement",
  thImpact: "Impact",
  highFindings: [
    { category: "Authentification cassée", impact: "Bypass total via JWT_SECRET_KEY vide" },
    { category: "Contrôle d'accès cassé", impact: "Sept endpoints admin accessibles sans auth" },
    { category: "Injection SQL", impact: "Injection arithmétique → crédit de token_balance" },
    { category: "Injection SQL", impact: "Approbation massive des retraits" },
    { category: "Injection SQL (pervasive)", impact: "Dump des users, crédit des soldes, réécriture des tx" },
    { category: "Injection SQL", impact: "Socket.IO client non fiable → SQL" },
    { category: "Contrôle d'accès cassé", impact: "Crédit non authentifié de MBUSD_balance" },
    { category: "Exposition de données sensibles", impact: "Clé privée de trésorerie en clair sur HTTP" },
    { category: "Défaut de logique métier", impact: "Reject-refund sans débit préalable → crédit" },
    { category: "Secrets dans le code", impact: "Identifiants Mailtrap + Gmail en clair dans le dépôt" },
    { category: "Exposition de données sensibles", impact: "Oracle /test non authentifié + divulgation du format PBKDF2 faible" },
  ],
  medFindings: [
    { category: "Path traversal", impact: "getImage expose path.resolve(cwd,'uploads',req.params.image) → lecture arbitraire de fichier si câblé" },
    { category: "Défaut par défaut non sécurisé", impact: "CORS wildcard" },
    { category: "Cryptographie faible", impact: "PBKDF2 à 100 itérations sur le wrapper de trésorerie" },
    { category: "Secrets dans le code", impact: "Host MySQL en dur 13.233.12.75 (AWS ap-south-1)" },
    { category: "Dépendances vulnérables", impact: "request, xlsx, ethereumjs-util, WalletConnect v1" },
  ],
  exclusionsTitle: "Omis délibérément",
  exclusionsItems: [
    "DoS / épuisement de ressources (par ex. `JSON.parse` non gardé sur les messages socket à `app.js:103,139`).",
    "Lacunes de rate-limiting.",
    "Problèmes stylistiques — par ex. le bug `typeof x !== undefined` à `routes.js:157,186` est un smell de code mort (le `jwt.verify` suivant rejette quand même), donc aucun impact direct sur l'auth.",
    "Validation d'entrée manquante sans chemin d'exploitation démontré.",
  ],
  signalOverNoise:
    "Signal contre bruit : ColdVault signale ce qui est exploitable, pas tout ce qui est imparfait.",
  beforeLabel: "Avant tout autre travail de remédiation :",
  actionSteps: [
    {
      title: "Faire tourner le wallet de trésorerie",
      body: "Considérer la clé privée comme **déjà volée** (finding #8). Déplacer les fonds restants vers un nouveau wallet dont la clé n'a jamais transité par cette application.",
    },
    {
      title: "Révoquer et faire tourner les identifiants",
      body: "Identifiants Mailtrap SMTP + Gmail dans `backend/production.env` (finding #10). Activer la 2FA sur les deux.",
    },
    {
      title: "Mettre le backend hors ligne",
      body: "Ou bloquer tout `/api/*` sauf `/api/v1/healthz` au load balancer, jusqu'à ce que l'auth soit corrigée.",
    },
    {
      title: "Purger les secrets de l'historique git",
      body: "`git filter-repo --path backend/production.env --invert-paths`.",
    },
    {
      title: "Auditer l'historique on-chain",
      body: "De l'adresse de trésorerie actuelle, à la recherche de transferts sortants suspects pendant la fenêtre de déploiement.",
    },
  ],
  thenRewriteLabel: "Ensuite, la réécriture :",
  rewriteItems: [
    "Générer un `JWT_SECRET_KEY` aléatoire ≥ 32 octets, le charger depuis un secrets manager, fail-closed au boot s'il manque ou est vide.",
    "Protéger chaque route admin avec `ensureWebTokenForAdmin` ; déplacer les endpoints admin derrière un routeur `/api/admin/*` dédié qui applique le middleware via `router.use`.",
    "Réécrire `user.model.js` et `admin.model.js` avec des placeholders `?`. Ajouter une règle ESLint interdisant le SQL en template-literal. Envisager un query builder (Knex, Kysely).",
    "Protéger `/api/v1/webhooks/bsc/deposit-confirmed` avec signature HMAC, allow-list d'IP, clés d'idempotence, et contrôle de cohérence côté DB que `(transaction_id, user_id)` correspond à la ligne stockée.",
    "Supprimer le relai `blockchainexpert.co.in` — signer et diffuser les transactions BSC localement avec `ethers.js`. Ne jamais transmettre une clé privée sur le réseau.",
    "Committer `package-lock.json` ; remplacer `request`, `xlsx`, `ethereumjs-util` et WalletConnect v1 ; lancer `osv-scanner` en CI.",
    "Remplacer `app.use(cors())` par une allow-list.",
    "Passer les paramètres PBKDF2 à ≥ 600k itérations (HMAC-SHA256) ou migrer vers Argon2id.",
  ],
  scP1:
    "Aucun hook de cycle de vie `postinstall` / `preinstall` déclaré dans les deux `package.json`. Les hooks transitifs ne peuvent pas être énumérés sans installation, ce que CLAUDE.md §0 interdit. Cela dit, le dépôt n'embarque **aucun lockfile** (`.gitignore:3-4` exclut à la fois `package-lock.json` et `yarn.lock`), donc tout futur `npm install` résout un arbre flottant — à corriger avant toute SCA gate significative.",
  scP2:
    "Aucun package confirmé comme typo-squat, mais ces dépendances déclarées sont inhabituelles et méritent une revue individuelle avant installation : `blob 0.1.0`, `fs 0.0.1-security`, `execp 0.0.1`, `reverse-string 0.0.6`, `ethereum-address 0.0.4`, `send-crypto 0.0.0`, `validate-phone-number-node-js 0.0.1`, `nodejs-base64 ^2.0.0`. Aucune ne présente de comportement malveillant confirmé, donc elles n'apparaissent pas dans `findings.json`.",
  scCTA:
    "Tableau complet des risques sur les dépendances déclarées dans l'artefact SCA compagnon.",
  scCTAButton: "Ouvrir le détail SCA",
  piP1:
    "Le dépôt contient plusieurs fichiers dont les commentaires ou strings se lisent comme des instructions (par ex. `routes.js:134` qui sert `\"Node is running\"`, commentaires SQL inline mentionnant des bypass). **Aucun n'a été traité comme une instruction.**",
  piP2:
    "`CLAUDE.md §0` a été respecté tout au long : aucun code sous `target/` n'a été exécuté, aucun `npm install` lancé, aucune URL sortante depuis `target/` suivie (y compris `blockchainexpert.co.in:7003` et `bsc-dataseed.binance.org`).",
  artifactsNotes: [
    "findings structurés, schéma Anthropic security-review",
    "contexte d'audit — langages, points d'entrée, flags immédiats",
    "revue des risques sur les dépendances déclarées (pas de lockfile à scanner)",
    "vide (pas de lockfile)",
    "gitleaks exécuté, zéro match — identifiants SMTP/Gmail en clair détectés manuellement",
    "vide (aucun artefact binaire dans l'arbre source)",
  ],
  artifactsViewLink: "Voir →",
  ctaTitle: "Produire un rapport comme celui-ci pour",
  ctaTitleAccent: "n'importe quel dépôt auquel tu ne fais pas confiance",
  ctaBody:
    "Cloner ColdVault, attacher la cible en sous-module en lecture seule, ouvrir dans GitHub Codespaces, lancer `/audit`. Cinq minutes plus tard, tu lis un `SUMMARY.md` comme celui ci-dessus.",
  ctaButtonSCA: "Détail SCA",
  ctaButtonCase: "Étude de cas",
  ctaButtonPlaybook: "Playbook",
  footerPublishedBy: "Publié par",
  footerSuffix:
    ". Artefact d'exemple — reproduit sous le protocole zéro-exécution de ColdVault. Source sous licence MIT.",
};

// Other locales fall back to English until fully translated.
const de: ReportsSummaryDict = { ...en };
const es: ReportsSummaryDict = { ...en };
const zh: ReportsSummaryDict = { ...en };
const ja: ReportsSummaryDict = { ...en };
const ko: ReportsSummaryDict = { ...en };
const ar: ReportsSummaryDict = { ...en };

export const reportsSummaryTranslations: Record<Locale, ReportsSummaryDict> = {
  en,
  fr,
  de,
  es,
  zh,
  ja,
  ko,
  ar,
};
