import { dict } from "@/lib/i18n";
import { card } from "@/lib/ui";
import ExternalLink from "./ExternalLink";

// Recursos gratuitos visibles: gesto de confianza para quien no quiera contratar (PRD §9).
export default function Resources() {
  const r = dict.resources;
  return (
    <div className={card}>
      <p className="font-medium text-ink">{r.titulo}</p>
      <p className="mt-1 text-sm text-muted">{r.texto}</p>
      <ExternalLink
        href={r.ssfUrl}
        label={r.ssfLabel}
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium"
      />
    </div>
  );
}
