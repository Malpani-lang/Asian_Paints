import { PrismMark } from '../components/Chrome';

export function Footer() {
  return (
    <footer className="bg-aubergine-deep py-8 text-white">
      <div className="wrap flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2"><PrismMark size={24} /><span className="font-display text-[18px] font-extrabold tracking-[0.14em]">PRISM</span></div>
        <p className="text-[13px] text-white/60">Team Rayquaza · IIM Lucknow · Tapajeet Sarkar · Harshit Malpani · Gourav Verma</p>
      </div>
    </footer>
  );
}
