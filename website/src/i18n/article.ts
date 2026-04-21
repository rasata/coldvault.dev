import type { Locale } from "./translations";

export type ArticleDict = {
  // meta
  metaTitle: string;
  metaDescription: string;
  // header
  tags: string[];
  title1: string; // "Anatomy of a"
  titleAccent: string; // "DeceptiveDevelopment"
  title2: string; // "attack"
  subtitle: string;
  authorName: string;
  authorOrg: string;
  publishedOn: string;
  // tldr
  tldrLabel: string;
  tldrBody: string;
  // sections
  s0Title: string;
  s0P1: string;
  s0P2Lead: string;
  s0Bullets: { strong: string; rest: string }[];
  s1Title: string;
  s11Sub: string;
  s11Quote: string;
  s11Lead: string;
  s11Bullets: string[];
  s12Sub: string;
  s12Quote: string;
  s12Lead: string;
  s12Bullets: { strong: string; rest: string }[];
  s13Sub: string;
  s13P1: string;
  s13Quote: string;
  s13P2Pre: string;
  s13P2Repo: string;
  s13P2Post: string;
  s14Sub: string;
  s14P1Pre: string;
  s14P1Bold: string;
  s14P1Mid: string;
  s14P1Code: string;
  s14P1Post: string;
  s14P2Pre: string;
  s14P2Bold: string;
  s14P2Post: string;
  s14P3: string;
  s15Sub: string;
  s15Quote: string;
  s15P: string;
  s2Title: string;
  s2Lead: string;
  s2TableHead: [string, string];
  s2Rows: [string, string][];
  s3Title: string;
  s3KillChain: { id: string; text: string; decision?: boolean }[];
  s3DecisionLabel: string;
  s3Success: string;
  s3Trailer: string;
  s4Title: string;
  s4Lead: string;
  s41Sub: string;
  s41TableHead: [string, string];
  s41Rows: [string, string][];
  s41After: string;
  s42Sub: string;
  s42Bullets: { strong: string; rest: string }[];
  s43Sub: string;
  s43Items: { strong: string; rest: string }[];
  s44Sub: string;
  s44P: string;
  s5Title: string;
  s5Rule: string;
  s5RuleLabel: string;
  s5Lead: string;
  s5Bullets: { strong: string; rest: string }[];
  s52Sub: string;
  s52Bullets: string[];
  s52CodeNote: string;
  s52After: string;
  s6Title: string;
  s6P: string;
  s6Cta: string;
  s7Title: string;
  s71Sub: string;
  s71TableHead: [string, string, string];
  s71Rows: [string, string, string][];
  s72Sub: string;
  s72Bullets: string[];
  s73Sub: string;
  s73Bullets: string[];
  s9Title: string;
  s9P1: string;
  s9P2Pre: string;
  s9P2Bold: string;
  s9P2Mid: string;
  s9P2Bold2: string;
  s9Slogan: string;
  s9Author: string;
  // navigation / cta
  navHome: string;
  navPlaybook: string;
  ctaGetColdvault: string;
  ctaReadPlaybook: string;
  footerPublishedBy: string;
  footerSuffix: string;
};

const en: ArticleDict = {
  metaTitle:
    "Anatomy of a DeceptiveDevelopment attack — how a Lazarus-linked recruiter almost ran code on my machine",
  metaDescription:
    "First-hand case study of a North Korean-style fake-recruiter campaign: LinkedIn approach, Bitbucket payload, psychological mechanics, IOCs, and the defensive architecture that stopped it.",
  tags: [
    "threat-intelligence",
    "social-engineering",
    "DeceptiveDevelopment",
    "Lazarus",
    "web3-security",
  ],
  title1: "Anatomy of a",
  titleAccent: "DeceptiveDevelopment",
  title2: "attack",
  subtitle:
    "How a Lazarus-linked “recruiter” almost ran code on a developer's machine — and what ColdVault was built to prevent.",
  authorName: "ZONOVA RESEARCH",
  authorOrg: "Independent threat intelligence",
  publishedOn: "April 20, 2026",
  tldrLabel: "TL;DR",
  tldrBody:
    "In April 2026, an independent researcher was targeted by a near-textbook execution of the DeceptiveDevelopment / Contagious Interview campaign, attributed to Lazarus sub-clusters (DPRK). The attacker posed as the co-founder of “Invoblox”, offered USD 20–25k/month, and asked for a Bitbucket repo to be cloned. The repo contained a dependency that shadowed Node.js's native fs module — a textbook malware loader. The local install was refused, a disposable cloud environment was insisted on, and the lure was abandoned. This post is the complete forensic and behavioural write-up.",
  s0Title: "Why this write-up exists",
  s0P1:
    "Most incident write-ups are published after the victim has paid. This one is published because nobody paid, and because the playbook used here is now used at industrial scale against the developer community — especially in Web3.",
  s0P2Lead: "This post has three jobs:",
  s0Bullets: [
    { strong: "Preserve the evidence", rest: " — full transcripts, IOCs, screenshots, so defenders can pivot on the infrastructure." },
    { strong: "Explain the psychology", rest: " — through Transactional Analysis, neuroscience and Cialdini's influence levers." },
    { strong: "Hand over a ready-made defence", rest: " — coldvault.dev, a Codespace-based static-audit sandbox." },
  ],
  s1Title: "Timeline of the attack",
  s11Sub: "1.1 Initial contact (LinkedIn)",
  s11Quote:
    "Hello, I hope you're doing well, excited to connect. We're a leading company in blockchain and digital innovation, currently building an exciting new project. […] You're welcome to join us as a Technical Manager, working fully remotely, either part-time or full-time. The expected salary for this role is $20k ~ $25k USD per month. […] calendly.com/best_collaboration/business",
  s11Lead: "Already visible without any technical skill:",
  s11Bullets: [
    "No company named in the message body — empty signifier.",
    "Salary disclosed before any interview — inverted protocol.",
    "Generic Calendly handle on a non-corporate domain.",
    "Flexibility offered before any role description.",
  ],
  s12Sub: "1.2 Pre-call framing email",
  s12Quote:
    "This is our company site: https://invoblox.com/ Our project is a next-generation cryptocurrency trading platform. […] The project is backed with an investment of $6.5 million. […] This meeting is intended to be an introductory discussion rather than a technical interview.",
  s12Lead: "Three stacked manipulations:",
  s12Bullets: [
    { strong: "A real-looking site as proof of existence", rest: " — brand piggy-back on a 4-year-old domain." },
    { strong: "A non-verifiable funding figure", rest: " — precise enough to feel real, too small to appear in Crunchbase." },
    { strong: "“Not a technical interview”", rest: " — pre-emptive lowering of the audit guard." },
  ],
  s13Sub: "1.3 The 60-minute “intro call”",
  s13P1:
    "Warm opener, validation of background, plausible MERN + Solidity pitch, “17 full-time members, $6.5M backed”, USD 20–25k/month, 2-week paid trial in stablecoins. Then near the end, the actual ask:",
  s13Quote:
    "Could you pull our repo and take a look at the architecture before the CTO call? Just clone it and run it locally, give us your feedback.",
  s13P2Pre: "Repo: ",
  s13P2Repo: "bitbucket.org/teamincwork/pro_lmng",
  s13P2Post: ". Job description on a standalone Notion page — disposable, no recruiter footprint.",
  s14Sub: "1.4 What actually happened",
  s14P1Pre: "The repo was cloned. ",
  s14P1Bold: "npm install was NOT run.",
  s14P1Mid: " ",
  s14P1Code: "package.json",
  s14P1Post: " was read.",
  s14P2Pre:
    "A dependency was found whose name mimicked a utility library but whose published code ",
  s14P2Bold: "overrode Node.js's native fs module at require-time",
  s14P2Post:
    ". Any subsequent code reading or writing files would be routed through the malicious module first — the load-bearing primitive of several BeaverTail variants documented by ESET and Unit 42.",
  s14P3:
    "The recruiter was told the audit would only happen in GitHub Codespaces. He said he'd “consider it”.",
  s15Sub: "1.5 The pressure follow-up",
  s15Quote: "Could you join the scheduled meeting now?",
  s15P:
    "One sentence. Closed question. Pure time-pressure probe — a textbook Cialdini commitment & consistency hook under artificial urgency. No reply was sent. The conversation ended.",
  s2Title: "Attribution: this is DeceptiveDevelopment",
  s2Lead:
    "Every indicator in this case maps 1:1 onto the DeceptiveDevelopment / Contagious Interview cluster publicly documented by ESET, Palo Alto Unit 42, Group-IB and Zscaler since 2023:",
  s2TableHead: ["Indicator in this case", "DeceptiveDevelopment signature"],
  s2Rows: [
    ["Unsolicited LinkedIn DM from a 'recruiter'", "primary channel"],
    ["'Leading company in blockchain' — empty description", "recurring phrasing"],
    ["Generic Calendly handle, not on corporate domain", "documented"],
    ["Salary USD 20–25k/month announced up front", "documented"],
    ["MERN + Solidity, 'next-gen crypto trading platform'", "typical cover project"],
    ["Inflated funding (USD 6.5M) and team size (17/30)", "documented"],
    ["Repository hosted on Bitbucket", "preferred host since late 2024"],
    ["Job description on Notion (not on an ATS)", "disposable, no paper trail"],
    ["Payment in stablecoins or ETH", "avoids banking traceability"],
    ["Dependency overriding Node fs module", "BeaverTail/InvisibleFerret loader"],
    ["'This is not a technical interview' framing", "disarms audit mindset"],
    ["Immediate pressure follow-up after hesitation", "documented"],
  ],
  s3Title: "The kill chain the attacker expected",
  s3KillChain: [
    { id: "A", text: "LinkedIn cold DM + Calendly" },
    { id: "B", text: "Intro call — 60 min, confidence build" },
    { id: "C", text: "Share Bitbucket + Notion" },
    { id: "D", text: "Decision: local install?", decision: true },
    { id: "E", text: "npm install → fs-shadow loader fires" },
    { id: "F", text: "BeaverTail steals cookies, wallets, keychains" },
    { id: "G", text: "InvisibleFerret persistence + AnyDesk deploy" },
    { id: "H", text: "Exfil: wallets, SSH, cloud tokens, client data" },
  ],
  s3DecisionLabel: "← single decision controlling the entire outcome",
  s3Success:
    "If D = no — repo audited in ColdVault, attack fails, attacker rotates to next target.",
  s3Trailer:
    "Steps A→E take less than two hours. Once step E fires, the machine is compromised. The single decision point that controls the entire outcome is D — do you run the code on your own machine?",
  s4Title: "Why this works on senior engineers",
  s4Lead:
    "Technical seniority is not a defence here — in several ways it is the opposite. Senior engineers hold production credentials and wallets, are more exposed on LinkedIn, and are more susceptible to “your background caught our attention”.",
  s41Sub: "4.1 Transactional Analysis — what state is being addressed",
  s41TableHead: ["Social message (explicit)", "Psychological target (implicit)"],
  s41Rows: [
    ["“We'd love to work with someone of your caliber.”", "Nurturing Parent — respond to recognition."],
    ["“We're flexible on schedule.”", "Adapted Child — be accommodating in return."],
    ["“This isn't a technical interview, just an intro.”", "Adult — stand down, don't audit."],
    ["“Could you just clone and run it?”", "Adapted Child — comply, prove you're a good candidate."],
    ["“Could you join the meeting now?”", "Adapted Child — don't disappoint, show up."],
  ],
  s41After:
    "A healthy counter is the crossed transaction: reply Adult-to-Adult, refusing the implicit frame. “I'll audit the repo in a disposable environment before any install” breaks the script.",
  s42Sub: "4.2 Neuroscience — three systems hijacked",
  s42Bullets: [
    { strong: "Reward prediction (VTA → nucleus accumbens).", rest: " USD 25k/month registers as a positive prediction error; dopamine doesn't encode pleasure, it encodes motivation to protect the prediction — i.e. motivated reasoning." },
    { strong: "Trust encoding (caudate nucleus).", rest: " One warm hour with technical jargon is enough to lay down a neural trust signature logic struggles to override." },
    { strong: "Decision fatigue (vmPFC, dlPFC).", rest: " Novelty + social pressure + information density + urgency starve the part of your brain responsible for “wait, let me read package.json”." },
  ],
  s43Sub: "4.3 Cialdini stack — in order of appearance",
  s43Items: [
    { strong: "Authority", rest: " — “co-founder”, “CTO will join later”, “$6.5M backed”." },
    { strong: "Social proof", rest: " — “17 full-time members, 7 seniors”." },
    { strong: "Liking", rest: " — warm tone, personalised flattery, LinkedIn mirroring." },
    { strong: "Reciprocity", rest: " — paid 2-week trial offered before any work." },
    { strong: "Commitment & consistency", rest: " — once you've spent an hour, refusing “just clone the repo” feels disproportionate." },
    { strong: "Scarcity / urgency", rest: " — “MVP in 6 months”, “could you join now?”." },
  ],
  s44Sub: "4.4 Why “I'm too smart for this” is the wrong defence",
  s44P:
    "Every public victim write-up contains a variant of “I thought I was too careful for this.” Intelligence is not the defence. Procedure is. The defence is architectural: remove your ability to install untrusted code on a machine that matters.",
  s5Title: "The defensive reflex — and the tool that automates it",
  s5RuleLabel: "The rule",
  s5Rule: "Never execute untrusted code on a machine that holds anything of value to you.",
  s5Lead: "Two practical corollaries:",
  s5Bullets: [
    { strong: "Separate machines, or separate boundaries.", rest: " The laptop with your keys, wallets, credentials and SSH identities is not the laptop where you evaluate strangers' code. If you only have one, the “second machine” must be a disposable VM." },
    { strong: "Read before you run.", rest: " Every package.json, pyproject.toml, Cargo.toml gets audited before any install. postinstall, preinstall, prepare scripts get read." },
  ],
  s52Sub: "5.2 What ColdVault does",
  s52Bullets: [
    "The suspect repo is attached as a read-only git submodule under target/.",
    "Analysis runs inside a GitHub Codespace — ephemeral VM, blast radius = one container.",
    "40+ security tools pre-baked: SAST, SCA, secret hunters, malware triage, IaC scanners, SBOM.",
    "Curated Claude Code skills turn “review this repo” into a reproducible pipeline.",
    "Outputs reports/findings.json, SUMMARY.md, SARIF, CycloneDX SBOM.",
  ],
  s52CodeNote: "",
  s52After:
    "Five minutes later, reports/SUMMARY.md tells you whether the fs-shadowing dependency is there, whether postinstall hooks are suspicious, whether YARA hits on bundled binaries — and whether payloads are hidden off-screen behind horizontal scroll.",
  s6Title: "Field checklist",
  s6P:
    "The full reflexes & response playbook lives on its own page — laminate-it-and-keep-it-near-your-keyboard format.",
  s6Cta: "Open the Playbook",
  s7Title: "Indicators of Compromise",
  s71Sub: "7.1 Infrastructure",
  s71TableHead: ["Type", "Value", "Role"],
  s71Rows: [
    ["Bitbucket workspace", "teamincwork", "Hosts malicious repo"],
    ["Repository", "bitbucket.org/teamincwork/pro_lmng", "Payload delivery"],
    ["Notion page", "notion.so/Technical-Lead-2e8561…", "Fake job description"],
    ["Calendly handle", "calendly.com/best_collaboration/business", "Scheduling lure"],
    ["Cover-brand domain", "invoblox.com", "Impersonated brand"],
    ["Recruiter alias", "“Lucas Silva” (LinkedIn)", "Persona"],
  ],
  s72Sub: "7.2 Behavioural pattern (TTPs)",
  s72Bullets: [
    "Unsolicited LinkedIn DM → Calendly → 60-min intro call.",
    "Empty-description company opener.",
    "Salary band USD 20–25k/month announced pre-interview.",
    "Repo on Bitbucket; job description on Notion.",
    "Payload via dependency overriding Node's fs.",
    "Immediate pressure follow-up on hesitation.",
  ],
  s73Sub: "7.3 Technical patterns to scan for",
  s73Bullets: [
    "postinstall / preinstall / prepare running dependency code.",
    "Dependencies pinned to a git commit (not an npm version).",
    "Typo-squat names: ethers-utils, web3-helper, node-fs-helper, react-native-utils…",
    "Source files > 100 KB in light front-end projects.",
    "Horizontal scroll hiding payload off-screen on a single line.",
    "Dense base64/hex passed to eval, Function, new Function.",
    "Modules monkey-patching fs, child_process, crypto, https, net, process.",
  ],
  s9Title: "Closing",
  s9P1:
    "The researcher was lucky — not because they're particularly sharp, but because they read package.json before running npm install, and because they had the Codespaces option. Luck isn't a security model. Procedure is.",
  s9P2Pre: "If you take one thing from this post: ",
  s9P2Bold: "decouple the audit machine from the value machine.",
  s9P2Mid: " If you take a second: do not treat an unsolicited high-salary DM as an opportunity — treat it as a ",
  s9P2Bold2: "triage event",
  s9Slogan: "Stay cold. Stay vaulted.",
  s9Author: "— ZONOVA RESEARCH",
  navHome: "Home",
  navPlaybook: "Playbook",
  ctaGetColdvault: "Get ColdVault",
  ctaReadPlaybook: "Read the Playbook",
  footerPublishedBy: "Published by",
  footerSuffix: ". MIT-licensed. PRs welcome.",
};

