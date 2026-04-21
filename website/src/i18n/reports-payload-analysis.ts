import type { Locale } from "./translations";

export type ReportsPayloadAnalysisDict = {
  // page meta
  pageTitle: string;
  pageDescription: string;
  ogTitle: string;

  // nav
  navSummary: string;
  navCommands: string;

  // alert banner
  alertLabel: string;
  alertBodyPre: string;
  alertBodyMid: string;
  alertBodyPost: string;

  // do-not-run banner
  doNotRunTitle: string;
  doNotRunBodyPre: string;
  doNotRunBodyPost: string;
  doNotRunFootPre: string;
  doNotRunFootMid1: string;
  doNotRunFootMid2: string;
  doNotRunFootPost: string;
  doNotRunLastCommand: string;

  // report header
  badgeExample: string;
  badgeHostile: string;
  tagForensic: string;
  tagBeavertail: string;
  tagDeceptive: string;
  titleLead: string;
  titleAccent: string;
  headerIntroPre: string;
  headerIntroMid1: string;
  headerIntroMid2: string;
  headerIntroMid3: string;
  headerIntroPost: string;
  headerIntroStrong: string;
  metaTarget: string;
  metaTargetValue: string;
  metaScope: string;
  metaScopeValue1: string;
  metaScopeValue2: string;
  metaProtocol: string;
  metaProtocolValue: string;
  metaTools: string;
  metaToolsValue: string;

  // sanitization notice
  sanitizationLabel: string;
  sanitizationPre: string;
  sanitizationStrong: string;
  sanitizationMid1: string;
  sanitizationMid2: string;
  sanitizationPost: string;

  // sections
  section1Title: string;
  section1Subtitle: string;
  section2Title: string;
  section2Subtitle: string;
  section3Title: string;
  section3Subtitle: string;
  section4Title: string;
  section4Subtitle: string;
  section5Title: string;
  section5Subtitle: string;
  section6Title: string;
  section6Subtitle: string;
  section7Title: string;
  section7Subtitle: string;
  section8Title: string;
  section8Subtitle: string;

  // exec summary
  execSummaryPre1: string;
  execSummaryStrong1: string;
  execSummaryPre2: string;
  execSummaryStrong2: string;
  execSummaryMid1: string;
  execSummaryLineLabel: string;
  execSummaryMid2: string;
  execSummaryMid3: string;
  execSummaryMid4: string;
  execSummaryStrong3: string;
  execSummaryPost: string;
  execConfidenceBadge: string;
  execAttributionBadge: string;

  // payload location
  payloadKeyCarrier: string;
  payloadKeyLine: string;
  payloadKeyBlob: string;
  payloadKeyVisibility: string;
  payloadKeyTechnique: string;
  payloadValCarrier: string;
  payloadValLine: string;
  payloadValBlob: string;
  payloadValVisibility: string;
  payloadValTechnique: string;

  // capabilities
  capHttpTitle: string;
  capHttpBodyPre: string;
  capHttpBodyPost: string;
  capHostTitle: string;
  capHostBody: string;
  capMagicTitle: string;
  capMagicBodyPre: string;
  capMagicBodyPost: string;
  capStage2Title: string;
  capStage2BodyPre: string;
  capStage2BodyMid: string;
  capStage2BodyPost: string;
  capInstallTitle: string;
  capInstallBodyPre: string;
  capInstallBodyMid: string;
  capInstallBodyPost: string;
  capLaunchTitle: string;
  capLaunchBodyPre: string;
  capLaunchBodyMid: string;
  capLaunchBodyPost: string;
  capStage2PayloadTitle: string;
  capStage2PayloadBody: string;

  // attribution
  attrPrimaryLabel: string;
  attrPrimaryBodyPre: string;
  attrPrimaryBodyStrong: string;
  attrPrimaryBodyMid1: string;
  attrPrimaryBodyCampaignEm: string;
  attrPrimaryBodyMid2: string;
  attrPrimaryBodyPersonaEm: string;
  attrPrimaryBodyMid3: string;
  attrPrimaryBodyActorEm: string;
  attrPrimaryBodyPost: string;
  attrSignaturesLabel: string;
  attrSignatures: string[];
  attrLureLabel: string;
  attrLureBodyPre: string;
  attrLureBodyPost1: string;
  attrLureBodyPost2: string;
  attrLureBodyQuote: string;
  attrLureBodyPost3: string;
  attrLureBodySessionEm: string;
  attrLureBodyPost4: string;
  attrAltLabel: string;
  attrAltBody: string;

  // IoC table
  iocColType: string;
  iocColValue: string;
  iocNoteRedacted1: string;
  iocNoteRedacted2: string;
  iocKeyC2Primary: string;
  iocKeyC2Secondary: string;
  iocKeyBeaconGet: string;
  iocKeyStage2Get: string;
  iocKeyAuxGet: string;
  iocKeyMagicBytes: string;
  iocKeyXorKey: string;
  iocKeyHashGuard: string;
  iocKeyDropFolder: string;
  iocKeyDroppedFiles: string;
  iocKeyShellCmds: string;
  iocKeyCampaignId: string;
  iocKeyBeaconInterval: string;
  iocKeyFamily: string;
  iocBeaconIntervalValueSuffix: string;
  iocMagicBytesValue: string;
  iocFamilyValue: string;
  iocFootnotePre: string;
  iocFootnoteMid: string;
  iocFootnotePost: string;

  // immediate actions
  quarantineLabel: string;
  quarantineLine1Pre: string;
  quarantineLine1Strong: string;
  quarantineLine1Post: string;
  quarantineLine2Pre: string;
  quarantineLine2Mid: string;
  quarantineLine2Post: string;
  quarantineSteps: string[];

  secretsLabel: string;
  secretsBodyPre: string;
  secretsBodyMid1: string;
  secretsBodyPost: string;
  secretsBodyStrong: string;
  secretsSmtpStrong: string;
  secretsSmtpUserLabelPre: string;
  secretsSmtpMid: string;
  secretsSmtpPost: string;
  secretsGmailStrong: string;
  secretsGmailPre: string;
  secretsGmailPost: string;
  secretsFoot: string;

  huntingLabel: string;
  huntingLine1Pre: string;
  huntingLine1Mid: string;
  huntingLine1Post: string;
  huntingLine2: string;
  huntingLine3: string;

  // closure
  closureItems: string[];

  // references
  refInternalTitle: string;
  refInternalNotes: string[];
  refExternalTitle: string;
  refExternalItems: string[];

  // CTA
  ctaTitle: string;
  ctaBodyPre: string;
  ctaBodyMid1: string;
  ctaBodyMid2: string;
  ctaBodyPost: string;
  ctaGithub: string;
  ctaCommands: string;
  ctaSummary: string;
  ctaPlaybook: string;

  // footer
  footerPre: string;
  footerPost: string;
};

