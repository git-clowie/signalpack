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
import { SettingsScreen } from './components/SettingsScreen';
import { AppFooter } from './components/AppFooter';
import { analyzeIncident, generatePacket } from './engine/ai';
import { savePacket } from './firebase';
import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from './engine/state/useAppStore';
import { SyncEngine } from './engine/sync';
import { AppState, DraftReport } from './types';
import { demoPackets } from './demoData';

const ROUTE_TO_STATE: Record<string, AppState> = {
  '': 'home',
  home: 'home',
  dashboard: 'home',
  capture: 'new_report',
  history: 'history',
  safety: 'safety_guide',
  'safety-guide': 'safety_guide',
  ask: 'ask_gemma',
  'ask-gemma': 'ask_gemma',
  profile: 'medical_id',
  'medical-id': 'medical_id',
  toolkit: 'emergency_toolkit',
  'emergency-toolkit': 'emergency_toolkit',
  settings: 'settings',
  demo: 'packet_output',
};

const STATE_TO_ROUTE: Partial<Record<AppState, string>> = {
  home: 'dashboard',
  new_report: 'capture',
  history: 'history',
  safety_guide: 'safety',
  ask_gemma: 'ask-gemma',
  medical_id: 'profile',
  emergency_toolkit: 'toolkit',
  settings: 'settings',
};

function getHashRoute() {
  if (typeof window === 'undefined') return '';
  return window.location.hash.replace(/^#\/?/, '').split('?')[0].trim();
}

export default function App() {
  const [appNotice, setAppNotice] = React.useState('');
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

  useEffect(() => {
    const applyRoute = () => {
      const route = getHashRoute();
      const nextState = ROUTE_TO_STATE[route];
      if (!nextState) return;

      if (route === 'demo') {
        updateDraft({ packet: demoPackets[0], stage: 'packet_output' });
      } else if (nextState === 'new_report') {
        updateDraft({ stage: 'new_report' });
      }

      setState(nextState);
    };

    applyRoute();
    window.addEventListener('hashchange', applyRoute);
    return () => window.removeEventListener('hashchange', applyRoute);
  }, [setState, updateDraft]);

  useEffect(() => {
    const route = STATE_TO_ROUTE[state];
    if (!route || typeof window === 'undefined') return;
    const nextHash = `#/${route}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
    }
  }, [state]);

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
      setAppNotice('Could not finalize the packet. Your draft is still here; try again or use Rapid Packet mode.');
      setState('new_report');
    }
  };

  return (
    <div className="min-h-screen w-full bg-cloud font-sans antialiased selection:bg-blue/20">
      <div className="flex min-h-screen w-full flex-col">
        {/* Global Auth Header */}
        {state !== 'packet_output' && <AuthHeader />}

        {appNotice && state !== 'packet_output' && (
          <div className="mx-auto mt-3 w-full max-w-6xl rounded-xl border border-warning/30 bg-warning/5 px-3 py-2 text-xs leading-relaxed text-warning md:px-4">
            <div className="flex items-start justify-between gap-3">
              <span>{appNotice}</span>
              <button onClick={() => setAppNotice('')} className="shrink-0 text-warning/70 hover:text-warning">Dismiss</button>
            </div>
          </div>
        )}

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
                  onViewMedical={() => setState('medical_id')}
                  onViewToolkit={() => setState('emergency_toolkit')}
                  onOpenDemo={() => {
                    updateDraft({ packet: demoPackets[0], stage: 'packet_output' });
                    setState('packet_output');
                  }}
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

            {state === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                <SettingsScreen onBack={() => setState('home')} setIsLocalMode={setIsLocalMode} />
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
        onShowTutorial={() => setShowTutorial(true)}
      />

      {showTutorial && (
        <TutorialOverlay onClose={() => setShowTutorial(false)} />
      )}
      {state !== 'packet_output' && <AppFooter />}
    </div>
  );
}
