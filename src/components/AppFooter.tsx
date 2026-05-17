import { DONATE_URL } from '../version';

export function AppFooter() {
  return (
    <footer className="hidden px-4 pb-4 pt-2 md:block print:hidden">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-mist/30 bg-[#07080B]/58 px-4 py-2 text-[9px] font-mono uppercase tracking-widest text-slate backdrop-blur-md">
        <a href={DONATE_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cyan-brand">Built by pixek.xyz · Support</a>
        <span className="text-cyan-brand/80">Local-first Crisis Packets • Gemma 4 ready</span>
      </div>
    </footer>
  );
}