const fr: ArticleDict = {
  metaTitle:
    "Anatomie d'une attaque DeceptiveDevelopment — comment un “recruteur” lié à Lazarus a failli exécuter du code sur ma machine",
  metaDescription:
    "Étude de cas vécue d'une campagne de faux recruteurs nord-coréens : approche LinkedIn, payload Bitbucket, mécanique psychologique, IOCs et architecture défensive qui a stoppé l'attaque.",
  tags: [
    "threat-intelligence",
    "ingénierie-sociale",
    "DeceptiveDevelopment",
    "Lazarus",
    "sécurité-web3",
  ],
  title1: "Anatomie d'une attaque",
  titleAccent: "DeceptiveDevelopment",
  title2: "",
  subtitle:
    "Comment un “recruteur” lié à Lazarus a failli exécuter du code sur la machine d'un développeur — et pourquoi ColdVault a été créé pour empêcher cela.",
  authorName: "ZONOVA RESEARCH",
  authorOrg: "Threat intelligence indépendante",
  publishedOn: "20 avril 2026",
  tldrLabel: "TL;DR",
  tldrBody:
    "En avril 2026, un chercheur indépendant a été ciblé par une exécution quasi-académique de la campagne DeceptiveDevelopment / Contagious Interview, attribuée à des sous-groupes de Lazarus (RPDC). L'attaquant se présentait comme co-fondateur d'“ Invoblox ”, offrait 20 à 25 k$ USD/mois, et demandait de cloner un dépôt Bitbucket. Le dépôt contenait une dépendance qui masquait le module fs natif de Node.js — un loader malveillant classique. L'installation locale a été refusée, l'analyse a été exigée dans un environnement cloud jetable, et le piège a été abandonné. Ce billet est le compte-rendu forensique et comportemental complet.",
  s0Title: "Pourquoi ce billet existe",
  s0P1:
    "La plupart des post-mortem d'incident sont publiés après que la victime a payé. Celui-ci est publié parce que personne n'a payé, et parce que ce playbook est désormais utilisé à échelle industrielle contre la communauté des développeurs — surtout en Web3.",
  s0P2Lead: "Ce billet a trois objectifs :",
  s0Bullets: [
    { strong: "Préserver les preuves", rest: " — transcriptions complètes, IOCs, captures, pour que les défenseurs puissent pivoter sur l'infrastructure." },
    { strong: "Expliquer la psychologie", rest: " — via l'Analyse Transactionnelle, les neurosciences et les leviers d'influence de Cialdini." },
    { strong: "Fournir une défense clé en main", rest: " — coldvault.dev, un sandbox d'audit statique basé sur Codespaces." },
  ],
  s1Title: "Chronologie de l'attaque",
  s11Sub: "1.1 Premier contact (LinkedIn)",
  s11Quote:
    "Bonjour, j'espère que vous allez bien, ravi d'entrer en contact. Nous sommes une entreprise leader dans la blockchain et l'innovation numérique, en train de construire un projet passionnant. […] Vous êtes invité à nous rejoindre comme Technical Manager, en full-remote, à temps partiel ou plein. Le salaire attendu est de 20k$ à 25k$ USD par mois. […] calendly.com/best_collaboration/business",
  s11Lead: "Visible immédiatement, sans aucune compétence technique :",
  s11Bullets: [
    "Aucune entreprise nommée dans le message — signifiant vide.",
    "Salaire annoncé avant tout entretien — protocole inversé.",
    "Lien Calendly générique sur un domaine non-corporate.",
    "Flexibilité offerte avant toute description du poste.",
  ],
  s12Sub: "1.2 Email de cadrage avant l'appel",
  s12Quote:
    "Voici notre site : https://invoblox.com/ Notre projet est une plateforme de trading crypto de nouvelle génération. […] Le projet est financé à hauteur de 6,5 millions de dollars. […] Cette réunion est une discussion d'introduction, pas un entretien technique.",
  s12Lead: "Trois manipulations empilées :",
  s12Bullets: [
    { strong: "Un site d'apparence réelle comme preuve d'existence", rest: " — pignon arrière de marque sur un domaine vieux de 4 ans." },
    { strong: "Un montant de financement non vérifiable", rest: " — assez précis pour sembler réel, trop petit pour apparaître dans Crunchbase." },
    { strong: "“ Pas un entretien technique ”", rest: " — désamorçage préventif de la vigilance d'audit." },
  ],
  s13Sub: "1.3 L'appel d'“ intro ” de 60 minutes",
  s13P1:
    "Ouverture chaleureuse, validation du parcours, pitch MERN + Solidity plausible, “ 17 membres temps plein, 6,5M$ levés ”, 20–25k$ USD/mois, période d'essai payée 2 semaines en stablecoins. Puis vers la fin, la vraie demande :",
  s13Quote:
    "Pourriez-vous récupérer notre dépôt et regarder l'architecture avant l'appel avec le CTO ? Clonez-le, lancez-le en local, donnez-nous votre retour.",
  s13P2Pre: "Dépôt : ",
  s13P2Repo: "bitbucket.org/teamincwork/pro_lmng",
  s13P2Post: ". Description du poste sur une page Notion isolée — jetable, aucune trace recruteur.",
  s14Sub: "1.4 Ce qui s'est réellement passé",
  s14P1Pre: "Le dépôt a été cloné. ",
  s14P1Bold: "npm install n'a PAS été exécuté.",
  s14P1Mid: " Le fichier ",
  s14P1Code: "package.json",
  s14P1Post: " a été lu.",
  s14P2Pre:
    "Une dépendance a été repérée dont le nom imitait une bibliothèque utilitaire mais dont le code publié ",
  s14P2Bold: "écrasait le module fs natif de Node.js dès le require",
  s14P2Post:
    ". Tout code lisant ou écrivant des fichiers passerait alors d'abord par le module malveillant — la primitive porteuse de plusieurs variantes BeaverTail documentées par ESET et Unit 42.",
  s14P3:
    "Le recruteur a été informé que l'audit n'aurait lieu qu'en GitHub Codespaces. Il a dit qu'il “ y réfléchirait ”.",
  s15Sub: "1.5 La relance sous pression",
  s15Quote: "Pourriez-vous rejoindre la réunion maintenant ?",
  s15P:
    "Une phrase. Question fermée. Pure sonde de pression temporelle — un crochet d'engagement-cohérence à la Cialdini sous urgence artificielle. Aucune réponse. Conversation terminée.",
  s2Title: "Attribution : il s'agit bien de DeceptiveDevelopment",
  s2Lead:
    "Chaque indicateur de ce cas correspond 1:1 au cluster DeceptiveDevelopment / Contagious Interview documenté publiquement par ESET, Palo Alto Unit 42, Group-IB et Zscaler depuis 2023 :",
  s2TableHead: ["Indicateur dans ce cas", "Signature DeceptiveDevelopment"],
  s2Rows: [
    ["DM LinkedIn non sollicité d'un “ recruteur ”", "canal principal"],
    ["“ Entreprise leader en blockchain ” — description vide", "phrase récurrente"],
    ["Calendly générique, pas sur domaine corporate", "documenté"],
    ["Salaire 20–25k$/mois annoncé d'emblée", "documenté"],
    ["MERN + Solidity, “ plateforme crypto next-gen ”", "projet de couverture typique"],
    ["Financement gonflé (6,5M$) et équipe (17/30)", "documenté"],
    ["Dépôt sur Bitbucket", "hôte privilégié depuis fin 2024"],
    ["Description de poste sur Notion (pas d'ATS)", "jetable, aucune trace"],
    ["Paiement en stablecoins ou ETH", "évite la traçabilité bancaire"],
    ["Dépendance écrasant le module fs", "loader BeaverTail/InvisibleFerret"],
    ["“ Ce n'est pas un entretien technique ”", "désarme l'esprit d'audit"],
    ["Relance sous pression après hésitation", "documenté"],
  ],
  s3Title: "La kill chain attendue par l'attaquant",
  s3KillChain: [
    { id: "A", text: "DM LinkedIn à froid + Calendly" },
    { id: "B", text: "Appel d'intro — 60 min, construction de confiance" },
    { id: "C", text: "Partage Bitbucket + Notion" },
    { id: "D", text: "Décision : installation locale ?", decision: true },
    { id: "E", text: "npm install → loader fs-shadow déclenché" },
    { id: "F", text: "BeaverTail vole cookies, wallets, trousseaux" },
    { id: "G", text: "InvisibleFerret : persistance + déploiement AnyDesk" },
    { id: "H", text: "Exfil : wallets, SSH, tokens cloud, données clients" },
  ],
  s3DecisionLabel: "← unique décision contrôlant tout l'enchaînement",
  s3Success:
    "Si D = non — dépôt audité dans ColdVault, attaque échouée, l'attaquant pivote vers la cible suivante.",
  s3Trailer:
    "Les étapes A→E prennent moins de deux heures. Une fois l'étape E déclenchée, la machine est compromise. Le seul point de décision qui contrôle tout est D — exécutez-vous le code sur votre propre machine ?",
  s4Title: "Pourquoi ça marche sur les ingénieurs seniors",
  s4Lead:
    "L'expérience technique n'est pas une défense ici — au contraire à plusieurs égards. Les seniors détiennent les credentials de prod et les wallets, sont plus exposés sur LinkedIn, et plus sensibles au “ votre profil a attiré notre attention ”.",
  s41Sub: "4.1 Analyse Transactionnelle — quel état est sollicité",
  s41TableHead: ["Message social (explicite)", "Cible psychologique (implicite)"],
  s41Rows: [
    ["“ Nous adorerions travailler avec quelqu'un de votre calibre. ”", "Parent Nourricier — répondre à la reconnaissance."],
    ["“ Nous sommes flexibles sur le planning. ”", "Enfant Adapté — être conciliant en retour."],
    ["“ Ce n'est pas un entretien technique, juste un intro. ”", "Adulte — désactivez l'audit."],
    ["“ Vous pouvez juste cloner et lancer ? ”", "Enfant Adapté — obtempérer, prouver qu'on est un bon candidat."],
    ["“ Vous pouvez rejoindre la réunion maintenant ? ”", "Enfant Adapté — ne pas décevoir, se présenter."],
  ],
  s41After:
    "Une parade saine est la transaction croisée : répondre Adulte vers Adulte, en refusant le cadre implicite. “ J'auditerai le dépôt dans un environnement jetable avant toute installation ” casse le script.",
  s42Sub: "4.2 Neurosciences — trois systèmes détournés",
  s42Bullets: [
    { strong: "Prédiction de récompense (VTA → noyau accumbens).", rest: " 25k$/mois est encodé comme une erreur de prédiction positive ; la dopamine n'encode pas le plaisir, elle encode la motivation à protéger la prédiction — autrement dit, du raisonnement motivé." },
    { strong: "Encodage de la confiance (noyau caudé).", rest: " Une heure chaleureuse avec du jargon technique suffit à inscrire une signature neurale de confiance que la logique a du mal à révoquer." },
    { strong: "Fatigue décisionnelle (vmPFC, dlPFC).", rest: " Nouveauté + pression sociale + densité d'information + urgence affament la partie du cerveau qui dit “ attends, lis package.json ”." },
  ],
  s43Sub: "4.3 Pile Cialdini — dans l'ordre d'apparition",
  s43Items: [
    { strong: "Autorité", rest: " — “ co-fondateur ”, “ le CTO arrivera plus tard ”, “ 6,5M$ levés ”." },
    { strong: "Preuve sociale", rest: " — “ 17 membres temps plein, 7 seniors ”." },
    { strong: "Sympathie", rest: " — ton chaleureux, flatterie personnalisée, mimétisme LinkedIn." },
    { strong: "Réciprocité", rest: " — essai payé 2 semaines offert avant tout travail." },
    { strong: "Engagement & cohérence", rest: " — après une heure investie, refuser “ juste cloner le dépôt ” paraît disproportionné." },
    { strong: "Rareté / urgence", rest: " — “ MVP dans 6 mois ”, “ vous pouvez rejoindre maintenant ? ”." },
  ],
  s44Sub: "4.4 Pourquoi “ je suis trop malin pour ça ” est la mauvaise défense",
  s44P:
    "Chaque témoignage public de victime contient une variante de “ je pensais être trop prudent pour ça ”. L'intelligence n'est pas la défense. La procédure l'est. La défense est architecturale : retirer votre capacité à installer du code non fiable sur une machine qui compte.",
  s5Title: "Le réflexe défensif — et l'outil qui l'automatise",
  s5RuleLabel: "La règle",
  s5Rule:
    "N'exécutez jamais de code non fiable sur une machine qui contient quoi que ce soit de précieux pour vous.",
  s5Lead: "Deux corollaires pratiques :",
  s5Bullets: [
    { strong: "Machines séparées, ou frontières séparées.", rest: " Le portable contenant vos clés, wallets, credentials et identités SSH n'est pas celui où vous évaluez le code d'inconnus. Si vous n'en avez qu'un, la “ seconde machine ” doit être une VM jetable." },
    { strong: "Lisez avant de lancer.", rest: " Chaque package.json, pyproject.toml, Cargo.toml est audité avant toute installation. Les scripts postinstall, preinstall, prepare sont lus." },
  ],
  s52Sub: "5.2 Ce que fait ColdVault",
  s52Bullets: [
    "Le dépôt suspect est attaché en sous-module git read-only sous target/.",
    "L'analyse tourne dans un GitHub Codespace — VM éphémère, rayon d'impact = un container.",
    "Plus de 40 outils sécurité préinstallés : SAST, SCA, chasseurs de secrets, triage malware, scanners IaC, SBOM.",
    "Des skills Claude Code curatés transforment “ audite ce dépôt ” en pipeline reproductible.",
    "Sortie : reports/findings.json, SUMMARY.md, SARIF, SBOM CycloneDX.",
  ],
  s52CodeNote: "",
  s52After:
    "Cinq minutes plus tard, reports/SUMMARY.md indique si la dépendance fs-shadow est présente, si les hooks postinstall sont suspects, si YARA matche sur des binaires fournis — et si des payloads sont cachés hors-écran derrière du scroll horizontal.",
  s6Title: "Checklist terrain",
  s6P:
    "Le playbook complet réflexes & réponse vit sur sa propre page — au format à plastifier-et-coller-près-du-clavier.",
  s6Cta: "Ouvrir le Playbook",
  s7Title: "Indicateurs de Compromission",
  s71Sub: "7.1 Infrastructure",
  s71TableHead: ["Type", "Valeur", "Rôle"],
  s71Rows: [
    ["Workspace Bitbucket", "teamincwork", "Héberge le dépôt malveillant"],
    ["Dépôt", "bitbucket.org/teamincwork/pro_lmng", "Livraison du payload"],
    ["Page Notion", "notion.so/Technical-Lead-2e8561…", "Fausse description de poste"],
    ["Handle Calendly", "calendly.com/best_collaboration/business", "Leurre de planification"],
    ["Domaine de couverture", "invoblox.com", "Marque usurpée"],
    ["Alias recruteur", "“ Lucas Silva ” (LinkedIn)", "Persona"],
  ],
  s72Sub: "7.2 Pattern comportemental (TTPs)",
  s72Bullets: [
    "DM LinkedIn non sollicité → Calendly → appel d'intro 60 min.",
    "Ouverture avec description vide d'entreprise.",
    "Salaire 20–25k$/mois annoncé avant l'entretien.",
    "Dépôt sur Bitbucket ; description sur Notion.",
    "Payload via dépendance écrasant fs de Node.",
    "Relance sous pression à la moindre hésitation.",
  ],
  s73Sub: "7.3 Patterns techniques à scanner",
  s73Bullets: [
    "postinstall / preinstall / prepare exécutant du code de dépendance.",
    "Dépendances pinées sur un commit git (pas une version npm).",
    "Noms typo-squat : ethers-utils, web3-helper, node-fs-helper, react-native-utils…",
    "Fichiers source > 100 Ko dans des projets front-end légers.",
    "Scroll horizontal cachant un payload hors-écran sur une seule ligne.",
    "Base64/hex denses passés à eval, Function, new Function.",
    "Modules monkey-patchant fs, child_process, crypto, https, net, process.",
  ],
  s9Title: "Conclusion",
  s9P1:
    "Le chercheur a eu de la chance — pas parce qu'il est particulièrement affûté, mais parce qu'il a lu package.json avant de lancer npm install, et parce qu'il avait l'option Codespaces. La chance n'est pas un modèle de sécurité. La procédure, oui.",
  s9P2Pre: "Si vous ne retenez qu'une chose : ",
  s9P2Bold: "découplez la machine d'audit de la machine de valeur.",
  s9P2Mid: " Si vous en retenez deux : ne traitez pas un DM gros-salaire non sollicité comme une opportunité — traitez-le comme un ",
  s9P2Bold2: "événement de triage",
  s9Slogan: "Restez froid. Restez en chambre forte.",
  s9Author: "— ZONOVA RESEARCH",
  navHome: "Accueil",
  navPlaybook: "Playbook",
  ctaGetColdvault: "Obtenir ColdVault",
  ctaReadPlaybook: "Lire le Playbook",
  footerPublishedBy: "Publié par",
  footerSuffix: ". Sous licence MIT. PRs bienvenues.",
};

