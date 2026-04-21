import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-vault.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/i18n/context";
import {
  Snowflake,
  ShieldCheck,
  Bot,
  Github,
  Terminal,
  Lock,
  FileSearch,
  Container,
  Zap,
  ArrowRight,
  Cpu,
  GitBranch,
  AlertTriangle,
} from "lucide-react";

const REPO_URL = "https://github.com/rasata/coldvault.dev";

const FEATURE_ICONS = [Snowflake, Container, Bot, FileSearch, ShieldCheck, Lock];
const STEP_ICONS = [GitBranch, Container, Cpu, Bot, FileSearch];

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-grid">
      <LocalizedHead />
      <Nav />
      <Hero />
      <Threat />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}

function LocalizedHead() {
  const { t } = useTranslation();
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = t.meta.title;
    const setMeta = (sel: string, attr: "name" | "property", key: string, value: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(sel);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };
    setMeta('meta[name="description"]', "name", "description", t.meta.description);
    setMeta('meta[property="og:title"]', "property", "og:title", t.meta.ogTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", t.meta.ogDescription);
  }, [t]);
  return null;
}

function Nav() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta">
            <Snowflake className="h-5 w-5 text-background" />
          </div>
          <span className="font-mono text-sm font-bold tracking-wider">
            COLD<span className="text-gradient">VAULT</span>
          </span>
        </a>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#threat" className="hover:text-foreground transition">
            {t.nav.threat}
          </a>
          <a href="#features" className="hover:text-foreground transition">
            {t.nav.arsenal}
          </a>
          <a href="#how" className="hover:text-foreground transition">
            {t.nav.how}
          </a>
          <Link to="/blog/anatomy-of-a-deceptive-developer-attack" className="hover:text-neon-cyan transition">
            Case study
          </Link>
          <Link to="/playbook" className="hover:text-neon-magenta transition">
            Playbook
          </Link>
          <Link to="/reports/example-summary" className="hover:text-neon-cyan transition">
            Example report
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button
            asChild
            size="sm"
            className="bg-foreground text-background hover:bg-foreground/90 shadow-sm"
          >
            <a href={REPO_URL} target="_blank" rel="noreferrer" aria-label={t.nav.star}>
              <Github className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">{t.nav.star}</span>
              <span className="sm:hidden">Star</span>
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
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImg}
          alt="Glowing cyber vault representing Coldvault"
          width={1536}
          height={1024}
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-32 text-center">
        <Badge className="mb-6 border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan font-mono">
          <Zap className="mr-1.5 h-3 w-3" /> {t.hero.badge}
        </Badge>

        <h1 className="text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          {t.hero.title1}
          <br />
          <span className="text-gradient">{t.hero.title2}</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
          {t.hero.descStart}
          <span className="text-foreground font-semibold">{t.hero.web3Sandbox}</span>
          {t.hero.descMiddle}
          <span className="text-foreground">{t.hero.descEnd}</span>
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-neon-cyan to-neon-magenta text-background font-bold animate-pulse-glow hover:opacity-90"
          >
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              <Github className="mr-2 h-5 w-5" /> {t.hero.cta1}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-neon-violet/50">
            <a href="#how">
              {t.hero.cta2} <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180" />
            </a>
          </Button>
        </div>

        <div
          className="mx-auto mt-16 max-w-2xl glass rounded-xl p-4 text-left animate-float"
          dir="ltr"
        >
          <div className="flex items-center gap-2 border-b border-border/50 pb-2 mb-3">
            <span className="h-3 w-3 rounded-full bg-destructive/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              {t.hero.terminalLabel}
            </span>
          </div>
          <pre className="font-mono text-sm leading-relaxed text-neon-cyan">
            {`$ git clone https://github.com/rasata/coldvault.dev
$ code coldvault.dev   # Open in GitHub Codespaces
> claude "audit ./target — find malware, secrets, supply-chain risk"
🧊 scanning frozen repo... 0 bytes executed
✅ report ready: reports/2026-04-20.md`}
          </pre>
        </div>
      </div>
    </section>
  );
}

