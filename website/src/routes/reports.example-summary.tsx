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

const REPO_URL = "https://github.com/rasata/coldvault.dev";

const PAGE_TITLE =
  "Example ColdVault report — Security Audit Summary (NO-GO verdict, 16 findings)";
const PAGE_DESCRIPTION =
  "Full SUMMARY.md produced by a ColdVault audit against a DeceptiveDevelopment-style Web3 repository: 11 HIGH + 5 MEDIUM findings, a five-finding kill chain from anonymous traffic to treasury drain, and a NO-GO verdict.";

export const Route = createFileRoute("/reports/example-summary")({
  component: ExampleSummaryPage,
});

function ExampleSummaryPage() {
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
      "Example ColdVault audit — SUMMARY.md",
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
        <Verdict />
        <KillChain />
        <FindingCounts />

        <Section
          n="1"
          title="High-severity findings"
          subtitle="11 × HIGH — any one alone breaks the application"
          icon={<ShieldAlert className="h-5 w-5" />}
        >
          <FindingTable rows={highFindings} tone="high" />
        </Section>

        <Section
          n="2"
          title="Medium-severity findings"
          subtitle="5 × MEDIUM — exploitable under specific conditions"
          icon={<ShieldX className="h-5 w-5" />}
        >
          <FindingTable rows={medFindings} tone="med" />
        </Section>

        <Section
          n="3"
          title="What was NOT flagged"
          subtitle="Per CLAUDE.md §3 exclusions — noise control"
          icon={<FileSearch className="h-5 w-5" />}
        >
          <ExclusionsNote />
        </Section>

        <Section
          n="4"
          title="Recommended immediate actions"
          subtitle="Triage order — do #1 now, not after the rewrite"
          icon={<Siren className="h-5 w-5" />}
        >
          <ImmediateActions />
          <ThenTheRewrite />
        </Section>

        <Section
          n="5"
          title="Supply-chain attestation"
          subtitle="Declared-only — no lockfile committed"
          icon={<Package className="h-5 w-5" />}
        >
          <SupplyChainNote />
        </Section>

        <Section
          n="6"
          title="Prompt-injection resistance"
          subtitle="Static-only protocol upheld"
          icon={<Lock className="h-5 w-5" />}
        >
          <PromptInjectionNote />
        </Section>

        <Section
          n="7"
          title="Artifacts"
          subtitle="What ColdVault writes to reports/"
          icon={<FileText className="h-5 w-5" />}
        >
          <Artifacts />
        </Section>

        <CTASection />
        <Footer />
      </main>
    </div>
  );
}

/* ───────── data ───────── */

type Severity = "HIGH" | "MED";

interface Finding {
  n: number;
  category: string;
  location: string;
  impact: string;
  icon: React.ComponentType<{ className?: string }>;
}

const highFindings: Finding[] = [
  {
    n: 1,
    category: "Broken authentication",
    location: "backend/config.js:7",
    impact: "Total auth bypass via empty JWT_SECRET_KEY",
    icon: KeyRound,
  },
  {
    n: 2,
    category: "Broken access control",
    location: "backend/routes/routes.js:96-104",
    impact: "Seven admin endpoints reachable unauthenticated",
    icon: ShieldX,
  },
  {
    n: 3,
    category: "SQL injection",
    location: "backend/models/admin.model.js:28",
    impact: "Arithmetic injection → mint token_balance",
    icon: Database,
  },
  {
    n: 4,
    category: "SQL injection",
    location: "backend/models/admin.model.js:15",
    impact: "Mass-approve withdrawals",
    icon: Database,
  },
  {
    n: 5,
    category: "SQL injection (pervasive)",
    location: "backend/models/user.model.js (39 sinks)",
    impact: "Dump users, mint balances, rewrite tx",
    icon: Database,
  },
  {
    n: 6,
    category: "SQL injection",
    location: "backend/app.js:106,147",
    impact: "Socket.IO untrusted client → SQL",
    icon: Database,
  },
  {
    n: 7,
    category: "Broken access control",
    location: "backend/routes/webhooks.routes.js:5",
    impact: "Unauth mint of MBUSD_balance",
    icon: Webhook,
  },
  {
    n: 8,
    category: "Sensitive data exposure",
    location: "backend/controllers/register.controller.js:629",
    impact: "Treasury private key over plaintext HTTP",
    icon: Network,
  },
  {
    n: 9,
    category: "Business-logic flaw",
    location: "backend/controllers/admin.controller.js:59",
    impact: "Reject-refund without prior debit → mint",
    icon: AlertTriangle,
  },
  {
    n: 10,
    category: "Secrets in source",
    location: "backend/production.env:7",
    impact: "Cleartext Mailtrap + Gmail creds in repo",
    icon: KeyRound,
  },
  {
    n: 11,
    category: "Sensitive data exposure",
    location: "backend/app.js:60-88",
    impact: "Unauth /test oracle + weak PBKDF2 format disclosure",
    icon: FileCode,
  },
];

