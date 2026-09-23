import { Section, Tag, Takeaway } from '../components/ui';
import { Slider } from '../components/Slider';
import { STAGE } from '../data/caseData';
import { SCENARIOS, type Scenario } from '../data/assumptions';
import { useModel, IDS } from '../state';
import { cr, f, portfolio, stage } from '../utils/model';

function Waterfall({ items, net }: { items: { k: string; v: number; c: string }[]; net: number }) {
  const W = 560, H = 230, L = 16, B = 44, T = 22;
  const all = [...items.map((i) => i.v), net];
  let run = 0; const tops: number[] = [0];
  items.forEach((i) => { run += i.v; tops.push(run); });
  const max = Math.max(...tops, net, 0.01) * 1.15; const min = Math.min(0, ...tops) * 1.15;
  const y = (v: number) => T + (1 - (v - min) / (max - min)) * (H - T - B);
  const bw = (W - L * 2) / (all.length) - 14;
  let acc = 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Annual hard savings build-up">
      <line x1={L} x2={W - L} y1={y(0)} y2={y(0)} stroke="#CFC6E0" />
      {items.map((i, n) => {
        const from = acc; acc += i.v;
        const x = L + n * (bw + 14) + 7;
        return (
          <g key={i.k}>
            <rect x={x} y={y(Math.max(from, acc))} width={bw} height={Math.max(1.5, Math.abs(y(from) - y(acc)))} rx="3" fill={i.c} />
            <text x={x + bw / 2} y={y(Math.max(from, acc)) - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill={i.v >= 0 ? '#0F8A73' : '#C21E2B'} fontFamily="IBM Plex Mono">{i.v >= 0 ? '+' : '−'}{f(Math.abs(i.v), 2)}</text>
            <text x={x + bw / 2} y={H - 26} textAnchor="middle" fontSize="11.5" fill="#3A2E52" fontFamily="Figtree">{i.k}</text>
          </g>
        );
      })}
      {(() => { const x = L + items.length * (bw + 14) + 7; return (
        <g>
          <rect x={x} y={y(Math.max(0, net))} width={bw} height={Math.abs(y(0) - y(net))} rx="3" fill="#2A0F4F" />
          <text x={x + bw / 2} y={y(Math.max(0, net)) - 6} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#2A0F4F" fontFamily="IBM Plex Mono">{f(net, 2)}</text>
          <text x={x + bw / 2} y={H - 26} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#2A0F4F" fontFamily="Figtree">Net / yr</text>
        </g>
      ); })()}
      <text x={W - L} y={H - 6} textAnchor="end" fontSize="10.5" fill="#6A6180" fontFamily="Figtree">₹ Cr per year</text>
    </svg>
  );
}

