"use client";

import type { Baseline, Escenario } from "@/lib/types";
import { dict } from "@/lib/i18n";
import { formatMoneda } from "@/lib/format";
import { clamp } from "@/lib/finance";

// Tacómetro semicircular: indica, según el interés, si consolidar te conviene.
// Zonas fijas (ámbar → neutro → verde) + aguja que se mueve con los sliders.
const CX = 110;
const CY = 115;
const R = 88;
const W = 16;

function pointFor(v: number, radius = R) {
  const a = Math.PI * (1 - v); // v=0 → izquierda, v=0.5 → arriba, v=1 → derecha
  return {
    x: +(CX + radius * Math.cos(a)).toFixed(2),
    y: +(CY - radius * Math.sin(a)).toFixed(2),
  };
}

// Arco (semicírculo superior) entre dos valores del rango [0,1], como polilínea
// muestreada: la geometría es correcta sin depender de los flags del comando A de SVG.
function arc(vA: number, vB: number, radius = R) {
  const steps = 28;
  const pts = Array.from({ length: steps + 1 }, (_, i) => {
    const v = vA + (vB - vA) * (i / steps);
    return pointFor(v, radius);
  });
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

export default function InterestGauge({
  base,
  esc,
}: {
  base: Baseline;
  esc: Escenario;
}) {
  const g = dict.gauge;

  // score en [-1, 1]: -1 = cuesta mucho más interés, 0 = parejo, 1 = ahorrás todo.
  let score: number;
  if (base.hayDeudaImpagable) {
    score = 1; // de "nunca terminás" a un plan finito: máximo alivio
  } else if (base.interesActual > 0) {
    score = clamp(esc.interesAhorrado / base.interesActual, -1, 1);
  } else {
    score = esc.interes > 0 ? -1 : 0; // baseline sin interés; consolidar agregaría
  }
  const v = (score + 1) / 2;
  const aguja = pointFor(v, R - 24);

  let verdict: string;
  let tone: string;
  if (base.hayDeudaImpagable || score > 0.02) {
    verdict = g.conviene;
    tone = "text-brand-700";
  } else if (score < -0.02) {
    verdict = g.cuestaMas;
    tone = "text-attention-700";
  } else {
    verdict = g.parejo;
    tone = "text-muted";
  }

  let detalle: string;
  if (base.hayDeudaImpagable) {
    detalle = g.sinFecha;
  } else if (esc.interesAhorrado >= 0) {
    detalle = g.ahorras(formatMoneda(esc.interesAhorrado));
  } else {
    detalle = g.pagasMas(formatMoneda(-esc.interesAhorrado));
  }

  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-white p-5 shadow-soft">
      <p className="text-sm font-medium text-muted">{g.titulo}</p>
      <svg
        viewBox="0 0 220 150"
        role="img"
        aria-label={`${g.titulo} ${verdict}. ${detalle}`}
        className="w-full max-w-[260px]"
      >
        {/* Zonas */}
        <path
          d={arc(0, 0.45)}
          fill="none"
          stroke="#D98A1F"
          strokeWidth={W}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={arc(0.45, 0.55)}
          fill="none"
          stroke="#D8D0BF"
          strokeWidth={W}
          strokeLinejoin="round"
        />
        <path
          d={arc(0.55, 1)}
          fill="none"
          stroke="#2F9585"
          strokeWidth={W}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Aguja */}
        <line
          x1={CX}
          y1={CY}
          x2={aguja.x}
          y2={aguja.y}
          stroke="#1E2A2C"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r={7} fill="#1E2A2C" />
        {/* Etiquetas de los extremos */}
        <text
          x={pointFor(0).x + 2}
          y={CY + 22}
          textAnchor="start"
          fill="#8F5410"
          fontSize={11}
          fontWeight={600}
        >
          {g.leyendaMenos}
        </text>
        <text
          x={pointFor(1).x - 2}
          y={CY + 22}
          textAnchor="end"
          fill="#1A6259"
          fontSize={11}
          fontWeight={600}
        >
          {g.leyendaMas}
        </text>
      </svg>
      <p className={`text-lg font-semibold ${tone}`}>{verdict}</p>
      <p className="text-sm text-muted">{detalle}</p>
    </div>
  );
}
