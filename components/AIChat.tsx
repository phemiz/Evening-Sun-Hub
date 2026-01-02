
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, Trash2 } from 'lucide-react';
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

  // Determine if we need to offset the button (only on Eatery page when cart is active)
  const isEatery = location.pathname === '/eatery';
  const shouldOffset = isEatery && cart.length > 0;
  const positionClass = shouldOffset ? 'bottom-52' : 'bottom-28'; 

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput("");
    const updatedHistory = [...chatHistory, { role: 'user', text: userMsg } as const];
    setChatHistory(updatedHistory);
    setIsLoading(true);

    const response = await generateAIResponse(userMsg);
    
    setIsLoading(false);
    setChatHistory([...updatedHistory, { role: 'assistant', text: response } as const]);
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed right-4 z-[80] w-14 h-14 rounded-full bg-sun-500 text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${isOpen ? 'hidden' : 'flex'} ${positionClass}`}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed right-4 w-80 max-w-[calc(100vw-32px)] h-96 bg-white dark:bg-slate-800 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.4)] z-[90] flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-200 ${positionClass}`}>
          {/* Header */}
          <div className="bg-sun-500 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-black text-xs uppercase tracking-widest">Sun Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearChat}
                className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
                title="Clear Chat"
              >
                <Trash2 size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1.5 transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50 scrollbar-hide">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-[1.5rem] px-4 py-3 text-xs font-medium leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-sun-500 text-white rounded-br-none shadow-lg' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-center gap-2">
                <div className="bg-white dark:bg-slate-800 p-3 px-5 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-sun-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-sun-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    <span className="w-1.5 h-1.5 bg-sun-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-full px-5 py-3 text-xs font-bold focus:ring-2 focus:ring-sun-500 outline-none dark:text-white placeholder:text-slate-400"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-sun-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-90 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
