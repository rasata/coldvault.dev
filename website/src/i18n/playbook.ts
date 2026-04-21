import type { Locale } from "./translations";

export type PlaybookDict = {
  // meta
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  // nav
  navHome: string;
  navReadCaseStudy: string;
  // header
  badge: string;
  titleLead: string;
  titleAccent: string;
  subtitle: string;
  // golden rule
  goldenRuleLabel: string;
  goldenRuleText: string;
  goldenRuleCaption: string;
  // phase label
  phaseLabel: string;
  // phase 1
  p1Title: string;
  p1G1Title: string;
  p1G1Items: string[];
  p1G2Title: string;
  p1G2Items: string[];
  // phase 2
  p2Title: string;
  p2GTitle: string;
  p2Items: string[];
  p2AsideLabel: string;
  p2AsideBody: string;
  // phase 3
  p3Title: string;
  p3GTitle: string;
  p3Items: string[];
  p3GoodTitle: string;
  p3GoodItems: string[];
  p3BadTitle: string;
  p3BadItems: string[];
  // phase 4
  p4Title: string;
  p4Intro1: string;
  p4IntroStrong: string;
  p4Intro2: string;
  p4GTitle: string;
  p4Items: string[];
  // phase 5
  p5Title: string;
  p5AssumeBody: string;
  p5Steps: { title: string; body: string }[];
  p5ChannelsTitle: string;
  // phase 6
  p6Title: string;
  p6Cards: { title: string; text: string }[];
  // cta
  ctaTitle: string;
  ctaBodyPre: string;
  ctaBodyCodeSuffix: string;
  ctaPrimary: string;
  ctaSecondary: string;
  // footer
  footerPublishedBy: string;
  footerSuffix: string;
};

const en: PlaybookDict = {
  metaTitle:
    "ColdVault Playbook — Reflexes & best practices against fake-recruiter attacks",
  metaDescription:
    "A laminate-it-and-keep-it card: red flags before/during/after a suspicious recruiter call, the audit-machine reflex, and what to do if something already ran.",
  ogTitle: "ColdVault Playbook — Defender reflexes for DeceptiveDevelopment lures",
  ogDescription:
    "Field checklist + incident-response steps for developers targeted by Lazarus-style fake-recruiter campaigns.",
  navHome: "Home",
  navReadCaseStudy: "Read the case study",
  badge: "🛡️ Field manual · v1.0",
  titleLead: "The",
  titleAccent: "ColdVault Playbook",
  subtitle:
    "Reflexes & best practices against fake-recruiter attacks. Laminate it. Pin it next to your keyboard. Send it to every developer you care about.",
  goldenRuleLabel: "The Golden Rule",
  goldenRuleText:
    "Never execute untrusted code on a machine that holds anything of value to you.",
  goldenRuleCaption: "Everything below is support for that one sentence.",
  phaseLabel: "PHASE",
  p1Title: "Before the call — vet the opportunity",
  p1G1Title: "Red flags on the company",
  p1G1Items: [
    "Domain registered < 12 months ago, OR old domain with almost zero press footprint.",
    "Team page lists names that don't appear on LinkedIn — or LinkedIn profiles look 'too clean' (few old connections, no long-tenured colleagues).",
    "Recruiter avatar looks AI-generated; few recommendations from named people.",
    "Email comes from a free provider, or from a domain registered through a privacy-hiding registrar.",
  ],
  p1G2Title: "Red flags on the offer",
  p1G2Items: [
    "Compensation 2–3× the market band for the role — stated up front.",
    "Payment in cryptocurrency offered or normalised before you've asked.",
    "No company name in the first message — 'a leading company in blockchain'.",
    "Generic Calendly / Cal.com handle, not on a corporate domain.",
  ],
  p2Title: "During the call — watch the script",
  p2GTitle: "Behavioural signals",
  p2Items: [
    "Flattery disproportionate to what they actually know about you.",
    "Role responsibilities vague, deferred to 'a later call with the CTO'.",
    "Team size and funding figures: precise but unverifiable.",
    "You're told 'this isn't a technical interview' right before being asked to do something technical.",
    "Urgency injected: 'MVP in X months', 'we need to close this week'.",
  ],
  p2AsideLabel: "Counter-move",
  p2AsideBody:
    "Counter-move: reply Adult-to-Adult. \"I review unknown code only inside a disposable sandbox — I'll get back to you with findings.\" If they push back, you've confirmed the diagnosis.",
  p3Title: "The moment of truth — the technical ask",
  p3GTitle: "🚨 Hard stop — these mean: audit in sandbox or walk",
  p3Items: [
    "You're asked to clone a repo and install dependencies as a 'project review' or 'code challenge' before any contract / NDA / verified identity exchange.",
    "The repo is on Bitbucket, a throwaway GitHub account, or a private server.",
    "Job description lives on Notion, Google Docs, or a PDF — not on an ATS.",
    "After hesitation, you receive a short pressure message: 'Are you joining now?' / 'Did you get the repo running?'",
  ],
  p3GoodTitle: "✅ Acceptable",
  p3GoodItems: [
    "Audit inside ColdVault (or any disposable VM).",
    "Disengage politely.",
    "Report the infrastructure.",
  ],
  p3BadTitle: "❌ Unacceptable",
  p3BadItems: [
    "npm / pip / cargo install on your daily laptop.",
    "Open the project in your usual IDE with extensions.",
    "Run any provided 'setup script'.",
  ],
  p4Title: "The Cold Audit — read before you run",
  p4Intro1:
    "If you decide to look at the repo, do it inside a disposable environment (GitHub Codespaces, a fresh VM, or ColdVault). Read these things ",
  p4IntroStrong: "before",
  p4Intro2: " any install command:",
  p4GTitle: "Static patterns to grep for",
  p4Items: [
    "package.json scripts: postinstall, preinstall, prepare — read every line they execute.",
    "Dependencies pinned to a git commit instead of a registry version.",
    "Typo-squat names: ethers-utils, web3-helper, node-fs-helper, react-native-utils…",
    "Source files > 100 KB in an otherwise-light front-end project.",
    "Files where the first screen looks normal but content extends off-screen via horizontal scroll.",
    "Dense base64 / hex strings passed to eval, Function, new Function.",
    "Modules that monkey-patch fs, child_process, crypto, https, net, process.",
    "fetch / XMLHttpRequest / net.connect to hosts outside the project's declared infra.",
  ],
  p5Title: "If something already ran — incident response",
  p5AssumeBody:
    "Assume the machine is compromised until a clean OS reinstall. Time-to-react matters more than perfection — start the rotations now.",
  p5Steps: [
    {
      title: "Cut the network",
      body: "Disconnect Wi-Fi / Ethernet. Don't shut down — you'll need RAM forensics if relevant.",
    },
    {
      title: "Rotate everything reachable from the machine",
      body: "SSH keys, GitHub/GitLab tokens, AWS/GCP/Azure credentials, npm/PyPI publish tokens, password-manager master password, browser sessions (log out everywhere).",
    },
    {
      title: "Move all crypto",
      body: "From a clean device, generate a fresh wallet (ideally hardware, initialised from scratch) and move funds. Treat any seed phrase that touched the compromised machine as burnt.",
    },
    {
      title: "Notify clients & employers",
      body: "Anyone whose credentials sat on that machine deserves a heads-up — even if you're not 100% sure exfiltration occurred.",
    },
    {
      title: "Report the infrastructure",
      body: "Atlassian abuse (Bitbucket), GitHub abuse, Notion abuse, LinkedIn report, Calendly support — plus your national CERT.",
    },
    {
      title: "Wipe & reinstall",
      body: "Full disk wipe. Fresh OS install. Restore from backups predating the incident only.",
    },
  ],
  p5ChannelsTitle: "Reporting channels",
  p6Title: "Daily reflexes — build the habit",
  p6Cards: [
    {
      title: "Decouple machines",
      text: "The laptop with your keys, wallets, and client credentials is NEVER the laptop where you evaluate strangers' code. One disposable VM is enough if you can't have two.",
    },
    {
      title: "Hardware wallets only",
      text: "For any crypto with non-trivial value: hardware wallet, initialised on a clean device, seed phrase never typed on an internet-connected machine.",
    },
    {
      title: "Read package.json first",
      text: "Before any install command on any unfamiliar repo, read the manifest. postinstall hooks and git-pinned deps are not subtle.",
    },
    {
      title: "No untrusted IDE extensions",
      text: "Don't open suspect projects in your daily IDE. Extensions auto-activate on file types and can read everything in the workspace.",
    },
    {
      title: "Verify recruiters out-of-band",
      text: "Find the company on LinkedIn independently. Look for tenured employees. Cross-check the recruiter's name on the company's actual careers page.",
    },
    {
      title: "Treat high-salary cold DMs as triage events",
      text: "Not as opportunities. The default response is sandbox-or-decline, not 'sure, send me the repo'.",
    },
  ],
  ctaTitle: "Bake the procedure into your workflow",
  ctaBodyPre: "ColdVault turns this entire playbook into a single Codespace launch and a ",
  ctaBodyCodeSuffix: " command.",
  ctaPrimary: "Get ColdVault on GitHub",
  ctaSecondary: "Read the case study",
  footerPublishedBy: "Published by",
  footerSuffix: ". Stay cold. Stay vaulted.",
};

