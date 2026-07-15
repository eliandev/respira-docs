import { dict } from "@/lib/i18n";

// Siempre visible en el resultado (PRD §9, criterios de aceptación).
export default function Disclaimer() {
  return (
    <p className="rounded-xl border border-line bg-sand-100 p-4 text-xs leading-relaxed text-muted">
      <span className="font-semibold text-ink">{dict.honesty.estimacion}</span>{" "}
      {dict.disclaimer.texto} {dict.honesty.noAsesoria}
    </p>
  );
}
