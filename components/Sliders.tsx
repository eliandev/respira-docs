"use client";

import { dict } from "@/lib/i18n";

interface Props {
  tasa: number;
  plazo: number;
  onTasa: (n: number) => void;
  onPlazo: (n: number) => void;
}

export default function Sliders({ tasa, plazo, onTasa, onPlazo }: Props) {
  const s = dict.result.sliders;
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-5 shadow-soft">
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor="slider-tasa" className="text-sm font-medium text-ink">
            {s.tasa}
          </label>
          <span className="text-sm font-semibold text-brand-700">
            {tasa.toFixed(1)}%
          </span>
        </div>
        <input
          id="slider-tasa"
          type="range"
          min={0}
          max={60}
          step={0.5}
          value={tasa}
          onChange={(e) => onTasa(parseFloat(e.target.value))}
          className="w-full accent-brand-600"
          aria-valuetext={`${tasa.toFixed(1)} por ciento`}
        />
      </div>
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor="slider-plazo" className="text-sm font-medium text-ink">
            {s.plazo}
          </label>
          <span className="text-sm font-semibold text-brand-700">
            {plazo} {s.meses}
          </span>
        </div>
        <input
          id="slider-plazo"
          type="range"
          min={6}
          max={84}
          step={1}
          value={plazo}
          onChange={(e) => onPlazo(parseInt(e.target.value, 10))}
          className="w-full accent-brand-600"
          aria-valuetext={`${plazo} meses`}
        />
      </div>
      <p className="text-xs text-muted">{dict.result.referencia}</p>
    </div>
  );
}
