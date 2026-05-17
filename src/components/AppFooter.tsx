export function AppFooter() {
  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-2 z-40 hidden px-4 md:block print:hidden">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-mist/30 bg-[#07080B]/58 px-4 py-2 text-[9px] font-mono uppercase tracking-widest text-slate backdrop-blur-md">
        <span>Built by pixek.xyz</span>
        <span className="text-cyan-brand/80">Local-first Crisis Packets • Gemma 4 ready</span>
      </div>
    </footer>
  );
}