const en: ReportsPayloadAnalysisDict = {
  pageTitle:
    "Example ColdVault report — Defensive payload analysis (BeaverTail-style loader, ≥0.97 confidence)",
  pageDescription:
    "Sanitized forensic output of the defensive-payload-analysis skill on a DeceptiveDevelopment-style lure repository: a BeaverTail Stage-1 loader hidden at the tail of tailwind.config.js, IoCs, attribution, and immediate-action checklist.",
  ogTitle: "Example ColdVault report — Defensive payload analysis",

  navSummary: "Summary",
  navCommands: "Commands",

  alertLabel: "🚨 Malware alert",
  alertBodyPre: "A BeaverTail-style Stage-1 loader is hidden at the tail of ",
  alertBodyMid: "",
  alertBodyPost:
    ". Static reconstruction only — no network calls were made toward the embedded C2 from this audit environment.",

  doNotRunTitle: "Do not run · do not install · do not open in an IDE",
  doNotRunBodyPre: "None of the following may be executed against ",
  doNotRunBodyPost: ":",
  doNotRunFootPre: "Letting ",
  doNotRunFootMid1: " or ",
  doNotRunFootMid2: " resolve ",
  doNotRunFootPost: " is enough to trigger the payload.",
  doNotRunLastCommand: "any command that loads tailwind.config.js",

  badgeExample: "Example report",
  badgeHostile: "HOSTILE · ≥0.97",
  tagForensic: "#forensic",
  tagBeavertail: "#beavertail",
  tagDeceptive: "#deceptive-development",
  titleLead: "ColdVault — ",
  titleAccent: "Defensive payload analysis",
  headerIntroPre: "The ",
  headerIntroMid1: " that the ",
  headerIntroMid2: " skill produces after a read-only pass — the file you hand to IR, HR, and the blue team. Template based on a real ",
  headerIntroMid3: " lure; ",
  headerIntroPost: "",
  headerIntroStrong: "all live IoCs redacted.",
  metaTarget: "target:",
  metaTargetValue:
    "target/suspect-repo @ [REDACTED-SHA] — sanitized for public display",
  metaScope: "scope:",
  metaScopeValue1: "build configs, lifecycle scripts, single-line >2000-char files, base64 blobs fed to ",
  metaScopeValue2: "/",
  metaProtocol: "protocol:",
  metaProtocolValue:
    "static-only (CLAUDE.md §0) — no install, no run, no outbound URL followed",
  metaTools: "tools:",
  metaToolsValue:
    "Read · Glob · Grep · statically reconstructed deobfuscation (XOR + base64 + permutation)",

  sanitizationLabel: "Public-display sanitization",
  sanitizationPre: "This page is an ",
  sanitizationStrong: "example of the output shape",
  sanitizationMid1:
    ", not an IoC feed. Real C2 addresses, campaign IDs, XOR keys, hash guards, magic bytes, victim credentials, and lure-specific persona strings have been replaced with ",
  sanitizationMid2: " or RFC 5737 documentation addresses (",
  sanitizationPost:
    "). Family names and public threat-intel references are kept verbatim — they are already documented by Unit42, Microsoft Threat Intelligence, and Mandiant.",

  section1Title: "Executive summary",
  section1Subtitle: "Three lines — what happened, where, and how sure",
  section2Title: "Payload location",
  section2Subtitle: "Where in the tree the loader hides",
  section3Title: "Observed capabilities",
  section3Subtitle: "What the reconstructed Stage-1 does at runtime",
  section4Title: "Attribution",
  section4Subtitle: "Primary ≥ 0.97 · 9 converging signatures",
  section5Title: "Consolidated IoCs",
  section5Subtitle: "Documentation-only values — real IoCs are redacted",
  section6Title: "Immediate actions",
  section6Subtitle: "Quarantine · rotate secrets · hunt",
  section7Title: "Closure checklist",
  section7Subtitle: "Proof the audit respected the zero-execution rule",
  section8Title: "References",
  section8Subtitle: "Phase files & external threat-intel",

  execSummaryPre1: "The ",
  execSummaryStrong1: " submodule is a ",
  execSummaryPre2: "DPRK hiring lure (Contagious Interview)",
  execSummaryStrong2: " containing a ",
  execSummaryMid1: "BeaverTail Stage-1 loader",
  execSummaryLineLabel: " of ~11 500 chars appended to the tail of ",
  execSummaryMid2: " at line ",
  execSummaryMid3: ", after ~500 padding spaces. The loader beacons HTTP to ",
  execSummaryMid4: " (fallback ",
  execSummaryStrong3: "InvisibleFerret",
  execSummaryPost:
    ", Python RAT: crypto wallet theft, Keychain / Credential Manager, SSH, cookies), and launches it detached via ",
  execConfidenceBadge: "Confidence ≥ 0.97",
  execAttributionBadge: "Attribution: UNC4899 / Famous Chollima (Lazarus umbrella)",

  payloadKeyCarrier: "Carrier file",
  payloadKeyLine: "Line",
  payloadKeyBlob: "Blob size",
  payloadKeyVisibility: "Visibility",
  payloadKeyTechnique: "Technique",
  payloadValCarrier: "target/suspect-repo/tailwind.config.js",
  payloadValLine: "890",
  payloadValBlob: "~11 500 characters (after ~500 padding spaces)",
  payloadValVisibility:
    "Invisible without word-wrap. Lines 1–57 are a real Tailwind module.exports; lines 58–889 are empty.",
  payloadValTechnique:
    "obfuscator.io-style JS: 123-entry base64 string table with circular rotation verified by a hash guard, 4-byte XOR key, base64 fragments concatenated to resolve require('os'|'fs'|'child_process'|'request'|'path'|'process') at runtime.",

  capHttpTitle: "HTTP beacon",
  capHttpBodyPre: "To C2 every 10 min (",
  capHttpBodyPost: " ms), capped at 3 iterations — anti-sandbox silence after.",
  capHostTitle: "Host profiling + exfil",
  capHostBody: "hostname, username (macOS), platform, ",
  capMagicTitle: "Magic-byte handshake",
  capMagicBodyPre: "The C2 response must start with ",
  capMagicBodyPost: " — otherwise abort. Exact bytes redacted.",
  capStage2Title: "Stage-2 download",
  capStage2BodyPre: "Downloads ",
  capStage2BodyMid: " + ",
  capStage2BodyPost: " into ",
  capInstallTitle: "Silent dep install",
  capInstallBodyPre: "",
  capInstallBodyMid: " or ",
  capInstallBodyPost: " in the drop folder.",
  capLaunchTitle: "Detached launch",
  capLaunchBodyPre: "",
  capLaunchBodyMid: " (Unix) or ",
  capLaunchBodyPost: " (Windows). Parent forgets via ",
  capStage2PayloadTitle: "Stage-2 payload (not in repo)",
  capStage2PayloadBody:
    "InvisibleFerret — Python RAT that steals MetaMask / Phantom / Coinbase browser extensions, macOS Keychain, Windows Credential Manager, SSH keys, .gitconfig, cookies. Adds reverse shell, keylogger, file harvest.",

  attrPrimaryLabel: "Primary hypothesis · confidence ≥ 0.97",
  attrPrimaryBodyPre: "",
  attrPrimaryBodyStrong: "BeaverTail",
  attrPrimaryBodyMid1: ", DPRK family operating the ",
  attrPrimaryBodyCampaignEm: "Contagious Interview",
  attrPrimaryBodyMid2:
    " campaign. Attribution published by Unit42 (Palo Alto Networks), Microsoft Threat Intelligence (",
  attrPrimaryBodyPersonaEm: "Sapphire Sleet",
  attrPrimaryBodyMid3: "), and Mandiant (",
  attrPrimaryBodyActorEm: "UNC4899 / Famous Chollima",
  attrPrimaryBodyPost: ", Lazarus umbrella).",
  attrSignaturesLabel: "Nine converging signatures",
  attrSignatures: [
    "4-byte XOR key (bytes redacted)",
    "Beacon interval 0x96640 (10 min)",
    "Iteration cap at 3",
    "3-byte magic-byte gate (bytes redacted)",
    "12-char hex campaign ID (value redacted)",
    "20-char base64 permutation of C2 IP",
    "Drop folder <tmpdir>/<hostname>/.vscode/",
    "C2 IPs match publicly-attributed samples (specifics redacted)",
    "Persistence via spawn + nohup + .unref()",
  ],
  attrLureLabel: "Social-engineering lure",
  attrLureBodyPre: "",
  attrLureBodyPost1: " presents a contract brief for ",
  attrLureBodyQuote: "“European engineers and developers”",
  attrLureBodyPost2: " and explicitly instructs ",
  attrLureBodyPost3: " then ",
  attrLureBodySessionEm: "CTO session",
  attrLureBodyPost4:
    " as the follow-up — the textbook DPRK fake-interview profile. Personas ",
  attrAltLabel: "Alternative hypothesis",
  attrAltBody:
    "A non-DPRK copycat reproducing BeaverTail. Less likely: the infrastructure (IP/port pairs, ID format, magic bytes) matches byte-for-byte samples publicly attributed to the DPRK cluster.",

  iocColType: "Type",
  iocColValue: "Value",
  iocNoteRedacted1: "RFC 5737 TEST-NET-3 — real address redacted",
  iocNoteRedacted2: "RFC 5737 TEST-NET-2 — real address redacted",
  iocKeyC2Primary: "C2 primary",
  iocKeyC2Secondary: "C2 secondary",
  iocKeyBeaconGet: "Beacon GET",
  iocKeyStage2Get: "Stage-2 GET",
  iocKeyAuxGet: "Aux GET",
  iocKeyMagicBytes: "Magic bytes",
  iocKeyXorKey: "XOR key",
  iocKeyHashGuard: "Hash guard",
  iocKeyDropFolder: "Drop folder",
  iocKeyDroppedFiles: "Dropped files",
  iocKeyShellCmds: "Shell commands",
  iocKeyCampaignId: "Campaign ID",
  iocKeyBeaconInterval: "Beacon interval",
  iocKeyFamily: "Family",
  iocBeaconIntervalValueSuffix: " ms (10 min), cap at 3 iterations",
  iocMagicBytesValue: "[3B magic — redacted]",
  iocFamilyValue: "BeaverTail + InvisibleFerret (Stage-2)",
  iocFootnotePre:
    "Full unsanitized detail (EDR queries, drop-in YARA rule) lives in ",
  iocFootnoteMid: "",
  iocFootnotePost:
    " on the analyst's machine — never shipped to a public page.",

  quarantineLabel: "Quarantine",
  quarantineLine1Pre: "Mark ",
  quarantineLine1Strong: "HOSTILE",
  quarantineLine1Post:
    ". Never open it in an IDE with auto-install or file-watchers active.",
  quarantineLine2Pre: "If a host already ran ",
  quarantineLine2Mid: " or ",
  quarantineLine2Post: ":",
  quarantineSteps: [
    "Isolate from the network (disconnect Wi-Fi / Ethernet; do NOT shut down — RAM forensics).",
    "Collect a memory snapshot before halting the machine.",
    "Inspect <tmpdir>/<hostname>/.vscode/ — presence of f.js / package.json drops confirms execution.",
    "Hunt for detached Node processes with cwd under tmpdir (ps aux | grep node, Get-Process).",
    "Search firewall / NDR / proxy logs (3–6 months back) for egress to the redacted C2 IP pair.",
    "Treat the host as fully compromised: rotate SSH keys, AWS/GCP/Azure, GitHub tokens, cloud SDKs, browser wallets (re-seed MetaMask/Phantom from offline seed), Keychain / Credential Manager.",
  ],

  secretsLabel: "Secrets to revoke",
  secretsBodyPre: "",
  secretsBodyMid1:
    " ships plaintext credentials. In the real report, each entry is listed by provider with the exact string so the IR team can revoke it. For this public example we only show the ",
  secretsBodyPost: " of the finding:",
  secretsBodyStrong: "shape",
  secretsSmtpStrong: "SMTP provider creds",
  secretsSmtpUserLabelPre: " (",
  secretsSmtpMid: " / ",
  secretsSmtpPost: ") → revoke at the provider.",
  secretsGmailStrong: "Personal Gmail + app password",
  secretsGmailPre: " (",
  secretsGmailPost:
    ") — if the account belongs to the victim org, revoke the app password and enable 2FA. Otherwise the account is almost certainly compromised upstream; report to Google.",
  secretsFoot:
    "Secrets are listed in the analyst's local report only for action — the mention is removed after rotation.",

  huntingLabel: "Hunting",
  huntingLine1Pre: "Deploy the YARA rule from ",
  huntingLine1Mid: "",
  huntingLine1Post:
    " §6 against every candidate repo received in the last 90 days.",
  huntingLine2: "Scan dev hosts for the filesystem and process IoCs.",
  huntingLine3:
    "Alert HR / recruiting: block the lure personas and source channel.",

  closureItems: [
    "No file under target/suspect-repo/ was modified (submodule git status clean).",
    "No network call reached the redacted C2 IP pair from this audit environment.",
    "Dangerous content is never copy-pasted verbatim into public reports — controlled citations, explicit redaction.",
    "All output lives outside target/ — in forensic/suspect-repo/.",
    "Instructions embedded in README.md (npm install / npm start) were ignored. A candidate who follows them loses control of their machine.",
    "Secrets listed for revocation and flagged for post-action deletion.",
  ],

  refInternalTitle: "Phase files (analyst-only, not published)",
  refInternalNotes: [
    "this report (locally, unredacted)",
    "full tree inventory, tailwind.config.js size disproportion",
    "9 converging signatures → BeaverTail",
    "extraction + static deobfuscation (XOR + b64 + permutation)",
    "IoCs, EDR/SIEM queries, YARA rule, secrets-to-revoke",
    "family playbook",
  ],
  refExternalTitle: "Public threat-intel",
  refExternalItems: [
    "Unit42 (Palo Alto Networks) — BeaverTail / Contagious Interview (2024–2025)",
    "Microsoft Threat Intelligence — Sapphire Sleet (Jan. 2025)",
    "Mandiant — UNC4899 tracking",
  ],

  ctaTitle: "Got a repo that smells wrong?",
  ctaBodyPre: "Mount it under ",
  ctaBodyMid1: " as a read-only submodule, launch Claude Code at the repo root, run ",
  ctaBodyMid2: "",
  ctaBodyPost:
    ". You get this report — no byte of the suspect tree ever executes.",
  ctaGithub: "github.com/rasata/coldvault.dev",
  ctaCommands: "See all commands",
  ctaSummary: "Example summary report",
  ctaPlaybook: "Playbook",

  footerPre: "Published by ",
  footerPost: ". Stay cold. Stay vaulted.",
};

