import React, { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui';
import { X, User, HelpCircle, LogOut, LayoutDashboard, History, HeartPulse, AlertTriangle, BookOpen, Bot, Target, Sliders } from 'lucide-react';
import { auth, signInWithGoogle, logout } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useAppStore } from '../engine/state/useAppStore';
import { MenuAbout } from './MenuAbout';
import { MenuSettings } from './MenuSettings';

export function MenuOverlay({
  isOpen,
  onClose,
  setIsLocalMode,
  onShowTutorial
}: {
  isOpen: boolean;
  onClose: () => void;
  setIsLocalMode: (v: boolean) => void;
  onShowTutorial: () => void;
}) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const { setAppState, resetDraft, currentState } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<'nav' | 'settings' | 'about'>('nav');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsub;
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

  const handleNav = (action: () => void) => {
    action();
    onClose();
  };

  const handleLogout = async () => {
    try {
      if (window.confirm("Are you sure you want to log out?")) {
        await logout();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end md:justify-center md:items-center p-0 md:p-6 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-xl max-h-[90vh] md:max-h-[85vh] bg-surface md:border border-t border-mist md:rounded-2xl rounded-t-3xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300 shadow-2xl relative"
      >
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-mist rounded-full absolute top-2 left-1/2 -translate-x-1/2 md:hidden" />

        {/* Header & Tabs */}
        <div className="pt-6 md:pt-6 px-5 pb-0 border-b border-mist/50 bg-surface/50 backdrop-blur-md">
           <div className="flex justify-between items-center mb-4 mt-2 md:mt-0">
             <div className="flex items-center gap-3">
               {user ? (
                 user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-mist object-cover" referrerPolicy="no-referrer" />
                 ) : (
                    <div className="w-10 h-10 bg-blue/20 rounded-full flex items-center justify-center text-blue">
                      <User className="w-5 h-5" />
                    </div>
                 )
               ) : (
                 <div className="w-10 h-10 bg-blue/20 rounded-full flex items-center justify-center text-blue">
                   <User className="w-5 h-5" />
                 </div>
               )}
               <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">{user ? user.displayName || 'Guardian' : 'Local User'}</h2>
                  <p className="text-[10px] text-cyan-brand font-mono uppercase tracking-widest">{user ? 'SYNC ENABLED' : 'NO SYNC ENABLED'}</p>
               </div>
             </div>
             
             <div className="flex items-center gap-2">
               {!user ? (
                 <Button size="sm" variant="outline" className="text-xs mr-2" onClick={handleSignIn}>Sign In</Button>
               ) : (
                 <button onClick={handleLogout} className="p-2 text-slate hover:text-cyan-brand transition-colors rounded-full hover:bg-mist/20 mr-1" title="Sign Out">
                    <LogOut className="w-4 h-4" />
                 </button>
               )}
               <button onClick={onClose} className="p-2 -mr-2 text-slate hover:text-white transition-colors rounded-full hover:bg-mist/20">
                 <X className="w-5 h-5" />
               </button>
             </div>
           </div>

           {/* Tabs */}
           <div className="flex gap-4 border-b border-transparent">
             <button
               onClick={() => setActiveTab('nav')}
               className={`pb-3 px-2 text-xs font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'nav' ? 'text-white' : 'text-slate hover:text-white'}`}
             >
               <span className="flex items-center gap-2"><Target className="w-4 h-4" /> Menu</span>
               {activeTab === 'nav' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue rounded-t-full" />}
             </button>
             <button
               onClick={() => setActiveTab('settings')}
               className={`pb-3 px-2 text-xs font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'settings' ? 'text-white' : 'text-slate hover:text-white'}`}
             >
               <span className="flex items-center gap-2"><Sliders className="w-4 h-4" /> Settings</span>
               {activeTab === 'settings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue rounded-t-full" />}
             </button>
             <button
               onClick={() => setActiveTab('about')}
               className={`pb-3 px-2 text-xs font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'about' ? 'text-white' : 'text-slate hover:text-white'}`}
             >
               <span className="flex items-center gap-2"><HelpCircle className="w-4 h-4" /> About</span>
               {activeTab === 'about' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-brand rounded-t-full" />}
             </button>
           </div>
        </div>

        <div className="p-5 flex-1 overflow-y-auto no-scrollbar pb-[env(safe-area-inset-bottom)] md:pb-6">
          
          {/* TAB: NAV */}
          {activeTab === 'nav' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <section className="space-y-2">
                <button onClick={() => handleNav(resetDraft)} className={`w-full text-left px-4 py-3.5 rounded-xl transition-colors text-sm font-bold uppercase tracking-widest flex items-center gap-3 ${currentState === 'home' || currentState === 'new_report' || currentState === 'ai_review' || currentState === 'clarification' ? 'bg-mist text-white' : 'text-slate hover:text-white hover:bg-mist/30'}`}>
                   <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                   <span>Dashboard</span>
                </button>
                <button onClick={() => handleNav(() => setAppState('history'))} className={`w-full text-left px-4 py-3.5 rounded-xl transition-colors text-sm font-bold uppercase tracking-widest flex items-center gap-3 ${currentState === 'history' ? 'bg-mist text-white' : 'text-slate hover:text-white hover:bg-mist/30'}`}>
                   <History className="w-5 h-5 flex-shrink-0" />
                   <span>Packet History</span>
                </button>
                <button onClick={() => handleNav(() => setAppState('medical_id'))} className={`w-full text-left px-4 py-3.5 rounded-xl transition-colors text-sm font-bold uppercase tracking-widest flex items-center gap-3 ${currentState === 'medical_id' ? 'bg-critical/20 text-critical' : 'text-slate hover:text-critical hover:bg-critical/10'}`}>
                   <HeartPulse className="w-5 h-5 flex-shrink-0" />
                   <span>Emergency Profile</span>
                </button>
                <button onClick={() => handleNav(() => setAppState('emergency_toolkit'))} className={`w-full text-left px-4 py-3.5 rounded-xl transition-colors text-sm font-bold uppercase tracking-widest flex items-center gap-3 ${currentState === 'emergency_toolkit' ? 'bg-yellow-500/20 text-yellow-500' : 'text-slate hover:text-yellow-500 hover:bg-yellow-500/10'}`}>
                   <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                   <span>Readiness Toolkit</span>
                </button>
                <button onClick={() => handleNav(() => setAppState('safety_guide'))} className={`w-full text-left px-4 py-3.5 rounded-xl transition-colors text-sm font-bold uppercase tracking-widest flex items-center gap-3 ${currentState === 'safety_guide' ? 'bg-mist text-white' : 'text-slate hover:text-white hover:bg-mist/30'}`}>
                   <BookOpen className="w-5 h-5 flex-shrink-0" />
                   <span>Safety Guide</span>
                </button>
                <button onClick={() => handleNav(() => setAppState('ask_gemma'))} className={`w-full text-left px-4 py-3.5 rounded-xl transition-colors text-sm font-bold uppercase tracking-widest flex items-center gap-3 ${currentState === 'ask_gemma' ? 'bg-cyan-brand/20 text-cyan-brand' : 'text-slate hover:text-cyan-brand hover:bg-cyan-brand/10'}`}>
                   <Bot className="w-5 h-5 flex-shrink-0" />
                   <span>Guided Help</span>
                </button>
              </section>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <MenuSettings userEmail={user?.email} setIsLocalMode={setIsLocalMode} />
          )}

          {/* TAB: ABOUT (Merged Presentation Modal) */}
          {activeTab === 'about' && (
            <MenuAbout onClose={onClose} onShowTutorial={onShowTutorial} />
          )}

        </div>
      </div>
    </div>
  );
}