const medFindings: Finding[] = [
  {
    n: 12,
    category: "Path traversal",
    location: "backend/routes/routes.js:127",
    impact:
      "getImage exports path.resolve(cwd,'uploads',req.params.image) → arbitrary file read if wired",
    icon: FileCode,
  },
  {
    n: 13,
    category: "Insecure default",
    location: "backend/app.js:58, routes.js:15",
    impact: "Wildcard CORS",
    icon: ShieldX,
  },
  {
    n: 14,
    category: "Weak cryptography",
    location: "backend/controllers/register.controller.js:12",
    impact: "PBKDF2 iterations=100 on treasury wrapper",
    icon: KeyRound,
  },
  {
    n: 15,
    category: "Secrets in source",
    location: "backend/config.js:2",
    impact: "Hardcoded MySQL host 13.233.12.75 (AWS ap-south-1)",
    icon: Database,
  },
  {
    n: 16,
    category: "Vulnerable dependencies",
    location: "backend/package.json:44,9,24,54 + no lockfile",
    impact: "request, xlsx, ethereumjs-util, WalletConnect v1",
    icon: Package,
  },
];

const killChain = [
  {
    n: 1,
    title: "Empty JWT secret",
    loc: "config.js:7",
    body: (
      <>
        <code>JWT_SECRET_KEY: ''</code>. Every token is forgeable by any
        caller.
      </>
    ),
  },
  {
    n: 2,
    title: "Unauthenticated admin routes",
    loc: "routes/routes.js:96-104",
    body: (
      <>
        Seven admin endpoints (<code>approvewithdrawrequest</code>,{" "}
        <code>rejectwithdrawrequest</code>, <code>getuserlist</code>, …)
        registered with no auth middleware.
      </>
    ),
  },
  {
    n: 3,
    title: "SQL injection in every legacy model",
    loc: "user.model.js + admin.model.js",
    body: (
      <>
        39 template-literal SQL sites, reached from both unauthenticated and
        pseudo-authenticated routes.
      </>
    ),
  },
  {
    n: 4,
    title: "Unauthenticated deposit webhook",
    loc: "routes/webhooks.routes.js:5",
    body: (
      <>
        <code>POST /api/v1/webhooks/bsc/deposit-confirmed</code> credits{" "}
        <code>users.MBUSD_balance</code> with an attacker-supplied amount. No
        signature, no IP allow-list, no idempotency.
      </>
    ),
  },
  {
    n: 5,
    title: "Treasury private key over plaintext HTTP",
    loc: "register.controller.js:629",
    body: (
      <>
        <code>
          fetch('http://blockchainexpert.co.in:7003/api/bep20/mainnet/transfer',
          …)
        </code>{" "}
        POSTs the decrypted treasury private key in JSON on every withdrawal.
      </>
    ),
  },
];

