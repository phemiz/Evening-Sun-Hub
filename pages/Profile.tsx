
import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LogOut, Settings, HelpCircle, Calendar, Shield, CreditCard, 
  ChevronRight, LayoutDashboard, Wallet, Bell, Smartphone, 
  UserCheck, Share2, Copy, Sparkles, Heart, Globe, Loader2,
  Trash2, Landmark, ShieldCheck, History, RotateCcw, Timer,
  Camera, Languages, Flame, User as UserIcon, Lock, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, updateUser, logout, loyaltyPoints, getTierProgress } = useApp();
  const navigate = useNavigate();
  const tier = getTierProgress();
  
  const isAdmin = user?.role === 'ADMIN';

  if (!user) return null;

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-500">
      {/* Identity Node Station */}
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sun-500/5 rounded-full -mr-16 -mt-16" />
        <div className="relative group">
           <div className="absolute inset-0 bg-sun-500 rounded-full blur-2xl opacity-20 transition-opacity" />
           <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-xl ring-8 ring-white dark:ring-slate-800 transition-transform duration-500 bg-slate-100">
             <img src={user.avatarUrl} className="w-full h-full object-cover" alt="Hub Identity" />
           </div>
           {isAdmin && (
             <button 
               className="absolute bottom-1 right-1 bg-sun-500 text-white p-2.5 rounded-full border-4 border-white dark:border-slate-900 shadow-xl active:rotate-180 transition-all duration-500"
              >
               <Camera size={18} />
             </button>
           )}
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none italic">{user.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
             <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">{user.role} UNIT</span>
             <span className="bg-sun-50 dark:bg-sun-900/20 px-3 py-1 rounded-full text-[10px] font-black text-sun-600 uppercase tracking-widest italic">GRADE {Math.floor((loyaltyPoints || 0) / 1000)}</span>
          </div>
        </div>
      </div>

      {/* Sun XP Visualization Station */}
      <div className="bg-slate-950 text-white p-8 rounded-[3.5rem] relative overflow-hidden shadow-3xl border border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sun-500 rounded-full blur-[100px] opacity-20 -mr-24 -mt-24" />
          <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start">
                  <div className="space-y-1">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Lifestyle Points</p>
                      <h3 className="text-5xl font-black text-white tracking-tighter">{(loyaltyPoints || 0).toLocaleString()} <span className="text-xl text-sun-500 uppercase tracking-widest italic ml-1">XP</span></h3>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl p-5 rounded-[1.8rem] border border-white/10 flex flex-col items-center">
                      <Sparkles size={28} className="text-sun-400 mb-1" />
                      <span className="text-[10px] font-black text-sun-400 uppercase tracking-widest italic">Tier {tier.current.split(' ')[0]}</span>
                  </div>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-sun-500 italic">{tier.current}</span>
                    <span className="text-slate-500">Next: {tier.next}</span>
                 </div>
                 <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 shadow-inner">
                    <div className="h-full bg-gradient-to-r from-sun-500 to-amber-300 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(245,158,11,0.5)]" style={{ width: `${tier.progress}%` }} />
                 </div>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] text-center italic">Service Record Progression: {tier.progress}% complete</p>
              </div>
          </div>
      </div>

      {/* Operational Nodes - Interactive for everyone */}
      <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2"><Zap size={14} className="text-sun-500"/> Operational Stations</h3>
          <div className="space-y-4">
            {[
              { id: 'wallet', label: 'Fiscal Wallet', icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-50', path: '/wallet' },
              { id: 'manifest', label: 'Service Record', icon: History, color: 'text-sun-600', bg: 'bg-sun-50', path: '/bookings' },
              { id: 'help', label: 'Command Center', icon: HelpCircle, color: 'text-red-500', bg: 'bg-red-50', path: '/support' }
            ].map(item => (
              <button key={item.id} onClick={() => navigate(item.path)} className="w-full flex items-center gap-5 p-6 bg-white dark:bg-slate-900 rounded-[2.8rem] border border-slate-50 dark:border-slate-800 hover:border-sun-500/30 transition-all shadow-sm group">
                  <div className={`w-14 h-14 rounded-2xl ${item.bg} dark:bg-slate-800 ${item.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                    <item.icon size={28} />
                  </div>
                  <span className="flex-1 text-left text-base font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none italic">{item.label}</span>
                  <ChevronRight size={22} className="text-slate-300 group-hover:text-sun-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
      </div>

      {/* Security Disclaimer for Non-Admins */}
      {!isAdmin && (
        <div className="mx-2 p-6 bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 flex items-start gap-4 animate-in slide-in-from-bottom-4">
           <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-sun-600 shadow-sm"><Lock size={20}/></div>
           <div className="space-y-1">
              <h5 className="text-[11px] font-black uppercase text-slate-900 dark:text-white tracking-tight leading-none">Station Security Protocol</h5>
              <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed tracking-widest pt-1">All profile settings, password modifications, and preference adjustments are strictly managed by the Central Command. Kindly contact the Station Admin for manual credential updates.</p>
           </div>
        </div>
      )}

      {/* Settings only accessible if Admin */}
      {isAdmin && (
        <div className="px-2">
           <button onClick={() => navigate('/settings')} className="w-full flex items-center justify-center gap-3 p-6 bg-slate-900 dark:bg-sun-500 text-white dark:text-slate-950 rounded-3xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl">
              <Settings size={20} /> Station Configuration Point
           </button>
        </div>
      )}

      <button onClick={logout} className="w-full flex items-center gap-5 p-8 text-red-500 font-black uppercase tracking-[0.4em] text-[10px] justify-center pt-12 opacity-30 hover:opacity-100 transition-opacity">
          <LogOut size={20} /> 
          <span className="italic">Sever Hub Connection</span>
      </button>
    </div>
  );
};
