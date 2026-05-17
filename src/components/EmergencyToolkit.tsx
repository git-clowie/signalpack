import React, { useState, useEffect } from 'react';
import { Card, Button } from '@/src/components/ui';
import { ArrowLeft, BellRing, Navigation, Flashlight, MapPin, Share2, Activity } from 'lucide-react';
import { useAppStore } from '../engine/state/useAppStore';

export function EmergencyToolkitScreen({ onBack }: { onBack: () => void }) {
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [isMorseActive, setIsMorseActive] = useState(false);
  const [isCprActive, setIsCprActive] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  const [strobeState, setStrobeState] = useState(false);

  const [location, setLocation] = useState<{lat: number, lng: number, acc: number} | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition((pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            acc: pos.coords.accuracy
          });
       });
    }
  }, []);

  // Simple Siren Logic
  useEffect(() => {
    let interval: any;
    if (isSirenActive && !isMorseActive) {
      interval = setInterval(() => {
        setStrobeState(prev => !prev);
      }, 150); // fast strobe
    } else if (!isMorseActive) {
      setStrobeState(false);
    }
    return () => clearInterval(interval);
  }, [isSirenActive, isMorseActive]);

  // Morse Code (SOS) Logic
  useEffect(() => {
    if (!isMorseActive) return;
    
    // S: 3 short (200ms)
    // O: 3 long (600ms)
    // S: 3 short (200ms)
    // pauses between flashes: 200ms, between letters: 600ms, between words: 1400ms
    const sosSequence = [
      200, 200, 200, // S (on)
      0, 0, 0, // S pauses
      600, 600, 600, // O
      200, 200, 200 // S
    ];
    // simplified loop:
    const pattern = [
      { on: true, t: 200 }, { on: false, t: 200 },
      { on: true, t: 200 }, { on: false, t: 200 },
      { on: true, t: 200 }, { on: false, t: 600 },
      
      { on: true, t: 600 }, { on: false, t: 200 },
      { on: true, t: 600 }, { on: false, t: 200 },
      { on: true, t: 600 }, { on: false, t: 600 },
      
      { on: true, t: 200 }, { on: false, t: 200 },
      { on: true, t: 200 }, { on: false, t: 200 },
      { on: true, t: 200 }, { on: false, t: 1400 },
    ];

    let timeoutId: any;
    let step = 0;

    const playStep = () => {
      setStrobeState(pattern[step].on);
      timeoutId = setTimeout(() => {
        step = (step + 1) % pattern.length;
        playStep();
      }, pattern[step].t);
    };

    playStep();

    return () => {
      clearTimeout(timeoutId);
      setStrobeState(false);
    };
  }, [isMorseActive]);

  // CPR Metronome Logic (110 BPM ≈ 545ms interval)
  useEffect(() => {
    let interval: any;
    if (isCprActive) {
      interval = setInterval(() => {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          
          gainNode.gain.setValueAtTime(1, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
          
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
          console.error("Audio API not supported", e);
        }
      }, 545);
    }
    return () => clearInterval(interval);
  }, [isCprActive]);

  const toggleSiren = () => {
    if (isSirenActive) {
      if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
      }
      setIsSirenActive(false);
    } else {
      setIsMorseActive(false); // disable morse
      setIsCprActive(false); // disable cpr
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        
        let up = true;
        setInterval(() => {
           if (up) {
              osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.5);
           } else {
              osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.5);
           }
           up = !up;
        }, 500);

        gainNode.gain.value = 1;

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();

        setAudioContext(ctx);
        setOscillator(osc);
        setIsSirenActive(true);
      } catch (e) {
        console.error("Audio API not supported", e);
        setIsSirenActive(true);
      }
    }
  };

  const shareLocation = async () => {
    if (!location) return;
    const text = `EMERGENCY / SOS\nMy current location: https://maps.google.com/?q=${location.lat},${location.lng}\nAccuracy: ~${Math.round(location.acc)}m`;
    if (navigator.share) {
      try {
         await navigator.share({
           title: 'Emergency Location',
           text: text,
         });
      } catch (e) {
         console.error('Share failed', e);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Location copied to clipboard.');
    }
  };

  // cleanup
  useEffect(() => {
    return () => {
      if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [oscillator, audioContext]);

  return (
    <div className={`mx-auto flex h-[calc(100vh-4rem)] w-full max-w-6xl flex-col px-4 pb-6 pt-4 md:px-6 lg:px-8 relative transition-colors duration-75 overflow-y-auto ${strobeState ? 'bg-white' : 'bg-cloud'}`}>
      <div className="flex items-center gap-3 mb-6 relative z-10 transition-colors">
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${strobeState ? 'bg-black/10 text-black hover:bg-black/20' : 'bg-surface/50 border border-mist/30 text-white hover:bg-mist/30'}`}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${strobeState ? 'text-black' : 'text-slate'}`}>Readiness Toolkit</span>
      </div>

      <div className="relative z-10 grid gap-4 lg:grid-cols-2">
        <Card className={`p-6 border-mist/30 flex flex-col items-center justify-center text-center transition-all ${strobeState ? 'bg-black/5' : 'bg-surface/50'}`}>
          <div className="mb-4">
            <BellRing className={`w-12 h-12 ${isSirenActive ? 'text-critical animate-pulse' : (strobeState ? 'text-black/50' : 'text-blue')}`} />
          </div>
          <h2 className={`text-xl font-bold mb-2 ${strobeState ? 'text-black' : 'text-white'}`}>Audible Siren</h2>
          <p className={`text-xs mb-6 font-medium leading-relaxed max-w-xs ${strobeState ? 'text-black/70' : 'text-slate'}`}>
            Trigger a loud audible alarm sweeping from 400Hz to 800Hz to attract nearby responders or deter threats.
          </p>
          <Button 
            onClick={toggleSiren}
            className={`w-full py-6 text-sm tracking-widest uppercase font-bold rounded-2xl transition-all ${
              isSirenActive ? 'bg-critical text-white shadow-[0_0_30px_rgba(239,68,68,0.6)]' : 'bg-surface border border-mist text-slate hover:text-white'
            }`}
          >
            {isSirenActive ? 'STOP SIREN' : 'ACTIVATE SIREN'}
          </Button>
        </Card>

        <Card className={`p-6 border-mist/30 flex flex-col items-center justify-center text-center transition-all ${strobeState && !isMorseActive ? 'bg-black/5 flex-col' : 'bg-surface/50'}`}>
          <div className="mb-4">
            <Flashlight className={`w-12 h-12 ${isMorseActive ? 'text-yellow-500 animate-pulse' : (strobeState ? 'text-black/50' : 'text-yellow-500')}`} />
          </div>
          <h2 className={`text-xl font-bold mb-2 ${strobeState ? 'text-black' : 'text-white'}`}>SOS Screen Flash</h2>
          <p className={`text-xs mb-6 font-medium leading-relaxed max-w-xs ${strobeState ? 'text-black/70' : 'text-slate'}`}>
            Turn brightness to MAX. Screen will flash the visual Morse Code pattern for SOS (··· ——— ···).
          </p>
          <Button 
            onClick={() => {
               setIsSirenActive(false);
               setIsMorseActive(!isMorseActive);
               setIsCprActive(false);
            }}
            className={`w-full py-6 text-sm tracking-widest uppercase font-bold rounded-2xl transition-all ${
              isMorseActive ? 'bg-yellow-500 text-black shadow-[0_0_30px_rgba(234,179,8,0.6)]' : 'bg-surface border border-mist text-slate hover:text-white'
            }`}
          >
            {isMorseActive ? 'STOP FLASHING' : 'ACTIVATE MORSE SOS'}
          </Button>
        </Card>

        <Card className={`p-6 border-mist/30 flex flex-col items-center justify-center text-center transition-all ${strobeState ? 'bg-black/5' : 'bg-surface/50'}`}>
          <div className="mb-4">
            <Activity className={`w-12 h-12 ${isCprActive ? 'text-success animate-pulse' : (strobeState ? 'text-black/50' : 'text-success')}`} />
          </div>
          <h2 className={`text-xl font-bold mb-2 ${strobeState ? 'text-black' : 'text-white'}`}>CPR Metronome</h2>
          <p className={`text-xs mb-6 font-medium leading-relaxed max-w-xs ${strobeState ? 'text-black/70' : 'text-slate'}`}>
            Provides a continuous 110 BPM audio cue to assist with pacing chest compressions during CPR.
          </p>
          <Button 
            onClick={() => {
               setIsSirenActive(false);
               setIsMorseActive(false);
               setIsCprActive(!isCprActive);
            }}
            className={`w-full py-6 text-sm tracking-widest uppercase font-bold rounded-2xl transition-all border ${
              isCprActive ? 'bg-success border-success text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-surface border-mist text-slate hover:text-white'
            }`}
          >
            {isCprActive ? 'STOP METRONOME' : 'START 110 BPM'}
          </Button>
        </Card>

        <Card className={`p-6 border-mist/30 flex flex-col items-center justify-center text-center transition-all ${strobeState ? 'bg-black/5' : 'bg-surface/50'}`}>
          <div className="mb-4">
            <MapPin className={`w-12 h-12 ${strobeState ? 'text-black/50' : 'text-cyan-brand'}`} />
          </div>
          <h2 className={`text-xl font-bold mb-2 ${strobeState ? 'text-black' : 'text-white'}`}>Rapid GPS Share</h2>
          <p className={`text-xs mb-4 font-mono ${strobeState ? 'text-black/70' : 'text-slate'}`}>
            {location ? `LAT: ${location.lat.toFixed(5)}\nLNG: ${location.lng.toFixed(5)}\nACC: ${Math.round(location.acc)}M` : 'Locating satellite...'}
          </p>
          <Button 
            onClick={shareLocation}
            disabled={!location}
            className={`w-full py-6 text-sm tracking-widest uppercase font-bold rounded-2xl transition-all bg-surface border border-mist text-slate hover:text-white disabled:opacity-50`}
          >
            <Share2 className="w-4 h-4 mr-2" /> Share Coordinates
          </Button>
        </Card>
      </div>
    </div>
  );
}
