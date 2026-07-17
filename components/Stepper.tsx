import { dict } from "@/lib/i18n";
import { STEP_ORDER, type Step } from "@/lib/types";

export default function Stepper({ step }: { step: Step }) {
  const idx = STEP_ORDER.indexOf(step);
  const total = STEP_ORDER.length;
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-sand-50/85 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center gap-4 px-5 py-3 sm:px-6">
        <span className="text-base font-semibold tracking-tight text-brand-700">
          {dict.common.appName}
        </span>
        <div className="ml-auto flex items-center gap-1.5" aria-hidden="true">
          {STEP_ORDER.map((s, i) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                i <= idx ? "w-6 bg-brand-500" : "w-3 bg-sand-300"
              }`}
            />
          ))}
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {dict.nav.pasoDe(idx + 1, total)}: {dict.nav.pasos[idx]}
        </p>
      </div>
    </header>
  );
}
