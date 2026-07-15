# PRD — Respira

**Producto:** herramienta web que te muestra tu salida de deudas con calma y te conecta con un aliado.
**Nombre de trabajo:** Respira *(cambiable)* · **Autor:** Elian (LourDevs) · **Versión:** 1.0 · **Estado:** para construir
**Stack:** Next.js 14 (App Router) + TypeScript · Tailwind · Vercel · cálculo 100% client-side · captura de lead opcional (Firebase + n8n)

---

## 1. Visión

Muchas personas endeudadas no saben por dónde salir, y cuando piden ayuda en un banco las tratan
como un problema, no como alguien a quien acompañar. **Respira** es lo contrario: una herramienta
privada y sin juicios donde ordenás tus deudas, ves una **proyección real y honesta de tu salida**,
y das el primer paso con un **aliado que negocia por vos** — no un banco que te vende otro préstamo.

## 2. Problema y oportunidad

Salir de deudas es un dolor **común** (mucho más que un problema de nicho). Localmente ya existen
calculadoras y productos de consolidación, pero **todos son de bancos vendiendo su propio préstamo**
(conflicto de interés) o de asesores dispersos. El hueco real no es "otra calculadora": es un
**aliado neutral, privado y empático** que primero te ayuda a ver claro y luego te conecta con alguien
que está de tu lado. Ese posicionamiento está libre.

## 3. Diferenciación / posición

*"No somos un banco. No te vendemos un préstamo. Te ayudamos a ver tu salida y te conectamos con
alguien que negocia por vos."*

- **Neutral y de tu lado** (vs. bancos en conflicto de interés).
- **Privado por diseño:** el cálculo corre en tu navegador; tus números no salen de tu pantalla hasta
  que vos decidís dejar tus datos.
- **Honesto:** si consolidar **no** te conviene (alargar el plazo = más interés total), la herramienta
  te lo dice. Esa honestidad es el diferenciador en una industria llena de promesas.
- **Empático y sin vergüenza:** *"salir de deudas no es de irresponsables, es de valientes."*
- **Ecosistema:** termina en un aliado real (asesor) + captura de lead que puede alimentar tu Lead Engine.

## 4. Usuario objetivo

Persona con varias deudas (tarjetas, préstamos personales, consumo) que se siente ahogada y no sabe
por dónde empezar. Foco El Salvador / LatAm, en español. Secundario: el **asesor/institución** que
recibe leads calientes y motivados.

## 5. Principios de producto (no negociables)

1. **Privacidad primero:** cálculo client-side; nada se guarda ni se envía sin acción explícita del usuario.
2. **Honestidad sobre optimismo:** proyecciones realistas con rango y disclaimers; mostrar el tradeoff real.
3. **Empatía sin juicio:** tono cálido, digno, anti-vergüenza. Audiencia vulnerable, cero lenguaje predatorio.
4. **Simplicidad:** 3 pasos, sin registro, sin jerga.
5. **Utilidad real aunque no contraten:** que la persona salga con claridad de su situación, contrate o no.

## 6. Alcance

**MVP:**
- Flujo navegable de 3 pasos + resultado (bienvenida/privacidad → tus deudas → tu salida → primer paso).
- **Cálculo real client-side:** baseline (a como vas hoy) vs. escenario consolidado (ajustable).
- Proyección emocional y honesta (cuota, tiempo, interés, dinero liberado) con disclaimers.
- CTA a orientación con un asesor + captura de lead **opcional** (Firebase + webhook al Lead Engine).
- Enlace a recursos gratuitos (educación financiera de la SSF) como gesto de confianza.
- Español (i18n listo para sumar inglés después).

**Fuera de alcance (MVP):**
- Consultar burós de crédito o datos bancarios reales.
- Ofertas de préstamo reales / integración con entidades.
- Cuentas de usuario / historial.
- Asesoría financiera formal (la herramienta orienta y estima; no reemplaza a un profesional).

## 7. Flujos de usuario

1. **Bienvenida / privacidad:** hero empático, mensaje anti-vergüenza, promesa de privacidad
   ("anónimo, sin cuenta, tus números no salen de tu pantalla"). CTA "Empezar".
2. **Tus deudas (input):** agregar N deudas con `entidad, saldo, cuota mensual, tasa (%)`. Totales en vivo.
   Ingreso mensual opcional (para % de alivio). UI cálida y simple.
3. **Tu salida (resultado):** baseline vs. consolidado con **sliders** de tasa y plazo. Muestra:
   nueva cuota, meses a libertad, dinero liberado/mes, interés ahorrado — con framing emocional honesto.
4. **El primer paso (CTA + lead):** humanizar al asesor (te atiende sin juzgar, orientación gratis),
   ventajas reales, agendar reunión + dejar contacto (opcional). Privacidad reafirmada.

## 8. Lógica de cálculo (real, determinista, client-side)

Tasa mensual `r = APR/12/100`. Para cada deuda `i` (saldo `Bi`, cuota `Pi`, tasa `APRi`):
- **Meses a pago** (baseline): si `Pi <= Bi*ri` → **nunca se paga** (marcar alerta). Si no:
  `ni = -ln(1 - (Bi*ri)/Pi) / ln(1+ri)`, redondear hacia arriba.