const artifacts = [
  {
    path: "reports/findings.json",
    note: "structured findings, Anthropic security-review schema",
    tone: "primary",
  },
  {
    path: "reports/00-context.md",
    note: "audit context — languages, entry points, immediate flags",
  },
  {
    path: "reports/sca-manual.md",
    note: "declared-dependency risk review (no lockfile to scan)",
    link: true,
  },
  {
    path: "reports/sca-osv.sarif, sca-trivy.sarif",
    note: "empty (no lockfile)",
    muted: true,
  },
  {
    path: "reports/secrets-gitleaks.sarif, secrets-gitleaks-history.sarif",
    note: "gitleaks ran, zero matches — plaintext SMTP/Gmail creds caught manually",
  },
  {
    path: "reports/yara-matches.txt",
    note: "empty (no binary artifacts in source tree)",
    muted: true,
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
            <Link to="/reports/example-sca">SCA detail</Link>
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
        ColdVault —{" "}
        <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
          Security Audit Summary
        </span>
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The top-level <code className="rounded bg-muted px-1 py-0.5 text-sm text-[var(--neon-magenta)]">SUMMARY.md</code>{" "}
        ColdVault produces after a full <code>/audit</code> run — the one you
        hand to stakeholders. Verdict, chained kill chain, 16 findings,
        triage-ordered remediation.
      </p>
      <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
        <span className="text-[var(--neon-cyan)]">target:</span>{" "}
        target/pro_lmng @ 9950580 — "ADMIN-321890: extracted ADMIN module"
        <br />
        <span className="text-[var(--neon-cyan)]">scope:</span> full repository
        — frontend pro_lmng/ (React CRA) + backend backend/ (Express/Socket.IO)
        <br />
        <span className="text-[var(--neon-cyan)]">protocol:</span> static-only
        (CLAUDE.md §0) — no install, no run, no outbound URL followed
        <br />
        <span className="text-[var(--neon-cyan)]">tools:</span> Semgrep,
        YARA, gitleaks, trufflehog, osv-scanner, trivy fs, grype, syft,
        manual review
      </div>
    </header>
  );
}

function Verdict() {
  return (
    <div className="mb-10 overflow-hidden rounded-2xl border-2 border-destructive/50 bg-gradient-to-br from-destructive/10 via-[var(--neon-magenta)]/5 to-background">
      <div className="flex items-start gap-4 p-6 sm:p-8">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-destructive/20">
          <Ban className="h-7 w-7 text-destructive" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-destructive">
            Verdict
          </div>
          <h2 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
            NO-GO
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/90">
            This application must <strong>not</strong> be deployed in its
            current state, and the current production deployment (if any)
            should be treated as <strong>already compromised</strong>.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            Five findings are independently sufficient to cause total loss of
            customer funds. Together they chain into an end-to-end path from
            anonymous Internet traffic to draining the treasury wallet.
          </p>
        </div>
      </div>
    </div>
  );
}

