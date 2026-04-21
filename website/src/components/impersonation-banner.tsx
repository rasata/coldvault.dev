import * as React from "react";

const OFFICIAL_ORIGIN = import.meta.env.VITE_OFFICIAL_ORIGIN || "coldvault.dev";
const OFFICIAL_URL = `https://${OFFICIAL_ORIGIN}`;

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);

function isOfficialHost(hostname: string): boolean {
  if (!hostname) return true;
  if (LOCAL_HOSTS.has(hostname)) return true;
  if (hostname.endsWith(".local")) return true;
  if (hostname === OFFICIAL_ORIGIN) return true;
  if (hostname.endsWith(`.${OFFICIAL_ORIGIN}`)) return true;
  return false;
}

const MESSAGES: Record<string, { title: string; body: string; cta: string }> = {
  en: {
    title: "Unofficial copy",
    body: "This is not the official Coldvault site. Verify the address and prefer the canonical source.",
    cta: "Open the official site",
  },
  fr: {
    title: "Copie non officielle",
    body: "Ce n'est pas le site officiel Coldvault. Vérifiez l'adresse et privilégiez la source canonique.",
    cta: "Ouvrir le site officiel",
  },
  de: {
    title: "Inoffizielle Kopie",
    body: "Dies ist nicht die offizielle Coldvault-Website. Überprüfen Sie die Adresse und bevorzugen Sie die kanonische Quelle.",
    cta: "Offizielle Seite öffnen",
  },
  es: {
    title: "Copia no oficial",
    body: "Este no es el sitio oficial de Coldvault. Verifique la dirección y prefiera la fuente canónica.",
    cta: "Abrir el sitio oficial",
  },
  zh: {
    title: "非官方副本",
    body: "这不是官方 Coldvault 网站。请核实地址并使用官方来源。",
    cta: "打开官方网站",
  },
  ja: {
    title: "非公式コピー",
    body: "これは公式の Coldvault サイトではありません。アドレスを確認し、正規のソースをご利用ください。",
    cta: "公式サイトを開く",
  },
  ko: {
    title: "비공식 복제본",
    body: "이 사이트는 공식 Coldvault 사이트가 아닙니다. 주소를 확인하고 정식 출처를 이용하세요.",
    cta: "공식 사이트 열기",
  },
  ar: {
    title: "نسخة غير رسمية",
    body: "هذا ليس موقع Coldvault الرسمي. تحقق من العنوان واستخدم المصدر الرسمي.",
    cta: "فتح الموقع الرسمي",
  },
};

function pickLocale(): keyof typeof MESSAGES {
  if (typeof navigator === "undefined") return "en";
  const nav = navigator.language?.slice(0, 2).toLowerCase();
  if (nav && nav in MESSAGES) return nav as keyof typeof MESSAGES;
  return "en";
}

export function ImpersonationBanner() {
  const [unofficial, setUnofficial] = React.useState(false);
  const [currentHost, setCurrentHost] = React.useState("");
  const locale = React.useMemo(pickLocale, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const host = window.location.hostname;
    setCurrentHost(host);
    if (!isOfficialHost(host)) {
      setUnofficial(true);
      const robots = document.createElement("meta");
      robots.name = "robots";
      robots.content = "noindex,nofollow,noarchive";
      document.head.appendChild(robots);
    }
  }, []);

  if (!unofficial) return null;

  const m = MESSAGES[locale];

  return (
    <div
      role="alert"
      className="sticky top-0 z-[100] w-full border-b-2 border-red-600 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 h-5 w-5 shrink-0"
            aria-hidden="true"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div className="text-sm leading-snug">
            <strong className="font-semibold">{m.title}</strong>
            <span className="mx-2 opacity-60">·</span>
            <span>{m.body}</span>
            {currentHost && (
              <span className="ml-2 font-mono text-xs opacity-70">
                ({currentHost})
              </span>
            )}
          </div>
        </div>
        <a
          href={OFFICIAL_URL}
          rel="noopener"
          className="shrink-0 rounded-md border border-red-600 bg-white px-3 py-1.5 text-center text-sm font-medium hover:bg-red-100 dark:bg-red-900 dark:hover:bg-red-800"
        >
          {m.cta} →
        </a>
      </div>
    </div>
  );
}