export function Impact() {
  const m = useModel();
  const t = m.total;
  const scen = (Object.keys(SCENARIOS) as Scenario[]).map((s) => {
    const res = IDS.map((id) => stage(id, m.inputs[id], m.params[id], m.globals, m.chosen[id], SCENARIOS[s]));
    return { s, p: portfolio(res, m.globals) };
  });
  const maxRel = Math.max(...IDS.map((id) => Math.abs(m.results[id].release)), 0.01);

  return (
    <Section id="impact" n={4} eyebrow="Business impact" tone="white" tags={['assumption']}
      title={<>What PRISM is worth — <span className="text-violet">with the arithmetic in the open.</span></>}
      lede={<>Everything below comes from the calculator and network test above, so it moves when you move them. Figures are per <b>₹{f(m.globals.fgBase, 0)} Cr of finished-goods inventory</b> (type your own base to rescale). One-time cash is never added to the annual P&amp;L.</>}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-aubergine p-4 text-white">
          <div className="font-mono text-[11px] uppercase tracking-widest text-saffron">One-time</div>
          <div className="num font-display text-[34px] font-bold leading-tight">{cr(t.release, 1)}</div>
          <div className="text-[13px] text-white/80">working capital released ({f(t.releasePct, 1)}% of FG) — days {f(t.days0)} → {f(t.days1)}</div>
        </div>
        <div className="card p-4">
          <div className="font-mono text-[11px] uppercase tracking-widest text-st-maturity">Every year · hard</div>
          <div className="num font-display text-[34px] font-bold leading-tight text-st-maturity">{cr(t.hard, 2)}</div>
          <div className="text-[13px] text-ink-2">holding + write-offs saved, net of extra freight</div>
        </div>
        <div className="card p-4">
          <div className="font-mono text-[11px] uppercase tracking-widest text-[#8A5A00]">Every year · upside</div>
          <div className="num font-display text-[34px] font-bold leading-tight text-[#8A5A00]">{cr(t.margin, 2)}</div>
          <div className="text-[13px] text-ink-2">margin protected by higher service — proven in the pilot before it is counted</div>
        </div>
        <div className="card p-4">
          <div className="font-mono text-[11px] uppercase tracking-widest text-st-decline">Risk</div>
          <div className="num font-display text-[34px] font-bold leading-tight text-st-decline">{f(t.exposure0, 0)}% → {f(t.exposure1, 1)}%</div>
          <div className="text-[13px] text-ink-2">of FG value sitting in High / Very High obsolescence stages</div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card p-4">
          <div className="mb-1 flex items-center justify-between"><div className="h3">Annual hard savings, built up</div><Tag p="illustrative" /></div>
          <Waterfall net={t.hard} items={[
            { k: 'Holding cost', v: t.holding, c: '#0F8A73' },
            { k: 'Write-offs', v: t.writeoff, c: '#2E9E86' },
            { k: 'Extra freight', v: -t.freight, c: '#E3342F' },
          ]} />
          <div className="rounded-lg bg-paper px-3 py-2 font-mono text-[12px] text-ink-2">
            holding = {f(m.globals.h * 100, 0)}% × {cr(t.release, 2)} released · write-offs = stage write-off rate × stock removed · freight = {f(m.globals.freight * 100, 1)}% × COGS moved hub-direct
          </div>
        </div>
        <div className="grid content-start gap-3">
          <div className="card p-4">
            <div className="mb-2 text-[14px] font-bold text-aubergine">Where the working capital comes from</div>
            <div className="grid gap-1.5">
              {IDS.map((id) => {
                const r = m.results[id];
                return (
                  <div key={id} className="grid grid-cols-[88px_1fr_78px] items-center gap-2 text-[12.5px]">
                    <span className="font-semibold" style={{ color: STAGE[id].color }}>{STAGE[id].name}</span>
                    <div className="relative h-5 rounded bg-paper">
                      <div className="absolute top-0 h-full w-px bg-ink-4" style={{ left: '30%' }} />
                      <div className="absolute top-0 h-full rounded" style={{ left: r.release >= 0 ? '30%' : `${30 - (Math.abs(r.release) / maxRel) * 30}%`, width: `${(Math.abs(r.release) / maxRel) * (r.release >= 0 ? 70 : 30)}%`, background: r.release >= 0 ? '#0F8A73' : '#E3342F' }} />
                    </div>
                    <span className="num text-right font-mono">{r.release >= 0 ? '−' : '+'}{f(Math.abs(r.release), 2)}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[12px] text-ink-3">Green = capital released; red = capital deliberately added to buy service where it sells.</p>
          </div>
          <div className="card p-4">
            <div className="mb-2 flex items-center justify-between"><div className="text-[14px] font-bold text-aubergine">Scenarios</div><span className="text-[11.5px] text-ink-3">how much excess stock is actually cleared</span></div>
            <table className="w-full text-[13px]">
              <thead className="text-[10.5px] uppercase tracking-wider text-ink-3"><tr><th className="py-1 text-left">Scenario</th><th className="text-right">Days</th><th className="text-right">One-time</th><th className="text-right">Hard / yr</th></tr></thead>
              <tbody className="num">
                {scen.map(({ s, p }) => (
                  <tr key={s} onClick={() => m.setScenario(s)} className={`cursor-pointer border-t border-paper-line ${m.scenario === s ? 'bg-violet-soft/60 font-bold' : 'hover:bg-paper'}`}>
                    <td className="py-1.5">{s} <span className="font-mono text-[10px] text-ink-3">×{SCENARIOS[s]}</span></td>
                    <td className="text-right">{f(p.days1)}</td><td className="text-right">{cr(p.release, 1)}</td><td className="text-right">{cr(p.hard, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-4">
            <Slider id="fgBase" label="Scale to your FG inventory (₹ Cr)" value={m.globals.fgBase} onChange={(v) => m.setGlobal('fgBase', v)} min={10} max={10000} step={10} hint="Default ₹100 Cr makes every figure read as a % of FG inventory." />
          </div>
        </div>
      </div>
      <Takeaway>PRISM spends capital where service sells (launch, growth) and releases it where stock has no job (decline, exit). The net is cash out of the balance sheet and cost out of the P&amp;L.</Takeaway>
    </Section>
  );
}
