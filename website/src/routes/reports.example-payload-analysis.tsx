import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
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

const PAGE_TITLE =
  "Example ColdVault report — Defensive payload analysis (BeaverTail-style loader, ≥0.97 confidence)";
const PAGE_DESCRIPTION =
  "Sanitized forensic output of the defensive-payload-analysis skill on a DeceptiveDevelopment-style lure repository: a BeaverTail Stage-1 loader hidden at the tail of tailwind.config.js, IoCs, attribution, and immediate-action checklist.";

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
      "Example ColdVault report — Defensive payload analysis",
    );
    setMeta('meta[property="og:description"]', "property", "og:description", PAGE_DESCRIPTION);
    setMeta('meta[property="og:type"]', "property", "og:type", "article");
  }, []);

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
          title="Executive summary"
          subtitle="Three lines — what happened, where, and how sure"
          icon={<ScrollText className="h-5 w-5" />}
        >
          <ExecSummary />
        </Section>

        <Section
          n="2"
          title="Payload location"
          subtitle="Where in the tree the loader hides"
          icon={<Fingerprint className="h-5 w-5" />}
        >
          <PayloadLocationTable />
        </Section>

        <Section
          n="3"
          title="Observed capabilities"
          subtitle="What the reconstructed Stage-1 does at runtime"
          icon={<Bug className="h-5 w-5" />}
        >
          <CapabilitiesList />
        </Section>

        <Section
          n="4"
          title="Attribution"
          subtitle="Primary ≥ 0.97 · 9 converging signatures"
          icon={<Radar className="h-5 w-5" />}
        >
          <AttributionBlock />
        </Section>

        <Section
          n="5"
          title="Consolidated IoCs"
          subtitle="Documentation-only values — real IoCs are redacted"
          icon={<FileWarning className="h-5 w-5" />}
        >
          <IoCTable />
        </Section>

        <Section
          n="6"
          title="Immediate actions"
          subtitle="Quarantine · rotate secrets · hunt"
          icon={<Siren className="h-5 w-5" />}
        >
          <ImmediateActions />
        </Section>

        <Section
          n="7"
          title="Closure checklist"
          subtitle="Proof the audit respected the zero-execution rule"
          icon={<CheckCircle2 className="h-5 w-5" />}
        >
          <ClosureChecklist />
        </Section>

        <Section
          n="8"
          title="References"
          subtitle="Phase files & external threat-intel"
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
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border-2 border-destructive/60 bg-gradient-to-r from-destructive/20 via-destructive/10 to-transparent">
      <div className="flex items-start gap-4 p-5 sm:p-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-destructive/30">
          <AlertOctagon className="h-7 w-7 text-destructive" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-destructive">
            🚨 Malware alert
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
            <code className="rounded bg-destructive/10 px-1.5 py-0.5 text-xl text-destructive">
              target/suspect-repo/
            </code>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            A BeaverTail-style Stage-1 loader is hidden at the tail of{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs text-[var(--neon-magenta)]">
              tailwind.config.js
            </code>
            . Static reconstruction only — no network calls were made toward the
            embedded C2 from this audit environment.
          </p>
        </div>
      </div>
    </div>
  );
}