const de: ArticleDict = {
  metaTitle:
    "Anatomie eines DeceptiveDevelopment-Angriffs — wie ein Lazarus-naher “Recruiter” beinahe Code auf einem Rechner ausgeführt hätte",
  metaDescription:
    "Erlebte Fallstudie einer nordkoreanischen Fake-Recruiter-Kampagne: LinkedIn-Anbahnung, Bitbucket-Payload, Psychologie, IOCs und die Verteidigung, die den Angriff stoppte.",
  tags: [
    "threat-intelligence",
    "social-engineering",
    "DeceptiveDevelopment",
    "Lazarus",
    "web3-security",
  ],
  title1: "Anatomie eines",
  titleAccent: "DeceptiveDevelopment",
  title2: "-Angriffs",
  subtitle:
    "Wie ein Lazarus-naher “Recruiter” beinahe Code auf dem Rechner eines Entwicklers ausgeführt hätte — und warum ColdVault genau dagegen gebaut wurde.",
  authorName: "ZONOVA RESEARCH",
  authorOrg: "Unabhängige Threat Intelligence",
  publishedOn: "20. April 2026",
  tldrLabel: "TL;DR",
  tldrBody:
    "Im April 2026 wurde ein unabhängiger Forscher von einer nahezu lehrbuchhaften DeceptiveDevelopment-/Contagious-Interview-Kampagne ins Visier genommen, die Lazarus-Subgruppen (DPRK) zugeschrieben wird. Der Angreifer gab sich als Mitgründer von “Invoblox” aus, bot 20–25k USD/Monat und bat darum, ein Bitbucket-Repo zu klonen. Das Repo enthielt eine Abhängigkeit, die das native fs-Modul von Node.js überschrieb — ein klassischer Malware-Loader. Die lokale Installation wurde verweigert, eine wegwerfbare Cloud-Umgebung gefordert, und der Köder wurde abgebrochen.",
  s0Title: "Warum dieser Bericht existiert",
  s0P1:
    "Die meisten Incident-Berichte werden veröffentlicht, nachdem das Opfer gezahlt hat. Dieser hier wird veröffentlicht, weil niemand gezahlt hat — und weil dasselbe Playbook nun industriell gegen Entwickler eingesetzt wird, besonders in Web3.",
  s0P2Lead: "Dieser Beitrag hat drei Aufgaben:",
  s0Bullets: [
    { strong: "Beweise sichern", rest: " — vollständige Transkripte, IOCs, Screenshots für Defender-Pivots." },
    { strong: "Die Psychologie erklären", rest: " — über Transaktionsanalyse, Neurowissenschaft und Cialdinis Einflusshebel." },
    { strong: "Eine fertige Verteidigung übergeben", rest: " — coldvault.dev, eine Codespace-basierte Static-Audit-Sandbox." },
  ],
  s1Title: "Zeitlinie des Angriffs",
  s11Sub: "1.1 Erstkontakt (LinkedIn)",
  s11Quote:
    "Hallo, ich hoffe, es geht Ihnen gut. Wir sind ein führendes Unternehmen in Blockchain und digitaler Innovation, das gerade ein spannendes neues Projekt aufbaut. […] Sie sind eingeladen, als Technical Manager voll-remote, Teil- oder Vollzeit, einzusteigen. Das erwartete Gehalt liegt bei 20k–25k USD/Monat. […] calendly.com/best_collaboration/business",
  s11Lead: "Schon ohne technische Kenntnisse sichtbar:",
  s11Bullets: [
    "Kein Firmenname im Text — leerer Signifikant.",
    "Gehalt vor jedem Interview offengelegt — umgekehrtes Protokoll.",
    "Generischer Calendly-Handle, nicht auf Firmendomain.",
    "Flexibilität noch vor jeder Rollenbeschreibung.",
  ],
  s12Sub: "1.2 Rahmen-Mail vor dem Call",
  s12Quote:
    "Unsere Firmenseite: https://invoblox.com/ Unser Projekt ist eine Krypto-Trading-Plattform der nächsten Generation. […] Mit 6,5 Mio. USD finanziert. […] Dieses Meeting ist eine Einführung, kein technisches Interview.",
  s12Lead: "Drei gestapelte Manipulationen:",
  s12Bullets: [
    { strong: "Eine echt aussehende Website als Existenzbeweis", rest: " — Marken-Piggyback auf einer 4 Jahre alten Domain." },
    { strong: "Eine nicht überprüfbare Finanzierungszahl", rest: " — präzise genug, um real zu klingen, zu klein für Crunchbase." },
    { strong: "“Kein technisches Interview”", rest: " — präventives Senken der Audit-Wachsamkeit." },
  ],
  s13Sub: "1.3 Der 60-minütige “Intro-Call”",
  s13P1:
    "Warmer Einstieg, Validierung des Lebenslaufs, plausibler MERN+Solidity-Pitch, “17 Vollzeitler, 6,5M$ Funding”, 20–25k$/Monat, 2-wöchige bezahlte Probezeit in Stablecoins. Dann gegen Ende die eigentliche Bitte:",
  s13Quote:
    "Könnten Sie unser Repo ziehen und sich die Architektur vor dem CTO-Call ansehen? Einfach klonen, lokal starten, Feedback geben.",
  s13P2Pre: "Repo: ",
  s13P2Repo: "bitbucket.org/teamincwork/pro_lmng",
  s13P2Post: ". Stellenbeschreibung auf einer einzelnen Notion-Seite — wegwerfbar, keine Recruiter-Spuren.",
  s14Sub: "1.4 Was tatsächlich geschah",
  s14P1Pre: "Das Repo wurde geklont. ",
  s14P1Bold: "npm install wurde NICHT ausgeführt.",
  s14P1Mid: " ",
  s14P1Code: "package.json",
  s14P1Post: " wurde gelesen.",
  s14P2Pre:
    "Eine Abhängigkeit imitierte den Namen einer Utility-Bibliothek, ihr veröffentlichter Code aber ",
  s14P2Bold: "überschrieb das native fs-Modul von Node.js zur require-Zeit",
  s14P2Post:
    ". Jeglicher folgender Datei-Zugriff lief dann zuerst durch das bösartige Modul — die tragende Primitive mehrerer von ESET und Unit 42 dokumentierter BeaverTail-Varianten.",
  s14P3:
    "Dem Recruiter wurde mitgeteilt, das Audit fände nur in GitHub Codespaces statt. Er wolle es “in Erwägung ziehen”.",
  s15Sub: "1.5 Der Druck-Follow-up",
  s15Quote: "Können Sie jetzt zum geplanten Meeting kommen?",
  s15P:
    "Ein Satz. Geschlossene Frage. Reine Zeitdruck-Sonde — ein Cialdini-Commitment-Hook unter künstlicher Dringlichkeit. Keine Antwort. Gespräch beendet.",
  s2Title: "Attribution: Das ist DeceptiveDevelopment",
  s2Lead:
    "Jeder Indikator passt 1:1 zum Cluster DeceptiveDevelopment / Contagious Interview, öffentlich dokumentiert von ESET, Palo Alto Unit 42, Group-IB und Zscaler seit 2023:",
  s2TableHead: ["Indikator in diesem Fall", "DeceptiveDevelopment-Signatur"],
  s2Rows: [
    ["Unaufgeforderte LinkedIn-DM eines “Recruiters”", "Hauptkanal"],
    ["“Führendes Blockchain-Unternehmen” — leere Beschreibung", "wiederkehrende Phrase"],
    ["Generischer Calendly-Handle, keine Firmendomain", "dokumentiert"],
    ["20–25k$/Monat sofort genannt", "dokumentiert"],
    ["MERN + Solidity, “Next-Gen Crypto-Trading”", "typisches Cover-Projekt"],
    ["Aufgeblähte Finanzierung (6,5M$) und Team (17/30)", "dokumentiert"],
    ["Repository auf Bitbucket", "bevorzugter Host seit Ende 2024"],
    ["Stellenbeschreibung auf Notion (kein ATS)", "wegwerfbar, keine Spuren"],
    ["Bezahlung in Stablecoins oder ETH", "vermeidet Bank-Tracing"],
    ["Abhängigkeit überschreibt fs-Modul", "BeaverTail/InvisibleFerret-Loader"],
    ["“Kein technisches Interview”", "entschärft Audit-Mindset"],
    ["Sofortiger Druck-Follow-up nach Zögern", "dokumentiert"],
  ],
  s3Title: "Die vom Angreifer erwartete Kill-Chain",
  s3KillChain: [
    { id: "A", text: "Kalte LinkedIn-DM + Calendly" },
    { id: "B", text: "Intro-Call — 60 Min., Vertrauensaufbau" },
    { id: "C", text: "Bitbucket + Notion teilen" },
    { id: "D", text: "Entscheidung: lokale Installation?", decision: true },
    { id: "E", text: "npm install → fs-shadow-Loader feuert" },
    { id: "F", text: "BeaverTail stiehlt Cookies, Wallets, Keychains" },
    { id: "G", text: "InvisibleFerret-Persistenz + AnyDesk-Deploy" },
    { id: "H", text: "Exfiltration: Wallets, SSH, Cloud-Tokens, Kundendaten" },
  ],
  s3DecisionLabel: "← einzige Entscheidung, die das Ergebnis steuert",
  s3Success:
    "Wenn D = nein — Repo in ColdVault auditiert, Angriff scheitert, Angreifer rotiert zum nächsten Ziel.",
  s3Trailer:
    "Schritte A→E dauern unter zwei Stunden. Sobald E feuert, ist die Maschine kompromittiert. Der einzige Entscheidungspunkt, der alles steuert, ist D — führen Sie den Code auf Ihrer eigenen Maschine aus?",
  s4Title: "Warum das bei Senior-Engineers funktioniert",
  s4Lead:
    "Technische Seniorität ist hier keine Verteidigung — in mehrfacher Hinsicht das Gegenteil. Senioren halten Produktions-Credentials und Wallets, sind exponierter auf LinkedIn und empfänglicher für “Ihr Profil hat unsere Aufmerksamkeit erregt”.",
  s41Sub: "4.1 Transaktionsanalyse — welcher Zustand wird angesprochen",
  s41TableHead: ["Soziale Botschaft (explizit)", "Psychologisches Ziel (implizit)"],
  s41Rows: [
    ["“Wir würden gern mit jemandem Ihres Kalibers arbeiten.”", "Nährendes Eltern-Ich — auf Anerkennung reagieren."],
    ["“Wir sind flexibel beim Zeitplan.”", "Angepasstes Kind — entgegenkommend sein."],
    ["“Kein technisches Interview, nur Intro.”", "Erwachsenen-Ich — Audit deaktivieren."],
    ["“Können Sie einfach klonen und starten?”", "Angepasstes Kind — gehorchen, sich beweisen."],
    ["“Können Sie jetzt ins Meeting kommen?”", "Angepasstes Kind — nicht enttäuschen."],
  ],
  s41After:
    "Eine gesunde Gegenmaßnahme ist die gekreuzte Transaktion: Erwachsener-zu-Erwachsener antworten. “Ich auditiere das Repo in einer Wegwerf-Umgebung, bevor irgendetwas installiert wird” bricht das Skript.",
  s42Sub: "4.2 Neurowissenschaft — drei gehijackte Systeme",
  s42Bullets: [
    { strong: "Belohnungsvorhersage (VTA → Nucleus accumbens).", rest: " 25k$/Monat wird als positiver Vorhersagefehler kodiert; Dopamin kodiert nicht Lust, sondern Motivation, die Vorhersage zu schützen — also motiviertes Denken." },
    { strong: "Vertrauenskodierung (Nucleus caudatus).", rest: " Eine warme Stunde mit technischem Jargon reicht für eine neurale Vertrauenssignatur, die Logik kaum übersteuert." },
    { strong: "Entscheidungsmüdigkeit (vmPFC, dlPFC).", rest: " Neuheit + sozialer Druck + Informationsdichte + Dringlichkeit hungern den Hirnteil aus, der sagt “warte, lies package.json”." },
  ],
  s43Sub: "4.3 Cialdini-Stack — in Reihenfolge des Auftretens",
  s43Items: [
    { strong: "Autorität", rest: " — “Mitgründer”, “CTO kommt später”, “6,5M$ finanziert”." },
    { strong: "Soziale Bewährtheit", rest: " — “17 Vollzeitler, 7 Senioren”." },
    { strong: "Sympathie", rest: " — warmer Ton, persönliche Schmeichelei, LinkedIn-Mirroring." },
    { strong: "Reziprozität", rest: " — bezahlte 2-Wochen-Probe vor jeglicher Arbeit." },
    { strong: "Commitment & Konsistenz", rest: " — nach einer investierten Stunde wirkt “nur klonen” abzulehnen unverhältnismäßig." },
    { strong: "Knappheit / Dringlichkeit", rest: " — “MVP in 6 Monaten”, “können Sie jetzt kommen?”." },
  ],
  s44Sub: "4.4 Warum “ich bin zu schlau dafür” die falsche Verteidigung ist",
  s44P:
    "Jeder öffentliche Opferbericht enthält eine Variante von “ich dachte, ich sei vorsichtig genug”. Intelligenz ist nicht die Verteidigung. Verfahren ist es. Die Verteidigung ist architektonisch: Entfernen Sie Ihre Fähigkeit, nicht-vertrauten Code auf einer wichtigen Maschine zu installieren.",
  s5Title: "Der defensive Reflex — und das Tool, das ihn automatisiert",
  s5RuleLabel: "Die Regel",
  s5Rule:
    "Führen Sie niemals nicht-vertrauten Code auf einer Maschine aus, die etwas Wertvolles enthält.",
  s5Lead: "Zwei praktische Korollare:",
  s5Bullets: [
    { strong: "Getrennte Maschinen oder getrennte Grenzen.", rest: " Der Laptop mit Schlüsseln, Wallets, Credentials und SSH-Identitäten ist nicht der, auf dem Sie fremden Code auswerten. Bei nur einem Gerät muss die “zweite Maschine” eine Wegwerf-VM sein." },
    { strong: "Lesen vor dem Ausführen.", rest: " Jede package.json, pyproject.toml, Cargo.toml wird vor jeder Installation auditiert. postinstall-, preinstall-, prepare-Skripte werden gelesen." },
  ],
  s52Sub: "5.2 Was ColdVault tut",
  s52Bullets: [
    "Das verdächtige Repo wird als read-only git-Submodul unter target/ eingebunden.",
    "Analyse läuft in einem GitHub Codespace — flüchtige VM, Blast Radius = ein Container.",
    "40+ Security-Tools vorinstalliert: SAST, SCA, Secret-Hunter, Malware-Triage, IaC-Scanner, SBOM.",
    "Kuratierte Claude-Code-Skills verwandeln “prüfe dieses Repo” in eine reproduzierbare Pipeline.",
    "Ausgabe: reports/findings.json, SUMMARY.md, SARIF, CycloneDX SBOM.",
  ],
  s52CodeNote: "",
  s52After:
    "Fünf Minuten später sagt reports/SUMMARY.md, ob die fs-Shadowing-Abhängigkeit existiert, ob postinstall-Hooks verdächtig sind, ob YARA auf gebündelten Binaries trifft — und ob Payloads off-screen hinter Horizontal-Scroll versteckt sind.",
  s6Title: "Feld-Checkliste",
  s6P:
    "Das vollständige Reflexe- & Response-Playbook lebt auf einer eigenen Seite — laminieren-und-neben-die-Tastatur-pinnen.",
  s6Cta: "Playbook öffnen",
  s7Title: "Indikatoren der Kompromittierung",
  s71Sub: "7.1 Infrastruktur",
  s71TableHead: ["Typ", "Wert", "Rolle"],
  s71Rows: [
    ["Bitbucket-Workspace", "teamincwork", "Hostet bösartiges Repo"],
    ["Repository", "bitbucket.org/teamincwork/pro_lmng", "Payload-Auslieferung"],
    ["Notion-Seite", "notion.so/Technical-Lead-2e8561…", "Falsche Stellenbeschreibung"],
    ["Calendly-Handle", "calendly.com/best_collaboration/business", "Terminköder"],
    ["Cover-Marken-Domain", "invoblox.com", "Imitierte Marke"],
    ["Recruiter-Alias", "“Lucas Silva” (LinkedIn)", "Persona"],
  ],
  s72Sub: "7.2 Verhaltensmuster (TTPs)",
  s72Bullets: [
    "Unaufgeforderte LinkedIn-DM → Calendly → 60-Min-Intro-Call.",
    "Firma mit leerer Beschreibung als Opener.",
    "20–25k$/Monat vor dem Interview.",
    "Repo auf Bitbucket; Stelle auf Notion.",
    "Payload via Abhängigkeit, die Nodes fs überschreibt.",
    "Sofortiger Druck-Follow-up bei Zögern.",
  ],
  s73Sub: "7.3 Technische Muster zum Scannen",
  s73Bullets: [
    "postinstall / preinstall / prepare führen Dependency-Code aus.",
    "Abhängigkeiten an einen Git-Commit gepinnt (keine npm-Version).",
    "Typo-Squat-Namen: ethers-utils, web3-helper, node-fs-helper, react-native-utils…",
    "Quelldateien > 100 KB in leichten Frontend-Projekten.",
    "Horizontal-Scroll versteckt Payload off-screen in einer Zeile.",
    "Dichte base64/hex an eval, Function, new Function übergeben.",
    "Module, die fs, child_process, crypto, https, net, process monkey-patchen.",
  ],
  s9Title: "Schluss",
  s9P1:
    "Der Forscher hatte Glück — nicht weil er besonders scharf war, sondern weil er package.json vor dem npm install las und die Codespaces-Option hatte. Glück ist kein Sicherheitsmodell. Verfahren ist es.",
  s9P2Pre: "Eine Erkenntnis: ",
  s9P2Bold: "Trennen Sie die Audit-Maschine von der Wert-Maschine.",
  s9P2Mid: " Eine zweite: Behandeln Sie eine unaufgeforderte Hochgehalts-DM nicht als Chance — sondern als ",
  s9P2Bold2: "Triage-Ereignis",
  s9Slogan: "Bleib kalt. Bleib im Tresor.",
  s9Author: "— ZONOVA RESEARCH",
  navHome: "Startseite",
  navPlaybook: "Playbook",
  ctaGetColdvault: "ColdVault holen",
  ctaReadPlaybook: "Playbook lesen",
  footerPublishedBy: "Veröffentlicht von",
  footerSuffix: ". MIT-lizenziert. PRs willkommen.",
};

