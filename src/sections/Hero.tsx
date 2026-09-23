import { motion } from 'framer-motion';
import { ArrowDown, Calculator } from 'lucide-react';
import { STAGES } from '../data/caseData';
import { useModel } from '../state';
import { cr, f } from '../utils/model';
import { scrollToSection } from '../hooks/usePresentation';
import { Tag } from '../components/ui';

/* Network columns for the hero animation (positions in a 640×360 viewBox). */
const COLS = [
  { key: 'Plant / OPC', x: 60, n: 3 },
  { key: 'Hub / DC', x: 230, n: 4 },
  { key: 'Depot', x: 400, n: 6 },
  { key: 'Dealer', x: 570, n: 9 },
];
const ys = (n: number) => Array.from({ length: n }, (_, i) => 66 + (236 / (n - 1 || 1)) * i);

function HeroNetwork() {
  const nodes = COLS.map((c) => ys(c.n).map((y) => ({ x: c.x, y })));
  const edges: { a: { x: number; y: number }; b: { x: number; y: number } }[] = [];
  for (let c = 0; c < 3; c++) {
    nodes[c].forEach((a, i) => nodes[c + 1].forEach((b, j) => {
      const ratio = nodes[c + 1].length / nodes[c].length;
      if (Math.abs(j - i * ratio) <= ratio) edges.push({ a, b });
    }));
  }
  const path = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
  // Particles: each stage travels as far as its footprint reaches; Decline & Exit flow UPSTREAM.
  const flows = [
    { color: STAGES[0].color, pts: [nodes[0][1], nodes[1][1], nodes[2][2], nodes[3][4]], dur: 4.6 },
    { color: STAGES[0].color, pts: [nodes[0][0], nodes[1][0], nodes[2][0], nodes[3][1]], dur: 5.0 },
    { color: STAGES[1].color, pts: [nodes[0][0], nodes[1][0], nodes[2][1], nodes[3][2]], dur: 4.3 },
    { color: STAGES[1].color, pts: [nodes[0][2], nodes[1][3], nodes[2][4], nodes[3][7]], dur: 4.5 },
    { color: STAGES[2].color, pts: [nodes[0][1], nodes[1][2], nodes[2][3], nodes[3][5]], dur: 4.4 },
    { color: STAGES[2].color, pts: [nodes[0][0], nodes[1][1], nodes[2][2], nodes[3][3]], dur: 4.8 },
    { color: STAGES[2].color, pts: [nodes[0][2], nodes[1][3], nodes[2][5], nodes[3][8]], dur: 4.2 },
    { color: STAGES[3].color, pts: [nodes[2][0], nodes[1][0]], dur: 3.4 },
    { color: STAGES[3].color, pts: [nodes[2][4], nodes[1][2]], dur: 3.1 },
    { color: STAGES[4].color, pts: [nodes[1][3], nodes[0][2]], dur: 3.8 },
  ];
  return (
    <svg viewBox="0 0 640 360" className="h-auto w-full" role="img" aria-label="Animated network: inventory is pushed from plant to dealer for introduction, growth and mature products, and moves upstream for declining and exiting products">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#8B5CF6" stopOpacity=".5" /><stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="320" cy="190" r="200" fill="url(#glow)" />
      {COLS.map((c) => <text key={c.key} x={c.x} y={40} textAnchor="middle" fill="#ffffffaa" fontFamily="IBM Plex Mono, monospace" fontSize="11" letterSpacing="1.5">{c.key.toUpperCase()}</text>)}
      {edges.map((e, i) => <line key={i} x1={e.a.x} y1={e.a.y} x2={e.b.x} y2={e.b.y} stroke="#ffffff" strokeOpacity=".09" />)}
      {nodes.map((col, c) => col.map((p, i) => (
        <g key={`${c}-${i}`}>
          <circle cx={p.x} cy={p.y} r={c === 0 ? 11 : c === 1 ? 9 : c === 2 ? 6.5 : 4.5} fill="#2A0F4F" stroke="#ffffff55" strokeWidth="1.2" />
        </g>
      )))}
      {flows.map((f, i) => (
        <g key={i}>
          <path d={path(f.pts)} fill="none" stroke={f.color} strokeOpacity=".55" strokeWidth="2" className="flow-dash" />
          <circle r="5" fill={f.color}>
            <animateMotion dur={`${f.dur}s`} repeatCount="indefinite" path={path(f.pts)} begin={`${i * 0.35}s`} />
          </circle>
        </g>
      ))}
      <g transform="translate(20 342)" fontFamily="Figtree, sans-serif" fontSize="11" fill="#ffffffcc">
        {STAGES.map((s, i) => (
          <g key={s.id} transform={`translate(${i * 122} 0)`}>
            <circle r="5" cx="5" cy="-4" fill={s.color} />
            <text x="15" y="0">{s.name}{s.id === 'decline' || s.id === 'exit' ? ' ↑ upstream' : ''}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function Hero() {
  const { total, inputs, globals } = useModel();
  return (
    <section id="hero" data-section className="relative overflow-hidden bg-aubergine-deep text-white">
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(1200px 500px at 75% 10%, #4A1D8A 0%, transparent 60%), radial-gradient(800px 400px at 0% 100%, #3B1670 0%, transparent 60%)' }} />
      <div className="wrap relative pb-14 pt-24 sm:pt-28">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/60">
              <span>Asian Paints · Chain Reaction 2026</span><span className="text-saffron">Finals</span><span>· Team Rayquaza · IIM Lucknow</span>
            </div>
            <motion.h1 initial={{ opacity: 0.4, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="mt-4 font-display text-[64px] font-extrabold leading-[0.9] tracking-[0.14em] sm:text-[92px]">PRISM</motion.h1>
            <p className="mt-2 text-[16px] font-semibold text-white/85">Product-lifecycle Responsive Inventory &amp; Stocking Model</p>
            <p className="mt-6 max-w-[30ch] font-display text-[28px] font-semibold leading-[1.15] sm:text-[34px]">
              Same service engine. <span className="ribbon-text">Different inputs by lifecycle stage.</span> Less capital blocked, more service where it sells.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => scrollToSection('impact')} className="btn bg-saffron text-aubergine hover:bg-[#FFBA45]">See the business impact <ArrowDown size={16} /></button>
              <button onClick={() => scrollToSection('calculator')} className="btn border border-white/25 text-white hover:bg-white/10"><Calculator size={16} /> Open the calculator</button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 sm:p-4"><HeroNetwork /></div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-4">
          <Kpi v={cr(total.release, 1)} l="working capital released (one-time)" accent />
          <Kpi v={`${cr(total.hard, 2)}`} l="hard savings per year (holding + write-off − extra freight)" />
          <Kpi v={<>{f(total.days0, 1)} → {f(total.days1, 1)} d</>} l="portfolio inventory days" />
          <Kpi v={<>{f(inputs.intro.sl0, 1)}% → {f(inputs.intro.sl1, 0)}%</>} l="launch (Introduction) service level" />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11.5px] text-white/55"><Tag p="assumption" /> Per ₹{f(globals.fgBase, 0)} Cr of finished-goods inventory, base scenario. Every assumption is listed under “Assumptions”.</div>
      </div>
    </section>
  );
}

function Kpi({ v, l, accent }: { v: React.ReactNode; l: string; accent?: boolean }) {
  return (
    <div className={`${accent ? 'bg-[#3B1670]' : 'bg-aubergine-deep/90'} px-4 py-4`}>
      <div className={`num font-display text-[28px] font-bold leading-none sm:text-[34px] ${accent ? 'text-saffron' : ''}`}>{v}</div>
      <div className="mt-1.5 text-[12.5px] text-white/70">{l}</div>
    </div>
  );
}
