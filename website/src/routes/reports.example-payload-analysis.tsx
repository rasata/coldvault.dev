import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/i18n/context";
import { reportsPayloadAnalysisTranslations } from "@/i18n/reports-payload-analysis";
import {
  AlertOctagon,
  AlertTriangle,
  Ban,
  BookOpen,
  Bug,
  CheckCircle2,
  EyeOff,
  FileCode,
  FileSearch,
  FileText,
  FileWarning,
  Fingerprint,
  Flame,
  Github,
  KeyRound,
  Network,
  Radar,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Skull,
  Terminal,
  Unplug,
} from "lucide-react";

const REPO_URL = "https://github.com/rasata/coldvault.dev";

function useDict() {
  const { locale } = useTranslation();
  return reportsPayloadAnalysisTranslations[locale];
}

/**
 * All real attacker infrastructure, real campaign identifiers, real victim
 * credentials, and repo-identifying strings from the underlying case file have
 * been redacted or replaced with RFC 5737 documentation-only addresses. This
 * page is a template of what a defensive-payload-analysis report looks like —
 * it is NOT a live IoC feed.
 */

export const Route = createFileRoute("/reports/example-payload-analysis")({
  component: ExamplePayloadAnalysisPage,
});

function ExamplePayloadAnalysisPage() {
  const t = useDict();
  useEffect(() => {
    document.title = t.pageTitle;
    const setMeta = (sel: string, attr: "name" | "property", key: string, value: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(sel);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };
    setMeta('meta[name="description"]', "name", "description", t.pageDescription);
    setMeta('meta[property="og:title"]', "property", "og:title", t.ogTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", t.pageDescription);
    setMeta('meta[property="og:type"]', "property", "og:type", "article");
  }, [t]);

  return (
    <div className="min-h-screen bg-grid">
      <ReportNav />
      <main className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6">
        <AlertBanner />
        <DoNotRunBanner />
        <ReportHeader />
        <SanitizationNotice />

        <Section
          n="1"
          title={t.section1Title}
          subtitle={t.section1Subtitle}
          icon={<ScrollText className="h-5 w-5" />}
        >
          <ExecSummary />
        </Section>

        <Section
          n="2"
          title={t.section2Title}
          subtitle={t.section2Subtitle}
          icon={<Fingerprint className="h-5 w-5" />}
        >
          <PayloadLocationTable />
        </Section>

        <Section
          n="3"
          title={t.section3Title}
          subtitle={t.section3Subtitle}
          icon={<Bug className="h-5 w-5" />}
        >
          <CapabilitiesList />
        </Section>

        <Section
          n="4"
          title={t.section4Title}
          subtitle={t.section4Subtitle}
          icon={<Radar className="h-5 w-5" />}
        >
          <AttributionBlock />
        </Section>

        <Section
          n="5"
          title={t.section5Title}
          subtitle={t.section5Subtitle}
          icon={<FileWarning className="h-5 w-5" />}
        >
          <IoCTable />
        </Section>

        <Section
          n="6"
          title={t.section6Title}
          subtitle={t.section6Subtitle}
          icon={<Siren className="h-5 w-5" />}
        >
          <ImmediateActions />
        </Section>

        <Section
          n="7"
          title={t.section7Title}
          subtitle={t.section7Subtitle}
          icon={<CheckCircle2 className="h-5 w-5" />}
        >
          <ClosureChecklist />
        </Section>

        <Section
          n="8"
          title={t.section8Title}
          subtitle={t.section8Subtitle}
          icon={<BookOpen className="h-5 w-5" />}
        >
          <ReferencesBlock />
        </Section>

        <CTASection />
        <Footer />
      </main>
    </div>
  );
}

/* ───────── top banners ───────── */

function AlertBanner() {
  const t = useDict();
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border-2 border-destructive/60 bg-gradient-to-r from-destructive/20 via-destructive/10 to-transparent">
      <div className="flex items-start gap-4 p-5 sm:p-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-destructive/30">
          <AlertOctagon className="h-7 w-7 text-destructive" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-destructive">
            {t.alertLabel}
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
            <code className="rounded bg-destructive/10 px-1.5 py-0.5 text-xl text-destructive">
              target/suspect-repo/
            </code>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            {t.alertBodyPre}
            <code className="rounded bg-muted px-1 py-0.5 text-xs text-[var(--neon-magenta)]">
              tailwind.config.js
            </code>
            {t.alertBodyPost}
          </p>
        </div>
      </div>
    </div>
  );
}

