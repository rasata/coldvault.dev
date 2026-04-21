import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/i18n/context";
import { articleTranslations } from "@/i18n/article";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MessageSquare,
  ShieldCheck,
  Target,
  User,
  XCircle,
  Zap,
} from "lucide-react";

const REPO_URL = "https://github.com/rasata/coldvault.dev";

export const Route = createFileRoute("/blog/anatomy-of-a-deceptive-developer-attack")({
  component: ArticlePage,
});

const PAGE_TITLE =
  "Anatomy of a DeceptiveDevelopment attack — how a Lazarus-linked recruiter almost ran code on my machine";
const PAGE_DESCRIPTION =
  "First-hand case study of a North Korean-style fake-recruiter campaign: LinkedIn approach, Bitbucket payload, psychological mechanics, IOCs, and the defensive architecture that stopped it.";

function ArticlePage() {
  useEffect(() => {
    document.title = PAGE_TITLE;
    const setMeta = (sel: string, attr: "name" | "property", key: string, value: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(sel);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };
    setMeta('meta[name="description"]', "name", "description", PAGE_DESCRIPTION);
    setMeta(
      'meta[property="og:title"]',
      "property",
      "og:title",
      "Anatomy of a DeceptiveDevelopment attack — Coldvault Research",
    );
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      "Forensic write-up of a Lazarus-linked fake-recruiter campaign and the ColdVault defence built in response.",
    );
    setMeta('meta[property="og:type"]', "property", "og:type", "article");
  }, []);

  return (
    <div className="min-h-screen bg-grid">
      <ArticleNav />
      <article className="mx-auto max-w-3xl px-4 pt-28 pb-16 sm:px-6">
        <ArticleHeader />
        <TLDR />
        <Section
          n="0"
          title="Why this write-up exists"
          icon={<Target className="h-5 w-5" />}
        >
          <p>
            Most incident write-ups are published <em>after</em> the victim has
            paid. This one is published because <strong>nobody paid</strong>, and
            because the playbook used against me is now used at industrial scale
            against the developer community — especially in Web3.
          </p>
          <p>This post has three jobs:</p>
          <ul>
            <li>
              <strong>Preserve the evidence</strong> — full transcripts, IOCs,
              screenshots, so defenders can pivot on the infrastructure.
            </li>
            <li>
              <strong>Explain the psychology</strong> — through Transactional
              Analysis, neuroscience and Cialdini's influence levers.
            </li>
            <li>
              <strong>Hand over a ready-made defence</strong> —{" "}
              <a href="https://coldvault.dev">coldvault.dev</a>, a Codespace-based
              static-audit sandbox.
            </li>
          </ul>
        </Section>

        <Section n="1" title="Timeline of the attack" icon={<Calendar className="h-5 w-5" />}>
          <SubHeading>1.1 Initial contact (LinkedIn)</SubHeading>
          <Quote>
            Hello [Researcher] I hope you're doing well, excited to connect.
            We're a leading company in blockchain and digital innovation,
            currently building an exciting new project. […] You're welcome to
            join us as a Technical Manager, working fully remotely, either
            part-time or full-time. The expected salary for this role is $20k ~
            $25k USD per month. […] calendly.com/best_collaboration/business
          </Quote>
          <p>Already visible without any technical skill:</p>
          <ul>
            <li>No company named in the message body — empty signifier.</li>
            <li>Salary disclosed before any interview — inverted protocol.</li>
            <li>Generic Calendly handle on a non-corporate domain.</li>
            <li>Flexibility offered before any role description.</li>
          </ul>

          <SubHeading>1.2 Pre-call framing email</SubHeading>
          <Quote>
            This is our company site: https://invoblox.com/ Our project is a
            next-generation cryptocurrency trading platform. […] The project is
            backed with an investment of $6.5 million. […] This meeting is
            intended to be an introductory discussion rather than a technical
            interview.
          </Quote>
          <p>Three stacked manipulations:</p>
          <ul>
            <li>
              <strong>A real-looking site as proof of existence</strong> —
              brand piggy-back on a 4-year-old domain.
            </li>
            <li>
              <strong>A non-verifiable funding figure</strong> — precise enough
              to feel real, too small to appear in Crunchbase.
            </li>
            <li>
              <strong>"Not a technical interview"</strong> — pre-emptive lowering
              of the audit guard.
            </li>
          </ul>

          <SubHeading>1.3 The 60-minute "intro call"</SubHeading>
          <p>
            Warm opener, validation of background, plausible MERN + Solidity
            pitch, "17 full-time members, $6.5M backed", USD 20–25k/month, 2-week
            paid trial in stablecoins. Then near the end, the actual ask:
          </p>
          <Quote>
            Could you pull our repo and take a look at the architecture before
            the CTO call? Just clone it and run it locally, give us your
            feedback.
          </Quote>
          <p>
            Repo:{" "}
            <code>bitbucket.org/teamincwork/pro_lmng</code>. Job description on a
            standalone Notion page — disposable, no recruiter footprint.
          </p>

          <SubHeading>1.4 What I actually did</SubHeading>
          <p>
            I cloned the repo. I did <strong>not</strong> run{" "}
            <code>npm install</code>. I read <code>package.json</code>.
          </p>
          <p>
            I found a dependency whose name mimicked a utility library but whose
            published code <strong>overrode Node.js's native fs module at
            require-time</strong>. Any subsequent code reading or writing files
            would be routed through the malicious module first — the
            load-bearing primitive of several BeaverTail variants documented by
            ESET and Unit 42.
          </p>
          <p>
            I told the recruiter I'd only work in GitHub Codespaces. He said
            he'd "consider it".
          </p>

          <SubHeading>1.5 The pressure follow-up</SubHeading>
          <Quote>Could you join the scheduled meeting now?</Quote>
          <p>
            One sentence. Closed question. Pure time-pressure probe — a textbook
            Cialdini commitment & consistency hook under artificial urgency. I
            did not reply. The conversation ended.
          </p>
        </Section>

        <Section
          n="2"
          title="Attribution: this is DeceptiveDevelopment"
          icon={<AlertTriangle className="h-5 w-5" />}
        >
          <p>
            Every indicator in my case maps 1:1 onto the DeceptiveDevelopment /
            Contagious Interview cluster publicly documented by ESET, Palo Alto
            Unit 42, Group-IB and Zscaler since 2023:
          </p>
          <SignatureTable />
        </Section>

        <Section n="3" title="The kill chain the attacker expected" icon={<Zap className="h-5 w-5" />}>
          <KillChain />
          <p className="mt-6">
            Steps A→E take less than two hours. Once step E fires, the machine
            is compromised. The single decision point that controls the entire
            outcome is <strong>D — do you run the code on your own machine?</strong>
          </p>
        </Section>

        <Section
          n="4"
          title="Why this works on senior engineers"
          icon={<Brain className="h-5 w-5" />}
        >
          <p>
            Technical seniority is not a defence here — in several ways it is
            the opposite. Senior engineers hold production credentials and
            wallets, are more exposed on LinkedIn, and are more susceptible to
            "your background caught our attention".
          </p>

          <SubHeading>4.1 Transactional Analysis — what state is being addressed</SubHeading>
          <TATable />
          <p className="mt-4">
            A healthy counter is the <em>crossed transaction</em>: reply
            Adult-to-Adult, refusing the implicit frame. "I'll audit the repo in
            a disposable environment before any install" breaks the script.
          </p>

          <SubHeading>4.2 Neuroscience — three systems hijacked</SubHeading>
          <ul>
            <li>
              <strong>Reward prediction (VTA → nucleus accumbens).</strong> USD
              25k/month registers as a positive prediction error; dopamine
              doesn't encode pleasure, it encodes motivation to{" "}
              <em>protect the prediction</em> — i.e. motivated reasoning.
            </li>
            <li>
              <strong>Trust encoding (caudate nucleus).</strong> One warm hour
              with technical jargon is enough to lay down a neural trust
              signature logic struggles to override.
            </li>
            <li>
              <strong>Decision fatigue (vmPFC, dlPFC).</strong> Novelty + social
              pressure + information density + urgency starve the part of your
              brain responsible for "wait, let me read package.json".
            </li>
          </ul>

          <SubHeading>4.3 Cialdini stack — in order of appearance</SubHeading>
          <ol>
            <li><strong>Authority</strong> — "co-founder", "CTO will join later", "$6.5M backed".</li>
            <li><strong>Social proof</strong> — "17 full-time members, 7 seniors".</li>
            <li><strong>Liking</strong> — warm tone, personalised flattery, LinkedIn mirroring.</li>
            <li><strong>Reciprocity</strong> — paid 2-week trial offered before any work.</li>
            <li><strong>Commitment & consistency</strong> — once you've spent an hour, refusing "just clone the repo" feels disproportionate.</li>
            <li><strong>Scarcity / urgency</strong> — "MVP in 6 months", "could you join now?"</li>
          </ol>

          <SubHeading>4.4 Why "I'm too smart for this" is the wrong defence</SubHeading>
          <p>
            Every public victim write-up contains a variant of "I thought I was
            too careful for this." Intelligence is not the defence.{" "}
            <strong>Procedure is.</strong> The defence is architectural: remove
            your ability to install untrusted code on a machine that matters.
          </p>
        </Section>

        <Section
          n="5"
          title="The defensive reflex — and the tool that automates it"
          icon={<ShieldCheck className="h-5 w-5" />}
        >
          <RuleCallout>
            Never execute untrusted code on a machine that holds anything of
            value to you.
          </RuleCallout>
          <p>Two practical corollaries:</p>
          <ul>
            <li>
              <strong>Separate machines, or separate boundaries.</strong> The
              laptop with your keys, wallets, credentials and SSH identities is
              not the laptop where you evaluate strangers' code. If you only
              have one, the "second machine" must be a disposable VM.
            </li>
            <li>
              <strong>Read before you run.</strong> Every <code>package.json</code>,{" "}
              <code>pyproject.toml</code>, <code>Cargo.toml</code> gets audited
              before any install. <code>postinstall</code>, <code>preinstall</code>,{" "}
              <code>prepare</code> scripts get read.
            </li>
          </ul>

          <SubHeading>5.2 What ColdVault does</SubHeading>
          <ul>
            <li>The suspect repo is attached as a <strong>read-only git submodule</strong> under <code>target/</code>.</li>
            <li>Analysis runs inside a <strong>GitHub Codespace</strong> — ephemeral VM, blast radius = one container.</li>
            <li><strong>40+ security tools</strong> pre-baked: SAST, SCA, secret hunters, malware triage, IaC scanners, SBOM.</li>
            <li>Curated <strong>Claude Code skills</strong> turn "review this repo" into a reproducible pipeline.</li>
            <li>Outputs <code>reports/findings.json</code>, <code>SUMMARY.md</code>, SARIF, CycloneDX SBOM.</li>
          </ul>
          <CodeBlock>{`git clone https://github.com/rasata/coldvault.dev
cd coldvault.dev
# Open in GitHub Codespaces
gh auth login && claude login
git submodule add --depth=1 https://bitbucket.org/teamincwork/pro_lmng.git target/
claude
# > /audit`}</CodeBlock>
          <p className="mt-4">
            Five minutes later, <code>reports/SUMMARY.md</code> tells you whether
            the fs-shadowing dependency is there, whether postinstall hooks are
            suspicious, whether YARA hits on bundled binaries — and whether
            payloads are hidden off-screen behind horizontal scroll.
          </p>
        </Section>

        <Section n="6" title="Field checklist" icon={<CheckCircle2 className="h-5 w-5" />}>
          <p>
            The full reflexes & response playbook lives on its own page —
            laminate-it-and-keep-it-near-your-keyboard format.
          </p>
          <div className="my-6">
            <Button asChild className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] text-background font-bold hover:opacity-90">
              <Link to="/playbook">
                Open the Playbook
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Section>

        <Section n="7" title="Indicators of Compromise" icon={<AlertTriangle className="h-5 w-5" />}>
          <SubHeading>7.1 Infrastructure</SubHeading>
          <IOCTable />

          <SubHeading>7.2 Behavioural pattern (TTPs)</SubHeading>
          <ul>
            <li>Unsolicited LinkedIn DM → Calendly → 60-min intro call.</li>
            <li>Empty-description company opener.</li>
            <li>Salary band USD 20–25k/month announced pre-interview.</li>
            <li>Repo on Bitbucket; job description on Notion.</li>
            <li>Payload via dependency overriding Node's <code>fs</code>.</li>
            <li>Immediate pressure follow-up on hesitation.</li>
          </ul>

          <SubHeading>7.3 Technical patterns to scan for</SubHeading>
          <ul>
            <li><code>postinstall</code> / <code>preinstall</code> / <code>prepare</code> running dependency code.</li>
            <li>Dependencies pinned to a git commit (not an npm version).</li>
            <li>Typo-squat names: <code>ethers-utils</code>, <code>web3-helper</code>, <code>node-fs-helper</code>…</li>
            <li>Source files &gt; 100 KB in light front-end projects.</li>
            <li>Horizontal scroll hiding payload off-screen on a single line.</li>
            <li>Dense base64/hex passed to <code>eval</code>, <code>Function</code>, <code>new Function</code>.</li>
            <li>Modules monkey-patching <code>fs</code>, <code>child_process</code>, <code>crypto</code>, <code>https</code>, <code>net</code>, <code>process</code>.</li>
          </ul>
        </Section>

        <Section
          n="8"
          title="References & further reading"
          icon={<BookOpen className="h-5 w-5" />}
        >
          <p>
            Every claim in this case study is corroborated by public threat
            intelligence, peer-reviewed research, or a primary textbook. Citations
            are grouped by topic so readers can dig into whichever layer they want
            to verify — attribution, psychology, or neuroscience.
          </p>
          <ReferencesBlock />
        </Section>

        <Section n="9" title="Closing" icon={<ShieldCheck className="h-5 w-5" />}>
          <p>
            I was lucky — not because I'm particularly sharp, but because I read
            <code>package.json</code> before running <code>npm install</code>,
            and because I had the Codespaces option. <strong>Luck isn't a
            security model. Procedure is.</strong>
          </p>
          <p>
            If you take one thing from this post:{" "}
            <strong>decouple the audit machine from the value machine.</strong>{" "}
            If you take a second: do not treat an unsolicited high-salary DM as
            an opportunity — treat it as a triage event.
          </p>
          <p className="text-lg font-semibold bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
            Stay cold. Stay vaulted.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            — ZONOVA RESEARCH, ZONOVA RESEARCH
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] text-background font-bold hover:opacity-90">
              <a href={REPO_URL} target="_blank" rel="noreferrer">
                <Github className="mr-2 h-4 w-4" />
                Get ColdVault
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/playbook">
                Read the Playbook
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Section>

        <Footer />
      </article>
    </div>
  );
}

