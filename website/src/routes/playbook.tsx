import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/context";
import { playbookTranslations } from "@/i18n/playbook";
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

function PlaybookPage() {
  const { locale } = useTranslation();
  const p = playbookTranslations[locale];

  useEffect(() => {
    document.title = p.metaTitle;
    const setMeta = (sel: string, attr: "name" | "property", key: string, value: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(sel);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };
    setMeta('meta[name="description"]', "name", "description", p.metaDescription);
    setMeta('meta[property="og:title"]', "property", "og:title", p.ogTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", p.ogDescription);
  }, [p.metaTitle, p.metaDescription, p.ogTitle, p.ogDescription]);

  return (
    <div className="min-h-screen bg-grid">
      <PlaybookNav />
      <main className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6">
        <Header />
        <GoldenRule />
        <Phase
          n="1"
          title={p.p1Title}
          icon={<Eye className="h-5 w-5" />}
          accent="cyan"
        >
          <ChecklistGroup title={p.p1G1Title} items={p.p1G1Items} />
          <ChecklistGroup title={p.p1G2Title} items={p.p1G2Items} />
        </Phase>

        <Phase
          n="2"
          title={p.p2Title}
          icon={<MessageSquare className="h-5 w-5" />}
          accent="violet"
        >
          <ChecklistGroup title={p.p2GTitle} items={p.p2Items} />
          <Aside label={p.p2AsideLabel}>{p.p2AsideBody}</Aside>
        </Phase>

        <Phase
          n="3"
          title={p.p3Title}
          icon={<AlertTriangle className="h-5 w-5" />}
          accent="magenta"
        >
          <ChecklistGroup critical title={p.p3GTitle} items={p.p3Items} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DecisionCard title={p.p3GoodTitle} tone="good" items={p.p3GoodItems} />
            <DecisionCard title={p.p3BadTitle} tone="bad" items={p.p3BadItems} />
          </div>
        </Phase>

        <Phase
          n="4"
          title={p.p4Title}
          icon={<Snowflake className="h-5 w-5" />}
          accent="cyan"
        >
          <p className="mb-4 text-sm text-muted-foreground">
            {p.p4Intro1}
            <strong>{p.p4IntroStrong}</strong>
            {p.p4Intro2}
          </p>
          <ChecklistGroup title={p.p4GTitle} items={p.p4Items} />
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
          title={p.p5Title}
          icon={<Siren className="h-5 w-5" />}
          accent="magenta"
        >
          <p className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
            <Flame className="mr-2 inline h-4 w-4 text-destructive" />
            {p.p5AssumeBody}
          </p>
          <OrderedSteps steps={p.p5Steps} />
          <ReportingChannels title={p.p5ChannelsTitle} />
        </Phase>

        <Phase
          n="6"
          title={p.p6Title}
          icon={<Brain className="h-5 w-5" />}
          accent="violet"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <ReflexCard
              icon={<Lock className="h-5 w-5" />}
              title={p.p6Cards[0].title}
              text={p.p6Cards[0].text}
            />
            <ReflexCard
              icon={<KeyRound className="h-5 w-5" />}
              title={p.p6Cards[1].title}
              text={p.p6Cards[1].text}
            />
            <ReflexCard
              icon={<FileWarning className="h-5 w-5" />}
              title={p.p6Cards[2].title}
              text={p.p6Cards[2].text}
            />
            <ReflexCard
              icon={<Terminal className="h-5 w-5" />}
              title={p.p6Cards[3].title}
              text={p.p6Cards[3].text}
            />
            <ReflexCard
              icon={<PhoneCall className="h-5 w-5" />}
              title={p.p6Cards[4].title}
              text={p.p6Cards[4].text}
            />
            <ReflexCard
              icon={<Skull className="h-5 w-5" />}
              title={p.p6Cards[5].title}
              text={p.p6Cards[5].text}
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
  const { locale } = useTranslation();
  const p = playbookTranslations[locale];
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
              {p.navHome}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/blog/anatomy-of-a-deceptive-developer-attack">{p.navReadCaseStudy}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Header() {
  const { locale } = useTranslation();
  const p = playbookTranslations[locale];
  return (
    <header className="mb-10 text-center">
      <Badge variant="outline" className="mb-4 border-[var(--neon-cyan)]/40">
        {p.badge}
      </Badge>
      <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">
        {p.titleLead ? <>{p.titleLead}{" "}</> : null}
        <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
          {p.titleAccent}
        </span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
        {p.subtitle}
      </p>
    </header>
  );
}

function GoldenRule() {
  const { locale } = useTranslation();
  const p = playbookTranslations[locale];
  return (
    <div className="my-10 rounded-2xl border-2 border-[var(--neon-magenta)]/50 bg-gradient-to-r from-[var(--neon-magenta)]/10 via-[var(--neon-violet)]/10 to-[var(--neon-cyan)]/10 p-6 text-center sm:p-8">
      <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--neon-magenta)]">
        {p.goldenRuleLabel}
      </div>
      <p className="font-display text-xl font-semibold text-foreground sm:text-2xl">
        {p.goldenRuleText}
      </p>
      <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
        {p.goldenRuleCaption}
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
  const { locale } = useTranslation();
  const p = playbookTranslations[locale];
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
        <span className="font-mono text-sm text-muted-foreground">{p.phaseLabel} {n}</span>
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

function Aside({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 p-4 text-sm">
      <div className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--neon-cyan)]">
        {label}
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

function ReportingChannels({ title }: { title: string }) {
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
      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider">{title}</h4>
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
  const { locale } = useTranslation();
  const p = playbookTranslations[locale];
  return (
    <div className="my-10 rounded-2xl border border-[var(--neon-cyan)]/40 bg-gradient-to-br from-[var(--neon-cyan)]/10 to-[var(--neon-magenta)]/10 p-8 text-center">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">
        {p.ctaTitle}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
        {p.ctaBodyPre}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-[var(--neon-magenta)]">/audit</code>
        {p.ctaBodyCodeSuffix}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] text-background font-bold hover:opacity-90">
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            <Github className="mr-2 h-4 w-4" />
            {p.ctaPrimary}
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link to="/blog/anatomy-of-a-deceptive-developer-attack">
            {p.ctaSecondary}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function Footer() {
  const { locale } = useTranslation();
  const p = playbookTranslations[locale];
  return (
    <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
      {p.footerPublishedBy}{" "}
      <a href="https://zonova.io" className="text-[var(--neon-cyan)] underline" target="_blank" rel="noreferrer">
        ZONOVA RESEARCH
      </a>
      {p.footerSuffix}
    </footer>
  );
}
