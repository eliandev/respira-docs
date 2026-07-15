# AGENTS.md — Respira

Manual operativo para construir Respira con Claude Code. Leé también `PRD.md` (qué y por qué); este
es el **cómo**. Si querés que se cargue solo, copialo como `CLAUDE.md`.

## Contexto en 3 líneas
Herramienta privada y empática que ordena las deudas de una persona, le muestra una **proyección real
y honesta** de su salida (consolidación), y la conecta con un asesor aliado. El cálculo corre 100% en
el navegador (privacidad). Público: personas endeudadas (foco El Salvador/LatAm). Diferenciador:
neutral, privado, honesto, sin juicio.

## Principios (no negociables)
1. **Privacidad por diseño.** Todo el cálculo es client-side. Nada se guarda ni se envía salvo que el
   usuario complete el formulario del Paso 4. No usar analytics que capturen los montos.
2. **Honestidad > optimismo.** Si consolidar no conviene (más interés total), decirlo. Toda proyección
   es "estimación, no garantía" y "no es asesoría financiera formal".
3. **Empatía sin juicio.** Audiencia vulnerable: tono cálido y digno, nunca alarmista ni predatorio.
4. **Matemática correcta.** Las fórmulas del PRD §8 se implementan tal cual, con tests de sanidad.
5. **Secrets solo en env** (solo si se activa la captura de lead). Nada sensible en el cliente ni en el repo.

## Stack
Next.js 14 (App Router, TS strict) · Tailwind CSS · zod. Opcional (lead): firebase-admin. Deploy: Vercel.
Sin backend para el cálculo.

## Estructura de carpetas
```
app/
  page.tsx                 # SPA de pantallas: bienvenida -> deudas -> salida -> primer paso
  api/lead/route.ts        # (opcional) POST: guarda lead + webhook
lib/
  finance.ts               # TODAS las fórmulas (baseline, consolidado, promedios)
  i18n.ts                  # diccionario es (estructura para en)
  types.ts                 # Deuda, Baseline, Escenario, Resultado
  firebase-admin.ts        # (opcional) Admin SDK singleton
components/
  StepWelcome.tsx  StepDebts.tsx  StepResult.tsx  StepAdvisor.tsx
  DebtRow.tsx  Sliders.tsx  ResultCards.tsx  HonestyNote.tsx  Disclaimer.tsx
firestore.rules            # (opcional)
.env.example
```

## Comandos
Dev `npm run dev` · Verificar `npm run build` · Lint `npm run lint`. Antes de dar por hecha una tarea,
corré `npm run build` y arreglá tipos.

## Setup de entorno
El MVP corre **sin** variables (cálculo puro). Solo si activás la captura de lead, creá `.env.local`
desde `.env.example`: `FIREBASE_*`, `N8N_WEBHOOK_URL` (opcional), `NEXT_PUBLIC_APP_URL`. Nunca pegues
esos valores en el chat ni los commitees.

## Orden de construcción (incremental, probando cada paso)

**Paso 1 — Scaffold.** Next 14 + TS strict + Tailwind. Estructura, `types.ts`, `i18n.ts` (es).
`npm run build` limpio.

**Paso 2 — `lib/finance.ts` (el corazón).** Implementar exactamente (ver PRD §8):
- `mesesAPago(saldo, cuota, apr)` → número de meses o `Infinity` si `cuota <= saldo*r` (marcar).
- `interesTotal(saldo, cuota, meses)`.
- `tasaPromedioPonderada(deudas)`.
- `baseline(deudas)` → `{ deudaTotal, cuotaActual, mesesActual, interesActual, alertas[] }`.
- `cuotaConsolidada(deudaTotal, apr, plazoMeses)` (manejar `apr==0`).
- `escenarioConsolidado(baseline, apr, plazoMeses)` →
  `{ cuota, meses, interes, dineroLiberadoMes, interesAhorrado, convieneInteres:boolean }`.
Agregar **tests de sanidad** (ej.: 1 deuda de 1000 a 0% con cuota 100 → 10 meses, 0 interés).

**Paso 3 — Estado del flujo.** Máquina simple de pasos (welcome→debts→result→advisor) + navegación
adelante/atrás. Estado de las deudas en memoria (nunca en localStorage, por privacidad y por entorno).

**Paso 4 — Paso 1 y 2.** Bienvenida con mensaje anti-vergüenza + promesa de privacidad. Input de
deudas: agregar/quitar filas (`entidad, saldo, cuota, tasa`), totales en vivo, validación con zod.

**Paso 5 — Paso 3 (resultado).** Cards con baseline vs consolidado; sliders de tasa y plazo que
recalculan en vivo; framing emocional ("de $X a $Y", "libre en Z meses", "recuperás $W/mes"). Aplicar
el **marco de honestidad** (PRD §9): si `interesAhorrado<0` mostrar el aviso; si hay deuda que "nunca
se paga", resaltarla. `Disclaimer` siempre visible.

**Paso 6 — Paso 4 (aliado) + lead opcional.** Humanizar al asesor, ventajas, agendar. Formulario que
(si está configurado) hace `POST /api/lead` → Firestore + webhook. Guardar **solo el resumen**
(deuda total, cuota, alivio estimado), nunca el detalle por deuda. Consentimiento explícito.

**Paso 7 — Pulido.** a11y (`prefers-reduced-motion`, ARIA, foco, contraste AA), responsive, recursos
de ayuda (link SSF), copys finales. `npm run build` limpio. Deploy en Vercel.

## Edge cases (manejar sí o sí)
- `cuota <= saldo*tasaMensual` → la deuda nunca se paga: no calcular meses infinitos, marcar alerta.
- `apr==0` en consolidación → cuota = deudaTotal/plazo (evitar división por potencia).
- Plazo o tasa 0/negativos en sliders → clamp a rangos válidos.
- Sin deudas cargadas → deshabilitar el paso de resultado con mensaje amable.
- Números grandes / decimales → formatear moneda local; no romper con NaN (validar inputs).

## Guardrails (ética + privacidad)
- Nunca prometer resultados; toda cifra es estimación con disclaimer.
- Nunca esconder que consolidar puede costar más interés (mostrarlo).
- No lenguaje alarmista, culposo ni predatorio; audiencia vulnerable.
- No persistir ni enviar los montos sin acción explícita del usuario; el resumen guardado excluye el
  detalle por deuda.
- Recursos de ayuda gratuitos visibles (educación financiera SSF).
- Secrets solo en servidor (solo si se usa la captura de lead).

## Definición de "hecho"
Compila (`npm run build`), tipos correctos, fórmulas verificadas con casos, edge cases cubiertos,
disclaimers y marco de honestidad presentes, privacidad respetada (sin persistencia sin consentimiento).

## Referencias
- Contratos de cálculo y honestidad: `PRD.md` §8–§9.
- Estilo: cálido/sereno; paleta que transmita calma y confianza (no rojo de alarma). Definir en el Paso 1.