/* ───────── components ───────── */

function ArticleNav() {
  const { locale } = useTranslation();
  const a = articleTranslations[locale];
  return (
    <header className="fixed top-0 z-50 w-full glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display font-bold">
          <ShieldCheck className="h-5 w-5 text-[var(--neon-cyan)]" />
          <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
            ColdVault
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/playbook">Playbook</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function ArticleHeader() {
  const { locale } = useTranslation();
  const a = articleTranslations[locale];
  return (
    <header className="mb-10">
      <div className="mb-4 flex flex-wrap gap-2">
        {a.tags.map((t) => (
          <Badge key={t} variant="outline" className="border-[var(--neon-violet)]/40">
            #{t}
          </Badge>
        ))}
      </div>
      <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
        {a.title1}{" "}
        <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
          {a.titleAccent}
        </span>{" "}
        {a.title2}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">{a.subtitle}</p>
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <User className="h-4 w-4" />
          {a.authorName}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {a.publishedOn}
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-[var(--neon-cyan)]" />
          {a.authorOrg}
        </span>
      </div>
    </header>
  );
}

function TLDR() {
  const { locale } = useTranslation();
  const a = articleTranslations[locale];
  return (
    <div className="mb-10 rounded-2xl border border-[var(--neon-cyan)]/30 bg-gradient-to-br from-[var(--neon-cyan)]/5 to-[var(--neon-magenta)]/5 p-6">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--neon-cyan)]">
        <Zap className="h-4 w-4" />
        {a.tldrLabel}
      </div>
      <p className="text-sm leading-relaxed text-foreground">{a.tldrBody}</p>
    </div>
  );
}

