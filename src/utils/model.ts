import type { StageId } from '../types';
import { STAGES } from '../data/caseData';
import type { Globals, StageInputs, StageParams } from '../data/assumptions';

/* ---------- normal distribution ---------- */
export const pdf = (z: number) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
export function cdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = pdf(x);
  const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x >= 0 ? 1 - p : p;
}
export function inv(p: number): number {
  const q0 = Math.min(Math.max(p, 1e-6), 1 - 1e-6);
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  if (q0 < 0.02425) { const q = Math.sqrt(-2 * Math.log(q0)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  if (q0 > 1 - 0.02425) { const q = Math.sqrt(-2 * Math.log(1 - q0)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  const q = q0 - 0.5, r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}
/** Standard normal loss function G(z) = φ(z) − z(1 − Φ(z)). */
export const loss = (z: number) => pdf(z) - z * (1 - cdf(z));

export type NetOption = 'depot' | 'hybrid' | 'hub';
export const NET_LABEL: Record<NetOption, string> = { depot: 'Decentralised (depot)', hybrid: 'Hybrid (depot minimum + hub pool)', hub: 'Centralised (hub only)' };

/* ---------- network ---------- */
export function poolFactor(opt: NetOption, p: StageParams, g: Globals) {
  const k = g.depots / g.hubs;
  const hub = Math.sqrt((1 + (k - 1) * p.rho) / k);
  return opt === 'depot' ? 1 : opt === 'hub' ? hub : p.a + (1 - p.a) * hub;
}
export function responseHours(g: Globals) {
  return {
    depot: g.metro * g.depotMetro + (1 - g.metro) * g.depotUp,
    hub: g.metro * g.hubMetro + (1 - g.metro) * g.hubUp,
    sla: g.metro * g.slaMetro + (1 - g.metro) * g.slaUp,
  };
}
/** Dealer cover needed to keep shelf availability when replenishment takes R hours. */
const dealerCover = (R: number, cvd: number, z: number) => R / 24 + z * cvd * Math.sqrt(R / 24);

export function network(opt: NetOption, p: StageParams, g: Globals) {
  const r = responseHours(g);
  const slaOk = opt !== 'hub' || p.a === 0 || (g.hubMetro <= g.slaMetro && g.hubUp <= g.slaUp);
  const hubShare = opt === 'depot' ? 0 : opt === 'hub' ? 1 : 1 - p.a;
  // Only SLA-bound demand served from a hub forces dealers to hold more; scheduled demand does not.
  const channelDays = opt === 'hub' ? p.a * (dealerCover(r.hub, p.cvDealer, g.zDealer) - dealerCover(r.depot, p.cvDealer, g.zDealer)) : 0;
  const slaMetPct = opt === 'hub' ? (1 - p.a) * 100 + (slaOk ? p.a * 100 : 0) : 100;
  return { slaOk, hubShare, channelDays, slaMetPct, pf: poolFactor(opt, p, g), response: opt === 'depot' ? r.depot : opt === 'hub' ? r.hub : r.depot };
}

/* ---------- stage economics ---------- */
export function stage(id: StageId, inp: StageInputs, p: StageParams, g: Globals, opt: NetOption, removalMult: number) {
  const share = STAGES.find((s) => s.id === id)!.fgValueShare / 100;
  const sigma = p.cv * Math.sqrt(p.LT); // std dev of demand over the protection period, in days of demand
  const z0 = inv(inp.sl0 / 100);
  const ss0 = z0 * sigma;
  const E0 = Math.max(0, inp.days0 - p.W - p.P - ss0);
  const net = network(opt, p, g);
  const sigma1 = sigma * net.pf;
  const z1 = inv(inp.sl1 / 100);
  const ss1 = z1 * sigma1;
  // Stock stranded at depots (fading local demand) only clears if it is pooled and redeployed.
  const control = opt === 'hub' ? 1 : opt === 'hybrid' ? 1 - p.stranded * p.a : 1 - p.stranded;
  const rem = Math.min(1, (inp.removal / 100) * removalMult * control);
  const E1 = E0 * (1 - rem);
  const days1 = p.W + p.P + ss1 + E1;

  const inv0 = g.fgBase * share; // ₹ Cr
  const cogs = inv0 * 365 / inp.days0; // ₹ Cr / yr throughput (held constant)
  const inv1 = inv0 * days1 / inp.days0;
  const release = inv0 - inv1; // one-time working capital (+ = released)
  const holding = g.h * release; // ₹ Cr / yr
  const writeoff = p.w * release; // ₹ Cr / yr
  const markup = g.cm / (1 - g.cm);
  const Cu = markup * p.lost; // margin lost per ₹ of COGS unfilled
  const margin = ((inp.sl1 - inp.sl0) / 100) * cogs * Cu; // ₹ Cr / yr (can be negative)
  const freight = net.hubShare * cogs * g.freight;
  const dealerWC = net.channelDays / 365 * cogs; // ₹ Cr held by dealers (not on Asian Paints’ books)

  // Economic optimum: keep adding a day while margin protected > cost of carrying it.
  const Co = (g.h + p.w) * p.T / 365;
  const slStar = Math.max(0, 1 - Co / Cu) * 100;
  const binding = inp.sl1 <= p.floor + 1e-9 && slStar < p.floor ? 'floor' : inp.sl1 >= p.cap - 1e-9 && slStar > p.cap ? 'cap' : null;

  const fixed = p.W + p.P + E1;
  /** Annual cost (₹ Cr) of running at `d` days with this structure: carrying + margin lost to shortfalls. */
  const costAt = (d: number) => {
    const z = (d - fixed) / sigma1;
    const carry = (g.h + p.w) * cogs * d / 365;
    const short = (cogs / p.T) * sigma1 * loss(z) * Cu;
    return { carry, short, total: carry + short, sl: cdf(z) * 100 };
  };
  const frontier = (E: number, pf: number) => (d: number) => cdf((d - p.W - p.P - E) / (sigma * pf)) * 100;

  return {
    control, rem,
    id, share, sigma, z0, ss0, E0, E1, z1, ss1, days1, inv0, inv1, cogs, release, holding, writeoff, margin, freight, dealerWC,
    net, Cu, Co, slStar, binding, fixed, sigma1, costAt, frontier,
    daysBuckets: { pipeline: p.W, prebuild: p.P, safety0: ss0, excess0: E0, safety1: ss1, excess1: E1 },
  };
}
export type StageResult = ReturnType<typeof stage>;

/** Economic optimum service, clamped to the policy floor and cap. */
export function economicSL(p: StageParams, g: Globals) {
  const Cu = (g.cm / (1 - g.cm)) * p.lost;
  const Co = (g.h + p.w) * p.T / 365;
  const star = Math.max(0, 1 - Co / Cu) * 100;
  return { star, policy: Math.round(Math.min(p.cap, Math.max(p.floor, star)) * 10) / 10 };
}

/** Recommend the cheapest option that keeps the dealer SLA. */
export function recommend(id: StageId, inp: StageInputs, p: StageParams, g: Globals, mult: number) {
  const opts: NetOption[] = ['depot', 'hybrid', 'hub'];
  const rows = opts.map((o) => {
    const r = stage(id, inp, p, g, o, mult);
    const apDays = r.days1;
    const systemDays = apDays + r.net.channelDays;
    const annual = (g.h + p.w) * r.inv1 + r.freight + g.h * r.dealerWC; // incl. dealers' carrying cost
    return { o, r, apDays, systemDays, annual };
  });
  const ok = rows.filter((x) => x.r.net.slaOk);
  const best = ok.reduce((a, b) => (b.annual < a.annual - 1e-9 ? b : a));
  return { rows, best: best.o };
}

export function portfolio(results: StageResult[], g: Globals) {
  const sum = (f: (r: StageResult) => number) => results.reduce((a, r) => a + f(r), 0);
  const inv0 = sum((r) => r.inv0);
  const inv1 = sum((r) => r.inv1);
  const days0 = sum((r) => r.share * (r.inv0 * 365 / r.cogs));
  const days1 = sum((r) => r.share * r.days1);
  const release = inv0 - inv1;
  const holding = sum((r) => r.holding);
  const writeoff = sum((r) => r.writeoff);
  const freight = sum((r) => r.freight);
  const margin = sum((r) => r.margin);
  const hard = holding + writeoff - freight;
  const exposure0 = sum((r) => (r.id === 'decline' || r.id === 'exit' ? r.inv0 : 0)) / inv0 * 100;
  const exposure1 = sum((r) => (r.id === 'decline' || r.id === 'exit' ? r.inv1 : 0)) / inv1 * 100;
  return { inv0, inv1, days0, days1, release, releasePct: release / g.fgBase * 100, holding, writeoff, freight, margin, hard, exposure0, exposure1 };
}

export const cr = (x: number, d = 2) => `₹${x.toLocaleString('en-IN', { maximumFractionDigits: d, minimumFractionDigits: d })} Cr`;
export const lakh = (x: number) => `₹${Math.round(x * 100).toLocaleString('en-IN')} L`;
export const f = (x: number, d = 1) => x.toLocaleString('en-IN', { maximumFractionDigits: d, minimumFractionDigits: d });
