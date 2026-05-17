import React from 'react';
import { auth, signInWithGoogle, logout } from '../firebase';
import { LogIn, User as UserIcon, Menu } from 'lucide-react';
import { BrandWordmark } from './BrandWordmark';
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
    <div className="flex items-center justify-between px-4 pt-12 pb-4 sm:pt-8 sm:pb-3 bg-surface/30 border-b border-mist/20 backdrop-blur-md sticky top-0 z-[100]">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-2 -ml-2 text-slate hover:text-white transition-colors rounded-full hover:bg-mist/20 md:hidden"
          title="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <BrandWordmark compact />
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 rounded-full border border-mist/50 hover:border-cyan-brand transition-colors bg-surface text-slate hover:text-cyan-brand flex items-center justify-center overflow-hidden"
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
            className="flex items-center gap-2 px-3 py-1.5 bg-blue/10 border border-blue/30 rounded-lg text-blue hover:bg-blue/20 transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            <LogIn className="w-3 h-3" />
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}
