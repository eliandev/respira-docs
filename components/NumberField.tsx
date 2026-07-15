"use client";

import { useState } from "react";

interface Props {
  label: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}

/**
 * Campo numérico con estado local de texto para permitir escribir con comodidad
 * (ej. "12.") sin que el número controlado "pelee" con el cursor. Solo acepta
 * dígitos y punto; hacia afuera siempre emite un number finito.
 */
export default function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
}: Props) {
  const [raw, setRaw] = useState(value ? String(value) : "");

  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-ink">{label}</span>
      <span className="flex items-center rounded-lg border border-line bg-sand-50 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
        {prefix ? (
          <span aria-hidden className="pl-3 text-muted">
            {prefix}
          </span>
        ) : null}
        <input
          type="text"
          inputMode="decimal"
          value={raw}
          placeholder={placeholder}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9.]/g, "");
            setRaw(v);
            const n = parseFloat(v);
            onChange(Number.isFinite(n) ? n : 0);
          }}
          className="w-full bg-transparent px-3 py-2 text-ink outline-none placeholder:text-sand-400"
        />
        {suffix ? (
          <span aria-hidden className="pr-3 text-muted">
            {suffix}
          </span>
        ) : null}
      </span>
    </label>
  );
}