function DoNotRunBanner() {
  const t = useDict();
  const commands = [
    "npm install", "npm i", "yarn", "pnpm install",
    "npm start", "npm run build", "npm run server",
    "npm test", "node …",
    "open in VS Code / WebStorm / Cursor (Tailwind IntelliSense extension active)",
    t.doNotRunLastCommand,
  ];
  return (
    <div className="mb-10 rounded-2xl border-2 border-destructive/50 bg-destructive/5 p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-destructive">
        <Ban className="h-4 w-4" />
        {t.doNotRunTitle}
      </div>
      <p className="text-sm text-foreground/90">
        {t.doNotRunBodyPre}
        <code className="rounded bg-muted px-1 py-0.5 text-xs text-[var(--neon-magenta)]">
          target/suspect-repo/
        </code>
        {t.doNotRunBodyPost}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {commands.map((c) => (
          <code
            key={c}
            className="rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1 font-mono text-xs text-destructive"
          >
            {c}
          </code>
        ))}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        {t.doNotRunFootPre}
        <code>react-scripts</code>
        {t.doNotRunFootMid1}
        <code>postcss</code>
        {t.doNotRunFootMid2}
        <code>tailwind.config.js</code>
        {t.doNotRunFootPost}
      </p>
    </div>
  );
}

/* ───────── header + sanitization notice ───────── */

