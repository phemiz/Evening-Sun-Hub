
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Added missing Globe icon import from lucide-react
import {
  ArrowLeft, MessageSquare, Phone, Mail, HelpCircle, ChevronRight,
  MessageCircle, MapPin, X, BookOpen, ShieldCheck, Zap,
  Smartphone, Activity, Info, Headphones, Terminal, Globe
} from 'lucide-react';
import { HUB_ADDRESS, HUB_PHONE } from '../constants';

export const Support = () => {
  const navigate = useNavigate();
  const [helpNode, setHelpNode] = useState<{ title: string, desc: string } | null>(null);

  const handleGetDirections = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(HUB_ADDRESS)}`, '_blank');
  };

  const manualNodes = [
    { title: "Ordering Food", icon: BookOpen, desc: "Go to the 'Menu' section. Pick your meal, add it to your cart, and confirm. You can pay with your Hub Wallet or Card." },
    { title: "Safety Rules", icon: ShieldCheck, desc: "On boats, you must wear life jackets. At the Club, keep your ID ready. We check everyone to keep our hubs safe." },
    { title: "SunRewards", icon: Zap, desc: "Spend money, get points. Every 1,000 Naira gives you points that you can use to enjoy discounts later." },
    { title: "Booking Help", icon: Smartphone, desc: "Pick a date and time in the app. If you can't make it, cancel at least 2 hours before to get your refund." }
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-300 pb-32">
      <div className="flex items-center gap-4 px-1">
        <button onClick={() => navigate(-1)} className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 active:scale-90 transition-all">
          <ArrowLeft size={24} className="dark:text-white" />
        </button>
        <div>
          <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase leading-none flex items-center gap-2">Help Center</h2>
          <p className="text-[10px] font-black text-sun-600 uppercase tracking-[0.3em] mt-2">Personal Support 24/7</p>
        </div>
      </div>

      {/* Primary Support Station */}
      <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white space-y-6 shadow-2xl relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sun-500 rounded-full blur-[100px] opacity-20 -mr-24 -mt-24" />
        <div className="relative z-10 space-y-6">
          <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center border border-white/10 backdrop-blur-md shadow-xl"><Headphones size={32} className="text-sun-500" /></div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black tracking-tight leading-none uppercase">Customer Support</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Our support team is available to help process your request.</p>
          </div>
          <button onClick={() => window.open(`https://wa.me/234${HUB_PHONE.substring(1)}`, '_blank')} className="w-full bg-sun-500 text-slate-950 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all border-b-4 border-sun-700">
            <MessageCircle size={24} /> Chat with Support
          </button>
        </div>
      </div>

      {/* Hub Manual Section - Enhanced feature */}
      <div className="space-y-6 px-1">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
          <Terminal size={14} className="text-sun-500" /> How to Use the App
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {manualNodes.map((node, i) => (
            <button key={i} onClick={() => setHelpNode({ title: node.title, desc: node.desc })} className="flex items-center gap-5 p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-sm text-left group hover:border-sun-500/20 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-sun-500 transition-colors shadow-inner"><node.icon size={26} /></div>
              <div className="flex-1">
                <h4 className="text-base font-black dark:text-white uppercase tracking-tight leading-none mb-1.5">{node.title}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">View Guide</p>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-sun-500 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* Physical & Contact Stations */}
      <div className="grid grid-cols-2 gap-4 px-1">
        <button onClick={handleGetDirections} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-50 dark:border-slate-800 flex flex-col items-center gap-4 shadow-sm group hover:border-sun-500/30 transition-all">
          <div className="w-16 h-16 rounded-[1.8rem] bg-blue-50 dark:bg-blue-900/10 text-blue-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><MapPin size={32} /></div>
          <span className="font-black text-xs uppercase tracking-widest text-center dark:text-white">Get Directions</span>
        </button>
        <button onClick={() => window.location.href = `tel:${HUB_PHONE}`} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-50 dark:border-slate-800 flex flex-col items-center gap-4 shadow-sm group hover:border-sun-500/30 transition-all">
          <div className="w-16 h-16 rounded-[1.8rem] bg-green-50 dark:bg-green-900/10 text-green-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><Phone size={32} /></div>
          <span className="font-black text-xs uppercase tracking-widest text-center dark:text-white">Call Support</span>
        </button>
      </div>

      <div className="px-1 pt-4 text-center space-y-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Evening Sun Hub Station v2.8.5</p>
        <div className="flex justify-center gap-6 opacity-30">
          <ShieldCheck size={20} />
          <Globe size={20} />
          <Zap size={20} />
        </div>
      </div>

      {/* HELP OVERLAY */}
      {helpNode && (
        <div className="fixed inset-0 z-[600] flex items-end justify-center bg-black/90 backdrop-blur-2xl p-5 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 shadow-2xl animate-in slide-in-from-bottom-full duration-500 border border-white/5 relative">
            <button onClick={() => setHelpNode(null)} className="absolute top-7 right-7 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 active:scale-90 transition-transform shadow-sm"><X size={28} /></button>
            <div className="space-y-8 pt-5 text-center">
              <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner"><BookOpen size={48} /></div>
              <div className="space-y-4">
                <h4 className="text-4xl font-black dark:text-white uppercase tracking-tighter leading-none">{helpNode.title}</h4>
                <p className="text-xl font-bold text-slate-600 dark:text-slate-300 leading-relaxed uppercase tracking-tight italic">"{helpNode.desc}"</p>
              </div>
              <button onClick={() => setHelpNode(null)} className="w-full bg-sun-500 text-white py-6 rounded-[2.2rem] font-black text-sm uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all">Close Guide</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
