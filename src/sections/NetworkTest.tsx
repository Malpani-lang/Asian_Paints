import { useState } from 'react';
import { AlertTriangle, ChevronDown, Clock } from 'lucide-react';
import { Section, Tag, Takeaway } from '../components/ui';
import { Slider } from '../components/Slider';
import { STAGE } from '../data/caseData';
import { useModel, IDS } from '../state';
import { f, responseHours } from '../utils/model';

export function NetworkTest() {
  const m = useModel();
  const g = m.globals;
  const [adv, setAdv] = useState(false);
  const r = responseHours(g);
  const introHub = m.recs.intro.rows[2]; const introDepot = m.recs.intro.rows[0];

  return (
    <Section id="network" n={2} eyebrow="Distribution network stress test" tags={['mentor', 'assumption']}
      title={<>Centralise only where the <span className="text-violet">dealer promise</span> and the <span className="text-violet">total days</span> both survive.</>}
      lede="Every option is tested on three things before it is allowed: does the dealer still get stock within the SLA (4 hours metro, 12 hours upcountry — the same for every dealer), what happens to total days once dealers react, and what it costs.">
      <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_1.4fr]">
        <div className="card p-4">
          <div className="mb-2 flex items-center gap-2 text-[14px] font-bold text-aubergine"><Clock size={16} /> Service clock</div>
          <div className="grid grid-cols-3 gap-2 text-center text-[12px]">
            <div className="rounded-lg bg-paper p-2"><div className="font-display text-[22px] font-bold text-aubergine">{g.slaMetro}h / {g.slaUp}h</div><div className="text-ink-3">SLA metro / upcountry <Tag p="mentor" className="mt-1" /></div></div>
            <div className="rounded-lg bg-[#E3F4F0] p-2"><div className="font-display text-[22px] font-bold text-st-maturity">{g.depotMetro}h / {g.depotUp}h</div><div className="text-ink-3">from a depot</div></div>
            <div className="rounded-lg bg-vermilion-soft p-2"><div className="font-display text-[22px] font-bold text-vermilion">{g.hubMetro}h / {g.hubUp}h</div><div className="text-ink-3">from a hub <Tag p="assumption" className="mt-1" /></div></div>
          </div>
          <p className="mt-2 text-[12.5px] text-ink-2">A hub cannot serve walk-in dealer demand inside the SLA. It can serve <b>schedulable</b> demand — project call-offs, warranty jobs — where a 24–48 h promise is agreed up front.</p>
        </div>
        <div className="rounded-xl border-2 border-vermilion/30 bg-vermilion-soft/40 p-4">
          <div className="flex items-center gap-2 text-[14px] font-bold text-vermilion"><AlertTriangle size={16} /> Stress test: centralise Introduction?</div>
          <div className="num mt-2 grid grid-cols-3 gap-2 text-center">
            <div><div className="font-display text-[22px] font-bold text-st-maturity">−{f(introDepot.apDays - introHub.apDays)} d</div><div className="text-[11.5px] text-ink-3">company stock (pooling)</div></div>
            <div><div className="font-display text-[22px] font-bold text-vermilion">+{f(introHub.r.net.channelDays)} d</div><div className="text-[11.5px] text-ink-3">dealers hold more to cover a {f(r.hub, 0)} h wait</div></div>
            <div><div className="font-display text-[22px] font-bold" style={{ color: introHub.systemDays > introDepot.systemDays ? '#C21E2B' : '#0F8A73' }}>{introHub.systemDays > introDepot.systemDays ? '+' : ''}{f(introHub.systemDays - introDepot.systemDays)} d</div><div className="text-[11.5px] text-ink-3">net system days</div></div>
          </div>
          <p className="mt-2 text-[12.5px] text-ink-2">A launch is driven by national campaigns, so regional demand moves together and pooling saves little. Dealers would hold more to cover the longer wait, the SLA breaks, and a new SKU that isn’t on the shelf can’t be discovered. <b>Rejected: launches stay decentralised</b>, with display-minimum stock at dealers.</p>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button onClick={() => setAdv((a) => !a)} className="flex items-center gap-1 text-[12.5px] font-semibold text-ink-2" aria-expanded={adv}><ChevronDown size={14} className={adv ? 'rotate-180' : ''} /> Network assumptions</button>
      </div>
      {adv && (
        <div className="mt-3 grid gap-3 rounded-xl bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Slider id="hubM" label="Hub → dealer, metro" value={g.hubMetro} onChange={(v) => m.setGlobal('hubMetro', v)} min={4} max={72} unit="h" />
          <Slider id="hubU" label="Hub → dealer, upcountry" value={g.hubUp} onChange={(v) => m.setGlobal('hubUp', v)} min={12} max={96} unit="h" />
          <Slider id="frt" label="Extra freight, hub-served" value={+(g.freight * 100).toFixed(1)} onChange={(v) => m.setGlobal('freight', v / 100)} min={0} max={3} step={0.1} unit="%" />
          <Slider id="hubs" label="Regional hubs" value={g.hubs} onChange={(v) => m.setGlobal('hubs', v)} min={5} max={80} />
          {IDS.map((id) => (
            <div key={id} className="grid gap-2 rounded-lg bg-paper p-2">
              <b className="text-[12.5px]" style={{ color: STAGE[id].color }}>{STAGE[id].name}</b>
              <Slider id={`rho-${id}`} label="Demand correlation" value={m.params[id].rho} onChange={(v) => m.setParam(id, 'rho', v)} min={0} max={0.95} step={0.05} />
              <Slider id={`a-${id}`} label="SLA-bound share" value={Math.round(m.params[id].a * 100)} onChange={(v) => m.setParam(id, 'a', v / 100)} min={0} max={100} unit="%" />
            </div>
          ))}
        </div>
      )}
      <Takeaway>No stage is fully centralised while dealers still order it under a 4 h / 12 h promise. Availability moves upstream only for demand that can wait.</Takeaway>
    </Section>
  );
}