const fr: PlaybookDict = {
  metaTitle:
    "Playbook ColdVault — Réflexes et bonnes pratiques face aux faux recruteurs",
  metaDescription:
    "Une fiche à plastifier : red flags avant/pendant/après un appel de recruteur suspect, le réflexe machine d'audit, et quoi faire si du code s'est déjà exécuté.",
  ogTitle: "Playbook ColdVault — Réflexes défensifs face aux leurres DeceptiveDevelopment",
  ogDescription:
    "Checklist terrain + étapes de réponse à incident pour les développeurs visés par les campagnes de faux recruteurs style Lazarus.",
  navHome: "Accueil",
  navReadCaseStudy: "Lire l'étude de cas",
  badge: "🛡️ Manuel de terrain · v1.0",
  titleLead: "Le",
  titleAccent: "Playbook ColdVault",
  subtitle:
    "Réflexes et bonnes pratiques contre les attaques de faux recruteurs. Plastifie-le. Épingle-le à côté de ton clavier. Envoie-le à chaque dev que tu estimes.",
  goldenRuleLabel: "La règle d'or",
  goldenRuleText:
    "Ne jamais exécuter de code non-vérifié sur une machine qui contient quoi que ce soit de précieux.",
  goldenRuleCaption: "Tout ce qui suit n'est qu'un soutien à cette seule phrase.",
  phaseLabel: "PHASE",
  p1Title: "Avant l'appel — valider l'opportunité",
  p1G1Title: "Red flags côté société",
  p1G1Items: [
    "Domaine déposé depuis moins de 12 mois, OU vieux domaine sans aucune empreinte presse.",
    "La page \"Team\" liste des noms introuvables sur LinkedIn — ou des profils LinkedIn \"trop propres\" (peu de vieilles relations, aucun collègue ancien).",
    "Avatar du recruteur à l'air généré par IA ; peu de recommandations nominatives.",
    "Email issu d'un fournisseur gratuit, ou d'un domaine déposé via un registrar anonymisant.",
  ],
  p1G2Title: "Red flags côté offre",
  p1G2Items: [
    "Rémunération 2 à 3× la fourchette marché pour le poste — annoncée d'emblée.",
    "Paiement en cryptomonnaie proposé ou normalisé avant même que tu le demandes.",
    "Aucun nom d'entreprise dans le premier message — \"une entreprise leader du blockchain\".",
    "Handle Calendly / Cal.com générique, pas sur un domaine corporate.",
  ],
  p2Title: "Pendant l'appel — observe le script",
  p2GTitle: "Signaux comportementaux",
  p2Items: [
    "Flatteries disproportionnées par rapport à ce qu'ils savent réellement de toi.",
    "Responsabilités du poste vagues, renvoyées à \"un prochain call avec le CTO\".",
    "Taille d'équipe et chiffres de levée : précis mais invérifiables.",
    "On te dit \"ce n'est pas un entretien technique\" juste avant de te demander un truc technique.",
    "Urgence injectée : \"MVP dans X mois\", \"on doit signer cette semaine\".",
  ],
  p2AsideLabel: "Contre-mouvement",
  p2AsideBody:
    "Contre-mouvement : réponds d'Adulte à Adulte. « Je ne lis du code inconnu que dans un sandbox jetable — je te reviens avec mes conclusions. » S'ils insistent, le diagnostic est confirmé.",
  p3Title: "Le moment de vérité — la demande technique",
  p3GTitle: "🚨 Stop net — ces signes signifient : audit en sandbox ou on coupe",
  p3Items: [
    "On te demande de cloner un repo et d'installer les dépendances comme \"revue de projet\" ou \"code challenge\" avant tout contrat / NDA / vérification d'identité.",
    "Le repo est sur Bitbucket, un compte GitHub jetable, ou un serveur privé.",
    "La description du poste vit sur Notion, Google Docs ou un PDF — pas sur un ATS.",
    "Après une hésitation, tu reçois un petit message de pression : « Tu nous rejoins maintenant ? » / « T'as réussi à faire tourner le repo ? »",
  ],
  p3GoodTitle: "✅ Acceptable",
  p3GoodItems: [
    "Audit dans ColdVault (ou n'importe quelle VM jetable).",
    "Se désengager poliment.",
    "Signaler l'infrastructure.",
  ],
  p3BadTitle: "❌ Inacceptable",
  p3BadItems: [
    "npm / pip / cargo install sur ton laptop quotidien.",
    "Ouvrir le projet dans ton IDE habituel avec ses extensions.",
    "Exécuter un quelconque \"setup script\" fourni.",
  ],
  p4Title: "The Cold Audit — lire avant d'exécuter",
  p4Intro1:
    "Si tu décides de regarder le repo, fais-le dans un environnement jetable (GitHub Codespaces, une VM fraîche, ou ColdVault). Lis les choses suivantes ",
  p4IntroStrong: "avant",
  p4Intro2: " toute commande d'installation :",
  p4GTitle: "Motifs statiques à greper",
  p4Items: [
    "Scripts package.json : postinstall, preinstall, prepare — lis chaque ligne qu'ils exécutent.",
    "Dépendances figées sur un commit git au lieu d'une version de registry.",
    "Noms en typo-squat : ethers-utils, web3-helper, node-fs-helper, react-native-utils…",
    "Fichiers source > 100 Ko dans un projet front-end par ailleurs léger.",
    "Fichiers dont le premier écran paraît normal mais dont le contenu déborde via le scroll horizontal.",
    "Chaînes base64 / hex denses passées à eval, Function, new Function.",
    "Modules qui monkey-patchent fs, child_process, crypto, https, net, process.",
    "fetch / XMLHttpRequest / net.connect vers des hôtes hors de l'infra déclarée du projet.",
  ],
  p5Title: "Si quelque chose s'est déjà exécuté — réponse à incident",
  p5AssumeBody:
    "Considère la machine comme compromise jusqu'à réinstallation propre de l'OS. Le temps de réaction compte plus que la perfection — commence les rotations tout de suite.",
  p5Steps: [
    {
      title: "Couper le réseau",
      body: "Débranche Wi-Fi / Ethernet. N'éteins pas — tu auras besoin d'une forensique mémoire si c'est pertinent.",
    },
    {
      title: "Faire tourner tout ce qui est accessible depuis la machine",
      body: "Clés SSH, tokens GitHub/GitLab, credentials AWS/GCP/Azure, tokens de publication npm/PyPI, mot de passe maître du gestionnaire, sessions navigateur (déconnexion partout).",
    },
    {
      title: "Déplacer toute la crypto",
      body: "Depuis un appareil sain, génère un nouveau wallet (idéalement matériel, initialisé de zéro) et déplace les fonds. Toute seed phrase qui a touché la machine compromise est à considérer comme brûlée.",
    },
    {
      title: "Prévenir clients et employeurs",
      body: "Toute personne dont les credentials étaient sur la machine mérite d'être alertée — même si tu n'es pas sûr à 100 % qu'il y a eu exfiltration.",
    },
    {
      title: "Signaler l'infrastructure",
      body: "Atlassian abuse (Bitbucket), GitHub abuse, Notion abuse, signalement LinkedIn, support Calendly — plus ton CERT national.",
    },
    {
      title: "Effacer et réinstaller",
      body: "Effacement disque complet. Installation OS fraîche. Restauration uniquement depuis des backups antérieurs à l'incident.",
    },
  ],
  p5ChannelsTitle: "Canaux de signalement",
  p6Title: "Réflexes quotidiens — construire l'habitude",
  p6Cards: [
    {
      title: "Séparer les machines",
      text: "Le laptop avec tes clés, tes wallets et les credentials clients n'est JAMAIS celui où tu évalues le code d'inconnus. Une VM jetable suffit si tu ne peux pas en avoir deux.",
    },
    {
      title: "Wallets matériels uniquement",
      text: "Pour toute crypto à valeur non-triviale : wallet matériel, initialisé sur un appareil propre, seed phrase jamais tapée sur une machine connectée.",
    },
    {
      title: "Lire package.json d'abord",
      text: "Avant toute commande d'install sur un repo inconnu, lis le manifeste. Les hooks postinstall et les deps pinnées sur git ne sont pas subtils.",
    },
    {
      title: "Aucune extension IDE non-vérifiée",
      text: "N'ouvre pas de projets suspects dans ton IDE quotidien. Les extensions s'activent automatiquement sur les types de fichiers et peuvent tout lire dans le workspace.",
    },
    {
      title: "Vérifier les recruteurs hors-canal",
      text: "Trouve l'entreprise sur LinkedIn par toi-même. Cherche des employés à forte ancienneté. Recoupe le nom du recruteur sur la vraie page carrières de la boîte.",
    },
    {
      title: "Traiter les DM froids à haut salaire comme un événement de triage",
      text: "Pas comme des opportunités. La réponse par défaut est sandbox-ou-refus, pas « pas de souci, envoie le repo ».",
    },
  ],
  ctaTitle: "Intègre la procédure à ton workflow",
  ctaBodyPre: "ColdVault condense tout ce playbook en un lancement de Codespace et une commande ",
  ctaBodyCodeSuffix: ".",
  ctaPrimary: "Récupérer ColdVault sur GitHub",
  ctaSecondary: "Lire l'étude de cas",
  footerPublishedBy: "Publié par",
  footerSuffix: ". Stay cold. Stay vaulted.",
};

