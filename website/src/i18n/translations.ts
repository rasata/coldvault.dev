export const LOCALES = ["en", "fr", "de", "es", "zh", "ja", "ko", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const RTL_LOCALES: ReadonlySet<Locale> = new Set<Locale>(["ar"]);

export const LOCALE_META: Record<Locale, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇬🇧" },
  fr: { label: "Français", flag: "🇫🇷" },
  de: { label: "Deutsch", flag: "🇩🇪" },
  es: { label: "Español", flag: "🇪🇸" },
  zh: { label: "中文", flag: "🇨🇳" },
  ja: { label: "日本語", flag: "🇯🇵" },
  ko: { label: "한국어", flag: "🇰🇷" },
  ar: { label: "العربية", flag: "🇸🇦" },
};

export type Dictionary = {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  nav: {
    threat: string;
    arsenal: string;
    how: string;
    star: string;
    language: string;
    commands: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    descStart: string;
    descMiddle: string;
    descEnd: string;
    web3Sandbox: string;
    cta1: string;
    cta2: string;
    terminalLabel: string;
  };
  threat: {
    badge: string;
    heading: string;
    p1Start: string;
    p1Middle: string;
    p1End: string;
    p2Start: string;
    p2Coldvault: string;
    p2Middle: string;
    p2Highlight: string;
    p2End: string;
  };
  features: {
    badge: string;
    title1: string;
    title2: string;
    items: { title: string; desc: string }[];
  };
  how: {
    badge: string;
    title1: string;
    title2: string;
    stepLabel: string;
    steps: { title: string; desc: string }[];
  };
  cta: {
    title1: string;
    title2: string;
    desc: string;
  };
  footer: {
    tagline: string;
    github: string;
    poweredBy: string;
  };
  commandsPage: {
    meta: { title: string; description: string };
    nav: { back: string };
    hero: { badge: string; title1: string; title2: string; subtitle: string };
    usage: {
      heading: string;
      description: string;
      hintCommandsDir: string;
      hintSkillsDir: string;
      exampleLabel: string;
    };
    commandsSection: { badge: string; heading: string; description: string };
    skillsSection: { badge: string; heading: string; description: string };
    outputLabel: string;
    cta: { title: string; description: string; button: string };
    descriptions: {
      cmd_audit: string;
      cmd_defensive_payload_analysis: string;
      cmd_scan_deps: string;
      cmd_scan_iac: string;
      cmd_scan_malware: string;
      cmd_scan_sast: string;
      cmd_scan_secrets: string;
      cmd_security_review: string;
      skill_agentic_actions_auditor: string;
      skill_audit_context_building: string;
      skill_constant_time_analysis: string;
      skill_defensive_payload_analysis: string;
      skill_entry_point_analyzer: string;
      skill_html_report_renderer: string;
      skill_insecure_defaults_hunter: string;
      skill_secrets_hunter: string;
      skill_security_review: string;
      skill_semgrep_rule_creator: string;
      skill_snyk_sast: string;
      skill_snyk_sca: string;
      skill_static_analysis_orchestrator: string;
      skill_supply_chain_risk_auditor: string;
      skill_untrusted_code_isolation: string;
      skill_variant_analysis: string;
      skill_yara_malware_hunter: string;
    };
  };
};