const es: ArticleDict = {
  metaTitle:
    "Anatomía de un ataque DeceptiveDevelopment — cómo un “reclutador” vinculado a Lazarus casi ejecutó código en mi máquina",
  metaDescription:
    "Estudio de caso de primera mano de una campaña de falsos reclutadores estilo norcoreano: enfoque por LinkedIn, payload en Bitbucket, mecánica psicológica, IOCs y la arquitectura defensiva que la detuvo.",
  tags: [
    "threat-intelligence",
    "ingeniería-social",
    "DeceptiveDevelopment",
    "Lazarus",
    "seguridad-web3",
  ],
  title1: "Anatomía de un ataque",
  titleAccent: "DeceptiveDevelopment",
  title2: "",
  subtitle:
    "Cómo un “reclutador” vinculado a Lazarus casi ejecutó código en la máquina de un desarrollador — y por qué ColdVault fue creado para evitarlo.",
  authorName: "ZONOVA RESEARCH",
  authorOrg: "Inteligencia de amenazas independiente",
  publishedOn: "20 de abril de 2026",
  tldrLabel: "TL;DR",
  tldrBody:
    "En abril de 2026, un investigador independiente fue el blanco de una ejecución casi de manual de la campaña DeceptiveDevelopment / Contagious Interview, atribuida a subgrupos de Lazarus (RPDC). El atacante se hizo pasar por cofundador de “Invoblox”, ofreció USD 20–25k/mes y pidió clonar un repositorio en Bitbucket. El repo contenía una dependencia que sombreaba el módulo nativo fs de Node.js — un cargador de malware de manual. Se rechazó la instalación local, se exigió un entorno cloud desechable y el cebo fue abandonado.",
  s0Title: "Por qué existe este artículo",
  s0P1:
    "La mayoría de los post mortem se publican después de que la víctima paga. Este se publica porque nadie pagó, y porque el playbook ahora se usa a escala industrial contra la comunidad de desarrolladores — especialmente en Web3.",
  s0P2Lead: "Este artículo tiene tres tareas:",
  s0Bullets: [
    { strong: "Preservar la evidencia", rest: " — transcripciones completas, IOCs y capturas para que los defensores puedan pivotar sobre la infraestructura." },
    { strong: "Explicar la psicología", rest: " — vía Análisis Transaccional, neurociencia y palancas de influencia de Cialdini." },
    { strong: "Entregar una defensa lista", rest: " — coldvault.dev, un sandbox de auditoría estática basado en Codespaces." },
  ],
  s1Title: "Cronología del ataque",
  s11Sub: "1.1 Contacto inicial (LinkedIn)",
  s11Quote:
    "Hola, espero que esté bien. Somos una empresa líder en blockchain e innovación digital, construyendo un nuevo proyecto. […] Le invitamos como Technical Manager, full remote, tiempo parcial o completo. El salario esperado es de 20k–25k USD/mes. […] calendly.com/best_collaboration/business",
  s11Lead: "Visible ya sin ninguna habilidad técnica:",
  s11Bullets: [
    "Ningún nombre de empresa en el cuerpo del mensaje — significante vacío.",
    "Salario revelado antes de cualquier entrevista — protocolo invertido.",
    "Handle Calendly genérico, fuera de dominio corporativo.",
    "Flexibilidad ofrecida antes de cualquier descripción del puesto.",
  ],
  s12Sub: "1.2 Email de encuadre antes de la llamada",
  s12Quote:
    "Este es el sitio de la empresa: https://invoblox.com/ Nuestro proyecto es una plataforma de trading cripto de nueva generación. […] Respaldado con 6,5M USD. […] Esta reunión es introductoria, no un entrevista técnica.",
  s12Lead: "Tres manipulaciones apiladas:",
  s12Bullets: [
    { strong: "Un sitio de aspecto real como prueba de existencia", rest: " — piggyback de marca en un dominio de 4 años." },
    { strong: "Cifra de financiación no verificable", rest: " — lo bastante precisa para sonar real, demasiado pequeña para Crunchbase." },
    { strong: "“No es entrevista técnica”", rest: " — bajada preventiva de la guardia auditiva." },
  ],
  s13Sub: "1.3 La “llamada de intro” de 60 minutos",
  s13P1:
    "Apertura cálida, validación del CV, pitch plausible MERN + Solidity, “17 a tiempo completo, 6,5M$ levantados”, USD 20–25k/mes, prueba pagada de 2 semanas en stablecoins. Cerca del final, la verdadera petición:",
  s13Quote:
    "¿Podría clonar nuestro repo y revisar la arquitectura antes de la llamada con el CTO? Solo clónelo y ejecútelo localmente, denos su feedback.",
  s13P2Pre: "Repo: ",
  s13P2Repo: "bitbucket.org/teamincwork/pro_lmng",
  s13P2Post: ". Descripción del puesto en una página Notion aislada — desechable, sin huella de reclutador.",
  s14Sub: "1.4 Lo que realmente ocurrió",
  s14P1Pre: "El repo fue clonado. ",
  s14P1Bold: "npm install NO se ejecutó.",
  s14P1Mid: " Se leyó ",
  s14P1Code: "package.json",
  s14P1Post: ".",
  s14P2Pre: "Se encontró una dependencia cuyo nombre imitaba una librería utilitaria pero cuyo código publicado ",
  s14P2Bold: "sobrescribía el módulo nativo fs de Node.js en tiempo de require",
  s14P2Post:
    ". Cualquier código posterior leyendo o escribiendo archivos pasaría primero por el módulo malicioso — la primitiva clave de varias variantes de BeaverTail documentadas por ESET y Unit 42.",
  s14P3:
    "Se le dijo al reclutador que la auditoría solo ocurriría en GitHub Codespaces. Dijo que lo “consideraría”.",
  s15Sub: "1.5 El follow-up de presión",
  s15Quote: "¿Puede unirse a la reunión ahora?",
  s15P:
    "Una frase. Pregunta cerrada. Sonda pura de presión temporal — un gancho clásico de compromiso-coherencia de Cialdini bajo urgencia artificial. Sin respuesta. Conversación terminada.",
  s2Title: "Atribución: esto es DeceptiveDevelopment",
  s2Lead:
    "Cada indicador de este caso encaja 1:1 con el cluster DeceptiveDevelopment / Contagious Interview documentado públicamente por ESET, Palo Alto Unit 42, Group-IB y Zscaler desde 2023:",
  s2TableHead: ["Indicador en este caso", "Firma DeceptiveDevelopment"],
  s2Rows: [
    ["DM no solicitado de un “reclutador” en LinkedIn", "canal principal"],
    ["“Empresa líder en blockchain” — descripción vacía", "frase recurrente"],
    ["Calendly genérico, fuera de dominio corporativo", "documentado"],
    ["Salario 20–25k$/mes anunciado de inicio", "documentado"],
    ["MERN + Solidity, “plataforma cripto next-gen”", "proyecto de cobertura típico"],
    ["Financiación inflada (6,5M$) y equipo (17/30)", "documentado"],
    ["Repositorio en Bitbucket", "host preferido desde finales de 2024"],
    ["Descripción en Notion (sin ATS)", "desechable, sin rastro"],
    ["Pago en stablecoins o ETH", "evita rastreo bancario"],
    ["Dependencia que sobrescribe fs", "loader BeaverTail/InvisibleFerret"],
    ["“No es entrevista técnica”", "desactiva mentalidad de auditoría"],
    ["Follow-up de presión inmediato tras dudar", "documentado"],
  ],
  s3Title: "La kill chain esperada por el atacante",
  s3KillChain: [
    { id: "A", text: "DM frío en LinkedIn + Calendly" },
    { id: "B", text: "Llamada intro — 60 min, construcción de confianza" },
    { id: "C", text: "Compartir Bitbucket + Notion" },
    { id: "D", text: "Decisión: ¿instalación local?", decision: true },
    { id: "E", text: "npm install → loader fs-shadow se dispara" },
    { id: "F", text: "BeaverTail roba cookies, wallets, llaveros" },
    { id: "G", text: "InvisibleFerret: persistencia + despliegue de AnyDesk" },
    { id: "H", text: "Exfil: wallets, SSH, tokens cloud, datos de clientes" },
  ],
  s3DecisionLabel: "← única decisión que controla todo el resultado",
  s3Success:
    "Si D = no — repo auditado en ColdVault, ataque fracasa, atacante rota al siguiente objetivo.",
  s3Trailer:
    "Los pasos A→E toman menos de dos horas. Una vez disparado E, la máquina está comprometida. El único punto de decisión es D — ¿ejecutas el código en tu propia máquina?",
  s4Title: "Por qué funciona en ingenieros senior",
  s4Lead:
    "La seniority técnica no es una defensa aquí — en varios sentidos es lo contrario. Los seniors tienen credenciales de prod y wallets, están más expuestos en LinkedIn, y son más sensibles a “tu perfil llamó nuestra atención”.",
  s41Sub: "4.1 Análisis Transaccional — qué estado se aborda",
  s41TableHead: ["Mensaje social (explícito)", "Objetivo psicológico (implícito)"],
  s41Rows: [
    ["“Nos encantaría trabajar con alguien de tu calibre.”", "Padre Nutritivo — responder al reconocimiento."],
    ["“Somos flexibles con el horario.”", "Niño Adaptado — ser complaciente."],
    ["“No es entrevista técnica, solo intro.”", "Adulto — desactiva la auditoría."],
    ["“¿Puedes solo clonar y ejecutar?”", "Niño Adaptado — obedecer, demostrar valía."],
    ["“¿Te unes a la reunión ahora?”", "Niño Adaptado — no decepcionar."],
  ],
  s41After:
    "Una contramedida sana es la transacción cruzada: responder Adulto a Adulto. “Auditaré el repo en un entorno desechable antes de cualquier instalación” rompe el guion.",
  s42Sub: "4.2 Neurociencia — tres sistemas hijackeados",
  s42Bullets: [
    { strong: "Predicción de recompensa (VTA → núcleo accumbens).", rest: " 25k$/mes se codifica como error positivo de predicción; la dopamina codifica motivación a proteger la predicción — razonamiento motivado." },
    { strong: "Codificación de confianza (núcleo caudado).", rest: " Una hora cálida con jerga técnica basta para una firma neural de confianza difícil de revertir con lógica." },
    { strong: "Fatiga de decisión (vmPFC, dlPFC).", rest: " Novedad + presión social + densidad de información + urgencia agotan al cerebro que dice “espera, lee package.json”." },
  ],
  s43Sub: "4.3 Stack Cialdini — en orden de aparición",
  s43Items: [
    { strong: "Autoridad", rest: " — “cofundador”, “el CTO se unirá luego”, “6,5M$ respaldados”." },
    { strong: "Prueba social", rest: " — “17 full-time, 7 senior”." },
    { strong: "Simpatía", rest: " — tono cálido, halago personalizado, mirroring de LinkedIn." },
    { strong: "Reciprocidad", rest: " — prueba pagada de 2 semanas antes de cualquier trabajo." },
    { strong: "Compromiso & coherencia", rest: " — tras una hora invertida, negar “solo clonar” parece desproporcionado." },
    { strong: "Escasez / urgencia", rest: " — “MVP en 6 meses”, “¿te unes ahora?”." },
  ],
  s44Sub: "4.4 Por qué “soy demasiado listo para esto” es la defensa equivocada",
  s44P:
    "Cada testimonio público de víctima incluye una variante de “pensé que era demasiado cuidadoso”. La inteligencia no es la defensa. El procedimiento sí. La defensa es arquitectónica: elimina tu capacidad de instalar código no confiable en una máquina que importa.",
  s5Title: "El reflejo defensivo — y la herramienta que lo automatiza",
  s5RuleLabel: "La regla",
  s5Rule:
    "Nunca ejecutes código no confiable en una máquina que contenga algo de valor para ti.",
  s5Lead: "Dos corolarios prácticos:",
  s5Bullets: [
    { strong: "Máquinas separadas, o fronteras separadas.", rest: " El portátil con tus claves, wallets, credenciales y SSH no es el portátil donde evalúas código de extraños. Si solo tienes uno, la “segunda máquina” debe ser una VM desechable." },
    { strong: "Lee antes de ejecutar.", rest: " Cada package.json, pyproject.toml, Cargo.toml se audita antes de cualquier instalación. Los scripts postinstall, preinstall, prepare se leen." },
  ],
  s52Sub: "5.2 Qué hace ColdVault",
  s52Bullets: [
    "El repo sospechoso se monta como submódulo git de solo lectura bajo target/.",
    "El análisis corre dentro de un GitHub Codespace — VM efímera, radio de impacto = un container.",
    "Más de 40 herramientas de seguridad pre-instaladas: SAST, SCA, cazadores de secretos, triage de malware, escáneres IaC, SBOM.",
    "Skills curados de Claude Code convierten “revisa este repo” en pipeline reproducible.",
    "Salida: reports/findings.json, SUMMARY.md, SARIF, SBOM CycloneDX.",
  ],
  s52CodeNote: "",
  s52After:
    "Cinco minutos después, reports/SUMMARY.md te dice si la dependencia fs-shadow está, si los hooks postinstall son sospechosos, si YARA matchea binarios — y si hay payloads ocultos fuera de pantalla por scroll horizontal.",
  s6Title: "Checklist de campo",
  s6P:
    "El playbook completo de reflejos & respuesta vive en su propia página — formato plastifícalo-y-pégalo-junto-al-teclado.",
  s6Cta: "Abrir el Playbook",
  s7Title: "Indicadores de Compromiso",
  s71Sub: "7.1 Infraestructura",
  s71TableHead: ["Tipo", "Valor", "Rol"],
  s71Rows: [
    ["Workspace Bitbucket", "teamincwork", "Hospeda repo malicioso"],
    ["Repositorio", "bitbucket.org/teamincwork/pro_lmng", "Entrega del payload"],
    ["Página Notion", "notion.so/Technical-Lead-2e8561…", "Falsa descripción del puesto"],
    ["Handle Calendly", "calendly.com/best_collaboration/business", "Cebo de calendario"],
    ["Dominio de cobertura", "invoblox.com", "Marca suplantada"],
    ["Alias del reclutador", "“Lucas Silva” (LinkedIn)", "Persona"],
  ],
  s72Sub: "7.2 Patrón conductual (TTPs)",
  s72Bullets: [
    "DM no solicitado en LinkedIn → Calendly → llamada intro 60 min.",
    "Empresa con descripción vacía como apertura.",
    "Banda salarial 20–25k$/mes anunciada antes de la entrevista.",
    "Repo en Bitbucket; descripción en Notion.",
    "Payload vía dependencia que sobrescribe fs.",
    "Follow-up de presión inmediato si dudas.",
  ],
  s73Sub: "7.3 Patrones técnicos a escanear",
  s73Bullets: [
    "postinstall / preinstall / prepare ejecutando código de dependencias.",
    "Dependencias fijadas a un commit git (no versión npm).",
    "Nombres typosquat: ethers-utils, web3-helper, node-fs-helper, react-native-utils…",
    "Archivos fuente > 100 KB en proyectos front-end ligeros.",
    "Scroll horizontal ocultando payload fuera de pantalla en una sola línea.",
    "Base64/hex denso pasado a eval, Function, new Function.",
    "Módulos parcheando fs, child_process, crypto, https, net, process.",
  ],
  s9Title: "Cierre",
  s9P1:
    "El investigador tuvo suerte — no por ser especialmente agudo, sino por leer package.json antes de ejecutar npm install y por tener la opción Codespaces. La suerte no es un modelo de seguridad. El procedimiento sí.",
  s9P2Pre: "Si te llevas una cosa: ",
  s9P2Bold: "desacopla la máquina de auditoría de la máquina de valor.",
  s9P2Mid: " Si te llevas dos: no trates un DM no solicitado de salario alto como oportunidad — trátalo como un ",
  s9P2Bold2: "evento de triage",
  s9Slogan: "Mantente frío. Mantente en bóveda.",
  s9Author: "— ZONOVA RESEARCH",
  navHome: "Inicio",
  navPlaybook: "Playbook",
  ctaGetColdvault: "Obtener ColdVault",
  ctaReadPlaybook: "Leer el Playbook",
  footerPublishedBy: "Publicado por",
  footerSuffix: ". Licencia MIT. Se aceptan PRs.",
};

