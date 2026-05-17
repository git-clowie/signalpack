import React, { useState, useRef, useEffect } from 'react';
import { Card, Button } from '@/src/components/ui';
import { DraftReport } from '@/src/types';
import { Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { vibrate } from '../lib/utils';

export function ClarificationScreen({ 
  report, 
  onComplete 
}: { 
  report: DraftReport; 
  onComplete: (answers: string[]) => Promise<void>;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentInputValue, setCurrentInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const questions = report.clarificationQuestions || [];

  React.useEffect(() => {
    if (questions.length === 0 && !isGenerating) {
      const runComplete = async () => {
        setIsGenerating(true);
        await onComplete([]);
      };
      runComplete();
    }
  }, [questions.length, isGenerating, onComplete]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentStep, answers]);

  const handleSend = async (text: string) => {
    vibrate(40);
    if (!text.trim() || isGenerating) return;
    
    const newAnswers = [...answers, text];
    setAnswers(newAnswers);
    setCurrentInputValue('');
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsGenerating(true);
      await onComplete(newAnswers);
    }
  };

  if (isGenerating || questions.length === 0) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] w-full max-w-2xl mx-auto px-4 items-center justify-center text-center">
        <Loader2 className="w-12 h-12 text-blue animate-spin mb-6" />
        <h1 className="text-xl font-bold tracking-tight text-white mb-2">Building Crisis Packet</h1>
        <p className="text-slate text-[10px] font-mono uppercase tracking-widest max-w-[200px]">Organizing structured data from your conversation...</p>
      </div>
    );
  }

  // Construct chat history
  const chatHistory = [];
  for (let i = 0; i <= currentStep; i++) {
    // Add Gemma's question
    chatHistory.push({
      id: `q-${i}`,
      role: 'assistant',
      text: questions[i]
    });
    // Add User's answer if it exists
    if (answers[i]) {
      chatHistory.push({
        id: `a-${i}`,
        role: 'user',
        text: answers[i]
      });
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full max-w-2xl mx-auto px-4 pb-4 pt-4">
      <div className="mb-4">
         <h1 className="text-xl font-bold tracking-tight text-white mb-1">Critical Details</h1>
         <p className="text-slate font-mono uppercase tracking-widest text-[10px]">Ask less. Capture what matters.</p>
      </div>

       <div 
         ref={scrollRef}
         className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 pb-8"
       >
         <AnimatePresence>
           {chatHistory.map((msg, idx) => (
             <motion.div 
               key={msg.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
             >
               <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-blue text-white rounded-br-sm' : 'bg-surface border border-mist/30 text-white rounded-bl-sm'}`}>
                 {msg.role === 'assistant' && (
                   <div className="flex items-center gap-1 mb-2">
                     <div className="w-4 h-4 rounded-full bg-blue/20 flex items-center justify-center">
                       <span className="text-[8px] font-bold text-blue font-display">G</span>
                     </div>
                     <span className="text-[10px] font-mono uppercase tracking-widest text-blue font-bold">Gemma 4</span>
                   </div>
                 )}
                 <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
               </div>
             </motion.div>
           ))}
         </AnimatePresence>
       </div>

      <div className="pt-3 border-t border-mist/50">
         <div className="flex gap-2 mb-3">
             <button 
                className="flex-1 py-2 px-3 rounded-xl bg-surface/50 border border-mist/40 text-xs tracking-widest uppercase hover:bg-surface text-slate transition-colors"
                onClick={() => handleSend("I'm not sure")}
             >
                Unsure
             </button>
             <button 
                className="flex-1 py-2 px-3 rounded-xl bg-surface/50 border border-mist/40 text-xs tracking-widest uppercase hover:bg-surface text-slate transition-colors"
                onClick={() => handleSend("No")}
             >
                No
             </button>
             <button 
                className="flex-1 py-2 px-3 rounded-xl bg-surface/50 border border-mist/40 text-xs tracking-widest uppercase hover:bg-surface text-slate transition-colors"
                onClick={() => handleSend("Yes")}
             >
                Yes
             </button>
         </div>

        <div className="relative">
          <input 
            className="w-full bg-surface/80 shadow-inner rounded-full border border-mist/50 py-3 pl-4 pr-12 text-white placeholder-slate/40 focus:outline-none focus:border-blue/60 focus:ring-1 focus:ring-blue/50"
            placeholder="Type your response..."
            value={currentInputValue}
            onChange={(e) => setCurrentInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend(currentInputValue);
              }
            }}
            autoFocus
          />
          <button 
            className="absolute right-1 top-1 bottom-1 w-10 bg-blue hover:bg-blue/90 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleSend(currentInputValue)}
            disabled={!currentInputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
