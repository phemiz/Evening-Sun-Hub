
import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LogOut, Settings, HelpCircle, Calendar, Shield, CreditCard,
  ChevronRight, LayoutDashboard, Wallet, Bell, Smartphone,
  UserCheck, Share2, Copy, Sparkles, Heart, Globe, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, logout, loyaltyPoints, getTierProgress } = useApp();
  const navigate = useNavigate();
  const tier = getTierProgress();

  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;
  const isAdmin = user.role === 'ADMIN';

  // Memoized code to ensure stability across renders
  const referralCode = useMemo(() => {
    const prefix = user.name.split(' ')[0].substring(0, 3).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SUN-${prefix}-${randomPart}`;
  }, [user.name]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareReferral = () => {
    // 1. Trigger local stability state to anchor the UI
    setIsSharing(true);

    // 2. Prepare the payload
    const rootUrl = window.location.origin + window.location.pathname;
    const message = `Join me on Evening Sun Hub! Use my code ${referralCode} to get ₦1,000 off your first order. ☀️\n\nSign up here: ${rootUrl}`;
    const encodedMsg = encodeURIComponent(message);

    // 3. Brief delay to allow the button "Connecting" state to paint, preventing the "shake"
    setTimeout(() => {
      window.open(`https://wa.me/?text=${encodedMsg}`, '_blank');
      setIsSharing(false);
    }, 400);
  };

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-500">
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sun-500/5 rounded-full -mr-16 -mt-16" />
        <div className="relative group">
          <div className="absolute inset-0 bg-sun-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative w-32 h-32 bg-gradient-to-br from-sun-400 to-sun-600 rounded-full flex items-center justify-center text-white text-5xl font-black shadow-xl ring-8 ring-white dark:ring-slate-800 transition-transform group-hover:scale-105 duration-500">
            {user.name.charAt(0)}
          </div>
          <div className="absolute bottom-1 right-1 bg-green-500 text-white p-2.5 rounded-full border-4 border-white dark:border-slate-900 shadow-xl">
            <UserCheck size={18} />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none">{user.name}</h2>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Account Verified</p>
        </div>
      </div>

      {/* SunRewards Detailed Dashboard */}
      <div className="bg-slate-950 text-white p-8 rounded-[3rem] relative overflow-hidden shadow-2xl border border-white/5 transform-gpu">
        <div className="absolute top-0 right-0 w-48 h-48 bg-sun-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20" />
        <div className="relative z-10 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em]">SunPoints Balance</p>
              <h3 className="text-5xl font-black text-white tracking-tighter">{loyaltyPoints.toLocaleString()}</h3>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-5 rounded-[1.8rem] border border-white/10 flex flex-col items-center">
              <Sparkles size={28} className="text-sun-400 mb-1" />
              <span className="text-[10px] font-black text-sun-400 uppercase tracking-widest">{tier.current.split(' ')[1]}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
              <span className="text-sun-500">{tier.current}</span>
              <span className="text-slate-500">{tier.next}</span>
            </div>
            <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 shadow-inner">
              <div className="h-full bg-gradient-to-r from-sun-500 to-amber-300 rounded-full transition-all duration-1000 shadow-lg" style={{ width: `${tier.progress}%` }} />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Next level unlocks after ₦{tier.pointsToNext.toLocaleString()} more spend</p>
          </div>
        </div>
      </div>

      {/* SunMember Hub - Refined for Jitter-Free Interaction */}
      <div className="bg-gradient-to-br from-sun-500 to-amber-600 p-7 rounded-[3rem] text-white shadow-2xl relative overflow-hidden transform-gpu">
        <div className="relative z-10 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20">
              <Share2 size={24} />
            </div>
            <h3 className="text-2xl font-black tracking-tight leading-none uppercase">Referral Center</h3>
          </div>
          <p className="text-[11px] font-bold opacity-90 leading-relaxed uppercase tracking-widest">Invite friends. Earn ₦1,000 credit for every successful referral.</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-black/20 backdrop-blur-xl px-5 py-4 rounded-2xl border border-white/10 flex items-center justify-between min-w-0">
              <span className="font-mono font-black tracking-tighter text-base truncate pr-2">{referralCode}</span>
              <button
                onClick={handleCopy}
                className={`transition-colors duration-200 ${copied ? 'text-green-300' : 'text-white/60 hover:text-white'}`}
              >
                <Copy size={16} />
              </button>
            </div>
            <button
              onClick={handleShareReferral}
              disabled={isSharing}
              className="bg-white text-sun-600 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-[0.97] transition-[transform,background-color,opacity] duration-200 hover:bg-sun-50 flex items-center gap-2 disabled:opacity-80"
            >
              {isSharing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                'Invite'
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-2">Account Settings</h3>

        <div className="space-y-4">
          {[
            { id: 'wallet', label: 'My Wallet', icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-50', path: '/wallet' },
            { id: 'favorites', label: 'My Favorites', icon: Heart, color: 'text-red-500', bg: 'bg-red-50', path: '/eatery' },
            { id: 'settings', label: 'Settings', icon: Settings, color: 'text-slate-500', bg: 'bg-slate-100', path: '/settings' },
            { id: 'help', label: 'Help Desk', icon: HelpCircle, color: 'text-sun-600', bg: 'bg-sun-50', path: '/support' }
          ].map(item => (
            <button key={item.id} onClick={() => navigate(item.path)} className="w-full flex items-center gap-5 p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 hover:border-sun-500/20 transition-all shadow-sm group">
              <div className={`w-12 h-12 rounded-2xl ${item.bg} dark:bg-slate-800 ${item.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                <item.icon size={26} fill={item.id === 'favorites' ? 'currentColor' : 'none'} />
              </div>
              <span className="flex-1 text-left text-base font-black text-slate-800 dark:text-white uppercase tracking-widest">{item.label}</span>
              <ChevronRight size={22} className="text-slate-300 group-hover:text-sun-600 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {isAdmin && (
        <div className="pt-4">
          <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-5 p-6 bg-slate-950 text-white rounded-[2.8rem] shadow-2xl active:scale-95 transition-all font-black uppercase tracking-[0.3em] text-xs">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shadow-lg border border-white/5"><LayoutDashboard size={28} /></div>
            <span>Open Admin Dashboard</span>
          </button>
        </div>
      )}

      <button onClick={handleLogout} className="w-full flex items-center gap-5 p-8 text-red-500 font-black uppercase tracking-[0.4em] text-[11px] justify-center pt-10 opacity-40 hover:opacity-100 transition-opacity">
        <LogOut size={20} />
        <span>Sign Out</span>
      </button>
    </div>
  );
};
