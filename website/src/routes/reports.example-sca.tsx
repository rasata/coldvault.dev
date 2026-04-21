import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/i18n/context";
import { reportsScaTranslations } from "@/i18n/reports-sca";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Ban,
  CheckCircle2,
  FileSearch,
  Github,
  HelpCircle,
  Info,
  Package,
  PackageX,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  XCircle,
} from "lucide-react";

const REPO_URL = "https://github.com/rasata/coldvault.dev";

export const Route = createFileRoute("/reports/example-sca")({
  component: ExampleSCAPage,
});

function ExampleSCAPage() {
  const { locale } = useTranslation();
  const t = reportsScaTranslations[locale];

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
    setMeta(
      'meta[property="og:title"]',
      "property",
      "og:title",
      t.ogTitle,
    );
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      t.metaDescription,
    );
    setMeta('meta[property="og:type"]', "property", "og:type", "article");
  }, [t.metaTitle, t.metaDescription, t.ogTitle]);

  return (
    <div className="min-h-screen bg-grid">
      <ReportNav />
      <main className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6">
        <ReportHeader />
        <Scorecard />
        <BlockingIssue />

        <Section
          n="1"
          title={t.section1Title}
          subtitle={t.section1Subtitle}
          icon={<ShieldAlert className="h-5 w-5" />}
        >
          <RiskTable rows={buildBackendHighRisk(t)} />
        </Section>

        <Section
          n="2"
          title={t.section2Title}
          subtitle={t.section2Subtitle}
          icon={<PackageX className="h-5 w-5" />}
        >
          <p className="mb-4 text-sm text-muted-foreground">
            {t.section2IntroPre}
            <em>{t.section2IntroEm}</em>
            {t.section2IntroMid1}
            <code>0.0.0</code>
            {t.section2IntroMid2}
            <code>fs@0.0.1-security</code>
            {t.section2IntroMid3}
            <code>package.json</code>
            {t.section2IntroPost}
          </p>
          <RiskTable rows={buildSuspiciousDeps(t)} />
        </Section>

        <Section
          n="3"
          title={t.section3Title}
          subtitle={t.section3Subtitle}
          icon={<Package className="h-5 w-5" />}
        >
          <RiskTable rows={buildFrontendDeps(t)} />
        </Section>

        <Section
          n="4"
          title={t.section4Title}
          icon={<Terminal className="h-5 w-5" />}
        >
          <Callout tone="info" title={t.section4CalloutTitle}>
            {t.section4CalloutBody1Pre}
            <code>pro_lmng/package.json</code>
            {t.section4CalloutBody1Mid}
            <code>backend/package.json</code>
            {t.section4CalloutBody1Post}
            <strong>{t.section4CalloutBody2NotEm}</strong>
            {t.section4CalloutBody2Mid}
            <code>CLAUDE.md §0</code>
            {t.section4CalloutBody2Post}
          </Callout>
        </Section>

        <Section
          n="5"
          title={t.section5Title}
          icon={<FileSearch className="h-5 w-5" />}
        >
          <Callout tone="good" title={t.section5CalloutTitle}>
            {t.section5CalloutBodyPre}
            <code>git+</code>
            {t.section5CalloutBodyMid1}
            <code>github:</code>
            {t.section5CalloutBodyMid1}
            <code>file:</code>
            {t.section5CalloutBodyMid2}
            <code>registry.npmjs.org</code>
            {t.section5CalloutBodyPost}
          </Callout>
        </Section>

        <Section
          n="6"
          title={t.section6Title}
          icon={<CheckCircle2 className="h-5 w-5" />}
        >
          <RecommendationGrid />
        </Section>

        <AnalystNote />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
}

/* ───────── data ───────── */

type Severity = "HIGH" | "MED" | "LOW" | "INFO";

interface RiskRow {
  name: string;
  version: string;
  severity: Severity;
  note: string;
}

