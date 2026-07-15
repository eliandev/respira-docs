# Respira

Herramienta web privada y sin juicios para ver una **proyección honesta de tu salida de deudas**
y, si querés, conectarte con un asesor aliado que negocia por vos.

> No somos un banco. No te vendemos un préstamo. Te ayudamos a ver tu salida.

El cálculo corre **100% en tu navegador**: tus números no salen de tu pantalla hasta que vos lo
decidís. Ver [`PRD.md`](./PRD.md) (qué y por qué) y [`AGENTS.md`](./AGENTS.md) (cómo se construyó).

## Principios

- **Privacidad por diseño** — cálculo client-side; nada se guarda ni se envía sin acción explícita.
- **Honestidad > optimismo** — si consolidar cuesta más interés, la herramienta lo dice. Toda cifra
  es estimación, no garantía, y no es asesoría financiera formal.
- **Empatía sin juicio** — audiencia vulnerable: tono cálido, paleta serena, cero lenguaje predatorio.

## Stack

Next.js 14 (App Router, TS strict) · Tailwind CSS · Zod · Vitest · Vercel.
Opcional para captura de lead: `firebase-admin` + webhook n8n.

## Empezar

```bash
npm install
npm run dev      # http://localhost:3000
```

| Comando          | Qué hace                                  |
| ---------------- | ----------------------------------------- |
| `npm run dev`    | Servidor de desarrollo                    |
| `npm run build`  | Build de producción (type-check + lint)   |
| `npm run lint`   | ESLint                                    |
| `npm test`       | Tests de sanidad de las fórmulas (Vitest) |

El MVP corre **sin variables de entorno**.

## Estructura

```
app/
  page.tsx              # Monta la SPA de pantallas
  layout.tsx            # Metadata, fuente, lang="es"
  api/lead/route.ts     # (opcional) POST: guarda lead + webhook
lib/
  finance.ts            # TODAS las fórmulas (PRD §8) + construirResumen
  finance.test.ts       # Tests de sanidad
  types.ts  i18n.ts  format.ts  validation.ts  config.ts
  firebase-admin.ts     # (opcional) Admin SDK, import dinámico
components/
  RespiraApp.tsx        # Estado del flujo (welcome→debts→result→advisor)
  Stepper · StepWelcome · StepDebts · DebtRow · NumberField
  StepResult · ResultCards · Sliders · HonestyNote · Disclaimer
  StepAdvisor · Resources · Footer
firestore.rules         # (opcional) deny-all; los leads solo se escriben desde el servidor
```

## Cálculo

Baseline (a como vas hoy) vs. escenario consolidado (ajustable con sliders de tasa y plazo).
Fórmulas deterministas en [`lib/finance.ts`](./lib/finance.ts), verificadas con casos en
[`lib/finance.test.ts`](./lib/finance.test.ts). Contrato completo en `PRD.md` §8–§9.

Casos de honestidad cubiertos: si consolidar cuesta más interés total, se muestra un aviso; si una
deuda "nunca se paga" a la cuota actual, se resalta con empatía.

## Captura de lead (opcional)

Apagada por defecto (privacidad). Para activar el formulario de contacto del Paso 4:

1. `NEXT_PUBLIC_LEAD_CAPTURE=on` (muestra el formulario en el cliente).
2. Configurá el almacenamiento en el servidor — **Firebase** (`FIREBASE_PROJECT_ID`,
   `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) y/o el **webhook** (`N8N_WEBHOOK_URL`).

Copiá [`.env.example`](./.env.example) a `.env.local` y completá lo que uses.

Se guarda **solo el resumen** (deuda total, cuota, alivio estimado), **nunca** el detalle de cada
deuda. Sin backend configurado, `POST /api/lead` responde `200 { stored: false }` (no-op) y el MVP
sigue funcionando igual.

## Accesibilidad e i18n

- Foco gestionado al cambiar de paso, `:focus-visible` visible, `prefers-reduced-motion` respetado,
  ARIA en sliders/errores/avisos, contraste AA, HTML semántico.
- Español primero; `lib/i18n.ts` está listo para sumar inglés (misma forma, otro objeto).

## Deploy y flujo de trabajo

Deploy en **Vercel** (framework Next.js autodetectado). Flujo recomendado antes de producción:

1. Crear una **rama** por cambio.
2. Abrir un **Pull Request** → genera un **Preview Deployment** en Vercel.
3. **QA** sobre el preview (flujo completo, mobile/desktop, casos de honestidad).
4. Revisión y merge a `main` → deploy a producción.

Variables de entorno (solo si activás la captura de lead): cargar los `FIREBASE_*`,
`N8N_WEBHOOK_URL`, `NEXT_PUBLIC_LEAD_CAPTURE` y `NEXT_PUBLIC_APP_URL` en el proyecto de Vercel.
