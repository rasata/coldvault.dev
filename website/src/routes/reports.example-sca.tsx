import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
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

const PAGE_TITLE =
  "Example ColdVault report — Manual SCA on pro_lmng (no committed lockfile)";
const PAGE_DESCRIPTION =
  "A sanitised excerpt of a real Software Composition Analysis produced by ColdVault against a DeceptiveDevelopment-style Web3 repository — 11 high-risk dependencies, 11 unmaintained/typo-squat candidates, and a lockfile gap that blocks reproducibility.";

export const Route = createFileRoute("/reports/example-sca")({
  component: ExampleSCAPage,
});

function ExampleSCAPage() {
  useEffect(() => {
    document.title = PAGE_TITLE;
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
    setMeta('meta[name="description"]', "name", "description", PAGE_DESCRIPTION);
    setMeta(
      'meta[property="og:title"]',
      "property",
      "og:title",
      "Example ColdVault report — Manual SCA",
    );
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      PAGE_DESCRIPTION,
    );
    setMeta('meta[property="og:type"]', "property", "og:type", "article");
  }, []);

  return (
    <div className="min-h-screen bg-grid">
      <ReportNav />
      <main className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6">
        <ReportHeader />
        <Scorecard />
        <BlockingIssue />

        <Section
          n="1"
          title="High-risk declared dependencies"
          subtitle="backend/package.json"
          icon={<ShieldAlert className="h-5 w-5" />}
        >
          <RiskTable rows={backendHighRisk} />
        </Section>

        <Section
          n="2"
          title="Unmaintained / low-popularity / typo-squat candidates"
          subtitle="Supply-chain canaries"
          icon={<PackageX className="h-5 w-5" />}
        >
          <p className="mb-4 text-sm text-muted-foreground">
            None of these are critical by themselves, but the <em>pattern</em>{" "}
            — a handful of 2012-era one-off packages, placeholder versions like{" "}
            <code>0.0.0</code>, and registry-placeholder deps like{" "}
            <code>fs@0.0.1-security</code> — is a strong signal that the{" "}
            <code>package.json</code> was assembled carelessly, or padded to
            blend payloads in.
          </p>
          <RiskTable rows={suspiciousDeps} />
        </Section>

        <Section
          n="3"
          title="Frontend dependencies"
          subtitle="pro_lmng/package.json"
          icon={<Package className="h-5 w-5" />}
        >
          <RiskTable rows={frontendDeps} />
        </Section>

        <Section
          n="4"
          title="Postinstall / lifecycle hooks"
          icon={<Terminal className="h-5 w-5" />}
        >
          <Callout tone="info" title="No explicit install-time hooks — inconclusive">
            Neither <code>pro_lmng/package.json</code> nor{" "}
            <code>backend/package.json</code> declare <code>postinstall</code>{" "}
            / <code>preinstall</code> / <code>install</code> scripts.
            Transitive hooks cannot be enumerated without installing —
            deliberately <strong>not</strong> performed per ColdVault's{" "}
            <code>CLAUDE.md §0</code> (zero-execution rule on{" "}
            <code>target/</code>).
          </Callout>
        </Section>

        <Section
          n="5"
          title="Registry origin"
          icon={<FileSearch className="h-5 w-5" />}
        >
          <Callout tone="good" title="No unusual origins detected">
            All dependencies are declared with semver ranges — no{" "}
            <code>git+</code>, <code>github:</code>, <code>file:</code>, or{" "}
            <code>http:</code> URL deps. <code>.npmrc</code> contains no{" "}
            <code>@scope:registry=</code> overrides. Default registry{" "}
            (<code>registry.npmjs.org</code>) is assumed.
          </Callout>
        </Section>

        <Section
          n="6"
          title="Recommendation summary"
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

const backendHighRisk: RiskRow[] = [
  {
    name: "request",
    version: "^2.88.2",
    severity: "HIGH",
    note: "Deprecated since 2020. CVE-2023-28155 (SSRF via follow-redirects). No upstream fixes forthcoming. Used in both backend and frontend.",
  },
  {
    name: "xlsx",
    version: "^0.18.5",
    severity: "HIGH",
    note: "CVE-2023-30533 prototype pollution; CVE-2024-22363 ReDoS. SheetJS was removed from npm; installing via npm registry returns abandoned 0.18.5. Replacement requires xlsx-js-style or direct SheetJS CDN.",
  },
  {
    name: "crypto-js",
    version: "^4.2.0",
    severity: "HIGH",
    note: "4.2.0 fixes CVE-2023-46233 (PBKDF1 insecure). Caret permits upgrades, but the code uses deliberately weak parameters — PBKDF2 with 100 iterations (app.js:12, register.controller.js:700). Library is deprecated in favour of WebCrypto / crypto-browserify.",
  },
  {
    name: "ethereumjs-util",
    version: "^7.1.5",
    severity: "HIGH",
    note: "Deprecated. Replaced by @ethereumjs/util 9.x. Security fixes no longer backported.",
  },
  {
    name: "mysql",
    version: "^2.18.1",
    severity: "HIGH",
    note: "Declared alongside mysql2 ^3.11.5; utils/connection.js uses the legacy mysql driver while the pools elsewhere use mysql2. Known SQLi hazards with string interpolation (see SAST findings).",
  },
  {
    name: "tronweb",
    version: "^6.0.4",
    severity: "MED",
    note: "Recent — caret permits 6.x; earlier 5.x had a grpc vuln, 6.x OK. Still verify integrity.",
  },
  {
    name: "xrpl",
    version: "^3.1.0",
    severity: "LOW",
    note: "OK today; large npm dep. Keep under SCA watch.",
  },
  {
    name: "formidable",
    version: "^3.5.1",
    severity: "LOW",
    note: "CVE-2022-29622 (path traversal) fixed in 2.x / 3.x. No known unfixed vulns at 3.5.1.",
  },
  {
    name: "adm-zip",
    version: "^0.5.10",
    severity: "MED",
    note: "CVE-2024-48948 / CVE-2018-1002204 zip-slip class. Caret permits 0.5.10 which includes fixes; verify after install.",
  },
  {
    name: "jsonwebtoken",
    version: "^9.0.2",
    severity: "HIGH",
    note: "9.x fixes known signature-confusion bugs. Safe only if JWT_SECRET_KEY is set — here it is empty string.",
  },
  {
    name: "multer",
    version: "^2.0.0",
    severity: "MED",
    note: "Multer 2 is a fresh major; fewer historical audits. Upload path in routes.js uses unsafe filetype derivation.",
  },
];

const suspiciousDeps: RiskRow[] = [
  {
    name: "blob",
    version: "0.1.0",
    severity: "MED",
    note: "2012 package, deprecated. Unnecessary in modern Node.",
  },
  {
    name: "fs",
    version: "0.0.1-security",
    severity: "HIGH",
    note: "The registry placeholder. Including it is a code-smell; likely a copy-paste error. Treat as benign but a sign the repo was generated carelessly — or a cover for an fs-shadowing payload.",
  },
  {
    name: "execp",
    version: "0.0.1",
    severity: "HIGH",
    note: "Single-version package, 10 weekly downloads. High supply-chain risk.",
  },
  {
    name: "reverse-string",
    version: "0.0.6",
    severity: "MED",
    note: "Tiny 2015 package — consider a typo-squat vector.",
  },
  {
    name: "ethereum-address",
    version: "0.0.4",
    severity: "HIGH",
    note: "Last published 2017. Plausibly typo-squatted. Name resembles legitimate ethereum-address-validator.",
  },
  {
    name: "send-crypto",
    version: "0.0.0",
    severity: "HIGH",
    note: "Version string 0.0.0 is unusual and denotes 'not-released'. Verify author before trusting.",
  },
  {
    name: "validate-phone-number-node-js",
    version: "0.0.1",
    severity: "MED",
    note: "Low popularity, pinned exact.",
  },
  {
    name: "nodejs-base64",
    version: "^2.0.0",
    severity: "LOW",
    note: "Not actively maintained. btoa is built-in in Node 16+.",
  },
  {
    name: "referral-code-generator",
    version: "^1.0.8",
    severity: "LOW",
    note: "Small package, not security-audited.",
  },
  {
    name: "image-thumbnail",
    version: "^1.0.13",
    severity: "HIGH",
    note: "Shell-invokes ImageMagick — potential RCE if user filenames flow through. Cross-reference SAST output for shell-arg injection paths.",
  },
  {
    name: "probe-image-size",
    version: "^7.2.3",
    severity: "MED",
    note: "Makes outbound HTTP requests; SSRF risk if user URLs flow through.",
  },
];

const frontendDeps: RiskRow[] = [
  {
    name: "@walletconnect/ethereum-provider",
    version: "1.8.0",
    severity: "HIGH",
    note: "WalletConnect v1 was deprecated in June 2023 and officially sunset. v1 relays have been shut down. Keeping v1 in production means wallet connections will fail and third-party relay infrastructure is untrusted.",
  },
  {
    name: "request",
    version: "^2.88.2",
    severity: "HIGH",
    note: "Same as backend — deprecated. Odd to bundle it into a CRA frontend build.",
  },
  {
    name: "react-scripts",
    version: "5.0.1",
    severity: "MED",
    note: "Numerous transitive advisories via postcss, terser, nth-check. CRA is unmaintained since 2023.",
  },
  {
    name: "@web3-react/*",
    version: "8.0.x-beta.*",
    severity: "MED",
    note: "Pre-release betas used in production. Breaking-change window — unusual for a claimed $6.5M-backed platform.",
  },
  {
    name: "react-custom-roulette",
    version: "^1.4.1",
    severity: "INFO",
    note: "Implies a gambling / spin-the-wheel UI in a staking app — product-risk, not code-risk.",
  },
  {
    name: "buffer, fs",
    version: "—",
    severity: "MED",
    note: "Redundant in a browser bundle; indicates shim leakage from Node code.",
  },
];

const blocks: { pkg: string; action: string; replacement?: string }[] = [
  { pkg: "request", action: "Remove", replacement: "undici / native fetch" },
  {
    pkg: "xlsx",
    action: "Replace",
    replacement: "xlsx-js-style or direct SheetJS CDN",
  },
  {
    pkg: "ethereumjs-util",
    action: "Replace",
    replacement: "@ethereumjs/util 9.x",
  },
  { pkg: "blob", action: "Remove" },
  { pkg: "fs", action: "Remove (registry placeholder)" },
  { pkg: "execp", action: "Remove" },
  { pkg: "reverse-string", action: "Remove" },
  { pkg: "ethereum-address", action: "Remove" },
  { pkg: "send-crypto", action: "Remove (0.0.0 placeholder)" },
  { pkg: "validate-phone-number-node-js", action: "Remove" },
  { pkg: "nodejs-base64", action: "Remove (use built-in)" },
  {
    pkg: "WalletConnect v1",
    action: "Upgrade",
    replacement: "@walletconnect/ethereum-provider v2",
  },
];

const investigate: { pkg: string; question: string }[] = [
  {
    pkg: "image-thumbnail",
    question:
      "Trace usage path — shell-arg injection via user filenames?",
  },
  {
    pkg: "probe-image-size",
    question: "Do user-supplied URLs flow into it? SSRF risk.",
  },
];

/* ───────── components ───────── */

function ReportNav() {
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
            <Link to="/blog/anatomy-of-a-deceptive-developer-attack">
              Case study
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function ReportHeader() {
  return (
    <header className="mb-10">
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge className="bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] border-[var(--neon-cyan)]/40 font-mono">
          Example report
        </Badge>
        <Badge variant="outline" className="border-[var(--neon-violet)]/40">
          #SCA
        </Badge>
        <Badge variant="outline" className="border-[var(--neon-violet)]/40">
          #supply-chain
        </Badge>
        <Badge variant="outline" className="border-[var(--neon-violet)]/40">
          #web3
        </Badge>
      </div>
      <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
        Manual SCA —{" "}
        <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
          no lockfile present
        </span>
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Sanitised excerpt of a real ColdVault audit against a{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-sm text-[var(--neon-magenta)]">
          DeceptiveDevelopment
        </code>
        -style Web3 repository. Reproduced here so you can see the shape of what
        lands in <code>reports/</code> after <code>/audit</code>.
      </p>
      <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
        <span className="text-[var(--neon-cyan)]">target:</span>{" "}
        bitbucket.org/teamincwork/pro_lmng
        <br />
        <span className="text-[var(--neon-cyan)]">scan:</span> manual SCA
        (osv-scanner, trivy, syft, grype — no lockfile → all returned empty)
        <br />
        <span className="text-[var(--neon-cyan)]">source:</span>{" "}
        backend/package.json + pro_lmng/package.json declared ranges
        <br />
        <span className="text-[var(--neon-cyan)]">status:</span>{" "}
        <span className="text-destructive">BLOCK — do not deploy</span>
      </div>
    </header>
  );
}

function Scorecard() {
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
        label="High-severity"
        value={counts.high}
        hint="Exploitable under realistic conditions"
      />
      <ScoreCard
        tone="med"
        label="Medium"
        value={counts.med}
        hint="Exploitable under specific conditions"
      />
      <ScoreCard
        tone="low"
        label="Low"
        value={counts.low}
        hint="Defense-in-depth"
      />
      <ScoreCard
        tone="info"
        label="Informational"
        value={counts.info}
        hint="Product / non-security"
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
  return (
    <div className="mb-10 overflow-hidden rounded-2xl border-2 border-destructive/50 bg-gradient-to-br from-destructive/10 to-[var(--neon-magenta)]/5">
      <div className="flex items-start gap-4 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/20">
          <Ban className="h-6 w-6 text-destructive" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-destructive">
            Blocking finding
          </div>
          <h2 className="mt-1 font-display text-xl font-bold sm:text-2xl">
            No lockfile committed — <code>.gitignore</code> excludes{" "}
            <code>package-lock.json</code> and <code>yarn.lock</code>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            Without a lockfile, every <code>npm install</code> resolves
            floating transitive trees, making reproducibility and SCA
            impossible. Every tool ColdVault ran (<code>osv-scanner</code>,{" "}
            <code>trivy fs</code>, <code>syft</code>, <code>grype</code>)
            returned <strong>empty</strong> — they had nothing to parse.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            <strong className="text-destructive">Required before deploy:</strong>{" "}
            remove the <code>.gitignore</code> entries, run{" "}
            <code>npm install</code> in a sandbox, commit the resulting{" "}
            <code>package-lock.json</code>, then re-run the SCA. Ranges below
            are declared-only; a real lockfile resolution could make specific
            pins <em>worse</em> than shown here.
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
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="w-[22%] px-3 py-2 text-left font-semibold">
                Package
              </th>
              <th className="w-[14%] px-3 py-2 text-left font-semibold">
                Declared
              </th>
              <th className="w-[8%] px-3 py-2 text-left font-semibold">Sev</th>
              <th className="px-3 py-2 text-left font-semibold">Risk</th>
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
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border-2 border-destructive/50 bg-destructive/5 p-5">
        <div className="mb-3 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-destructive">
          <Ban className="h-4 w-4" />
          Block deploy until fixed
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-destructive">•</span>
            <span>
              Commit a <code className="rounded bg-muted px-1 py-0.5 text-xs text-[var(--neon-magenta)]">package-lock.json</code>{" "}
              and remove the <code className="rounded bg-muted px-1 py-0.5 text-xs text-[var(--neon-magenta)]">.gitignore</code>{" "}
              entries that exclude it.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-destructive">•</span>
            <span>
              Re-run the SCA against the committed lockfile — declared-only
              ranges can hide worse transitive pins.
            </span>
          </li>
        </ul>
      </div>

      <div className="rounded-xl border-2 border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/5 p-5">
        <div className="mb-3 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-[var(--neon-cyan)]">
          <PackageX className="h-4 w-4" />
          Remove or replace
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
                {b.action}
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
          Investigate (data-flow into these sinks)
        </div>
        <ul className="space-y-2 text-sm">
          {investigate.map((i) => (
            <li key={i.pkg} className="flex items-start gap-3">
              <span className="mt-0.5 font-mono text-xs text-[var(--neon-magenta)]">
                {i.pkg}
              </span>
              <span className="text-foreground/90">{i.question}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AnalystNote() {
  return (
    <aside className="mt-12 rounded-2xl border border-[var(--neon-violet)]/40 bg-gradient-to-br from-[var(--neon-violet)]/10 to-[var(--neon-cyan)]/5 p-6">
      <div className="mb-2 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-[var(--neon-violet)]">
        <AlertTriangle className="h-4 w-4" />
        What this report is — and is not
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">
        This is a <strong>declared-range SCA</strong>, not a full audit. The
        companion passes (<code>scan-secrets</code>, <code>scan-sast</code>,{" "}
        <code>scan-malware</code>, <code>scan-iac</code>) produce their own
        findings — SAST flagged the <code>mysql</code>-vs-<code>mysql2</code>{" "}
        string-interpolation SQLi path, malware triage confirmed one
        dependency shadowing Node's <code>fs</code> at require-time. Read
        everything end-to-end before making a decision. The lockfile gap
        alone is already reason to stop.
      </p>
    </aside>
  );
}

function CTASection() {
  return (
    <section className="mt-12">
      <div className="relative overflow-hidden rounded-3xl border border-border glass p-8 text-center">
        <div className="absolute -top-20 left-1/2 h-40 w-[120%] -translate-x-1/2 bg-gradient-to-r from-[var(--neon-cyan)]/20 via-[var(--neon-violet)]/20 to-[var(--neon-magenta)]/20 blur-3xl" />
        <Terminal className="mx-auto h-10 w-10 text-[var(--neon-cyan)]" />
        <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
          Run this against{" "}
          <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
            your own suspect repo
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Clone ColdVault, attach the target as a read-only submodule, and ask
          Claude Code to run <code>/audit</code>. Five minutes later you have
          a report like the one above — plus secrets, SAST, malware, and IaC
          passes.
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
            <Link to="/blog/anatomy-of-a-deceptive-developer-attack">
              Read the case study
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/playbook">Open the Playbook</Link>
          </Button>
        </div>
      </div>
    </section>
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
        . Example artefact — reproduced under the ColdVault zero-execution
        protocol. MIT-licensed source.
      </p>
    </footer>
  );
}
