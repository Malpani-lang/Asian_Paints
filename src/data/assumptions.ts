import type { StageId } from '../types';

/**
 * ASSUMPTION REGISTER.
 * The mentors asked for every number to be called out as an assumption with a reason,
 * "fair, not accurate, but not too off". Everything here is editable in the UI.
 * CASE = from the Round 2 case PDF. MENTOR = from the Asian Paints mentor session. ASSUMPTION = ours.
 */

export type Src = 'CASE' | 'MENTOR' | 'ASSUMPTION' | 'DERIVED';

export interface StageInputs {
  days0: number; // current inventory days
  sl0: number; // current service level (%)
  sl1: number; // proposed service level (%)
  removal: number; // % of excess / ageing stock removed by lifecycle discipline
}

export interface StageParams {
  W: number; // pipeline + cycle stock days (transit, batch runs, replenishment cycle)
  P: number; // planned seasonal / scheme pre-build days
  cv: number; // coefficient of variation of daily demand at depot level
  LT: number; // protection period L + T (days)
  T: number; // replenishment cycle (days)
  w: number; // annual obsolescence / write-off rate on stage inventory
  lost: number; // share of unfilled demand that is lost (rest waits / substitutes within the portfolio)
  floor: number; // minimum service (%)
  cap: number; // maximum service (%)
  rho: number; // demand correlation across depots
  a: number; // share of demand that must meet the dealer SLA (rest is schedulable: project call-offs, warranty jobs)
  cvDealer: number; // dealer-level daily demand CV
  stranded: number; // share of excess that can only be cleared by pulling it back and redeploying (fading local demand)
}

export const STAGE_INPUTS: Record<StageId, StageInputs> = {
  intro: { days0: 50, sl0: 84.5, sl1: 95, removal: 20 },
  growth: { days0: 42, sl0: 93, sl1: 97.3, removal: 10 },
  maturity: { days0: 42, sl0: 93.5, sl1: 97.3, removal: 5 },
  decline: { days0: 55, sl0: 95.5, sl1: 90, removal: 65 },
  exit: { days0: 60, sl0: 89.5, sl1: 88, removal: 65 },
};

export const STAGE_PARAMS: Record<StageId, StageParams> = {
  intro: { W: 20, P: 0, cv: 1.2, LT: 14, T: 7, w: 0.02, lost: 0.3, floor: 90, cap: 95, rho: 0.7, a: 1, cvDealer: 1.5, stranded: 0 },
  growth: { W: 18, P: 4, cv: 0.8, LT: 14, T: 7, w: 0.01, lost: 0.2, floor: 95, cap: 98, rho: 0.5, a: 1, cvDealer: 1.2, stranded: 0 },
  maturity: { W: 20, P: 8, cv: 0.5, LT: 14, T: 7, w: 0.005, lost: 0.2, floor: 95, cap: 98, rho: 0.4, a: 1, cvDealer: 1.0, stranded: 0 },
  decline: { W: 20, P: 0, cv: 0.9, LT: 21, T: 14, w: 0.04, lost: 0.1, floor: 90, cap: 95, rho: 0.15, a: 0.6, cvDealer: 1.3, stranded: 0.5 },
  exit: { W: 18, P: 0, cv: 1.3, LT: 37, T: 30, w: 0.06, lost: 0.05, floor: 88, cap: 92, rho: 0.1, a: 0.3, cvDealer: 1.5, stranded: 0.7 },
};

export interface Globals {
  fgBase: number; // ₹ Cr of FG inventory the results are scaled to
  h: number; // holding rate p.a. (capital + storage + handling + insurance), excl. obsolescence
  cm: number; // contribution margin on sales
  metro: number; // share of dealers in metro radius
  slaMetro: number; slaUp: number; // hours (MENTOR)
  depotMetro: number; depotUp: number; // hours depot → dealer
  hubMetro: number; hubUp: number; // hours hub → dealer
  depots: number; hubs: number;
  freight: number; // extra freight as % of COGS moved hub-direct
  zDealer: number;
}