const zh: ArticleDict = {
  metaTitle: "DeceptiveDevelopment 攻击解剖 — 与 Lazarus 相关的“招聘者”险些在我机器上运行代码",
  metaDescription:
    "亲历的朝鲜式假招聘者攻击案例研究：LinkedIn 接触、Bitbucket 载荷、心理操控、IOC 与阻止攻击的防御架构。",
  tags: ["威胁情报", "社会工程", "DeceptiveDevelopment", "Lazarus", "Web3 安全"],
  title1: "解剖一次",
  titleAccent: "DeceptiveDevelopment",
  title2: "攻击",
  subtitle:
    "一名与 Lazarus 相关的“招聘者”险些在开发者的机器上运行代码 — 以及 ColdVault 为什么诞生。",
  authorName: "ZONOVA RESEARCH",
  authorOrg: "独立威胁情报",
  publishedOn: "2026 年 4 月 20 日",
  tldrLabel: "摘要",
  tldrBody:
    "2026 年 4 月,一位独立研究员遭遇了几乎教科书式的 DeceptiveDevelopment / Contagious Interview 行动,该集群被归因于 Lazarus(朝鲜)子组。攻击者自称“Invoblox”联合创始人,提供月薪 2 万 ~2.5 万美元,要求克隆一个 Bitbucket 仓库。仓库中包含一个会覆盖 Node.js 原生 fs 模块的依赖 — 经典的恶意加载器。研究员拒绝本地安装,坚持只在一次性云环境中分析,诱饵被放弃。",
  s0Title: "为何写这篇文章",
  s0P1: "大多数事件复盘是在受害者付钱之后才发布。本文之所以发布,是因为没人付钱,而且这套剧本现在正以工业化规模针对开发者社区 — 尤其是 Web3 开发者。",
  s0P2Lead: "本文有三个目的:",
  s0Bullets: [
    { strong: "保存证据", rest: " — 完整对话、IOC、截图,供防御方对基础设施做关联分析。" },
    { strong: "解释心理机制", rest: " — 通过交流分析、神经科学和 Cialdini 影响力杠杆。" },
    { strong: "提供现成防御", rest: " — coldvault.dev,基于 Codespaces 的静态审计沙盒。" },
  ],
  s1Title: "攻击时间线",
  s11Sub: "1.1 初次接触(LinkedIn)",
  s11Quote:
    "您好,很高兴联系您。我们是一家在区块链与数字创新领域处于领先地位的公司,正在打造一个新项目。[…] 欢迎以 Technical Manager 身份加入我们,完全远程,兼职或全职皆可。预期月薪 2 万 ~2.5 万美元。[…] calendly.com/best_collaboration/business",
  s11Lead: "无需任何技术背景就能看到的问题:",
  s11Bullets: [
    "正文未提公司名 — 空洞能指。",
    "面试前就披露薪资 — 协议被颠倒。",
    "通用 Calendly 链接,不是公司域名。",
    "在描述岗位之前就提供灵活性。",
  ],
  s12Sub: "1.2 通话前的铺垫邮件",
  s12Quote:
    "公司网站:https://invoblox.com/ 我们的项目是一个下一代加密货币交易平台。[…] 已获 650 万美元投资。[…] 这次会议是介绍性沟通,不是技术面试。",
  s12Lead: "三层堆叠操控:",
  s12Bullets: [
    { strong: "看似真实的网站作为存在证明", rest: " — 借用一个 4 年老域名做品牌寄生。" },
    { strong: "无法核实的融资数字", rest: " — 精确到像真,小到不在 Crunchbase。" },
    { strong: "“不是技术面试”", rest: " — 提前降低审计警惕。" },
  ],
  s13Sub: "1.3 60 分钟“介绍通话”",
  s13P1:
    "热情开场,验证背景,合理的 MERN + Solidity 推介,“17 名全职、融资 650 万美元”,月薪 2~2.5 万美元,2 周稳定币付费试用。临近结尾,真正的请求:",
  s13Quote: "您能拉一下我们的仓库,在与 CTO 通话前看看架构吗?克隆并本地运行,给我们反馈。",
  s13P2Pre: "仓库:",
  s13P2Repo: "bitbucket.org/teamincwork/pro_lmng",
  s13P2Post: "。岗位描述放在一个独立 Notion 页面 — 一次性,无招聘平台痕迹。",
  s14Sub: "1.4 实际发生了什么",
  s14P1Pre: "仓库被克隆。",
  s14P1Bold: "并未运行 npm install。",
  s14P1Mid: " 阅读了 ",
  s14P1Code: "package.json",
  s14P1Post: "。",
  s14P2Pre: "发现一个名字模仿工具库的依赖,但其发布代码 ",
  s14P2Bold: "在 require 阶段覆盖了 Node.js 原生 fs 模块",
  s14P2Post:
    "。任何后续读写文件的代码都会先经过恶意模块 — 这是 ESET 与 Unit 42 记录的多个 BeaverTail 变种的承重原语。",
  s14P3: "告知招聘者审计将仅在 GitHub Codespaces 中进行。他说会“考虑”。",
  s15Sub: "1.5 施压跟进",
  s15Quote: "您现在能加入预定的会议吗?",
  s15P:
    "一句话。封闭式问题。纯粹的时间压力探针 — Cialdini 承诺-一致性钩子的人为紧迫感。无回复。对话结束。",
  s2Title: "归因:这就是 DeceptiveDevelopment",
  s2Lead:
    "本案中每个指标都与 ESET、Palo Alto Unit 42、Group-IB 与 Zscaler 自 2023 年起公开记录的 DeceptiveDevelopment / Contagious Interview 集群 1:1 对应:",
  s2TableHead: ["本案指标", "DeceptiveDevelopment 签名"],
  s2Rows: [
    ["来自“招聘者”的未请求 LinkedIn 私信", "主要渠道"],
    ["“区块链领先公司” — 空泛描述", "重复用语"],
    ["通用 Calendly,非企业域名", "已记录"],
    ["月薪 2~2.5 万美元提前公布", "已记录"],
    ["MERN + Solidity,“下一代加密交易”", "典型掩护项目"],
    ["夸大融资(650 万美元)与团队(17/30)", "已记录"],
    ["仓库托管在 Bitbucket", "2024 年底起首选宿主"],
    ["岗位描述在 Notion(无 ATS)", "一次性,无痕迹"],
    ["以稳定币或 ETH 付款", "规避银行追踪"],
    ["覆盖 fs 模块的依赖", "BeaverTail/InvisibleFerret 加载器"],
    ["“这不是技术面试”", "瓦解审计心态"],
    ["犹豫后立即施压跟进", "已记录"],
  ],
  s3Title: "攻击者预期的 Kill Chain",
  s3KillChain: [
    { id: "A", text: "LinkedIn 冷私信 + Calendly" },
    { id: "B", text: "60 分钟介绍通话,建立信任" },
    { id: "C", text: "分享 Bitbucket + Notion" },
    { id: "D", text: "决定:是否本地安装?", decision: true },
    { id: "E", text: "npm install → fs-shadow 加载器触发" },
    { id: "F", text: "BeaverTail 窃取 cookie、钱包、钥匙串" },
    { id: "G", text: "InvisibleFerret 持久化 + 部署 AnyDesk" },
    { id: "H", text: "外渗:钱包、SSH、云令牌、客户数据" },
  ],
  s3DecisionLabel: "← 决定整体结果的唯一节点",
  s3Success: "若 D = 否 — 仓库在 ColdVault 中审计,攻击失败,攻击者转向下一目标。",
  s3Trailer:
    "A→E 不到两小时。一旦 E 触发,机器即被攻陷。控制全局的唯一决策点是 D — 你是否在自己机器上运行代码?",
  s4Title: "为何对资深工程师有效",
  s4Lead:
    "技术资深在此并非防御 — 在多个意义上恰恰相反。资深者掌握生产凭证与钱包,在 LinkedIn 上更暴露,且更容易被“您的背景吸引了我们注意”所触动。",
  s41Sub: "4.1 交流分析 — 被针对的自我状态",
  s41TableHead: ["社会信息(显性)", "心理目标(隐性)"],
  s41Rows: [
    ["“我们很想与您这种水平的人合作。”", "养育型父母 — 回应被认可。"],
    ["“我们时间灵活。”", "适应型儿童 — 反过来配合。"],
    ["“这不是技术面试,只是介绍。”", "成人 — 关闭审计。"],
    ["“您能直接克隆并运行吗?”", "适应型儿童 — 服从,证明自己。"],
    ["“您现在能加入会议吗?”", "适应型儿童 — 不让对方失望。"],
  ],
  s41After:
    "健康的反制是交叉沟通:成人对成人地回复,拒绝隐含框架。“我会先在一次性环境里审计仓库再安装”能打破剧本。",
  s42Sub: "4.2 神经科学 — 三个被劫持的系统",
  s42Bullets: [
    { strong: "奖赏预测(VTA → 伏隔核)。", rest: " 月薪 2.5 万被编码为正向预测误差;多巴胺并非编码愉悦,而是编码保护该预测的动机 — 即动机性推理。" },
    { strong: "信任编码(尾状核)。", rest: " 一小时温暖加技术行话,足以留下逻辑难以撤销的神经信任印记。" },
    { strong: "决策疲劳(vmPFC、dlPFC)。", rest: " 新颖+社会压力+信息密度+紧迫,使大脑中负责“等等,先看 package.json”的部分被饿死。" },
  ],
  s43Sub: "4.3 Cialdini 堆栈 — 出现顺序",
  s43Items: [
    { strong: "权威", rest: " — “联合创始人”、“CTO 稍后加入”、“融资 650 万美元”。" },
    { strong: "社会认同", rest: " — “17 名全职,7 名资深”。" },
    { strong: "喜好", rest: " — 温暖语气、个性化恭维、LinkedIn 镜像。" },
    { strong: "互惠", rest: " — 工作开始前先给 2 周付费试用。" },
    { strong: "承诺与一致", rest: " — 投入一小时后,拒绝“只是克隆仓库”显得不成比例。" },
    { strong: "稀缺/紧迫", rest: " — “6 个月内 MVP”、“现在能加入吗?”。" },
  ],
  s44Sub: "4.4 为何“我没那么蠢”是错误的防御",
  s44P:
    "每一份公开的受害者复盘都包含“我以为我够小心”的版本。智力不是防御。流程才是。防御是架构性的:剥夺自己在重要机器上安装不可信代码的能力。",
  s5Title: "防御反射 — 以及自动化它的工具",
  s5RuleLabel: "规则",
  s5Rule: "永远不要在保存任何重要资产的机器上执行不可信代码。",
  s5Lead: "两条实践推论:",
  s5Bullets: [
    { strong: "分离机器,或分离边界。", rest: " 装着钥匙、钱包、凭证与 SSH 身份的笔记本,不应是评估陌生人代码的笔记本。如果只有一台,“第二台机器”必须是一次性 VM。" },
    { strong: "先读后跑。", rest: " 任何 package.json、pyproject.toml、Cargo.toml 在安装前都要审计。postinstall、preinstall、prepare 脚本必须读。" },
  ],
  s52Sub: "5.2 ColdVault 做什么",
  s52Bullets: [
    "可疑仓库以只读 git 子模块挂载在 target/ 下。",
    "分析在 GitHub Codespace 中运行 — 短命 VM,影响半径=单个容器。",
    "预装 40+ 安全工具:SAST、SCA、密钥猎手、恶意软件分诊、IaC 扫描器、SBOM。",
    "精选 Claude Code 技能将“审计这个仓库”转为可复现流水线。",
    "输出:reports/findings.json、SUMMARY.md、SARIF、CycloneDX SBOM。",
  ],
  s52CodeNote: "",
  s52After:
    "五分钟后,reports/SUMMARY.md 会告诉你 fs 影子依赖是否存在、postinstall 钩子是否可疑、YARA 是否命中绑定二进制 — 以及是否有 payload 通过水平滚动隐藏在屏幕外。",
  s6Title: "现场清单",
  s6P: "完整的反射与响应 playbook 在独立页面 — 适合塑封贴在键盘旁。",
  s6Cta: "打开 Playbook",
  s7Title: "妥协指标 (IOC)",
  s71Sub: "7.1 基础设施",
  s71TableHead: ["类型", "值", "作用"],
  s71Rows: [
    ["Bitbucket workspace", "teamincwork", "托管恶意仓库"],
    ["仓库", "bitbucket.org/teamincwork/pro_lmng", "投递载荷"],
    ["Notion 页", "notion.so/Technical-Lead-2e8561…", "假岗位描述"],
    ["Calendly handle", "calendly.com/best_collaboration/business", "约会诱饵"],
    ["掩护品牌域", "invoblox.com", "被冒用品牌"],
    ["招聘者别名", "“Lucas Silva” (LinkedIn)", "Persona"],
  ],
  s72Sub: "7.2 行为模式 (TTPs)",
  s72Bullets: [
    "未请求的 LinkedIn 私信 → Calendly → 60 分钟介绍通话。",
    "以空泛公司描述开场。",
    "面试前公布 2~2.5 万美元月薪。",
    "仓库在 Bitbucket;描述在 Notion。",
    "通过覆盖 Node fs 的依赖投递载荷。",
    "犹豫后立即施压跟进。",
  ],
  s73Sub: "7.3 可扫描的技术模式",
  s73Bullets: [
    "postinstall / preinstall / prepare 运行依赖代码。",
    "依赖固定到 git commit(而非 npm 版本)。",
    "拼写抢注名:ethers-utils、web3-helper、node-fs-helper、react-native-utils…",
    "轻量前端项目中存在 > 100 KB 的源文件。",
    "水平滚动将载荷藏到屏幕外的一行内。",
    "传给 eval、Function、new Function 的密集 base64/hex。",
    "Monkey-patch fs、child_process、crypto、https、net、process 的模块。",
  ],
  s9Title: "结语",
  s9P1:
    "这位研究员是幸运的 — 不是因为特别敏锐,而是因为在 npm install 之前读了 package.json,且拥有 Codespaces 选项。运气不是安全模型。流程才是。",
  s9P2Pre: "如果只记一件事:",
  s9P2Bold: "把审计机器与价值机器解耦。",
  s9P2Mid: " 如果记两件:不要把未请求的高薪私信当作机会 — 把它当作 ",
  s9P2Bold2: "分诊事件",
  s9Slogan: "保持冰冷。保持入库。",
  s9Author: "— ZONOVA RESEARCH",
  navHome: "首页",
  navPlaybook: "Playbook",
  ctaGetColdvault: "获取 ColdVault",
  ctaReadPlaybook: "阅读 Playbook",
  footerPublishedBy: "发布者",
  footerSuffix: "。MIT 许可。欢迎 PR。",
};