type Dict = (typeof reportsScaTranslations)[keyof typeof reportsScaTranslations];

const backendHighRiskMeta: { name: string; version: string; severity: Severity }[] = [
  { name: "request", version: "^2.88.2", severity: "HIGH" },
  { name: "xlsx", version: "^0.18.5", severity: "HIGH" },
  { name: "crypto-js", version: "^4.2.0", severity: "HIGH" },
  { name: "ethereumjs-util", version: "^7.1.5", severity: "HIGH" },
  { name: "mysql", version: "^2.18.1", severity: "HIGH" },
  { name: "tronweb", version: "^6.0.4", severity: "MED" },
  { name: "xrpl", version: "^3.1.0", severity: "LOW" },
  { name: "formidable", version: "^3.5.1", severity: "LOW" },
  { name: "adm-zip", version: "^0.5.10", severity: "MED" },
  { name: "jsonwebtoken", version: "^9.0.2", severity: "HIGH" },
  { name: "multer", version: "^2.0.0", severity: "MED" },
];

const suspiciousDepsMeta: { name: string; version: string; severity: Severity }[] = [
  { name: "blob", version: "0.1.0", severity: "MED" },
  { name: "fs", version: "0.0.1-security", severity: "HIGH" },
  { name: "execp", version: "0.0.1", severity: "HIGH" },
  { name: "reverse-string", version: "0.0.6", severity: "MED" },
  { name: "ethereum-address", version: "0.0.4", severity: "HIGH" },
  { name: "send-crypto", version: "0.0.0", severity: "HIGH" },
  { name: "validate-phone-number-node-js", version: "0.0.1", severity: "MED" },
  { name: "nodejs-base64", version: "^2.0.0", severity: "LOW" },
  { name: "referral-code-generator", version: "^1.0.8", severity: "LOW" },
  { name: "image-thumbnail", version: "^1.0.13", severity: "HIGH" },
  { name: "probe-image-size", version: "^7.2.3", severity: "MED" },
];

const frontendDepsMeta: { name: string; version: string; severity: Severity }[] = [
  { name: "@walletconnect/ethereum-provider", version: "1.8.0", severity: "HIGH" },
  { name: "request", version: "^2.88.2", severity: "HIGH" },
  { name: "react-scripts", version: "5.0.1", severity: "MED" },
  { name: "@web3-react/*", version: "8.0.x-beta.*", severity: "MED" },
  { name: "react-custom-roulette", version: "^1.4.1", severity: "INFO" },
  { name: "buffer, fs", version: "—", severity: "MED" },
];

function buildBackendHighRisk(t: Dict): RiskRow[] {
  return backendHighRiskMeta.map((m, i) => ({
    ...m,
    note: t.backendHighRiskNotes[i],
  }));
}

function buildSuspiciousDeps(t: Dict): RiskRow[] {
  return suspiciousDepsMeta.map((m, i) => ({
    ...m,
    note: t.suspiciousDepsNotes[i],
  }));
}

function buildFrontendDeps(t: Dict): RiskRow[] {
  return frontendDepsMeta.map((m, i) => ({
    ...m,
    note: t.frontendDepsNotes[i],
  }));
}

const blocks: { pkg: string; actionKey: "remove" | "replace" | "upgrade" | "removeRegistry" | "remove0"| "removeBuiltin"; replacement?: string }[] = [
  { pkg: "request", actionKey: "remove", replacement: "undici / native fetch" },
  { pkg: "xlsx", actionKey: "replace", replacement: "xlsx-js-style or direct SheetJS CDN" },
  { pkg: "ethereumjs-util", actionKey: "replace", replacement: "@ethereumjs/util 9.x" },
  { pkg: "blob", actionKey: "remove" },
  { pkg: "fs", actionKey: "removeRegistry" },
  { pkg: "execp", actionKey: "remove" },
  { pkg: "reverse-string", actionKey: "remove" },
  { pkg: "ethereum-address", actionKey: "remove" },
  { pkg: "send-crypto", actionKey: "remove0" },
  { pkg: "validate-phone-number-node-js", actionKey: "remove" },
  { pkg: "nodejs-base64", actionKey: "removeBuiltin" },
  { pkg: "WalletConnect v1", actionKey: "upgrade", replacement: "@walletconnect/ethereum-provider v2" },
];

