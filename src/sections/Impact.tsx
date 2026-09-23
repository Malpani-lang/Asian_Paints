import { Section, Takeaway } from '../components/ui';
import { useModel } from '../state';
import { cr, f } from '../utils/model';

export function Impact() {
  const m = useModel();
  const t = m.total;

  return (
    <Section id="impact" n={4} eyebrow="Business impact" tone="white" tags={['assumption']}
      title={<>What PRISM is worth — <span className="text-violet">in cash and in cost.</span></>}
      lede={<>These figures come from the calculator and network test above, so they move when you move them. All values are per <b>₹{f(m.globals.fgBase, 0)} Cr of finished-goods inventory</b>. One-time cash is never added to the annual P&amp;L.</>}>
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

      <Takeaway>PRISM spends capital where service sells (launch, growth) and releases it where stock has no job (decline, exit). The net is cash out of the balance sheet and cost out of the P&amp;L.</Takeaway>
    </Section>
  );
}
