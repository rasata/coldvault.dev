import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/i18n/context";
import type { Dictionary } from "@/i18n/translations";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Boxes,
  Bug,
  ChevronsRight,
  Clock,
  FileJson,
  FileText,
  FlaskConical,
  Github,
  KeyRound,
  LineChart,
  Network,
  Package,
  Play,
  Radar,
  ScanSearch,
  Shield,
  ShieldCheck,
  ShieldOff,
  Siren,
  Snowflake,
  Target,
  Terminal,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const REPO_URL = "https://github.com/rasata/coldvault.dev";

export const Route = createFileRoute("/commands")({
  component: CommandsPage,
});

type CommandItem = {
  slug: string;
  descriptionKey: keyof Dictionary["commandsPage"]["descriptions"];
  icon: LucideIcon;
  output?: string;
};

type SkillItem = {
  slug: string;
  descriptionKey: keyof Dictionary["commandsPage"]["descriptions"];
  icon: LucideIcon;
};

const COMMANDS: CommandItem[] = [
  {
    slug: "audit",
    descriptionKey: "cmd_audit",
    icon: Workflow,
    output: "reports/SUMMARY.md + reports/SUMMARY.html + reports/findings.json",
  },
  {
    slug: "defensive-payload-analysis",
    descriptionKey: "cmd_defensive_payload_analysis",
    icon: Siren,
    output: "forensic/<target>/ALERTE-MALWARE.md + 01-inventory … 04-iocs",
  },
  {
    slug: "scan-deps",
    descriptionKey: "cmd_scan_deps",
    icon: Package,
    output: "reports/sca-*.{sarif,json} + reports/sbom.cdx.json",
  },
  {
    slug: "scan-iac",
    descriptionKey: "cmd_scan_iac",
    icon: Boxes,
    output: "reports/iac-*.{sarif,json}",
  },
  {
    slug: "scan-malware",
    descriptionKey: "cmd_scan_malware",
    icon: Bug,
    output:
      "reports/yara-matches.txt + reports/capa-*.json + reports/clamav.log + reports/oletools.json",
  },
  {
    slug: "scan-sast",
    descriptionKey: "cmd_scan_sast",
    icon: ScanSearch,
    output: "reports/sast-merged.sarif + per-tool raw reports",
  },
  {
    slug: "scan-secrets",
    descriptionKey: "cmd_scan_secrets",
    icon: KeyRound,
    output: "reports/secrets-*.{sarif,json}",
  },
  {
    slug: "security-review",
    descriptionKey: "cmd_security_review",
    icon: BookOpen,
    output: "reports/pr-findings.json + reports/pr-review.md",
  },
];

const SKILLS: SkillItem[] = [
  {
    slug: "agentic-actions-auditor",
    descriptionKey: "skill_agentic_actions_auditor",
    icon: Workflow,
  },
  { slug: "audit-context-building", descriptionKey: "skill_audit_context_building", icon: Target },
  { slug: "constant-time-analysis", descriptionKey: "skill_constant_time_analysis", icon: Clock },
  {
    slug: "defensive-payload-analysis",
    descriptionKey: "skill_defensive_payload_analysis",
    icon: Siren,
  },
  { slug: "entry-point-analyzer", descriptionKey: "skill_entry_point_analyzer", icon: Network },
  { slug: "html-report-renderer", descriptionKey: "skill_html_report_renderer", icon: FileText },
  {
    slug: "insecure-defaults-hunter",
    descriptionKey: "skill_insecure_defaults_hunter",
    icon: ShieldOff,
  },
  { slug: "secrets-hunter", descriptionKey: "skill_secrets_hunter", icon: KeyRound },
  { slug: "security-review", descriptionKey: "skill_security_review", icon: BookOpen },
  { slug: "semgrep-rule-creator", descriptionKey: "skill_semgrep_rule_creator", icon: FlaskConical },
  { slug: "snyk-sast", descriptionKey: "skill_snyk_sast", icon: ScanSearch },
  { slug: "snyk-sca", descriptionKey: "skill_snyk_sca", icon: Package },
  {
    slug: "static-analysis-orchestrator",
    descriptionKey: "skill_static_analysis_orchestrator",
    icon: LineChart,
  },
  {
    slug: "supply-chain-risk-auditor",
    descriptionKey: "skill_supply_chain_risk_auditor",
    icon: Radar,
  },
  {
    slug: "untrusted-code-isolation",
    descriptionKey: "skill_untrusted_code_isolation",
    icon: ShieldCheck,
  },
  { slug: "variant-analysis", descriptionKey: "skill_variant_analysis", icon: FileJson },
  { slug: "yara-malware-hunter", descriptionKey: "skill_yara_malware_hunter", icon: Bug },
];

