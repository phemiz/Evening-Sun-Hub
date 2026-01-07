import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, Trash2, Zap, Utensils, Scissors, Anchor, Sparkles, ChevronDown } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { useApp } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

export const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { chatHistory, setChatHistory, clearChat, cart } = useApp();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isEatery = location.pathname === '/eatery';
  const shouldOffset = isEatery && cart.length > 0;
  const positionClass = shouldOffset ? 'bottom-56' : 'bottom-32'; 

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  const handleSend = async (overrideText?: string) => {
    const userMsg = overrideText || input;
    if (!userMsg.trim()) return;
    
    setInput("");
    const updatedHistory = [...chatHistory, { role: 'user', text: userMsg } as const];
    setChatHistory(updatedHistory);
    setIsLoading(true);

    const response = await generateAIResponse(userMsg, updatedHistory);
    
    setIsLoading(false);
    setChatHistory([...updatedHistory, { role: 'assistant', text: response } as const]);
  };

  const actionChips = [
    { label: "Food Trends", icon: Utensils, action: "Boss, what is trending in the Kitchen?" },
    { label: "Salon Slot", icon: Scissors, action: "I would like to book a salon appointment." },
    { label: "Boat Status", icon: Anchor, action: "Are there vessels available for charter right now?" },
    { label: "VIP Perks", icon: Sparkles, action: "How can I increase my SunRewards points?" },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1999] animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed right-6 z-[1998] w-16 h-16 rounded-full bg-sun-500 text-white shadow-4xl flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 group ${isOpen ? 'opacity-0 pointer-events-none scale-50' : 'opacity-100'} ${positionClass}`}
      >
        <MessageCircle size={32} className="group-hover:rotate-12 transition-transform" />
      </button>

      <div 
        className={`fixed right-6 w-96 max-w-[calc(100vw-48px)] h-[650px] max-h-[calc(100dvh-180px)] bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] z-[2000] flex flex-col border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-500 ease-out transform ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95 pointer-events-none'} ${positionClass}`}
      >
        <div className="bg-sun-500 p-6 flex justify-between items-center text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/30">
              <Bot size={28} />
            </div>
            <div>
              <span className="font-black text-xs uppercase tracking-[0.25em] block">Hub Assistant</span>
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-70 flex items-center gap-1"><Zap size={8} fill="currentColor"/> Badagry Unit</span>
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <button onClick={clearChat} className="hover:bg-white/20 rounded-xl p-2.5 transition-colors" title="Clear Record">
              <Trash2 size={18} />
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              className="bg-white/10 hover:bg-white/30 rounded-2xl p-3 flex items-center gap-2 transition-all border border-white/20 group"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Close</span>
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950/40 scrollbar-hide">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] rounded-[2rem] px-5 py-4 text-xs font-bold leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-sun-500 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-700'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-in fade-in">
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] rounded-tl-none px-6 py-4 border border-slate-100 dark:border-slate-700">
                <Loader2 className="animate-spin text-sun-500" size={18} />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {actionChips.map((chip, idx) => (
              <button 
                key={idx}
                onClick={() => handleSend(chip.action)}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 whitespace-nowrap hover:border-sun-500 transition-all active:scale-95"
              >
                <chip.icon size={14} className="text-sun-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{chip.label}</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="How may I assist you today, Boss?"
              className="w-full pl-6 pr-16 py-5 rounded-[2rem] bg-slate-100 dark:bg-slate-800 border-none outline-none text-xs font-bold dark:text-white placeholder-slate-400"
            />
            <button 
              onClick={() => handleSend()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-sun-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
