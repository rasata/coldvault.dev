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
  },
};