const actionLabels: Record<string, Record<typeof blocks[number]["actionKey"], string>> = {
  en: {
    remove: "Remove",
    replace: "Replace",
    upgrade: "Upgrade",
    removeRegistry: "Remove (registry placeholder)",
    remove0: "Remove (0.0.0 placeholder)",
    removeBuiltin: "Remove (use built-in)",
  },
  fr: {
    remove: "Retirer",
    replace: "Remplacer",
    upgrade: "Mettre à jour",
    removeRegistry: "Retirer (placeholder registre)",
    remove0: "Retirer (placeholder 0.0.0)",
    removeBuiltin: "Retirer (utiliser le natif)",
  },
  de: {
    remove: "Entfernen",
    replace: "Ersetzen",
    upgrade: "Upgraden",
    removeRegistry: "Entfernen (Registry-Platzhalter)",
    remove0: "Entfernen (0.0.0-Platzhalter)",
    removeBuiltin: "Entfernen (eingebaut nutzen)",
  },
  es: {
    remove: "Eliminar",
    replace: "Reemplazar",
    upgrade: "Actualizar",
    removeRegistry: "Eliminar (placeholder del registro)",
    remove0: "Eliminar (placeholder 0.0.0)",
    removeBuiltin: "Eliminar (usar nativo)",
  },
  zh: {
    remove: "移除",
    replace: "替换",
    upgrade: "升级",
    removeRegistry: "移除（注册表占位）",
    remove0: "移除（0.0.0 占位）",
    removeBuiltin: "移除（用内置）",
  },
  ja: {
    remove: "削除",
    replace: "置換",
    upgrade: "アップグレード",
    removeRegistry: "削除（レジストリのプレースホルダー）",
    remove0: "削除（0.0.0 プレースホルダー）",
    removeBuiltin: "削除（組み込みを使用）",
  },
  ko: {
    remove: "제거",
    replace: "교체",
    upgrade: "업그레이드",
    removeRegistry: "제거(레지스트리 플레이스홀더)",
    remove0: "제거(0.0.0 플레이스홀더)",
    removeBuiltin: "제거(내장 사용)",
  },
  ar: {
    remove: "أزِل",
    replace: "استبدِل",
    upgrade: "حدِّث",
    removeRegistry: "أزِل (نائب السجل)",
    remove0: "أزِل (نائب 0.0.0)",
    removeBuiltin: "أزِل (استخدم المدمج)",
  },
};

/* ───────── components ───────── */