function ReportNav() {
  const t = useDict();
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
            <Link to="/reports/example-summary">
              <ArrowLeftIcon />
              {t.navSummary}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link to="/commands">{t.navCommands}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function ArrowLeftIcon() {
  // Avoids importing another lucide icon solely for the nav arrow.
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="mr-1 h-4 w-4 rtl:rotate-180"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function ReportHeader() {
  const t = useDict();
  return (
    <header className="mb-8">
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge className="bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] border-[var(--neon-cyan)]/40 font-mono">
          {t.badgeExample}
        </Badge>
        <Badge className="border-destructive/50 bg-destructive/15 text-destructive font-mono">
          {t.badgeHostile}
        </Badge>
        <Badge variant="outline" className="border-[var(--neon-violet)]/40">
          {t.tagForensic}
        </Badge>
        <Badge variant="outline" className="border-[var(--neon-violet)]/40">
          {t.tagBeavertail}
        </Badge>
        <Badge variant="outline" className="border-[var(--neon-violet)]/40">
          {t.tagDeceptive}
        </Badge>
      </div>
      <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
        {t.titleLead}
        <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
          {t.titleAccent}
        </span>
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {t.headerIntroPre}
        <code className="rounded bg-muted px-1 py-0.5 text-sm text-[var(--neon-magenta)]">
          ALERTE-MALWARE.md
        </code>
        {t.headerIntroMid1}
        <code className="rounded bg-muted px-1 py-0.5 text-sm text-[var(--neon-magenta)]">
          defensive-payload-analysis
        </code>
        {t.headerIntroMid2}
        Contagious Interview
        {t.headerIntroMid3}
        <strong>{t.headerIntroStrong}</strong>
      </p>
      <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
        <span className="text-[var(--neon-cyan)]">{t.metaTarget}</span>{" "}
        {t.metaTargetValue}
        <br />
        <span className="text-[var(--neon-cyan)]">{t.metaScope}</span>{" "}
        {t.metaScopeValue1}
        <code>Function</code>
        {t.metaScopeValue2}
        <code>eval</code>
        <br />
        <span className="text-[var(--neon-cyan)]">{t.metaProtocol}</span>{" "}
        {t.metaProtocolValue}
        <br />
        <span className="text-[var(--neon-cyan)]">{t.metaTools}</span>{" "}
        {t.metaToolsValue}
      </div>
    </header>
  );
}

function SanitizationNotice() {
  const t = useDict();
  return (
    <div className="mb-10 rounded-xl border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/5 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[var(--neon-cyan)]">
        <EyeOff className="h-3.5 w-3.5" />
        {t.sanitizationLabel}
      </div>
      <p className="text-sm text-foreground/90">
        {t.sanitizationPre}
        <strong>{t.sanitizationStrong}</strong>
        {t.sanitizationMid1}
        <code className="rounded bg-muted px-1 py-0.5 text-xs text-[var(--neon-magenta)]">
          [REDACTED]
        </code>{" "}
        {t.sanitizationMid2}
        <code>203.0.113.0/24</code>, <code>198.51.100.0/24</code>
        {t.sanitizationPost}
      </p>
    </div>
  );
}

/* ───────── sections ───────── */

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
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
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

function ExecSummary() {
  const t = useDict();
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
      <p className="text-sm leading-relaxed">
        {t.execSummaryPre1}
        <code>suspect-repo</code>
        {t.execSummaryStrong1}
        <strong>{t.execSummaryPre2}</strong>
        {t.execSummaryStrong2}
        <strong>{t.execSummaryMid1}</strong>
        {t.execSummaryLineLabel}
        <code>target/suspect-repo/tailwind.config.js</code>
        {t.execSummaryMid2}
        <code>890</code>
        {t.execSummaryMid3}
        <code>http://203.0.113.42:1244/s/[REDACTED-CAMPAIGN-ID]</code>
        {t.execSummaryMid4}
        <code>198.51.100.17:1244</code>
        {"), "}
        <strong>{t.execSummaryStrong3}</strong>
        {t.execSummaryPost}
        <code>nohup</code>.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge className="border-destructive/50 bg-destructive/15 text-destructive font-mono">
          {t.execConfidenceBadge}
        </Badge>
        <Badge variant="outline" className="border-[var(--neon-magenta)]/40">
          {t.execAttributionBadge}
        </Badge>
      </div>
    </div>
  );
}

function PayloadLocationTable() {
  const t = useDict();
  const rows = [
    { k: t.payloadKeyCarrier, v: t.payloadValCarrier },
    { k: t.payloadKeyLine, v: t.payloadValLine },
    { k: t.payloadKeyBlob, v: t.payloadValBlob },
    { k: t.payloadKeyVisibility, v: t.payloadValVisibility },
    { k: t.payloadKeyTechnique, v: t.payloadValTechnique },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.k} className={i === 0 ? "" : "border-t border-border"}>
              <th className="w-40 bg-muted/40 px-4 py-3 text-left align-top font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {r.k}
              </th>
              <td className="px-4 py-3 leading-relaxed">{r.v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CapabilitiesList() {
  const t = useDict();
  const items: { title: string; body: React.ReactNode; icon: React.ReactNode }[] = [
    {
      title: t.capHttpTitle,
      icon: <Network className="h-4 w-4 text-destructive" />,
      body: (
        <>
          {t.capHttpBodyPre}<code>0x96640</code>{t.capHttpBodyPost}
        </>
      ),
    },
    {
      title: t.capHostTitle,
      icon: <Fingerprint className="h-4 w-4 text-destructive" />,
      body: <>{t.capHostBody}<code>process.argv</code>, timestamp.</>,
    },
    {
      title: t.capMagicTitle,
      icon: <KeyRound className="h-4 w-4 text-destructive" />,
      body: (
        <>
          {t.capMagicBodyPre}<code>[3-BYTE-MAGIC]</code>{t.capMagicBodyPost}
        </>
      ),
    },
    {
      title: t.capStage2Title,
      icon: <FileCode className="h-4 w-4 text-destructive" />,
      body: (
        <>
          {t.capStage2BodyPre}<code>f.js</code>{t.capStage2BodyMid}<code>package.json</code>{t.capStage2BodyPost}
          <code>&lt;tmpdir&gt;/&lt;hostname&gt;/.vscode/</code>.
        </>
      ),
    },
    {
      title: t.capInstallTitle,
      icon: <FileWarning className="h-4 w-4 text-destructive" />,
      body: (
        <>
          {t.capInstallBodyPre}<code>npm i --silent</code>{t.capInstallBodyMid}
          <code>npm --prefix … i</code>{t.capInstallBodyPost}
        </>
      ),
    },
    {
      title: t.capLaunchTitle,
      icon: <Terminal className="h-4 w-4 text-destructive" />,
      body: (
        <>
          {t.capLaunchBodyPre}<code>nohup node f.js</code>{t.capLaunchBodyMid}
          <code>spawn('node', ['f.js'], {"{"}windowsHide:true{"}"})</code>{t.capLaunchBodyPost}
          <code>.unref()</code>.
        </>
      ),
    },
    {
      title: t.capStage2PayloadTitle,
      icon: <Skull className="h-4 w-4 text-destructive" />,
      body: <>{t.capStage2PayloadBody}</>,
    },
  ];
  return (
    <ol className="space-y-2">
      {items.map((it, i) => (
        <li
          key={it.title}
          className="flex items-start gap-3 rounded-lg border border-border bg-card/40 p-3"
        >
          <span className="mt-0.5 font-mono text-xs text-muted-foreground">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="mt-0.5 shrink-0">{it.icon}</span>
          <div className="flex-1">
            <div className="font-semibold">{it.title}</div>
            <p className="mt-0.5 text-sm text-foreground/90">{it.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function AttributionBlock() {
  const t = useDict();
  return (
    <>
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <div className="mb-2 text-xs font-mono font-bold uppercase tracking-wider text-destructive">
          {t.attrPrimaryLabel}
        </div>
        <p className="text-sm leading-relaxed">
          {t.attrPrimaryBodyPre}
          <strong>{t.attrPrimaryBodyStrong}</strong>
          {t.attrPrimaryBodyMid1}
          <em>{t.attrPrimaryBodyCampaignEm}</em>
          {t.attrPrimaryBodyMid2}
          <em>{t.attrPrimaryBodyPersonaEm}</em>
          {t.attrPrimaryBodyMid3}
          <em>{t.attrPrimaryBodyActorEm}</em>
          {t.attrPrimaryBodyPost}
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card/40 p-5">
        <div className="mb-3 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
          {t.attrSignaturesLabel}
        </div>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {t.attrSignatures.map((s) => (
            <li key={s} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neon-cyan)]" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--neon-magenta)]/30 bg-[var(--neon-magenta)]/5 p-5">
        <div className="mb-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--neon-magenta)]">
          {t.attrLureLabel}
        </div>
        <p className="text-sm leading-relaxed">
          {t.attrLureBodyPre}
          <code>README.md</code>
          {t.attrLureBodyPost1}
          <em>{t.attrLureBodyQuote}</em>
          {t.attrLureBodyPost2}
          <code>npm install</code>
          {t.attrLureBodyPost3}
          <code>npm start</code>
          {", "}
          <em>{t.attrLureBodySessionEm}</em>
          {t.attrLureBodyPost4}
          <code>[REDACTED-PERSONA-A]</code>, <code>[REDACTED-PERSONA-B]</code>,{" "}
          <code>[REDACTED-PERSONA-C]</code>.
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-muted/30 p-5">
        <div className="mb-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
          {t.attrAltLabel}
        </div>
        <p className="text-sm text-foreground/90">{t.attrAltBody}</p>
      </div>
    </>
  );
}

function IoCTable() {
  const t = useDict();
  const rows: { k: string; v: React.ReactNode; note?: string }[] = [
    { k: t.iocKeyC2Primary, v: <code>203.0.113.42:1244</code>, note: t.iocNoteRedacted1 },
    { k: t.iocKeyC2Secondary, v: <code>198.51.100.17:1244</code>, note: t.iocNoteRedacted2 },
    { k: t.iocKeyBeaconGet, v: <code>/s/[REDACTED-CAMPAIGN-ID]</code> },
    { k: t.iocKeyStage2Get, v: <code>/p</code> },
    { k: t.iocKeyAuxGet, v: <code>/f/</code> },
    { k: t.iocKeyMagicBytes, v: <code>{t.iocMagicBytesValue}</code> },
    { k: t.iocKeyXorKey, v: <code>[0xNN, 0xNN, 0xNN, 0xNN]</code> },
    { k: t.iocKeyHashGuard, v: <code>0xNNNNN</code> },
    { k: t.iocKeyDropFolder, v: <code>&lt;tmpdir&gt;/&lt;hostname&gt;/.vscode/</code> },
    { k: t.iocKeyDroppedFiles, v: <><code>f.js</code>, <code>package.json</code></> },
    {
      k: t.iocKeyShellCmds,
      v: (
        <>
          <code>cd &quot;&lt;drop&gt;&quot; &amp;&amp; npm i --silent</code>
          <br />
          <code>npm --prefix &quot;&lt;drop&gt;&quot; i</code>
        </>
      ),
    },
    { k: t.iocKeyCampaignId, v: <code>[REDACTED-12-HEX]</code> },
    { k: t.iocKeyBeaconInterval, v: <><code>0x96640</code>{t.iocBeaconIntervalValueSuffix}</> },
    { k: t.iocKeyFamily, v: <>{t.iocFamilyValue}</> },
  ];
  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="w-52 px-4 py-2 text-left font-semibold">{t.iocColType}</th>
              <th className="px-4 py-2 text-left font-semibold">{t.iocColValue}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.k} className={i === 0 ? "" : "border-t border-border"}>
                <td className="px-4 py-3 align-top font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {r.k}
                </td>
                <td className="px-4 py-3 align-top text-sm leading-relaxed">
                  {r.v}
                  {r.note && (
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {r.note}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {t.iocFootnotePre}
        <code>forensic/&lt;target&gt;/04-iocs.md</code>
        {t.iocFootnotePost}
      </p>
    </>
  );
}

function ImmediateActions() {
  const t = useDict();
  return (
    <>
      <div className="rounded-xl border border-[var(--neon-magenta)]/30 bg-[var(--neon-magenta)]/5 p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--neon-magenta)]">
          <Unplug className="h-4 w-4" />
          {t.quarantineLabel}
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <Flame className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <span>
              {t.quarantineLine1Pre}
              <code>target/suspect-repo/</code>{" "}
              {"· "}
              <strong>{t.quarantineLine1Strong}</strong>
              {t.quarantineLine1Post}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <span>
              {t.quarantineLine2Pre}
              <code>npm install</code>
              {t.quarantineLine2Mid}
              <code>npm start</code>
              {t.quarantineLine2Post}
            </span>
          </li>
        </ul>
        <ol className="mt-3 space-y-2 pl-5 text-sm sm:pl-7">
          {t.quarantineSteps.map((s, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-5 font-mono text-xs text-[var(--neon-magenta)] sm:-left-6">
                {i + 1}.
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-destructive">
          <KeyRound className="h-4 w-4" />
          {t.secretsLabel}
        </div>
        <p className="text-sm leading-relaxed">
          {t.secretsBodyPre}
          <code>target/suspect-repo/backend/production.env</code>
          {t.secretsBodyMid1}
          <strong>{t.secretsBodyStrong}</strong>
          {t.secretsBodyPost}
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-muted-foreground">—</span>
            <span>
              <strong>{t.secretsSmtpStrong}</strong>
              {t.secretsSmtpUserLabelPre}
              <code>[REDACTED-USER]</code>
              {t.secretsSmtpMid}
              <code>[REDACTED-PASS]</code>
              {t.secretsSmtpPost}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-muted-foreground">—</span>
            <span>
              <strong>{t.secretsGmailStrong}</strong>
              {t.secretsGmailPre}
              <code>[REDACTED-GMAIL]</code> / <code>[REDACTED-APP-PASSWORD]</code>
              {t.secretsGmailPost}
            </span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">{t.secretsFoot}</p>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--neon-cyan)]">
          <Radar className="h-4 w-4" />
          {t.huntingLabel}
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-muted-foreground">—</span>
            <span>
              {t.huntingLine1Pre}
              <code>04-iocs.md</code>
              {t.huntingLine1Post}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-muted-foreground">—</span>
            <span>{t.huntingLine2}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-muted-foreground">—</span>
            <span>{t.huntingLine3}</span>
          </li>
        </ul>
      </div>
    </>
  );
}

function ClosureChecklist() {
  const t = useDict();
  const items = t.closureItems;
  return (
    <ul className="space-y-2">
      {items.map((s, i) => (
        <li
          key={i}
          className="flex items-start gap-3 rounded-lg border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 p-3 text-sm"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--neon-cyan)]" />
          <span>{s}</span>
        </li>
      ))}
    </ul>
  );
}

function ReferencesBlock() {
  const t = useDict();
  const internalPaths = [
    "forensic/suspect-repo/ALERTE-MALWARE.md",
    "forensic/suspect-repo/01-inventory.md",
    "forensic/suspect-repo/02-signature.md",
    "forensic/suspect-repo/03-payload.md",
    "forensic/suspect-repo/04-iocs.md",
    ".claude/skills/defensive-payload-analysis/references/signatures.md",
  ];
  const internal = internalPaths.map((path, i) => ({
    path,
    note: t.refInternalNotes[i] ?? "",
  }));
  return (
    <>
      <div className="rounded-xl border border-border bg-card/40 p-5">
        <div className="mb-3 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
          {t.refInternalTitle}
        </div>
        <ul className="space-y-2 text-sm">
          {internal.map((r) => (
            <li key={r.path} className="flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neon-cyan)]" />
              <div className="flex-1">
                <code className="font-mono text-[var(--neon-cyan)]">
                  {r.path}
                </code>
                <div className="text-xs text-muted-foreground">{r.note}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 rounded-xl border border-border bg-muted/30 p-5">
        <div className="mb-3 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
          {t.refExternalTitle}
        </div>
        <ul className="space-y-1.5 text-sm">
          {t.refExternalItems.map((r) => (
            <li key={r} className="flex items-start gap-2">
              <span className="mt-0.5 text-muted-foreground">—</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/* ───────── footer/CTA ───────── */

function CTASection() {
  const t = useDict();
  return (
    <section className="my-8 rounded-2xl border border-[var(--neon-cyan)]/40 bg-gradient-to-br from-[var(--neon-cyan)]/10 via-[var(--neon-violet)]/10 to-[var(--neon-magenta)]/10 p-8 text-center">
      <ShieldAlert className="mx-auto h-10 w-10 text-[var(--neon-cyan)]" />
      <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
        {t.ctaTitle}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
        {t.ctaBodyPre}
        <code>target/</code>
        {t.ctaBodyMid1}
        <code className="rounded bg-muted px-1 py-0.5 text-xs text-[var(--neon-magenta)]">
          /defensive-payload-analysis
        </code>
        {t.ctaBodyPost}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button
          asChild
          className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] font-bold text-background hover:opacity-90"
        >
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            <Github className="mr-2 h-4 w-4" />
            {t.ctaGithub}
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link to="/commands">
            <Terminal className="mr-2 h-4 w-4" />
            {t.ctaCommands}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/reports/example-summary">
            <FileSearch className="mr-2 h-4 w-4" />
            {t.ctaSummary}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/playbook">{t.ctaPlaybook}</Link>
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  const t = useDict();
  return (
    <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
      {t.footerPre}
      <a
        href="https://zonova.io"
        className="text-[var(--neon-cyan)] underline"
        target="_blank"
        rel="noreferrer"
      >
        ZONOVA RESEARCH
      </a>
      {t.footerPost}
    </footer>
  );
}
