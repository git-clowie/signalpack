import React, { useEffect } from 'react';
import { HomeScreen } from './components/Home';
import { NewReportScreen } from './components/NewReport';
import { AIReviewScreen } from './components/AIReview';
import { ClarificationScreen } from './components/Clarification';
import { PacketOutputScreen } from './components/PacketOutput';
import { HistoryScreen } from './components/History';
import { SafetyGuideScreen } from './components/SafetyGuide';
import { MenuOverlay } from './components/MenuOverlay';
import { TutorialOverlay } from './components/TutorialOverlay';
import { AuthHeader } from './components/AuthHeader';
import { AskGemmaScreen } from './components/AskGemma';
import { MedicalIDScreen } from './components/MedicalID';
import { EmergencyToolkitScreen } from './components/EmergencyToolkit';
import { PWAInstall } from './components/PWAInstall';
import { Menu, LayoutDashboard, History, BookOpen, Bot, HeartPulse, AlertTriangle } from 'lucide-react';
import { analyzeIncident, generatePacket } from './engine/ai';
import { savePacket } from './firebase';
import { motion, AnimatePresence } from "motion/react";
import { BrandWordmark } from './components/BrandWordmark';
import { useAppStore } from './engine/state/useAppStore';
import { SyncEngine } from './engine/sync';
import { DraftReport } from './types';

