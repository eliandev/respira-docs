"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { STEP_ORDER, type Deuda, type Step } from "@/lib/types";
import Stepper from "./Stepper";
import StepWelcome from "./StepWelcome";
import StepDebts from "./StepDebts";
import StepResult from "./StepResult";
import StepAdvisor from "./StepAdvisor";
import Footer from "./Footer";

// Defaults consolidado: razonables y editables (PRD §8). Referencia SSF, no una promesa.
const TASA_DEFAULT = 18;
const PLAZO_DEFAULT = 36;

interface State {
  step: Step;
  deudas: Deuda[];
  ingresoMensual: number | null;
  tasaConsolidada: number;
  plazoConsolidado: number;
  leadEnviado: boolean;
}

type Action =
  | { type: "add_deuda" }
  | { type: "update_deuda"; id: string; patch: Partial<Deuda> }
  | { type: "remove_deuda"; id: string }
  | { type: "set_ingreso"; value: number | null }
  | { type: "set_tasa"; value: number }
  | { type: "set_plazo"; value: number }
  | { type: "go"; step: Step }
  | { type: "next" }
  | { type: "back" }
  | { type: "set_lead_enviado"; value: boolean };

const initialState: State = {
  step: "welcome",
  deudas: [],
  ingresoMensual: null,
  tasaConsolidada: TASA_DEFAULT,
  plazoConsolidado: PLAZO_DEFAULT,
  leadEnviado: false,
};

function nuevaDeuda(): Deuda {
  return { id: crypto.randomUUID(), entidad: "", saldo: 0, cuota: 0, tasa: 0 };
}

// No se puede llegar a resultado/aliado sin al menos una deuda cargada.
function destinoValido(step: Step, deudas: Deuda[]): Step {
  if ((step === "result" || step === "advisor") && deudas.length === 0) {
    return "debts";
  }
  return step;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add_deuda":
      return { ...state, deudas: [...state.deudas, nuevaDeuda()] };
    case "update_deuda":
      return {
        ...state,
        deudas: state.deudas.map((d) =>
          d.id === action.id ? { ...d, ...action.patch } : d,
        ),
      };
    case "remove_deuda":
      return { ...state, deudas: state.deudas.filter((d) => d.id !== action.id) };
    case "set_ingreso":
      return { ...state, ingresoMensual: action.value };
    case "set_tasa":
      return { ...state, tasaConsolidada: action.value };
    case "set_plazo":
      return { ...state, plazoConsolidado: action.value };
    case "go":
      return { ...state, step: destinoValido(action.step, state.deudas) };
    case "next": {
      const i = STEP_ORDER.indexOf(state.step);
      const target = STEP_ORDER[Math.min(i + 1, STEP_ORDER.length - 1)];
      return { ...state, step: destinoValido(target, state.deudas) };
    }
    case "back": {
      const i = STEP_ORDER.indexOf(state.step);
      return { ...state, step: STEP_ORDER[Math.max(i - 1, 0)] };
    }
    case "set_lead_enviado":
      return { ...state, leadEnviado: action.value };
    default:
      return state;
  }
}

interface RespiraCtx {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const Context = createContext<RespiraCtx | null>(null);

export function useRespira(): RespiraCtx {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useRespira debe usarse dentro de <RespiraApp>");
  return ctx;
}

export default function RespiraApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  // a11y: al cambiar de paso, llevar el foco al comienzo del contenido.
  const mainRef = useRef<HTMLElement>(null);
  const primerRender = useRef(true);
  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    mainRef.current?.focus();
    mainRef.current?.scrollIntoView({ block: "start" });
  }, [state.step]);

  return (
    <Context.Provider value={value}>
      <div className="flex min-h-dvh flex-col">
        <Stepper step={state.step} />
        <main
          ref={mainRef}
          tabIndex={-1}
          className="mx-auto w-full max-w-content flex-1 scroll-mt-20 px-5 pb-16 outline-none sm:px-6"
        >
          {state.step === "welcome" && <StepWelcome />}
          {state.step === "debts" && <StepDebts />}
          {state.step === "result" && <StepResult />}
          {state.step === "advisor" && <StepAdvisor />}
        </main>
        <Footer />
      </div>
    </Context.Provider>
  );
}
