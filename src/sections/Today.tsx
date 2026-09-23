import { Section, Tag, Takeaway } from '../components/ui';
import { STAGES, CASE_FACTS } from '../data/caseData';
import { useModel, IDS } from '../state';
import { f } from '../utils/model';

export function Today() {
  const { inputs } = useModel();
  return (
    <Section id="today" n={1} eyebrow="Today" tags={['case', 'mentor']}
      title={<>One safety-stock policy for every SKU — <span className="text-violet">whatever its stage.</span></>}
      lede="Asian Paints already has the safety-stock and coverage logic. What it doesn’t do is classify SKUs by lifecycle, so a launch, a best-seller and a fading variant are run on the same rules. PRISM keeps the engine and changes three inputs per stage: the service target, the discipline on excess stock, and where the stock sits.">
      <div className="card scroll-x p-0">
        <table className="w-full min-w-[720px] text-left text-[14px]">
          <thead className="bg-paper-2 text-[11px] uppercase tracking-wider text-ink-3">
            <tr><th className="px-4 py-2">Stage</th><th className="px-2">% SKUs</th><th className="px-2">% FG value</th><th className="px-2">% inventory cost</th><th className="px-2">Obsolescence risk</th><th className="px-2">Days today*</th><th className="px-2">Service today*</th></tr>
          </thead>
          <tbody className="num">
            {STAGES.map((s, i) => {
              const inp = inputs[IDS[i]];
              const late = s.id === 'decline' || s.id === 'exit';
              return (
                <tr key={s.id} className={`border-t border-paper-line ${late ? 'bg-[#FDEDE3]/60' : ''}`}>
                  <td className="px-4 py-2.5"><span className="inline-flex items-center gap-2 font-bold" style={{ color: s.color }}><span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />{s.name}</span></td>
                  <td className="px-2">{s.skuShare}%</td><td className="px-2">{s.fgValueShare}%</td><td className="px-2">{s.invCostShare}%</td>
                  <td className="px-2 font-semibold" style={{ color: s.obsolescence.includes('High') ? '#C21E2B' : '#0F8A73' }}>{s.obsolescence}</td>
                  <td className="px-2">{f(inp.days0, 0)} d</td><td className="px-2">{f(inp.sl0, 1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex flex-wrap items-center gap-2 border-t border-paper-line px-4 py-2 text-[12px] text-ink-3"><Tag p="case" /> shares and risk: case §3–§4. <Tag p="assumption" /> *days: our calibration inside the case’s 35–70 day band. Service: midpoints of the case products in each stage.</div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl bg-aubergine p-4 text-white">
          <div className="font-mono text-[11px] uppercase tracking-widest text-saffron">Decline + Exit</div>
          <div className="mt-2 flex items-baseline gap-4"><span className="num font-display text-[34px] font-bold">{CASE_FACTS.declineExitSku}%</span><span className="text-white/70">of SKUs</span></div>
          <div className="flex items-baseline gap-4"><span className="num font-display text-[34px] font-bold">{CASE_FACTS.declineExitCost}%</span><span className="text-white/70">of inventory cost, at the highest risk</span></div>
        </div>
        <div className="card p-4 text-[14px] text-ink-2"><b className="text-aubergine">The launch is under-served.</b> Product C sits at 82–87% service — the lowest in the case — while its launch stock is spread thin across the network.</div>
        <div className="card p-4 text-[14px] text-ink-2"><b className="text-aubergine">The fading SKU is over-served.</b> Product E (Decline) has the highest service band (93–98%) and the most days (50–60). Service follows habit, not need.</div>
      </div>
      <Takeaway>The question is not “how do we cut inventory?” — it is “what service does each stage need, and what does that service cost to hold?”</Takeaway>
    </Section>
  );
}