function ReportNav() {
  const { locale } = useTranslation();
  const t = reportsScaTranslations[locale];
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
              {t.navHome}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/blog/anatomy-of-a-deceptive-developer-attack">
              {t.navCaseStudy}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function ReportHeader() {
  const { locale } = useTranslation();
  const t = reportsScaTranslations[locale];
  return (
    <header className="mb-10">
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge className="bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] border-[var(--neon-cyan)]/40 font-mono">
          {t.badgeExample}
        </Badge>
        <Badge variant="outline" className="border-[var(--neon-violet)]/40">
          {t.tagSca}
        </Badge>
        <Badge variant="outline" className="border-[var(--neon-violet)]/40">
          {t.tagSupplyChain}
        </Badge>
        <Badge variant="outline" className="border-[var(--neon-violet)]/40">
          {t.tagWeb3}
        </Badge>
      </div>
      <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
        {t.titleLead}{" "}
        <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
          {t.titleAccent}
        </span>
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {t.introPre}
        <code className="rounded bg-muted px-1 py-0.5 text-sm text-[var(--neon-magenta)]">
          DeceptiveDevelopment
        </code>
        {t.introCodeSuffix}
        <code>reports/</code>
        {t.introPost}
        <code>/audit</code>.
      </p>
      <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
        <span className="text-[var(--neon-cyan)]">{t.metaTarget}</span>{" "}
        bitbucket.org/teamincwork/pro_lmng
        <br />
        <span className="text-[var(--neon-cyan)]">{t.metaScan}</span>{" "}
        {t.metaScanValue}
        <br />
        <span className="text-[var(--neon-cyan)]">{t.metaSource}</span>{" "}
        {t.metaSourceValue}
        <br />
        <span className="text-[var(--neon-cyan)]">{t.metaStatus}</span>{" "}
        <span className="text-destructive">{t.metaStatusValue}</span>
      </div>
    </header>
  );
}

function Scorecard() {
  const { locale } = useTranslation();
  const t = reportsScaTranslations[locale];
  const backendHighRisk = buildBackendHighRisk(t);
  const suspiciousDeps = buildSuspiciousDeps(t);
  const frontendDeps = buildFrontendDeps(t);
  const counts = {
    high:
      backendHighRisk.filter((r) => r.severity === "HIGH").length +
      suspiciousDeps.filter((r) => r.severity === "HIGH").length +
      frontendDeps.filter((r) => r.severity === "HIGH").length,
    med:
      backendHighRisk.filter((r) => r.severity === "MED").length +
      suspiciousDeps.filter((r) => r.severity === "MED").length +
      frontendDeps.filter((r) => r.severity === "MED").length,
    low:
      backendHighRisk.filter((r) => r.severity === "LOW").length +
      suspiciousDeps.filter((r) => r.severity === "LOW").length +
      frontendDeps.filter((r) => r.severity === "LOW").length,
    info: frontendDeps.filter((r) => r.severity === "INFO").length,
  };

  return (
    <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <ScoreCard
        tone="high"
        label={t.scoreHighLabel}
        value={counts.high}
        hint={t.scoreHighHint}
      />
      <ScoreCard
        tone="med"
        label={t.scoreMedLabel}
        value={counts.med}
        hint={t.scoreMedHint}
      />
      <ScoreCard
        tone="low"
        label={t.scoreLowLabel}
        value={counts.low}
        hint={t.scoreLowHint}
      />
      <ScoreCard
        tone="info"
        label={t.scoreInfoLabel}
        value={counts.info}
        hint={t.scoreInfoHint}
      />
    </div>
  );
}

function ScoreCard({
  tone,
  label,
  value,
  hint,
}: {
  tone: "high" | "med" | "low" | "info";
  label: string;
  value: number;
  hint: string;
}) {
  const toneStyles = {
    high: "border-destructive/50 bg-destructive/5",
    med: "border-[var(--neon-magenta)]/40 bg-[var(--neon-magenta)]/5",
    low: "border-[var(--neon-violet)]/40 bg-[var(--neon-violet)]/5",
    info: "border-border bg-muted/30",
  }[tone];

  const valueStyles = {
    high: "text-destructive",
    med: "text-[var(--neon-magenta)]",
    low: "text-[var(--neon-violet)]",
    info: "text-muted-foreground",
  }[tone];

  return (
    <div className={`rounded-xl border p-5 ${toneStyles}`}>
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={`mt-2 font-display text-4xl font-bold ${valueStyles}`}>
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function BlockingIssue() {
  const { locale } = useTranslation();
  const t = reportsScaTranslations[locale];
  return (
    <div className="mb-10 overflow-hidden rounded-2xl border-2 border-destructive/50 bg-gradient-to-br from-destructive/10 to-[var(--neon-magenta)]/5">
      <div className="flex items-start gap-4 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/20">
          <Ban className="h-6 w-6 text-destructive" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-destructive">
            {t.blockingLabel}
          </div>
          <h2 className="mt-1 font-display text-xl font-bold sm:text-2xl">
            {t.blockingTitlePre}
            <code>.gitignore</code>
            {t.blockingTitlePost}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            {t.blockingBody1Pre}
            <code>npm install</code>
            {t.blockingBody1Mid}
            <code>osv-scanner</code>, <code>trivy fs</code>, <code>syft</code>,{" "}
            <code>grype</code>
            {t.blockingBody1Post}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            <strong className="text-destructive">{t.blockingBody2Required}</strong>
            {t.blockingBody2Pre}
            <code>.gitignore</code>
            {t.blockingBody2Mid}
            <em>{t.blockingBody2WorseEm}</em>
            {t.blockingBody2Post}
          </p>
        </div>
      </div>
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
          <div className="font-mono text-xs text-muted-foreground">
            § {n}
          </div>
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
      <div className="prose prose-invert max-w-none space-y-4 text-foreground/90 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-[var(--neon-magenta)] [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}

function severityBadge(sev: Severity) {
  const map = {
    HIGH: "border-destructive/50 bg-destructive/15 text-destructive",
    MED: "border-[var(--neon-magenta)]/50 bg-[var(--neon-magenta)]/15 text-[var(--neon-magenta)]",
    LOW: "border-[var(--neon-violet)]/50 bg-[var(--neon-violet)]/15 text-[var(--neon-violet)]",
    INFO: "border-border bg-muted text-muted-foreground",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider ${map[sev]}`}
    >
      {sev}
    </span>
  );
}

function RiskTable({ rows }: { rows: RiskRow[] }) {
  const { locale } = useTranslation();
  const t = reportsScaTranslations[locale];
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="w-[22%] px-3 py-2 text-left font-semibold">
                {t.thPackage}
              </th>
              <th className="w-[14%] px-3 py-2 text-left font-semibold">
                {t.thDeclared}
              </th>
              <th className="w-[8%] px-3 py-2 text-left font-semibold">{t.thSev}</th>
              <th className="px-3 py-2 text-left font-semibold">{t.thRisk}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.name}
                className="border-t border-border align-top hover:bg-muted/20"
              >
                <td className="px-3 py-3 font-mono text-[var(--neon-cyan)]">
                  {r.name}
                </td>
                <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                  {r.version}
                </td>
                <td className="px-3 py-3">{severityBadge(r.severity)}</td>
                <td className="px-3 py-3 text-sm leading-relaxed text-foreground/90">
                  {r.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Callout({
  tone,
  title,
  children,
}: {
  tone: "info" | "good" | "bad";
  title: string;
  children: React.ReactNode;
}) {
  const toneStyles = {
    info: {
      wrapper: "border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/5",
      icon: "text-[var(--neon-cyan)]",
      Icon: Info,
    },
    good: {
      wrapper: "border-emerald-500/40 bg-emerald-500/5",
      icon: "text-emerald-400",
      Icon: CheckCircle2,
    },
    bad: {
      wrapper: "border-destructive/50 bg-destructive/10",
      icon: "text-destructive",
      Icon: XCircle,
    },
  }[tone];

  const { Icon } = toneStyles;
  return (
    <div className={`rounded-xl border p-5 ${toneStyles.wrapper}`}>
      <div
        className={`mb-2 flex items-center gap-2 text-sm font-semibold ${toneStyles.icon}`}
      >
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <div className="text-sm leading-relaxed text-foreground/90">
        {children}
      </div>
    </div>
  );
}

function RecommendationGrid() {
  const { locale } = useTranslation();
  const t = reportsScaTranslations[locale];
  const labels = actionLabels[locale];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border-2 border-destructive/50 bg-destructive/5 p-5">
        <div className="mb-3 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-destructive">
          <Ban className="h-4 w-4" />
          {t.recBlockTitle}
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-destructive">•</span>
            <span>
              {t.recBlockItem1Pre}
              <code className="rounded bg-muted px-1 py-0.5 text-xs text-[var(--neon-magenta)]">package-lock.json</code>
              {t.recBlockItem1Mid}
              <code className="rounded bg-muted px-1 py-0.5 text-xs text-[var(--neon-magenta)]">.gitignore</code>
              {t.recBlockItem1Post}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-destructive">•</span>
            <span>{t.recBlockItem2}</span>
          </li>
        </ul>
      </div>

      <div className="rounded-xl border-2 border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/5 p-5">
        <div className="mb-3 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-[var(--neon-cyan)]">
          <PackageX className="h-4 w-4" />
          {t.recRemoveTitle}
        </div>
        <div className="space-y-2">
          {blocks.map((b) => (
            <div
              key={b.pkg}
              className="flex flex-wrap items-center gap-2 text-sm"
            >
              <span className="font-mono text-xs text-[var(--neon-cyan)]">
                {b.pkg}
              </span>
              <span className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {labels[b.actionKey]}
              </span>
              {b.replacement && (
                <span className="text-xs text-muted-foreground">
                  → <span className="text-foreground/80">{b.replacement}</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border-2 border-[var(--neon-magenta)]/40 bg-[var(--neon-magenta)]/5 p-5 md:col-span-2">
        <div className="mb-3 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-[var(--neon-magenta)]">
          <HelpCircle className="h-4 w-4" />
          {t.recInvestigateTitle}
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 font-mono text-xs text-[var(--neon-magenta)]">
              image-thumbnail
            </span>
            <span className="text-foreground/90">{t.investigateQuestions[0]}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 font-mono text-xs text-[var(--neon-magenta)]">
              probe-image-size
            </span>
            <span className="text-foreground/90">{t.investigateQuestions[1]}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function AnalystNote() {
  const { locale } = useTranslation();
  const t = reportsScaTranslations[locale];
  return (
    <aside className="mt-12 rounded-2xl border border-[var(--neon-violet)]/40 bg-gradient-to-br from-[var(--neon-violet)]/10 to-[var(--neon-cyan)]/5 p-6">
      <div className="mb-2 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-[var(--neon-violet)]">
        <AlertTriangle className="h-4 w-4" />
        {t.analystTitle}
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">
        {t.analystBodyPre}
        <strong>{t.analystBodyStrong}</strong>
        {t.analystBodyMid1}
        <code>scan-secrets</code>
        {t.analystBodyMid2}
        <code>scan-sast</code>
        {t.analystBodyMid3}
        <code>scan-malware</code>
        {t.analystBodyMid4}
        <code>scan-iac</code>
        {t.analystBodyMid5}
      </p>
    </aside>
  );
}

function CTASection() {
  const { locale } = useTranslation();
  const t = reportsScaTranslations[locale];
  return (
    <section className="mt-12">
      <div className="relative overflow-hidden rounded-3xl border border-border glass p-8 text-center">
        <div className="absolute -top-20 left-1/2 h-40 w-[120%] -translate-x-1/2 bg-gradient-to-r from-[var(--neon-cyan)]/20 via-[var(--neon-violet)]/20 to-[var(--neon-magenta)]/20 blur-3xl" />
        <Terminal className="mx-auto h-10 w-10 text-[var(--neon-cyan)]" />
        <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
          {t.ctaTitleLead}{" "}
          <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
            {t.ctaTitleAccent}
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          {t.ctaBodyPre}
          <code>{t.ctaBodyCode}</code>
          {t.ctaBodyPost}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] text-background font-bold hover:opacity-90"
          >
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              <Github className="mr-2 h-4 w-4" />
              {t.ctaPrimary}
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/blog/anatomy-of-a-deceptive-developer-attack">
              {t.ctaSecondary}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/playbook">{t.ctaTertiary}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { locale } = useTranslation();
  const t = reportsScaTranslations[locale];
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