function KillChain() {
  return (
    <div className="mb-12">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-destructive/30 to-[var(--neon-magenta)]/30 text-destructive">
          <Zap className="h-5 w-5" />
        </span>
        <div>
          <div className="font-mono text-xs text-muted-foreground">Kill chain</div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Anonymous traffic → treasury drain
          </h2>
        </div>
      </div>

      <ol className="relative space-y-4">
        <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-destructive via-[var(--neon-magenta)] to-destructive" />
        {killChain.map((step) => (
          <li key={step.n} className="relative flex gap-4">
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-destructive bg-background font-mono text-sm font-bold text-destructive">
              {step.n}
            </div>
            <div className="flex-1 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display font-bold text-foreground">
                  {step.title}
                </h3>
                <code className="rounded bg-muted px-2 py-0.5 text-xs text-[var(--neon-magenta)]">
                  {step.loc}
                </code>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-[var(--neon-magenta)]">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 p-5">
        <div className="mb-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--neon-cyan)]">
          What each step buys an unauthenticated attacker
        </div>
        <ul className="space-y-1.5 text-sm">
          <li className="flex items-start gap-2">
            <span className="font-mono text-xs text-[var(--neon-cyan)]">#1</span>
            <span>Forge an admin JWT and call protected v1 endpoints.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono text-xs text-[var(--neon-cyan)]">#2</span>
            <span>Bypass the need for auth entirely on the legacy admin surface.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono text-xs text-[var(--neon-cyan)]">#3</span>
            <span>Dump the users table, mint balances, rewrite transactions.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono text-xs text-[var(--neon-cyan)]">#4</span>
            <span>
              Mint arbitrary <code className="rounded bg-muted px-1 text-[10px] text-[var(--neon-magenta)]">MBUSD_balance</code>{" "}
              for any user with a single POST.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono text-xs text-[var(--neon-cyan)]">#5</span>
            <span>
              Passively sniff the treasury private key from any on-path
              position — a one-shot, <strong>irreversible</strong> theft.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function FindingCounts() {
  return (
    <div className="mb-12 grid gap-3 sm:grid-cols-3">
      <CountCard
        tone="high"
        label="High"
        value={11}
        hint="Independently exploitable"
      />
      <CountCard
        tone="med"
        label="Medium"
        value={5}
        hint="Exploitable under specific conditions"
      />
      <CountCard
        tone="low"
        label="Low"
        value={0}
        hint="Excluded per CLAUDE.md §3"
      />
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
                Category
              </th>
              <th className="w-[28%] px-3 py-2 text-left font-semibold">
                Location
              </th>
              <th className="px-3 py-2 text-left font-semibold">Impact</th>
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
  const items = [
    <>
      DoS / resource exhaustion (e.g. unguarded <code>JSON.parse</code> on
      socket messages at <code>app.js:103,139</code>).
    </>,
    <>Rate-limiting gaps.</>,
    <>
      Stylistic issues — e.g. the <code>typeof x !== undefined</code> bug at{" "}
      <code>routes.js:157,186</code> is a dead-code smell (the following{" "}
      <code>jwt.verify</code> still rejects), so no direct auth impact.
    </>,
    <>Missing input validation without a proven exploit path.</>,
  ];
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <FileSearch className="h-4 w-4" />
        Deliberately omitted
      </div>
      <ul className="space-y-2 text-sm text-foreground/90">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-0.5 text-muted-foreground">—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">
        Signal over noise: ColdVault reports what's exploitable, not
        everything that's imperfect.
      </p>
    </div>
  );
}

function ImmediateActions() {
  const steps = [
    {
      n: 1,
      title: "Rotate the treasury wallet",
      body: (
        <>
          Assume the private key is <strong>already stolen</strong> (finding
          #8). Move remaining funds to a new wallet whose key has never been
          processed by this application.
        </>
      ),
    },
    {
      n: 2,
      title: "Revoke and rotate credentials",
      body: (
        <>
          Mailtrap SMTP + Gmail credentials in{" "}
          <code>backend/production.env</code> (finding #10). Enable 2FA on
          both.
        </>
      ),
    },
    {
      n: 3,
      title: "Take the backend offline",
      body: (
        <>
          Or block all <code>/api/*</code> except{" "}
          <code>/api/v1/healthz</code> at the load balancer until auth is
          fixed.
        </>
      ),
    },
    {
      n: 4,
      title: "Purge secrets from git history",
      body: (
        <>
          <code>
            git filter-repo --path backend/production.env --invert-paths
          </code>
          .
        </>
      ),
    },
    {
      n: 5,
      title: "Audit on-chain history",
      body: (
        <>
          Of the current treasury address for suspicious outbound transfers
          during the deployment window.
        </>
      ),
    },
  ];
  return (
    <div>
      <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm">
        <Siren className="mr-2 inline h-4 w-4 text-destructive" />
        <strong className="text-destructive">Before any other remediation work:</strong>
      </div>
      <div className="space-y-3">
        {steps.map((s) => (
          <div
            key={s.n}
            className="flex items-start gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/20 font-mono text-sm font-bold text-destructive">
              {s.n}
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-foreground">
                {s.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-[var(--neon-magenta)]">
                {s.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThenTheRewrite() {
  const steps = [
    <>
      Generate a ≥ 32-byte random <code>JWT_SECRET_KEY</code>, load it from a
      secrets manager, fail-closed on boot if missing or empty.
    </>,
    <>
      Gate every admin route with <code>ensureWebTokenForAdmin</code>; move
      admin endpoints behind a dedicated <code>/api/admin/*</code> router
      that applies the middleware with <code>router.use</code>.
    </>,
    <>
      Rewrite <code>user.model.js</code> and <code>admin.model.js</code> to
      use <code>?</code> parameter placeholders. Add an ESLint rule to ban
      template-literal SQL. Consider a query builder (Knex, Kysely).
    </>,
    <>
      Protect <code>/api/v1/webhooks/bsc/deposit-confirmed</code> with HMAC
      signing, IP allow-list, idempotency keys, and a DB-side consistency
      check that <code>(transaction_id, user_id)</code> matches the stored
      row.
    </>,
    <>
      Remove the <code>blockchainexpert.co.in</code> relay — sign and
      broadcast BSC transactions locally with <code>ethers.js</code>. Never
      transmit a private key over the network.
    </>,
    <>
      Commit <code>package-lock.json</code>; replace <code>request</code>,{" "}
      <code>xlsx</code>, <code>ethereumjs-util</code>, and WalletConnect v1;
      run <code>osv-scanner</code> in CI.
    </>,
    <>
      Replace <code>app.use(cors())</code> with an allow-list.
    </>,
    <>
      Move PBKDF2 parameters to ≥ 600k iterations (HMAC-SHA256) or migrate
      to Argon2id.
    </>,
  ];
  return (
    <div className="mt-8">
      <div className="mb-4 rounded-lg border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/10 p-3 text-sm">
        <Terminal className="mr-2 inline h-4 w-4 text-[var(--neon-cyan)]" />
        <strong className="text-[var(--neon-cyan)]">Then, the rewrite:</strong>
      </div>
      <ol className="space-y-2 rounded-xl border border-border bg-muted/20 p-5 text-sm">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 font-mono text-xs text-[var(--neon-cyan)]">
              {String(i + 6).padStart(2, "0")}
            </span>
            <span className="text-foreground/90 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-[var(--neon-magenta)]">
              {s}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SupplyChainNote() {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed">
        No <code>postinstall</code> / <code>preinstall</code> lifecycle hooks
        declared in either <code>package.json</code>. Transitive hooks cannot
        be enumerated without installing, which CLAUDE.md §0 forbids. However,
        the repo ships <strong>no lockfile</strong>{" "}
        (<code>.gitignore:3-4</code> excludes both <code>package-lock.json</code>{" "}
        and <code>yarn.lock</code>), so any future <code>npm install</code>{" "}
        resolves a floating tree — this must be fixed before any SCA gate can
        be meaningful.
      </p>
      <p className="text-sm leading-relaxed">
        No typo-squat-confirmed packages, but these declared deps are unusual
        and warrant individual review before install:{" "}
        <code>blob 0.1.0</code>, <code>fs 0.0.1-security</code>,{" "}
        <code>execp 0.0.1</code>, <code>reverse-string 0.0.6</code>,{" "}
        <code>ethereum-address 0.0.4</code>, <code>send-crypto 0.0.0</code>,{" "}
        <code>validate-phone-number-node-js 0.0.1</code>,{" "}
        <code>nodejs-base64 ^2.0.0</code>. None carry confirmed malicious
        behaviour, so they do not appear in <code>findings.json</code>.
      </p>
      <div className="rounded-xl border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3 text-sm">
            <Package className="h-4 w-4 shrink-0 text-[var(--neon-cyan)]" />
            <span>
              Full declared-dependency risk table in the companion SCA
              artefact.
            </span>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link to="/reports/example-sca">
              Open SCA detail
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function PromptInjectionNote() {
  return (
    <div className="rounded-xl border border-[var(--neon-violet)]/40 bg-[var(--neon-violet)]/5 p-5 text-sm leading-relaxed">
      <p>
        The repository contains several files whose comments or strings read
        like instructions (e.g. <code>routes.js:134</code> serving{" "}
        <code>"Node is running"</code>, inline SQL comments mentioning
        bypasses). <strong>None were treated as instructions.</strong>
      </p>
      <p className="mt-3">
        <code>CLAUDE.md §0</code> was honoured throughout: no code under{" "}
        <code>target/</code> was executed, no <code>npm install</code> was
        run, no outbound URL from <code>target/</code> (including{" "}
        <code>blockchainexpert.co.in:7003</code> and{" "}
        <code>bsc-dataseed.binance.org</code>) was followed.
      </p>
    </div>
  );
}

function Artifacts() {
  return (
    <div className="space-y-2">
      {artifacts.map((a) => (
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
            {a.note}
          </span>
          {a.link && (
            <Link
              to="/reports/example-sca"
              className="text-xs text-[var(--neon-cyan)] underline"
            >
              View →
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

function CTASection() {
  return (
    <section className="mt-12">
      <div className="relative overflow-hidden rounded-3xl border border-border glass p-8 text-center">
        <div className="absolute -top-20 left-1/2 h-40 w-[120%] -translate-x-1/2 bg-gradient-to-r from-[var(--neon-cyan)]/20 via-[var(--neon-violet)]/20 to-[var(--neon-magenta)]/20 blur-3xl" />
        <Terminal className="mx-auto h-10 w-10 text-[var(--neon-cyan)]" />
        <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
          Produce a report like this for{" "}
          <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
            any repo you don't trust
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Clone ColdVault, attach the target as a read-only submodule, open in
          GitHub Codespaces, run <code>/audit</code>. Five minutes later
          you're reading a <code>SUMMARY.md</code> like the one above.
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
              SCA detail
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/blog/anatomy-of-a-deceptive-developer-attack">
              Case study
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/playbook">Playbook</Link>
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
        . Example artefact — reproduced under ColdVault's zero-execution
        protocol. MIT-licensed source.
      </p>
    </footer>
  );
}
