import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { StageId } from './types';
import { GLOBALS, SCENARIOS, STAGE_INPUTS, STAGE_PARAMS, type Globals, type Scenario, type StageInputs, type StageParams } from './data/assumptions';
import { portfolio, recommend, stage, type NetOption, type StageResult } from './utils/model';

export const IDS: StageId[] = ['intro', 'growth', 'maturity', 'decline', 'exit'];

function useModelState() {
  const [inputs, setInputs] = useState<Record<StageId, StageInputs>>(() => structuredClone(STAGE_INPUTS));
  const [params, setParams] = useState<Record<StageId, StageParams>>(() => structuredClone(STAGE_PARAMS));
  const [globals, setGlobals] = useState<Globals>(() => ({ ...GLOBALS }));
  const [scenario, setScenario] = useState<Scenario>('Base');
  const [netChoice, setNetChoice] = useState<Partial<Record<StageId, NetOption>>>({}); // unset = follow recommendation

  const mult = SCENARIOS[scenario];
  const recs = useMemo(() => Object.fromEntries(IDS.map((id) => [id, recommend(id, inputs[id], params[id], globals, mult)])) as Record<StageId, ReturnType<typeof recommend>>, [inputs, params, globals, mult]);
  const chosen = Object.fromEntries(IDS.map((id) => [id, netChoice[id] ?? recs[id].best])) as Record<StageId, NetOption>;
  const results = useMemo(() => Object.fromEntries(IDS.map((id) => [id, stage(id, inputs[id], params[id], globals, chosen[id], mult)])) as Record<StageId, StageResult>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputs, params, globals, mult, JSON.stringify(chosen)]);
  const total = useMemo(() => portfolio(IDS.map((id) => results[id]), globals), [results, globals]);

  const setInput = (id: StageId, k: keyof StageInputs, v: number) => setInputs((p) => ({ ...p, [id]: { ...p[id], [k]: v } }));
  const setParam = (id: StageId, k: keyof StageParams, v: number) => setParams((p) => ({ ...p, [id]: { ...p[id], [k]: v } }));
  const setGlobal = (k: keyof Globals, v: number) => setGlobals((p) => ({ ...p, [k]: v }));
  const reset = () => { setInputs(structuredClone(STAGE_INPUTS)); setParams(structuredClone(STAGE_PARAMS)); setGlobals({ ...GLOBALS }); setScenario('Base'); setNetChoice({}); };

  return { inputs, params, globals, scenario, setScenario, recs, chosen, netChoice, setNetChoice, results, total, setInput, setParam, setGlobal, reset, mult };
}

type Model = ReturnType<typeof useModelState>;
const Ctx = createContext<Model | null>(null);
export function ModelProvider({ children }: { children: ReactNode }) {
  const m = useModelState();
  return <Ctx.Provider value={m}>{children}</Ctx.Provider>;
}
export function useModel() {
  const m = useContext(Ctx);
  if (!m) throw new Error('useModel outside provider');
  return m;
}