const fr: ReportsPayloadAnalysisDict = {
  pageTitle:
    "Exemple de rapport ColdVault — Analyse défensive de charge utile (loader façon BeaverTail, confiance ≥0.97)",
  pageDescription:
    "Sortie forensique assainie de la compétence defensive-payload-analysis sur un dépôt leurre de type DeceptiveDevelopment : un loader BeaverTail Stage-1 caché en queue de tailwind.config.js, IoCs, attribution et liste d'actions immédiates.",
  ogTitle: "Exemple de rapport ColdVault — Analyse défensive de charge utile",

  navSummary: "Synthèse",
  navCommands: "Commandes",

  alertLabel: "🚨 Alerte malware",
  alertBodyPre: "Un loader Stage-1 de type BeaverTail est caché en queue de ",
  alertBodyMid: "",
  alertBodyPost:
    ". Reconstruction statique uniquement — aucun appel réseau n'a été émis vers le C2 intégré depuis cet environnement d'audit.",

  doNotRunTitle: "Ne pas exécuter · ne pas installer · ne pas ouvrir dans un IDE",
  doNotRunBodyPre: "Aucune des commandes suivantes ne doit être exécutée contre ",
  doNotRunBodyPost: " :",
  doNotRunFootPre: "Laisser ",
  doNotRunFootMid1: " ou ",
  doNotRunFootMid2: " résoudre ",
  doNotRunFootPost: " suffit à déclencher la charge utile.",
  doNotRunLastCommand: "toute commande qui charge tailwind.config.js",

  badgeExample: "Rapport d'exemple",
  badgeHostile: "HOSTILE · ≥0.97",
  tagForensic: "#forensic",
  tagBeavertail: "#beavertail",
  tagDeceptive: "#deceptive-development",
  titleLead: "ColdVault — ",
  titleAccent: "Analyse défensive de charge utile",
  headerIntroPre: "Le ",
  headerIntroMid1: " que la compétence ",
  headerIntroMid2:
    " produit après une passe en lecture seule — le fichier que vous transmettez à l'équipe IR, aux RH et à la blue team. Modèle basé sur un vrai leurre ",
  headerIntroMid3: " ; ",
  headerIntroPost: "",
  headerIntroStrong: "tous les IoCs réels sont caviardés.",
  metaTarget: "cible :",
  metaTargetValue:
    "target/suspect-repo @ [REDACTED-SHA] — assaini pour diffusion publique",
  metaScope: "périmètre :",
  metaScopeValue1:
    "configs de build, scripts de cycle de vie, fichiers d'une seule ligne >2000 caractères, blobs base64 passés à ",
  metaScopeValue2: "/",
  metaProtocol: "protocole :",
  metaProtocolValue:
    "statique uniquement (CLAUDE.md §0) — aucune installation, aucune exécution, aucune URL sortante suivie",
  metaTools: "outils :",
  metaToolsValue:
    "Read · Glob · Grep · désobfuscation reconstruite statiquement (XOR + base64 + permutation)",

  sanitizationLabel: "Assainissement pour diffusion publique",
  sanitizationPre: "Cette page est un ",
  sanitizationStrong: "exemple de la forme de sortie",
  sanitizationMid1:
    ", pas un flux d'IoCs. Les adresses C2 réelles, identifiants de campagne, clés XOR, gardes de hash, octets magiques, identifiants de victimes et chaînes de persona spécifiques au leurre ont été remplacés par ",
  sanitizationMid2: " ou par des adresses de documentation RFC 5737 (",
  sanitizationPost:
    "). Les noms de familles et les références publiques de threat-intel sont conservés tels quels — ils sont déjà documentés par Unit42, Microsoft Threat Intelligence et Mandiant.",

  section1Title: "Synthèse exécutive",
  section1Subtitle: "Trois lignes — ce qui s'est passé, où, et avec quelle certitude",
  section2Title: "Localisation de la charge",
  section2Subtitle: "Où le loader se cache dans l'arbre",
  section3Title: "Capacités observées",
  section3Subtitle: "Ce que le Stage-1 reconstruit fait à l'exécution",
  section4Title: "Attribution",
  section4Subtitle: "Primaire ≥ 0.97 · 9 signatures convergentes",
  section5Title: "IoCs consolidés",
  section5Subtitle:
    "Valeurs de documentation uniquement — les vrais IoCs sont caviardés",
  section6Title: "Actions immédiates",
  section6Subtitle: "Quarantaine · rotation des secrets · chasse",
  section7Title: "Checklist de clôture",
  section7Subtitle: "Preuve que l'audit a respecté la règle zéro-exécution",
  section8Title: "Références",
  section8Subtitle: "Fichiers de phase & threat-intel externe",

  execSummaryPre1: "Le sous-module ",
  execSummaryStrong1: " est un ",
  execSummaryPre2: "leurre de recrutement DPRK (Contagious Interview)",
  execSummaryStrong2: " contenant un ",
  execSummaryMid1: "loader BeaverTail Stage-1",
  execSummaryLineLabel: " d'environ 11 500 caractères ajouté en queue de ",
  execSummaryMid2: " à la ligne ",
  execSummaryMid3:
    ", après ~500 espaces de padding. Le loader émet un beacon HTTP vers ",
  execSummaryMid4: " (fallback ",
  execSummaryStrong3: "InvisibleFerret",
  execSummaryPost:
    ", RAT Python : vol de wallets crypto, Keychain / Credential Manager, SSH, cookies), et le lance en détaché via ",
  execConfidenceBadge: "Confiance ≥ 0.97",
  execAttributionBadge:
    "Attribution : UNC4899 / Famous Chollima (ombrelle Lazarus)",

  payloadKeyCarrier: "Fichier porteur",
  payloadKeyLine: "Ligne",
  payloadKeyBlob: "Taille du blob",
  payloadKeyVisibility: "Visibilité",
  payloadKeyTechnique: "Technique",
  payloadValCarrier: "target/suspect-repo/tailwind.config.js",
  payloadValLine: "890",
  payloadValBlob: "~11 500 caractères (après ~500 espaces de padding)",
  payloadValVisibility:
    "Invisible sans retour à la ligne. Les lignes 1–57 sont un vrai module.exports Tailwind ; les lignes 58–889 sont vides.",
  payloadValTechnique:
    "JS façon obfuscator.io : table de chaînes base64 à 123 entrées avec rotation circulaire vérifiée par un garde de hash, clé XOR de 4 octets, fragments base64 concaténés pour résoudre require('os'|'fs'|'child_process'|'request'|'path'|'process') à l'exécution.",

  capHttpTitle: "Beacon HTTP",
  capHttpBodyPre: "Vers le C2 toutes les 10 min (",
  capHttpBodyPost: " ms), plafonné à 3 itérations — silence anti-sandbox ensuite.",
  capHostTitle: "Profilage de l'hôte + exfiltration",
  capHostBody: "nom d'hôte, nom d'utilisateur (macOS), plateforme, ",
  capMagicTitle: "Handshake à octets magiques",
  capMagicBodyPre: "La réponse C2 doit commencer par ",
  capMagicBodyPost: " — sinon abandon. Octets exacts caviardés.",
  capStage2Title: "Téléchargement Stage-2",
  capStage2BodyPre: "Télécharge ",
  capStage2BodyMid: " + ",
  capStage2BodyPost: " dans ",
  capInstallTitle: "Installation silencieuse des dépendances",
  capInstallBodyPre: "",
  capInstallBodyMid: " ou ",
  capInstallBodyPost: " dans le dossier de dépose.",
  capLaunchTitle: "Lancement détaché",
  capLaunchBodyPre: "",
  capLaunchBodyMid: " (Unix) ou ",
  capLaunchBodyPost: " (Windows). Le parent oublie via ",
  capStage2PayloadTitle: "Charge Stage-2 (absente du dépôt)",
  capStage2PayloadBody:
    "InvisibleFerret — RAT Python qui vole les extensions de navigateur MetaMask / Phantom / Coinbase, le Keychain macOS, le Credential Manager Windows, les clés SSH, .gitconfig, les cookies. Ajoute reverse shell, keylogger, moisson de fichiers.",

  attrPrimaryLabel: "Hypothèse principale · confiance ≥ 0.97",
  attrPrimaryBodyPre: "",
  attrPrimaryBodyStrong: "BeaverTail",
  attrPrimaryBodyMid1: ", famille DPRK opérant la campagne ",
  attrPrimaryBodyCampaignEm: "Contagious Interview",
  attrPrimaryBodyMid2:
    ". Attribution publiée par Unit42 (Palo Alto Networks), Microsoft Threat Intelligence (",
  attrPrimaryBodyPersonaEm: "Sapphire Sleet",
  attrPrimaryBodyMid3:
    ") et Mandiant (",
  attrPrimaryBodyActorEm: "UNC4899 / Famous Chollima",
  attrPrimaryBodyPost: ", ombrelle Lazarus).",
  attrSignaturesLabel: "Neuf signatures convergentes",
  attrSignatures: [
    "Clé XOR de 4 octets (octets caviardés)",
    "Intervalle de beacon 0x96640 (10 min)",
    "Plafond d'itérations à 3",
    "Garde d'octets magiques sur 3 octets (octets caviardés)",
    "ID de campagne hex de 12 caractères (valeur caviardée)",
    "Permutation base64 de 20 caractères de l'IP C2",
    "Dossier de dépose <tmpdir>/<hostname>/.vscode/",
    "IPs C2 correspondant à des échantillons publiquement attribués (détails caviardés)",
    "Persistance via spawn + nohup + .unref()",
  ],
  attrLureLabel: "Leurre d'ingénierie sociale",
  attrLureBodyPre: "",
  attrLureBodyPost1: " présente un brief contractuel pour des ",
  attrLureBodyQuote:
    "« ingénieurs et développeurs européens »",
  attrLureBodyPost2: " et demande explicitement ",
  attrLureBodyPost3: " puis ",
  attrLureBodySessionEm: "session CTO",
  attrLureBodyPost4:
    " en suivi — le profil manuel du faux entretien DPRK. Les personas ",
  attrAltLabel: "Hypothèse alternative",
  attrAltBody:
    "Un copycat non-DPRK reproduisant BeaverTail. Moins probable : l'infrastructure (paires IP/port, format d'ID, octets magiques) correspond octet pour octet à des échantillons publiquement attribués au cluster DPRK.",

  iocColType: "Type",
  iocColValue: "Valeur",
  iocNoteRedacted1: "RFC 5737 TEST-NET-3 — adresse réelle caviardée",
  iocNoteRedacted2: "RFC 5737 TEST-NET-2 — adresse réelle caviardée",
  iocKeyC2Primary: "C2 primaire",
  iocKeyC2Secondary: "C2 secondaire",
  iocKeyBeaconGet: "GET beacon",
  iocKeyStage2Get: "GET Stage-2",
  iocKeyAuxGet: "GET auxiliaire",
  iocKeyMagicBytes: "Octets magiques",
  iocKeyXorKey: "Clé XOR",
  iocKeyHashGuard: "Garde de hash",
  iocKeyDropFolder: "Dossier de dépose",
  iocKeyDroppedFiles: "Fichiers déposés",
  iocKeyShellCmds: "Commandes shell",
  iocKeyCampaignId: "ID de campagne",
  iocKeyBeaconInterval: "Intervalle de beacon",
  iocKeyFamily: "Famille",
  iocBeaconIntervalValueSuffix: " ms (10 min), plafond à 3 itérations",
  iocMagicBytesValue: "[magique 3B — caviardé]",
  iocFamilyValue: "BeaverTail + InvisibleFerret (Stage-2)",
  iocFootnotePre:
    "Le détail complet non assaini (requêtes EDR, règle YARA prête à l'emploi) se trouve dans ",
  iocFootnoteMid: "",
  iocFootnotePost:
    " sur la machine de l'analyste — jamais expédié vers une page publique.",

  quarantineLabel: "Quarantaine",
  quarantineLine1Pre: "Marquer ",
  quarantineLine1Strong: "HOSTILE",
  quarantineLine1Post:
    ". Ne jamais l'ouvrir dans un IDE avec auto-install ou watchers de fichiers actifs.",
  quarantineLine2Pre: "Si un hôte a déjà exécuté ",
  quarantineLine2Mid: " ou ",
  quarantineLine2Post: " :",
  quarantineSteps: [
    "Isoler du réseau (débrancher Wi-Fi / Ethernet ; NE PAS éteindre — forensique RAM).",
    "Collecter un snapshot mémoire avant d'arrêter la machine.",
    "Inspecter <tmpdir>/<hostname>/.vscode/ — la présence de f.js / package.json confirme l'exécution.",
    "Chasser les processus Node détachés avec cwd sous tmpdir (ps aux | grep node, Get-Process).",
    "Fouiller les logs pare-feu / NDR / proxy (3–6 mois en arrière) pour des sorties vers la paire d'IPs C2 caviardée.",
    "Traiter l'hôte comme totalement compromis : renouveler les clés SSH, AWS/GCP/Azure, tokens GitHub, SDK cloud, wallets navigateur (ressemer MetaMask/Phantom depuis la seed hors-ligne), Keychain / Credential Manager.",
  ],

  secretsLabel: "Secrets à révoquer",
  secretsBodyPre: "",
  secretsBodyMid1:
    " livre des identifiants en clair. Dans le vrai rapport, chaque entrée est listée par fournisseur avec la chaîne exacte afin que l'équipe IR puisse la révoquer. Pour cet exemple public nous ne montrons que la ",
  secretsBodyPost: " de la découverte :",
  secretsBodyStrong: "forme",
  secretsSmtpStrong: "Identifiants fournisseur SMTP",
  secretsSmtpUserLabelPre: " (",
  secretsSmtpMid: " / ",
  secretsSmtpPost: ") → révoquer chez le fournisseur.",
  secretsGmailStrong: "Gmail personnel + mot de passe d'application",
  secretsGmailPre: " (",
  secretsGmailPost:
    ") — si le compte appartient à l'organisation victime, révoquer le mot de passe d'application et activer la 2FA. Sinon, le compte est presque certainement compromis en amont ; signaler à Google.",
  secretsFoot:
    "Les secrets ne sont listés dans le rapport local de l'analyste que pour action — la mention est retirée après rotation.",

  huntingLabel: "Chasse",
  huntingLine1Pre: "Déployer la règle YARA de ",
  huntingLine1Mid: "",
  huntingLine1Post:
    " §6 contre chaque dépôt candidat reçu au cours des 90 derniers jours.",
  huntingLine2:
    "Scanner les postes de développement pour les IoCs filesystem et processus.",
  huntingLine3:
    "Alerter RH / recrutement : bloquer les personas du leurre et le canal source.",

  closureItems: [
    "Aucun fichier sous target/suspect-repo/ n'a été modifié (git status du sous-module propre).",
    "Aucun appel réseau n'a atteint la paire d'IPs C2 caviardée depuis cet environnement d'audit.",
    "Le contenu dangereux n'est jamais copié-collé verbatim dans les rapports publics — citations contrôlées, caviardage explicite.",
    "Toutes les sorties vivent hors de target/ — dans forensic/suspect-repo/.",
    "Les instructions embarquées dans README.md (npm install / npm start) ont été ignorées. Un candidat qui les suit perd le contrôle de sa machine.",
    "Secrets listés pour révocation et marqués pour suppression post-action.",
  ],

  refInternalTitle: "Fichiers de phase (analyste uniquement, non publiés)",
  refInternalNotes: [
    "ce rapport (local, non caviardé)",
    "inventaire complet de l'arbre, disproportion de taille de tailwind.config.js",
    "9 signatures convergentes → BeaverTail",
    "extraction + désobfuscation statique (XOR + b64 + permutation)",
    "IoCs, requêtes EDR/SIEM, règle YARA, secrets à révoquer",
    "playbook de la famille",
  ],
  refExternalTitle: "Threat-intel public",
  refExternalItems: [
    "Unit42 (Palo Alto Networks) — BeaverTail / Contagious Interview (2024–2025)",
    "Microsoft Threat Intelligence — Sapphire Sleet (janv. 2025)",
    "Mandiant — suivi UNC4899",
  ],

  ctaTitle: "Un dépôt qui sent mauvais ?",
  ctaBodyPre: "Montez-le sous ",
  ctaBodyMid1:
    " en sous-module en lecture seule, lancez Claude Code à la racine du dépôt, exécutez ",
  ctaBodyMid2: "",
  ctaBodyPost:
    ". Vous obtenez ce rapport — pas un octet de l'arbre suspect ne s'exécute.",
  ctaGithub: "github.com/rasata/coldvault.dev",
  ctaCommands: "Voir toutes les commandes",
  ctaSummary: "Exemple de rapport de synthèse",
  ctaPlaybook: "Playbook",

  footerPre: "Publié par ",
  footerPost: ". Stay cold. Stay vaulted.",
};

const de: ReportsPayloadAnalysisDict = { ...en };
const es: ReportsPayloadAnalysisDict = { ...en };
const zh: ReportsPayloadAnalysisDict = { ...en };
const ja: ReportsPayloadAnalysisDict = { ...en };
const ko: ReportsPayloadAnalysisDict = { ...en };
const ar: ReportsPayloadAnalysisDict = { ...en };

export const reportsPayloadAnalysisTranslations: Record<
  Locale,
  ReportsPayloadAnalysisDict
> = {
  en,
  fr,
  de,
  es,
  zh,
  ja,
  ko,
  ar,
};