const de: PlaybookDict = {
  metaTitle:
    "ColdVault Playbook — Reflexe & Best Practices gegen Fake-Recruiter-Angriffe",
  metaDescription:
    "Die laminierte Karte: rote Flaggen vor/während/nach einem verdächtigen Recruiter-Call, der Audit-Maschinen-Reflex und was zu tun ist, wenn bereits etwas ausgeführt wurde.",
  ogTitle: "ColdVault Playbook — Verteidiger-Reflexe gegen DeceptiveDevelopment-Köder",
  ogDescription:
    "Feld-Checkliste + Incident-Response-Schritte für Entwickler, die von Lazarus-artigen Fake-Recruiter-Kampagnen ins Visier genommen werden.",
  navHome: "Startseite",
  navReadCaseStudy: "Fallstudie lesen",
  badge: "🛡️ Feldhandbuch · v1.0",
  titleLead: "Das",
  titleAccent: "ColdVault Playbook",
  subtitle:
    "Reflexe und Best Practices gegen Fake-Recruiter-Angriffe. Laminiere es. Hefte es neben deine Tastatur. Schick es jedem Entwickler, der dir wichtig ist.",
  goldenRuleLabel: "Die Goldene Regel",
  goldenRuleText:
    "Niemals nicht vertrauenswürdigen Code auf einer Maschine ausführen, auf der irgendetwas Wertvolles liegt.",
  goldenRuleCaption: "Alles Folgende dient nur diesem einen Satz.",
  phaseLabel: "PHASE",
  p1Title: "Vor dem Call — die Gelegenheit prüfen",
  p1G1Title: "Rote Flaggen zum Unternehmen",
  p1G1Items: [
    "Domain vor weniger als 12 Monaten registriert, ODER alte Domain mit nahezu null Presse-Footprint.",
    "Die Team-Seite listet Namen, die auf LinkedIn nicht auftauchen — oder LinkedIn-Profile wirken 'zu sauber' (wenige alte Kontakte, keine langjährigen Kollegen).",
    "Recruiter-Avatar wirkt KI-generiert; kaum Empfehlungen von namentlich genannten Personen.",
    "E-Mail von einem Gratis-Provider oder von einer Domain bei einem Privacy-Registrar.",
  ],
  p1G2Title: "Rote Flaggen zum Angebot",
  p1G2Items: [
    "Gehalt 2–3× über dem Markt für die Rolle — direkt angesprochen.",
    "Zahlung in Kryptowährung wird angeboten oder normalisiert, bevor du überhaupt fragst.",
    "Kein Firmenname in der ersten Nachricht — 'ein führendes Blockchain-Unternehmen'.",
    "Generischer Calendly- / Cal.com-Handle, nicht auf einer Corporate-Domain.",
  ],
  p2Title: "Während des Calls — beobachte das Skript",
  p2GTitle: "Verhaltenssignale",
  p2Items: [
    "Schmeicheleien, die nicht zu dem passen, was sie wirklich über dich wissen.",
    "Rollenverantwortlichkeiten vage, auf 'einen späteren Call mit dem CTO' verschoben.",
    "Team-Größe und Funding-Zahlen: präzise, aber nicht überprüfbar.",
    "Man sagt dir 'das ist kein Technical Interview', kurz bevor du etwas Technisches tun sollst.",
    "Dringlichkeit wird injiziert: 'MVP in X Monaten', 'wir müssen diese Woche schließen'.",
  ],
  p2AsideLabel: "Gegenzug",
  p2AsideBody:
    "Gegenzug: antworte erwachsen-zu-erwachsen. „Fremden Code prüfe ich nur in einer Wegwerf-Sandbox — ich melde mich mit meinen Ergebnissen.“ Wenn sie drängen, hast du die Diagnose bestätigt.",
  p3Title: "Die Stunde der Wahrheit — die technische Aufforderung",
  p3GTitle: "🚨 Hartes Stopp — das heißt: Audit in der Sandbox oder abbrechen",
  p3Items: [
    "Du wirst aufgefordert, ein Repo zu klonen und Dependencies zu installieren als 'Projekt-Review' oder 'Code-Challenge' — vor jedem Vertrag / NDA / verifizierter Identität.",
    "Das Repo liegt auf Bitbucket, einem Wegwerf-GitHub-Konto oder einem privaten Server.",
    "Die Stellenbeschreibung lebt auf Notion, Google Docs oder einem PDF — nicht in einem ATS.",
    "Nach Zögern bekommst du eine kurze Druck-Nachricht: „Steigst du jetzt ein?“ / „Läuft das Repo schon?“",
  ],
  p3GoodTitle: "✅ Akzeptabel",
  p3GoodItems: [
    "Audit innerhalb von ColdVault (oder irgendeiner Wegwerf-VM).",
    "Sich höflich ausklinken.",
    "Die Infrastruktur melden.",
  ],
  p3BadTitle: "❌ Inakzeptabel",
  p3BadItems: [
    "npm / pip / cargo install auf deinem Daily-Driver-Laptop.",
    "Das Projekt in deiner üblichen IDE mit Extensions öffnen.",
    "Irgendein mitgeliefertes 'setup script' ausführen.",
  ],
  p4Title: "The Cold Audit — lies, bevor du ausführst",
  p4Intro1:
    "Wenn du dich entscheidest, dir das Repo anzuschauen, tu es in einer Wegwerf-Umgebung (GitHub Codespaces, eine frische VM oder ColdVault). Lies diese Dinge ",
  p4IntroStrong: "bevor",
  p4Intro2: " du irgendeinen Install-Befehl ausführst:",
  p4GTitle: "Statische Muster zum Grepen",
  p4Items: [
    "package.json-Scripts: postinstall, preinstall, prepare — lies jede Zeile, die sie ausführen.",
    "Dependencies, die auf einen git-Commit statt auf eine Registry-Version gepinnt sind.",
    "Typo-Squat-Namen: ethers-utils, web3-helper, node-fs-helper, react-native-utils…",
    "Quelldateien > 100 KB in einem ansonsten leichten Frontend-Projekt.",
    "Dateien, bei denen der erste Bildschirm normal aussieht, der Inhalt aber über horizontalen Scroll aus dem Sichtbereich läuft.",
    "Dichte base64- / hex-Strings, die an eval, Function, new Function übergeben werden.",
    "Module, die fs, child_process, crypto, https, net, process monkey-patchen.",
    "fetch / XMLHttpRequest / net.connect zu Hosts außerhalb der offiziell deklarierten Infra.",
  ],
  p5Title: "Wenn bereits etwas gelaufen ist — Incident Response",
  p5AssumeBody:
    "Gehe bis zur sauberen OS-Neuinstallation davon aus, dass die Maschine kompromittiert ist. Reaktionszeit zählt mehr als Perfektion — starte die Rotationen jetzt.",
  p5Steps: [
    {
      title: "Netzwerk kappen",
      body: "Wi-Fi / Ethernet trennen. Nicht herunterfahren — falls relevant, brauchst du RAM-Forensik.",
    },
    {
      title: "Alles rotieren, was von der Maschine erreichbar war",
      body: "SSH-Keys, GitHub/GitLab-Tokens, AWS/GCP/Azure-Credentials, npm/PyPI-Publish-Tokens, Master-Passwort des Passwort-Managers, Browser-Sessions (überall ausloggen).",
    },
    {
      title: "Sämtliche Krypto verschieben",
      body: "Von einem sauberen Gerät aus ein neues Wallet erzeugen (idealerweise Hardware, von Grund auf initialisiert) und Mittel verschieben. Jede Seed Phrase, die die kompromittierte Maschine berührt hat, gilt als verbrannt.",
    },
    {
      title: "Kunden & Arbeitgeber informieren",
      body: "Jeder, dessen Credentials auf der Maschine lagen, verdient eine Warnung — auch wenn du dir bei der Exfiltration nicht 100% sicher bist.",
    },
    {
      title: "Die Infrastruktur melden",
      body: "Atlassian Abuse (Bitbucket), GitHub Abuse, Notion Abuse, LinkedIn-Meldung, Calendly Support — plus dein nationales CERT.",
    },
    {
      title: "Wipen und neu aufsetzen",
      body: "Vollständige Festplatten-Löschung. Frische OS-Installation. Wiederherstellung nur aus Backups vor dem Vorfall.",
    },
  ],
  p5ChannelsTitle: "Meldestellen",
  p6Title: "Tägliche Reflexe — die Gewohnheit aufbauen",
  p6Cards: [
    {
      title: "Maschinen trennen",
      text: "Der Laptop mit deinen Schlüsseln, Wallets und Kunden-Credentials ist NIEMALS der, auf dem du Code Fremder evaluierst. Eine Wegwerf-VM reicht, wenn du keine zwei Rechner haben kannst.",
    },
    {
      title: "Nur Hardware-Wallets",
      text: "Für jede Krypto mit nicht-trivialem Wert: Hardware-Wallet, auf sauberem Gerät initialisiert, Seed Phrase nie auf einer internetverbundenen Maschine getippt.",
    },
    {
      title: "Zuerst package.json lesen",
      text: "Vor jedem Install-Befehl in einem unbekannten Repo: das Manifest lesen. postinstall-Hooks und git-gepinnte Deps sind nicht subtil.",
    },
    {
      title: "Keine nicht vertrauenswürdigen IDE-Extensions",
      text: "Öffne verdächtige Projekte nicht in deiner Daily-IDE. Extensions aktivieren sich automatisch über Dateitypen und können alles im Workspace lesen.",
    },
    {
      title: "Recruiter out-of-band verifizieren",
      text: "Finde die Firma eigenständig auf LinkedIn. Suche nach langjährigen Mitarbeitern. Prüfe den Namen des Recruiters auf der echten Karriereseite gegen.",
    },
    {
      title: "Kalt-DMs mit Top-Gehalt als Triage-Event behandeln",
      text: "Nicht als Chance. Die Standardantwort ist Sandbox-oder-Ablehnen, nicht ‚klar, schick mir das Repo‘.",
    },
  ],
  ctaTitle: "Die Prozedur in deinen Workflow einbacken",
  ctaBodyPre: "ColdVault verdichtet das gesamte Playbook zu einem einzigen Codespace-Start und einem ",
  ctaBodyCodeSuffix: "-Befehl.",
  ctaPrimary: "ColdVault auf GitHub holen",
  ctaSecondary: "Fallstudie lesen",
  footerPublishedBy: "Veröffentlicht von",
  footerSuffix: ". Stay cold. Stay vaulted.",
};