const ja: ArticleDict = {
  metaTitle: "DeceptiveDevelopment 攻撃の解剖 — Lazarus 関連の「採用担当」が筆者のマシン上でコードを実行しかけた話",
  metaDescription:
    "北朝鮮型偽採用キャンペーンの実体験ケーススタディ:LinkedIn での接触、Bitbucket ペイロード、心理メカニズム、IOC、攻撃を止めた防御アーキテクチャ。",
  tags: ["脅威インテリジェンス", "ソーシャルエンジニアリング", "DeceptiveDevelopment", "Lazarus", "Web3-セキュリティ"],
  title1: "解剖:",
  titleAccent: "DeceptiveDevelopment",
  title2: "攻撃",
  subtitle: "Lazarus 関連の「採用担当」が開発者のマシン上でコードを実行しかけた経緯と、ColdVault が生まれた理由。",
  authorName: "ZONOVA RESEARCH",
  authorOrg: "独立系脅威インテリジェンス",
  publishedOn: "2026年4月20日",
  tldrLabel: "TL;DR",
  tldrBody:
    "2026 年 4 月、独立系研究者が Lazarus(DPRK)系サブクラスタによる DeceptiveDevelopment / Contagious Interview のほぼ教科書通りの実行の標的となった。攻撃者は「Invoblox」の共同創業者を名乗り、月給 2 万〜2.5 万 USD を提示し、Bitbucket リポジトリのクローンを依頼。リポジトリには Node.js の fs モジュールを上書きする依存が含まれていた — 典型的なマルウェアローダー。ローカルインストールを拒否し、使い捨てクラウド環境を主張、誘いは破棄された。",
  s0Title: "なぜこの記事を書くか",
  s0P1: "多くのインシデントレポートは被害が確定した後に出る。本記事は誰も払っていないから、そして同じプレイブックが今や開発者コミュニティ — 特に Web3 — に対して工業規模で使われているから出される。",
  s0P2Lead: "本記事の役割は3つ:",
  s0Bullets: [
    { strong: "証拠の保存", rest: " — トランスクリプト、IOC、スクショで防御側がインフラを辿れるように。" },
    { strong: "心理の解説", rest: " — 交流分析、神経科学、Cialdini の影響レバー。" },
    { strong: "即戦力の防御提供", rest: " — coldvault.dev、Codespaces ベースの静的監査サンドボックス。" },
  ],
  s1Title: "攻撃のタイムライン",
  s11Sub: "1.1 初回接触(LinkedIn)",
  s11Quote:
    "こんにちは、お元気でしょうか。当社はブロックチェーンとデジタル革新の分野でリーディング企業として、新しいプロジェクトを進めています。[…] Technical Manager としてフルリモート、パート/フルどちらでもご参加いただけます。月給は 2 万〜2.5 万 USD。[…] calendly.com/best_collaboration/business",
  s11Lead: "技術知識ゼロでも見える兆候:",
  s11Bullets: [
    "本文に企業名なし — 空のシニフィアン。",
    "面接前に給与開示 — プロトコルの逆転。",
    "コーポレートドメインでない汎用 Calendly。",
    "ロール説明前に柔軟性をアピール。",
  ],
  s12Sub: "1.2 通話前のフレーミングメール",
  s12Quote:
    "弊社サイト:https://invoblox.com/ 次世代の暗号資産取引プラットフォームを開発中です。[…] 650 万 USD の出資を受けています。[…] 本ミーティングは技術面接ではなく顔合わせです。",
  s12Lead: "重ねられた3つの操作:",
  s12Bullets: [
    { strong: "実在を装うサイト", rest: " — 4 年物ドメインへのブランド寄生。" },
    { strong: "検証不能な資金額", rest: " — 本物っぽいほど精緻、Crunchbase に出ないほど小さい。" },
    { strong: "「技術面接ではない」", rest: " — 監査の警戒を先回りで下げる。" },
  ],
  s13Sub: "1.3 60 分の「紹介コール」",
  s13P1:
    "暖かい入り、経歴の称賛、もっともらしい MERN + Solidity ピッチ、「フルタイム 17 名、650 万ドル調達」、月給 2〜2.5 万 USD、ステーブルコインで 2 週間有給トライアル。終盤で本題:",
  s13Quote: "CTO とのコール前にリポジトリを引っ張ってアーキテクチャを見ていただけますか?クローンしてローカルで動かしてフィードバックを。",
  s13P2Pre: "リポジトリ:",
  s13P2Repo: "bitbucket.org/teamincwork/pro_lmng",
  s13P2Post: "。職務説明は単独 Notion ページ — 使い捨て、リクルーター跡なし。",
  s14Sub: "1.4 実際に起きたこと",
  s14P1Pre: "リポジトリはクローンした。",
  s14P1Bold: "npm install は実行しなかった。",
  s14P1Mid: " ",
  s14P1Code: "package.json",
  s14P1Post: " を読んだ。",
  s14P2Pre: "ユーティリティライブラリの名前を真似た依存だが、公開コードは ",
  s14P2Bold: "require 時に Node.js の fs モジュールを上書きしていた",
  s14P2Post:
    "。以後のファイル操作はすべて悪意のあるモジュールを経由する — ESET と Unit 42 が記録する複数の BeaverTail 亜種の中核プリミティブ。",
  s14P3: "リクルーターには監査は GitHub Codespaces のみで行うと伝えた。彼は「検討する」と。",
  s15Sub: "1.5 圧力フォローアップ",
  s15Quote: "今、予定の会議に入れますか?",
  s15P:
    "一文。クローズドクエスチョン。純粋な時間圧プローブ — Cialdini のコミットメント・一貫性フックを人工的緊急性で発動。返信なし。会話終了。",
  s2Title: "アトリビューション:これは DeceptiveDevelopment",
  s2Lead:
    "本案件の各指標は ESET、Palo Alto Unit 42、Group-IB、Zscaler が 2023 年以降公開してきた DeceptiveDevelopment / Contagious Interview クラスタと 1:1 で一致する:",
  s2TableHead: ["本案件の指標", "DeceptiveDevelopment シグネチャ"],
  s2Rows: [
    ["「リクルーター」からの非要請 LinkedIn DM", "主要チャネル"],
    ["「ブロックチェーンのリーディング企業」 — 空虚な記述", "繰り返しの言い回し"],
    ["コーポレートドメインでない汎用 Calendly", "記録済み"],
    ["月給 2〜2.5 万 USD を冒頭で開示", "記録済み"],
    ["MERN + Solidity、「次世代暗号取引」", "典型的な見せかけプロジェクト"],
    ["過大な資金(650 万 USD)とチーム(17/30)", "記録済み"],
    ["リポジトリは Bitbucket", "2024 年末以降の優先ホスト"],
    ["職務説明は Notion(ATS なし)", "使い捨て、跡なし"],
    ["ステーブルコイン/ETH での支払い", "銀行追跡を回避"],
    ["fs モジュールを上書きする依存", "BeaverTail/InvisibleFerret ローダー"],
    ["「技術面接ではない」", "監査マインドを解除"],
    ["躊躇後の即時圧力フォロー", "記録済み"],
  ],
  s3Title: "攻撃者が想定したキルチェーン",
  s3KillChain: [
    { id: "A", text: "LinkedIn コールド DM + Calendly" },
    { id: "B", text: "60 分紹介コール、信頼構築" },
    { id: "C", text: "Bitbucket + Notion 共有" },
    { id: "D", text: "判断:ローカルインストール?", decision: true },
    { id: "E", text: "npm install → fs-shadow ローダー発動" },
    { id: "F", text: "BeaverTail がクッキー、ウォレット、キーチェーン窃取" },
    { id: "G", text: "InvisibleFerret 永続化 + AnyDesk 配備" },
    { id: "H", text: "外部送出:ウォレット、SSH、クラウドトークン、顧客データ" },
  ],
  s3DecisionLabel: "← 結末を支配する唯一の判断点",
  s3Success: "D = いいえ なら — ColdVault で監査、攻撃失敗、攻撃者は次のターゲットへ。",
  s3Trailer:
    "A→E は 2 時間未満。E が発火した瞬間、マシンは侵害される。全体を支配する唯一の判断点は D — 自分のマシンでコードを動かすか?",
  s4Title: "なぜシニアエンジニアに効くのか",
  s4Lead:
    "技術的シニアリティはここでは防御にならない — むしろ逆。シニアは本番資格情報やウォレットを持ち、LinkedIn での露出も大きく、「あなたの経歴に注目しました」に弱い。",
  s41Sub: "4.1 交流分析 — どの自我状態に話しかけているか",
  s41TableHead: ["社会的メッセージ(顕在)", "心理的ターゲット(潜在)"],
  s41Rows: [
    ["「あなたの実力の方と仕事がしたい。」", "養育的親 — 承認に応える。"],
    ["「スケジュールは柔軟です。」", "順応的子供 — 譲る。"],
    ["「これは技術面接ではありません。」", "成人 — 監査を停止。"],
    ["「クローンして実行できますか?」", "順応的子供 — 従う、価値を示す。"],
    ["「今、会議に入れますか?」", "順応的子供 — 失望させない。"],
  ],
  s41After:
    "健全な対抗は交差交流:成人対成人で返す。「インストール前に使い捨て環境で監査します」が脚本を破る。",
  s42Sub: "4.2 神経科学 — ハイジャックされる3システム",
  s42Bullets: [
    { strong: "報酬予測(VTA → 側坐核)。", rest: " 月給 2.5 万ドルは正の予測誤差として記録される。ドーパミンは快感ではなく予測を守る動機 — 動機付け推論 — を符号化する。" },
    { strong: "信頼の符号化(尾状核)。", rest: " 専門用語混じりの暖かい 1 時間で、論理では覆しにくい神経信頼署名が刻まれる。" },
    { strong: "意思決定疲労(vmPFC、dlPFC)。", rest: " 新規性+社会的圧力+情報密度+緊急性が「待って package.json を読もう」と言う部位を飢餓状態にする。" },
  ],
  s43Sub: "4.3 Cialdini スタック — 出現順",
  s43Items: [
    { strong: "権威", rest: " — 「共同創業者」「CTO は後で参加」「650 万ドル調達」。" },
    { strong: "社会的証明", rest: " — 「フルタイム 17 名、シニア 7 名」。" },
    { strong: "好意", rest: " — 暖かいトーン、個別化された称賛、LinkedIn ミラーリング。" },
    { strong: "返報性", rest: " — 仕事前に 2 週間有給トライアル。" },
    { strong: "コミットメントと一貫性", rest: " — 1 時間費やした後、「クローンだけ」を断るのは過剰に感じる。" },
    { strong: "希少性/緊急性", rest: " — 「6 ヶ月で MVP」「今入れますか?」。" },
  ],
  s44Sub: "4.4 「私は賢いから大丈夫」が間違った防御である理由",
  s44P:
    "公開された被害者レポートはどれも「自分は気をつけていたつもりだった」を含む。知性は防御ではない。手順が防御である。防御はアーキテクチャ的:重要なマシンに信頼できないコードをインストールする能力そのものを取り除く。",
  s5Title: "防御反射 — それを自動化するツール",
  s5RuleLabel: "ルール",
  s5Rule: "価値あるものを保持しているマシンで、信頼できないコードを決して実行しない。",
  s5Lead: "実務的な系2つ:",
  s5Bullets: [
    { strong: "マシン分離、または境界分離。", rest: " 鍵、ウォレット、資格情報、SSH ID を持つ PC は、見知らぬコードを評価する PC ではない。1 台しかなければ「2 台目」は使い捨て VM。" },
    { strong: "走らせる前に読む。", rest: " どの package.json、pyproject.toml、Cargo.toml もインストール前に監査。postinstall、preinstall、prepare スクリプトは読む。" },
  ],
  s52Sub: "5.2 ColdVault は何をするか",
  s52Bullets: [
    "疑わしいリポジトリは target/ 配下に読み取り専用 git サブモジュールとしてマウント。",
    "解析は GitHub Codespace 内 — 短命 VM、影響半径=1 コンテナ。",
    "40 以上のセキュリティツールをプリインストール:SAST、SCA、シークレットハンター、マルウェアトリアージ、IaC スキャナ、SBOM。",
    "厳選された Claude Code skills が「このリポを監査して」を再現可能なパイプラインに。",
    "出力:reports/findings.json、SUMMARY.md、SARIF、CycloneDX SBOM。",
  ],
  s52CodeNote: "",
  s52After:
    "5 分後、reports/SUMMARY.md が fs-shadow 依存の有無、postinstall フックの怪しさ、バンドルバイナリへの YARA ヒット — そして水平スクロールの陰に隠されたペイロード — を教えてくれる。",
  s6Title: "現場チェックリスト",
  s6P: "完全な反射&レスポンス playbook は専用ページに — ラミネートしてキーボード横に貼る形式。",
  s6Cta: "Playbook を開く",
  s7Title: "侵害指標 (IOC)",
  s71Sub: "7.1 インフラ",
  s71TableHead: ["種類", "値", "役割"],
  s71Rows: [
    ["Bitbucket workspace", "teamincwork", "悪意あるリポをホスト"],
    ["リポジトリ", "bitbucket.org/teamincwork/pro_lmng", "ペイロード配信"],
    ["Notion ページ", "notion.so/Technical-Lead-2e8561…", "偽の職務記述"],
    ["Calendly handle", "calendly.com/best_collaboration/business", "予約誘引"],
    ["カバーブランドドメイン", "invoblox.com", "なりすまされたブランド"],
    ["リクルーター別名", "「Lucas Silva」(LinkedIn)", "Persona"],
  ],
  s72Sub: "7.2 行動パターン (TTPs)",
  s72Bullets: [
    "非要請 LinkedIn DM → Calendly → 60 分紹介コール。",
    "空疎な企業説明での切り出し。",
    "面接前に 2〜2.5 万 USD/月を提示。",
    "リポは Bitbucket、説明は Notion。",
    "Node の fs を上書きする依存でペイロード配信。",
    "躊躇に対する即時の圧力フォロー。",
  ],
  s73Sub: "7.3 スキャンすべき技術パターン",
  s73Bullets: [
    "postinstall / preinstall / prepare が依存コードを実行。",
    "git コミットに固定された依存(npm バージョンでない)。",
    "タイポスクワット名:ethers-utils、web3-helper、node-fs-helper、react-native-utils…",
    "軽量フロント案件で 100 KB 超のソース。",
    "水平スクロールで画面外に隠された 1 行ペイロード。",
    "eval、Function、new Function に渡される濃密な base64/hex。",
    "fs、child_process、crypto、https、net、process をモンキーパッチするモジュール。",
  ],
  s9Title: "結び",
  s9P1:
    "研究者は幸運だった — 鋭かったからではなく、npm install の前に package.json を読み、Codespaces という選択肢を持っていたから。運はセキュリティモデルではない。手順がそれだ。",
  s9P2Pre: "1 つ持ち帰るなら:",
  s9P2Bold: "監査マシンと価値マシンを分離する。",
  s9P2Mid: " 2 つ目:非要請の高給 DM をチャンスとして扱わない — ",
  s9P2Bold2: "トリアージ事案",
  s9Slogan: "冷たくあれ。金庫にあれ。",
  s9Author: "— ZONOVA RESEARCH",
  navHome: "ホーム",
  navPlaybook: "Playbook",
  ctaGetColdvault: "ColdVault を入手",
  ctaReadPlaybook: "Playbook を読む",
  footerPublishedBy: "発行:",
  footerSuffix: "。MIT ライセンス。PR 歓迎。",
};

