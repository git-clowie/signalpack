import React from 'react';
import { Card } from '@/src/components/ui';
import { Database } from 'lucide-react';
import { useSettings } from '../SettingsContext';
import { AIProviderSettings } from './AIProviderSettings';

const mapStyles: { id: 'tactical' | 'satellite' | 'streets'; label: string }[] = [
  { id: 'tactical', label: 'Tactical (Dark)' },
  { id: 'satellite', label: 'Satellite' },
  { id: 'streets', label: 'Streets' },
];

export function MenuSettings({
  setIsLocalMode,
}: {
  setIsLocalMode: (value: boolean) => void;
}) {
  const { mapStyle, setMapStyle, fastSendMode, setFastSendMode } = useSettings();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AIProviderSettings setIsLocalMode={setIsLocalMode} />

      <section>
        <h3 className="text-[10px] text-slate uppercase font-bold tracking-widest mb-3">Map & Workflow</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-white font-bold mb-2">Map Style</p>
            <div className="flex bg-cloud rounded-lg p-1 border border-mist">
              {mapStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setMapStyle(style.id)}
                  className={`flex-1 text-[10px] font-bold uppercase tracking-widest py-2 px-1 text-center rounded-md transition-colors ${mapStyle === style.id ? 'bg-blue text-white shadow-sm' : 'text-slate hover:text-white'}`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-surface border border-mist rounded-xl">
            <div>
              <p className="text-sm font-bold text-white">Fast Send Mode</p>
              <p className="text-[10px] text-slate mt-1">Skip preview and send report immediately.</p>
            </div>
            <button
              onClick={() => setFastSendMode(!fastSendMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${fastSendMode ? 'bg-blue' : 'bg-mist'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${fastSendMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-[10px] text-slate uppercase font-bold tracking-widest mb-3">Data</h3>
        <Card className="divide-y divide-mist bg-surface border-mist overflow-hidden rounded-xl">
          <button
            className="w-full flex items-center justify-between p-4 text-left hover:bg-mist/30 transition-colors"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear local data?')) {
                localStorage.removeItem('signalpack_history');
                alert('Local history cleared');
              }
            }}
          >
            <span className="text-sm font-medium text-white flex items-center gap-2"><Database className="w-4 h-4 text-slate" /> Clear Local Data</span>
          </button>
        </Card>
      </section>
    </div>
  );
}
