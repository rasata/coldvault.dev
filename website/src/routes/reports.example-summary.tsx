import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/i18n/context";
import {
  reportsSummaryTranslations,
  type ReportsSummaryDict,
} from "@/i18n/reports-summary";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Ban,
  Database,
  FileCode,
  FileSearch,
  FileText,
  Github,
  KeyRound,
  Lock,
  Network,
  Package,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Siren,
  Terminal,
  Webhook,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const REPO_URL = "https://github.com/rasata/coldvault.dev";

export const Route = createFileRoute("/reports/example-summary")({
  component: ExampleSummaryPage,
});

function useT(): ReportsSummaryDict {
  const { locale } = useTranslation();
  return reportsSummaryTranslations[locale];
}

/** Render a string containing `code` and **bold** markers as JSX. */
function renderRich(text: string): React.ReactNode {
  // First split on backtick-wrapped code, then split each non-code chunk on **bold**.
  const parts = text.split(/(`[^`]+`)/);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    const boldParts = part.split(/(\*\*[^*]+\*\*)/);
    return boldParts.map((b, j) => {
      if (b.startsWith("**") && b.endsWith("**")) {
        return <strong key={`${i}-${j}`}>{b.slice(2, -2)}</strong>;
      }
      return <span key={`${i}-${j}`}>{b}</span>;
    });
  });
}

function ExampleSummaryPage() {
  const t = useT();
  useEffect(() => {
    document.title = t.metaTitle;
    const setMeta = (
      sel: string,
      attr: "name" | "property",
      key: string,
      value: string,
    ) => {
      let tag = document.head.querySelector<HTMLMetaElement>(sel);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };
    setMeta('meta[name="description"]', "name", "description", t.metaDescription);
    setMeta('meta[property="og:title"]', "property", "og:title", t.ogTitle);
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      t.metaDescription,
    );
    setMeta('meta[property="og:type"]', "property", "og:type", "article");
  }, [t]);

  return (
    <div className="min-h-screen bg-grid">
      <ReportNav />
      <main className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6">
        <ReportHeader />
        <Verdict />
        <KillChain />
        <FindingCounts />

        <Section n="1" title={t.s1Title} subtitle={t.s1Sub} icon={<ShieldAlert className="h-5 w-5" />}>
          <FindingTable rows={highFindingsWith(t)} tone="high" />
        </Section>

        <Section n="2" title={t.s2Title} subtitle={t.s2Sub} icon={<ShieldX className="h-5 w-5" />}>
          <FindingTable rows={medFindingsWith(t)} tone="med" />
        </Section>

        <Section n="3" title={t.s3Title} subtitle={t.s3Sub} icon={<FileSearch className="h-5 w-5" />}>
          <ExclusionsNote />
        </Section>

        <Section n="4" title={t.s4Title} subtitle={t.s4Sub} icon={<Siren className="h-5 w-5" />}>
          <ImmediateActions />
          <ThenTheRewrite />
        </Section>

        <Section n="5" title={t.s5Title} subtitle={t.s5Sub} icon={<Package className="h-5 w-5" />}>
          <SupplyChainNote />
        </Section>

        <Section n="6" title={t.s6Title} subtitle={t.s6Sub} icon={<Lock className="h-5 w-5" />}>
          <PromptInjectionNote />
        </Section>

        <Section n="7" title={t.s7Title} subtitle={t.s7Sub} icon={<FileText className="h-5 w-5" />}>
          <Artifacts />
        </Section>

        <CTASection />
        <Footer />
      </main>
    </div>
  );
}

/* ───────── data ───────── */

interface Finding {
  n: number;
  category: string;
  location: string;
  impact: string;
  icon: LucideIcon;
}

const HIGH_LOC_ICON: { location: string; icon: LucideIcon }[] = [
  { location: "backend/config.js:7", icon: KeyRound },
  { location: "backend/routes/routes.js:96-104", icon: ShieldX },
  { location: "backend/models/admin.model.js:28", icon: Database },
  { location: "backend/models/admin.model.js:15", icon: Database },
  { location: "backend/models/user.model.js (39 sinks)", icon: Database },
  { location: "backend/app.js:106,147", icon: Database },
  { location: "backend/routes/webhooks.routes.js:5", icon: Webhook },
  { location: "backend/controllers/register.controller.js:629", icon: Network },
  { location: "backend/controllers/admin.controller.js:59", icon: AlertTriangle },
  { location: "backend/production.env:7", icon: KeyRound },
  { location: "backend/app.js:60-88", icon: FileCode },
];

const MED_LOC_ICON: { location: string; icon: LucideIcon }[] = [
  { location: "backend/routes/routes.js:127", icon: FileCode },
  { location: "backend/app.js:58, routes.js:15", icon: ShieldX },
  { location: "backend/controllers/register.controller.js:12", icon: KeyRound },
  { location: "backend/config.js:2", icon: Database },
  { location: "backend/package.json:44,9,24,54 + no lockfile", icon: Package },
];

const KILL_CHAIN_LOC = [
  "config.js:7",
  "routes/routes.js:96-104",
  "user.model.js + admin.model.js",
  "routes/webhooks.routes.js:5",
  "register.controller.js:629",
];

function highFindingsWith(t: ReportsSummaryDict): Finding[] {
  return t.highFindings.map((f, i) => ({
    n: i + 1,
    category: f.category,
    impact: f.impact,
    location: HIGH_LOC_ICON[i].location,
    icon: HIGH_LOC_ICON[i].icon,
  }));
}

function medFindingsWith(t: ReportsSummaryDict): Finding[] {
  return t.medFindings.map((f, i) => ({
    n: i + 12,
    category: f.category,
    impact: f.impact,
    location: MED_LOC_ICON[i].location,
    icon: MED_LOC_ICON[i].icon,
  }));
}

const ARTIFACT_PATHS = [
  { path: "reports/findings.json", tone: "primary" as const },
  { path: "reports/00-context.md" },
  { path: "reports/sca-manual.md", link: true },
  { path: "reports/sca-osv.sarif, sca-trivy.sarif", muted: true },
  { path: "reports/secrets-gitleaks.sarif, secrets-gitleaks-history.sarif" },
  { path: "reports/yara-matches.txt", muted: true },
] as { path: string; tone?: "primary"; link?: boolean; muted?: boolean }[];

/* ───────── components ───────── */

function ReportNav() {
  const t = useT();
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
              <ArrowLeft className="mr-1 h-4 w-4 rtl:rotate-180" />
              {t.navHome}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/reports/example-sca">{t.navScaDetail}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function ReportHeader() {
  const t = useT();
  return (
    <header className="mb-10">
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge className="bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] border-[var(--neon-cyan)]/40 font-mono">
          {t.badgeExample}
        </Badge>
        <Badge className="border-destructive/50 bg-destructive/15 text-destructive font-mono">
          NO-GO
        </Badge>
        <Badge variant="outline" className="border-[var(--neon-violet)]/40">
          #summary
        </Badge>
        <Badge variant="outline" className="border-[var(--neon-violet)]/40">
          #web3
        </Badge>
        <Badge variant="outline" className="border-[var(--neon-violet)]/40">
          #deceptive-development
        </Badge>
      </div>
      <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
        {t.titleLead}{" "}
        <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
          {t.titleAccent}
        </span>
      </h1>
      <p className="mt-4 text-lg text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-[var(--neon-magenta)]">
        {renderRich(t.headerP)}
      </p>
      <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
        <span className="text-[var(--neon-cyan)]">{t.labelTarget}</span>{" "}
        target/pro_lmng @ 9950580 — "ADMIN-321890: extracted ADMIN module"
        <br />
        <span className="text-[var(--neon-cyan)]">{t.labelScope}</span>{" "}
        {t.scopeValue}
        <br />
        <span className="text-[var(--neon-cyan)]">{t.labelProtocol}</span>{" "}
        {t.protocolValue}
        <br />
        <span className="text-[var(--neon-cyan)]">{t.labelTools}</span> Semgrep,
        YARA, gitleaks, trufflehog, osv-scanner, trivy fs, grype, syft,
        manual review
      </div>
    </header>
  );
}

function Verdict() {
  const t = useT();
  return (
    <div className="mb-10 overflow-hidden rounded-2xl border-2 border-destructive/50 bg-gradient-to-br from-destructive/10 via-[var(--neon-magenta)]/5 to-background">
      <div className="flex items-start gap-4 p-6 sm:p-8">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-destructive/20">
          <Ban className="h-7 w-7 text-destructive" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-destructive">
            {t.verdictLabel}
          </div>
          <h2 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
            NO-GO
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/90">
            {renderRich(t.verdictP1)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            {t.verdictP2}
          </p>
        </div>
      </div>
    </div>
  );
}

function KillChain() {
  const t = useT();
  return (
    <div className="mb-12">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-destructive/30 to-[var(--neon-magenta)]/30 text-destructive">
          <Zap className="h-5 w-5" />
        </span>
        <div>
          <div className="font-mono text-xs text-muted-foreground">{t.killChainLabel}</div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            {t.killChainHeading}
          </h2>
        </div>
      </div>

      <ol className="relative space-y-4">
        <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-destructive via-[var(--neon-magenta)] to-destructive" />
        {t.killChainSteps.map((step, i) => (
          <li key={i} className="relative flex gap-4">
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-destructive bg-background font-mono text-sm font-bold text-destructive">
              {i + 1}
            </div>
            <div className="flex-1 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display font-bold text-foreground">
                  {step.title}
                </h3>
                <code className="rounded bg-muted px-2 py-0.5 text-xs text-[var(--neon-magenta)]">
                  {KILL_CHAIN_LOC[i]}
                </code>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-[var(--neon-magenta)]">
                {renderRich(step.body)}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 p-5">
        <div className="mb-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--neon-cyan)]">
          {t.whatEachLabel}
        </div>
        <ul className="space-y-1.5 text-sm [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:text-[10px] [&_code]:text-[var(--neon-magenta)]">
          {t.whatItems.map((it, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="font-mono text-xs text-[var(--neon-cyan)]">#{i + 1}</span>
              <span>{renderRich(it)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FindingCounts() {
  const t = useT();
  return (
    <div className="mb-12 grid gap-3 sm:grid-cols-3">
      <CountCard tone="high" label={t.countHighLabel} value={11} hint={t.countHighHint} />
      <CountCard tone="med" label={t.countMedLabel} value={5} hint={t.countMedHint} />
      <CountCard tone="low" label={t.countLowLabel} value={0} hint={t.countLowHint} />
    </div>
  );
}

function CountCard({
  tone,
  label,
  value,
  hint,
}: {
  tone: "high" | "med" | "low";
  label: string;
  value: number;
  hint: string;
}) {
  const toneMap = {
    high: {
      wrapper: "border-destructive/50 bg-destructive/5",
      value: "text-destructive",
    },
    med: {
      wrapper: "border-[var(--neon-magenta)]/40 bg-[var(--neon-magenta)]/5",
      value: "text-[var(--neon-magenta)]",
    },
    low: {
      wrapper: "border-border bg-muted/30",
      value: "text-muted-foreground",
    },
  }[tone];

  return (
    <div className={`rounded-xl border p-5 ${toneMap.wrapper}`}>
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={`mt-2 font-display text-5xl font-bold ${toneMap.value}`}>
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function Section({
  n,
  title,
  subtitle,
  icon,
  children,
}: {
  n: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12 scroll-mt-24" id={`s${n}`}>
      <div className="mb-6 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-magenta)]/20 text-[var(--neon-cyan)]">
          {icon}
        </span>
        <div>
          <div className="font-mono text-xs text-muted-foreground">§ {n}</div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <div className="mt-1 font-mono text-xs text-[var(--neon-magenta)]">
              {subtitle}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4 text-foreground/90 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-[var(--neon-magenta)] [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}

function FindingTable({
  rows,
  tone,
}: {
  rows: Finding[];
  tone: "high" | "med";
}) {
  const t = useT();
  const borderStyle =
    tone === "high"
      ? "hover:bg-destructive/5"
      : "hover:bg-[var(--neon-magenta)]/5";
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="w-[5%] px-3 py-2 text-left font-semibold">#</th>
              <th className="w-[6%] px-3 py-2 text-left font-semibold"></th>
              <th className="w-[22%] px-3 py-2 text-left font-semibold">
                {t.thCategory}
              </th>
              <th className="w-[28%] px-3 py-2 text-left font-semibold">
                {t.thLocation}
              </th>
              <th className="px-3 py-2 text-left font-semibold">{t.thImpact}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => {
              const Icon = f.icon;
              return (
                <tr
                  key={f.n}
                  className={`border-t border-border align-top ${borderStyle}`}
                >
                  <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                    {String(f.n).padStart(2, "0")}
                  </td>
                  <td className="px-3 py-3">
                    <Icon
                      className={`h-4 w-4 ${tone === "high" ? "text-destructive" : "text-[var(--neon-magenta)]"}`}
                    />
                  </td>
                  <td className="px-3 py-3 font-medium">{f.category}</td>
                  <td className="px-3 py-3 font-mono text-xs text-[var(--neon-cyan)]">
                    {f.location}
                  </td>
                  <td className="px-3 py-3 text-sm leading-relaxed text-foreground/90">
                    {f.impact}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExclusionsNote() {
  const t = useT();
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <FileSearch className="h-4 w-4" />
        {t.exclusionsTitle}
      </div>
      <ul className="space-y-2 text-sm text-foreground/90 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:text-[11px] [&_code]:text-[var(--neon-magenta)]">
        {t.exclusionsItems.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-0.5 text-muted-foreground">—</span>
            <span>{renderRich(item)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">
        {t.signalOverNoise}
      </p>
    </div>
  );
}

function ImmediateActions() {
  const t = useT();
  return (
    <div>
      <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm">
        <Siren className="mr-2 inline h-4 w-4 text-destructive" />
        <strong className="text-destructive">{t.beforeLabel}</strong>
      </div>
      <div className="space-y-3">
        {t.actionSteps.map((s, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/20 font-mono text-sm font-bold text-destructive">
              {i + 1}
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-foreground">
                {s.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-[var(--neon-magenta)]">
                {renderRich(s.body)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThenTheRewrite() {
  const t = useT();
  return (
    <div className="mt-8">
      <div className="mb-4 rounded-lg border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/10 p-3 text-sm">
        <Terminal className="mr-2 inline h-4 w-4 text-[var(--neon-cyan)]" />
        <strong className="text-[var(--neon-cyan)]">{t.thenRewriteLabel}</strong>
      </div>
      <ol className="space-y-2 rounded-xl border border-border bg-muted/20 p-5 text-sm">
        {t.rewriteItems.map((s, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 font-mono text-xs text-[var(--neon-cyan)]">
              {String(i + 6).padStart(2, "0")}
            </span>
            <span className="text-foreground/90 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-[var(--neon-magenta)]">
              {renderRich(s)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SupplyChainNote() {
  const t = useT();
  return (
    <div className="space-y-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-[var(--neon-magenta)]">
      <p className="text-sm leading-relaxed">{renderRich(t.scP1)}</p>
      <p className="text-sm leading-relaxed">{renderRich(t.scP2)}</p>
      <div className="rounded-xl border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3 text-sm">
            <Package className="h-4 w-4 shrink-0 text-[var(--neon-cyan)]" />
            <span>{t.scCTA}</span>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link to="/reports/example-sca">
              {t.scCTAButton}
              <ArrowRight className="ml-1 h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function PromptInjectionNote() {
  const t = useT();
  return (
    <div className="rounded-xl border border-[var(--neon-violet)]/40 bg-[var(--neon-violet)]/5 p-5 text-sm leading-relaxed [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-[var(--neon-magenta)]">
      <p>{renderRich(t.piP1)}</p>
      <p className="mt-3">{renderRich(t.piP2)}</p>
    </div>
  );
}

function Artifacts() {
  const t = useT();
  return (
    <div className="space-y-2">
      {ARTIFACT_PATHS.map((a, i) => (
        <div
          key={a.path}
          className={`flex flex-col gap-1 rounded-lg border p-3 sm:flex-row sm:items-center sm:gap-4 ${
            a.tone === "primary"
              ? "border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/5"
              : "border-border bg-muted/20"
          }`}
        >
          <code
            className={`font-mono text-xs ${
              a.muted
                ? "text-muted-foreground"
                : a.tone === "primary"
                  ? "text-[var(--neon-cyan)]"
                  : "text-[var(--neon-magenta)]"
            }`}
          >
            {a.path}
          </code>
          <span className="flex-1 text-xs text-muted-foreground">
            {t.artifactsNotes[i]}
          </span>
          {a.link && (
            <Link
              to="/reports/example-sca"
              className="text-xs text-[var(--neon-cyan)] underline"
            >
              {t.artifactsViewLink}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

function CTASection() {
  const t = useT();
  return (
    <section className="mt-12">
      <div className="relative overflow-hidden rounded-3xl border border-border glass p-8 text-center">
        <div className="absolute -top-20 left-1/2 h-40 w-[120%] -translate-x-1/2 bg-gradient-to-r from-[var(--neon-cyan)]/20 via-[var(--neon-violet)]/20 to-[var(--neon-magenta)]/20 blur-3xl" />
        <Terminal className="mx-auto h-10 w-10 text-[var(--neon-cyan)]" />
        <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
          {t.ctaTitle}{" "}
          <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
            {t.ctaTitleAccent}
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-[var(--neon-magenta)]">
          {renderRich(t.ctaBody)}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] text-background font-bold hover:opacity-90"
          >
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              <Github className="mr-2 h-4 w-4" />
              github.com/rasata/coldvault.dev
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/reports/example-sca">
              {t.ctaButtonSCA}
              <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/blog/anatomy-of-a-deceptive-developer-attack">
              {t.ctaButtonCase}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/playbook">{t.ctaButtonPlaybook}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const t = useT();
  return (
    <footer className="mt-16 border-t border-border pt-8 text-center text-sm text-muted-foreground">
      <p>
        {t.footerPublishedBy}{" "}
        <a
          href="https://zonova.io"
          className="text-[var(--neon-cyan)] underline"
          target="_blank"
          rel="noreferrer"
        >
          ZONOVA RESEARCH
        </a>
        {t.footerSuffix}
      </p>
    </footer>
  );
}