function CommandsPage() {
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = t.commandsPage.meta.title;
    const setMeta = (sel: string, attr: "name" | "property", key: string, value: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(sel);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };
    setMeta(
      'meta[name="description"]',
      "name",
      "description",
      t.commandsPage.meta.description,
    );
    setMeta(
      'meta[property="og:title"]',
      "property",
      "og:title",
      t.commandsPage.meta.title,
    );
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      t.commandsPage.meta.description,
    );
  }, [t]);

  return (
    <div className="min-h-screen bg-grid">
      <CommandsNav />
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6">
        <Hero />
        <Usage />
        <CommandsSection />
        <SkillsSection />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
}

function CommandsNav() {
  const { t } = useTranslation();
  return (
    <header className="fixed top-0 z-50 w-full glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display font-bold">
          <Snowflake className="h-5 w-5 text-[var(--neon-cyan)]" />
          <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
            ColdVault
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-1 h-4 w-4 rtl:rotate-180" />
              {t.commandsPage.nav.back}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              <Github className="mr-1.5 h-4 w-4" />
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const { t } = useTranslation();
  return (
    <header className="mb-10 text-center">
      <Badge variant="outline" className="mb-4 border-[var(--neon-cyan)]/40">
        <Terminal className="mr-1.5 h-3.5 w-3.5" />
        {t.commandsPage.hero.badge}
      </Badge>
      <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">
        {t.commandsPage.hero.title1}{" "}
        <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
          {t.commandsPage.hero.title2}
        </span>
      </h1>
      <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
        {t.commandsPage.hero.subtitle}
      </p>
    </header>
  );
}

function Usage() {
  const { t } = useTranslation();
  return (
    <section className="mb-12 rounded-2xl border border-[var(--neon-violet)]/40 bg-gradient-to-br from-[var(--neon-violet)]/10 to-transparent p-6 sm:p-8">
      <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold sm:text-2xl">
        <Play className="h-5 w-5 text-[var(--neon-violet)]" />
        {t.commandsPage.usage.heading}
      </h2>
      <p className="text-sm text-muted-foreground sm:text-base">
        {t.commandsPage.usage.description}
      </p>
      <div
        className="mt-5 overflow-x-auto rounded-lg border border-border bg-[oklch(0.18_0.04_265)] p-4 font-mono text-xs leading-relaxed text-[var(--neon-cyan)] sm:text-sm"
        dir="ltr"
      >
        <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          {t.commandsPage.usage.exampleLabel}
        </div>
        <pre>
          <code>{`$ claude
> /audit
> /scan-deps
> /scan-secrets
> /security-review origin/main
> /defensive-payload-analysis tailwind.config.js`}</code>
        </pre>
      </div>
      <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2 sm:text-sm">
        <Hint>{t.commandsPage.usage.hintCommandsDir}</Hint>
        <Hint>{t.commandsPage.usage.hintSkillsDir}</Hint>
      </div>
    </section>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-border bg-background/40 p-3">
      <ChevronsRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neon-cyan)] rtl:rotate-180" />
      <span className="font-mono text-foreground/90" dir="ltr">
        {children}
      </span>
    </div>
  );
}

function CommandsSection() {
  const { t } = useTranslation();
  return (
    <section className="mb-14">
      <SectionHeader
        badge={t.commandsPage.commandsSection.badge}
        heading={t.commandsPage.commandsSection.heading}
        description={t.commandsPage.commandsSection.description}
        accent="cyan"
      />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {COMMANDS.map((cmd) => (
          <CommandCard key={cmd.slug} item={cmd} />
        ))}
      </div>
    </section>
  );
}

