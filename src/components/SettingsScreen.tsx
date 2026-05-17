import { ArrowLeft } from 'lucide-react';
import { MenuSettings } from './MenuSettings';
import { PWAInstall } from './PWAInstall';

export function SettingsScreen({
  onBack,
  setIsLocalMode,
}: {
  onBack: () => void;
  setIsLocalMode: (value: boolean) => void;
}) {
  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-6xl flex-col overflow-x-hidden px-4 pb-6 pt-4 md:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-cyan-brand">Control Center</p>
          <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
          <p className="mt-1 max-w-[11rem] text-xs font-mono uppercase tracking-widest text-slate sm:max-w-none">
            Gemma 4, workflow, map, local data
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <PWAInstall />
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-mist/50 bg-surface/70 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate transition-colors hover:border-cyan-brand/40 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </button>
        </div>
      </div>

      <div className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        <MenuSettings setIsLocalMode={setIsLocalMode} />
      </div>
    </div>
  );
}
