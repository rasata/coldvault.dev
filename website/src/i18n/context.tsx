import * as React from "react";
import {
  LOCALES,
  LOCALE_META,
  RTL_LOCALES,
  translations,
  type Dictionary,
  type Locale,
} from "./translations";

const DEFAULT_LOCALE: Locale = "en";
const STORAGE_KEY = "coldvault.locale";

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dictionary;
  dir: "ltr" | "rtl";
};

const I18nContext = React.createContext<I18nContextValue | null>(null);

function isLocale(v: string | null | undefined): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v);
}

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // ignore
  }
  const nav = window.navigator?.language?.slice(0, 2).toLowerCase();
  if (isLocale(nav)) return nav;
  return DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(DEFAULT_LOCALE);

  React.useEffect(() => {
    setLocaleState(detectInitialLocale());
  }, []);

  const dir: "ltr" | "rtl" = RTL_LOCALES.has(locale) ? "rtl" : "ltr";

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  const value = React.useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t: translations[locale], dir }),
    [locale, setLocale, dir],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation(): I18nContextValue {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used inside <I18nProvider>");
  return ctx;
}

export { LOCALES, LOCALE_META, type Locale };