const ko: ArticleDict = {
  metaTitle: "DeceptiveDevelopment 공격 해부 — Lazarus 관련 ‘채용 담당자’가 내 컴퓨터에서 코드를 실행할 뻔한 사건",
  metaDescription:
    "북한식 가짜 채용 캠페인의 1인칭 사례 연구: LinkedIn 접근, Bitbucket 페이로드, 심리 메커니즘, IOC, 그리고 공격을 막은 방어 아키텍처.",
  tags: ["위협-인텔리전스", "사회공학", "DeceptiveDevelopment", "Lazarus", "Web3-보안"],
  title1: "해부:",
  titleAccent: "DeceptiveDevelopment",
  title2: "공격",
  subtitle: "Lazarus 관련 ‘채용 담당자’가 개발자의 컴퓨터에서 코드를 실행할 뻔한 경위와 ColdVault가 만들어진 이유.",
  authorName: "ZONOVA RESEARCH",
  authorOrg: "독립 위협 인텔리전스",
  publishedOn: "2026년 4월 20일",
  tldrLabel: "요약",
  tldrBody:
    "2026년 4월, 한 독립 연구자는 Lazarus(DPRK) 하위 클러스터에 귀속되는 DeceptiveDevelopment / Contagious Interview 캠페인의 거의 교과서적 실행의 표적이 되었다. 공격자는 ‘Invoblox’의 공동 창업자를 사칭하며 월 2만~2.5만 달러를 제시하고 Bitbucket 저장소 클론을 요청했다. 저장소에는 Node.js 기본 fs 모듈을 가리는 의존성이 포함되어 있었다 — 전형적인 멀웨어 로더. 로컬 설치를 거부하고 일회용 클라우드 환경을 고집하여 미끼는 폐기되었다.",
  s0Title: "왜 이 글을 쓰는가",
  s0P1: "대부분의 사고 분석은 피해자가 비용을 치른 후에 공개된다. 이 글은 누구도 비용을 치르지 않았기 때문에, 그리고 같은 플레이북이 이제 개발자 커뮤니티 — 특히 Web3 — 에 산업 규모로 사용되고 있기 때문에 공개한다.",
  s0P2Lead: "이 글의 세 가지 목표:",
  s0Bullets: [
    { strong: "증거 보존", rest: " — 전체 트랜스크립트, IOC, 스크린샷으로 방어자가 인프라를 추적할 수 있도록." },
    { strong: "심리 설명", rest: " — 교류분석, 신경과학, Cialdini 영향 레버를 통해." },
    { strong: "즉시 사용 가능한 방어 제공", rest: " — coldvault.dev, Codespaces 기반 정적 감사 샌드박스." },
  ],
  s1Title: "공격 타임라인",
  s11Sub: "1.1 첫 접촉 (LinkedIn)",
  s11Quote:
    "안녕하세요, 잘 지내시길 바랍니다. 저희는 블록체인과 디지털 혁신 분야의 선도 기업으로, 흥미로운 새 프로젝트를 진행 중입니다. […] Technical Manager로 풀리모트, 파트/풀타임 어느 쪽이든 환영합니다. 예상 월급은 2만~2.5만 USD입니다. […] calendly.com/best_collaboration/business",
  s11Lead: "기술 지식 없이도 보이는 신호:",
  s11Bullets: [
    "본문에 회사명 없음 — 빈 기표.",
    "면접 전 급여 공개 — 프로토콜 역전.",
    "기업 도메인이 아닌 일반 Calendly 핸들.",
    "역할 설명 전 유연성 강조.",
  ],
  s12Sub: "1.2 통화 전 프레이밍 이메일",
  s12Quote:
    "회사 사이트: https://invoblox.com/ 차세대 암호화폐 거래 플랫폼을 개발 중입니다. […] 650만 USD 투자 유치. […] 본 미팅은 기술 면접이 아니라 소개입니다.",
  s12Lead: "세 가지 누적 조작:",
  s12Bullets: [
    { strong: "실재처럼 보이는 사이트", rest: " — 4년 된 도메인에 브랜드 편승." },
    { strong: "검증 불가한 자금 액수", rest: " — 진짜 같을 만큼 정확하면서 Crunchbase에 안 잡힐 만큼 작음." },
    { strong: "‘기술 면접 아님’", rest: " — 감사 경계 사전 해제." },
  ],
  s13Sub: "1.3 60분짜리 ‘소개 통화’",
  s13P1:
    "따뜻한 시작, 경력 인정, 그럴듯한 MERN + Solidity 피치, ‘풀타임 17명, 650만 달러 투자’, 월 2~2.5만 달러, 스테이블코인으로 2주 유급 트라이얼. 끝 무렵 진짜 요청:",
  s13Quote: "CTO와 통화 전에 저희 저장소를 받아서 아키텍처를 봐주실 수 있나요? 클론 후 로컬에서 실행해서 피드백 부탁드립니다.",
  s13P2Pre: "저장소: ",
  s13P2Repo: "bitbucket.org/teamincwork/pro_lmng",
  s13P2Post: ". 직무 설명은 별도 Notion 페이지 — 일회용, 채용 담당자 흔적 없음.",
  s14Sub: "1.4 실제로 일어난 일",
  s14P1Pre: "저장소를 클론했다. ",
  s14P1Bold: "npm install은 실행하지 않았다.",
  s14P1Mid: " ",
  s14P1Code: "package.json",
  s14P1Post: "을 읽었다.",
  s14P2Pre: "유틸리티 라이브러리 이름을 모방한 의존성이지만 게시된 코드는 ",
  s14P2Bold: "require 시점에 Node.js의 기본 fs 모듈을 덮어쓰고 있었다",
  s14P2Post:
    ". 이후 파일을 읽고 쓰는 모든 코드는 먼저 악성 모듈을 거치게 된다 — ESET와 Unit 42가 문서화한 여러 BeaverTail 변종의 핵심 프리미티브.",
  s14P3: "채용 담당자에게는 감사가 GitHub Codespaces에서만 이루어진다고 알렸다. 그는 ‘고려해 보겠다’고 답했다.",
  s15Sub: "1.5 압박 후속",
  s15Quote: "지금 예정된 회의에 참여해 주실 수 있나요?",
  s15P:
    "한 문장. 폐쇄형 질문. 순수한 시간 압박 탐침 — 인공적 긴급함 아래 Cialdini의 헌신·일관성 후크. 답하지 않았다. 대화 종료.",
  s2Title: "귀속: 이것은 DeceptiveDevelopment",
  s2Lead:
    "이 사례의 모든 지표는 ESET, Palo Alto Unit 42, Group-IB, Zscaler가 2023년부터 공개한 DeceptiveDevelopment / Contagious Interview 클러스터와 1:1로 일치한다:",
  s2TableHead: ["이 사례의 지표", "DeceptiveDevelopment 시그니처"],
  s2Rows: [
    ["‘채용 담당자’의 비요청 LinkedIn DM", "주요 채널"],
    ["‘블록체인 선도 기업’ — 공허한 설명", "반복되는 표현"],
    ["기업 도메인이 아닌 일반 Calendly", "문서화됨"],
    ["월 2~2.5만 달러를 사전 공개", "문서화됨"],
    ["MERN + Solidity, ‘차세대 암호 거래’", "전형적 위장 프로젝트"],
    ["부풀린 자금(650만 달러)과 팀(17/30)", "문서화됨"],
    ["저장소가 Bitbucket", "2024년 말 이후 선호 호스트"],
    ["직무 설명이 Notion (ATS 없음)", "일회용, 흔적 없음"],
    ["스테이블코인 또는 ETH 결제", "은행 추적 회피"],
    ["fs 모듈을 덮어쓰는 의존성", "BeaverTail/InvisibleFerret 로더"],
    ["‘기술 면접 아님’ 프레이밍", "감사 마인드 해제"],
    ["주저 시 즉각적 압박 후속", "문서화됨"],
  ],
  s3Title: "공격자가 기대한 킬 체인",
  s3KillChain: [
    { id: "A", text: "LinkedIn 콜드 DM + Calendly" },
    { id: "B", text: "60분 소개 통화, 신뢰 구축" },
    { id: "C", text: "Bitbucket + Notion 공유" },
    { id: "D", text: "결정: 로컬 설치?", decision: true },
    { id: "E", text: "npm install → fs-shadow 로더 발화" },
    { id: "F", text: "BeaverTail이 쿠키, 지갑, 키체인 탈취" },
    { id: "G", text: "InvisibleFerret 지속성 + AnyDesk 배포" },
    { id: "H", text: "유출: 지갑, SSH, 클라우드 토큰, 고객 데이터" },
  ],
  s3DecisionLabel: "← 결과 전체를 좌우하는 단일 결정점",
  s3Success: "D = 아니오 — ColdVault에서 감사, 공격 실패, 공격자는 다음 표적으로 이동.",
  s3Trailer:
    "A→E는 2시간 미만. E가 발화하는 즉시 머신은 침해된다. 모든 것을 좌우하는 유일한 결정점은 D — 자신의 머신에서 코드를 실행할 것인가?",
  s4Title: "왜 시니어 엔지니어에게 통하는가",
  s4Lead:
    "기술적 시니어리티는 여기서 방어가 아니다 — 여러 의미에서 오히려 반대다. 시니어는 운영 자격증명과 지갑을 보유하며, LinkedIn 노출이 크고, ‘귀하의 경력에 주목했다’에 더 취약하다.",
  s41Sub: "4.1 교류분석 — 어떤 자아 상태에 말 거는가",
  s41TableHead: ["사회적 메시지(명시적)", "심리적 표적(암묵적)"],
  s41Rows: [
    ["‘귀하 같은 분과 일하고 싶다.’", "양육적 부모 — 인정에 반응."],
    ["‘일정에 유연하다.’", "순응적 아동 — 양보."],
    ["‘기술 면접 아님, 그냥 소개.’", "성인 — 감사 비활성화."],
    ["‘그냥 클론하고 실행해 줄 수 있나요?’", "순응적 아동 — 따르고 가치 입증."],
    ["‘지금 회의에 들어올 수 있나요?’", "순응적 아동 — 실망시키지 않기."],
  ],
  s41After:
    "건강한 대응은 교차 교류: 성인 대 성인으로 답하라. ‘설치 전 일회용 환경에서 감사하겠다’가 스크립트를 깨뜨린다.",
  s42Sub: "4.2 신경과학 — 하이재킹되는 세 시스템",
  s42Bullets: [
    { strong: "보상 예측(VTA → 측좌핵).", rest: " 월 2.5만 달러는 양의 예측 오류로 부호화된다. 도파민은 쾌락이 아니라 예측을 보호하려는 동기 — 동기화된 추론 — 을 부호화한다." },
    { strong: "신뢰 부호화(미상핵).", rest: " 따뜻한 1시간과 기술 용어로 논리가 뒤집기 어려운 신뢰의 신경 흔적이 새겨진다." },
    { strong: "결정 피로(vmPFC, dlPFC).", rest: " 새로움+사회적 압력+정보 밀도+긴급성이 ‘잠깐, package.json부터 읽자’라고 말하는 부분을 굶긴다." },
  ],
  s43Sub: "4.3 Cialdini 스택 — 등장 순서",
  s43Items: [
    { strong: "권위", rest: " — ‘공동 창업자’, ‘CTO 곧 합류’, ‘650만 달러 투자’." },
    { strong: "사회적 증거", rest: " — ‘풀타임 17, 시니어 7’." },
    { strong: "호감", rest: " — 따뜻한 어조, 맞춤형 칭찬, LinkedIn 미러링." },
    { strong: "상호성", rest: " — 작업 전 2주 유급 트라이얼." },
    { strong: "헌신·일관성", rest: " — 1시간을 들인 후 ‘그냥 클론’을 거절하는 것은 과해 보인다." },
    { strong: "희소성/긴급성", rest: " — ‘6개월 내 MVP’, ‘지금 들어와요?’." },
  ],
  s44Sub: "4.4 ‘난 안 속는다’가 잘못된 방어인 이유",
  s44P:
    "공개된 모든 피해자 글에는 ‘조심한다고 생각했다’의 변형이 있다. 지능은 방어가 아니다. 절차가 방어다. 방어는 아키텍처적이다: 중요한 머신에 신뢰할 수 없는 코드를 설치할 능력 자체를 없애라.",
  s5Title: "방어 반사 — 그리고 그것을 자동화하는 도구",
  s5RuleLabel: "규칙",
  s5Rule: "가치 있는 무언가를 보유한 머신에서는 신뢰할 수 없는 코드를 절대 실행하지 마라.",
  s5Lead: "두 가지 실용적 따름:",
  s5Bullets: [
    { strong: "머신 분리 또는 경계 분리.", rest: " 키, 지갑, 자격증명, SSH ID가 있는 노트북은 낯선 코드를 평가하는 노트북이 아니다. 한 대뿐이라면 ‘두 번째 머신’은 일회용 VM이어야 한다." },
    { strong: "실행 전 읽어라.", rest: " 모든 package.json, pyproject.toml, Cargo.toml은 설치 전 감사한다. postinstall, preinstall, prepare 스크립트는 읽는다." },
  ],
  s52Sub: "5.2 ColdVault가 하는 일",
  s52Bullets: [
    "의심 저장소는 target/ 아래 읽기 전용 git 서브모듈로 마운트.",
    "분석은 GitHub Codespace 내부 — 일회성 VM, 영향 반경 = 컨테이너 1개.",
    "40개 이상의 보안 도구 사전 설치: SAST, SCA, 시크릿 헌터, 멀웨어 트리아지, IaC 스캐너, SBOM.",
    "엄선된 Claude Code 스킬이 ‘이 저장소 감사’를 재현 가능한 파이프라인으로.",
    "출력: reports/findings.json, SUMMARY.md, SARIF, CycloneDX SBOM.",
  ],
  s52CodeNote: "",
  s52After:
    "5분 후, reports/SUMMARY.md가 fs-shadow 의존성 유무, postinstall 훅의 의심성, 번들 바이너리에 대한 YARA 적중 여부 — 그리고 수평 스크롤로 화면 밖에 숨겨진 페이로드 여부 — 를 알려준다.",
  s6Title: "현장 체크리스트",
  s6P: "전체 반사 & 대응 playbook은 별도 페이지에 있다 — 코팅해서 키보드 옆에 붙이는 형식.",
  s6Cta: "Playbook 열기",
  s7Title: "침해 지표 (IOC)",
  s71Sub: "7.1 인프라",
  s71TableHead: ["유형", "값", "역할"],
  s71Rows: [
    ["Bitbucket workspace", "teamincwork", "악성 저장소 호스팅"],
    ["저장소", "bitbucket.org/teamincwork/pro_lmng", "페이로드 전달"],
    ["Notion 페이지", "notion.so/Technical-Lead-2e8561…", "가짜 직무 설명"],
    ["Calendly handle", "calendly.com/best_collaboration/business", "일정 미끼"],
    ["커버 브랜드 도메인", "invoblox.com", "사칭된 브랜드"],
    ["채용 담당자 별칭", "‘Lucas Silva’ (LinkedIn)", "Persona"],
  ],
  s72Sub: "7.2 행동 패턴 (TTPs)",
  s72Bullets: [
    "비요청 LinkedIn DM → Calendly → 60분 소개 통화.",
    "공허한 회사 설명으로 시작.",
    "면접 전 월 2~2.5만 달러 제시.",
    "저장소는 Bitbucket, 설명은 Notion.",
    "Node fs를 덮어쓰는 의존성으로 페이로드 전달.",
    "주저 시 즉각적 압박 후속.",
  ],
  s73Sub: "7.3 스캔할 기술 패턴",
  s73Bullets: [
    "postinstall / preinstall / prepare가 의존성 코드를 실행.",
    "git 커밋에 고정된 의존성(npm 버전 아님).",
    "타이포스쿼트 이름: ethers-utils, web3-helper, node-fs-helper, react-native-utils…",
    "가벼운 프론트엔드 프로젝트의 100KB 초과 소스 파일.",
    "한 줄에 수평 스크롤로 화면 밖에 숨겨진 페이로드.",
    "eval, Function, new Function에 전달되는 조밀한 base64/hex.",
    "fs, child_process, crypto, https, net, process를 멍키패치하는 모듈.",
  ],
  s9Title: "마무리",
  s9P1:
    "그 연구자는 운이 좋았다 — 특별히 예리해서가 아니라 npm install 전에 package.json을 읽었고 Codespaces 옵션이 있었기 때문이다. 운은 보안 모델이 아니다. 절차가 그것이다.",
  s9P2Pre: "한 가지를 가져간다면: ",
  s9P2Bold: "감사 머신과 가치 머신을 분리하라.",
  s9P2Mid: " 두 가지를 가져간다면: 비요청 고연봉 DM을 기회로 다루지 마라 — ",
  s9P2Bold2: "트리아지 사건",
  s9Slogan: "차갑게. 금고 안에.",
  s9Author: "— ZONOVA RESEARCH",
  navHome: "홈",
  navPlaybook: "Playbook",
  ctaGetColdvault: "ColdVault 받기",
  ctaReadPlaybook: "Playbook 읽기",
  footerPublishedBy: "발행:",
  footerSuffix: ". MIT 라이선스. PR 환영.",
};

