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
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-5">
      <Card className="p-4 border-blue/30 bg-surface/95 backdrop-blur-md shadow-2xl relative">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-slate hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start gap-4">
          <div className="bg-blue/20 p-3 rounded-xl shrink-0">
            <Download className="w-6 h-6 text-blue" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white mb-1">Install Offline App</h3>
            {isIOS ? (
              <div className="text-xs text-slate space-y-2">
                <p>SignalPack works offline during emergencies. Install it to your home screen:</p>
                <ol className="list-decimal list-inside space-y-1 font-medium text-white/80">
                  <li>Tap the <Share className="inline w-3 h-3 mx-1" /> <strong>Share</strong> button</li>
                  <li>Scroll down and select <PlusSquare className="inline w-3 h-3 mx-1" /> <strong>Add to Home Screen</strong></li>
                </ol>
              </div>
            ) : (
              <div className="text-xs text-slate space-y-2">
                <p>Install SignalPack to use it offline when networks go down.</p>
                <Button onClick={handleInstallClick} size="sm" className="w-full mt-2 bg-blue text-white hover:bg-blue/90 border-0">
                  Install Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
