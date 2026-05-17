import React, { useState, useEffect } from 'react';
import { X, User, HelpCircle, LogOut, LayoutDashboard, History, HeartPulse, AlertTriangle, BookOpen, Bot, Settings, LogIn } from 'lucide-react';
import { auth, hasFirebaseConfig, signInWithGoogle, logout } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useAppStore } from '../engine/state/useAppStore';

export function MenuOverlay({
  isOpen,
  onClose,
  onShowTutorial
}: {
  isOpen: boolean;
  onClose: () => void;
  onShowTutorial: () => void;
}) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authError, setAuthError] = useState('');
  const { setAppState, resetDraft, currentState } = useAppStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsub;
  }, []);

  const handleSignIn = async () => {
    try {
      setAuthError('');
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      setAuthError('Cloud sync is not configured here. You can keep using SignalPack locally.');
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

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: ['home', 'new_report', 'ai_review', 'clarification'].includes(currentState),
      action: resetDraft,
    },
    { label: 'History', icon: History, active: currentState === 'history', action: () => setAppState('history') },
    { label: 'Profile', icon: HeartPulse, active: currentState === 'medical_id', action: () => setAppState('medical_id') },
    { label: 'Toolkit', icon: AlertTriangle, active: currentState === 'emergency_toolkit', action: () => setAppState('emergency_toolkit') },
    { label: 'Safety', icon: BookOpen, active: currentState === 'safety_guide', action: () => setAppState('safety_guide') },
    { label: 'Ask Gemma', icon: Bot, active: currentState === 'ask_gemma', action: () => setAppState('ask_gemma') },
    { label: 'Settings', icon: Settings, active: currentState === 'settings', action: () => setAppState('settings') },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="my-2 mr-2 ml-auto flex h-[calc(100%-1rem)] w-[min(22rem,calc(100vw-0.75rem))] max-w-[22rem] flex-col overflow-hidden rounded-l-2xl rounded-r-xl border border-mist/70 bg-[#07080B]/95 shadow-2xl animate-in slide-in-from-right-full duration-300"
      >
        <div className="border-b border-mist/50 bg-surface/80 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur-md md:pt-4">
           <div className="flex items-center justify-between gap-3">
             <div className="flex min-w-0 items-center gap-2.5">
               {user ? (
                 user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="h-9 w-9 rounded-xl border border-mist object-cover" referrerPolicy="no-referrer" />
                 ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue/15 text-blue">
                      <User className="h-[1.125rem] w-[1.125rem]" />
                    </div>
                 )
               ) : (
                 <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue/15 text-blue">
                   <User className="h-[1.125rem] w-[1.125rem]" />
                 </div>
               )}
               <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold tracking-tight text-white">{user ? user.displayName || 'Guardian' : 'Local User'}</h2>
                  <p className="truncate text-[9px] font-mono uppercase tracking-[0.18em] text-cyan-brand">{user ? 'Sync enabled' : 'Local mode'}</p>
               </div>
             </div>
             
             <div className="flex shrink-0 items-center gap-1.5">
               {!user && hasFirebaseConfig ? (
                 <button
                   className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg border border-cyan-brand/25 bg-cyan-brand/10 px-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-brand transition-colors hover:bg-cyan-brand/15"
                   onClick={handleSignIn}
                 >
                   <LogIn className="h-3 w-3" />
                   Sync
                 </button>
               ) : (
                 user && (
                 <button onClick={handleLogout} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate transition-colors hover:bg-mist/40 hover:text-cyan-brand" title="Sign Out">
                    <LogOut className="h-4 w-4" />
                 </button>
                 )
               )}
               <button
                 onClick={onClose}
                 aria-label="Close menu"
                 className="flex h-8 w-8 items-center justify-center rounded-lg text-slate transition-colors hover:bg-mist/40 hover:text-white"
               >
                 <X className="h-5 w-5" />
               </button>
             </div>
           </div>

           {authError && (
             <div className="mb-4 rounded-xl border border-warning/30 bg-warning/5 px-3 py-2 text-xs leading-relaxed text-warning">
               {authError}
             </div>
           )}

        </div>

        <div className="flex-1 overflow-y-auto p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:p-4">
          <div className="space-y-4 animate-in fade-in duration-200">
            <section className="space-y-1.5">
              <p className="px-2 pb-1 text-[9px] font-mono uppercase tracking-[0.22em] text-faint">Navigate</p>
              {navItems.map(({ label, icon: Icon, active, action }) => (
                <button
                  key={label}
                  onClick={() => handleNav(action)}
                  className={`flex h-11 w-full items-center gap-2.5 rounded-xl border px-3 text-left text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${
                    active
                      ? 'border-cyan-brand/25 bg-cyan-brand/10 text-cyan-brand shadow-[0_0_18px_rgba(0,230,255,0.08)]'
                      : 'border-transparent text-slate hover:border-mist/70 hover:bg-mist/25 hover:text-white'
                  }`}
                >
                  <Icon className="h-[1.125rem] w-[1.125rem] shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </section>

            <button
              onClick={() => {
                onClose();
                onShowTutorial();
              }}
              className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-mist/40 bg-cloud/35 px-3 text-left text-[11px] font-bold uppercase tracking-[0.16em] text-slate transition-colors hover:border-cyan-brand/40 hover:text-white"
            >
              <HelpCircle className="h-[1.125rem] w-[1.125rem]" />
              <span className="truncate">About</span>
            </button>

            <div className="rounded-xl border border-mist/30 bg-cloud/35 px-3 py-3">
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-blue">Built by pixek.xyz</p>
              <p className="mt-1 text-[9px] font-mono uppercase tracking-[0.18em] text-slate">
                Local-first Crisis Packets • Gemma 4 ready
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
