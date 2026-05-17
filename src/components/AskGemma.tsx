import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/src/components/ui';
import { Bot, ArrowLeft, Send, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { useSettings } from '../SettingsContext';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

import { askGemma } from '../engine/ai';

export function AskGemmaScreen({ onBack }: { onBack: () => void }) {
  const { openRouterApiKey, openRouterModel } = useSettings();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'I am your SignalPack Safety Assistant. Describe what is happening or ask for first aid and safety instructions.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const missingOpenRouterKey = !openRouterApiKey.trim();
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const gemmaResponse = await askGemma(textToSend, messages);
      setMessages(prev => [...prev, { id: Date.now().toString() + 'm', role: 'model', content: gemmaResponse }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + 'e',
        role: 'model',
        content: 'I am having trouble connecting to my servers right now. Please rely on standard safety guidelines or emergency services.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full absolute inset-0 bg-cloud">
      <div className="flex-none p-4 sticky top-0 z-50 bg-cloud/80 backdrop-blur-md border-b border-mist/30">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-mist/30 text-slate transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">Guided Help <span className="text-[10px] bg-cyan-brand/20 text-cyan-brand px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">Gemma 4</span></h1>
            <p className="text-[10px] text-slate font-mono uppercase tracking-widest mt-1">
              OpenRouter / {openRouterModel}
            </p>
          </div>
        </div>
        {missingOpenRouterKey && (
          <div className="mt-3 rounded-xl border px-3 py-2 text-xs flex items-start gap-2 border-warning/30 bg-warning/10 text-warning">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="leading-relaxed">
              Add an OpenRouter key in Settings to use hosted Gemma 4.
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-4 flex gap-3 ${msg.role === 'user' ? 'bg-blue text-white rounded-br-sm' : 'bg-surface border border-mist/30 text-slate rounded-bl-sm'}`}>
              {msg.role === 'model' && <Bot className="w-5 h-5 shrink-0 mt-0.5 text-cyan-brand" />}
              <div className="text-sm prose prose-invert max-w-none text-white whitespace-pre-wrap">
                {msg.content}
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-surface border border-mist/30 rounded-2xl rounded-bl-sm p-4 flex gap-3 text-slate">
              <Bot className="w-5 h-5 shrink-0 mt-0.5 text-cyan-brand animate-pulse" />
              <div className="flex items-center gap-1.5 h-5">
                <span className="w-1.5 h-1.5 bg-slate rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="flex-none p-4 bg-surface border-t border-mist/30">
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Describe issue or ask..."
            className="flex-1 bg-cloud border border-mist/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate focus:outline-none focus:border-blue transition-colors"
          />
          <Button variant="primary" onClick={() => handleSend(input)} disabled={!input.trim()} className="w-12 h-12 p-0 flex items-center justify-center shrink-0 rounded-xl">
             <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