const es: PlaybookDict = {
  metaTitle:
    "Playbook de ColdVault — Reflejos y buenas prácticas frente a falsos reclutadores",
  metaDescription:
    "Una ficha plastificable: red flags antes/durante/después de una llamada de reclutador sospechosa, el reflejo de máquina de auditoría, y qué hacer si ya se ejecutó algo.",
  ogTitle: "Playbook de ColdVault — Reflejos defensivos frente a señuelos DeceptiveDevelopment",
  ogDescription:
    "Checklist de campo + pasos de respuesta a incidentes para desarrolladores apuntados por campañas de falsos reclutadores estilo Lazarus.",
  navHome: "Inicio",
  navReadCaseStudy: "Leer el estudio de caso",
  badge: "🛡️ Manual de campo · v1.0",
  titleLead: "El",
  titleAccent: "Playbook de ColdVault",
  subtitle:
    "Reflejos y buenas prácticas contra los ataques de falsos reclutadores. Plastifícalo. Pégalo junto a tu teclado. Envíaselo a cada dev que te importe.",
  goldenRuleLabel: "La Regla de Oro",
  goldenRuleText:
    "Nunca ejecutes código no confiable en una máquina que contenga algo de valor para ti.",
  goldenRuleCaption: "Todo lo que sigue solo sirve para sostener esa única frase.",
  phaseLabel: "FASE",
  p1Title: "Antes de la llamada — filtra la oportunidad",
  p1G1Title: "Red flags sobre la empresa",
  p1G1Items: [
    "Dominio registrado hace menos de 12 meses, O dominio viejo sin huella mediática.",
    "La página \"Team\" lista nombres que no aparecen en LinkedIn — o perfiles de LinkedIn 'demasiado limpios' (pocas conexiones antiguas, sin colegas de larga data).",
    "Avatar del reclutador con aspecto generado por IA; pocas recomendaciones de personas con nombre.",
    "Correo desde un proveedor gratuito, o desde un dominio registrado con un registrar que oculta la identidad.",
  ],
  p1G2Title: "Red flags sobre la oferta",
  p1G2Items: [
    "Remuneración 2–3× la banda de mercado del puesto — dicha desde el principio.",
    "Pago en criptomoneda ofrecido o normalizado antes de que lo hayas pedido.",
    "Ningún nombre de empresa en el primer mensaje — 'una empresa líder en blockchain'.",
    "Handle de Calendly / Cal.com genérico, no en un dominio corporativo.",
  ],
  p2Title: "Durante la llamada — observa el guion",
  p2GTitle: "Señales de comportamiento",
  p2Items: [
    "Halagos desproporcionados respecto a lo que realmente saben de ti.",
    "Responsabilidades del puesto vagas, pospuestas a 'una llamada posterior con el CTO'.",
    "Tamaño del equipo y cifras de financiación: precisas pero inverificables.",
    "Te dicen 'esto no es una entrevista técnica' justo antes de pedirte algo técnico.",
    "Urgencia inyectada: 'MVP en X meses', 'tenemos que cerrar esta semana'.",
  ],
  p2AsideLabel: "Contramovimiento",
  p2AsideBody:
    "Contramovimiento: responde de Adulto a Adulto. «Solo reviso código desconocido dentro de un sandbox desechable — te vuelvo con mis conclusiones.» Si insisten, el diagnóstico queda confirmado.",
  p3Title: "El momento de la verdad — la petición técnica",
  p3GTitle: "🚨 Stop en seco — esto significa: auditar en sandbox o irse",
  p3Items: [
    "Te piden clonar un repo e instalar dependencias como 'revisión de proyecto' o 'code challenge' antes de cualquier contrato / NDA / verificación de identidad.",
    "El repo está en Bitbucket, una cuenta GitHub desechable o un servidor privado.",
    "La descripción del puesto vive en Notion, Google Docs o un PDF — no en un ATS.",
    "Tras tu vacilación, recibes un breve mensaje de presión: «¿Te unes ya?» / «¿Conseguiste correr el repo?»",
  ],
  p3GoodTitle: "✅ Aceptable",
  p3GoodItems: [
    "Auditar dentro de ColdVault (o cualquier VM desechable).",
    "Desengancharse con educación.",
    "Reportar la infraestructura.",
  ],
  p3BadTitle: "❌ Inaceptable",
  p3BadItems: [
    "npm / pip / cargo install en tu laptop del día a día.",
    "Abrir el proyecto en tu IDE habitual con sus extensiones.",
    "Ejecutar cualquier 'setup script' que te hayan pasado.",
  ],
  p4Title: "The Cold Audit — lee antes de ejecutar",
  p4Intro1:
    "Si decides mirar el repo, hazlo dentro de un entorno desechable (GitHub Codespaces, una VM nueva o ColdVault). Lee estas cosas ",
  p4IntroStrong: "antes",
  p4Intro2: " de cualquier comando de instalación:",
  p4GTitle: "Patrones estáticos a grepear",
  p4Items: [
    "Scripts de package.json: postinstall, preinstall, prepare — lee cada línea que ejecutan.",
    "Dependencias fijadas a un commit de git en lugar de a una versión del registry.",
    "Nombres typo-squat: ethers-utils, web3-helper, node-fs-helper, react-native-utils…",
    "Archivos fuente > 100 KB en un proyecto de front-end por lo demás ligero.",
    "Archivos donde la primera pantalla parece normal pero el contenido se sale por scroll horizontal.",
    "Cadenas densas base64 / hex pasadas a eval, Function, new Function.",
    "Módulos que hacen monkey-patch a fs, child_process, crypto, https, net, process.",
    "fetch / XMLHttpRequest / net.connect hacia hosts fuera de la infra declarada del proyecto.",
  ],
  p5Title: "Si ya se ejecutó algo — respuesta a incidentes",
  p5AssumeBody:
    "Asume que la máquina está comprometida hasta una reinstalación limpia del SO. El tiempo de reacción importa más que la perfección — empieza las rotaciones ahora.",
  p5Steps: [
    {
      title: "Cortar la red",
      body: "Desconecta Wi-Fi / Ethernet. No apagues — puede hacer falta forense de RAM si procede.",
    },
    {
      title: "Rotar todo lo alcanzable desde la máquina",
      body: "Claves SSH, tokens de GitHub/GitLab, credenciales AWS/GCP/Azure, tokens de publicación npm/PyPI, contraseña maestra del gestor, sesiones del navegador (logout en todas partes).",
    },
    {
      title: "Mover toda la crypto",
      body: "Desde un dispositivo limpio, genera un wallet nuevo (idealmente hardware, inicializado desde cero) y mueve los fondos. Cualquier seed phrase que haya tocado la máquina comprometida se considera quemada.",
    },
    {
      title: "Avisar a clientes y empleadores",
      body: "Cualquiera cuyas credenciales estuvieran en esa máquina merece un aviso — aunque no estés 100% seguro de que hubo exfiltración.",
    },
    {
      title: "Reportar la infraestructura",
      body: "Atlassian abuse (Bitbucket), GitHub abuse, Notion abuse, reporte de LinkedIn, soporte de Calendly — más tu CERT nacional.",
    },
    {
      title: "Borrar y reinstalar",
      body: "Wipe completo del disco. Instalación fresca del SO. Restaurar solo desde backups anteriores al incidente.",
    },
  ],
  p5ChannelsTitle: "Canales de reporte",
  p6Title: "Reflejos diarios — construye el hábito",
  p6Cards: [
    {
      title: "Desacopla máquinas",
      text: "La laptop con tus claves, wallets y credenciales de clientes NUNCA es la laptop donde evalúas código de desconocidos. Una VM desechable basta si no puedes tener dos.",
    },
    {
      title: "Solo wallets hardware",
      text: "Para cualquier crypto con valor no trivial: wallet hardware, inicializada en un equipo limpio, seed phrase nunca tecleada en una máquina conectada a internet.",
    },
    {
      title: "Lee package.json primero",
      text: "Antes de cualquier comando de install en un repo desconocido, lee el manifiesto. Los hooks postinstall y las deps fijadas a git no son sutiles.",
    },
    {
      title: "Nada de extensiones de IDE no confiables",
      text: "No abras proyectos sospechosos en tu IDE diario. Las extensiones se activan automáticamente según el tipo de archivo y pueden leer todo el workspace.",
    },
    {
      title: "Verifica reclutadores fuera de canal",
      text: "Encuentra la empresa en LinkedIn por tu cuenta. Busca empleados con antigüedad. Coteja el nombre del reclutador en la página de carreras real de la empresa.",
    },
    {
      title: "Trata los DM fríos con salario alto como eventos de triage",
      text: "No como oportunidades. La respuesta por defecto es sandbox-o-declinar, no «claro, mándame el repo».",
    },
  ],
  ctaTitle: "Integra el procedimiento en tu flujo de trabajo",
  ctaBodyPre: "ColdVault condensa todo este playbook en un solo lanzamiento de Codespace y un comando ",
  ctaBodyCodeSuffix: ".",
  ctaPrimary: "Obtener ColdVault en GitHub",
  ctaSecondary: "Leer el estudio de caso",
  footerPublishedBy: "Publicado por",
  footerSuffix: ". Stay cold. Stay vaulted.",
};

