import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Section, Tag, Takeaway, LifecycleBadge } from '../components/ui';
import { GROUND_RULES } from '../data/caseData';
import type { StageId } from '../types';

type Case = { k: string; src: 'case' | 'mentor'; trigger: string; protocol: string[]; effect: string; ex?: string };

/** Case §2 ecosystem drivers (verbatim trigger) + mentor-session edge cases. */
const CASES: Case[] = [
  { k: 'Painting systems', src: 'case', trigger: 'Some products are needed as part of a full solution, even if standalone sales are low', protocol: ['Tag the SKU to its anchor product in master data', 'Service floor = the anchor’s floor, not its own volume’s', 'Delist only when the anchor system exits'], effect: 'Service held; days cut by placing stock where the anchor sells, not everywhere.', ex: 'A, B' },
  { k: 'Warranty commitments', src: 'case', trigger: 'Certain products need continuity to support promised performance', protocol: ['Split demand: warranty stream vs discretionary', 'Warranty stream keeps a locked floor at a depot minimum', 'Discretionary demand migrates to the successor', 'Exit gate: warranty tail ends or successor is certified for the system'], effect: 'Stage stays Decline; floor protected for warranty demand only; rest pooled.', ex: 'E' },
  { k: 'Painter / contractor recommendations', src: 'case', trigger: 'Demand may remain sticky due to applicator preference', protocol: ['Score the stage region by region', 'Open a depot node only where regional demand ≥ viability threshold', 'Elsewhere serve from the hub pool'], effect: 'Breadth follows influence; no national push of a regional product.', ex: 'F' },
  { k: 'Dealer influence', src: 'case', trigger: 'Regional stocking and push can extend product relevance', protocol: ['Read sell-out, not sell-in — dealer push is not demand', 'Same SLA for every dealer in a geography (mentor)', 'Premium dealers get product variants, not faster service'], effect: 'No false Growth signal from push; no dealer-tier service promise.' },
  { k: 'Contractor / project specifications', src: 'case', trigger: 'Low-volume SKUs may remain important for specific project use cases', protocol: ['Size stock to open BoQ lines, not a network buffer', 'Serve against scheduled call-offs (24–48 h agreed)', 'Exit on site completion; terminal buy = remaining BoQ'], effect: 'Hub-served without breaking the SLA; nothing stranded at closure.', ex: 'C, G' },
  { k: 'Customer preference', src: 'case', trigger: 'New shades, finishes or benefits can create new product requirements', protocol: ['New SKU enters Introduction on customer evidence, not age', 'Scale service with confirmed regional demand'], effect: 'Launch capital follows proven preference.', ex: 'D' },
  { k: 'Seasonal & scheme-driven push', src: 'mentor', trigger: 'Pre-monsoon waterproofing, pre-Diwali painting; early-order schemes (X, X−1, X−2) pull demand forward', protocol: ['Pre-build is a planned bucket — never counted as excess', 'Deseasonalise; compare with the same season last year before any stage change', 'A post-scheme dip is not Decline'], effect: 'No false Decline calls after a scheme; production smoothing left intact.' },
  { k: 'Formulation upgrade (successor)', src: 'mentor', trigger: 'A new variant replaces an existing high-volume SKU', protocol: ['Fill dealer orders from the old variant first, then the new (FIFO)', 'Stop forward deployment of the old variant; don’t pre-load the new one', 'Old variant moves to Decline when the successor goes live'], effect: 'Old stock liquidates through normal orders instead of write-off.' },
  { k: 'Brand-new SKU, no history', src: 'mentor', trigger: 'Neither Asian Paints nor dealers know the demand yet', protocol: ['Push display-minimum stock to every target dealer (breadth, thin depth)', 'Scale depth only on sell-through', 'Launch review at M6 / M12 — course-correct, not kill'], effect: 'Service up (84.5% → 95%) with less blanket launch stock.' },
];

/** Case §5 products — case data + the protocol that applies. */
const SKUS: { id: string; usage: string; stage: StageId; days: string; sl: string; driver: string; treatment: string; svc: 'up' | 'hold' | 'down'; dd: 'up' | 'hold' | 'down' }[] = [
  { id: 'A', usage: 'Premium wallpaper glue', stage: 'maturity', days: '50–60', sl: '90–95%', driver: 'Painting system', treatment: 'Attached to wallpaper: stock where wallpaper sells; service = anchor’s', svc: 'up', dd: 'down' },
  { id: 'B', usage: 'Colorant for tinting', stage: 'maturity', days: '40–50', sl: '92–97%', driver: 'Painting system', treatment: 'Full set at every tinting point; shorter replenishment, same service', svc: 'up', dd: 'down' },
  { id: 'C', usage: 'Gold paint, temple tops', stage: 'intro', days: '20–30', sl: '82–87%', driver: 'Project spec', treatment: 'Size to open BoQ; serve scheduled call-offs from the hub', svc: 'up', dd: 'hold' },
  { id: 'D', usage: 'Exterior specialty texture', stage: 'growth', days: '35–45', sl: '90–95%', driver: 'Customer preference', treatment: 'Growth service priority; depot stock where demand is proven', svc: 'up', dd: 'hold' },
  { id: 'E', usage: 'Old waterproof primer', stage: 'decline', days: '50–60', sl: '93–98%', driver: 'Warranty + successor', treatment: 'Split the streams: warranty floor at depot minimum, rest pooled; FIFO', svc: 'hold', dd: 'down' },
  { id: 'F', usage: 'Tile-on-tile adhesive', stage: 'growth', days: '35–45', sl: '91–96%', driver: 'Contractor pull', treatment: 'Regional: depot where applicators adopt, hub elsewhere', svc: 'up', dd: 'hold' },
  { id: 'G', usage: 'Old gypsum plaster', stage: 'exit', days: '30–40', sl: '87–92%', driver: 'Project spec until closure', treatment: 'Terminal buy to remaining BoQ; site call-offs only; exit at closure', svc: 'hold', dd: 'down' },
];
const ARROW = { up: '↑', hold: '→', down: '↓' };