const ar: ArticleDict = {
  metaTitle: "تشريح هجوم DeceptiveDevelopment — كيف كاد ‘مجنّد’ مرتبط بـ Lazarus أن ينفّذ شيفرة على جهازي",
  metaDescription:
    "دراسة حالة شخصية لحملة مجنّدين زائفين على الطريقة الكورية الشمالية: التواصل عبر LinkedIn، حمولة Bitbucket، الميكانيكا النفسية، مؤشرات الاختراق، والمعمارية الدفاعية التي أوقفت الهجوم.",
  tags: ["استخبارات-تهديدات", "هندسة-اجتماعية", "DeceptiveDevelopment", "Lazarus", "أمن-ويب3"],
  title1: "تشريح هجوم",
  titleAccent: "DeceptiveDevelopment",
  title2: "",
  subtitle: "كيف كاد ‘مجنّد’ مرتبط بـ Lazarus أن ينفّذ شيفرة على جهاز مطوّر — ولماذا أُنشئ ColdVault لمنع ذلك بالضبط.",
  authorName: "ZONOVA RESEARCH",
  authorOrg: "استخبارات تهديدات مستقلة",
  publishedOn: "20 أبريل 2026",
  tldrLabel: "ملخّص",
  tldrBody:
    "في أبريل 2026، استُهدف باحث مستقل بتنفيذ شبه مدرسي لحملة DeceptiveDevelopment / Contagious Interview المنسوبة إلى مجموعات فرعية من Lazarus (كوريا الشمالية). انتحل المهاجم صفة الشريك المؤسس لـ‘Invoblox’، وعرض راتباً 20–25 ألف USD شهرياً، وطلب استنساخ مستودع Bitbucket. كان المستودع يحتوي على اعتمادية تُظلّل وحدة fs الأصلية في Node.js — محمّل برمجيات خبيثة كلاسيكي. رُفضت التثبيت المحلي وأُصرّ على بيئة سحابية مؤقتة، فهُجر الطعم.",
  s0Title: "لماذا كُتب هذا المقال",
  s0P1:
    "تُنشر معظم تقارير الحوادث بعد أن يدفع الضحية. هذا التقرير يُنشر لأن لا أحد دفع، ولأن نفس البلاي بوك يُستخدم الآن على نطاق صناعي ضد مجتمع المطوّرين — خاصةً في Web3.",
  s0P2Lead: "للمقال ثلاث مهامّ:",
  s0Bullets: [
    { strong: "حفظ الأدلة", rest: " — نصوص كاملة وIOCs ولقطات شاشة لتمكين المدافعين من المتابعة على البنية التحتية." },
    { strong: "شرح علم النفس", rest: " — عبر التحليل التبادلي وعلوم الأعصاب وروافع التأثير لدى تشيالديني." },
    { strong: "تسليم دفاع جاهز", rest: " — coldvault.dev، صندوق رمل تدقيق ساكن قائم على Codespaces." },
  ],
  s1Title: "الجدول الزمني للهجوم",
  s11Sub: "1.1 التواصل الأوّل (LinkedIn)",
  s11Quote:
    "مرحباً، أتمنى أن تكونوا بخير. نحن شركة رائدة في البلوكشين والابتكار الرقمي ونبني مشروعاً جديداً مثيراً. […] نرحّب بانضمامكم بصفة Technical Manager، عن بعد كلياً، بدوام جزئي أو كامل. الراتب المتوقع 20–25 ألف USD شهرياً. […] calendly.com/best_collaboration/business",
  s11Lead: "ملاحظ بدون أي خبرة تقنية:",
  s11Bullets: [
    "لا اسم شركة في النص — دالّ فارغ.",
    "كشف الراتب قبل أي مقابلة — قلب البروتوكول.",
    "رابط Calendly عام، ليس على نطاق مؤسسي.",
    "عرض المرونة قبل أي وصف للمنصب.",
  ],
  s12Sub: "1.2 بريد التأطير قبل المكالمة",
  s12Quote:
    "هذا موقع شركتنا: https://invoblox.com/ مشروعنا منصّة تداول عملات رقمية من الجيل القادم. […] مدعوم بـ6.5 مليون USD. […] هذا اللقاء تمهيدي وليس مقابلة تقنية.",
  s12Lead: "ثلاث تلاعبات متراكمة:",
  s12Bullets: [
    { strong: "موقع يبدو حقيقياً كإثبات وجود", rest: " — تطفّل علاماتي على نطاق عمره 4 سنوات." },
    { strong: "رقم تمويل غير قابل للتحقق", rest: " — دقيق بما يكفي ليبدو حقيقياً، صغير بما يكفي ليغيب عن Crunchbase." },
    { strong: "‘ليست مقابلة تقنية’", rest: " — خفض استباقي لحرس التدقيق." },
  ],
  s13Sub: "1.3 ‘مكالمة تعريفية’ مدتها 60 دقيقة",
  s13P1:
    "افتتاح ودود، تأكيد للسيرة، عرض MERN + Solidity مقنع، ‘17 دواماً كاملاً، تمويل 6.5 مليون دولار’، 20–25 ألف دولار شهرياً، تجربة مدفوعة لأسبوعين بستيبل كوينز. قرب النهاية، الطلب الفعلي:",
  s13Quote: "هل يمكنك سحب مستودعنا وإلقاء نظرة على المعمارية قبل مكالمة CTO؟ فقط استنسخه وشغّله محلياً وأعطنا رأيك.",
  s13P2Pre: "المستودع: ",
  s13P2Repo: "bitbucket.org/teamincwork/pro_lmng",
  s13P2Post: ". وصف الوظيفة على صفحة Notion منفصلة — مؤقت، بلا أثر مجنّد.",
  s14Sub: "1.4 ما حدث فعلاً",
  s14P1Pre: "استُنسخ المستودع. ",
  s14P1Bold: "لم يُنفَّذ npm install.",
  s14P1Mid: " قُرئ ",
  s14P1Code: "package.json",
  s14P1Post: ".",
  s14P2Pre: "وُجدت اعتمادية يحاكي اسمها مكتبة أدوات لكن شيفرتها المنشورة كانت ",
  s14P2Bold: "تستبدل وحدة fs الأصلية في Node.js وقت require",
  s14P2Post:
    ". أيّ شيفرة لاحقة تقرأ أو تكتب الملفات ستمر أولاً عبر الوحدة الخبيثة — وهي البدائية الحاملة لعدة متغيرات BeaverTail الموثّقة من ESET وUnit 42.",
  s14P3: "أُبلغ المجنّد بأن التدقيق سيتمّ فقط في GitHub Codespaces. قال إنه ‘سيفكّر في الأمر’.",
  s15Sub: "1.5 متابعة الضغط",
  s15Quote: "هل يمكنك الانضمام إلى الاجتماع المجدول الآن؟",
  s15P:
    "جملة واحدة. سؤال مغلق. مسبار ضغط زمني خالص — خطّاف التزام-اتساق على طريقة تشيالديني تحت إلحاح مصطنع. لا ردّ. انتهت المحادثة.",
  s2Title: "الإسناد: هذا هو DeceptiveDevelopment",
  s2Lead:
    "كل مؤشر في هذه الحالة يطابق 1:1 عنقود DeceptiveDevelopment / Contagious Interview الموثّق علنياً من ESET وPalo Alto Unit 42 وGroup-IB وZscaler منذ 2023:",
  s2TableHead: ["مؤشر هذه الحالة", "بصمة DeceptiveDevelopment"],
  s2Rows: [
    ["رسالة LinkedIn غير مطلوبة من ‘مجنّد’", "القناة الأساسية"],
    ["‘شركة رائدة في البلوكشين’ — وصف فارغ", "صياغة متكررة"],
    ["Calendly عام، ليس على نطاق مؤسسي", "موثّق"],
    ["20–25 ألف USD شهرياً تُعلن مسبقاً", "موثّق"],
    ["MERN + Solidity، ‘منصّة تداول جيل قادم’", "مشروع غطاء نموذجي"],
    ["تمويل مضخّم (6.5 مليون USD) وفريق (17/30)", "موثّق"],
    ["مستودع على Bitbucket", "المضيف المفضّل منذ أواخر 2024"],
    ["وصف الوظيفة على Notion (لا ATS)", "مؤقت، بلا أثر"],
    ["دفع بستيبل كوينز أو ETH", "يتفادى التتبّع المصرفي"],
    ["اعتمادية تستبدل وحدة fs", "محمّل BeaverTail/InvisibleFerret"],
    ["‘ليست مقابلة تقنية’", "يعطّل عقلية التدقيق"],
    ["متابعة ضغط فورية بعد التردد", "موثّق"],
  ],
  s3Title: "سلسلة القتل التي توقّعها المهاجم",
  s3KillChain: [
    { id: "A", text: "رسالة LinkedIn باردة + Calendly" },
    { id: "B", text: "مكالمة تعريفية — 60 دقيقة، بناء ثقة" },
    { id: "C", text: "مشاركة Bitbucket + Notion" },
    { id: "D", text: "قرار: تثبيت محلي؟", decision: true },
    { id: "E", text: "npm install → إطلاق محمّل fs-shadow" },
    { id: "F", text: "BeaverTail يسرق الكوكيز والمحافظ والكيتشين" },
    { id: "G", text: "InvisibleFerret: استمرارية + نشر AnyDesk" },
    { id: "H", text: "تسريب: محافظ، SSH، رموز سحابية، بيانات عملاء" },
  ],
  s3DecisionLabel: "← قرار وحيد يتحكم بالنتيجة كلها",
  s3Success: "إذا D = لا — يُدقَّق المستودع في ColdVault، يفشل الهجوم، يدور المهاجم نحو الهدف التالي.",
  s3Trailer:
    "تستغرق الخطوات A→E أقل من ساعتين. حالما تُطلق E، يتم اختراق الجهاز. نقطة القرار الوحيدة التي تتحكم بكل شيء هي D — هل تشغّل الشيفرة على جهازك؟",
  s4Title: "لماذا تنجح هذه الحيلة على المهندسين الكبار",
  s4Lead:
    "الأقدمية التقنية ليست دفاعاً هنا — بل العكس بأكثر من معنى. فالكبار يحملون اعتمادات الإنتاج والمحافظ، وهم أكثر ظهوراً على LinkedIn، وأكثر تأثراً بـ‘سيرتك لفتت انتباهنا’.",
  s41Sub: "4.1 التحليل التبادلي — أيّ حالة تُخاطَب",
  s41TableHead: ["الرسالة الاجتماعية (الصريحة)", "الهدف النفسي (الضمني)"],
  s41Rows: [
    ["‘نودّ العمل مع شخص بكفاءتك.’", "الوالد المُغذّي — استجب للاعتراف."],
    ["‘نحن مرنون في الجدولة.’", "الطفل المتكيّف — كن متعاوناً بالمقابل."],
    ["‘ليست مقابلة تقنية، فقط تعريف.’", "البالغ — أوقف التدقيق."],
    ["‘هل يمكنك فقط استنساخه وتشغيله؟’", "الطفل المتكيّف — امتثل، أثبت قيمتك."],
    ["‘هل يمكنك الانضمام للاجتماع الآن؟’", "الطفل المتكيّف — لا تُخيّب الظنّ."],
  ],
  s41After:
    "المضادّ الصحي هو المعاملة المتقاطعة: ردّ من البالغ إلى البالغ. ‘سأدقّق المستودع في بيئة مؤقتة قبل أي تثبيت’ يكسر السيناريو.",
  s42Sub: "4.2 علم الأعصاب — ثلاث منظومات تُختطف",
  s42Bullets: [
    { strong: "تنبّؤ المكافأة (VTA → النواة المتكئة).", rest: " 25 ألف USD شهرياً يُرمَّز كخطأ تنبّؤي إيجابي؛ الدوبامين لا يرمّز اللذة، بل دافع حماية التنبّؤ — أي تفكير محفّز." },
    { strong: "ترميز الثقة (النواة المذنّبة).", rest: " ساعة دافئة بمصطلحات تقنية تكفي لطبع توقيع ثقة عصبي يصعب على المنطق نقضه." },
    { strong: "الإرهاق القراري (vmPFC, dlPFC).", rest: " الجِدّة + الضغط الاجتماعي + كثافة المعلومة + الإلحاح تجوّع الجزء الذي يقول ‘مهلاً، لنقرأ package.json’." },
  ],
  s43Sub: "4.3 مكدّس تشيالديني — بترتيب الظهور",
  s43Items: [
    { strong: "السلطة", rest: " — ‘شريك مؤسس’، ‘CTO سينضمّ لاحقاً’، ‘تمويل 6.5 مليون’." },
    { strong: "الدليل الاجتماعي", rest: " — ‘17 دواماً كاملاً، 7 كبار’." },
    { strong: "المحبّة", rest: " — نبرة دافئة، إطراء مخصّص، عكس LinkedIn." },
    { strong: "التبادل", rest: " — تجربة مدفوعة لأسبوعين قبل أيّ عمل." },
    { strong: "الالتزام والاتساق", rest: " — بعد ساعة استثمرتها، يبدو رفض ‘مجرد استنساخ’ مبالغاً." },
    { strong: "الندرة/الإلحاح", rest: " — ‘MVP خلال 6 أشهر’، ‘هل يمكنك الانضمام الآن؟’." },
  ],
  s44Sub: "4.4 لماذا ‘أنا أذكى من أن أقع’ هو الدفاع الخاطئ",
  s44P:
    "كلّ تقرير ضحية علني يتضمن نسخةً من ‘ظننت أنني حذِر بما يكفي’. الذكاء ليس الدفاع. الإجراء هو الدفاع. الدفاع معماري: انزع قدرتك على تثبيت شيفرة غير موثوقة على جهاز يهمّ.",
  s5Title: "الانعكاس الدفاعي — والأداة التي تُؤتمته",
  s5RuleLabel: "القاعدة",
  s5Rule: "لا تُشغّل أبداً شيفرة غير موثوقة على جهاز يحوي أي شيء ذي قيمة لك.",
  s5Lead: "نتيجتان عمليتان:",
  s5Bullets: [
    { strong: "أجهزة منفصلة، أو حدود منفصلة.", rest: " الحاسوب الذي يحمل مفاتيحك ومحافظك واعتماداتك وهويات SSH ليس الحاسوب الذي تقيّم فيه شيفرة الغرباء. إن لم يكن لديك سوى واحد، فيجب أن يكون ‘الجهاز الثاني’ آلة افتراضية مؤقتة." },
    { strong: "اقرأ قبل أن تُشغّل.", rest: " كلّ package.json وpyproject.toml وCargo.toml يُدقَّق قبل أي تثبيت. سكربتات postinstall وpreinstall وprepare تُقرأ." },
  ],
  s52Sub: "5.2 ماذا يفعل ColdVault",
  s52Bullets: [
    "يُلحَق المستودع المريب كوحدة git فرعية للقراءة فقط تحت target/.",
    "يجري التحليل داخل GitHub Codespace — آلة افتراضية مؤقتة، نصف قطر الانفجار = حاوية واحدة.",
    "أكثر من 40 أداة أمان مُجهّزة مسبقاً: SAST، SCA، صائدو أسرار، فرز برمجيات خبيثة، ماسحات IaC، SBOM.",
    "مهارات Claude Code منتقاة تحوّل ‘دقّق هذا المستودع’ إلى خطّ أنابيب قابل للتكرار.",
    "المخرجات: reports/findings.json، SUMMARY.md، SARIF، CycloneDX SBOM.",
  ],
  s52CodeNote: "",
  s52After:
    "بعد خمس دقائق، يخبرك reports/SUMMARY.md ما إذا كانت اعتمادية fs-shadow موجودة، وهل خطّافات postinstall مريبة، وهل يصطدم YARA ببينارات مرفقة — وهل تختبئ حمولات خارج الشاشة خلف تمرير أفقي.",
  s6Title: "قائمة الميدان",
  s6P: "كتاب اللعب الكامل للانعكاسات والاستجابة موجود على صفحته الخاصة — بصيغة ‘غلّفها وعلّقها بجوار لوحة المفاتيح’.",
  s6Cta: "افتح Playbook",
  s7Title: "مؤشرات الاختراق",
  s71Sub: "7.1 البنية التحتية",
  s71TableHead: ["النوع", "القيمة", "الدور"],
  s71Rows: [
    ["مساحة عمل Bitbucket", "teamincwork", "يستضيف المستودع الخبيث"],
    ["المستودع", "bitbucket.org/teamincwork/pro_lmng", "تسليم الحمولة"],
    ["صفحة Notion", "notion.so/Technical-Lead-2e8561…", "وصف وظيفي زائف"],
    ["معرّف Calendly", "calendly.com/best_collaboration/business", "طُعم جدولة"],
    ["نطاق علامة الغطاء", "invoblox.com", "علامة منتحَلة"],
    ["اسم مستعار للمجنّد", "‘Lucas Silva’ (LinkedIn)", "Persona"],
  ],
  s72Sub: "7.2 النمط السلوكي (TTPs)",
  s72Bullets: [
    "DM LinkedIn غير مطلوب → Calendly → مكالمة تعريفية 60 دقيقة.",
    "افتتاح بشركة بوصف فارغ.",
    "20–25 ألف USD شهرياً قبل المقابلة.",
    "المستودع على Bitbucket؛ الوصف على Notion.",
    "حمولة عبر اعتمادية تستبدل fs.",
    "متابعة ضغط فورية عند التردد.",
  ],
  s73Sub: "7.3 أنماط تقنية للمسح",
  s73Bullets: [
    "postinstall / preinstall / prepare تُشغّل شيفرة اعتمادية.",
    "اعتمادات مثبّتة على git commit (وليس إصدار npm).",
    "أسماء انتحال خطأ مطبعي: ethers-utils، web3-helper، node-fs-helper، react-native-utils…",
    "ملفات مصدر > 100 كيلوبايت في مشاريع واجهة خفيفة.",
    "تمرير أفقي يُخفي حمولة خارج الشاشة في سطر واحد.",
    "base64/hex كثيف يُمرَّر إلى eval، Function، new Function.",
    "وحدات تُعدّل fs، child_process، crypto، https، net، process.",
  ],
  s9Title: "الخاتمة",
  s9P1:
    "كان الباحث محظوظاً — لا لأنه حادّ بشكل خاص، بل لأنه قرأ package.json قبل تنفيذ npm install ولأن خيار Codespaces كان متاحاً. الحظّ ليس نموذج أمان. الإجراء هو نموذج الأمان.",
  s9P2Pre: "إن أخذت شيئاً واحداً: ",
  s9P2Bold: "افصل جهاز التدقيق عن جهاز القيمة.",
  s9P2Mid: " وإن أخذت اثنين: لا تعامل DM غير مطلوب بأجر مرتفع كفرصة — عامله كـ",
  s9P2Bold2: "حدث فرز",
  s9Slogan: "ابقَ بارداً. ابقَ في الخزنة.",
  s9Author: "— ZONOVA RESEARCH",
  navHome: "الرئيسية",
  navPlaybook: "Playbook",
  ctaGetColdvault: "احصل على ColdVault",
  ctaReadPlaybook: "اقرأ Playbook",
  footerPublishedBy: "ناشره",
  footerSuffix: ". رخصة MIT. مرحبٌ بطلبات الدمج.",
};

export const articleTranslations: Record<Locale, ArticleDict> = {
  en,
  fr,
  de,
  es,
  zh,
  ja,
  ko,
  ar,
};