const zh: PlaybookDict = {
  metaTitle: "ColdVault 行动手册 —— 对抗假招聘攻击的本能反应与最佳实践",
  metaDescription:
    "一张值得塑封随身带的卡片：可疑招聘通话前/中/后的红旗信号、审计机反射、以及若代码已被执行时的应对之策。",
  ogTitle: "ColdVault 行动手册 —— 面对 DeceptiveDevelopment 诱饵的防御反应",
  ogDescription:
    "面向被 Lazarus 式假招聘活动盯上的开发者的现场清单与事件响应步骤。",
  navHome: "首页",
  navReadCaseStudy: "阅读案例分析",
  badge: "🛡️ 现场手册 · v1.0",
  titleLead: "",
  titleAccent: "ColdVault 行动手册",
  subtitle:
    "对抗假招聘攻击的本能反应与最佳实践。把它塑封起来，钉在键盘旁边，发给你在乎的每一位开发者。",
  goldenRuleLabel: "黄金法则",
  goldenRuleText: "永远不要在保存任何重要资产的机器上执行不可信的代码。",
  goldenRuleCaption: "以下一切，只是为支撑这一句话而存在。",
  phaseLabel: "阶段",
  p1Title: "通话之前 —— 审查这个机会",
  p1G1Title: "公司层面的红旗",
  p1G1Items: [
    "域名注册不足 12 个月，或者是老域名却几乎没有任何媒体曝光。",
    "Team 页面列出的名字在 LinkedIn 上查无此人 —— 或者 LinkedIn 档案“过于干净”（老连接极少，看不到任职多年的同事）。",
    "招聘者头像像 AI 生成；几乎没有具名推荐。",
    "邮件来自免费邮箱服务商，或通过隐藏身份的 registrar 注册的域名。",
  ],
  p1G2Title: "职位层面的红旗",
  p1G2Items: [
    "薪酬是岗位市场行情的 2–3 倍 —— 而且一上来就报出。",
    "在你还没开口之前，就主动提出或默认用加密货币付款。",
    "第一条信息里没有公司名 —— 只写「一家领先的区块链公司」。",
    "通用的 Calendly / Cal.com 链接，不在任何公司域名下。",
  ],
  p2Title: "通话之中 —— 盯住话术剧本",
  p2GTitle: "行为信号",
  p2Items: [
    "溢美之词远超他们对你实际的了解。",
    "岗位职责含糊不清，全部推到「稍后与 CTO 的通话」。",
    "团队规模和融资数字：精确但无法验证。",
    "在你被要求动手做技术活之前，他们对你说「这不是技术面」。",
    "被注入紧迫感：「X 个月上 MVP」「这周必须敲定」。",
  ],
  p2AsideLabel: "反制",
  p2AsideBody:
    "反制：以成人对成人的方式回答：“不熟悉的代码我只在一次性沙箱里看——看完会把结论同步给你。”如果对方推搡你，诊断就已经确认。",
  p3Title: "决定性时刻 —— 技术请求",
  p3GTitle: "🚨 立即停车 —— 这些信号意味着：沙箱审计或直接走人",
  p3Items: [
    "在任何合同 / NDA / 身份核验之前，就被要求克隆一个仓库并安装依赖，美其名曰「项目评审」或「代码挑战」。",
    "仓库托管在 Bitbucket、一次性的 GitHub 账号，或者私有服务器上。",
    "职位描述放在 Notion、Google Docs 或一份 PDF 里 —— 不在任何 ATS 系统里。",
    "在你犹豫之后，收到简短的施压信息：「现在要加入了吗？」「仓库跑起来了吗？」",
  ],
  p3GoodTitle: "✅ 可接受",
  p3GoodItems: [
    "在 ColdVault（或任意一次性 VM）内审计。",
    "礼貌地脱离对话。",
    "举报该基础设施。",
  ],
  p3BadTitle: "❌ 不可接受",
  p3BadItems: [
    "在你日常使用的笔记本上执行 npm / pip / cargo install。",
    "用你平时那套带扩展的 IDE 打开项目。",
    "运行对方提供的任何「setup script」。",
  ],
  p4Title: "Cold Audit —— 运行之前先阅读",
  p4Intro1:
    "如果你决定要看这个仓库，请在一次性环境中进行（GitHub Codespaces、全新 VM，或 ColdVault）。在执行任何安装命令之",
  p4IntroStrong: "前",
  p4Intro2: "，先阅读下列内容：",
  p4GTitle: "需要 grep 的静态模式",
  p4Items: [
    "package.json 脚本：postinstall、preinstall、prepare —— 逐行阅读它们执行了什么。",
    "依赖被钉到某个 git commit，而不是 registry 版本。",
    "typo-squat 名称：ethers-utils、web3-helper、node-fs-helper、react-native-utils……",
    "在一个本应轻量的前端项目里，出现 > 100 KB 的源文件。",
    "第一屏看起来正常，但内容通过水平滚动延伸到屏外的文件。",
    "传入 eval、Function、new Function 的稠密 base64 / hex 字符串。",
    "对 fs、child_process、crypto、https、net、process 做 monkey-patch 的模块。",
    "向项目声明的基础设施之外的主机发起 fetch / XMLHttpRequest / net.connect。",
  ],
  p5Title: "如果已经跑了什么 —— 事件响应",
  p5AssumeBody:
    "在完成一次干净的系统重装之前，都要把这台机器视为已被攻陷。响应速度比完美更重要 —— 现在就开始轮换密钥。",
  p5Steps: [
    {
      title: "切断网络",
      body: "断开 Wi-Fi / 以太网。不要关机 —— 之后可能需要对内存做取证。",
    },
    {
      title: "轮换该机器能触达的一切",
      body: "SSH 密钥、GitHub/GitLab token、AWS/GCP/Azure 凭据、npm/PyPI 发布 token、密码管理器主密码、浏览器会话（所有站点登出）。",
    },
    {
      title: "转走所有加密资产",
      body: "在一台干净设备上生成新钱包（最好是硬件钱包，从零初始化），然后转移资金。任何曾在被攻陷机器上出现过的助记词都视作已烧毁。",
    },
    {
      title: "通知客户与雇主",
      body: "任何凭据曾落在该机器上的人都值得一份提醒 —— 哪怕你还不能 100% 确认发生了外带。",
    },
    {
      title: "举报基础设施",
      body: "Atlassian abuse（Bitbucket）、GitHub abuse、Notion abuse、LinkedIn 举报、Calendly 客服 —— 以及你所在国家的 CERT。",
    },
    {
      title: "清盘并重装",
      body: "磁盘完整擦除。全新 OS 安装。只从事件发生之前的备份恢复。",
    },
  ],
  p5ChannelsTitle: "举报渠道",
  p6Title: "日常反射 —— 把它变成习惯",
  p6Cards: [
    {
      title: "机器分离",
      text: "保存着你私钥、钱包、客户凭据的那台笔记本，永远不是你评审陌生人代码的那一台。若凑不出两台，至少用一台一次性 VM。",
    },
    {
      title: "只用硬件钱包",
      text: "对于任何有实际价值的加密资产：使用硬件钱包，在干净设备上初始化，助记词绝不在联网机器上敲入。",
    },
    {
      title: "先读 package.json",
      text: "在陌生仓库里执行任何 install 命令之前，先读清单。postinstall 钩子和 git-pinned 依赖并不隐晦。",
    },
    {
      title: "拒绝不可信的 IDE 扩展",
      text: "不要用你日常的 IDE 打开可疑项目。扩展会按文件类型自动激活，能读取整个 workspace 的内容。",
    },
    {
      title: "外部渠道验证招聘者",
      text: "自己去 LinkedIn 找这家公司，找任职较久的员工，再把招聘者的名字与公司真实招聘页面交叉比对。",
    },
    {
      title: "把高薪陌生 DM 当作分诊事件",
      text: "不是机会。默认动作是「沙箱审计或拒绝」，而不是「好啊，把仓库发来吧」。",
    },
  ],
  ctaTitle: "把这套流程烙进你的工作流",
  ctaBodyPre: "ColdVault 把整本 playbook 压缩成一次 Codespace 启动 + 一个 ",
  ctaBodyCodeSuffix: " 命令。",
  ctaPrimary: "在 GitHub 获取 ColdVault",
  ctaSecondary: "阅读案例分析",
  footerPublishedBy: "发布方：",
  footerSuffix: "。Stay cold. Stay vaulted.",
};