function CommandCard({ item }: { item: CommandItem }) {
  const { t } = useTranslation();
  const Icon = item.icon;
  return (
    <article className="group flex h-full flex-col rounded-xl border border-border bg-card/40 p-5 transition-all hover:border-[var(--neon-cyan)]/50 hover:bg-card">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--neon-cyan)]/25 to-[var(--neon-violet)]/25 text-[var(--neon-cyan)]">
          <Icon className="h-5 w-5" />
        </span>
        <code
          className="rounded-md border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 px-2.5 py-1 font-mono text-sm font-semibold text-[var(--neon-cyan)]"
          dir="ltr"
        >
          /{item.slug}
        </code>
      </div>
      <p className="text-sm text-foreground/90">
        {t.commandsPage.descriptions[item.descriptionKey]}
      </p>
      {item.output ? (
        <div className="mt-4 rounded-md border border-border bg-background/40 p-3">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {t.commandsPage.outputLabel}
          </div>
          <code
            className="block break-all font-mono text-xs text-[var(--neon-magenta)]"
            dir="ltr"
          >
            {item.output}
          </code>
        </div>
      ) : null}
    </article>
  );
}

function SkillsSection() {
  const { t } = useTranslation();
  return (
    <section className="mb-14">
      <SectionHeader
        badge={t.commandsPage.skillsSection.badge}
        heading={t.commandsPage.skillsSection.heading}
        description={t.commandsPage.skillsSection.description}
        accent="magenta"
      />
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SKILLS.map((skill) => (
          <SkillCard key={skill.slug} item={skill} />
        ))}
      </div>
    </section>
  );
}

function SkillCard({ item }: { item: SkillItem }) {
  const { t } = useTranslation();
  const Icon = item.icon;
  return (
    <article className="group flex h-full flex-col rounded-xl border border-border bg-card/40 p-5 transition-all hover:border-[var(--neon-magenta)]/50 hover:bg-card">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--neon-magenta)]/25 to-[var(--neon-violet)]/25 text-[var(--neon-magenta)]">
          <Icon className="h-4 w-4" />
        </span>
        <code
          className="break-all rounded-md border border-[var(--neon-magenta)]/30 bg-[var(--neon-magenta)]/5 px-2 py-1 font-mono text-xs font-semibold text-[var(--neon-magenta)]"
          dir="ltr"
        >
          {item.slug}
        </code>
      </div>
      <p className="text-sm text-foreground/90">
        {t.commandsPage.descriptions[item.descriptionKey]}
      </p>
    </article>
  );
}

function SectionHeader({
  badge,
  heading,
  description,
  accent,
}: {
  badge: string;
  heading: string;
  description: string;
  accent: "cyan" | "magenta";
}) {
  const color =
    accent === "cyan"
      ? "border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]"
      : "border-[var(--neon-magenta)]/40 bg-[var(--neon-magenta)]/10 text-[var(--neon-magenta)]";
  return (
    <div>
      <Badge className={`font-mono ${color}`}>{badge}</Badge>
      <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">{heading}</h2>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  );
}

function CTASection() {
  const { t } = useTranslation();
  return (
    <section className="my-8 rounded-2xl border border-[var(--neon-cyan)]/40 bg-gradient-to-br from-[var(--neon-cyan)]/10 via-[var(--neon-violet)]/10 to-[var(--neon-magenta)]/10 p-8 text-center">
      <Shield className="mx-auto h-10 w-10 text-[var(--neon-cyan)]" />
      <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
        {t.commandsPage.cta.title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
        {t.commandsPage.cta.description}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button
          asChild
          className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] font-bold text-background hover:opacity-90"
        >
          <a href={`${REPO_URL}/blob/main/CLAUDE.md`} target="_blank" rel="noreferrer">
            <BookOpen className="mr-2 h-4 w-4" />
            {t.commandsPage.cta.button}
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link to="/playbook">
            Playbook <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/reports/example-summary">
            Example report <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
      {t.footer.tagline}
    </footer>
  );
}
