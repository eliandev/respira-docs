import { dict } from "@/lib/i18n";

// Recursos gratuitos visibles: gesto de confianza para quien no quiera contratar (PRD §9).
export default function Resources() {
  const r = dict.resources;
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
      <p className="font-medium text-ink">{r.titulo}</p>
      <p className="mt-1 text-sm text-muted">{r.texto}</p>
      <a
        href={r.ssfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
      >
        {r.ssfLabel} <span aria-hidden>↗</span>
      </a>
    </div>
  );
}