export default function App() {
  const { 
    currentState: state, 
    setAppState: setState, 
    draft, 
    updateDraft,
    resetDraft,
    isLocalMode, 
    setIsLocalMode, 
    showTutorial, 
    setShowTutorial, 
    isMenuOpen, 
    setIsMenuOpen,
    setMenuTab,
  } = useAppStore();
  
  const effectiveLocalMode = isLocalMode;

  useEffect(() => {
    // Keep first launch action-first; the tutorial stays available from Settings.
    const hasSeenTutorial = localStorage.getItem('signalpack_tutorial');
    if (!hasSeenTutorial) {
      localStorage.setItem('signalpack_tutorial', 'true');
    }

    // Initial sync attempt
    SyncEngine.flushQueue(savePacket);
  }, [setShowTutorial]);

  useEffect(() => {
    setIsLocalMode(!navigator.onLine);

    const handleOnline = () => {
       setIsLocalMode(false);
       SyncEngine.flushQueue(savePacket);
    };
    const handleOffline = () => setIsLocalMode(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setIsLocalMode]);

  const handleNewReportSubmit = async (data: Partial<DraftReport>) => {
    updateDraft({ ...data, stage: 'ai_review' });
    setState('ai_review');
    
    try {
      const combinedData = { ...draft, ...data };
      const { medicalProfile } = useAppStore.getState();
      const analysisParams = await analyzeIncident(combinedData.text || '', combinedData.image, combinedData.audio, medicalProfile);
      
      if (combinedData.fastSend) {
        updateDraft({ 
          packet: analysisParams.packet as any, 
          clarificationQuestions: [] 
        });
        const finalPacket = await generatePacket({
            ...combinedData,
            packet: analysisParams.packet as any,
            clarificationAnswers: []
        }, medicalProfile);
        updateDraft({ packet: finalPacket, stage: 'packet_output' });

        const savedHistory = JSON.parse(localStorage.getItem('signalpack_history') || '[]');
        savedHistory.unshift(finalPacket);
        localStorage.setItem('signalpack_history', JSON.stringify(savedHistory));
        
        try {
          await savePacket(finalPacket);
        } catch (e) {
          await SyncEngine.enqueuePacket(finalPacket);
        }
        
        setState('packet_output');
      } else {
        updateDraft({ 
          packet: { ...(combinedData.packet || {}), ...analysisParams.packet } as any, 
          clarificationQuestions: analysisParams.questions 
        });
      }
    } catch (e: any) {
      console.error("AI Error:", e);
      updateDraft({
        packet: {
          incident_type: 'other' as any,
          hazards: ['Could not complete AI analysis: ' + (e.message || String(e))],
          uncertainties: ['Please review manually.']
        },
        clarificationQuestions: []
      });
    }
  };

  const handleClarificationComplete = async (answers: string[]) => {
    updateDraft({ clarificationAnswers: answers });
    const nextDraft = { ...draft, clarificationAnswers: answers };
    
    try {
      const { medicalProfile } = useAppStore.getState();
      const finalPacket = await generatePacket(nextDraft, medicalProfile);
      updateDraft({ packet: finalPacket, stage: 'packet_output' });

      const savedHistory = JSON.parse(localStorage.getItem('signalpack_history') || '[]');
      savedHistory.unshift(finalPacket);
      localStorage.setItem('signalpack_history', JSON.stringify(savedHistory));
      
      try {
        await savePacket(finalPacket);
      } catch (e) {
        console.warn('Could not save to cloud, queuing for offline sync.', e);
        await SyncEngine.enqueuePacket(finalPacket);
      }
      
      setState('packet_output');
    } catch (e: any) {
      console.error(e);
      alert('Error generating packet: ' + (e.message || String(e)));
    }
  };

  return (
    <div className="min-h-screen w-full bg-cloud font-sans antialiased selection:bg-blue/20 flex flex-col md:flex-row max-w-7xl mx-auto">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-mist/30 p-6 overscroll-contain overflow-y-auto min-h-screen bg-surface/50">
        <div className="flex items-center gap-3 mb-10">
          <BrandWordmark compact />
        </div>

        <nav className="flex-1 space-y-2 mt-6">
          <button onClick={() => resetDraft()} className={`w-full text-left px-4 py-3 rounded-xl transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-3 ${state === 'home' || state === 'new_report' || state === 'ai_review' || state === 'clarification' ? 'bg-mist text-white' : 'text-slate hover:text-white hover:bg-mist/30'}`}>
             <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
             <span>Dashboard</span>
          </button>
          <button onClick={() => setState('history')} className={`w-full text-left px-4 py-3 rounded-xl transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-3 ${state === 'history' ? 'bg-mist text-white' : 'text-slate hover:text-white hover:bg-mist/30'}`}>
             <History className="w-5 h-5 flex-shrink-0" />
             <span>Packet History</span>
          </button>
          
          <div className="pt-4 pb-2 px-4">
            <span className="text-[10px] font-bold text-slate uppercase tracking-widest">Tools & AI</span>
          </div>

          <button onClick={() => setState('medical_id')} className={`w-full text-left px-4 py-3 rounded-xl transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-3 ${state === 'medical_id' ? 'bg-critical/20 text-critical' : 'text-slate hover:text-critical hover:bg-critical/10'}`}>
             <HeartPulse className="w-5 h-5 flex-shrink-0" />
             <span>Emergency Profile</span>
          </button>
          
          <button onClick={() => setState('emergency_toolkit')} className={`w-full text-left px-4 py-3 rounded-xl transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-3 ${state === 'emergency_toolkit' ? 'bg-yellow-500/20 text-yellow-500' : 'text-slate hover:text-yellow-500 hover:bg-yellow-500/10'}`}>
             <AlertTriangle className="w-5 h-5 flex-shrink-0" />
             <span>Readiness Toolkit</span>
          </button>

          <button onClick={() => setState('safety_guide')} className={`w-full text-left px-4 py-3 rounded-xl transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-3 ${state === 'safety_guide' ? 'bg-mist text-white' : 'text-slate hover:text-white hover:bg-mist/30'}`}>
             <BookOpen className="w-5 h-5 flex-shrink-0" />
             <span>Safety Guide</span>
          </button>
          <button onClick={() => setState('ask_gemma')} className={`w-full text-left px-4 py-3 rounded-xl transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-3 ${state === 'ask_gemma' ? 'bg-cyan-brand/20 text-cyan-brand' : 'text-slate hover:text-cyan-brand hover:bg-cyan-brand/10'}`}>
             <Bot className="w-5 h-5 flex-shrink-0" />
             <span>Guided Help</span>
          </button>
        </nav>

        <div className="mt-auto">
           <button onClick={() => { setMenuTab('settings'); setIsMenuOpen(true); }} className="w-full text-left px-4 py-3 rounded-xl transition-colors text-sm font-bold uppercase tracking-widest text-slate hover:text-white hover:bg-mist/30 flex items-center gap-2">
             <Menu className="w-4 h-4" /> Settings
           </button>
           <div className="mt-6 pt-4 border-t border-mist/30 px-4">
             <p className="text-[10px] text-blue font-mono opacity-80 mt-1 uppercase tracking-widest">Built by pixek.xyz</p>
           </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto relative md:border-x md:border-mist/20 md:bg-surface/10 md:shadow-2xl">
        {/* Global Auth Header */}
        {state !== 'packet_output' && <AuthHeader />}

        <main className="w-full flex-1 overflow-x-hidden overflow-y-auto relative">
          <AnimatePresence mode="wait">
            {state === 'home' && (
              <motion.div key="home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full">
                <HomeScreen 
                  onStartReport={(isPanic) => {
                    updateDraft({ fastSend: isPanic || false, stage: 'new_report' });
                    setState('new_report');
                  }} 
                  onViewHistory={() => setState('history')} 
                  onViewSafety={() => setState('safety_guide')}
                  onAskGemma={() => setState('ask_gemma')}
                  isLocalMode={effectiveLocalMode}
                />
              </motion.div>
            )}

            {state === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                <HistoryScreen 
                  onBack={() => setState('home')} 
                  onSelectPacket={(packet) => {
                    updateDraft({ stage: 'packet_output', packet });
                    setState('packet_output');
                  }}
                />
              </motion.div>
            )}

            {state === 'safety_guide' && (
              <motion.div key="safety" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                <SafetyGuideScreen 
                  onBack={() => setState('home')} 
                />
              </motion.div>
            )}

            {state === 'ask_gemma' && (
              <motion.div key="ask_gemma" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                <AskGemmaScreen onBack={() => setState('home')} />
              </motion.div>
            )}

            {state === 'medical_id' && (
              <motion.div key="medical_id" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                <MedicalIDScreen onBack={() => setState('home')} />
              </motion.div>
            )}

            {state === 'emergency_toolkit' && (
              <motion.div key="emergency_toolkit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                <EmergencyToolkitScreen onBack={() => setState('home')} />
              </motion.div>
            )}

            {state === 'new_report' && (
              <motion.div key="new_report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full">
                <NewReportScreen onNext={handleNewReportSubmit} initialFastSend={!!draft.fastSend} />
              </motion.div>
            )}

            {state === 'ai_review' && (
              <motion.div key="ai_review" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="h-full">
                <AIReviewScreen 
                  report={draft}
                  onNext={async () => {
                    if (draft.clarificationQuestions && draft.clarificationQuestions.length > 0) {
                      setState('clarification');
                    } else {
                      await handleClarificationComplete([]);
                    }
                  }}
                />
              </motion.div>
            )}

            {state === 'clarification' && (
              <motion.div key="clarification" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                <ClarificationScreen 
                  report={draft}
                  onComplete={handleClarificationComplete}
                />
              </motion.div>
            )}

            {state === 'packet_output' && (
              <motion.div key="packet_output" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="h-full">
                <PacketOutputScreen 
                  packet={draft.packet as any}
                  onDone={resetDraft}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <MenuOverlay 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        setIsLocalMode={setIsLocalMode}
        onShowTutorial={() => setShowTutorial(true)}
      />

      {showTutorial && (
        <TutorialOverlay onClose={() => setShowTutorial(false)} />
      )}
      <PWAInstall />
    </div>
  );
}