export const translations: Record<Locale, Dictionary> = {
  en: {
    meta: {
      title: "Coldvault — Audit untrusted code without ever running it",
      description:
        "Coldvault.dev is a Web3-grade sandbox by ZONOVA RESEARCH. Audit suspicious repos with Claude Code & 40+ scanners — your machine stays untouched.",
      ogTitle: "Coldvault — Cold-storage audits for untrusted code",
      ogDescription:
        "Drop-in Codespace sandbox. Static analysis only. Powered by Claude Code & ZONOVA RESEARCH.",
    },
    nav: {
      threat: "The Threat",
      arsenal: "Arsenal",
      how: "How it works",
      star: "Star on GitHub",
      language: "Language",
      commands: "Commands",
    },
    hero: {
      badge: "v0 — by ZONOVA RESEARCH",
      title1: "Audit the code.",
      title2: "Never run it.",
      descStart: "A drop-in ",
      web3Sandbox: "Web3-grade sandbox",
      descMiddle:
        " for inspecting suspicious repos. Powered by Claude Code & 40+ scanners — your laptop stays ",
      descEnd: "frozen out of the blast radius.",
      cta1: "Clone the Vault",
      cta2: "See how it works",
      terminalLabel: "~/coldvault",
    },
    threat: {
      badge: "Why Coldvault exists",
      heading: '"Just install this — it\'s for the technical interview."',
      p1Start:
        "Fake recruiters now weaponize coding challenges. They send you a repo asking you to ",
      p1Middle:
        " and run their script. Behind the README hides a credential stealer, a clipboard hijacker, or a remote shell.",
      p1End: "",
      p2Start: "",
      p2Coldvault: "Coldvault",
      p2Middle: " is the answer: a public, reproducible audit environment where ",
      p2Highlight: "no untrusted byte ever executes",
      p2End: ".",
    },
    features: {
      badge: "THE ARSENAL",
      title1: "40+ scanners,",
      title2: "one cold sandbox",
      items: [
        {
          title: "Never executes code",
          desc: "Suspect repos mount as a read-only git submodule under target/. 100% static analysis.",
        },
        {
          title: "Codespace-ready",
          desc: "A pre-baked Debian devcontainer with 40+ scanners — spin up an audit in <60s.",
        },
        {
          title: "Claude Code skills",
          desc: "Curated agent skills inspired by trailofbits & Anthropic. Intent → reproducible scans.",
        },
        {
          title: "SAST · SCA · Secrets",
          desc: "Semgrep, Trivy, Gitleaks, Syft, ClamAV, Checkov — all wired in, all consolidated.",
        },
        {
          title: "SARIF + Markdown reports",
          desc: "Findings land in reports/ as structured data plus a human-readable executive summary.",
        },
        {
          title: "Armoured by design",
          desc: "Zero network egress from target/. Air-gapped analysis behind container walls.",
        },
      ],
    },
    how: {
      badge: "WORKFLOW",
      title1: "Five steps to",
      title2: "cold truth",
      stepLabel: "STEP",
      steps: [
        { title: "Clone the vault", desc: "git clone coldvault.dev — fork it, own it." },
        { title: "Open Codespace", desc: "Devcontainer boots with the full toolchain." },
        { title: "Add the suspect", desc: "Mount the untrusted repo as a read-only submodule." },
        { title: "Ask Claude", desc: "Run a skill: malware, secrets, supply-chain, IaC…" },
        { title: "Read the report", desc: "Consolidated SARIF + Markdown in reports/." },
      ],
    },
    cta: {
      title1: "Stop running code",
      title2: "you don't trust.",
      desc: "Coldvault is open-source, MIT-licensed, and ready to fork. Bring your own Claude Code agent — we bring the armoured walls.",
    },
    footer: {
      tagline: "🧊 COLDVAULT — A ZONOVA RESEARCH project · MIT",
      github: "GitHub",
      poweredBy: "Powered by Claude Code",
    },
    commandsPage: {
      meta: {
        title: "Coldvault — Claude commands & skills reference",
        description:
          "Every slash command and skill bundled with Coldvault: what each one does, when to invoke it, and what it writes to reports/.",
      },
      nav: { back: "Back" },
      hero: {
        badge: "Reference · v1.0",
        title1: "Claude commands",
        title2: "& skills",
        subtitle:
          "Every slash command and skill bundled with Coldvault. Commands are invoked from the Claude Code prompt with a leading slash; skills are auto-selected by Claude when their description matches the task.",
      },
      usage: {
        heading: "How to invoke",
        description:
          "Inside a Claude Code session at the repo root, type a slash followed by the command name. Skills are selected automatically — you can also name one explicitly in your prompt (e.g. \"use the yara-malware-hunter skill\").",
        hintCommandsDir: "Slash commands live in .claude/commands/",
        hintSkillsDir: "Skills live in .claude/skills/",
        exampleLabel: "Example session",
      },
      commandsSection: {
        badge: "SLASH COMMANDS",
        heading: "Slash commands",
        description:
          "Invoked directly with /name. Each command wires one or more skills to a script under scripts/ and writes structured output to reports/.",
      },
      skillsSection: {
        badge: "SKILLS",
        heading: "Skills",
        description:
          "Claude selects a skill when its description matches the task. Skills are reusable units that Coldvault composes into the audit pipeline.",
      },
      outputLabel: "Output",
      cta: {
        title: "Every command is read-only on target/",
        description:
          "None of the commands below ever runs code under target/. They parse lockfiles, grep sources, invoke scanners, and write reports — nothing more.",
        button: "Read the audit protocol",
      },
      descriptions: {
        cmd_audit:
          "Full audit pipeline: context → secrets → SCA → SAST → malware → IaC → payload analysis → SUMMARY.md + SUMMARY.html.",
        cmd_defensive_payload_analysis:
          "Read-only forensic pass: hunts hidden payloads in build configs, obfuscated postinstall, and base64 blobs fed to eval/Function. Writes forensic/<target>/.",
        cmd_scan_deps:
          "Supply-chain / SCA: osv-scanner + trivy + grype + language-native audits + SBOM. Lockfiles only — never installs.",
        cmd_scan_iac:
          "Infrastructure-as-code scan: tfsec, terrascan, checkov, hadolint, dockle, kubesec.",
        cmd_scan_malware:
          "Malware triage on source and binaries: YARA, capa, ClamAV, oletools.",
        cmd_scan_sast:
          "Multi-language SAST: Semgrep plus bandit/gosec/njsscan/cppcheck/brakeman/psalm and more.",
        cmd_scan_secrets:
          "Credential & key discovery: gitleaks + trufflehog + detect-secrets + ggshield. Never runs with --verification (would beacon the provider).",
        cmd_security_review:
          "PR-mode review: diff HEAD vs. base inside target/, findings in the Anthropic security-review JSON schema.",
        skill_agentic_actions_auditor:
          "Audits CI workflows (GitHub Actions, GitLab CI, CircleCI, Azure Pipelines) for pwn-request patterns, unpinned actions, and secret exfiltration.",
        skill_audit_context_building:
          "First pass: inventories languages, frameworks, package managers, and entry points. Every other skill reads its output.",
        skill_constant_time_analysis:
          "Flags variable-time comparisons on secrets and early-exit loops — catches roughly 70% of timing leaks visible at source level.",
        skill_defensive_payload_analysis:
          "Four-phase forensic analysis of a suspect tree. Extracts attacker signature, payload location, and statically-decrypted IoCs (C2 IPs, ports, XOR keys).",
        skill_entry_point_analyzer:
          "Maps the attack surface: HTTP routes, CLI commands, exported symbols, message queues, CI triggers, IPC sockets.",
        skill_html_report_renderer:
          "Renders reports/findings.json + SUMMARY.md into a single self-contained reports/SUMMARY.html — no external fonts, no JS framework, no network.",
        skill_insecure_defaults_hunter:
          "Weak crypto, disabled TLS, permissive CORS, debug mode in prod, unsafe deserialization, open S3 buckets — the low-hanging fruit.",
        skill_secrets_hunter:
          "Credentials, API keys, tokens, private keys, high-entropy strings. Triages each hit: live vs. test vs. revoked.",
        skill_security_review:
          "PR-style security review of a diff inside target/, using the Anthropic claude-code-security-review JSON schema.",
        skill_semgrep_rule_creator:
          "Writes a custom Semgrep rule on the fly, drops it in rules/semgrep/, runs it against target/. Great for variant analysis or codifying a manual finding.",
        skill_snyk_sast:
          "Snyk Code-parity SAST workflow: Semgrep with curated rulesets plus language-native analyzers.",
        skill_snyk_sca:
          "Snyk Open Source-parity SCA workflow: osv-scanner, trivy, grype, and the Snyk CLI if authenticated.",
        skill_static_analysis_orchestrator:
          "Drives the per-language SAST fleet, merges SARIF, deduplicates — single ranked list in reports/sast-merged.sarif.",
        skill_supply_chain_risk_auditor:
          "Lockfile parsing + OSV / Trivy / Snyk data: CVEs, typo-squats, malicious maintainers, install-time hooks, git-URL deps.",
        skill_untrusted_code_isolation:
          "Safety rails. Enforces the zero-execution rule from CLAUDE.md §0 — invoke before any command that could execute target/.",
        skill_variant_analysis:
          "Given a confirmed finding, greps the whole tree for semantically similar bugs — one root cause usually breeds siblings.",
        skill_yara_malware_hunter:
          "YARA / YARA-X scan on source and binaries using curated rulesets (Yara-Rules community + Neo23x0 signature-base) plus project-specific rules.",
      },
    },
  },

  fr: {
    meta: {
      title: "Coldvault — Auditez du code non fiable sans jamais l'exécuter",
      description:
        "Coldvault.dev est un sandbox de niveau Web3 par ZONOVA RESEARCH. Auditez des dépôts suspects avec Claude Code et plus de 40 scanners — votre machine reste intacte.",
      ogTitle: "Coldvault — Audits en chambre froide pour le code non fiable",
      ogDescription:
        "Sandbox Codespace clé en main. Analyse statique uniquement. Propulsé par Claude Code et ZONOVA RESEARCH.",
    },
    nav: {
      threat: "La Menace",
      arsenal: "Arsenal",
      how: "Comment ça marche",
      star: "Étoiler sur GitHub",
      language: "Langue",
      commands: "Commandes",
    },
    hero: {
      badge: "v0 — par ZONOVA RESEARCH",
      title1: "Auditez le code.",
      title2: "Ne l'exécutez jamais.",
      descStart: "Un ",
      web3Sandbox: "sandbox de niveau Web3",
      descMiddle:
        " clé en main pour inspecter les dépôts suspects. Propulsé par Claude Code et 40+ scanners — votre portable reste ",
      descEnd: "à l'abri du rayon d'impact.",
      cta1: "Cloner le coffre",
      cta2: "Voir comment ça marche",
      terminalLabel: "~/coldvault",
    },
    threat: {
      badge: "Pourquoi Coldvault existe",
      heading: "« Installez juste ça — c'est pour l'entretien technique. »",
      p1Start:
        "De faux recruteurs instrumentalisent désormais les tests techniques. Ils vous envoient un dépôt en vous demandant de faire ",
      p1Middle:
        " et d'exécuter leur script. Derrière le README se cache un voleur d'identifiants, un détourneur de presse-papiers ou un shell distant.",
      p1End: "",
      p2Start: "",
      p2Coldvault: "Coldvault",
      p2Middle: " est la réponse : un environnement d'audit public et reproductible où ",
      p2Highlight: "aucun octet non fiable ne s'exécute jamais",
      p2End: ".",
    },
    features: {
      badge: "L'ARSENAL",
      title1: "40+ scanners,",
      title2: "un sandbox glacial",
      items: [
        {
          title: "N'exécute jamais de code",
          desc: "Les dépôts suspects sont montés en sous-module git en lecture seule dans target/. 100 % analyse statique.",
        },
        {
          title: "Prêt pour Codespace",
          desc: "Un devcontainer Debian pré-configuré avec 40+ scanners — lancez un audit en moins de 60s.",
        },
        {
          title: "Compétences Claude Code",
          desc: "Des skills d'agent inspirés de Trail of Bits et Anthropic. Intention → scans reproductibles.",
        },
        {
          title: "SAST · SCA · Secrets",
          desc: "Semgrep, Trivy, Gitleaks, Syft, ClamAV, Checkov — tous intégrés, tous consolidés.",
        },
        {
          title: "Rapports SARIF + Markdown",
          desc: "Les résultats arrivent dans reports/ en données structurées plus un résumé exécutif lisible.",
        },
        {
          title: "Blindé par conception",
          desc: "Zéro sortie réseau depuis target/. Analyse hermétique derrière les murs du conteneur.",
        },
      ],
    },
    how: {
      badge: "FLUX DE TRAVAIL",
      title1: "Cinq étapes vers",
      title2: "la vérité glacée",
      stepLabel: "ÉTAPE",
      steps: [
        {
          title: "Cloner le coffre",
          desc: "git clone coldvault.dev — forkez-le, appropriez-vous-le.",
        },
        {
          title: "Ouvrir un Codespace",
          desc: "Le devcontainer démarre avec toute la boîte à outils.",
        },
        {
          title: "Ajouter le suspect",
          desc: "Montez le dépôt non fiable en sous-module en lecture seule.",
        },
        {
          title: "Demandez à Claude",
          desc: "Lancez un skill : malware, secrets, chaîne d'approvisionnement, IaC…",
        },
        { title: "Lire le rapport", desc: "SARIF + Markdown consolidés dans reports/." },
      ],
    },
    cta: {
      title1: "Arrêtez d'exécuter du code",
      title2: "auquel vous ne faites pas confiance.",
      desc: "Coldvault est open-source, sous licence MIT et prêt à forker. Apportez votre propre agent Claude Code — nous apportons les murs blindés.",
    },
    footer: {
      tagline: "🧊 COLDVAULT — Un projet ZONOVA RESEARCH · MIT",
      github: "GitHub",
      poweredBy: "Propulsé par Claude Code",
    },
    commandsPage: {
      meta: {
        title: "Coldvault — Référence des commandes et compétences Claude",
        description:
          "Toutes les commandes slash et compétences livrées avec Coldvault : ce que chacune fait, quand l'invoquer et ce qu'elle écrit dans reports/.",
      },
      nav: { back: "Retour" },
      hero: {
        badge: "Référence · v1.0",
        title1: "Commandes Claude",
        title2: "et compétences",
        subtitle:
          "Toutes les commandes slash et compétences livrées avec Coldvault. Les commandes s'invoquent depuis l'invite Claude Code avec une barre oblique ; les compétences sont sélectionnées automatiquement par Claude quand leur description correspond à la tâche.",
      },
      usage: {
        heading: "Comment les invoquer",
        description:
          "Dans une session Claude Code à la racine du dépôt, tapez une barre oblique suivie du nom de la commande. Les compétences sont sélectionnées automatiquement — vous pouvez aussi en nommer une explicitement dans votre prompt (par ex. « utilise la compétence yara-malware-hunter »).",
        hintCommandsDir: "Les commandes slash vivent dans .claude/commands/",
        hintSkillsDir: "Les compétences vivent dans .claude/skills/",
        exampleLabel: "Exemple de session",
      },
      commandsSection: {
        badge: "COMMANDES SLASH",
        heading: "Commandes slash",
        description:
          "Invoquées directement avec /nom. Chaque commande branche une ou plusieurs compétences sur un script sous scripts/ et écrit une sortie structurée dans reports/.",
      },
      skillsSection: {
        badge: "COMPÉTENCES",
        heading: "Compétences",
        description:
          "Claude sélectionne une compétence quand sa description correspond à la tâche. Les compétences sont des unités réutilisables que Coldvault compose dans la pipeline d'audit.",
      },
      outputLabel: "Sortie",
      cta: {
        title: "Chaque commande reste en lecture seule sur target/",
        description:
          "Aucune des commandes ci-dessous n'exécute jamais de code sous target/. Elles lisent les lockfiles, grepent les sources, lancent des scanners et écrivent des rapports — rien de plus.",
        button: "Lire le protocole d'audit",
      },
      descriptions: {
        cmd_audit:
          "Pipeline d'audit complet : contexte → secrets → SCA → SAST → malware → IaC → analyse de payload → SUMMARY.md + SUMMARY.html.",
        cmd_defensive_payload_analysis:
          "Passe forensique en lecture seule : traque les payloads cachés dans les configs de build, les postinstall obfusqués et les blobs base64 passés à eval/Function. Écrit dans forensic/<target>/.",
        cmd_scan_deps:
          "Chaîne d'approvisionnement / SCA : osv-scanner + trivy + grype + audits natifs + SBOM. Lockfiles uniquement — n'installe jamais.",
        cmd_scan_iac:
          "Scan infrastructure-as-code : tfsec, terrascan, checkov, hadolint, dockle, kubesec.",
        cmd_scan_malware:
          "Triage malware sur sources et binaires : YARA, capa, ClamAV, oletools.",
        cmd_scan_sast:
          "SAST multilangue : Semgrep plus bandit/gosec/njsscan/cppcheck/brakeman/psalm et d'autres.",
        cmd_scan_secrets:
          "Découverte d'identifiants et de clés : gitleaks + trufflehog + detect-secrets + ggshield. Ne lance jamais --verification (qui signalerait au fournisseur).",
        cmd_security_review:
          "Mode PR : diff HEAD vs base dans target/, résultats au schéma JSON security-review d'Anthropic.",
        skill_agentic_actions_auditor:
          "Audite les workflows CI (GitHub Actions, GitLab CI, CircleCI, Azure Pipelines) pour les patterns pwn-request, actions non pinnées et exfiltration de secrets.",
        skill_audit_context_building:
          "Première passe : inventaire des langages, frameworks, gestionnaires de paquets et points d'entrée. Toutes les autres compétences lisent sa sortie.",
        skill_constant_time_analysis:
          "Signale les comparaisons à temps variable sur des secrets et les boucles à sortie anticipée — attrape environ 70 % des fuites temporelles visibles au niveau du source.",
        skill_defensive_payload_analysis:
          "Analyse forensique en quatre phases d'un arbre suspect. Extrait signature d'attaquant, emplacement du payload et IoC statiquement décryptés (IP C2, ports, clés XOR).",
        skill_entry_point_analyzer:
          "Cartographie la surface d'attaque : routes HTTP, commandes CLI, symboles exportés, files de messages, triggers CI, sockets IPC.",
        skill_html_report_renderer:
          "Rend reports/findings.json + SUMMARY.md en un unique reports/SUMMARY.html autosuffisant — sans polices externes, sans framework JS, sans réseau.",
        skill_insecure_defaults_hunter:
          "Crypto faible, TLS désactivé, CORS permissif, mode debug en prod, désérialisation non sûre, buckets S3 ouverts — les fruits à portée de main.",
        skill_secrets_hunter:
          "Identifiants, clés d'API, tokens, clés privées, chaînes à forte entropie. Triage de chaque hit : vif vs test vs révoqué.",
        skill_security_review:
          "Revue de sécurité façon PR sur un diff dans target/, au schéma JSON claude-code-security-review d'Anthropic.",
        skill_semgrep_rule_creator:
          "Écrit une règle Semgrep personnalisée à la volée, la dépose dans rules/semgrep/ et la lance contre target/. Idéal pour l'analyse de variantes ou pour codifier un finding manuel.",
        skill_snyk_sast:
          "Flux SAST à parité Snyk Code : Semgrep avec rulesets sélectionnés plus analyseurs natifs.",
        skill_snyk_sca:
          "Flux SCA à parité Snyk Open Source : osv-scanner, trivy, grype et la CLI Snyk si authentifiée.",
        skill_static_analysis_orchestrator:
          "Pilote la flotte SAST par langage, fusionne les SARIF, déduplique — liste unique triée dans reports/sast-merged.sarif.",
        skill_supply_chain_risk_auditor:
          "Parsing de lockfiles + données OSV / Trivy / Snyk : CVE, typo-squats, mainteneurs malveillants, hooks d'installation, deps en git-URL.",
        skill_untrusted_code_isolation:
          "Garde-fous. Applique la règle zéro-exécution de CLAUDE.md §0 — à invoquer avant toute commande qui pourrait exécuter target/.",
        skill_variant_analysis:
          "À partir d'un finding confirmé, grepe tout l'arbre pour repérer des bugs sémantiquement similaires — une racine commune génère en général plusieurs occurrences.",
        skill_yara_malware_hunter:
          "Scan YARA / YARA-X sur sources et binaires avec rulesets sélectionnés (Yara-Rules community + signature-base de Neo23x0) plus règles spécifiques au projet.",
      },
    },
  },

  de: {
    meta: {
      title: "Coldvault — Prüfen Sie fremden Code, ohne ihn je auszuführen",
      description:
        "Coldvault.dev ist eine Sandbox auf Web3-Niveau von ZONOVA RESEARCH. Prüfen Sie verdächtige Repos mit Claude Code und über 40 Scannern — Ihre Maschine bleibt unberührt.",
      ogTitle: "Coldvault — Kaltlager-Audits für nicht vertrauenswürdigen Code",
      ogDescription:
        "Einsatzbereite Codespace-Sandbox. Nur statische Analyse. Unterstützt von Claude Code & ZONOVA RESEARCH.",
    },
    nav: {
      threat: "Die Bedrohung",
      arsenal: "Arsenal",
      how: "So funktioniert es",
      star: "Auf GitHub sternen",
      language: "Sprache",
      commands: "Befehle",
    },
    hero: {
      badge: "v0 — von ZONOVA RESEARCH",
      title1: "Prüfen Sie den Code.",
      title2: "Führen Sie ihn nie aus.",
      descStart: "Eine einsatzbereite ",
      web3Sandbox: "Sandbox auf Web3-Niveau",
      descMiddle:
        " zur Inspektion verdächtiger Repos. Unterstützt von Claude Code & 40+ Scannern — Ihr Laptop bleibt ",
      descEnd: "außerhalb des Einschlagsradius.",
      cta1: "Den Tresor klonen",
      cta2: "So funktioniert's",
      terminalLabel: "~/coldvault",
    },
    threat: {
      badge: "Warum es Coldvault gibt",
      heading: "„Installier das mal — es ist für das Technik-Interview.“",
      p1Start:
        "Falsche Recruiter nutzen inzwischen Coding-Challenges als Waffe. Sie schicken Ihnen ein Repo und bitten Sie, ",
      p1Middle:
        " auszuführen und ihr Skript zu starten. Hinter der README verbirgt sich ein Credential-Stealer, ein Clipboard-Hijacker oder eine Remote Shell.",
      p1End: "",
      p2Start: "",
      p2Coldvault: "Coldvault",
      p2Middle: " ist die Antwort: eine öffentliche, reproduzierbare Audit-Umgebung, in der ",
      p2Highlight: "niemals ein nicht vertrauenswürdiges Byte ausgeführt wird",
      p2End: ".",
    },
    features: {
      badge: "DAS ARSENAL",
      title1: "40+ Scanner,",
      title2: "eine eiskalte Sandbox",
      items: [
        {
          title: "Führt nie Code aus",
          desc: "Verdächtige Repos werden als schreibgeschütztes Git-Submodul unter target/ eingehängt. 100 % statische Analyse.",
        },
        {
          title: "Codespace-ready",
          desc: "Ein vorbereiteter Debian-Devcontainer mit 40+ Scannern — Audit in unter 60 s gestartet.",
        },
        {
          title: "Claude-Code-Skills",
          desc: "Kuratierte Agenten-Skills, inspiriert von Trail of Bits & Anthropic. Absicht → reproduzierbare Scans.",
        },
        {
          title: "SAST · SCA · Secrets",
          desc: "Semgrep, Trivy, Gitleaks, Syft, ClamAV, Checkov — alle integriert, alle konsolidiert.",
        },
        {
          title: "SARIF- & Markdown-Berichte",
          desc: "Befunde landen in reports/ als strukturierte Daten plus lesbare Management-Zusammenfassung.",
        },
        {
          title: "Gepanzert per Design",
          desc: "Kein Netzwerk-Abfluss aus target/. Luftdichte Analyse hinter Container-Mauern.",
        },
      ],
    },
    how: {
      badge: "ABLAUF",
      title1: "Fünf Schritte zur",
      title2: "kalten Wahrheit",
      stepLabel: "SCHRITT",
      steps: [
        { title: "Tresor klonen", desc: "git clone coldvault.dev — forken, aneignen." },
        { title: "Codespace öffnen", desc: "Der Devcontainer startet mit der vollen Toolchain." },
        {
          title: "Verdächtigen hinzufügen",
          desc: "Das fremde Repo als schreibgeschütztes Submodul einhängen.",
        },
        {
          title: "Claude fragen",
          desc: "Einen Skill ausführen: Malware, Secrets, Supply-Chain, IaC…",
        },
        { title: "Bericht lesen", desc: "Konsolidierte SARIF- & Markdown-Dateien in reports/." },
      ],
    },
    cta: {
      title1: "Hören Sie auf, Code auszuführen,",
      title2: "dem Sie nicht trauen.",
      desc: "Coldvault ist Open Source, MIT-lizenziert und bereit zum Forken. Bringen Sie Ihren Claude-Code-Agenten mit — wir bringen die gepanzerten Wände.",
    },
    footer: {
      tagline: "🧊 COLDVAULT — Ein ZONOVA-RESEARCH-Projekt · MIT",
      github: "GitHub",
      poweredBy: "Unterstützt von Claude Code",
    },
    commandsPage: {
      meta: {
        title: "Coldvault — Referenz für Claude-Befehle und -Skills",
        description:
          "Alle Slash-Befehle und Skills, die mit Coldvault ausgeliefert werden: was jeder tut, wann man ihn aufruft und was er unter reports/ schreibt.",
      },
      nav: { back: "Zurück" },
      hero: {
        badge: "Referenz · v1.0",
        title1: "Claude-Befehle",
        title2: "& Skills",
        subtitle:
          "Alle Slash-Befehle und Skills, die mit Coldvault ausgeliefert werden. Befehle rufen Sie aus der Claude-Code-Eingabe mit vorangestelltem Schrägstrich auf; Skills wählt Claude automatisch aus, wenn ihre Beschreibung zur Aufgabe passt.",
      },
      usage: {
        heading: "Aufruf",
        description:
          "Tippen Sie in einer Claude-Code-Sitzung im Repo-Root einen Schrägstrich gefolgt vom Befehlsnamen. Skills werden automatisch ausgewählt — Sie können einen auch explizit im Prompt nennen (z. B. „nutze den Skill yara-malware-hunter“).",
        hintCommandsDir: "Slash-Befehle liegen in .claude/commands/",
        hintSkillsDir: "Skills liegen in .claude/skills/",
        exampleLabel: "Beispielsitzung",
      },
      commandsSection: {
        badge: "SLASH-BEFEHLE",
        heading: "Slash-Befehle",
        description:
          "Direkt mit /name aufgerufen. Jeder Befehl verbindet einen oder mehrere Skills mit einem Skript unter scripts/ und schreibt strukturierte Ausgaben nach reports/.",
      },
      skillsSection: {
        badge: "SKILLS",
        heading: "Skills",
        description:
          "Claude wählt einen Skill, wenn seine Beschreibung zur Aufgabe passt. Skills sind wiederverwendbare Einheiten, die Coldvault zur Audit-Pipeline komponiert.",
      },
      outputLabel: "Ausgabe",
      cta: {
        title: "Jeder Befehl ist schreibgeschützt auf target/",
        description:
          "Keiner der folgenden Befehle führt jemals Code unter target/ aus. Sie parsen Lockfiles, greppen Quellen, starten Scanner und schreiben Berichte — mehr nicht.",
        button: "Audit-Protokoll lesen",
      },
      descriptions: {
        cmd_audit:
          "Vollständige Audit-Pipeline: Kontext → Secrets → SCA → SAST → Malware → IaC → Payload-Analyse → SUMMARY.md + SUMMARY.html.",
        cmd_defensive_payload_analysis:
          "Forensischer Lesedurchgang: spürt versteckte Payloads in Build-Konfigurationen, obfuskierten Postinstalls und Base64-Blobs auf, die an eval/Function übergeben werden. Schreibt nach forensic/<target>/.",
        cmd_scan_deps:
          "Supply-Chain / SCA: osv-scanner + trivy + grype + sprachspezifische Audits + SBOM. Nur Lockfiles — niemals installieren.",
        cmd_scan_iac:
          "Infrastructure-as-Code-Scan: tfsec, terrascan, checkov, hadolint, dockle, kubesec.",
        cmd_scan_malware:
          "Malware-Triage auf Quellen und Binärdateien: YARA, capa, ClamAV, oletools.",
        cmd_scan_sast:
          "Mehrsprachiges SAST: Semgrep plus bandit/gosec/njsscan/cppcheck/brakeman/psalm und weitere.",
        cmd_scan_secrets:
          "Credential- und Schlüsselsuche: gitleaks + trufflehog + detect-secrets + ggshield. Niemals mit --verification (würde den Anbieter anfunken).",
        cmd_security_review:
          "PR-Modus: Diff HEAD gegen Base in target/, Befunde im Anthropic-security-review-JSON-Schema.",
        skill_agentic_actions_auditor:
          "Prüft CI-Workflows (GitHub Actions, GitLab CI, CircleCI, Azure Pipelines) auf Pwn-Request-Muster, unpinned Actions und Secret-Exfiltration.",
        skill_audit_context_building:
          "Erster Durchgang: inventarisiert Sprachen, Frameworks, Paketmanager und Entry Points. Jeder weitere Skill liest seine Ausgabe.",
        skill_constant_time_analysis:
          "Markiert variable-zeit Vergleiche auf Secrets und Early-Exit-Schleifen — fängt rund 70 % der auf Quellcode-Ebene sichtbaren Timing-Lecks.",
        skill_defensive_payload_analysis:
          "Vierphasige forensische Analyse eines verdächtigen Baums. Extrahiert Angreifersignatur, Payload-Ort und statisch entschlüsselte IoCs (C2-IPs, Ports, XOR-Schlüssel).",
        skill_entry_point_analyzer:
          "Kartiert die Angriffsfläche: HTTP-Routen, CLI-Kommandos, exportierte Symbole, Message-Queues, CI-Trigger, IPC-Sockets.",
        skill_html_report_renderer:
          "Rendert reports/findings.json + SUMMARY.md zu einer einzigen eigenständigen reports/SUMMARY.html — ohne externe Schriften, ohne JS-Framework, ohne Netzwerk.",
        skill_insecure_defaults_hunter:
          "Schwache Krypto, deaktiviertes TLS, permissives CORS, Debug-Modus in Produktion, unsichere Deserialisierung, offene S3-Buckets — die tiefhängenden Früchte.",
        skill_secrets_hunter:
          "Credentials, API-Schlüssel, Tokens, private Schlüssel, hochentropische Strings. Triage jedes Treffers: aktiv vs. Test vs. widerrufen.",
        skill_security_review:
          "PR-artige Sicherheitsprüfung eines Diffs in target/, im Anthropic-claude-code-security-review-JSON-Schema.",
        skill_semgrep_rule_creator:
          "Schreibt eine eigene Semgrep-Regel ad hoc, legt sie in rules/semgrep/ ab und lässt sie gegen target/ laufen. Ideal für Variantenanalyse oder um einen manuellen Befund zu kodifizieren.",
        skill_snyk_sast:
          "SAST-Workflow mit Snyk-Code-Parität: Semgrep mit kuratierten Rulesets plus sprachspezifische Analysatoren.",
        skill_snyk_sca:
          "SCA-Workflow mit Snyk-Open-Source-Parität: osv-scanner, trivy, grype und die Snyk-CLI, falls authentifiziert.",
        skill_static_analysis_orchestrator:
          "Steuert die sprachspezifische SAST-Flotte, merged SARIF, dedupliziert — eine einzige sortierte Liste in reports/sast-merged.sarif.",
        skill_supply_chain_risk_auditor:
          "Lockfile-Parsing + OSV-/Trivy-/Snyk-Daten: CVEs, Typo-Squats, bösartige Maintainer, Install-Time-Hooks, git-URL-Abhängigkeiten.",
        skill_untrusted_code_isolation:
          "Leitplanken. Erzwingt die Zero-Execution-Regel aus CLAUDE.md §0 — vor jedem Befehl aufzurufen, der target/ ausführen könnte.",
        skill_variant_analysis:
          "Greppt ausgehend von einem bestätigten Befund den ganzen Baum nach semantisch ähnlichen Bugs — eine Ursache bringt meist Geschwister hervor.",
        skill_yara_malware_hunter:
          "YARA-/YARA-X-Scan auf Quellen und Binärdateien mit kuratierten Rulesets (Yara-Rules-Community + Neo23x0-signature-base) plus projektspezifischen Regeln.",
      },
    },
  },

  es: {
    meta: {
      title: "Coldvault — Audita código no confiable sin ejecutarlo nunca",
      description:
        "Coldvault.dev es un sandbox de nivel Web3 de ZONOVA RESEARCH. Audita repos sospechosos con Claude Code y más de 40 escáneres — tu máquina permanece intacta.",
      ogTitle: "Coldvault — Auditorías en frío para código no confiable",
      ogDescription:
        "Sandbox Codespace listo para usar. Solo análisis estático. Impulsado por Claude Code y ZONOVA RESEARCH.",
    },
    nav: {
      threat: "La Amenaza",
      arsenal: "Arsenal",
      how: "Cómo funciona",
      star: "Marcar en GitHub",
      language: "Idioma",
      commands: "Comandos",
    },
    hero: {
      badge: "v0 — por ZONOVA RESEARCH",
      title1: "Audita el código.",
      title2: "Nunca lo ejecutes.",
      descStart: "Un ",
      web3Sandbox: "sandbox de nivel Web3",
      descMiddle:
        " listo para usar para inspeccionar repos sospechosos. Impulsado por Claude Code y 40+ escáneres — tu portátil queda ",
      descEnd: "fuera del radio de impacto.",
      cta1: "Clonar la Bóveda",
      cta2: "Ver cómo funciona",
      terminalLabel: "~/coldvault",
    },
    threat: {
      badge: "Por qué existe Coldvault",
      heading: "«Solo instala esto — es para la entrevista técnica.»",
      p1Start:
        "Los reclutadores falsos están armando los desafíos de código. Te envían un repo pidiéndote que hagas ",
      p1Middle:
        " y ejecutes su script. Detrás del README se esconde un ladrón de credenciales, un secuestrador de portapapeles o un shell remoto.",
      p1End: "",
      p2Start: "",
      p2Coldvault: "Coldvault",
      p2Middle: " es la respuesta: un entorno de auditoría público y reproducible donde ",
      p2Highlight: "nunca se ejecuta ni un solo byte no confiable",
      p2End: ".",
    },
    features: {
      badge: "EL ARSENAL",
      title1: "40+ escáneres,",
      title2: "un sandbox helado",
      items: [
        {
          title: "Nunca ejecuta código",
          desc: "Los repos sospechosos se montan como submódulo git de solo lectura en target/. 100 % análisis estático.",
        },
        {
          title: "Listo para Codespace",
          desc: "Un devcontainer Debian preconfigurado con 40+ escáneres — lanza una auditoría en menos de 60s.",
        },
        {
          title: "Skills de Claude Code",
          desc: "Skills de agente curados, inspirados en Trail of Bits y Anthropic. Intención → escaneos reproducibles.",
        },
        {
          title: "SAST · SCA · Secretos",
          desc: "Semgrep, Trivy, Gitleaks, Syft, ClamAV, Checkov — todos conectados, todos consolidados.",
        },
        {
          title: "Informes SARIF + Markdown",
          desc: "Los hallazgos aterrizan en reports/ como datos estructurados más un resumen ejecutivo legible.",
        },
        {
          title: "Blindado por diseño",
          desc: "Cero salida de red desde target/. Análisis aislado detrás de los muros del contenedor.",
        },
      ],
    },
    how: {
      badge: "FLUJO DE TRABAJO",
      title1: "Cinco pasos hacia",
      title2: "la verdad helada",
      stepLabel: "PASO",
      steps: [
        { title: "Clonar la bóveda", desc: "git clone coldvault.dev — forkéala, hazla tuya." },
        {
          title: "Abrir Codespace",
          desc: "El devcontainer arranca con toda la cadena de herramientas.",
        },
        {
          title: "Añadir el sospechoso",
          desc: "Monta el repo no confiable como submódulo de solo lectura.",
        },
        {
          title: "Pregunta a Claude",
          desc: "Ejecuta un skill: malware, secretos, cadena de suministro, IaC…",
        },
        { title: "Leer el informe", desc: "SARIF + Markdown consolidados en reports/." },
      ],
    },
    cta: {
      title1: "Deja de ejecutar código",
      title2: "en el que no confías.",
      desc: "Coldvault es open-source, con licencia MIT y listo para forkear. Trae tu propio agente Claude Code — nosotros ponemos los muros blindados.",
    },
    footer: {
      tagline: "🧊 COLDVAULT — Un proyecto de ZONOVA RESEARCH · MIT",
      github: "GitHub",
      poweredBy: "Impulsado por Claude Code",
    },
    commandsPage: {
      meta: {
        title: "Coldvault — Referencia de comandos y skills de Claude",
        description:
          "Cada comando slash y skill que acompaña a Coldvault: qué hace cada uno, cuándo invocarlo y qué escribe en reports/.",
      },
      nav: { back: "Volver" },
      hero: {
        badge: "Referencia · v1.0",
        title1: "Comandos de Claude",
        title2: "y skills",
        subtitle:
          "Cada comando slash y skill que acompaña a Coldvault. Los comandos se invocan desde el prompt de Claude Code con una barra delante; Claude selecciona los skills automáticamente cuando su descripción encaja con la tarea.",
      },
      usage: {
        heading: "Cómo invocarlos",
        description:
          "En una sesión de Claude Code desde la raíz del repo, escribe una barra seguida del nombre del comando. Los skills se eligen automáticamente — también puedes nombrar uno de forma explícita en el prompt (p. ej. «usa el skill yara-malware-hunter»).",
        hintCommandsDir: "Los comandos slash viven en .claude/commands/",
        hintSkillsDir: "Los skills viven en .claude/skills/",
        exampleLabel: "Sesión de ejemplo",
      },
      commandsSection: {
        badge: "COMANDOS SLASH",
        heading: "Comandos slash",
        description:
          "Se invocan con /nombre. Cada comando conecta uno o varios skills a un script bajo scripts/ y escribe una salida estructurada en reports/.",
      },
      skillsSection: {
        badge: "SKILLS",
        heading: "Skills",
        description:
          "Claude elige un skill cuando su descripción encaja con la tarea. Los skills son unidades reutilizables que Coldvault compone en la pipeline de auditoría.",
      },
      outputLabel: "Salida",
      cta: {
        title: "Todos los comandos son de solo lectura sobre target/",
        description:
          "Ninguno de los comandos siguientes ejecuta jamás código bajo target/. Parsean lockfiles, grepean fuentes, lanzan escáneres y escriben informes — nada más.",
        button: "Leer el protocolo de auditoría",
      },
      descriptions: {
        cmd_audit:
          "Pipeline completa de auditoría: contexto → secretos → SCA → SAST → malware → IaC → análisis de payload → SUMMARY.md + SUMMARY.html.",
        cmd_defensive_payload_analysis:
          "Pasada forense de solo lectura: caza payloads ocultos en configuraciones de build, postinstall ofuscados y blobs base64 enviados a eval/Function. Escribe en forensic/<target>/.",
        cmd_scan_deps:
          "Cadena de suministro / SCA: osv-scanner + trivy + grype + auditorías nativas + SBOM. Solo lockfiles — nunca instala.",
        cmd_scan_iac:
          "Escaneo de infraestructura-como-código: tfsec, terrascan, checkov, hadolint, dockle, kubesec.",
        cmd_scan_malware:
          "Triaje de malware en fuentes y binarios: YARA, capa, ClamAV, oletools.",
        cmd_scan_sast:
          "SAST multilenguaje: Semgrep más bandit/gosec/njsscan/cppcheck/brakeman/psalm y otros.",
        cmd_scan_secrets:
          "Descubrimiento de credenciales y claves: gitleaks + trufflehog + detect-secrets + ggshield. Nunca se ejecuta con --verification (avisaría al proveedor).",
        cmd_security_review:
          "Modo PR: diff HEAD contra base dentro de target/, hallazgos en el esquema JSON security-review de Anthropic.",
        skill_agentic_actions_auditor:
          "Audita flujos de CI (GitHub Actions, GitLab CI, CircleCI, Azure Pipelines) en busca de patrones pwn-request, acciones sin fijar y exfiltración de secretos.",
        skill_audit_context_building:
          "Primera pasada: inventaría lenguajes, frameworks, gestores de paquetes y puntos de entrada. Todos los demás skills leen su salida.",
        skill_constant_time_analysis:
          "Marca comparaciones de tiempo variable sobre secretos y bucles con salida anticipada — atrapa ~70 % de las fugas de tiempo visibles en el código.",
        skill_defensive_payload_analysis:
          "Análisis forense en cuatro fases de un árbol sospechoso. Extrae la firma del atacante, la ubicación del payload y los IoC desencriptados estáticamente (IPs C2, puertos, claves XOR).",
        skill_entry_point_analyzer:
          "Mapea la superficie de ataque: rutas HTTP, comandos CLI, símbolos exportados, colas de mensajes, triggers de CI, sockets IPC.",
        skill_html_report_renderer:
          "Renderiza reports/findings.json + SUMMARY.md en un único reports/SUMMARY.html autocontenido — sin fuentes externas, sin framework JS, sin red.",
        skill_insecure_defaults_hunter:
          "Criptografía débil, TLS deshabilitado, CORS permisivo, modo debug en producción, deserialización insegura, buckets S3 abiertos — la fruta madura.",
        skill_secrets_hunter:
          "Credenciales, claves de API, tokens, claves privadas, cadenas de alta entropía. Triaje de cada hallazgo: vivo vs. test vs. revocado.",
        skill_security_review:
          "Revisión de seguridad estilo PR sobre un diff dentro de target/, usando el esquema JSON claude-code-security-review de Anthropic.",
        skill_semgrep_rule_creator:
          "Escribe una regla Semgrep personalizada al vuelo, la deja en rules/semgrep/ y la ejecuta sobre target/. Ideal para análisis de variantes o para codificar un hallazgo manual.",
        skill_snyk_sast:
          "Flujo SAST con paridad Snyk Code: Semgrep con rulesets curados más analizadores nativos.",
        skill_snyk_sca:
          "Flujo SCA con paridad Snyk Open Source: osv-scanner, trivy, grype y la CLI de Snyk si está autenticada.",
        skill_static_analysis_orchestrator:
          "Dirige la flota SAST por lenguaje, fusiona SARIF, deduplica — una única lista ordenada en reports/sast-merged.sarif.",
        skill_supply_chain_risk_auditor:
          "Parseo de lockfiles + datos OSV / Trivy / Snyk: CVEs, typo-squats, mantenedores maliciosos, hooks de instalación, deps por git-URL.",
        skill_untrusted_code_isolation:
          "Barandillas de seguridad. Aplica la regla de cero ejecución de CLAUDE.md §0 — invócalo antes de cualquier comando que pudiera ejecutar target/.",
        skill_variant_analysis:
          "Dado un hallazgo confirmado, grepea todo el árbol buscando bugs semánticamente parecidos — una causa raíz suele parir varios hermanos.",
        skill_yara_malware_hunter:
          "Escaneo YARA / YARA-X en fuentes y binarios con rulesets curados (Yara-Rules community + signature-base de Neo23x0) más reglas específicas del proyecto.",
      },
    },
  },

  zh: {
    meta: {
      title: "Coldvault — 审计不可信代码，永不运行",
      description:
        "Coldvault.dev 是 ZONOVA RESEARCH 打造的 Web3 级沙盒。用 Claude Code 和 40+ 扫描器审计可疑代码库 — 你的机器丝毫不受影响。",
      ogTitle: "Coldvault — 针对不可信代码的冷存储审计",
      ogDescription: "即用型 Codespace 沙盒。仅静态分析。由 Claude Code 与 ZONOVA RESEARCH 驱动。",
    },
    nav: {
      threat: "威胁",
      arsenal: "武器库",
      how: "工作原理",
      star: "在 GitHub 点星",
      language: "语言",
      commands: "命令",
    },
    hero: {
      badge: "v0 — 由 ZONOVA RESEARCH 出品",
      title1: "审计代码。",
      title2: "永不运行它。",
      descStart: "一个即用型 ",
      web3Sandbox: "Web3 级沙盒",
      descMiddle: "，用来检查可疑代码库。由 Claude Code 与 40+ 扫描器驱动 — 你的笔记本",
      descEnd: "始终置身于爆炸半径之外。",
      cta1: "克隆金库",
      cta2: "查看工作原理",
      terminalLabel: "~/coldvault",
    },
    threat: {
      badge: "为何需要 Coldvault",
      heading: "「装一下这个吧 — 这是技术面试要用的。」",
      p1Start: "假招聘者如今把编程挑战武器化。他们发给你一个仓库，要求你执行 ",
      p1Middle: "，并运行他们的脚本。README 背后隐藏的是凭证窃取器、剪贴板劫持器或远程 shell。",
      p1End: "",
      p2Start: "",
      p2Coldvault: "Coldvault",
      p2Middle: " 就是答案：一个公开、可复现的审计环境，在其中 ",
      p2Highlight: "永远不会执行任何不可信字节",
      p2End: "。",
    },
    features: {
      badge: "武器库",
      title1: "40+ 扫描器，",
      title2: "一个冰封沙盒",
      items: [
        {
          title: "绝不执行代码",
          desc: "可疑仓库以只读 git 子模块形式挂载到 target/ 下。100% 静态分析。",
        },
        {
          title: "Codespace 就绪",
          desc: "预装 40+ 扫描器的 Debian devcontainer — 60 秒内启动一次审计。",
        },
        {
          title: "Claude Code 技能",
          desc: "借鉴 Trail of Bits 与 Anthropic 的精选 agent skills。意图 → 可复现扫描。",
        },
        {
          title: "SAST · SCA · 密钥",
          desc: "Semgrep、Trivy、Gitleaks、Syft、ClamAV、Checkov — 全部接入，全部汇总。",
        },
        {
          title: "SARIF + Markdown 报告",
          desc: "结果以结构化数据与人类可读的执行摘要一并输出到 reports/。",
        },
        {
          title: "天生装甲",
          desc: "target/ 零网络出站。容器壁后的完全气隙分析。",
        },
      ],
    },
    how: {
      badge: "工作流",
      title1: "五步通往",
      title2: "冰冷真相",
      stepLabel: "步骤",
      steps: [
        { title: "克隆金库", desc: "git clone coldvault.dev — fork 它，拥有它。" },
        { title: "打开 Codespace", desc: "Devcontainer 启动，工具链一应俱全。" },
        { title: "加入嫌疑仓库", desc: "将不可信仓库作为只读子模块挂载。" },
        { title: "询问 Claude", desc: "运行某个技能：恶意软件、密钥、供应链、IaC…" },
        { title: "阅读报告", desc: "合并的 SARIF + Markdown 报告位于 reports/。" },
      ],
    },
    cta: {
      title1: "别再运行",
      title2: "你不信任的代码。",
      desc: "Coldvault 开源、采用 MIT 许可证、可直接 fork。带上你自己的 Claude Code agent — 我们提供装甲墙。",
    },
    footer: {
      tagline: "🧊 COLDVAULT — ZONOVA RESEARCH 项目 · MIT",
      github: "GitHub",
      poweredBy: "由 Claude Code 驱动",
    },
    commandsPage: {
      meta: {
        title: "Coldvault — Claude 命令与技能参考",
        description:
          "Coldvault 附带的每一个斜杠命令与技能：各自的功能、何时调用、以及写入 reports/ 的内容。",
      },
      nav: { back: "返回" },
      hero: {
        badge: "参考 · v1.0",
        title1: "Claude 命令",
        title2: "与技能",
        subtitle:
          "Coldvault 附带的每一个斜杠命令与技能。命令从 Claude Code 提示符以斜杠开头调用；技能由 Claude 根据描述与任务的匹配自动选择。",
      },
      usage: {
        heading: "如何调用",
        description:
          "在仓库根目录的 Claude Code 会话中，输入斜杠加命令名。技能会自动选中 — 也可以在提示中显式指定（例如「使用 yara-malware-hunter 技能」）。",
        hintCommandsDir: "斜杠命令位于 .claude/commands/",
        hintSkillsDir: "技能位于 .claude/skills/",
        exampleLabel: "会话示例",
      },
      commandsSection: {
        badge: "斜杠命令",
        heading: "斜杠命令",
        description:
          "以 /名称 直接调用。每个命令将一个或多个技能对接到 scripts/ 下的脚本，并将结构化输出写入 reports/。",
      },
      skillsSection: {
        badge: "技能",
        heading: "技能",
        description:
          "当技能描述与任务匹配时，Claude 会自动选中。技能是 Coldvault 组装进审计流水线的可复用单元。",
      },
      outputLabel: "输出",
      cta: {
        title: "每个命令对 target/ 都是只读",
        description:
          "以下命令绝不执行 target/ 下的代码。它们解析 lockfile、grep 源码、调用扫描器、写报告 — 仅此而已。",
        button: "阅读审计协议",
      },
      descriptions: {
        cmd_audit:
          "完整审计流水线：上下文 → 密钥 → SCA → SAST → 恶意软件 → IaC → 载荷分析 → SUMMARY.md + SUMMARY.html。",
        cmd_defensive_payload_analysis:
          "只读取证扫描：追捕构建配置、混淆的 postinstall，以及喂给 eval/Function 的 base64 二进制块中的隐藏载荷。写入 forensic/<target>/。",
        cmd_scan_deps:
          "供应链 / SCA：osv-scanner + trivy + grype + 语言原生审计 + SBOM。仅解析 lockfile — 从不安装。",
        cmd_scan_iac:
          "基础设施即代码扫描：tfsec、terrascan、checkov、hadolint、dockle、kubesec。",
        cmd_scan_malware:
          "源代码与二进制的恶意软件分诊：YARA、capa、ClamAV、oletools。",
        cmd_scan_sast:
          "多语言 SAST：Semgrep 加上 bandit/gosec/njsscan/cppcheck/brakeman/psalm 等。",
        cmd_scan_secrets:
          "凭据与密钥发现：gitleaks + trufflehog + detect-secrets + ggshield。绝不带 --verification 运行（会向提供商发送信标）。",
        cmd_security_review:
          "PR 模式：对 target/ 内 HEAD 与基线的 diff 进行审查，按 Anthropic security-review JSON schema 输出。",
        skill_agentic_actions_auditor:
          "审计 CI 工作流（GitHub Actions、GitLab CI、CircleCI、Azure Pipelines），查找 pwn-request 模式、未固定的 action 与密钥外泄。",
        skill_audit_context_building:
          "首次扫描：清点语言、框架、包管理器与入口点。其他所有技能都读取它的输出。",
        skill_constant_time_analysis:
          "标记对密钥的变时比较与提前退出循环 — 捕获源码层可见的约 70% 时序泄漏。",
        skill_defensive_payload_analysis:
          "对可疑代码树进行四阶段取证分析。提取攻击者签名、载荷位置与静态解密的 IoC（C2 IP、端口、XOR 密钥）。",
        skill_entry_point_analyzer:
          "映射攻击面：HTTP 路由、CLI 命令、导出符号、消息队列、CI 触发器、IPC 套接字。",
        skill_html_report_renderer:
          "把 reports/findings.json + SUMMARY.md 渲染为单个自包含的 reports/SUMMARY.html — 无外部字体、无 JS 框架、无网络。",
        skill_insecure_defaults_hunter:
          "弱加密、TLS 关闭、宽松 CORS、生产调试模式、不安全反序列化、公开 S3 桶 — 最容易摘到的果子。",
        skill_secrets_hunter:
          "凭据、API key、token、私钥、高熵字符串。对每条命中做分诊：生效 vs 测试 vs 已吊销。",
        skill_security_review:
          "对 target/ 内 diff 执行 PR 风格的安全审查，使用 Anthropic claude-code-security-review JSON schema。",
        skill_semgrep_rule_creator:
          "即时编写自定义 Semgrep 规则，保存到 rules/semgrep/ 并对 target/ 运行。适合变体分析或把人工发现固化为规则。",
        skill_snyk_sast:
          "对标 Snyk Code 的 SAST 流程：Semgrep 搭配精选规则集，加上语言原生分析器。",
        skill_snyk_sca:
          "对标 Snyk Open Source 的 SCA 流程：osv-scanner、trivy、grype，以及已登录时的 Snyk CLI。",
        skill_static_analysis_orchestrator:
          "驱动按语言的 SAST 工具队，合并 SARIF、去重 — 产出 reports/sast-merged.sarif 中的唯一排序列表。",
        skill_supply_chain_risk_auditor:
          "Lockfile 解析 + OSV / Trivy / Snyk 数据：CVE、typo-squat、恶意维护者、安装期钩子、git-URL 依赖。",
        skill_untrusted_code_isolation:
          "安全护栏。执行 CLAUDE.md §0 的零执行规则 — 任何可能执行 target/ 的命令之前都应调用。",
        skill_variant_analysis:
          "面对已确认的发现，在整棵代码树中 grep 语义相似的缺陷 — 一个根因常常派生多个同胞。",
        skill_yara_malware_hunter:
          "使用精选规则集（Yara-Rules community + Neo23x0 signature-base）加项目规则，对源码与二进制执行 YARA / YARA-X 扫描。",
      },
    },
  },

  ja: {
    meta: {
      title: "Coldvault — 信頼できないコードを、実行せずに監査",
      description:
        "Coldvault.dev は ZONOVA RESEARCH による Web3 級サンドボックス。Claude Code と 40+ のスキャナで不審なリポジトリを監査 — あなたのマシンは無傷のまま。",
      ogTitle: "Coldvault — 信頼できないコードのコールドストレージ監査",
      ogDescription:
        "すぐ使える Codespace サンドボックス。静的解析のみ。Claude Code と ZONOVA RESEARCH による。",
    },
    nav: {
      threat: "脅威",
      arsenal: "武器庫",
      how: "仕組み",
      star: "GitHub でスター",
      language: "言語",
      commands: "コマンド",
    },
    hero: {
      badge: "v0 — ZONOVA RESEARCH 提供",
      title1: "コードを監査。",
      title2: "決して実行しない。",
      descStart: "すぐ使える ",
      web3Sandbox: "Web3 級サンドボックス",
      descMiddle:
        "。不審なリポジトリを検査するために。Claude Code と 40+ のスキャナで動作 — あなたのノート PC は",
      descEnd: "爆発範囲の外に凍結されます。",
      cta1: "ヴォルトをクローン",
      cta2: "仕組みを見る",
      terminalLabel: "~/coldvault",
    },
    threat: {
      badge: "Coldvault が存在する理由",
      heading: "「これ入れておいて — 技術面接用だよ。」",
      p1Start: "偽リクルーターはコーディング課題を武器化しています。リポジトリを送り、あなたに ",
      p1Middle:
        " を実行させ、彼らのスクリプトを走らせます。README の裏には、資格情報スティーラー、クリップボードハイジャッカー、リモートシェルが潜んでいます。",
      p1End: "",
      p2Start: "",
      p2Coldvault: "Coldvault",
      p2Middle: " はその答え。公開・再現可能な監査環境で、",
      p2Highlight: "信頼できないバイトは決して実行されません",
      p2End: "。",
    },
    features: {
      badge: "武器庫",
      title1: "40+ スキャナ、",
      title2: "ひとつの冷凍サンドボックス",
      items: [
        {
          title: "コードを実行しない",
          desc: "不審リポジトリは target/ 配下に読み取り専用の git サブモジュールとしてマウント。100% 静的解析。",
        },
        {
          title: "Codespace 対応",
          desc: "40+ スキャナ入りの Debian devcontainer を事前構築 — 60 秒以内に監査を開始。",
        },
        {
          title: "Claude Code スキル",
          desc: "Trail of Bits と Anthropic に着想を得たキュレーション済み agent skills。意図 → 再現可能なスキャン。",
        },
        {
          title: "SAST · SCA · シークレット",
          desc: "Semgrep、Trivy、Gitleaks、Syft、ClamAV、Checkov — すべて統合、すべて集約。",
        },
        {
          title: "SARIF + Markdown レポート",
          desc: "結果は構造化データと読みやすいエグゼクティブサマリーとして reports/ に出力。",
        },
        {
          title: "設計からして装甲",
          desc: "target/ からのネットワーク送信はゼロ。コンテナ壁の内側でエアギャップ解析。",
        },
      ],
    },
    how: {
      badge: "ワークフロー",
      title1: "5 ステップで至る",
      title2: "冷たい真実",
      stepLabel: "ステップ",
      steps: [
        {
          title: "ヴォルトをクローン",
          desc: "git clone coldvault.dev — fork して、自分のものに。",
        },
        { title: "Codespace を開く", desc: "devcontainer がフルツールチェーンで起動。" },
        {
          title: "容疑者を追加",
          desc: "不審なリポジトリを読み取り専用サブモジュールとしてマウント。",
        },
        {
          title: "Claude に尋ねる",
          desc: "スキルを実行:マルウェア、シークレット、サプライチェーン、IaC…",
        },
        { title: "レポートを読む", desc: "統合された SARIF + Markdown を reports/ で確認。" },
      ],
    },
    cta: {
      title1: "信頼できないコードを",
      title2: "実行するのはやめよう。",
      desc: "Coldvault はオープンソース、MIT ライセンス、いますぐ fork できます。あなたの Claude Code エージェントを持ち込んでください — 装甲壁は私たちが用意します。",
    },
    footer: {
      tagline: "🧊 COLDVAULT — ZONOVA RESEARCH プロジェクト · MIT",
      github: "GitHub",
      poweredBy: "Claude Code によって駆動",
    },
    commandsPage: {
      meta: {
        title: "Coldvault — Claude コマンド & スキル リファレンス",
        description:
          "Coldvault に同梱されるすべてのスラッシュコマンドとスキル:それぞれの役割、呼び出しのタイミング、reports/ への出力内容。",
      },
      nav: { back: "戻る" },
      hero: {
        badge: "リファレンス · v1.0",
        title1: "Claude コマンド",
        title2: "とスキル",
        subtitle:
          "Coldvault に同梱されるすべてのスラッシュコマンドとスキル。コマンドは Claude Code のプロンプトで先頭スラッシュ付きで呼び出します。スキルは説明文がタスクに合致すると Claude が自動で選択します。",
      },
      usage: {
        heading: "呼び出し方",
        description:
          "リポジトリのルートで開いた Claude Code セッションで、スラッシュに続けてコマンド名を入力します。スキルは自動で選ばれますが、プロンプト内で明示的に指名することもできます(例:「yara-malware-hunter スキルを使って」)。",
        hintCommandsDir: "スラッシュコマンドは .claude/commands/ にあります",
        hintSkillsDir: "スキルは .claude/skills/ にあります",
        exampleLabel: "セッション例",
      },
      commandsSection: {
        badge: "スラッシュコマンド",
        heading: "スラッシュコマンド",
        description:
          "/名前 で直接呼び出します。各コマンドは 1 つ以上のスキルを scripts/ 配下のスクリプトに接続し、構造化した出力を reports/ に書き出します。",
      },
      skillsSection: {
        badge: "スキル",
        heading: "スキル",
        description:
          "Claude は説明文とタスクが一致するスキルを選びます。スキルは Coldvault が監査パイプラインに組み合わせる再利用可能な単位です。",
      },
      outputLabel: "出力",
      cta: {
        title: "どのコマンドも target/ に対して読み取り専用",
        description:
          "以下のコマンドは target/ 配下のコードを実行しません。ロックファイルの解析、ソースの grep、スキャナの起動、レポートの書き出し — それだけです。",
        button: "監査プロトコルを読む",
      },
      descriptions: {
        cmd_audit:
          "監査フルパイプライン:コンテキスト → シークレット → SCA → SAST → マルウェア → IaC → ペイロード解析 → SUMMARY.md + SUMMARY.html。",
        cmd_defensive_payload_analysis:
          "読み取り専用のフォレンジックパス:ビルド構成、難読化された postinstall、eval/Function に渡される base64 ブロブに潜む隠しペイロードを追跡。forensic/<target>/ に書き出します。",
        cmd_scan_deps:
          "サプライチェーン / SCA:osv-scanner + trivy + grype + 言語ネイティブ監査 + SBOM。ロックファイルのみ — インストールはしません。",
        cmd_scan_iac:
          "IaC スキャン:tfsec、terrascan、checkov、hadolint、dockle、kubesec。",
        cmd_scan_malware:
          "ソースとバイナリのマルウェアトリアージ:YARA、capa、ClamAV、oletools。",
        cmd_scan_sast:
          "多言語 SAST:Semgrep に加えて bandit/gosec/njsscan/cppcheck/brakeman/psalm など。",
        cmd_scan_secrets:
          "認証情報とキーの発見:gitleaks + trufflehog + detect-secrets + ggshield。--verification なしで実行します(付けるとプロバイダにビーコンを送る)。",
        cmd_security_review:
          "PR モード:target/ 内で HEAD とベースの diff をレビューし、Anthropic security-review JSON schema で出力。",
        skill_agentic_actions_auditor:
          "CI ワークフロー(GitHub Actions、GitLab CI、CircleCI、Azure Pipelines)を監査し、pwn-request パターン、ピン留めされていないアクション、シークレット流出を検出。",
        skill_audit_context_building:
          "最初のパス:言語、フレームワーク、パッケージマネージャ、エントリポイントを棚卸し。ほかのすべてのスキルがその出力を読みます。",
        skill_constant_time_analysis:
          "シークレットに対する可変時間比較と早期 return ループを検出 — ソース段階で見える約 70% のタイミングリークを捕捉。",
        skill_defensive_payload_analysis:
          "不審なツリーの 4 フェーズ フォレンジック解析。攻撃者のシグネチャ、ペイロードの所在、静的復号した IoC(C2 IP、ポート、XOR 鍵)を抽出。",
        skill_entry_point_analyzer:
          "攻撃面をマッピング:HTTP ルート、CLI コマンド、エクスポート済みシンボル、メッセージキュー、CI トリガ、IPC ソケット。",
        skill_html_report_renderer:
          "reports/findings.json + SUMMARY.md を、単一で自己完結する reports/SUMMARY.html にレンダリング — 外部フォント無し、JS フレームワーク無し、ネットワーク無し。",
        skill_insecure_defaults_hunter:
          "弱い暗号、TLS 無効、緩い CORS、本番のデバッグモード、危険な逆シリアライズ、公開 S3 バケット — 手の届きやすい果実。",
        skill_secrets_hunter:
          "認証情報、API キー、トークン、秘密鍵、高エントロピー文字列。各ヒットを有効 / テスト / 失効でトリアージ。",
        skill_security_review:
          "target/ 内の diff を PR スタイルでセキュリティレビューし、Anthropic claude-code-security-review の JSON schema で出力。",
        skill_semgrep_rule_creator:
          "カスタム Semgrep ルールをその場で作成して rules/semgrep/ に置き、target/ に対して実行。バリアント分析や手動の発見をルール化するのに最適。",
        skill_snyk_sast:
          "Snyk Code と同等の SAST ワークフロー:キュレーション済みルールセットの Semgrep に言語ネイティブ解析器を組み合わせ。",
        skill_snyk_sca:
          "Snyk Open Source と同等の SCA ワークフロー:osv-scanner、trivy、grype、認証済みなら Snyk CLI。",
        skill_static_analysis_orchestrator:
          "言語別 SAST 群を取り回し、SARIF をマージ、重複を排除 — reports/sast-merged.sarif に単一のランキング付きリストを生成。",
        skill_supply_chain_risk_auditor:
          "ロックファイル解析 + OSV / Trivy / Snyk データ:CVE、タイポスクワット、悪意のあるメンテナ、インストール時フック、git-URL 依存。",
        skill_untrusted_code_isolation:
          "セーフティレール。CLAUDE.md §0 のゼロ実行ルールを強制 — target/ を実行し得るコマンドの前に必ず呼び出します。",
        skill_variant_analysis:
          "確定済みの発見を起点にツリー全体を grep し、意味的に類似するバグを探します — 一つの根本原因は複数の兄弟を生みがち。",
        skill_yara_malware_hunter:
          "キュレーション済みルールセット(Yara-Rules community + Neo23x0 signature-base)とプロジェクト固有ルールで、ソースとバイナリに対して YARA / YARA-X を走らせます。",
      },
    },
  },

  ko: {
    meta: {
      title: "Coldvault — 실행하지 않고 신뢰할 수 없는 코드를 감사하세요",
      description:
        "Coldvault.dev는 ZONOVA RESEARCH가 만든 Web3급 샌드박스입니다. Claude Code와 40개 이상의 스캐너로 의심스러운 저장소를 감사하세요 — 당신의 기기는 전혀 건드리지 않습니다.",
      ogTitle: "Coldvault — 신뢰할 수 없는 코드를 위한 콜드 스토리지 감사",
      ogDescription:
        "바로 쓰는 Codespace 샌드박스. 정적 분석 전용. Claude Code와 ZONOVA RESEARCH가 제공.",
    },
    nav: {
      threat: "위협",
      arsenal: "무기고",
      how: "작동 방식",
      star: "GitHub에서 별 누르기",
      language: "언어",
      commands: "명령어",
    },
    hero: {
      badge: "v0 — ZONOVA RESEARCH 제공",
      title1: "코드를 감사하세요.",
      title2: "절대 실행하지 마세요.",
      descStart: "바로 쓸 수 있는 ",
      web3Sandbox: "Web3급 샌드박스",
      descMiddle:
        "로 의심스러운 저장소를 점검합니다. Claude Code와 40개 이상의 스캐너로 구동 — 당신의 노트북은 ",
      descEnd: "폭발 반경 밖에 안전하게 얼어붙어 있습니다.",
      cta1: "금고 복제",
      cta2: "작동 방식 보기",
      terminalLabel: "~/coldvault",
    },
    threat: {
      badge: "Coldvault가 존재하는 이유",
      heading: '"이것만 설치해 주세요 — 기술 면접용이에요."',
      p1Start: "가짜 리크루터들이 코딩 과제를 무기화하고 있습니다. 그들은 저장소를 보내 당신에게 ",
      p1Middle:
        " 를 실행하고 자신들의 스크립트를 돌리라고 요구합니다. README 뒤에는 자격 증명 탈취기, 클립보드 하이재커, 또는 원격 셸이 숨어 있습니다.",
      p1End: "",
      p2Start: "",
      p2Coldvault: "Coldvault",
      p2Middle: "는 그 답입니다. 공개적이고 재현 가능한 감사 환경이며, 여기에서는 ",
      p2Highlight: "신뢰할 수 없는 바이트가 결코 실행되지 않습니다",
      p2End: ".",
    },
    features: {
      badge: "무기고",
      title1: "40개 이상의 스캐너,",
      title2: "하나의 얼음 샌드박스",
      items: [
        {
          title: "코드를 실행하지 않습니다",
          desc: "의심스러운 저장소는 target/ 아래에 읽기 전용 git 서브모듈로 마운트됩니다. 100% 정적 분석.",
        },
        {
          title: "Codespace 지원",
          desc: "40+ 스캐너가 사전 설치된 Debian devcontainer — 60초 이내에 감사 시작.",
        },
        {
          title: "Claude Code 스킬",
          desc: "Trail of Bits와 Anthropic에서 영감을 받은 선별된 에이전트 스킬. 의도 → 재현 가능한 스캔.",
        },
        {
          title: "SAST · SCA · 시크릿",
          desc: "Semgrep, Trivy, Gitleaks, Syft, ClamAV, Checkov — 모두 연결되고, 모두 통합됨.",
        },
        {
          title: "SARIF + 마크다운 보고서",
          desc: "결과는 구조화된 데이터와 사람이 읽기 쉬운 요약으로 reports/에 저장됩니다.",
        },
        {
          title: "설계부터 장갑",
          desc: "target/에서 네트워크 송신 없음. 컨테이너 벽 뒤의 에어갭 분석.",
        },
      ],
    },
    how: {
      badge: "워크플로우",
      title1: "다섯 단계로 도달하는",
      title2: "차가운 진실",
      stepLabel: "단계",
      steps: [
        { title: "금고 복제", desc: "git clone coldvault.dev — 포크하고, 내 것으로." },
        { title: "Codespace 열기", desc: "Devcontainer가 전체 툴체인과 함께 부팅됩니다." },
        {
          title: "용의자 추가",
          desc: "신뢰할 수 없는 저장소를 읽기 전용 서브모듈로 마운트하세요.",
        },
        { title: "Claude에게 요청", desc: "스킬 실행: 악성코드, 시크릿, 공급망, IaC…" },
        { title: "보고서 읽기", desc: "통합된 SARIF + 마크다운이 reports/에 있습니다." },
      ],
    },
    cta: {
      title1: "신뢰할 수 없는 코드 실행을",
      title2: "이제 그만.",
      desc: "Coldvault는 오픈소스이며 MIT 라이선스로 바로 포크할 수 있습니다. 당신의 Claude Code 에이전트를 가져오세요 — 장갑 벽은 저희가 준비합니다.",
    },
    footer: {
      tagline: "🧊 COLDVAULT — ZONOVA RESEARCH 프로젝트 · MIT",
      github: "GitHub",
      poweredBy: "Claude Code 기반",
    },
    commandsPage: {
      meta: {
        title: "Coldvault — Claude 명령어 및 스킬 레퍼런스",
        description:
          "Coldvault에 포함된 모든 슬래시 명령어와 스킬: 각 항목의 역할, 호출 시점, 그리고 reports/에 기록하는 내용.",
      },
      nav: { back: "뒤로" },
      hero: {
        badge: "레퍼런스 · v1.0",
        title1: "Claude 명령어",
        title2: "와 스킬",
        subtitle:
          "Coldvault에 포함된 모든 슬래시 명령어와 스킬입니다. 명령어는 Claude Code 프롬프트에서 앞에 슬래시를 붙여 호출하며, 스킬은 설명이 작업과 일치할 때 Claude가 자동으로 선택합니다.",
      },
      usage: {
        heading: "호출 방법",
        description:
          "저장소 루트에서 열린 Claude Code 세션에 슬래시와 명령어 이름을 입력하세요. 스킬은 자동으로 선택되지만, 프롬프트에서 직접 지정할 수도 있습니다(예: 'yara-malware-hunter 스킬을 써 줘').",
        hintCommandsDir: "슬래시 명령어는 .claude/commands/에 있습니다",
        hintSkillsDir: "스킬은 .claude/skills/에 있습니다",
        exampleLabel: "세션 예시",
      },
      commandsSection: {
        badge: "슬래시 명령어",
        heading: "슬래시 명령어",
        description:
          "/이름 으로 바로 호출합니다. 각 명령어는 한 개 이상의 스킬을 scripts/ 아래 스크립트에 연결하고 구조화된 출력을 reports/에 기록합니다.",
      },
      skillsSection: {
        badge: "스킬",
        heading: "스킬",
        description:
          "Claude는 설명이 작업과 일치하는 스킬을 고릅니다. 스킬은 Coldvault가 감사 파이프라인에 조합하는 재사용 가능한 단위입니다.",
      },
      outputLabel: "출력",
      cta: {
        title: "모든 명령은 target/에 대해 읽기 전용",
        description:
          "아래 명령 중 어떤 것도 target/ 아래 코드를 실행하지 않습니다. 락파일을 파싱하고, 소스를 grep 하고, 스캐너를 호출하고, 보고서를 작성할 뿐입니다.",
        button: "감사 프로토콜 읽기",
      },
      descriptions: {
        cmd_audit:
          "전체 감사 파이프라인: 컨텍스트 → 시크릿 → SCA → SAST → 악성코드 → IaC → 페이로드 분석 → SUMMARY.md + SUMMARY.html.",
        cmd_defensive_payload_analysis:
          "읽기 전용 포렌식 패스: 빌드 설정, 난독화된 postinstall, eval/Function에 전달되는 base64 블롭에 숨어 있는 페이로드를 추적합니다. forensic/<target>/에 기록합니다.",
        cmd_scan_deps:
          "공급망 / SCA: osv-scanner + trivy + grype + 언어별 네이티브 감사 + SBOM. 락파일만 파싱 — 설치하지 않습니다.",
        cmd_scan_iac:
          "인프라-as-code 스캔: tfsec, terrascan, checkov, hadolint, dockle, kubesec.",
        cmd_scan_malware:
          "소스와 바이너리에 대한 악성코드 트리아지: YARA, capa, ClamAV, oletools.",
        cmd_scan_sast:
          "다중 언어 SAST: Semgrep에 더해 bandit/gosec/njsscan/cppcheck/brakeman/psalm 등.",
        cmd_scan_secrets:
          "자격 증명 및 키 탐지: gitleaks + trufflehog + detect-secrets + ggshield. 절대 --verification과 함께 실행하지 않습니다(공급자에게 신호를 보냄).",
        cmd_security_review:
          "PR 모드: target/ 안에서 HEAD와 베이스의 diff를 리뷰하고 Anthropic security-review JSON 스키마로 출력.",
        skill_agentic_actions_auditor:
          "CI 워크플로(GitHub Actions, GitLab CI, CircleCI, Azure Pipelines)에서 pwn-request 패턴, 핀 고정 안 된 액션, 시크릿 유출을 감사합니다.",
        skill_audit_context_building:
          "첫 번째 패스: 언어, 프레임워크, 패키지 매니저, 진입점을 목록화합니다. 다른 모든 스킬이 이 결과를 읽습니다.",
        skill_constant_time_analysis:
          "시크릿에 대한 가변 시간 비교와 조기 종료 루프를 표시합니다 — 소스 수준에서 드러나는 약 70%의 타이밍 누수를 잡아냅니다.",
        skill_defensive_payload_analysis:
          "의심스러운 트리에 대한 4단계 포렌식 분석. 공격자 서명, 페이로드 위치, 정적으로 복호화된 IoC(C2 IP, 포트, XOR 키)를 추출합니다.",
        skill_entry_point_analyzer:
          "공격면을 매핑: HTTP 라우트, CLI 명령, 내보낸 심볼, 메시지 큐, CI 트리거, IPC 소켓.",
        skill_html_report_renderer:
          "reports/findings.json + SUMMARY.md를 단일 자가완비형 reports/SUMMARY.html로 렌더링 — 외부 폰트 없음, JS 프레임워크 없음, 네트워크 없음.",
        skill_insecure_defaults_hunter:
          "취약한 암호화, TLS 비활성화, 허용적 CORS, 프로덕션의 디버그 모드, 위험한 역직렬화, 공개 S3 버킷 — 낮은 열매들.",
        skill_secrets_hunter:
          "자격 증명, API 키, 토큰, 개인 키, 고엔트로피 문자열. 각 히트를 유효 / 테스트 / 폐기로 트리아지.",
        skill_security_review:
          "target/ 안 diff를 PR 스타일로 보안 리뷰하며 Anthropic claude-code-security-review JSON 스키마로 출력.",
        skill_semgrep_rule_creator:
          "커스텀 Semgrep 규칙을 즉석에서 작성해 rules/semgrep/에 두고 target/에 실행합니다. 변이 분석이나 수동 발견을 규칙화할 때 유용.",
        skill_snyk_sast:
          "Snyk Code에 대응하는 SAST 워크플로: 엄선된 룰셋의 Semgrep과 언어 네이티브 분석기를 결합.",
        skill_snyk_sca:
          "Snyk Open Source에 대응하는 SCA 워크플로: osv-scanner, trivy, grype, 그리고 인증되어 있다면 Snyk CLI.",
        skill_static_analysis_orchestrator:
          "언어별 SAST 군집을 구동하고 SARIF를 병합, 중복 제거 — reports/sast-merged.sarif에 단일 순위 목록을 만듭니다.",
        skill_supply_chain_risk_auditor:
          "락파일 파싱 + OSV / Trivy / Snyk 데이터: CVE, 타이포스쿼트, 악의적 메인테이너, 설치 시 훅, git-URL 의존성.",
        skill_untrusted_code_isolation:
          "안전 가드. CLAUDE.md §0의 제로 실행 규칙을 강제합니다 — target/을 실행할 수 있는 명령 이전에 반드시 호출하세요.",
        skill_variant_analysis:
          "확인된 발견을 기점으로 트리 전체에서 의미적으로 비슷한 버그를 grep합니다 — 한 근본 원인이 보통 여러 자매를 낳습니다.",
        skill_yara_malware_hunter:
          "엄선된 룰셋(Yara-Rules 커뮤니티 + Neo23x0 signature-base)과 프로젝트 규칙으로 소스와 바이너리에 대해 YARA / YARA-X 스캔을 실행.",
      },
    },
  },

  ar: {
    meta: {
      title: "Coldvault — دقق في الكود غير الموثوق دون تشغيله أبدًا",
      description:
        "Coldvault.dev هو بيئة عزل بمستوى Web3 من ZONOVA RESEARCH. دقق في المستودعات المشبوهة باستخدام Claude Code وأكثر من 40 ماسحًا — جهازك يبقى سليمًا.",
      ogTitle: "Coldvault — تدقيقات بالتخزين البارد للكود غير الموثوق",
      ogDescription:
        "بيئة عزل جاهزة عبر Codespace. تحليل ثابت فقط. مدعومة من Claude Code و ZONOVA RESEARCH.",
    },
    nav: {
      threat: "التهديد",
      arsenal: "الترسانة",
      how: "كيف يعمل",
      star: "ضع نجمة على GitHub",
      language: "اللغة",
      commands: "الأوامر",
    },
    hero: {
      badge: "v0 — من ZONOVA RESEARCH",
      title1: "دقق في الكود.",
      title2: "لا تشغّله أبدًا.",
      descStart: "بيئة عزل جاهزة ",
      web3Sandbox: "بمستوى Web3",
      descMiddle:
        " لفحص المستودعات المشبوهة. مدعومة من Claude Code وأكثر من 40 ماسحًا — يبقى حاسوبك المحمول ",
      descEnd: "مجمّدًا خارج نطاق الانفجار.",
      cta1: "استنسخ الخزنة",
      cta2: "شاهد كيف يعمل",
      terminalLabel: "~/coldvault",
    },
    threat: {
      badge: "لماذا يوجد Coldvault",
      heading: "«ثبّت هذا فقط — إنه لمقابلة تقنية.»",
      p1Start:
        "يحوّل المجنّدون المزيفون اليوم تحديات البرمجة إلى أسلحة. يرسلون لك مستودعًا ويطلبون منك تنفيذ ",
      p1Middle:
        " وتشغيل سكربتهم. خلف ملف README يختبئ سارق بيانات اعتماد، أو خاطف حافظة، أو Shell عن بُعد.",
      p1End: "",
      p2Start: "",
      p2Coldvault: "Coldvault",
      p2Middle: " هو الإجابة: بيئة تدقيق عامة وقابلة للتكرار حيث ",
      p2Highlight: "لا يُنفَّذ فيها أي بايت غير موثوق أبدًا",
      p2End: ".",
    },
    features: {
      badge: "الترسانة",
      title1: "أكثر من 40 ماسحًا،",
      title2: "بيئة عزل جليدية واحدة",
      items: [
        {
          title: "لا يُنفّذ الكود أبدًا",
          desc: "تُضَمَّن المستودعات المشبوهة كوحدة git فرعية للقراءة فقط تحت target/. تحليل ثابت 100%.",
        },
        {
          title: "جاهز لـ Codespace",
          desc: "حاوية تطوير Debian مُعدّة مسبقًا بأكثر من 40 ماسحًا — ابدأ تدقيقًا في أقل من 60 ثانية.",
        },
        {
          title: "مهارات Claude Code",
          desc: "مهارات وكلاء منتقاة بوحي من Trail of Bits و Anthropic. النية → فحوصات قابلة للتكرار.",
        },
        {
          title: "SAST · SCA · الأسرار",
          desc: "Semgrep و Trivy و Gitleaks و Syft و ClamAV و Checkov — جميعها موصولة ومدموجة.",
        },
        {
          title: "تقارير SARIF و Markdown",
          desc: "تُودَع النتائج في reports/ كبيانات منظمة مع ملخص تنفيذي مقروء.",
        },
        {
          title: "مدرّع بالتصميم",
          desc: "لا منفذ شبكي من target/. تحليل معزول خلف جدران الحاوية.",
        },
      ],
    },
    how: {
      badge: "سير العمل",
      title1: "خمس خطوات إلى",
      title2: "الحقيقة الباردة",
      stepLabel: "الخطوة",
      steps: [
        { title: "استنسخ الخزنة", desc: "git clone coldvault.dev — افركها واجعلها ملكك." },
        { title: "افتح Codespace", desc: "تُقلِع حاوية التطوير بسلسلة الأدوات كاملة." },
        { title: "أضف المشتبه به", desc: "ضمّن المستودع غير الموثوق كوحدة فرعية للقراءة فقط." },
        { title: "اسأل Claude", desc: "شغّل مهارة: برمجيات خبيثة، أسرار، سلسلة التوريد، IaC…" },
        { title: "اقرأ التقرير", desc: "SARIF و Markdown مدموجة في reports/." },
      ],
    },
    cta: {
      title1: "توقّف عن تشغيل كود",
      title2: "لا تثق به.",
      desc: "Coldvault مفتوح المصدر، برخصة MIT، وجاهز للاستنساخ. أحضر وكيل Claude Code الخاص بك — ونحن نوفر الجدران المدرّعة.",
    },
    footer: {
      tagline: "🧊 COLDVAULT — مشروع ZONOVA RESEARCH · MIT",
      github: "GitHub",
      poweredBy: "مدعوم من Claude Code",
    },
    commandsPage: {
      meta: {
        title: "Coldvault — مرجع أوامر ومهارات Claude",
        description:
          "كل أمر شرطة ومهارة مرفقة مع Coldvault: ماذا يفعل كل منها، ومتى تُستدعى، وما تكتبه في reports/.",
      },
      nav: { back: "رجوع" },
      hero: {
        badge: "مرجع · v1.0",
        title1: "أوامر Claude",
        title2: "والمهارات",
        subtitle:
          "كل أمر شرطة ومهارة مرفقة مع Coldvault. تُستدعى الأوامر من موجه Claude Code ببدء السطر بشرطة مائلة؛ أما المهارات فيختارها Claude تلقائيًا عندما يطابق وصفُها المهمة.",
      },
      usage: {
        heading: "كيفية الاستدعاء",
        description:
          "داخل جلسة Claude Code في جذر المستودع، اكتب شرطة مائلة متبوعة باسم الأمر. تُختار المهارات تلقائيًا — ويمكنك أيضًا تسمية واحدة صراحةً في رسالتك (مثل «استخدم مهارة yara-malware-hunter»).",
        hintCommandsDir: "أوامر الشرطة المائلة موجودة في .claude/commands/",
        hintSkillsDir: "المهارات موجودة في .claude/skills/",
        exampleLabel: "نموذج جلسة",
      },
      commandsSection: {
        badge: "أوامر الشرطة المائلة",
        heading: "أوامر الشرطة المائلة",
        description:
          "تُستدعى مباشرة بـ /اسم. كل أمر يربط مهارة أو أكثر بسكربت تحت scripts/ ويكتب مخرجات منظمة في reports/.",
      },
      skillsSection: {
        badge: "المهارات",
        heading: "المهارات",
        description:
          "يختار Claude مهارة عندما يطابق وصفُها المهمة. المهارات وحدات قابلة لإعادة الاستعمال يركّبها Coldvault ضمن خط أنابيب التدقيق.",
      },
      outputLabel: "المخرجات",
      cta: {
        title: "جميع الأوامر للقراءة فقط على target/",
        description:
          "لا ينفّذ أي من الأوامر التالية كودًا تحت target/. فهي تحلّل ملفات القفل، وتبحث في المصدر بـ grep، وتشغّل الماسحات، وتكتب التقارير — لا أكثر.",
        button: "اقرأ بروتوكول التدقيق",
      },
      descriptions: {
        cmd_audit:
          "خط تدقيق كامل: سياق → أسرار → SCA → SAST → برمجيات خبيثة → IaC → تحليل حمولة → SUMMARY.md + SUMMARY.html.",
        cmd_defensive_payload_analysis:
          "تمريرة جنائية للقراءة فقط: تتعقّب حمولات مخفية في ملفات الإعداد للبناء، وسكربتات postinstall مموّهة، وكتل base64 تُمرَّر إلى eval/Function. تكتب في forensic/<target>/.",
        cmd_scan_deps:
          "سلسلة التوريد / SCA: osv-scanner + trivy + grype + عمليات تدقيق خاصة باللغة + SBOM. يحلّل ملفات القفل فقط — لا يثبّت أبدًا.",
        cmd_scan_iac:
          "فحص البنية التحتية ككود: tfsec و terrascan و checkov و hadolint و dockle و kubesec.",
        cmd_scan_malware:
          "فرز البرمجيات الخبيثة على المصادر والثنائيات: YARA و capa و ClamAV و oletools.",
        cmd_scan_sast:
          "SAST متعدد اللغات: Semgrep إلى جانب bandit/gosec/njsscan/cppcheck/brakeman/psalm وغيرها.",
        cmd_scan_secrets:
          "اكتشاف بيانات الاعتماد والمفاتيح: gitleaks + trufflehog + detect-secrets + ggshield. لا يُشغَّل أبدًا مع --verification (يرسل إشارة إلى المزوّد).",
        cmd_security_review:
          "وضع PR: فرق HEAD مقابل الأساس داخل target/، مع نتائج بصيغة JSON لـ security-review من Anthropic.",
        skill_agentic_actions_auditor:
          "تدقيق مسارات CI (GitHub Actions و GitLab CI و CircleCI و Azure Pipelines) بحثًا عن أنماط pwn-request و actions غير مثبّتة وتسريب الأسرار.",
        skill_audit_context_building:
          "التمريرة الأولى: جرد اللغات والإطارات ومديري الحزم ونقاط الدخول. تقرأ كل المهارات الأخرى مخرجاتها.",
        skill_constant_time_analysis:
          "يرصد المقارنات ذات الزمن المتغير على الأسرار والحلقات ذات الخروج المبكر — يلتقط نحو 70% من تسرّبات التوقيت الظاهرة في الكود المصدري.",
        skill_defensive_payload_analysis:
          "تحليل جنائي من أربع مراحل لشجرة مشبوهة. يستخرج توقيع المهاجم وموقع الحمولة ومؤشرات الاختراق المفكوكة استاتيكيًا (عناوين C2، منافذ، مفاتيح XOR).",
        skill_entry_point_analyzer:
          "يرسم سطح الهجوم: مسارات HTTP وأوامر CLI والرموز المُصدَّرة وطوابير الرسائل ومحفزات CI ومقابس IPC.",
        skill_html_report_renderer:
          "يحوّل reports/findings.json و SUMMARY.md إلى ملف واحد قائم بذاته reports/SUMMARY.html — دون خطوط خارجية ودون إطار JS ودون شبكة.",
        skill_insecure_defaults_hunter:
          "تشفير ضعيف، TLS معطّل، CORS متساهل، وضع تصحيح في الإنتاج، إلغاء تسلسل غير آمن، دلاء S3 مفتوحة — الثمار الدانية.",
        skill_secrets_hunter:
          "بيانات اعتماد ومفاتيح API ورموز مميّزة ومفاتيح خاصة وسلاسل عالية الإنتروبيا. فرز كل نتيجة: حية مقابل اختبار مقابل ملغاة.",
        skill_security_review:
          "مراجعة أمنية بأسلوب PR لفرق داخل target/، باستخدام JSON schema الخاص بـ claude-code-security-review من Anthropic.",
        skill_semgrep_rule_creator:
          "يكتب قاعدة Semgrep مخصصة لحظيًا ويضعها في rules/semgrep/ ويشغّلها على target/. ممتاز لتحليل المتغيرات أو لتدوين نتيجة يدوية كقاعدة.",
        skill_snyk_sast:
          "سير عمل SAST مكافئ لـ Snyk Code: Semgrep مع قواعد منتقاة بالإضافة إلى محلّلات خاصة باللغة.",
        skill_snyk_sca:
          "سير عمل SCA مكافئ لـ Snyk Open Source: osv-scanner و trivy و grype، و Snyk CLI إن كان مصادَقًا عليه.",
        skill_static_analysis_orchestrator:
          "يدير أسطول SAST لكل لغة، يدمج ملفات SARIF، ويزيل التكرار — قائمة مصنّفة واحدة في reports/sast-merged.sarif.",
        skill_supply_chain_risk_auditor:
          "تحليل ملفات القفل + بيانات OSV / Trivy / Snyk: CVE، وtypo-squat، ومشرفون خبيثون، وخطافات وقت التثبيت، وتبعيات بعنوان git.",
        skill_untrusted_code_isolation:
          "حواجز أمان. تفرض قاعدة عدم التنفيذ من CLAUDE.md §0 — استدعها قبل أي أمر يمكن أن يشغّل target/.",
        skill_variant_analysis:
          "انطلاقًا من نتيجة مؤكدة، يبحث في كامل الشجرة عن أخطاء مماثلة دلاليًا — سبب جذري واحد عادةً ما ينجب عدة إخوة.",
        skill_yara_malware_hunter:
          "فحص YARA / YARA-X على المصادر والثنائيات باستخدام قواعد منتقاة (Yara-Rules community + Neo23x0 signature-base) إلى جانب قواعد خاصة بالمشروع.",
      },
    },
  },
};
