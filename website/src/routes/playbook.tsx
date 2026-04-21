import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Eye,
  FileWarning,
  Flame,
  Github,
  KeyRound,
  Lock,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  Siren,
  Skull,
  Snowflake,
  Terminal,
  XCircle,
} from "lucide-react";

const REPO_URL = "https://github.com/rasata/coldvault.dev";

export const Route = createFileRoute("/playbook")({
  component: PlaybookPage,
});

const PAGE_TITLE =
  "ColdVault Playbook — Reflexes & best practices against fake-recruiter attacks";
const PAGE_DESCRIPTION =
  "A laminate-it-and-keep-it card: red flags before/during/after a suspicious recruiter call, the audit-machine reflex, and what to do if something already ran.";

function PlaybookPage() {
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
      "ColdVault Playbook — Defender reflexes for DeceptiveDevelopment lures",
    );
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      "Field checklist + incident-response steps for developers targeted by Lazarus-style fake-recruiter campaigns.",
    );
  }, []);

  return (
    <div className="min-h-screen bg-grid">
      <PlaybookNav />
      <main className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6">
        <Header />
        <GoldenRule />
        <Phase
          n="1"
          title="Before the call — vet the opportunity"
          icon={<Eye className="h-5 w-5" />}
          accent="cyan"
        >
          <ChecklistGroup
            title="Red flags on the company"
            items={[
              "Domain registered < 12 months ago, OR old domain with almost zero press footprint.",
              "Team page lists names that don't appear on LinkedIn — or LinkedIn profiles look 'too clean' (few old connections, no long-tenured colleagues).",
              "Recruiter avatar looks AI-generated; few recommendations from named people.",
              "Email comes from a free provider, or from a domain registered through a privacy-hiding registrar.",
            ]}
          />
          <ChecklistGroup
            title="Red flags on the offer"
            items={[
              "Compensation 2–3× the market band for the role — stated up front.",
              "Payment in cryptocurrency offered or normalised before you've asked.",
              "No company name in the first message — 'a leading company in blockchain'.",
              "Generic Calendly / Cal.com handle, not on a corporate domain.",
            ]}
          />
        </Phase>

        <Phase
          n="2"
          title="During the call — watch the script"
          icon={<MessageSquare className="h-5 w-5" />}
          accent="violet"
        >
          <ChecklistGroup
            title="Behavioural signals"
            items={[
              "Flattery disproportionate to what they actually know about you.",
              "Role responsibilities vague, deferred to 'a later call with the CTO'.",
              "Team size and funding figures: precise but unverifiable.",
              "You're told 'this isn't a technical interview' right before being asked to do something technical.",
              "Urgency injected: 'MVP in X months', 'we need to close this week'.",
            ]}
          />
          <Aside>
            Counter-move: reply Adult-to-Adult. "I review unknown code only inside
            a disposable sandbox — I'll get back to you with findings." If they
            push back, you've confirmed the diagnosis.
          </Aside>
        </Phase>

        <Phase
          n="3"
          title="The moment of truth — the technical ask"
          icon={<AlertTriangle className="h-5 w-5" />}
          accent="magenta"
        >
          <ChecklistGroup
            critical
            title="🚨 Hard stop — these mean: audit in sandbox or walk"
            items={[
              "You're asked to clone a repo and install dependencies as a 'project review' or 'code challenge' before any contract / NDA / verified identity exchange.",
              "The repo is on Bitbucket, a throwaway GitHub account, or a private server.",
              "Job description lives on Notion, Google Docs, or a PDF — not on an ATS.",
              "After hesitation, you receive a short pressure message: 'Are you joining now?' / 'Did you get the repo running?'",
            ]}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DecisionCard
              title="✅ Acceptable"
              tone="good"
              items={[
                "Audit inside ColdVault (or any disposable VM).",
                "Disengage politely.",
                "Report the infrastructure.",
              ]}
            />
            <DecisionCard
              title="❌ Unacceptable"
              tone="bad"
              items={[
                "npm / pip / cargo install on your daily laptop.",
                "Open the project in your usual IDE with extensions.",
                "Run any provided 'setup script'.",
              ]}
            />
          </div>
        </Phase>

        <Phase
          n="4"
          title="The Cold Audit — read before you run"
          icon={<Snowflake className="h-5 w-5" />}
          accent="cyan"
        >
          <p className="mb-4 text-sm text-muted-foreground">
            If you decide to look at the repo, do it inside a disposable
            environment (GitHub Codespaces, a fresh VM, or ColdVault). Read
            these things <strong>before</strong> any install command:
          </p>
          <ChecklistGroup
            title="Static patterns to grep for"
            items={[
              "package.json scripts: postinstall, preinstall, prepare — read every line they execute.",
              "Dependencies pinned to a git commit instead of a registry version.",
              "Typo-squat names: ethers-utils, web3-helper, node-fs-helper, react-native-utils…",
              "Source files > 100 KB in an otherwise-light front-end project.",
              "Files where the first screen looks normal but content extends off-screen via horizontal scroll.",
              "Dense base64 / hex strings passed to eval, Function, new Function.",
              "Modules that monkey-patch fs, child_process, crypto, https, net, process.",
              "fetch / XMLHttpRequest / net.connect to hosts outside the project's declared infra.",
            ]}
          />
          <CodeBlock>{`# ColdVault one-shot audit
git clone https://github.com/rasata/coldvault.dev
cd coldvault.dev
# → Open in GitHub Codespaces
gh auth login && claude login
git submodule add --depth=1 <suspect-repo-url> target/
claude
# > /audit
# → reports/SUMMARY.md`}</CodeBlock>
        </Phase>

        <Phase
          n="5"
          title="If something already ran — incident response"
          icon={<Siren className="h-5 w-5" />}
          accent="magenta"
        >
          <p className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
            <Flame className="mr-2 inline h-4 w-4 text-destructive" />
            Assume the machine is compromised until a clean OS reinstall.
            Time-to-react matters more than perfection — start the rotations now.
          </p>
          <OrderedSteps
            steps={[
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
            ]}
          />
          <ReportingChannels />
        </Phase>

        <Phase
          n="6"
          title="Daily reflexes — build the habit"
          icon={<Brain className="h-5 w-5" />}
          accent="violet"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <ReflexCard
              icon={<Lock className="h-5 w-5" />}
              title="Decouple machines"
              text="The laptop with your keys, wallets, and client credentials is NEVER the laptop where you evaluate strangers' code. One disposable VM is enough if you can't have two."
            />
            <ReflexCard
              icon={<KeyRound className="h-5 w-5" />}
              title="Hardware wallets only"
              text="For any crypto with non-trivial value: hardware wallet, initialised on a clean device, seed phrase never typed on an internet-connected machine."
            />
            <ReflexCard
              icon={<FileWarning className="h-5 w-5" />}
              title="Read package.json first"
              text="Before any install command on any unfamiliar repo, read the manifest. postinstall hooks and git-pinned deps are not subtle."
            />
            <ReflexCard
              icon={<Terminal className="h-5 w-5" />}
              title="No untrusted IDE extensions"
              text="Don't open suspect projects in your daily IDE. Extensions auto-activate on file types and can read everything in the workspace."
            />
            <ReflexCard
              icon={<PhoneCall className="h-5 w-5" />}
              title="Verify recruiters out-of-band"
              text="Find the company on LinkedIn independently. Look for tenured employees. Cross-check the recruiter's name on the company's actual careers page."
            />
            <ReflexCard
              icon={<Skull className="h-5 w-5" />}
              title="Treat high-salary cold DMs as triage events"
              text="Not as opportunities. The default response is sandbox-or-decline, not 'sure, send me the repo'."
            />
          </div>
        </Phase>

        <CTASection />
        <Footer />
      </main>
    </div>
  );
}