const ja: PlaybookDict = {
  metaTitle: "ColdVault プレイブック — 偽リクルーター攻撃に対する反射と実践",
  metaDescription:
    "ラミネートして手元に置くためのカード：怪しいリクルーター面談の前／最中／後のレッドフラグ、監査マシン反射、そして既に何かが実行されてしまった場合の対応。",
  ogTitle: "ColdVault プレイブック — DeceptiveDevelopment への防御者の反射",
  ogDescription:
    "Lazarus 系の偽リクルーターキャンペーンに狙われた開発者向けの現場チェックリストとインシデントレスポンス手順。",
  navHome: "ホーム",
  navReadCaseStudy: "ケーススタディを読む",
  badge: "🛡️ フィールドマニュアル · v1.0",
  titleLead: "",
  titleAccent: "ColdVault プレイブック",
  subtitle:
    "偽リクルーター攻撃に対する反射とベストプラクティス。ラミネートしてキーボードの横に貼り、大切な開発者仲間に送ってほしい。",
  goldenRuleLabel: "ゴールデンルール",
  goldenRuleText: "価値のある資産が載っているマシン上で、信頼できないコードを絶対に実行しないこと。",
  goldenRuleCaption: "以下のすべては、この一文を支えるための補足にすぎない。",
  phaseLabel: "フェーズ",
  p1Title: "通話の前 — 機会を吟味する",
  p1G1Title: "会社側のレッドフラグ",
  p1G1Items: [
    "ドメインの登録が 12 か月未満、あるいは古いドメインなのにプレスでの痕跡がほぼゼロ。",
    "Team ページに並ぶ名前が LinkedIn に存在しない、あるいは LinkedIn のプロフィールが「きれいすぎる」（古いコネクションが少なく、長期在職の同僚もいない）。",
    "リクルーターのアバターが AI 生成っぽい。実名からの推薦がほとんどない。",
    "無料メールサービス、あるいはプライバシー保護 registrar で登録されたドメインからのメール。",
  ],
  p1G2Title: "オファー側のレッドフラグ",
  p1G2Items: [
    "そのロールの市場レンジに対して 2〜3 倍の報酬 — しかも最初から提示してくる。",
    "こちらが切り出す前に、暗号通貨での支払いを提案または当然視する。",
    "最初のメッセージで会社名を出さず、「ブロックチェーンのリーディングカンパニー」などと曖昧に済ませる。",
    "コーポレートドメインではない、汎用的な Calendly / Cal.com ハンドル。",
  ],
  p2Title: "通話中 — スクリプトを観察する",
  p2GTitle: "行動シグナル",
  p2Items: [
    "相手が実際に知っているあなたの情報量に対して、お世辞が過剰。",
    "ロールの責任範囲は曖昧で、「のちほど CTO との通話で」に先送り。",
    "チーム規模や調達額は、具体的だが検証不能。",
    "「これはテクニカル面接ではありません」と言った直後に、技術的な作業を依頼してくる。",
    "緊急性の注入：「X か月で MVP」「今週中にクローズしたい」。",
  ],
  p2AsideLabel: "カウンタームーブ",
  p2AsideBody:
    "カウンタームーブ：大人対大人として返す。「未知のコードは使い捨てサンドボックス内でしか見ません。結果はあとで共有します。」相手が押し返してきたら、診断は確定だ。",
  p3Title: "真実の瞬間 — 技術的リクエスト",
  p3GTitle: "🚨 ここでハードストップ — この合図は「サンドボックスで監査するか、離脱」の意味",
  p3Items: [
    "契約・NDA・本人確認の前に、「プロジェクトレビュー」や「コードチャレンジ」と称してリポジトリのクローンと依存関係のインストールを求められる。",
    "リポジトリが Bitbucket、使い捨ての GitHub アカウント、あるいはプライベートサーバーに置かれている。",
    "ジョブディスクリプションが Notion、Google Docs、PDF にあるだけで、ATS 上にない。",
    "こちらがためらった直後に、短いプレッシャーメッセージが届く：「もう入ってくれますか？」「リポジトリ、動かせましたか？」",
  ],
  p3GoodTitle: "✅ 受け入れ可",
  p3GoodItems: [
    "ColdVault（あるいは任意の使い捨て VM）内で監査する。",
    "丁寧に会話を降りる。",
    "インフラストラクチャを通報する。",
  ],
  p3BadTitle: "❌ 受け入れ不可",
  p3BadItems: [
    "普段使いのノート PC で npm / pip / cargo install を実行する。",
    "拡張機能が入った普段の IDE でプロジェクトを開く。",
    "渡された「setup script」を走らせる。",
  ],
  p4Title: "The Cold Audit — 実行の前に読む",
  p4Intro1:
    "もしリポジトリを見ると決めたなら、使い捨て環境（GitHub Codespaces、新品の VM、あるいは ColdVault）で行うこと。いかなる install コマンドの",
  p4IntroStrong: "前",
  p4Intro2: "に、次の項目を読むこと：",
  p4GTitle: "grep すべき静的パターン",
  p4Items: [
    "package.json のスクリプト：postinstall、preinstall、prepare — 実行される各行を読むこと。",
    "依存がレジストリのバージョンではなく git commit に固定されている。",
    "typo-squat 名：ethers-utils、web3-helper、node-fs-helper、react-native-utils……",
    "それ以外は軽量なフロントエンドなのに 100 KB を超えるソースファイルがある。",
    "最初の画面は普通に見えるが、内容が水平スクロールで画面外まで続いているファイル。",
    "eval、Function、new Function に渡される、密な base64 / hex 文字列。",
    "fs、child_process、crypto、https、net、process にモンキーパッチを当てるモジュール。",
    "プロジェクトが宣言したインフラ外のホストへの fetch / XMLHttpRequest / net.connect。",
  ],
  p5Title: "既に何かが走ってしまった場合 — インシデントレスポンス",
  p5AssumeBody:
    "クリーンな OS 再インストールが完了するまで、マシンは侵害されていると見なすこと。完璧さより反応速度が重要 — いますぐローテーションを開始する。",
  p5Steps: [
    {
      title: "ネットワークを切る",
      body: "Wi-Fi / Ethernet を切断。ただし電源は落とさない — 必要ならメモリフォレンジックを取る。",
    },
    {
      title: "そのマシンから届く範囲のものを全てローテーション",
      body: "SSH 鍵、GitHub/GitLab トークン、AWS/GCP/Azure 認証情報、npm/PyPI の publish token、パスワードマネージャのマスターパスワード、ブラウザセッション（全サービスでログアウト）。",
    },
    {
      title: "暗号資産を全て退避",
      body: "クリーンなデバイスから新規ウォレット（できればハードウェアをゼロから初期化）を生成し、資金を移動。侵害マシンに触れたシードフレーズは全て焼却扱い。",
    },
    {
      title: "顧客・雇用主への通知",
      body: "そのマシン上に認証情報があった相手には一報を入れる — 外部持ち出しが 100% 確定していなくてもだ。",
    },
    {
      title: "インフラを通報",
      body: "Atlassian abuse（Bitbucket）、GitHub abuse、Notion abuse、LinkedIn 通報、Calendly サポート — そして自国の CERT。",
    },
    {
      title: "ワイプして再インストール",
      body: "ディスクを完全消去、OS をクリーンインストール。復元はインシデント以前のバックアップからのみ。",
    },
  ],
  p5ChannelsTitle: "通報チャネル",
  p6Title: "日々の反射 — 習慣にする",
  p6Cards: [
    {
      title: "マシンを分離する",
      text: "鍵、ウォレット、クライアントの認証情報が載っているノート PC は、見知らぬ他人のコードを評価するためのノート PC とは「絶対」に別物。2 台用意できないなら、使い捨て VM 1 つでも十分だ。",
    },
    {
      title: "ハードウェアウォレットのみ",
      text: "無視できない価値の暗号資産には、ハードウェアウォレットを使うこと。クリーンなデバイスで初期化し、シードフレーズはインターネットに繋がったマシンで一度もタイプしない。",
    },
    {
      title: "まず package.json を読む",
      text: "見知らぬリポジトリでインストールする前に、必ずマニフェストを読むこと。postinstall フックや git 固定の依存は、別に隠されてなどいない。",
    },
    {
      title: "信頼できない IDE 拡張を使わない",
      text: "怪しいプロジェクトを普段使いの IDE で開かない。拡張はファイルタイプで自動起動し、ワークスペース内の全ファイルを読める。",
    },
    {
      title: "リクルーターを別経路で確認",
      text: "自分で LinkedIn からその会社を探し、長期在籍の社員を見つけ、リクルーターの名前を会社公式の採用ページと突き合わせる。",
    },
    {
      title: "高給の冷たい DM はトリアージ案件として扱う",
      text: "チャンスではない。デフォルトは「サンドボックスで見るか、断る」。「いいですよ、リポジトリ送ってください」ではない。",
    },
  ],
  ctaTitle: "この手順をワークフローに埋め込む",
  ctaBodyPre: "ColdVault はこのプレイブック全体を、たった 1 回の Codespace 起動と ",
  ctaBodyCodeSuffix: " コマンドに凝縮する。",
  ctaPrimary: "GitHub で ColdVault を入手",
  ctaSecondary: "ケーススタディを読む",
  footerPublishedBy: "発行：",
  footerSuffix: "。Stay cold. Stay vaulted.",
};