function Section({
  n,
  title,
  icon,
  children,
}: {
  n: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12 scroll-mt-24" id={`s${n}`}>
      <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-bold sm:text-3xl">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-magenta)]/20 text-[var(--neon-cyan)]">
          {icon}
        </span>
        <span className="text-muted-foreground">§{n}</span>
        <span>{title}</span>
      </h2>
      <div className="prose prose-invert max-w-none space-y-4 text-foreground/90 [&_p_a]:text-[var(--neon-cyan)] [&_p_a]:underline [&_li_a]:text-[var(--neon-cyan)] [&_li_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-[var(--neon-magenta)] [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1">
        {children}
      </div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 font-display text-lg font-semibold text-foreground">
      {children}
    </h3>
  );
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-4 border-l-4 border-[var(--neon-magenta)] bg-muted/40 px-4 py-3 italic text-muted-foreground">
      <MessageSquare className="mb-2 inline h-4 w-4 text-[var(--neon-magenta)]" />
      <p>{children}</p>
    </blockquote>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="my-4 overflow-x-auto rounded-lg border border-border bg-[oklch(0.18_0.04_265)] p-4 text-xs leading-relaxed text-[var(--neon-cyan)]">
      <code>{children}</code>
    </pre>
  );
}

function RuleCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-xl border-2 border-[var(--neon-magenta)]/50 bg-gradient-to-r from-[var(--neon-magenta)]/10 to-[var(--neon-cyan)]/10 p-5 text-center">
      <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--neon-magenta)]">
        The rule
      </div>
      <p className="font-display text-lg font-semibold text-foreground sm:text-xl">
        {children}
      </p>
    </div>
  );
}

