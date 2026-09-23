import { useState } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { Section, LifecycleSelector, Tag, Takeaway } from '../components/ui';
import { Slider } from '../components/Slider';
import { STAGE } from '../data/caseData';
import { useModel, IDS } from '../state';
import { cr, economicSL, f, inv, lakh } from '../utils/model';
import type { StageId } from '../types';

function Frontier({ id }: { id: StageId }) {
  const { results, inputs } = useModel();
  const r = results[id]; const inp = inputs[id];
  const color = STAGE[id].color;
  const W = 640, H = 230, L = 40, B = 28, T = 14, R = 14;
  const x0 = Math.floor(Math.min(r.fixed, r.daysBuckets.pipeline + r.daysBuckets.prebuild + r.E0) - 3), x1 = Math.ceil(Math.max(inp.days0, r.days1) + 8), y0 = 70, y1 = 100;
  const x = (d: number) => L + ((d - x0) / (x1 - x0)) * (W - L - R);
  const y = (s: number) => T + (1 - (Math.max(y0, Math.min(y1, s)) - y0) / (y1 - y0)) * (H - T - B);
  const today = r.frontier(r.E0, 1); const prism = r.frontier(r.E1, r.net.pf);
  const path = (fn: (d: number) => number) => Array.from({ length: 121 }, (_, i) => x0 + (i * (x1 - x0)) / 120).map((d, i) => `${i ? 'L' : 'M'}${x(d).toFixed(1)},${y(fn(d)).toFixed(1)}`).join(' ');
  const opt = r.slStar <= 0.5 ? -1 : r.fixed + r.sigma1 * inv(r.slStar / 100);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Service level versus inventory days, today and with PRISM">
      {[70, 80, 90, 100].map((v) => <g key={v}><line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#EEE9F6" /><text x={L - 6} y={y(v) + 4} textAnchor="end" fontSize="10" fill="#6A6180" fontFamily="IBM Plex Mono">{v}%</text></g>)}
      {Array.from({ length: 8 }, (_, i) => Math.round(x0 + (i * (x1 - x0)) / 7)).map((v) => <text key={v} x={x(v)} y={H - 10} textAnchor="middle" fontSize="10" fill="#6A6180" fontFamily="IBM Plex Mono">{v}d</text>)}
      <path d={path(today)} fill="none" stroke="#9A93AB" strokeWidth="2" strokeDasharray="5 4" />
      <path d={path(prism)} fill="none" stroke={color} strokeWidth="2.8" />
      <line x1={x(inp.days0)} y1={y(inp.sl0)} x2={x(r.days1)} y2={y(inp.sl1)} stroke="#2A0F4F" strokeWidth="1.2" strokeDasharray="2 3" />
      <circle cx={x(inp.days0)} cy={y(inp.sl0)} r="6.5" fill="#fff" stroke="#6A6180" strokeWidth="2.5" />
      <text x={x(inp.days0) + 9} y={y(inp.sl0) + 4} fontSize="11" fontWeight="700" fill="#6A6180" fontFamily="Figtree">Today</text>
      {opt > x0 && opt < x1 && <g><circle cx={x(opt)} cy={y(r.slStar)} r="4.5" fill="#F6A623" stroke="#2A0F4F" /><text x={x(opt)} y={y(r.slStar) - 9} textAnchor="middle" fontSize="10" fill="#8A5A00" fontFamily="Figtree">economic optimum</text></g>}
      <circle cx={x(r.days1)} cy={y(inp.sl1)} r="7" fill={color} stroke="#fff" strokeWidth="2" />
      <text x={x(r.days1) - 9} y={y(inp.sl1) + 18} textAnchor="end" fontSize="11" fontWeight="700" fill={color} fontFamily="Figtree">PRISM</text>
    </svg>
  );
}

function Anatomy({ id }: { id: StageId }) {
  const { results, inputs } = useModel();
  const r = results[id]; const b = r.daysBuckets;
  const max = Math.max(inputs[id].days0, r.days1) + 2;
  const segs = (safety: number, excess: number) => [
    { k: 'Pipeline & cycle', v: b.pipeline, c: '#B9AFCB' },
    { k: 'Seasonal pre-build', v: b.prebuild, c: '#D9CFEA' },
    { k: 'Safety (buys service)', v: safety, c: STAGE[id].color },
    { k: 'Excess / ageing (no job)', v: excess, c: '#E3342F' },
  ];
  const Row = ({ label, s, total }: { label: string; s: ReturnType<typeof segs>; total: number }) => (
    <div className="grid grid-cols-[64px_1fr_58px] items-center gap-2">
      <span className="text-[12px] font-semibold text-ink-2">{label}</span>
      <div className="flex h-7 overflow-hidden rounded-md bg-paper-2">{s.map((x) => x.v > 0.05 && <div key={x.k} title={`${x.k}: ${f(x.v)} d`} className="h-full" style={{ width: `${(x.v / max) * 100}%`, background: x.c, opacity: x.k.startsWith('Excess') ? 0.75 : 1 }} />)}</div>
      <span className="num text-right font-mono text-[12.5px] font-semibold text-aubergine">{f(total)} d</span>
    </div>
  );
  return (
    <div className="grid gap-2">
      <Row label="Today" s={segs(b.safety0, b.excess0)} total={inputs[id].days0} />
      <Row label="PRISM" s={segs(b.safety1, b.excess1)} total={r.days1} />
      <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-ink-3">
        {segs(0, 0).map((x) => <span key={x.k} className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: x.c }} />{x.k}</span>)}
      </div>
    </div>
  );
}

