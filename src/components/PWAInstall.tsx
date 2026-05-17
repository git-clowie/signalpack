import React, { useEffect, useState } from 'react';
import { Download, PlusSquare, Share, X } from 'lucide-react';

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(isPWA);

    const isIOSDevice = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    setIsIOS(isIOSDevice);

    const handler = (event: any) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowTip(false);
      return;
    }

    if (isIOS) {
      setShowTip((value) => !value);
    }
  };

  if (isStandalone || (!deferredPrompt && !isIOS)) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleInstallClick}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-cyan-brand/25 bg-cyan-brand/10 px-2.5 text-[10px] font-bold uppercase tracking-widest text-cyan-brand transition-colors hover:bg-cyan-brand/15 sm:px-3"
      >
        <Download className="h-3.5 w-3.5" />
        <span>Install</span>
      </button>

      {showTip && (
        <div className="absolute right-0 top-11 z-[130] w-72 rounded-xl border border-cyan-brand/20 bg-surface/95 p-3 shadow-2xl shadow-black/40 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setShowTip(false)}
            className="absolute right-2 top-2 rounded-md p-1 text-slate transition-colors hover:bg-mist/30 hover:text-white"
            aria-label="Close install help"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="pr-6 text-xs font-bold text-white">Install SignalPack</p>
          <p className="mt-1 text-xs leading-relaxed text-slate">
            Tap <Share className="mx-0.5 inline h-3 w-3" /> Share, then <PlusSquare className="mx-0.5 inline h-3 w-3" /> Add to Home Screen.
          </p>
        </div>
      )}
    </div>
  );
}