function SignatureTable() {
  const rows: [string, string][] = [
    ["Unsolicited LinkedIn DM from a 'recruiter'", "primary channel"],
    ["'Leading company in blockchain' — empty description", "recurring phrasing"],
    ["Generic Calendly handle, not on corporate domain", ""],
    ["Salary USD 20–25k/month announced up front", ""],
    ["MERN + Solidity, 'next-gen crypto trading platform'", "typical cover project"],
    ["Inflated funding (USD 6.5M) and team size (17/30)", ""],
    ["Repository hosted on Bitbucket", "preferred host since late 2024"],
    ["Job description on Notion (not on an ATS)", "disposable, no paper trail"],
    ["Payment in stablecoins or ETH", "avoids banking traceability"],
    ["Dependency overriding Node fs module", "BeaverTail/InvisibleFerret loader"],
    ["'This is not a technical interview' framing", "disarms audit mindset"],
    ["Immediate pressure follow-up after hesitation", ""],
  ];
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">Indicator in my case</th>
            <th className="px-3 py-2 text-left font-semibold">DeceptiveDevelopment signature</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b], i) => (
            <tr key={i} className="border-t border-border">
              <td className="px-3 py-2">{a}</td>
              <td className="px-3 py-2 text-[var(--neon-cyan)]">
                <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
                {b || "documented"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TATable() {
  const rows: [string, string][] = [
    ["'We'd love to work with someone of your caliber.'", "Nurturing Parent — respond to recognition."],
    ["'We're flexible on schedule.'", "Adapted Child — be accommodating in return."],
    ["'This isn't a technical interview, just an intro.'", "Adult — stand down, don't audit."],
    ["'Could you just clone and run it?'", "Adapted Child — comply, prove you're a good candidate."],
    ["'Could you join the meeting now?'", "Adapted Child — don't disappoint, show up."],
  ];
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">Social message (explicit)</th>
            <th className="px-3 py-2 text-left font-semibold">Psychological target (implicit)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b], i) => (
            <tr key={i} className="border-t border-border">
              <td className="px-3 py-2 italic">{a}</td>
              <td className="px-3 py-2 text-[var(--neon-violet)]">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IOCTable() {
  const rows: [string, string, string][] = [
    ["Bitbucket workspace", "teamincwork", "Hosts malicious repo"],
    ["Repository", "bitbucket.org/teamincwork/pro_lmng", "Payload delivery"],
    ["Notion page", "notion.so/Technical-Lead-2e8561…", "Fake job description"],
    ["Calendly handle", "calendly.com/best_collaboration/business", "Scheduling lure"],
    ["Cover-brand domain", "invoblox.com", "Impersonated brand"],
    ["Recruiter alias", "'Lucas Silva' (LinkedIn)", "Persona"],
  ];
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">Type</th>
            <th className="px-3 py-2 text-left font-semibold">Value</th>
            <th className="px-3 py-2 text-left font-semibold">Role</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b, c], i) => (
            <tr key={i} className="border-t border-border">
              <td className="px-3 py-2 font-medium">{a}</td>
              <td className="px-3 py-2 font-mono text-xs text-[var(--neon-magenta)]">{b}</td>
              <td className="px-3 py-2 text-muted-foreground">{c}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KillChain() {
  const steps = [
    { id: "A", text: "LinkedIn cold DM + Calendly", bad: true },
    { id: "B", text: "Intro call — 60 min, confidence build", bad: true },
    { id: "C", text: "Share Bitbucket + Notion", bad: true },
    { id: "D", text: "Decision: local install?", decision: true },
    { id: "E", text: "npm install → fs-shadow loader fires", bad: true },
    { id: "F", text: "BeaverTail steals cookies, wallets, keychains", bad: true },
    { id: "G", text: "InvisibleFerret persistence + AnyDesk deploy", bad: true },
    { id: "H", text: "Exfil: wallets, SSH, cloud tokens, client data", bad: true },
  ];
  return (
    <div className="my-4 space-y-2">
      {steps.map((s) => (
        <div
          key={s.id}
          className={`flex items-start gap-3 rounded-lg border p-3 text-sm ${
            s.decision
              ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10"
              : "border-destructive/30 bg-destructive/5"
          }`}
        >
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono font-bold ${
              s.decision ? "bg-[var(--neon-cyan)] text-background" : "bg-destructive/80 text-white"
            }`}
          >
            {s.id}
          </span>
          <span className="pt-0.5">
            {s.text}
            {s.decision && (
              <span className="ml-2 text-xs font-semibold text-[var(--neon-cyan)]">
                ← single decision controlling the entire outcome
              </span>
            )}
          </span>
        </div>
      ))}
      <div className="flex items-start gap-3 rounded-lg border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/10 p-3 text-sm">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--neon-cyan)]" />
        <span>
          <strong>If D = no</strong> — repo audited in ColdVault, attack fails,
          attacker rotates to next target.
        </span>
      </div>
    </div>
  );
}

function ReferencesBlock() {
  const groups: { label: string; items: React.ReactNode[] }[] = [
    {
      label: "Threat intelligence — DeceptiveDevelopment / Contagious Interview",
      items: [
        <>
          ESET Research. <em>DeceptiveDevelopment targets freelance developers.</em>{" "}
          WeLiveSecurity, 2025.
        </>,
        <>
          Palo Alto Networks Unit 42. <em>Hacking Employers and Seeking Employment:
          Two Job-Related Campaigns Bear Hallmarks of North Korean Threat Actors
          ("Contagious Interview" & "Wagemole").</em> 2023.
        </>,
        <>
          Palo Alto Networks Unit 42. <em>Contagious Interview: DPRK Threat Actors
          Lure Tech Industry Job Seekers to Install New Variants of BeaverTail and
          InvisibleFerret Malware.</em> 2024.
        </>,
        <>
          Group-IB Threat Intelligence. <em>Lazarus group "Operation Dream Job":
          Fake job offers via LinkedIn targeting crypto and defence developers.</em>{" "}
          2022–2024.
        </>,
        <>
          Zscaler ThreatLabz. <em>BeaverTail / InvisibleFerret JavaScript malware
          analysis — DPRK-linked developer-targeted campaigns.</em> 2024.
        </>,
        <>
          Microsoft Threat Intelligence. <em>Sapphire Sleet (COPERNICIUM): North
          Korean threat actors target job seekers and cryptocurrency firms.</em>{" "}
          Microsoft Security Blog, 2023–2024.
        </>,
        <>
          Mandiant / Google Threat Intelligence Group. <em>Staying a Step Ahead:
          Mitigating the DPRK IT Worker Threat.</em> 2024.
        </>,
        <>
          CISA, FBI & U.S. Department of State. <em>Joint Cybersecurity Advisory
          AA24-290A — Democratic People's Republic of Korea IT Workers Using
          Fictitious Identities to Obtain Remote Work.</em> 2024.
        </>,
        <>
          U.S. Department of the Treasury, OFAC. <em>Guidance on the Democratic
          People's Republic of Korea Information Technology Workers.</em> 2022,
          updated 2024.
        </>,
      ],
    },
    {
      label: "Supply-chain & package-ecosystem research",
      items: [
        <>
          Socket Security & Phylum research blogs. <em>Ongoing analyses of
          malicious npm packages published by DPRK-linked actors.</em> 2023–2025.
        </>,
        <>
          Checkmarx Supply-Chain Security Research. <em>Trojanised npm and PyPI
          packages targeting Web3 engineers.</em> 2024.
        </>,
        <>
          MITRE ATT&amp;CK. <em>T1566.003 — Spearphishing via Service;
          T1195.002 — Supply Chain Compromise: Compromise Software Supply Chain.
          </em>
        </>,
        <>
          OWASP Foundation. <em>Top 10 CI/CD Security Risks.</em> 2022.
        </>,
      ],
    },
    {
      label: "Psychology & persuasion",
      items: [
        <>
          Cialdini, R. B. (2006). <em>Influence: The Psychology of Persuasion
          (Revised Edition).</em> Harper Business.
        </>,
        <>
          Cialdini, R. B. (2016). <em>Pre-Suasion: A Revolutionary Way to
          Influence and Persuade.</em> Simon &amp; Schuster.
        </>,
        <>
          Berne, E. (1964). <em>Games People Play: The Psychology of Human
          Relationships.</em> Grove Press.
        </>,
        <>
          Stewart, I. &amp; Joines, V. (1987). <em>TA Today: A New Introduction
          to Transactional Analysis.</em> Lifespace Publishing.
        </>,
        <>
          Kahneman, D. (2011). <em>Thinking, Fast and Slow.</em> Farrar, Straus
          and Giroux.
        </>,
        <>
          Hadnagy, C. (2018). <em>Social Engineering: The Science of Human
          Hacking (2nd ed.).</em> Wiley.
        </>,
      ],
    },
    {
      label: "Neuroscience of reward, trust, and decision fatigue",
      items: [
        <>
          Schultz, W., Dayan, P., &amp; Montague, P. R. (1997). A neural
          substrate of prediction and reward. <em>Science</em>, 275(5306),
          1593–1599.
        </>,
        <>
          Schultz, W. (1998). Predictive reward signal of dopamine neurons.{" "}
          <em>Journal of Neurophysiology</em>, 80(1), 1–27.
        </>,
        <>
          King-Casas, B., Tomlin, D., Anen, C., Camerer, C. F., Quartz, S. R.,
          &amp; Montague, P. R. (2005). Getting to know you: Reputation and
          trust in a two-person economic exchange. <em>Science</em>, 308(5718),
          78–83.
        </>,
        <>
          Delgado, M. R., Frank, R. H., &amp; Phelps, E. A. (2005). Perceptions
          of moral character modulate the neural systems of reward during the
          trust game. <em>Nature Neuroscience</em>, 8(11), 1611–1618.
        </>,
        <>
          Bechara, A., Damasio, H., Tranel, D., &amp; Damasio, A. R. (1997).
          Deciding advantageously before knowing the advantageous strategy.{" "}
          <em>Science</em>, 275(5304), 1293–1295.
        </>,
        <>
          Baumeister, R. F., Bratslavsky, E., Muraven, M., &amp; Tice, D. M.
          (1998). Ego depletion: Is the active self a limited resource?{" "}
          <em>Journal of Personality and Social Psychology</em>, 74(5),
          1252–1265.
        </>,
        <>
          Vohs, K. D. et al. (2008). Making choices impairs subsequent
          self-control: A limited-resource account of decision making,
          self-regulation, and active initiative. <em>Journal of Personality and
          Social Psychology</em>, 94(5), 883–898.
        </>,
      ],
    },
    {
      label: "Defensive architecture & sandboxing",
      items: [
        <>
          Anthropic. <em>Claude Code &amp; Claude Agent SDK documentation.</em>{" "}
          2024–2026.
        </>,
        <>
          GitHub. <em>Codespaces security model and lifecycle documentation.</em>
        </>,
        <>
          NIST. <em>SP 800-207: Zero Trust Architecture.</em> 2020.
        </>,
        <>
          Anthropic Security. <em>claude-code-security-review — finding schema,
          severity levels, confidence convention.</em> GitHub, 2024.
        </>,
      ],
    },
  ];

  return (
    <div className="my-4 space-y-5">
      {groups.map((g) => (
        <div key={g.label}>
          <h4 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-[var(--neon-violet)]">
            {g.label}
          </h4>
          <ol className="list-decimal space-y-1.5 pl-6 text-sm text-foreground/85 marker:text-[var(--neon-cyan)]/70">
            {g.items.map((item, i) => (
              <li key={i} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ol>
        </div>
      ))}
      <p className="mt-4 text-xs italic text-muted-foreground">
        Citations are given in author–title–publisher–year form. Primary sources
        should always be consulted directly — threat-intelligence reports are
        revised frequently, and URLs change. Publisher names are stable identifiers
        for web searches.
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-border pt-8 text-center text-sm text-muted-foreground">
      <p>
        Published by{" "}
        <a
          href="https://zonova.io"
          className="text-[var(--neon-cyan)] underline"
          target="_blank"
          rel="noreferrer"
        >
          ZONOVA RESEARCH
        </a>
        . MIT-licensed. PRs welcome on{" "}
        <a href={REPO_URL} className="text-[var(--neon-cyan)] underline" target="_blank" rel="noreferrer">
          rasata/coldvault.dev <ExternalLink className="inline h-3 w-3" />
        </a>
        .
      </p>
      <div className="mt-3 flex justify-center gap-3">
        <a href="https://github.com/rasata" className="hover:text-foreground" aria-label="GitHub">
          <Github className="h-4 w-4" />
        </a>
        <a href="https://www.linkedin.com" className="hover:text-foreground" aria-label="LinkedIn">
          <Linkedin className="h-4 w-4" />
        </a>
        <a href="mailto:research@zonova.io" className="hover:text-foreground" aria-label="Email">
          <Mail className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
}