function MarginalTest({ id }: { id: StageId }) {
  const { results, params } = useModel();
  const r = results[id]; const p = params[id];
  const d = r.days1;
  const rows = [d - 1, d, d + 1].map((x) => ({ d: x, ...r.costAt(x) }));
  const min = rows.reduce((a, b) => (b.total < a.total ? b : a));
  const center = rows[1];
  const msg = r.binding === 'floor'
    ? `Economics alone would run leaner (optimum ≈ ${f(r.slStar, 1)}% service), but the ${p.floor}% floor holds — customers still expect reasonable service near end-of-life (case §6).`
    : r.binding === 'cap'
      ? `Economics would buy more (optimum ≈ ${f(r.slStar, 1)}%), but service is capped at ${p.cap}% until real demand history exists — the variability estimate is still an analogue.`
      : min.d === center.d ? `${f(d)} days is the cost minimum: one day less loses more margin than it saves; one day more costs more to carry than it protects.` : 'Move the proposed service towards the economic optimum to reach the cost minimum.';
  return (
    <div>
      <div className="scroll-x">
        <table className="w-full min-w-[320px] text-[12.5px] sm:text-[13px]">
          <thead className="text-[10.5px] uppercase tracking-wider text-ink-3"><tr><th className="py-1 text-left">Days</th><th className="text-right">Service</th><th className="text-right">Carry</th><th className="text-right">Margin lost</th><th className="text-right">Total</th></tr></thead>
          <tbody className="num">
            {rows.map((x, i) => (
              <tr key={i} className={`border-t border-paper-line ${i === 1 ? 'bg-violet-soft/60 font-semibold' : ''}`}>
                <td className="py-1.5">{f(x.d)} d {i === 1 && <span className="font-mono text-[10px] text-violet">proposed</span>}</td>
                <td className="text-right">{f(x.sl, 1)}%</td>
                <td className="text-right">{lakh(x.carry)}</td>
                <td className="text-right">{lakh(x.short)}</td>
                <td className={`text-right ${x === min ? 'text-st-maturity' : ''}`}>{lakh(x.total)}{x === min && ' ◂ min'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[12.5px] text-ink-2">{msg}</p>
    </div>
  );
}

export function CostCalculator() {
  const m = useModel();
  const [id, setId] = useState<StageId>('intro');
  const [adv, setAdv] = useState(false);
  const inp = m.inputs[id]; const p = m.params[id]; const r = m.results[id];
  const eco = economicSL(p, m.globals);
  const st = STAGE[id];
  const dDays = r.days1 - inp.days0;
  const annual = r.holding + r.writeoff;

  return (
    <Section id="calculator" n={2} eyebrow="Service, days & holding cost" tone="white" tags={['assumption']}
      title={<>Every day of inventory has a price. <span className="text-violet">Every point of service has a value.</span></>}
      lede="Pick a stage and move the levers. Change today’s days or service, or the service you want, and see what it does to inventory days, the working capital tied up and the annual holding cost. The table on the right answers the mentors’ question: why this many days, not one more or one less?">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <LifecycleSelector value={id} onChange={setId} />
        <button className="btn-ghost !py-1.5 text-[12.5px]" onClick={m.reset}><RotateCcw size={13} /> Reset all</button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="card grid content-start gap-4 p-4">
          <div className="flex items-center justify-between"><div className="text-[14px] font-bold" style={{ color: st.color }}>{st.name} — levers</div><span className="text-[11.5px] text-ink-3">{st.fgValueShare}% of FG value · {cr(r.inv0, 1)}</span></div>
          <Slider id={`d0-${id}`} label="Inventory days today" value={inp.days0} onChange={(v) => m.setInput(id, 'days0', v)} min={30} max={75} unit="d" hint="Case band: 35–70 days" />
          <Slider id={`s0-${id}`} label="Service level today" value={inp.sl0} onChange={(v) => m.setInput(id, 'sl0', v)} min={75} max={99} step={0.5} unit="%" />
          <Slider id={`s1-${id}`} label="Proposed service level" value={inp.sl1} onChange={(v) => m.setInput(id, 'sl1', v)} min={75} max={99.5} step={0.1} unit="%" accent={st.color}
            marks={[{ v: p.floor, label: 'floor', color: '#E3342F' }, { v: p.cap, label: 'cap', color: '#6A6180' }, ...(eco.star >= 75 ? [{ v: Math.min(99.5, eco.star), label: 'optimum', color: '#B7791F' }] : [])]} />
          <button className="self-start text-[12px] font-semibold text-violet hover:underline" onClick={() => m.setInput(id, 'sl1', eco.policy)}>Set to policy optimum ({f(eco.policy, 1)}%)</button>
          <Slider id={`rm-${id}`} label="Excess stock cleared by lifecycle discipline" value={inp.removal} onChange={(v) => m.setInput(id, 'removal', v)} min={0} max={90} unit="%" hint={r.control < 1 ? `Only ${f(r.control * 100, 0)}% of it clears where it sits — the rest needs pooling (see network test).` : undefined} />

          <button onClick={() => setAdv((a) => !a)} className="flex items-center gap-1 text-[12.5px] font-semibold text-ink-2" aria-expanded={adv}><ChevronDown size={14} className={adv ? 'rotate-180' : ''} /> Advanced assumptions</button>
          {adv && (
            <div className="grid gap-3 rounded-lg bg-paper p-3 sm:grid-cols-2">
              <Slider id={`W-${id}`} label="Pipeline & cycle days" value={p.W} onChange={(v) => m.setParam(id, 'W', v)} min={5} max={35} unit="d" />
              <Slider id={`P-${id}`} label="Seasonal pre-build" value={p.P} onChange={(v) => m.setParam(id, 'P', v)} min={0} max={20} unit="d" />
              <Slider id={`cv-${id}`} label="Demand variability (CV)" value={p.cv} onChange={(v) => m.setParam(id, 'cv', v)} min={0.2} max={2} step={0.05} />
              <Slider id={`lost-${id}`} label="Unfilled demand lost" value={Math.round(p.lost * 100)} onChange={(v) => m.setParam(id, 'lost', v / 100)} min={0} max={100} unit="%" />
              <Slider id={`w-${id}`} label="Write-off rate p.a." value={+(p.w * 100).toFixed(1)} onChange={(v) => m.setParam(id, 'w', v / 100)} min={0} max={20} step={0.5} unit="%" />
              <Slider id={`h-${id}`} label="Holding rate p.a. (all stages)" value={Math.round(m.globals.h * 100)} onChange={(v) => m.setGlobal('h', v / 100)} min={8} max={30} unit="%" />
            </div>
          )}
        </div>

        <div className="grid content-start gap-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { l: 'Inventory days', v: <>{f(r.days1)} d</>, s: `${dDays <= 0 ? '' : '+'}${f(dDays)} d vs today`, good: dDays <= 0 },
              { l: 'Working capital (one-time)', v: cr(Math.abs(r.release), 2), s: r.release >= 0 ? 'released' : 'additional', good: r.release >= 0 },
              { l: 'Holding + write-off / yr', v: lakh(Math.abs(annual)), s: annual >= 0 ? 'saved' : 'added', good: annual >= 0 },
              { l: 'Margin from service / yr', v: lakh(Math.abs(r.margin)), s: r.margin >= 0 ? 'protected (upside)' : 'given up', good: r.margin >= 0 },
            ].map((k) => (
              <div key={k.l} className="card px-3 py-3">
                <div className="text-[11.5px] font-semibold text-ink-3">{k.l}</div>
                <div className="num font-display text-[24px] font-bold leading-tight" style={{ color: k.good ? '#0F8A73' : '#C21E2B' }}>{k.v}</div>
                <div className="text-[11.5px] text-ink-3">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="card p-4">
            <div className="mb-2 flex items-center justify-between"><div className="text-[14px] font-bold text-aubergine">Where the days go</div><Tag p="assumption" /></div>
            <Anatomy id={id} />
            <p className="mt-2 text-[12px] text-ink-3">PRISM does not touch pipeline stock or the scheme-driven seasonal pre-build. It resets the safety stock to the service the stage needs and clears excess that has no job.</p>
          </div>
          <div className="grid gap-4">
            <div className="card p-4">
              <div className="mb-1 text-[14px] font-bold text-aubergine">Why {f(r.days1)} days — not one more, not one less</div>
              <MarginalTest id={id} />
            </div>
            <div className="card p-4">
              <div className="mb-1 flex flex-wrap items-center gap-3 text-[12px]"><span className="font-bold text-aubergine text-[14px]">Service vs days</span><span className="inline-flex items-center gap-1 text-ink-3"><span className="w-4 border-t-2 border-dashed border-ink-4" />today’s structure</span><span className="inline-flex items-center gap-1" style={{ color: st.color }}><span className="w-4 border-t-2" style={{ borderColor: st.color }} />with PRISM</span></div>
              <Frontier id={id} />
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio roll-up */}
      <div className="card scroll-x mt-6 p-0">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-3"><div className="text-[14px] font-bold text-aubergine">All five stages — per ₹{f(m.globals.fgBase, 0)} Cr of FG inventory</div><span className="text-[12px] text-ink-3">Click a row to edit it</span></div>
        <table className="mt-2 w-full min-w-[820px] text-left text-[13px]">
          <thead className="bg-paper-2 text-[10.5px] uppercase tracking-wider text-ink-3">
            <tr><th className="px-4 py-2">Stage</th><th className="px-2">Service today → PRISM</th><th className="px-2">Days today → PRISM</th><th className="px-2 text-right">Working capital</th><th className="px-2 text-right">Holding + write-off / yr</th><th className="px-2 text-right">Service margin / yr</th><th className="px-4 text-right">Stocking</th></tr>
          </thead>
          <tbody className="num">
            {IDS.map((s) => {
              const x = m.results[s]; const i = m.inputs[s];
              return (
                <tr key={s} onClick={() => setId(s)} className={`cursor-pointer border-t border-paper-line hover:bg-paper ${s === id ? 'bg-violet-soft/50' : ''}`}>
                  <td className="px-4 py-2 font-bold" style={{ color: STAGE[s].color }}>{STAGE[s].name}</td>
                  <td className="px-2">{f(i.sl0, 1)}% → <b>{f(i.sl1, 1)}%</b></td>
                  <td className="px-2">{f(i.days0, 0)} → <b>{f(x.days1)}</b> d</td>
                  <td className="px-2 text-right" style={{ color: x.release >= 0 ? '#0F8A73' : '#C21E2B' }}>{x.release >= 0 ? '−' : '+'}{cr(Math.abs(x.release), 2)}</td>
                  <td className="px-2 text-right" style={{ color: x.holding + x.writeoff >= 0 ? '#0F8A73' : '#C21E2B' }}>{x.holding + x.writeoff >= 0 ? 'saves ' : 'adds '}{lakh(Math.abs(x.holding + x.writeoff))}</td>
                  <td className="px-2 text-right" style={{ color: x.margin >= 0 ? '#0F8A73' : '#C21E2B' }}>{x.margin >= 0 ? '+' : '−'}{lakh(Math.abs(x.margin))}</td>
                  <td className="px-4 text-right text-ink-2">{m.chosen[s]}</td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-aubergine bg-paper font-bold">
              <td className="px-4 py-2 text-aubergine">Portfolio</td>
              <td className="px-2 text-ink-3">—</td>
              <td className="px-2">{f(m.total.days0)} → {f(m.total.days1)} d</td>
              <td className="px-2 text-right text-st-maturity">−{cr(m.total.release, 2)}</td>
              <td className="px-2 text-right text-st-maturity">saves {lakh(m.total.holding + m.total.writeoff)}</td>
              <td className="px-2 text-right text-st-maturity">+{lakh(m.total.margin)}</td>
              <td className="px-4" />
            </tr>
          </tbody>
        </table>
        <p className="border-t border-paper-line px-4 py-2 text-[11.5px] text-ink-3">Raising Introduction service from 84.5% to 95% needs more safety stock. PRISM funds it by replacing blanket launch push with display-minimum seeding. Growth and Maturity share the same service priority.</p>
      </div>
      <Takeaway>Each stage’s days are justified twice: by the service they buy, and by being the cheapest way to buy it.</Takeaway>
    </Section>
  );
}
