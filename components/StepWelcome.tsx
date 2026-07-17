"use client";

import { dict } from "@/lib/i18n";
import { useRespira } from "./RespiraApp";
import { btnPrimary, cn } from "@/lib/ui";

export default function StepWelcome() {
  const { dispatch } = useRespira();
  const t = dict.welcome;

  return (
    <section className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          {t.eyebrow}
        </p>
        <h1 className="text-balance text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {t.title}
        </h1>
        <p className="text-lg leading-relaxed text-muted">{t.subtitle}</p>
      </div>

      <ul className="flex flex-col gap-3">
        {t.puntos.map((p) => (
          <li
            key={p.titulo}
            className="flex gap-3 rounded-2xl border border-line bg-white p-4 shadow-soft"
          >
            <span
              aria-hidden
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700"
            >
              ✓
            </span>
            <div>
              <p className="font-medium text-ink">{p.titulo}</p>
              <p className="text-sm text-muted">{p.texto}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="rounded-2xl bg-brand-50 p-4 text-sm leading-relaxed text-brand-800">
        <span aria-hidden>🔒 </span>
        {t.privacy}
      </p>

      <button
        type="button"
        onClick={() => dispatch({ type: "next" })}
        className={cn(
          btnPrimary,
          "w-full px-6 py-4 text-base sm:w-auto sm:self-start",
        )}
      >
        {t.cta}
      </button>
    </section>
  );
}