const ko: PlaybookDict = {
  metaTitle: "ColdVault 플레이북 — 가짜 리크루터 공격에 맞서는 반사와 베스트 프랙티스",
  metaDescription:
    "코팅해서 지니고 다닐 카드 한 장: 수상한 리크루터 통화 전/중/후의 레드 플래그, 감사 머신 반사, 그리고 이미 뭔가가 실행된 경우의 대응.",
  ogTitle: "ColdVault 플레이북 — DeceptiveDevelopment 미끼에 대한 방어자의 반사",
  ogDescription:
    "Lazarus 스타일 가짜 리크루터 캠페인의 표적이 된 개발자를 위한 현장 체크리스트와 인시던트 대응 절차.",
  navHome: "홈",
  navReadCaseStudy: "사례 연구 읽기",
  badge: "🛡️ 현장 매뉴얼 · v1.0",
  titleLead: "",
  titleAccent: "ColdVault 플레이북",
  subtitle:
    "가짜 리크루터 공격에 맞서는 반사와 베스트 프랙티스. 코팅하세요. 키보드 옆에 붙이세요. 아끼는 개발자 모두에게 보내세요.",
  goldenRuleLabel: "황금률",
  goldenRuleText: "가치 있는 것이 들어 있는 머신에서 신뢰할 수 없는 코드를 절대 실행하지 말 것.",
  goldenRuleCaption: "아래의 모든 내용은 이 한 문장을 받치기 위한 것이다.",
  phaseLabel: "페이즈",
  p1Title: "통화 전 — 기회를 걸러내기",
  p1G1Title: "회사에 대한 레드 플래그",
  p1G1Items: [
    "등록된 지 12개월 미만의 도메인, 또는 오래됐는데 언론 노출이 거의 전무한 도메인.",
    "Team 페이지에 올라온 이름들이 LinkedIn에서 검색되지 않거나, LinkedIn 프로필이 '너무 깔끔'하다(오래된 커넥션이 거의 없고, 장기 근속 동료도 없음).",
    "리크루터 아바타가 AI 생성된 것처럼 보임. 실명 추천이 거의 없음.",
    "이메일이 무료 서비스 또는 신원을 숨기는 registrar에서 등록된 도메인에서 옴.",
  ],
  p1G2Title: "오퍼에 대한 레드 플래그",
  p1G2Items: [
    "해당 역할의 시장 범위 대비 2~3배 보상 — 처음부터 내민다.",
    "당신이 묻기도 전에 암호화폐 지급을 제안하거나 당연시한다.",
    "첫 메시지에 회사명이 없다 — '블록체인 분야의 리딩 컴퍼니' 같은 표현으로 얼버무림.",
    "코퍼레이트 도메인이 아닌 범용 Calendly / Cal.com 핸들.",
  ],
  p2Title: "통화 중 — 스크립트를 주시",
  p2GTitle: "행동 시그널",
  p2Items: [
    "상대가 실제로 당신에 대해 아는 것에 비해 아첨이 과하다.",
    "역할의 책임 범위가 모호하고, 'CTO와의 다음 통화'로 넘겨진다.",
    "팀 규모와 투자 금액: 정확한 수치지만 검증 불가.",
    "기술적인 일을 요구하기 직전에 '이건 기술 면접이 아닙니다'라고 말한다.",
    "긴급성을 주입한다: 'X개월 안에 MVP', '이번 주 안에 체결해야 합니다'.",
  ],
  p2AsideLabel: "카운터 무브",
  p2AsideBody:
    "카운터 무브: 어른 대 어른으로 답하라. “알지 못하는 코드는 일회용 샌드박스 안에서만 살펴봅니다 — 결과가 나오면 다시 연락드리죠.” 상대가 밀어붙이면, 진단은 확정된 것이다.",
  p3Title: "결정적 순간 — 기술적 요청",
  p3GTitle: "🚨 하드 스톱 — 이 신호는 '샌드박스에서 감사하거나 그만두라'는 뜻",
  p3Items: [
    "계약 / NDA / 신원 검증 전에 '프로젝트 리뷰'나 '코드 챌린지' 명목으로 레포 클론 + 의존성 설치를 요구한다.",
    "레포가 Bitbucket, 일회용 GitHub 계정, 혹은 사설 서버에 있다.",
    "채용 공고가 Notion, Google Docs, 또는 PDF에 있고 ATS에는 없다.",
    "머뭇거리면 짧은 압박 메시지가 온다: '이제 합류하시는 건가요?' / '레포는 돌렸나요?'",
  ],
  p3GoodTitle: "✅ 허용",
  p3GoodItems: [
    "ColdVault(또는 일회용 VM) 내부에서 감사.",
    "정중하게 대화에서 빠진다.",
    "인프라를 신고한다.",
  ],
  p3BadTitle: "❌ 불허",
  p3BadItems: [
    "일상 업무용 노트북에서 npm / pip / cargo install 실행.",
    "평소 쓰는 IDE에 확장 기능을 켠 채 프로젝트 오픈.",
    "상대가 보낸 'setup script'를 그대로 실행.",
  ],
  p4Title: "The Cold Audit — 실행 전에 읽는다",
  p4Intro1:
    "레포를 들여다보기로 했다면, 일회용 환경(GitHub Codespaces, 새 VM, 또는 ColdVault)에서 하라. 어떤 설치 명령도 실행하기 ",
  p4IntroStrong: "전",
  p4Intro2: "에 다음 항목들을 읽으라:",
  p4GTitle: "grep 해야 할 정적 패턴",
  p4Items: [
    "package.json 스크립트: postinstall, preinstall, prepare — 실행되는 모든 줄을 읽을 것.",
    "레지스트리 버전이 아닌 git 커밋에 고정된 의존성.",
    "typo-squat 이름: ethers-utils, web3-helper, node-fs-helper, react-native-utils…",
    "그 외에는 가벼운 프론트엔드 프로젝트인데 100 KB를 넘는 소스 파일.",
    "첫 화면은 정상으로 보이지만, 내용이 수평 스크롤로 화면 밖까지 이어지는 파일.",
    "eval, Function, new Function에 전달되는 촘촘한 base64 / hex 문자열.",
    "fs, child_process, crypto, https, net, process를 monkey-patch하는 모듈.",
    "프로젝트가 선언한 인프라 바깥의 호스트로 향하는 fetch / XMLHttpRequest / net.connect.",
  ],
  p5Title: "이미 뭔가 실행된 경우 — 인시던트 대응",
  p5AssumeBody:
    "깨끗한 OS 재설치가 끝나기 전까지는 머신이 침해됐다고 간주하라. 완벽함보다 반응 속도가 중요하다 — 지금 당장 키 로테이션을 시작하라.",
  p5Steps: [
    {
      title: "네트워크를 끊는다",
      body: "Wi-Fi / Ethernet 차단. 단, 전원은 끄지 말 것 — 필요 시 RAM 포렌식이 필요하다.",
    },
    {
      title: "그 머신에서 닿을 수 있는 모든 것을 로테이션",
      body: "SSH 키, GitHub/GitLab 토큰, AWS/GCP/Azure 자격 증명, npm/PyPI 게시 토큰, 비밀번호 관리자의 마스터 비밀번호, 브라우저 세션(모든 서비스에서 로그아웃).",
    },
    {
      title: "모든 암호화폐를 옮긴다",
      body: "깨끗한 기기에서 새 지갑을 생성(가급적 하드웨어, 처음부터 초기화)하고 자금을 옮긴다. 침해된 머신에 닿은 시드 문구는 모두 소각된 것으로 간주.",
    },
    {
      title: "고객과 고용주에게 알린다",
      body: "자격 증명이 그 머신에 있던 상대라면 모두 알릴 가치가 있다 — 유출이 100% 확정되지 않았더라도.",
    },
    {
      title: "인프라를 신고",
      body: "Atlassian abuse(Bitbucket), GitHub abuse, Notion abuse, LinkedIn 신고, Calendly 지원 — 그리고 자국 CERT.",
    },
    {
      title: "와이프하고 재설치",
      body: "디스크 완전 삭제. OS 클린 인스톨. 복원은 반드시 사건 이전 백업에서만.",
    },
  ],
  p5ChannelsTitle: "신고 채널",
  p6Title: "일상 반사 — 습관으로 만들기",
  p6Cards: [
    {
      title: "머신을 분리하라",
      text: "키, 지갑, 클라이언트 자격 증명이 있는 노트북은 낯선 사람의 코드를 평가하는 노트북과 '절대' 같지 않다. 두 대를 두기 어렵다면 일회용 VM 하나로도 충분하다.",
    },
    {
      title: "하드웨어 지갑만",
      text: "가치가 있는 암호화폐는 반드시 하드웨어 지갑을 사용. 깨끗한 기기에서 초기화하고, 시드 문구는 인터넷에 연결된 머신에서 절대 타이핑하지 말 것.",
    },
    {
      title: "package.json을 먼저 읽어라",
      text: "낯선 레포에서 어떤 install 명령을 실행하기 전에 매니페스트부터 읽어라. postinstall 훅과 git 고정 의존성은 그다지 은밀하지 않다.",
    },
    {
      title: "신뢰할 수 없는 IDE 확장 금지",
      text: "의심스러운 프로젝트를 일상 IDE에서 열지 말라. 확장은 파일 타입에 따라 자동 활성화되며, 워크스페이스의 모든 것을 읽을 수 있다.",
    },
    {
      title: "리크루터는 외부 경로로 검증",
      text: "직접 LinkedIn에서 회사를 찾고, 장기 근속 직원을 찾고, 리크루터 이름을 회사의 실제 채용 페이지와 대조하라.",
    },
    {
      title: "고연봉의 차가운 DM은 트리아지 이벤트로 취급",
      text: "기회가 아니다. 기본값은 '샌드박스 아니면 거절'이지 '그럼요, 레포 보내주세요'가 아니다.",
    },
  ],
  ctaTitle: "이 절차를 워크플로에 굽는다",
  ctaBodyPre: "ColdVault은 이 플레이북 전체를 Codespace 한 번 실행 + ",
  ctaBodyCodeSuffix: " 명령 하나로 압축한다.",
  ctaPrimary: "GitHub에서 ColdVault 받기",
  ctaSecondary: "사례 연구 읽기",
  footerPublishedBy: "발행:",
  footerSuffix: ". Stay cold. Stay vaulted.",
};