function DoNotRunBanner() {
  const commands = [
    "npm install", "npm i", "yarn", "pnpm install",
    "npm start", "npm run build", "npm run server",
    "npm test", "node …",
    "open in VS Code / WebStorm / Cursor (Tailwind IntelliSense extension active)",
    "any command that loads tailwind.config.js",
  ];
  return (
    <div className="mb-10 rounded-2xl border-2 border-destructive/50 bg-destructive/5 p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-destructive">
        <Ban className="h-4 w-4" />
        Do not run · do not install · do not open in an IDE
      </div>
      <p className="text-sm text-foreground/90">
        None of the following may be executed against{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs text-[var(--neon-magenta)]">
          target/suspect-repo/
        </code>
        :
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
        Letting <code>react-scripts</code> or <code>postcss</code> resolve{" "}
        <code>tailwind.config.js</code> is enough to trigger the payload.
      </p>
    </div>
  );
}

/* ───────── header + sanitization notice ───────── */

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
            <Link to="/reports/example-summary">
              <ArrowLeftIcon />
              Summary
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link to="/commands">Commands</Link>
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
  return (
    <header className="mb-8">
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge className="bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] border-[var(--neon-cyan)]/40 font-mono">
          Example report
        </Badge>
        <Badge className="border-destructive/50 bg-destructive/15 text-destructive font-mono">
          HOSTILE · ≥0.97
        </Badge>
        <Badge variant="outline" className="border-[var(--neon-violet)]/40">
          #forensic
        </Badge>
        <Badge variant="outline" className="border-[var(--neon-violet)]/40">
          #beavertail
        </Badge>
        <Badge variant="outline" className="border-[var(--neon-violet)]/40">
          #deceptive-development
        </Badge>
      </div>
      <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
        ColdVault —{" "}
        <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
          Defensive payload analysis
        </span>
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-sm text-[var(--neon-magenta)]">
          ALERTE-MALWARE.md
        </code>{" "}
        that the{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-sm text-[var(--neon-magenta)]">
          defensive-payload-analysis
        </code>{" "}
        skill produces after a read-only pass — the file you hand to IR, HR, and
        the blue team. Template based on a real Contagious Interview lure;{" "}
        <strong>all live IoCs redacted.</strong>
      </p>
      <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
        <span className="text-[var(--neon-cyan)]">target:</span>{" "}
        target/suspect-repo @ [REDACTED-SHA] — sanitized for public display
        <br />
        <span className="text-[var(--neon-cyan)]">scope:</span> build configs,
        lifecycle scripts, single-line &gt;2000-char files, base64 blobs fed to{" "}
        <code>Function</code>/<code>eval</code>
        <br />
        <span className="text-[var(--neon-cyan)]">protocol:</span> static-only
        (CLAUDE.md §0) — no install, no run, no outbound URL followed
        <br />
        <span className="text-[var(--neon-cyan)]">tools:</span> Read · Glob ·
        Grep · statically reconstructed deobfuscation (XOR + base64 +
        permutation)
      </div>
    </header>
  );
}

function SanitizationNotice() {
  return (
    <div className="mb-10 rounded-xl border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/5 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[var(--neon-cyan)]">
        <EyeOff className="h-3.5 w-3.5" />
        Public-display sanitization
      </div>
      <p className="text-sm text-foreground/90">
        This page is an <strong>example of the output shape</strong>, not an IoC
        feed. Real C2 addresses, campaign IDs, XOR keys, hash guards, magic
        bytes, victim credentials, and lure-specific persona strings have been
        replaced with{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs text-[var(--neon-magenta)]">
          [REDACTED]
        </code>{" "}
        or RFC 5737 documentation addresses (
        <code>203.0.113.0/24</code>, <code>198.51.100.0/24</code>). Family names
        and public threat-intel references are kept verbatim — they are already
        documented by Unit42, Microsoft Threat Intelligence, and Mandiant.
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
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
      <p className="text-sm leading-relaxed">
        The <code>suspect-repo</code> submodule is a{" "}
        <strong>DPRK hiring lure (Contagious Interview)</strong> containing a{" "}
        <strong>BeaverTail Stage-1 loader</strong> of ~11 500 chars appended to
        the tail of{" "}
        <code>target/suspect-repo/tailwind.config.js</code> at line <code>890</code>,
        after ~500 padding spaces. The loader beacons HTTP to{" "}
        <code>http://203.0.113.42:1244/s/[REDACTED-CAMPAIGN-ID]</code> (fallback{" "}
        <code>198.51.100.17:1244</code>), downloads a Stage-2 Node.js
        (<strong>InvisibleFerret</strong>, Python RAT: crypto wallet theft,
        Keychain / Credential Manager, SSH, cookies), and launches it detached
        via <code>nohup</code>.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge className="border-destructive/50 bg-destructive/15 text-destructive font-mono">
          Confidence ≥ 0.97
        </Badge>
        <Badge variant="outline" className="border-[var(--neon-magenta)]/40">
          Attribution: UNC4899 / Famous Chollima (Lazarus umbrella)
        </Badge>
      </div>
    </div>
  );
}

function PayloadLocationTable() {
  const rows = [
    { k: "Carrier file", v: "target/suspect-repo/tailwind.config.js" },
    { k: "Line", v: "890" },
    { k: "Blob size", v: "~11 500 characters (after ~500 padding spaces)" },
    {
      k: "Visibility",
      v:
        "Invisible without word-wrap. Lines 1–57 are a real Tailwind module.exports; lines 58–889 are empty.",
    },
    {
      k: "Technique",
      v:
        "obfuscator.io-style JS: 123-entry base64 string table with circular rotation verified by a hash guard, 4-byte XOR key, base64 fragments concatenated to resolve require('os'|'fs'|'child_process'|'request'|'path'|'process') at runtime.",
    },
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
  const items: { title: string; body: React.ReactNode; icon: React.ReactNode }[] = [
    {
      title: "HTTP beacon",
      icon: <Network className="h-4 w-4 text-destructive" />,
      body: (
        <>
          To C2 every 10 min (<code>0x96640</code> ms), capped at 3 iterations —
          anti-sandbox silence after.
        </>
      ),
    },
    {
      title: "Host profiling + exfil",
      icon: <Fingerprint className="h-4 w-4 text-destructive" />,
      body: <>hostname, username (macOS), platform, <code>process.argv</code>, timestamp.</>,
    },
    {
      title: "Magic-byte handshake",
      icon: <KeyRound className="h-4 w-4 text-destructive" />,
      body: (
        <>
          The C2 response must start with <code>[3-BYTE-MAGIC]</code> — otherwise
          abort. Exact bytes redacted.
        </>
      ),
    },
    {
      title: "Stage-2 download",
      icon: <FileCode className="h-4 w-4 text-destructive" />,
      body: (
        <>
          Downloads <code>f.js</code> + <code>package.json</code> into{" "}
          <code>&lt;tmpdir&gt;/&lt;hostname&gt;/.vscode/</code>.
        </>
      ),
    },
    {
      title: "Silent dep install",
      icon: <FileWarning className="h-4 w-4 text-destructive" />,
      body: (
        <>
          <code>npm i --silent</code> or <code>npm --prefix … i</code> in the
          drop folder.
        </>
      ),
    },
    {
      title: "Detached launch",
      icon: <Terminal className="h-4 w-4 text-destructive" />,
      body: (
        <>
          <code>nohup node f.js</code> (Unix) or{" "}
          <code>spawn('node', ['f.js'], {"{"}windowsHide:true{"}"})</code>{" "}
          (Windows). Parent forgets via <code>.unref()</code>.
        </>
      ),
    },
    {
      title: "Stage-2 payload (not in repo)",
      icon: <Skull className="h-4 w-4 text-destructive" />,
      body: (
        <>
          InvisibleFerret — Python RAT that steals MetaMask / Phantom / Coinbase
          browser extensions, macOS Keychain, Windows Credential Manager, SSH
          keys, <code>.gitconfig</code>, cookies. Adds reverse shell, keylogger,
          file harvest.
        </>
      ),
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
  return (
    <>
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <div className="mb-2 text-xs font-mono font-bold uppercase tracking-wider text-destructive">
          Primary hypothesis · confidence ≥ 0.97
        </div>
        <p className="text-sm leading-relaxed">
          <strong>BeaverTail</strong>, DPRK family operating the{" "}
          <em>Contagious Interview</em> campaign. Attribution published by
          Unit42 (Palo Alto Networks), Microsoft Threat Intelligence
          (<em>Sapphire Sleet</em>), and Mandiant (<em>UNC4899 / Famous
          Chollima</em>, Lazarus umbrella).
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card/40 p-5">
        <div className="mb-3 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
          Nine converging signatures
        </div>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {[
            "4-byte XOR key (bytes redacted)",
            "Beacon interval 0x96640 (10 min)",
            "Iteration cap at 3",
            "3-byte magic-byte gate (bytes redacted)",
            "12-char hex campaign ID (value redacted)",
            "20-char base64 permutation of C2 IP",
            "Drop folder <tmpdir>/<hostname>/.vscode/",
            "C2 IPs match publicly-attributed samples (specifics redacted)",
            "Persistence via spawn + nohup + .unref()",
          ].map((s) => (
            <li key={s} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neon-cyan)]" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--neon-magenta)]/30 bg-[var(--neon-magenta)]/5 p-5">
        <div className="mb-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--neon-magenta)]">
          Social-engineering lure
        </div>
        <p className="text-sm leading-relaxed">
          <code>README.md</code> presents a contract brief for{" "}
          <em>&ldquo;European engineers and developers&rdquo;</em> and explicitly
          instructs <code>npm install</code> then <code>npm start</code>, with a
          &ldquo;CTO session&rdquo; as the follow-up — the textbook DPRK fake-interview
          profile. Personas{" "}
          <code>[REDACTED-PERSONA-A]</code>, <code>[REDACTED-PERSONA-B]</code>,{" "}
          <code>[REDACTED-PERSONA-C]</code> appear across the repo and should be
          forwarded to HR / recruiting for blocking.
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-muted/30 p-5">
        <div className="mb-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
          Alternative hypothesis
        </div>
        <p className="text-sm text-foreground/90">
          A non-DPRK copycat reproducing BeaverTail. Less likely: the
          infrastructure (IP/port pairs, ID format, magic bytes) matches
          byte-for-byte samples publicly attributed to the DPRK cluster.
        </p>
      </div>
    </>
  );
}

function IoCTable() {
  const rows: { k: string; v: React.ReactNode; note?: string }[] = [
    { k: "C2 primary", v: <code>203.0.113.42:1244</code>, note: "RFC 5737 TEST-NET-3 — real address redacted" },
    { k: "C2 secondary", v: <code>198.51.100.17:1244</code>, note: "RFC 5737 TEST-NET-2 — real address redacted" },
    { k: "Beacon GET", v: <code>/s/[REDACTED-CAMPAIGN-ID]</code> },
    { k: "Stage-2 GET", v: <code>/p</code> },
    { k: "Aux GET", v: <code>/f/</code> },
    { k: "Magic bytes", v: <code>[3B magic — redacted]</code> },
    { k: "XOR key", v: <code>[0xNN, 0xNN, 0xNN, 0xNN]</code> },
    { k: "Hash guard", v: <code>0xNNNNN</code> },
    { k: "Drop folder", v: <code>&lt;tmpdir&gt;/&lt;hostname&gt;/.vscode/</code> },
    { k: "Dropped files", v: <><code>f.js</code>, <code>package.json</code></> },
    {
      k: "Shell commands",
      v: (
        <>
          <code>cd &quot;&lt;drop&gt;&quot; &amp;&amp; npm i --silent</code>
          <br />
          <code>npm --prefix &quot;&lt;drop&gt;&quot; i</code>
        </>
      ),
    },
    { k: "Campaign ID", v: <code>[REDACTED-12-HEX]</code> },
    { k: "Beacon interval", v: <><code>0x96640</code> ms (10 min), cap at 3 iterations</> },
    { k: "Family", v: <>BeaverTail + InvisibleFerret (Stage-2)</> },
  ];
  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="w-52 px-4 py-2 text-left font-semibold">Type</th>
              <th className="px-4 py-2 text-left font-semibold">Value</th>
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
        Full unsanitized detail (EDR queries, drop-in YARA rule) lives in{" "}
        <code>forensic/&lt;target&gt;/04-iocs.md</code> on the analyst's
        machine — never shipped to a public page.
      </p>
    </>
  );
}

function ImmediateActions() {
  return (
    <>
      <div className="rounded-xl border border-[var(--neon-magenta)]/30 bg-[var(--neon-magenta)]/5 p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--neon-magenta)]">
          <Unplug className="h-4 w-4" />
          Quarantine
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <Flame className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <span>
              Mark <code>target/suspect-repo/</code> as <strong>HOSTILE</strong>.
              Never open it in an IDE with auto-install or file-watchers active.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <span>
              If a host already ran <code>npm install</code> or{" "}
              <code>npm start</code>:
            </span>
          </li>
        </ul>
        <ol className="mt-3 space-y-2 pl-5 text-sm sm:pl-7">
          {[
            "Isolate from the network (disconnect Wi-Fi / Ethernet; do NOT shut down — RAM forensics).",
            "Collect a memory snapshot before halting the machine.",
            "Inspect <tmpdir>/<hostname>/.vscode/ — presence of f.js / package.json drops confirms execution.",
            "Hunt for detached Node processes with cwd under tmpdir (ps aux | grep node, Get-Process).",
            "Search firewall / NDR / proxy logs (3–6 months back) for egress to the redacted C2 IP pair.",
            "Treat the host as fully compromised: rotate SSH keys, AWS/GCP/Azure, GitHub tokens, cloud SDKs, browser wallets (re-seed MetaMask/Phantom from offline seed), Keychain / Credential Manager.",
          ].map((s, i) => (
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
          Secrets to revoke
        </div>
        <p className="text-sm leading-relaxed">
          <code>target/suspect-repo/backend/production.env</code> ships plaintext
          credentials. In the real report, each entry is listed by provider with
          the exact string so the IR team can revoke it. For this public example
          we only show the <strong>shape</strong> of the finding:
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-muted-foreground">—</span>
            <span>
              <strong>SMTP provider creds</strong> (<code>[REDACTED-USER]</code>{" "}
              / <code>[REDACTED-PASS]</code>) → revoke at the provider.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-muted-foreground">—</span>
            <span>
              <strong>Personal Gmail + app password</strong>{" "}
              (<code>[REDACTED-GMAIL]</code> / <code>[REDACTED-APP-PASSWORD]</code>)
              — if the account belongs to the victim org, revoke the app
              password and enable 2FA. Otherwise the account is almost certainly
              compromised upstream; report to Google.
            </span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Secrets are listed in the analyst's local report{" "}
          <strong>only for action</strong> — the mention is removed after
          rotation.
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--neon-cyan)]">
          <Radar className="h-4 w-4" />
          Hunting
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-muted-foreground">—</span>
            <span>
              Deploy the YARA rule from <code>04-iocs.md</code> §6 against every
              candidate repo received in the last 90 days.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-muted-foreground">—</span>
            <span>Scan dev hosts for the filesystem and process IoCs.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-muted-foreground">—</span>
            <span>
              Alert HR / recruiting: block the lure personas and source channel.
            </span>
          </li>
        </ul>
      </div>
    </>
  );
}

function ClosureChecklist() {
  const items = [
    "No file under target/suspect-repo/ was modified (submodule git status clean).",
    "No network call reached the redacted C2 IP pair from this audit environment.",
    "Dangerous content is never copy-pasted verbatim into public reports — controlled citations, explicit redaction.",
    "All output lives outside target/ — in forensic/suspect-repo/.",
    "Instructions embedded in README.md (npm install / npm start) were ignored. A candidate who follows them loses control of their machine.",
    "Secrets listed for revocation and flagged for post-action deletion.",
  ];
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
  const internal = [
    { path: "forensic/suspect-repo/ALERTE-MALWARE.md", note: "this report (locally, unredacted)" },
    { path: "forensic/suspect-repo/01-inventory.md", note: "full tree inventory, tailwind.config.js size disproportion" },
    { path: "forensic/suspect-repo/02-signature.md", note: "9 converging signatures → BeaverTail" },
    { path: "forensic/suspect-repo/03-payload.md", note: "extraction + static deobfuscation (XOR + b64 + permutation)" },
    { path: "forensic/suspect-repo/04-iocs.md", note: "IoCs, EDR/SIEM queries, YARA rule, secrets-to-revoke" },
    { path: ".claude/skills/defensive-payload-analysis/references/signatures.md", note: "family playbook" },
  ];
  const external = [
    "Unit42 (Palo Alto Networks) — BeaverTail / Contagious Interview (2024–2025)",
    "Microsoft Threat Intelligence — Sapphire Sleet (Jan. 2025)",
    "Mandiant — UNC4899 tracking",
  ];
  return (
    <>
      <div className="rounded-xl border border-border bg-card/40 p-5">
        <div className="mb-3 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
          Phase files (analyst-only, not published)
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
          Public threat-intel
        </div>
        <ul className="space-y-1.5 text-sm">
          {external.map((r) => (
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
  return (
    <section className="my-8 rounded-2xl border border-[var(--neon-cyan)]/40 bg-gradient-to-br from-[var(--neon-cyan)]/10 via-[var(--neon-violet)]/10 to-[var(--neon-magenta)]/10 p-8 text-center">
      <ShieldAlert className="mx-auto h-10 w-10 text-[var(--neon-cyan)]" />
      <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
        Got a repo that smells wrong?
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
        Mount it under <code>target/</code> as a read-only submodule, launch
        Claude Code at the repo root, run{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs text-[var(--neon-magenta)]">
          /defensive-payload-analysis
        </code>
        . You get this report — no byte of the suspect tree ever executes.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button
          asChild
          className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] font-bold text-background hover:opacity-90"
        >
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            <Github className="mr-2 h-4 w-4" />
            github.com/rasata/coldvault.dev
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link to="/commands">
            <Terminal className="mr-2 h-4 w-4" />
            See all commands
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/reports/example-summary">
            <FileSearch className="mr-2 h-4 w-4" />
            Example summary report
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/playbook">Playbook</Link>
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
      Published by{" "}
      <a
        href="https://zonova.io"
        className="text-[var(--neon-cyan)] underline"
        target="_blank"
        rel="noreferrer"
      >
        ZONOVA RESEARCH
      </a>
      . Stay cold. Stay vaulted.
    </footer>
  );
}