export const GLOBALS: Globals = {
  fgBase: 100, h: 0.18, cm: 0.4, metro: 0.6,
  slaMetro: 4, slaUp: 12, depotMetro: 4, depotUp: 12, hubMetro: 24, hubUp: 36,
  depots: 160, hubs: 20, freight: 0.005, zDealer: 1.645,
};

export const SCENARIOS = {
  Conservative: 0.6,
  Base: 1,
  Stretch: 1.4,
} as const;
export type Scenario = keyof typeof SCENARIOS;

/** The register shown in the Assumptions drawer — value, source type, and the reason. */
export const REGISTER: { group: string; items: { k: string; v: string; src: Src; why: string }[] }[] = [
  {
    group: 'From the case (not assumptions)',
    items: [
      { k: 'Stage shares of SKUs / FG value / inventory cost', v: '8·18·45·20·9 / 12·22·48·13·5 / 15·25·40·15·5 %', src: 'CASE', why: 'Case §3–§4 tables.' },
      { k: 'Inventory band', v: '35–70 days', src: 'CASE', why: 'Case §3: “typically maintained between 35 and 70 days, depending on the SKU lifecycle stage”.' },
      { k: 'Obsolescence risk by stage', v: 'Low · Low · Very Low · High · Very High', src: 'CASE', why: 'Case §3 — mapped to write-off rates below.' },
      { k: 'Products A–G days and service', v: 'as in case §5', src: 'CASE', why: 'Used unchanged in the edge-case table.' },
    ],
  },
  {
    group: 'From the Asian Paints mentor session',
    items: [
      { k: 'Dealer delivery SLA', v: '4 h metro · 12 h upcountry', src: 'MENTOR', why: 'Same SLA for every dealer in a geography; no tiering by dealer.' },
      { k: 'Existing engine', v: 'SS / coverage logic exists', src: 'MENTOR', why: 'One policy for all SKUs today — PRISM only changes the inputs by lifecycle stage.' },
      { k: 'Seasonal push', v: 'scheme-driven pre-build', src: 'MENTOR', why: 'Early-order schemes (X, X−1, X−2) and pre-monsoon / pre-Diwali builds are planned stock — not excess, not decline.' },
      { k: 'New SKU at dealers', v: 'display minimum, then scale', src: 'MENTOR', why: 'Dealers hold minimum display stock until demand is proven.' },
      { k: 'Upgraded SKU', v: 'old variant liquidated first', src: 'MENTOR', why: 'Dealer orders are filled from the old variant first, before the new one ships.' },
    ],
  },
  {
    group: 'Cost assumptions',
    items: [
      { k: 'Holding rate', v: '18% p.a.', src: 'ASSUMPTION', why: 'Capital + storage + handling + insurance. Benchmarks put total carrying cost at 20–30% of inventory value; we take the low end because obsolescence is modelled separately.' },
      { k: 'Write-off rate', v: '2 · 1 · 0.5 · 4 · 6 % p.a.', src: 'ASSUMPTION', why: 'Scaled to the case’s obsolescence risk (Low, Low, Very Low, High, Very High).' },
      { k: 'Contribution margin', v: '40% of sales', src: 'ASSUMPTION', why: 'Used only to value lost sales. Replace with Finance’s actual figure.' },
      { k: 'Share of unfilled demand that is lost', v: '30 · 20 · 20 · 10 · 5 %', src: 'ASSUMPTION', why: 'A launch loses the trial; growth and mature SKUs partly wait or switch; a declining SKU’s demand moves to its successor.' },
      { k: 'Extra freight when served from a hub', v: '0.5% of COGS moved', src: 'ASSUMPTION', why: 'Longer, less consolidated secondary runs. Case §4: centralising raises logistics cost.' },
    ],
  },
  {
    group: 'Inventory structure (calibration)',
    items: [
      { k: 'Current stage days', v: '50 · 42 · 42 · 55 · 60', src: 'ASSUMPTION', why: 'Inside the case’s 35–70 band; Decline and Exit highest (case §3). Weighted average ≈ 45.6 days.' },
      { k: 'Current service', v: '84.5 · 93 · 93.5 · 95.5 · 89.5 %', src: 'DERIVED', why: 'Midpoints of the case products in each stage (C; D, F; A, B; E; G).' },
      { k: 'Pipeline + cycle stock', v: '18–20 days', src: 'ASSUMPTION', why: 'Transit, production batching and replenishment cycle. Not changed by PRISM.' },
      { k: 'Seasonal pre-build', v: '0 · 4 · 8 · 0 · 0 days', src: 'ASSUMPTION', why: 'Scheme-driven push sits mainly in stable (Growth, Maturity) ranges. Not changed by PRISM.' },
      { k: 'Demand variability (daily CV)', v: '1.2 · 0.8 · 0.5 · 0.9 · 1.3', src: 'ASSUMPTION', why: 'Highest for a launch and a tail, lowest for a mature range.' },
      { k: 'Excess removable by lifecycle discipline', v: '20 · 10 · 5 · 65 · 65 %', src: 'ASSUMPTION', why: 'Small for active stages; large where stock no longer has a job (stop forward deployment, terminal buy to BoQ).' },
      { k: 'Excess stranded at depots', v: '0 · 0 · 0 · 50 · 70 %', src: 'ASSUMPTION', why: 'Where local demand has faded, excess can only be cleared by pulling it back and redeploying. Case §4: centralising improves control over slow-moving stock.' },
    ],
  },
  {
    group: 'Network',
    items: [
      { k: 'Hub → dealer response', v: '24 h metro · 36 h upcountry', src: 'ASSUMPTION', why: 'Next-day at best from a regional hub.' },
      { k: 'Depots → hubs', v: '160 → 20', src: 'CASE', why: 'Round 1 case scale (160+ depots) and our Round 1 pooling example.' },
      { k: 'Demand correlation across depots', v: '0.7 · 0.5 · 0.4 · 0.15 · 0.1', src: 'ASSUMPTION', why: 'Launches and seasonal ranges move together nationally (campaigns, Diwali); tails are regional.' },
      { k: 'Demand that must meet the SLA', v: '100 · 100 · 100 · 60 · 30 %', src: 'ASSUMPTION', why: 'The rest is schedulable: warranty jobs, project call-offs.' },
      { k: 'Metro share of dealers', v: '60%', src: 'ASSUMPTION', why: 'Only used to blend the metro and upcountry SLAs.' },
    ],
  },
  {
    group: 'Policy guardrails',
    items: [
      { k: 'Service floor', v: '90 · 95 · 95 · 90 · 88 %', src: 'ASSUMPTION', why: 'Growth = Maturity (same service priority). Case §6: customers still expect reasonable service near end-of-life.' },
      { k: 'Service cap', v: '95 · 98 · 98 · 95 · 92 %', src: 'ASSUMPTION', why: 'Launch capped at 95% until demand is proven; 98% is the top of the case’s observed range.' },
    ],
  },
];

export const SOURCES = [
  { t: 'Chain Reaction 2026 — Round 2 case study (Asian Paints)', u: '', n: 'Stage shares, 35–70 day band, obsolescence risk, ecosystem drivers, Products A–G, ground rules.' },
  { t: 'Asian Paints mentor session (transcript)', u: '', n: 'SLA by geography, seasonal scheme push, FIFO on upgrades, display minimum for new SKUs, “justify the days with cost”.' },
  { t: 'NetSuite — Inventory carrying costs', u: 'https://www.netsuite.com/portal/resource/articles/inventory-management/inventory-carrying-costs.shtml', n: 'Carrying costs “often comprise 20% to 30% of total inventory value”; components: capital, storage, service, risk.' },
  { t: 'Maister (1976) — square-root law of inventory centralisation', u: '', n: 'Pooling benefit √(m/n); reduced by correlated demand.' },
  { t: 'Newsvendor / marginal analysis', u: '', n: 'Keep adding a day of cover while the margin it protects exceeds what it costs to carry.' },
];
