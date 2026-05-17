import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { Card, Button } from '@/src/components/ui';

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(isPWA);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // If not installed and is iOS, we might want to show instructions
    if (!isPWA && isIOSDevice) {
       // Only show after a delay, or conditionally
       const hasSeenPrompt = localStorage.getItem('pwa_prompt_seen');
       if (!hasSeenPrompt) {
           setTimeout(() => setShowPrompt(true), 3000);
       }
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const hasSeenPrompt = localStorage.getItem('pwa_prompt_seen');
      if (!hasSeenPrompt) {
         setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_seen', 'true');
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 animate-in slide-in-from-bottom-4 sm:left-auto sm:right-4 sm:w-[22rem]">
      <Card className="relative rounded-xl border-blue/25 bg-surface/95 p-3 shadow-2xl backdrop-blur-md">
        <button 
          onClick={handleDismiss}
          className="absolute right-2 top-2 rounded-md p-1 text-slate transition-colors hover:bg-mist/30 hover:text-white"
          aria-label="Dismiss install prompt"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-center gap-3 pr-6">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue/15 text-blue">
            <Download className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="mb-0.5 text-sm font-bold text-white">Install for offline access</h3>
            {isIOS ? (
              <p className="text-xs leading-relaxed text-slate">
                Tap <Share className="mx-0.5 inline h-3 w-3" /> Share, then <PlusSquare className="mx-0.5 inline h-3 w-3" /> Add to Home Screen.
              </p>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <p className="text-xs leading-relaxed text-slate sm:flex-1">Use cached tools when networks are unstable.</p>
                <Button onClick={handleInstallClick} size="sm" className="h-8 shrink-0 rounded-lg border-0 bg-blue px-3 text-white hover:bg-blue/90">
                  Install
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
