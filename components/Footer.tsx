import { dict } from "@/lib/i18n";

// Recursos de ayuda + disclaimer siempre visibles, en todas las pantallas (PRD §9).
export default function Footer() {
  return (
    <footer className="border-t border-line px-5 py-6 sm:px-6">
      <div className="mx-auto flex max-w-content flex-col gap-2 text-xs text-muted">
        <p>
          {dict.honesty.noAsesoria} {dict.honesty.estimacion}
        </p>
        <a
          href={dict.resources.ssfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
        >
          {dict.resources.ssfLabel} <span aria-hidden>↗</span>
        </a>
      </div>
    </footer>
  );
}
