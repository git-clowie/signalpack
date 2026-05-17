import React from 'react';
import { auth, hasFirebaseConfig, signInWithGoogle } from '../firebase';
import { Database, LogIn, User as UserIcon, Menu, Settings } from 'lucide-react';
import { useAppStore } from '../engine/state/useAppStore';
import { Logo } from './Logo';
import { PWAInstall } from './PWAInstall';

export function AuthHeader() {
  const [user, setUser] = React.useState(auth.currentUser);
  const currentState = useAppStore(state => state.currentState);
  const setAppState = useAppStore(state => state.setAppState);
  const resetDraft = useAppStore(state => state.resetDraft);
  const setIsMenuOpen = useAppStore(state => state.setIsMenuOpen);
  const setMenuTab = useAppStore(state => state.setMenuTab);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
    }
  };

  const openMenu = () => {
    setMenuTab('nav');
    setIsMenuOpen(true);
  };

  const openSettings = () => {
    setAppState('settings');
  };

  const navItems = [
    { label: 'Dashboard', active: ['home', 'new_report', 'ai_review', 'clarification'].includes(currentState), action: resetDraft },
    { label: 'History', active: currentState === 'history', action: () => setAppState('history') },
    { label: 'Safety', active: currentState === 'safety_guide', action: () => setAppState('safety_guide') },
    { label: 'Ask Gemma', active: currentState === 'ask_gemma', action: () => setAppState('ask_gemma') },
  ];

  return (
    <div className="sticky top-0 z-[100] border-b border-cyan-brand/10 bg-[#040404] px-2.5 pb-3 pt-9 sm:px-4 sm:pt-5">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Logo size="sm" containerClassName="h-8 w-8 rounded-lg border-cyan-brand/15 shadow-none sm:h-10 sm:w-10" />
          <div className="hidden min-w-0 md:block">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-bold tracking-tight text-white">SignalPack</span>
            </div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-slate">Gemma 4 crisis packets</p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 rounded-xl border border-mist/30 bg-cloud/45 p-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${item.active ? 'bg-cyan-brand/10 text-cyan-brand shadow-[0_0_18px_rgba(0,230,255,0.08)]' : 'text-slate hover:bg-mist/30 hover:text-white'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <div className="hidden md:block">
            <PWAInstall />
          </div>
          <button
            onClick={openSettings}
            className={`hidden h-9 items-center gap-2 rounded-lg border px-3 text-[10px] font-bold uppercase tracking-widest transition-colors md:flex ${currentState === 'settings' ? 'border-cyan-brand/30 bg-cyan-brand/10 text-cyan-brand' : 'border-mist/40 bg-surface/70 text-slate hover:border-cyan-brand/40 hover:text-cyan-brand'}`}
          >
            <Settings className="h-3.5 w-3.5" />
            Settings
          </button>
          {user ? (
            <button 
              onClick={openMenu}
              className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-mist/50 bg-surface text-slate transition-colors hover:border-cyan-brand hover:text-cyan-brand sm:h-9 sm:w-9"
              title="Menu"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </button>
          ) : hasFirebaseConfig ? (
            <button 
              onClick={handleSignIn}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue/30 bg-blue/10 text-[10px] font-bold uppercase tracking-widest text-blue transition-all hover:bg-blue/20 sm:h-9 sm:w-auto sm:gap-2 sm:px-3 sm:py-1.5"
            >
              <LogIn className="h-3 w-3" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={openSettings}
              aria-label="Open local settings"
              title="Local settings"
              className="inline-flex h-8 w-7 items-center justify-center rounded-lg text-cyan-brand transition-colors hover:bg-cyan-brand/10 hover:text-white sm:h-9 sm:w-auto sm:border sm:border-mist/40 sm:bg-surface/70 sm:px-3 sm:py-2 sm:text-slate sm:hover:border-cyan-brand/40"
            >
              <UserIcon className="h-3.5 w-3.5 sm:hidden" />
              <Database className="hidden h-3 w-3 sm:block" />
              <span className="hidden text-[10px] font-bold uppercase tracking-widest sm:inline">Local</span>
            </button>
          )}
          <button
            onClick={openMenu}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-mist/40 bg-surface/70 text-slate transition-colors hover:border-cyan-brand/40 hover:text-white sm:h-9 sm:w-9 md:hidden"
            title="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