export function EdgeCases() {
  const [open, setOpen] = useState(1);
  const c = CASES[open];
  return (
    <Section id="edge" n={5} eyebrow="Edge cases & protocols" tags={['case', 'mentor']}
      title={<>Lifecycle sets the default. <span className="text-violet">These protocols decide the exceptions.</span></>}
      lede="The case’s ecosystem-drivers table lists six reasons that keep low-volume or declining SKUs important; the mentors added three more from how the paint trade actually works. Each has a trigger PRISM watches for, a fixed protocol, and a defined effect on service, days and network.">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid grid-cols-1 gap-1.5 self-start sm:grid-cols-2 lg:grid-cols-1">
          {CASES.map((x, i) => (
            <button key={x.k} onClick={() => setOpen(i)} aria-pressed={open === i}
              className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-[13.5px] font-semibold transition-colors ${open === i ? 'border-aubergine bg-aubergine text-white' : 'border-paper-line bg-white text-aubergine hover:border-violet'}`}>
              <span>{x.k}</span>
              <span className={`rounded px-1.5 py-[1px] font-mono text-[9.5px] ${open === i ? 'bg-white/15 text-white' : x.src === 'case' ? 'bg-paper-2 text-ink-3' : 'bg-[#FFF1E6] text-[#B4500B]'}`}>{x.src === 'case' ? 'CASE' : 'MENTOR'}{x.ex ? ` · ${x.ex}` : ''}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={c.k} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="card-lift self-start p-5">
            <div className="flex flex-wrap items-center gap-2"><span className="h3">{c.k}</span><Tag p={c.src} /></div>
            <div className="mt-3 rounded-lg bg-paper px-3 py-2 text-[13.5px]"><span className="eyebrow mr-2">Trigger</span><i>{c.trigger}</i></div>
            <div className="eyebrow mb-1 mt-4">Protocol</div>
            <ol className="grid gap-1.5 text-[14px] text-ink-2">{c.protocol.map((p, i) => <li key={p} className="flex gap-2"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet text-[11px] font-bold text-white">{i + 1}</span>{p}</li>)}</ol>
            <div className="mt-4 rounded-lg border border-[#BFE3D9] bg-[#F2FAF7] px-3 py-2 text-[13.5px] text-ink-2"><b className="text-st-maturity">Effect:</b> {c.effect}</div>
            {c.ex && <div className="mt-2 text-[12.5px] text-ink-3">Case products: <b className="text-aubergine">{c.ex}</b></div>}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="card scroll-x mt-6 p-0">
        <div className="flex items-center justify-between px-4 pt-3"><div className="text-[14px] font-bold text-aubergine">The seven case products</div><Tag p="case" /></div>
        <table className="mt-2 w-full min-w-[860px] text-left text-[13px]">
          <thead className="bg-paper-2 text-[10.5px] uppercase tracking-wider text-ink-3"><tr><th className="px-4 py-2">SKU</th><th className="px-2">Stage</th><th className="px-2">Days · service today</th><th className="px-2">Why it still matters</th><th className="px-2">PRISM treatment</th><th className="px-2 text-center">Service</th><th className="px-4 text-center">Days</th></tr></thead>
          <tbody>
            {SKUS.map((s) => (
              <tr key={s.id} className="border-t border-paper-line align-top">
                <td className="px-4 py-2"><b className="text-aubergine">{s.id}</b> <span className="text-ink-2">{s.usage}</span></td>
                <td className="px-2 py-2"><LifecycleBadge s={s.stage} size="sm" /></td>
                <td className="num px-2 py-2">{s.days} d · {s.sl}</td>
                <td className="px-2 py-2 text-ink-2">{s.driver}</td>
                <td className="px-2 py-2 text-ink-2">{s.treatment}</td>
                <td className="px-2 py-2 text-center text-[16px] font-bold" style={{ color: s.svc === 'up' ? '#0F8A73' : '#6A6180' }}>{ARROW[s.svc]}</td>
                <td className="px-4 py-2 text-center text-[16px] font-bold" style={{ color: s.dd === 'down' ? '#0F8A73' : '#6A6180' }}>{ARROW[s.dd]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-4">
        {GROUND_RULES.map((g, i) => (
          <div key={g} className="rounded-lg border border-dashed border-violet-line bg-white p-3 text-[12.5px] text-ink-2">
            <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-violet">Case §6 · rule {i + 1}</div>{g}
            <div className="mt-1 text-[11.5px] font-semibold text-aubergine">{['→ six-month glide: stop forward deployment, run down, transship, de-list', '→ redeploy first, then markdown; disposal last', '→ service floors (88–95%) even at end-of-life', '→ every lever is priced in the calculator and stress-tested'][i]}</div>
          </div>
        ))}
      </div>
      <Takeaway>An exception is a rule with an owner and an end date — never a permanent opt-out.</Takeaway>
    </Section>
  );
}