function Threat() {
  const { t } = useTranslation();
  return (
    <section id="threat" className="border-y border-border/50 bg-card/30 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Badge variant="outline" className="border-destructive/50 text-destructive">
          <AlertTriangle className="mr-1.5 h-3 w-3" /> {t.threat.badge}
        </Badge>
        <h2 className="mt-4 text-3xl font-bold md:text-5xl">{t.threat.heading}</h2>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl">
          {t.threat.p1Start}
          <code className="text-neon-magenta" dir="ltr">
            npm install
          </code>
          {t.threat.p1Middle}
          {t.threat.p1End}
        </p>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          {t.threat.p2Start}
          <span className="text-foreground font-semibold">{t.threat.p2Coldvault}</span>
          {t.threat.p2Middle}
          <span className="text-neon-cyan">{t.threat.p2Highlight}</span>
          {t.threat.p2End}
        </p>
      </div>
    </section>
  );
}

function Features() {
  const { t } = useTranslation();
  return (
    <section id="features" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <Badge className="bg-neon-violet/15 text-neon-violet border-neon-violet/30 font-mono">
            {t.features.badge}
          </Badge>
          <h2 className="mt-4 text-4xl font-bold md:text-6xl">
            {t.features.title1} <span className="text-gradient">{t.features.title2}</span>
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((f, i) => {
            const Icon = FEATURE_ICONS[i] ?? Snowflake;
            return (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl glass transition hover:-translate-y-1 hover:border-neon-cyan/40"
              >
                <FeatureIllustration index={i} />
                <div className="relative p-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 border border-neon-cyan/30 backdrop-blur -mt-12 mb-4 shadow-lg">
                    <Icon className="h-6 w-6 text-neon-cyan" />
                  </div>
                  <h3 className="text-xl font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeatureIllustration({ index }: { index: number }) {
  const cyan = "oklch(from var(--neon-cyan) l c h)";
  const magenta = "oklch(from var(--neon-magenta) l c h)";
  const violet = "oklch(from var(--neon-violet) l c h)";

  const palettes = [
    { from: cyan, to: violet },
    { from: violet, to: magenta },
    { from: magenta, to: cyan },
    { from: cyan, to: magenta },
    { from: violet, to: cyan },
    { from: magenta, to: violet },
  ];
  const p = palettes[index % palettes.length];
  const gradId = `feat-grad-${index}`;

  const renderArt = () => {
    switch (index) {
      case 0:
        return (
          <g>
            {[0, 60, 120].map((rot) => (
              <line key={rot} x1="160" y1="40" x2="160" y2="120" stroke={cyan} strokeWidth="3" strokeLinecap="round" transform={`rotate(${rot} 160 80)`} />
            ))}
            <circle cx="160" cy="80" r="8" fill={violet} />
            {[0, 60, 120, 180, 240, 300].map((rot, idx) => (
              <circle key={idx} cx="160" cy="40" r="4" fill={magenta} transform={`rotate(${rot} 160 80)`} />
            ))}
          </g>
        );
      case 1:
        return (
          <g>
            <rect x="100" y="35" width="120" height="80" rx="8" fill="none" stroke={violet} strokeWidth="2" />
            <rect x="110" y="45" width="100" height="14" rx="3" fill={cyan} opacity="0.6" />
            <rect x="110" y="65" width="70" height="10" rx="3" fill={magenta} opacity="0.7" />
            <rect x="110" y="80" width="90" height="10" rx="3" fill={violet} opacity="0.6" />
            <rect x="110" y="95" width="50" height="10" rx="3" fill={cyan} opacity="0.7" />
          </g>
        );
      case 2:
        return (
          <g>
            <circle cx="160" cy="80" r="36" fill="none" stroke={magenta} strokeWidth="2" />
            <circle cx="160" cy="80" r="22" fill={violet} opacity="0.4" />
            <circle cx="150" cy="75" r="4" fill={cyan} />
            <circle cx="170" cy="75" r="4" fill={cyan} />
            <path d="M148 90 Q160 98 172 90" stroke={cyan} strokeWidth="2" fill="none" strokeLinecap="round" />
            <line x1="160" y1="44" x2="160" y2="34" stroke={magenta} strokeWidth="2" strokeLinecap="round" />
            <circle cx="160" cy="30" r="3" fill={magenta} />
          </g>
        );
      case 3:
        return (
          <g>
            <rect x="115" y="35" width="70" height="90" rx="6" fill="none" stroke={cyan} strokeWidth="2" />
            <line x1="125" y1="55" x2="170" y2="55" stroke={violet} strokeWidth="2" strokeLinecap="round" />
            <line x1="125" y1="68" x2="160" y2="68" stroke={violet} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            <line x1="125" y1="81" x2="170" y2="81" stroke={violet} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            <circle cx="195" cy="100" r="16" fill="none" stroke={magenta} strokeWidth="3" />
            <line x1="206" y1="111" x2="218" y2="123" stroke={magenta} strokeWidth="3" strokeLinecap="round" />
          </g>
        );
      case 4:
        return (
          <g>
            <path d="M160 35 L195 50 L195 85 Q195 110 160 125 Q125 110 125 85 L125 50 Z" fill={violet} opacity="0.25" stroke={violet} strokeWidth="2" />
            <path d="M145 80 L156 92 L178 68" stroke={cyan} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="160" cy="50" r="3" fill={magenta} />
          </g>
        );
      case 5:
        return (
          <g>
            <path d="M140 70 Q140 50 160 50 Q180 50 180 70 L180 80" stroke={magenta} strokeWidth="3" fill="none" strokeLinecap="round" />
            <rect x="130" y="78" width="60" height="46" rx="6" fill={violet} opacity="0.3" stroke={violet} strokeWidth="2" />
            <circle cx="160" cy="98" r="5" fill={cyan} />
            <line x1="160" y1="103" x2="160" y2="113" stroke={cyan} strokeWidth="3" strokeLinecap="round" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative h-32 w-full overflow-hidden">
      <svg viewBox="0 0 320 160" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={p.from} stopOpacity="0.35" />
            <stop offset="100%" stopColor={p.to} stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <rect width="320" height="160" fill={`url(#${gradId})`} />
        <circle cx="40" cy="30" r="40" fill={p.from} opacity="0.25" />
        <circle cx="290" cy="140" r="50" fill={p.to} opacity="0.2" />
        {renderArt()}
      </svg>
    </div>
  );
}

function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section id="how" className="border-t border-border/50 bg-card/20 py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <Badge className="bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30 font-mono">
            {t.how.badge}
          </Badge>
          <h2 className="mt-4 text-4xl font-bold md:text-6xl">
            {t.how.title1} <span className="text-gradient">{t.how.title2}</span>
          </h2>
        </div>

        <ol className="relative space-y-16 md:space-y-24">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan via-neon-violet to-neon-magenta md:left-1/2" />
          {t.how.steps.map((s, i) => {
            const Icon = STEP_ICONS[i] ?? GitBranch;
            const reversed = i % 2 === 1;
            return (
              <li
                key={s.title}
                className={`relative flex flex-col gap-6 md:flex-row md:items-center ${
                  reversed ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="flex w-12 shrink-0 justify-center md:absolute md:left-1/2 md:-translate-x-1/2 z-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background border-2 border-neon-cyan glow-border shadow-lg">
                    <Icon className="h-6 w-6 text-neon-cyan" />
                  </div>
                </div>
                <div className="glass flex-1 rounded-xl p-6 md:max-w-md">
                  <div className="font-mono text-xs text-neon-magenta">
                    {t.how.stepLabel} {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-1 text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
                <div className="hidden md:flex flex-1 md:max-w-md items-center justify-center">
                  <StepIllustration index={i} />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function StepIllustration({ index }: { index: number }) {
  const illos = [
    <svg key="0" viewBox="0 0 240 180" className="w-full max-w-xs drop-shadow-xl">
      <defs>
        <linearGradient id="g0" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--neon-cyan)" />
          <stop offset="100%" stopColor="var(--neon-violet)" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="90" r="14" fill="url(#g0)" />
      <circle cx="200" cy="40" r="10" fill="var(--neon-magenta)" />
      <circle cx="200" cy="90" r="10" fill="var(--neon-cyan)" />
      <circle cx="200" cy="140" r="10" fill="var(--neon-violet)" />
      <path d="M54 90 Q 120 40 190 40" stroke="url(#g0)" strokeWidth="2.5" fill="none" />
      <path d="M54 90 H 190" stroke="url(#g0)" strokeWidth="2.5" fill="none" />
      <path d="M54 90 Q 120 140 190 140" stroke="url(#g0)" strokeWidth="2.5" fill="none" />
      <rect x="20" y="20" width="40" height="14" rx="3" fill="color-mix(in oklab, var(--neon-cyan) 15%, transparent)" stroke="color-mix(in oklab, var(--neon-cyan) 40%, transparent)" />
      <text x="40" y="30" textAnchor="middle" fontSize="9" fill="var(--neon-cyan)" fontFamily="monospace">main</text>
    </svg>,
    <svg key="1" viewBox="0 0 240 180" className="w-full max-w-xs drop-shadow-xl">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--neon-magenta)" />
          <stop offset="100%" stopColor="var(--neon-violet)" />
        </linearGradient>
      </defs>
      <rect x="40" y="30" width="160" height="120" rx="10" fill="color-mix(in oklab, var(--neon-violet) 10%, transparent)" stroke="url(#g1)" strokeWidth="2" />
      <rect x="40" y="30" width="160" height="22" rx="10" fill="url(#g1)" />
      <circle cx="52" cy="41" r="3" fill="var(--background)" />
      <circle cx="62" cy="41" r="3" fill="var(--background)" />
      <circle cx="72" cy="41" r="3" fill="var(--background)" />
      <rect x="55" y="68" width="130" height="8" rx="2" fill="color-mix(in oklab, var(--neon-cyan) 60%, transparent)" />
      <rect x="55" y="84" width="100" height="8" rx="2" fill="color-mix(in oklab, var(--neon-magenta) 50%, transparent)" />
      <rect x="55" y="100" width="120" height="8" rx="2" fill="color-mix(in oklab, var(--neon-violet) 50%, transparent)" />
      <rect x="55" y="116" width="80" height="8" rx="2" fill="color-mix(in oklab, var(--neon-cyan) 40%, transparent)" />
      <circle cx="180" cy="130" r="6" fill="var(--neon-cyan)">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>,
    <svg key="2" viewBox="0 0 240 180" className="w-full max-w-xs drop-shadow-xl">
      <defs>
        <linearGradient id="g2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--neon-magenta)" />
          <stop offset="100%" stopColor="var(--neon-cyan)" />
        </linearGradient>
      </defs>
      <rect x="30" y="50" width="80" height="80" rx="8" fill="color-mix(in oklab, var(--neon-cyan) 12%, transparent)" stroke="var(--neon-cyan)" strokeWidth="2" />
      <text x="70" y="95" textAnchor="middle" fontSize="11" fill="var(--neon-cyan)" fontFamily="monospace">vault/</text>
      <path d="M115 90 H 135" stroke="url(#g2)" strokeWidth="2" strokeDasharray="4 3" />
      <rect x="140" y="50" width="80" height="80" rx="8" fill="color-mix(in oklab, var(--neon-magenta) 12%, transparent)" stroke="var(--neon-magenta)" strokeWidth="2" strokeDasharray="6 4" />
      <rect x="165" y="78" width="30" height="24" rx="3" fill="color-mix(in oklab, var(--neon-magenta) 30%, transparent)" stroke="var(--neon-magenta)" strokeWidth="1.5" />
      <path d="M170 78 V 72 a10 10 0 0 1 20 0 V 78" stroke="var(--neon-magenta)" strokeWidth="1.5" fill="none" />
      <text x="180" y="120" textAnchor="middle" fontSize="9" fill="var(--neon-magenta)" fontFamily="monospace">read-only</text>
    </svg>,
    <svg key="3" viewBox="0 0 240 180" className="w-full max-w-xs drop-shadow-xl">
      <defs>
        <radialGradient id="g3" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--neon-cyan)" />
          <stop offset="60%" stopColor="var(--neon-violet)" />
          <stop offset="100%" stopColor="color-mix(in oklab, var(--neon-magenta) 20%, transparent)" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="90" r="55" fill="none" stroke="color-mix(in oklab, var(--neon-cyan) 30%, transparent)" strokeWidth="1">
        <animate attributeName="r" values="55;70;55" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="120" cy="90" r="40" fill="url(#g3)" />
      <circle cx="120" cy="90" r="40" fill="none" stroke="var(--neon-cyan)" strokeWidth="1.5" />
      <text x="120" y="95" textAnchor="middle" fontSize="14" fill="var(--background)" fontFamily="monospace" fontWeight="bold">AI</text>
      <circle cx="55" cy="50" r="4" fill="var(--neon-magenta)" />
      <circle cx="195" cy="60" r="3" fill="var(--neon-cyan)" />
      <circle cx="200" cy="135" r="4" fill="var(--neon-violet)" />
      <circle cx="50" cy="130" r="3" fill="var(--neon-cyan)" />
    </svg>,
    <svg key="4" viewBox="0 0 240 180" className="w-full max-w-xs drop-shadow-xl">
      <defs>
        <linearGradient id="g4" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--neon-violet)" />
          <stop offset="100%" stopColor="var(--neon-cyan)" />
        </linearGradient>
      </defs>
      <rect x="30" y="25" width="180" height="130" rx="8" fill="var(--background)" stroke="url(#g4)" strokeWidth="2" />
      <rect x="30" y="25" width="180" height="20" rx="8" fill="url(#g4)" />
      <text x="120" y="39" textAnchor="middle" fontSize="10" fill="var(--background)" fontFamily="monospace" fontWeight="bold">REPORT.md</text>
      <circle cx="48" cy="65" r="4" fill="var(--neon-cyan)" />
      <rect x="58" y="62" width="120" height="6" rx="2" fill="color-mix(in oklab, var(--neon-cyan) 30%, transparent)" />
      <circle cx="48" cy="85" r="4" fill="var(--neon-magenta)" />
      <rect x="58" y="82" width="100" height="6" rx="2" fill="color-mix(in oklab, var(--neon-magenta) 30%, transparent)" />
      <circle cx="48" cy="105" r="4" fill="var(--neon-violet)" />
      <rect x="58" y="102" width="140" height="6" rx="2" fill="color-mix(in oklab, var(--neon-violet) 30%, transparent)" />
      <circle cx="48" cy="125" r="4" fill="var(--neon-cyan)" />
      <rect x="58" y="122" width="90" height="6" rx="2" fill="color-mix(in oklab, var(--neon-cyan) 30%, transparent)" />
      <text x="190" y="148" textAnchor="end" fontSize="9" fill="var(--neon-cyan)" fontFamily="monospace">✓ safe</text>
    </svg>,
  ];
  return illos[index] ?? illos[0];
}

function CTA() {
  const { t } = useTranslation();
  return (
    <section className="py-32">
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative overflow-hidden rounded-3xl glass p-12 text-center glow-border">
          <div className="absolute -top-20 left-1/2 h-40 w-[120%] -translate-x-1/2 bg-gradient-to-r from-neon-cyan/30 via-neon-violet/30 to-neon-magenta/30 blur-3xl" />
          <Terminal className="mx-auto h-12 w-12 text-neon-cyan" />
          <h2 className="mt-6 text-4xl font-bold md:text-5xl">
            {t.cta.title1} <span className="text-gradient">{t.cta.title2}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t.cta.desc}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-neon-cyan to-neon-magenta text-background font-bold hover:opacity-90"
            >
              <a href={REPO_URL} target="_blank" rel="noreferrer">
                <Github className="mr-2 h-5 w-5" /> github.com/rasata/coldvault.dev
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/reports/example-summary">
                See an example report <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/blog/anatomy-of-a-deceptive-developer-attack">
                Read the case study
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/playbook">Open the Playbook</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="font-mono text-xs text-muted-foreground">{t.footer.tagline}</div>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <Link to="/blog/anatomy-of-a-deceptive-developer-attack" className="hover:text-neon-cyan">
            Case study
          </Link>
          <Link to="/playbook" className="hover:text-neon-magenta">
            Playbook
          </Link>
          <Link to="/reports/example-summary" className="hover:text-neon-cyan">
            Example report
          </Link>
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="hover:text-neon-cyan">
            {t.footer.github}
          </a>
          <a
            href="https://claude.com/claude-code"
            target="_blank"
            rel="noreferrer"
            className="hover:text-neon-cyan"
          >
            {t.footer.poweredBy}
          </a>
        </div>
      </div>
    </footer>
  );
}
