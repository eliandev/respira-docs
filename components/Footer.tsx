import { dict } from "@/lib/i18n";
import ExternalLink from "./ExternalLink";

// Recursos de ayuda + disclaimer siempre visibles, en todas las pantallas (PRD §9).
export default function Footer() {
  return (
    <footer className="border-t border-line px-5 py-6 sm:px-6">
      <div className="mx-auto flex max-w-content flex-col gap-2 text-xs text-muted">
        <p>
          {dict.honesty.noAsesoria} {dict.honesty.estimacion}
        </p>
        <ExternalLink
          href={dict.resources.ssfUrl}
          label={dict.resources.ssfLabel}
          className="w-fit font-medium"
        />
      </div>
    </footer>
  );
}
