import React, { useState } from 'react';
import { Card, Button } from '@/src/components/ui';
import { ShieldAlert, Image, Mic, Send, ShieldCheck, ArrowRight } from 'lucide-react';

export function TutorialOverlay({
  onClose
}: {
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to SignalPack',
      description: 'Your Advanced AI-powered emergency reporting assistant.',
      icon: <ShieldAlert className="w-12 h-12 text-critical" />,
      color: 'text-critical',
      bg: 'bg-critical/10'
    },
    {
      title: 'Capture Quickly',
      description: 'In an emergency, use a photo, short text, or voice note to capture what is happening.',
      icon: <div className="flex gap-4"><Image className="w-8 h-8 text-blue" /><Mic className="w-8 h-8 text-blue" /></div>,
      color: 'text-blue',
      bg: 'bg-blue/10'
    },
    {
      title: 'AI Analysis',
      description: 'The AI will analyze your input, extract hazards, and ask a few clarifying questions if needed.',
      icon: <ShieldCheck className="w-12 h-12 text-cyan-brand" />,
      color: 'text-cyan-brand',
      bg: 'bg-cyan-brand/10'
    },
    {
      title: 'Clear Response',
      description: 'You get a structured packet with a shareable message, immediate actions, and severity assessment.',
      icon: <Send className="w-12 h-12 text-white" />,
      color: 'text-white',
      bg: 'bg-white/10'
    }
  ];

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-sm bg-surface ring-1 ring-mist shadow-2xl overflow-hidden flex flex-col rounded-2xl">
        <div className={`h-40 flex items-center justify-center ${current.bg}`}>
          {current.icon}
        </div>
        <div className="p-6 text-center flex-1 flex flex-col">
          <h2 className={`text-xl font-bold tracking-tight mb-3 ${current.color}`}>{current.title}</h2>
          <p className="text-slate text-sm font-medium leading-relaxed mb-8">{current.description}</p>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-white' : 'bg-mist'}`} />
              ))}
            </div>
            
            <Button onClick={() => {
              if (step < steps.length - 1) setStep(step + 1);
              else onClose();
            }} size="sm">
              {step < steps.length - 1 ? (
                <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
              ) : (
                'Get Started'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