const ar: PlaybookDict = {
  metaTitle:
    "دليل ColdVault الميداني — ردود فعل وأفضل الممارسات ضد هجمات المجنّدين المزيّفين",
  metaDescription:
    "بطاقة يمكنك تغليفها والاحتفاظ بها: علامات التحذير قبل/خلال/بعد مكالمة مُجنِّد مشبوهة، ردّ فعل آلة التدقيق، وماذا تفعل إذا سبق وتم تنفيذ شيء ما.",
  ogTitle: "دليل ColdVault — ردود فعل المدافع ضد إغراءات DeceptiveDevelopment",
  ogDescription:
    "قائمة مراجعة ميدانية وخطوات الاستجابة للحوادث للمطوّرين المستهدفين بحملات مُجنّدين مزيّفين على غرار Lazarus.",
  navHome: "الرئيسية",
  navReadCaseStudy: "اقرأ دراسة الحالة",
  badge: "🛡️ دليل ميداني · v1.0",
  titleLead: "",
  titleAccent: "دليل ColdVault",
  subtitle:
    "ردود فعل وأفضل ممارسات ضد هجمات المجنّدين المزيّفين. غَلِّفها. ثبّتها بجوار لوحة مفاتيحك. أرسلها إلى كل مطوّر يهمّك أمره.",
  goldenRuleLabel: "القاعدة الذهبية",
  goldenRuleText:
    "لا تشغّل أبداً كوداً غير موثوق على جهاز يحوي أي شيء ذي قيمة بالنسبة لك.",
  goldenRuleCaption: "كل ما يلي ليس سوى سند لهذه الجملة الواحدة.",
  phaseLabel: "المرحلة",
  p1Title: "قبل المكالمة — افحص الفرصة",
  p1G1Title: "علامات تحذير على مستوى الشركة",
  p1G1Items: [
    "نطاق مسجَّل منذ أقل من 12 شهراً، أو نطاق قديم لكن دون أي أثر صحفي تقريباً.",
    "صفحة Team تُدرج أسماء لا تظهر على LinkedIn — أو ملفات LinkedIn تبدو «نظيفة أكثر من اللازم» (اتصالات قديمة قليلة، ولا زملاء ذوو أقدمية طويلة).",
    "أفاتار المُجنِّد يبدو مولَّداً بالذكاء الاصطناعي؛ توصيات قليلة من أشخاص بأسماء محددة.",
    "البريد من مزوّد مجاني، أو من نطاق مسجَّل عبر registrar يُخفي الهوية.",
  ],
  p1G2Title: "علامات تحذير على مستوى العرض",
  p1G2Items: [
    "تعويض 2–3 أضعاف نطاق السوق لهذا الدور — يُعلَن عنه منذ البداية.",
    "الدفع بالعملات الرقمية يُقترح أو يُعامَل كأمر طبيعي قبل أن تسأل.",
    "لا اسم للشركة في الرسالة الأولى — «شركة رائدة في مجال البلوكتشين» فقط.",
    "رابط Calendly / Cal.com عام، وليس على نطاق مؤسسي.",
  ],
  p2Title: "أثناء المكالمة — راقب السيناريو",
  p2GTitle: "إشارات سلوكية",
  p2Items: [
    "مديح مبالغ فيه مقارنة بما يعرفونه فعلياً عنك.",
    "مسؤوليات الدور مبهمة، تُؤجَّل إلى «مكالمة لاحقة مع الـ CTO».",
    "أرقام حجم الفريق والتمويل: دقيقة لكن غير قابلة للتحقق.",
    "يُقال لك «هذه ليست مقابلة تقنية» قبل طلب شيء تقني منك مباشرة.",
    "يُحقنون شعوراً بالاستعجال: «MVP خلال X شهر»، «يجب أن نُغلق هذا الأسبوع».",
  ],
  p2AsideLabel: "ردّ مضاد",
  p2AsideBody:
    "ردّ مضاد: أجب من موقع الراشد إلى الراشد. «لا أراجع كوداً مجهولاً إلا داخل سandbox قابلة للتخلص منها — سأعود إليك بالنتائج.» إذا ضغطوا عليك، فقد تأكّد التشخيص.",
  p3Title: "لحظة الحقيقة — الطلب التقني",
  p3GTitle: "🚨 توقّف كامل — هذه الإشارات تعني: دقّق في sandbox أو انسحب",
  p3Items: [
    "يُطلب منك استنساخ repo وتنصيب التبعيات كـ«مراجعة مشروع» أو «تحدّي كود» قبل أي عقد / NDA / تحقق من الهوية.",
    "الـ repo على Bitbucket أو حساب GitHub مؤقت أو خادم خاص.",
    "وصف الوظيفة موجود على Notion أو Google Docs أو PDF — وليس على ATS.",
    "بعد ترددك، تصلك رسالة ضغط قصيرة: «هل ستنضم الآن؟» / «هل نجحت في تشغيل الـ repo؟»",
  ],
  p3GoodTitle: "✅ مقبول",
  p3GoodItems: [
    "التدقيق داخل ColdVault (أو أي VM قابلة للتخلص).",
    "الانسحاب بلباقة.",
    "الإبلاغ عن البنية التحتية.",
  ],
  p3BadTitle: "❌ غير مقبول",
  p3BadItems: [
    "تشغيل npm / pip / cargo install على حاسبك اليومي.",
    "فتح المشروع في الـ IDE المعتاد مع إضافاته.",
    "تشغيل أي «setup script» مرفق.",
  ],
  p4Title: "The Cold Audit — اقرأ قبل أن تنفّذ",
  p4Intro1:
    "إذا قرّرت أن تلقي نظرة على الـ repo، فافعل ذلك داخل بيئة قابلة للتخلص (GitHub Codespaces، VM جديدة، أو ColdVault). اقرأ هذه الأمور ",
  p4IntroStrong: "قبل",
  p4Intro2: " أي أمر تنصيب:",
  p4GTitle: "أنماط ثابتة يجب البحث عنها بالـ grep",
  p4Items: [
    "سكربتات package.json: postinstall، preinstall، prepare — اقرأ كل سطر يُنفَّذ.",
    "تبعيات مثبَّتة على git commit بدلاً من إصدار من الـ registry.",
    "أسماء typo-squat: ethers-utils، web3-helper، node-fs-helper، react-native-utils…",
    "ملفات مصدر > 100 KB في مشروع فرونت-إند خفيف أصلاً.",
    "ملفات شاشتها الأولى تبدو عادية، لكن المحتوى يمتد خارج الشاشة عبر تمرير أفقي.",
    "سلاسل base64 / hex كثيفة تُمرَّر إلى eval أو Function أو new Function.",
    "وحدات تقوم بـ monkey-patch على fs، child_process، crypto، https، net، process.",
    "استدعاءات fetch / XMLHttpRequest / net.connect إلى مضيفين خارج البنية المُعلَنة للمشروع.",
  ],
  p5Title: "إذا سبق وتم تنفيذ شيء ما — الاستجابة للحوادث",
  p5AssumeBody:
    "افترض أن الجهاز مُخترَق إلى أن تُعاد تثبيت نظام تشغيل نظيف. زمن الاستجابة أهم من الكمال — ابدأ دورات التبديل الآن.",
  p5Steps: [
    {
      title: "اقطع الشبكة",
      body: "افصل Wi-Fi / Ethernet. لا تُطفئ الجهاز — قد تحتاج إلى تحليل جنائي للذاكرة.",
    },
    {
      title: "دوّر كل ما يمكن الوصول إليه من هذا الجهاز",
      body: "مفاتيح SSH، توكنات GitHub/GitLab، اعتمادات AWS/GCP/Azure، توكنات النشر على npm/PyPI، كلمة المرور الرئيسية لمدير كلمات المرور، جلسات المتصفح (تسجيل خروج في كل مكان).",
    },
    {
      title: "انقل كل العملات الرقمية",
      body: "من جهاز نظيف، أنشئ محفظة جديدة (الأفضل محفظة أجهزة، مُهيّأة من الصفر) وانقل الأموال. اعتبر أي seed phrase مرّت على الجهاز المُخترَق محروقة.",
    },
    {
      title: "أبلغ العملاء وأصحاب العمل",
      body: "كل من كانت اعتماداته على ذلك الجهاز يستحق تنبيهاً — حتى لو لم تكن متأكداً 100% من حدوث تسريب.",
    },
    {
      title: "أبلغ عن البنية التحتية",
      body: "Atlassian abuse (Bitbucket)، GitHub abuse، Notion abuse، بلاغ LinkedIn، دعم Calendly — بالإضافة إلى الـ CERT الوطني.",
    },
    {
      title: "امسح وأعد التثبيت",
      body: "مسح كامل للقرص. تثبيت نظيف للنظام. استعادة فقط من نسخ احتياطية أقدم من الحادثة.",
    },
  ],
  p5ChannelsTitle: "قنوات الإبلاغ",
  p6Title: "ردود فعل يومية — ابنِ العادة",
  p6Cards: [
    {
      title: "افصل الأجهزة",
      text: "الحاسب الذي يحمل مفاتيحك ومحافظك واعتمادات عملائك لا يكون أبداً هو الحاسب الذي تراجع عليه كود الغرباء. إذا لم تستطع امتلاك جهازين، فـ VM قابلة للتخلص واحدة تكفي.",
    },
    {
      title: "محافظ أجهزة فقط",
      text: "لأي عملة رقمية ذات قيمة معتبرة: محفظة أجهزة، مُهيّأة على جهاز نظيف، و seed phrase لا تُكتَب أبداً على جهاز متصل بالإنترنت.",
    },
    {
      title: "اقرأ package.json أولاً",
      text: "قبل أي أمر تنصيب على repo غير مألوف، اقرأ الـ manifest. خطافات postinstall والتبعيات المثبَّتة على git ليست خفيّة.",
    },
    {
      title: "لا لإضافات IDE غير موثوقة",
      text: "لا تفتح المشاريع المشبوهة في الـ IDE اليومي. الإضافات تُفعَّل تلقائياً بحسب نوع الملف ويمكنها قراءة كل شيء في مساحة العمل.",
    },
    {
      title: "تحقّق من المُجنّدين عبر قناة خارجية",
      text: "ابحث عن الشركة على LinkedIn بنفسك. ابحث عن موظفين بأقدمية. قارن اسم المُجنِّد بصفحة التوظيف الرسمية للشركة.",
    },
    {
      title: "عامل DMs الباردة ذات الرواتب العالية كأحداث فرز",
      text: "ليست فرصاً. الردّ الافتراضي هو «sandbox أو اعتذار»، وليس «بالطبع، أرسل لي الـ repo».",
    },
  ],
  ctaTitle: "اطبع هذا الإجراء داخل سير عملك",
  ctaBodyPre: "يُكثِّف ColdVault كامل هذا الدليل في إطلاق Codespace واحد وأمر ",
  ctaBodyCodeSuffix: ".",
  ctaPrimary: "احصل على ColdVault من GitHub",
  ctaSecondary: "اقرأ دراسة الحالة",
  footerPublishedBy: "ناشره",
  footerSuffix: ". Stay cold. Stay vaulted.",
};

export const playbookTranslations: Record<Locale, PlaybookDict> = {
  en,
  fr,
  de,
  es,
  zh,
  ja,
  ko,
  ar,
};