- **Interés total** deuda i ≈ `Pi*ni - Bi`.
- **Tasa promedio ponderada** = `Σ(Bi*APRi) / Σ Bi`.

Baseline agregado: `deudaTotal = Σ Bi`, `cuotaActual = Σ Pi`, `mesesActual = max(ni)`,
`interesActual = Σ (Pi*ni - Bi)`.

Escenario consolidado (inputs del usuario vía slider: `tasaC`, `plazoC` meses):
- `rC = tasaC/12/100`; cuota `PC = rC==0 ? deudaTotal/plazoC : deudaTotal*rC / (1 - (1+rC)^(-plazoC))`.
- `interesConsolidado = PC*plazoC - deudaTotal`.
- **Dinero liberado/mes** = `cuotaActual - PC`.
- **Interés ahorrado** = `interesActual - interesConsolidado` (puede ser **negativo**).
- **Libre en** = `plazoC` meses (vs. `mesesActual`).

Valores por defecto: `tasaC` y `plazoC` con defaults razonables y editables; nota de referencia
"tasas de referencia SSF; ajustá a una oferta real". Nunca hardcodear una promesa de tasa.

## 9. Marco de honestidad (obligatorio)

- Si `interesAhorrado < 0`: mostrar claramente *"Bajás la cuota mensual, pero pagás más interés en
  total. Te conviene solo si necesitás aire ahora."* (no esconderlo).
- Si alguna deuda `nunca se paga` a la cuota actual: resaltar urgencia con empatía.
- Toda proyección marcada como **estimación, no garantía**, y **"no es asesoría financiera formal"**.
- Enlace a educación financiera gratuita (SSF: edufinanciera.ssf.gob.sv) para quien no quiera contratar.

## 10. Captura de lead (opcional) + ecosistema

`POST /api/lead` → guarda en Firestore `leads` (email, contacto, resumen del diagnóstico, fuente,
consentimiento) y, si `N8N_WEBHOOK_URL` existe, dispara el **Lead Engine** (reto 4). El "diagnóstico"
que se guarda es el resumen (deuda total, cuota, alivio estimado), **no** el detalle sensible de cada
deuda. Sin este paso, la herramienta funciona igual (privacidad total).

## 11. Requisitos no funcionales

- **Privacidad:** cálculo 100% client-side; nada persiste salvo que el usuario envíe el formulario.
- **Bienestar:** tono de apoyo, sin lenguaje predatorio ni alarmista; recursos de ayuda visibles.
- **a11y:** foco visible, roles ARIA, `prefers-reduced-motion`, contraste AA.
- **i18n:** español primero; estructura lista para inglés.
- **Performance:** liviano; sin dependencias pesadas (el cálculo es aritmética simple).

## 12. Stack y dependencias

Next.js 14 (App Router, TS strict) · Tailwind CSS · zod (validación del form) · (opcional para lead)
firebase-admin. Deploy: Vercel. Sin backend para el cálculo.

## 13. Variables de entorno (solo si se activa la captura de lead)
`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `N8N_WEBHOOK_URL` (opcional),
`NEXT_PUBLIC_APP_URL`. (Sin esto, el MVP corre igual, solo sin guardar leads.)

## 14. Hitos (orden de construcción)

1. Scaffold Next 14 + TS + Tailwind + estructura + i18n (es).
2. `lib/finance.ts` — todas las fórmulas del §8, con tests de sanidad.
3. Estado del flujo (pasos) + navegación (SPA de pantallas).
4. Paso 1 (bienvenida/privacidad) + Paso 2 (input de deudas con totales en vivo).
5. Paso 3 (resultado con sliders + framing emocional + marco de honestidad §9).
6. Paso 4 (CTA/aliado) + captura de lead opcional (`/api/lead` + Firebase + webhook).
7. Pulido: a11y, responsive, recursos de ayuda, disclaimers. Deploy en Vercel.

## 15. Criterios de aceptación

- [ ] El cálculo corre en el navegador; sin backend para las proyecciones.
- [ ] Baseline y consolidado usan las fórmulas del §8 y dan resultados correctos (verificar con casos).
- [ ] Si consolidar no conviene, la herramienta **lo dice** (marco de honestidad §9).
- [ ] Deudas que "nunca se pagan" a la cuota actual se resaltan.
- [ ] Disclaimers de estimación / no-asesoría siempre visibles en el resultado.
- [ ] Nada se guarda ni envía salvo que el usuario complete el formulario del Paso 4.
- [ ] Flujo navegable de 3 pasos + resultado, responsive y accesible. Deploy en Vercel.

## 16. Riesgos y consideraciones éticas

- **Audiencia vulnerable:** evitar cualquier lenguaje predatorio o promesas; honestidad y recursos de
  ayuda son parte del producto, no un extra.
- **Legal:** no es asesoría financiera formal; disclaimers claros; no recolectar datos sensibles sin
  consentimiento; el resumen guardado excluye el detalle de cada deuda.
- **Negocio:** el valor real depende de un **asesor confiable** al final del embudo. Sin ese aliado,
  construilo como herramienta de valor/portafolio, no como negocio de referidos.
