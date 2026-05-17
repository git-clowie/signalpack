import React from 'react';
import { auth, signInWithGoogle } from '../firebase';
import { LogIn, User as UserIcon, Menu } from 'lucide-react';
import { useAppStore } from '../engine/state/useAppStore';

export function AuthHeader() {
  const [user, setUser] = React.useState(auth.currentUser);
  const setIsMenuOpen = useAppStore(state => state.setIsMenuOpen);

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

  return (
    <div className="sticky top-0 z-[100] flex items-center justify-between border-b border-mist/20 bg-surface/45 px-4 pb-3 pt-9 backdrop-blur-md sm:pt-5">
      <div className="flex min-w-0 items-center gap-3">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="-ml-2 rounded-lg p-2 text-slate transition-colors hover:bg-mist/20 hover:text-white md:hidden"
          title="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-brand shadow-[0_0_8px_var(--color-cyan-brand)]" />
            <span className="truncate text-sm font-bold tracking-tight text-white">SignalPack</span>
          </div>
          <p className="hidden text-[9px] font-mono uppercase tracking-widest text-slate sm:block">Gemma 4 crisis packets</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <button 
            onClick={() => setIsMenuOpen(true)}
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
  );
}
