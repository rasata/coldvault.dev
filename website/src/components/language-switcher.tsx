import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, LOCALE_META, useTranslation } from "@/i18n/context";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();
  const current = LOCALE_META[locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={t.nav.language}
          className="gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <Globe className="h-4 w-4" />
          <span aria-hidden>{current.flag}</span>
          <span className="hidden sm:inline">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {t.nav.language}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LOCALES.map((l) => {
          const meta = LOCALE_META[l];
          const active = l === locale;
          return (
            <DropdownMenuItem
              key={l}
              onSelect={() => setLocale(l)}
              className="flex items-center justify-between gap-3"
            >
              <span className="flex items-center gap-2">
                <span aria-hidden>{meta.flag}</span>
                <span>{meta.label}</span>
              </span>
              {active ? <Check className="h-4 w-4 text-neon-cyan" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
