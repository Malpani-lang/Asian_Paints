import { ArrowRight } from 'lucide-react';
import { Section, Takeaway } from '../components/ui';

const STEPS = [
  { k: 'Classify', d: 'Monthly, per SKU × region: lifecycle stage from demand trend, reach and establishment vs peers — never age alone.' },
  { k: 'Set 3 inputs', d: 'Service target (from the cost trade-off), excess discipline, stocking point (from the network test).' },
  { k: 'Existing engine', d: 'Asian Paints’ current safety-stock and coverage logic computes quantities — unchanged.' },
  { k: 'Review', d: 'S&OP sees only the SKUs that changed stage or tripped a protocol; a trigger opens a review, never a policy change.' },
];
const PHASES = [
  { t: 'M0–3', k: 'Back-test', d: 'Replay 24–36 months; calibrate every assumption on this site with actual data.', gate: 'Beats today on both service and days' },
  { t: 'M3–8', k: 'Pilot', d: 'Waterproofing + colorants — tests warranty continuity and system dependency together.', gate: 'Service floors hold; savings visible' },
  { t: 'M8–12', k: 'Scale', d: 'Category × region waves inside the existing S&OP cycle.', gate: 'Savings persist; overrides falling' },
];

export function HowItRuns() {
  return (
    <Section id="run" n={6} eyebrow="How it runs" tone="white" tags={['prism']}
      title={<>Nothing is switched off. <span className="text-violet">Three inputs change.</span></>}
      lede="PRISM is a classification-and-parameter layer on the planning engine Asian Paints already runs. That is why it can be piloted without risk and scaled category by category.">
      <div className="grid gap-2 md:grid-cols-4">
        {STEPS.map((s, i) => (
          <div key={s.k} className="relative rounded-xl border border-paper-line bg-paper p-4">
            <div className="font-mono text-[11px] text-ink-4">{i + 1}</div>
            <div className={`text-[16px] font-bold ${i === 2 ? 'text-ink-3' : 'text-aubergine'}`}>{s.k}</div>
            <div className="mt-1 text-[13px] text-ink-2">{s.d}</div>
            {i < 3 && <ArrowRight size={18} className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-violet md:block" />}
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {PHASES.map((p) => (
          <div key={p.k} className="card-lift overflow-hidden">
            <div className="ribbon h-1.5" />
            <div className="p-4">
              <div className="font-mono text-[11px] text-ink-3">{p.t}</div>
              <div className="font-display text-[22px] font-bold text-aubergine">{p.k}</div>
              <p className="mt-1 text-[13.5px] text-ink-2">{p.d}</p>
              <div className="mt-2 rounded bg-paper px-2 py-1 text-[12.5px]"><b className="text-st-maturity">Gate:</b> {p.gate}</div>
            </div>
          </div>
        ))}
      </div>
      <Takeaway>Easy to explain, easy to switch on, easy to stop: every phase has a gate that can halt it.</Takeaway>
    </Section>
  );
}