/* ───────── components ───────── */

function PlaybookNav() {
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
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/blog/anatomy-of-a-deceptive-developer-attack">Read the case study</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Header() {
  return (
    <header className="mb-10 text-center">
      <Badge variant="outline" className="mb-4 border-[var(--neon-cyan)]/40">
        🛡️ Field manual · v1.0
      </Badge>
      <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">
        The{" "}
        <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
          ColdVault Playbook
        </span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
        Reflexes & best practices against fake-recruiter attacks. Laminate it.
        Pin it next to your keyboard. Send it to every developer you care about.
      </p>
    </header>
  );
}

function GoldenRule() {
  return (
    <div className="my-10 rounded-2xl border-2 border-[var(--neon-magenta)]/50 bg-gradient-to-r from-[var(--neon-magenta)]/10 via-[var(--neon-violet)]/10 to-[var(--neon-cyan)]/10 p-6 text-center sm:p-8">
      <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--neon-magenta)]">
        The Golden Rule
      </div>
      <p className="font-display text-xl font-semibold text-foreground sm:text-2xl">
        Never execute untrusted code on a machine that holds anything of value
        to you.
      </p>
      <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
        Everything below is support for that one sentence.
      </p>
    </div>
  );
}

function Phase({
  n,
  title,
  icon,
  children,
  accent,
}: {
  n: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accent: "cyan" | "violet" | "magenta";
}) {
  const accentMap = {
    cyan: "border-[var(--neon-cyan)]/40 from-[var(--neon-cyan)]/10",
    violet: "border-[var(--neon-violet)]/40 from-[var(--neon-violet)]/10",
    magenta: "border-[var(--neon-magenta)]/40 from-[var(--neon-magenta)]/10",
  };
  const iconColor = {
    cyan: "text-[var(--neon-cyan)]",
    violet: "text-[var(--neon-violet)]",
    magenta: "text-[var(--neon-magenta)]",
  };
  return (
    <section className={`mb-8 rounded-2xl border bg-gradient-to-br to-transparent p-6 ${accentMap[accent]}`}>
      <h2 className="mb-5 flex items-center gap-3 font-display text-xl font-bold sm:text-2xl">
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg bg-background/60 ${iconColor[accent]}`}>
          {icon}
        </span>
        <span className="font-mono text-sm text-muted-foreground">PHASE {n}</span>
        <span>{title}</span>
      </h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function ChecklistGroup({
  title,
  items,
  critical,
}: {
  title: string;
  items: string[];
  critical?: boolean;
}) {
  return (
    <div>
      <h3
        className={`mb-2 text-sm font-semibold uppercase tracking-wider ${
          critical ? "text-destructive" : "text-foreground"
        }`}
      >
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li
            key={i}
            className={`flex items-start gap-2.5 rounded-md border bg-background/40 p-3 text-sm ${
              critical ? "border-destructive/40" : "border-border"
            }`}
          >
            {critical ? (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neon-magenta)]" />
            )}
            <span className="text-foreground/90">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Aside({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 p-4 text-sm">
      <div className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--neon-cyan)]">
        Counter-move
      </div>
      <p className="text-foreground/90">{children}</p>
    </div>
  );
}

function DecisionCard({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "good" | "bad";
  items: string[];
}) {
  const isGood = tone === "good";
  return (
    <div
      className={`rounded-lg border p-4 ${
        isGood
          ? "border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/5"
          : "border-destructive/40 bg-destructive/5"
      }`}
    >
      <h4 className={`mb-3 font-semibold ${isGood ? "text-[var(--neon-cyan)]" : "text-destructive"}`}>
        {title}
      </h4>
      <ul className="space-y-1.5 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2">
            {isGood ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neon-cyan)]" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            )}
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="my-4 overflow-x-auto rounded-lg border border-border bg-[oklch(0.18_0.04_265)] p-4 text-xs leading-relaxed text-[var(--neon-cyan)]">
      <code>{children}</code>
    </pre>
  );
}

function OrderedSteps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => (
        <li
          key={i}
          className="flex items-start gap-3 rounded-lg border border-border bg-background/40 p-4"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-magenta)] to-[var(--neon-violet)] font-bold text-white">
            {i + 1}
          </span>
          <div>
            <h4 className="font-semibold text-foreground">{s.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ReportingChannels() {
  const channels = [
    { name: "Atlassian abuse (Bitbucket)", url: "https://www.atlassian.com/trust/report-abuse" },
    { name: "GitHub abuse", url: "https://github.com/contact/report-abuse" },
    { name: "Notion abuse", url: "https://www.notion.so/help/guides/report-abuse" },
    { name: "LinkedIn", url: "https://www.linkedin.com/help/linkedin/answer/146" },
    { name: "CERT-FR", url: "https://cert.ssi.gouv.fr/" },
    { name: "Cybermalveillance.gouv.fr", url: "https://www.cybermalveillance.gouv.fr/" },
    { name: "FBI IC3", url: "https://www.ic3.gov/" },
  ];
  return (
    <div className="mt-5 rounded-lg border border-border bg-background/40 p-4">
      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider">Reporting channels</h4>
      <div className="flex flex-wrap gap-2">
        {channels.map((c) => (
          <a
            key={c.name}
            href={c.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground/90 transition-colors hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]"
          >
            {c.name} →
          </a>
        ))}
      </div>
    </div>
  );
}

function ReflexCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-5 transition-all hover:border-[var(--neon-cyan)]/40 hover:bg-card">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-magenta)]/20 text-[var(--neon-cyan)]">
        {icon}
      </div>
      <h4 className="font-display font-semibold text-foreground">{title}</h4>
      <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function CTASection() {
  return (
    <div className="my-10 rounded-2xl border border-[var(--neon-cyan)]/40 bg-gradient-to-br from-[var(--neon-cyan)]/10 to-[var(--neon-magenta)]/10 p-8 text-center">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">
        Bake the procedure into your workflow
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
        ColdVault turns this entire playbook into a single Codespace launch and
        a <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-[var(--neon-magenta)]">/audit</code> command.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] text-background font-bold hover:opacity-90">
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            <Github className="mr-2 h-4 w-4" />
            Get ColdVault on GitHub
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link to="/blog/anatomy-of-a-deceptive-developer-attack">
            Read the case study
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
      Published by{" "}
      <a href="https://zonova.io" className="text-[var(--neon-cyan)] underline" target="_blank" rel="noreferrer">
        ZONOVA RESEARCH
      </a>
      . Stay cold. Stay vaulted.
    </footer>
  );
}
