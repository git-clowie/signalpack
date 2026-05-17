import React from 'react';
import { auth, signInWithGoogle } from '../firebase';
import { LogIn, User as UserIcon, Menu, Settings } from 'lucide-react';
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
    <div className="sticky top-0 z-[100] border-b border-cyan-brand/10 bg-[#07080B]/78 px-4 pb-3 pt-9 backdrop-blur-md sm:pt-5">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button 
            onClick={openMenu}
            className="-ml-2 rounded-lg p-2 text-slate transition-colors hover:bg-mist/20 hover:text-white md:hidden"
            title="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo size="sm" containerClassName="h-10 w-10 rounded-xl" />
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

        <div className="flex items-center gap-2">
          <PWAInstall />
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
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-mist/50 bg-surface text-slate transition-colors hover:border-cyan-brand hover:text-cyan-brand"
              title="Menu"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </button>
          ) : (
            <button 
              onClick={handleSignIn}
              className="flex items-center gap-2 rounded-lg border border-blue/30 bg-blue/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue transition-all hover:bg-blue/20"
            >
              <LogIn className="h-3 w-3" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
