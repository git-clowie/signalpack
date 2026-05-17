import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@/src/components/ui';
import { ArrowLeft, Clock, Download, CloudOff } from 'lucide-react';
import { getPackets, auth, savePacket } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { demoPackets } from '../demoData';
import { SyncEngine } from '../engine/sync';

export function HistoryScreen({ onBack, onSelectPacket }: { onBack: () => void, onSelectPacket: (packet: any) => void }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [queuedCount, setQueuedCount] = useState(0);

  useEffect(() => {
    const fetchHistory = async () => {
      let localHistory: any[] = [];
      const saved = localStorage.getItem('signalpack_history');
      if (saved) {
        try {
          localHistory = JSON.parse(saved);
        } catch (e) {}
      }

      setQueuedCount(SyncEngine.getQueue().length);

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
         if (user && navigator.onLine) {
            try {
               const remoteHistory = await getPackets();
               setHistory(remoteHistory.length > 0 ? remoteHistory : localHistory);
            } catch (e) {
               setHistory(localHistory);
            }
         } else {
            setHistory(localHistory);
         }
         setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchHistory();
    
    // Listen for sync events
    const handleSync = () => {
      setQueuedCount(SyncEngine.getQueue().length);
    };
    window.addEventListener('online', handleSync);
    
    return () => window.removeEventListener('online', handleSync);
  }, []);

  const handleForceSync = async () => {
    if (!navigator.onLine) {
      alert("You are offline. Sync will happen automatically when connected.");
      return;
    }
    await SyncEngine.flushQueue(savePacket);
    setQueuedCount(SyncEngine.getQueue().length);
  };

  const handleLoadDemo = async () => {
    const packetsWithDates = demoPackets.map(p => ({ ...p, createdAt: new Date().toISOString() }));
    
    // Save to local
    const currentLocal = JSON.parse(localStorage.getItem('signalpack_history') || '[]');
    const newLocal = [...packetsWithDates, ...currentLocal];
    localStorage.setItem('signalpack_history', JSON.stringify(newLocal));
    
    // Save to Firebase if logged in
    const user = auth.currentUser;
    if (user) {
       for (const pkg of packetsWithDates) {
          await savePacket(pkg);
       }
    }
    
    setHistory(user ? await getPackets() : newLocal);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full max-w-2xl mx-auto px-4 pb-6 pt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Packet History</h1>
          <p className="text-slate text-[10px] font-mono uppercase tracking-widest">Saved local-first</p>
        </div>
        {queuedCount > 0 && (
          <button 
             onClick={handleForceSync}
             className="flex items-center gap-2 bg-critical/20 text-critical text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-critical/30 hover:bg-critical/30 transition-colors"
          >
             <CloudOff className="w-3.5 h-3.5" />
             {queuedCount} pending sync
          </button>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {loading ? (
          <div className="text-center py-10">
             <p className="text-slate text-sm">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-10 flex flex-col items-center justify-center h-full">
             <Clock className="w-10 h-10 text-mist mb-4" />
             <p className="text-slate text-sm mb-6">No recent activity.</p>
             <Button variant="outline" size="sm" onClick={handleLoadDemo} className="border-blue text-blue hover:bg-blue/10">
               <Download className="w-4 h-4 mr-2" /> Load Demo Content
             </Button>
          </div>
        ) : history.map((packet, idx) => (
          <Card key={idx} className="p-5 cursor-pointer hover:border-cyan-brand/50 hover:bg-surface/80 transition-all bg-surface border-mist/40 shadow-sm relative group rounded-2xl" onClick={() => onSelectPacket(packet)}>
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-mist/20 group-hover:bg-cyan-brand/50 transition-colors" />
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                 <Badge variant={packet.severity === 'critical' ? 'critical' : packet.severity === 'high' ? 'warning' : 'blue'}>
                    {(packet.severity || 'UNKNOWN').toUpperCase()}
                 </Badge>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate uppercase tracking-widest flex items-center bg-mist/10 px-2 py-1 rounded">
                <Clock className="w-3 h-3 mr-1" />
                {packet.createdAt ? new Date(packet.createdAt).toLocaleDateString() : 'Just Now'}
              </span>
            </div>
            <p className="text-sm font-bold text-white leading-relaxed line-clamp-2">"{packet.share_message_short}"</p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="text-[10px] text-slate font-mono uppercase tracking-widest bg-cloud px-2 py-1 rounded border border-mist/30">{packet.location_text || 'Unknown Location'}</span>
              <span className="text-[10px] text-white font-mono uppercase tracking-widest bg-critical/10 border border-critical/20 px-2 py-1 rounded">{packet.people_at_risk_count || 0} at risk</span>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="pt-4 mt-auto border-t border-mist/50">
        <Button size="lg" fullWidth onClick={onBack} variant="outline">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
        </Button>
      </div>
    </div>
  );
}
