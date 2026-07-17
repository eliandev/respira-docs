"use client";

import { useMemo, useState } from "react";
import { dict } from "@/lib/i18n";
import { useRespira } from "./RespiraApp";
import { useResultado } from "./useResultado";
import { construirResumen } from "@/lib/finance";
import { leadSchema } from "@/lib/validation";
import { LEAD_CAPTURE_ENABLED } from "@/lib/config";
import type { ContactoPreferido } from "@/lib/types";
import { btnGhost, btnPrimary, card, cn, textInput } from "@/lib/ui";
import StepHeader from "./StepHeader";
import Resources from "./Resources";

const OPCIONES: ContactoPreferido[] = ["whatsapp", "telefono", "email"];

function mensajeError(path: unknown): string {
  const e = dict.errores;
  if (path === "nombre") return e.nombreRequerido;
  if (path === "contacto") return e.contactoRequerido;
  if (path === "consentimiento") return e.consentimientoRequerido;
  return e.contactoRequerido;
}

export default function StepAdvisor() {
  const { state, dispatch } = useRespira();
  const t = dict.advisor;

  const { base, esc } = useResultado(
    state.deudas,
    state.tasaConsolidada,
    state.plazoConsolidado,
  );
  const resumen = useMemo(
    () => construirResumen(base, esc, state.deudas.length),
    [base, esc, state.deudas.length],
  );

  const [nombre, setNombre] = useState("");
  const [preferido, setPreferido] = useState<ContactoPreferido>("whatsapp");
  const [contacto, setContacto] = useState("");
  const [consent, setConsent] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contactoLabel =
    preferido === "email" ? t.form.contactoEmail : t.form.contactoTelefono;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      nombre,
      contacto,
      contactoPreferido: preferido,
      consentimiento: consent,
      resumen,
    };
    const check = leadSchema.safeParse(payload);
    if (!check.success) {
      const issue = check.error.issues[0];
      const path = issue?.path?.[0];
      setError(
        issue?.message === "email_invalido"
          ? dict.errores.emailInvalido
          : mensajeError(path),
      );
      return;
    }
    setEnviando(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(check.data),
      });
      if (!res.ok) throw new Error("bad");
      dispatch({ type: "set_lead_enviado", value: true });
    } catch {
      setError("No pudimos enviar tus datos ahora. Probá de nuevo en un momento.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="flex flex-col gap-6 py-6">
      <StepHeader title={t.title} subtitle={t.subtitle} />

      <ul className="flex flex-col gap-2">
        {t.puntos.map((p) => (
          <li key={p} className="flex gap-3 text-sm text-ink">
            <span aria-hidden className="mt-0.5 text-brand-600">
              ✓
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>

      {state.leadEnviado ? (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6">
          <p className="text-lg font-semibold text-brand-800">{t.exito.titulo}</p>
          <p className="mt-1 text-sm text-ink">{t.exito.texto}</p>
        </div>
      ) : LEAD_CAPTURE_ENABLED ? (
        <form
          onSubmit={onSubmit}
          noValidate
          className={cn("flex flex-col gap-4", card)}
        >
          <p className="font-medium text-ink">{t.form.titulo}</p>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink">
              {t.form.nombre}
            </span>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder={t.form.nombrePlaceholder}
              autoComplete="name"
              className={cn(textInput, "placeholder:text-sand-400")}
            />
          </label>

          <fieldset>
            <legend className="mb-1 text-sm font-medium text-ink">
              {t.form.preferencia}
            </legend>
            <div className="flex flex-wrap gap-2">
              {OPCIONES.map((op) => (
                <label
                  key={op}
                  className={`cursor-pointer rounded-lg border px-4 py-2 text-sm transition-colors ${
                    preferido === op
                      ? "border-brand-400 bg-brand-50 font-medium text-brand-700"
                      : "border-line bg-white text-muted hover:border-brand-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="preferido"
                    value={op}
                    checked={preferido === op}
                    onChange={() => setPreferido(op)}
                    className="sr-only"
                  />
                  {t.form.opciones[op]}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink">
              {contactoLabel}
            </span>
            <input
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              inputMode={preferido === "email" ? "email" : "tel"}
              autoComplete={preferido === "email" ? "email" : "tel"}
              className={textInput}
            />
          </label>

          <label className="flex items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-brand-600"
            />
            <span>{t.form.consentimiento}</span>
          </label>

          {error ? (
            <p role="alert" className="text-sm text-attention-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={enviando}
            className={cn(
              btnPrimary,
              "px-6 py-3 disabled:cursor-not-allowed disabled:bg-sand-300",
            )}
          >
            {enviando ? t.form.enviando : t.form.enviar}
          </button>

          <p className="text-xs text-muted">
            <span aria-hidden>🔒 </span>
            {t.form.privacidad}
          </p>
        </form>
      ) : (
        <div className={cn(card, "text-sm text-muted")}>{t.sinConfig}</div>
      )}

      <Resources />

      <div className="pt-2">
        <button
          type="button"
          onClick={() => dispatch({ type: "back" })}
          className={btnGhost}
        >
          {t.volver}
        </button>
      </div>
    </section>
  );
}
