
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, Moon, Sun, Lock, Shield, Eye, Trash2, Smartphone, 
  ChevronRight, X, AlertTriangle, ShieldCheck, CheckCircle, Star, 
  EyeOff, Loader2, KeyRound, LogOut, Mail, RefreshCw 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Settings = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme, settings, updateSettings, logout, user, adminPassword, updateUserPassword, deleteAccount, isOnline, lastSyncTime } = useApp();

  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Change Password States
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);
  const [passUpdated, setPassUpdated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleToggleOrders = () => {
    updateSettings({ 
      notifications: { ...settings.notifications, orders: !settings.notifications.orders } 
    });
  };

  const handleTogglePromos = () => {
    updateSettings({ 
      notifications: { ...settings.notifications, promos: !settings.notifications.promos } 
    });
  };

  const handleToggleEmail = () => {
    updateSettings({ 
      notifications: { ...settings.notifications, email: !settings.notifications.email } 
    });
  };

  const handleToggle2FA = () => {
    updateSettings({ 
      security: { ...settings.security, twoFactor: !settings.security.twoFactor } 
    });
  };

  const handleUpdatePassword = () => {
    setErrorMsg('');
    if (passwords.current !== user?.password) {
        setErrorMsg('The current password provided is incorrect.');
        return;
    }
    if (passwords.next.length < 4) {
        setErrorMsg('The new password must be at least 4 characters long.');
        return;
    }
    if (passwords.next !== passwords.confirm) {
        setErrorMsg('Confirmation password does not match.');
        return;
    }
    setIsUpdatingPass(true);
    setTimeout(() => {
      updateUserPassword(passwords.next);
      setIsUpdatingPass(false);
      setPassUpdated(true);
      setTimeout(() => {
        setPassUpdated(false);
        setShowChangePassword(false);
        setPasswords({ current: '', next: '', confirm: '' });
      }, 2000);
    }, 1500);
  };

  const handleDeleteAccount = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteAccount();
      navigate('/');
    }, 2000);
  };

  const ToggleSwitch = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-all duration-300 relative ${active ? 'bg-sun-500 shadow-inner' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${active ? 'left-7' : 'left-1'}`} />
    </button>
  );

  const isPasswordValid = passwords.next.length >= 4 && passwords.next === passwords.confirm && passwords.current.length > 0;

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft size={20} className="dark:text-white" />
        </button>
        <h2 className="text-xl font-black dark:text-white tracking-tight">App Settings</h2>
      </div>

      <div className="space-y-8">
        {/* Appearance Section */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Appearance</h3>
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-slate-50 dark:border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-900 text-sun-500 flex items-center justify-center">
                  {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Dark Mode</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Manual toggle theme</span>
                </div>
              </div>
              <ToggleSwitch active={isDarkMode} onToggle={toggleTheme} />
            </div>
            
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-500 flex items-center justify-center">
                  <Smartphone size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">System Sync</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Match device settings</span>
                </div>
              </div>
              <span className="text-[10px] font-black text-sun-600 bg-sun-50 dark:bg-sun-900/20 px-3 py-1 rounded-full uppercase tracking-widest">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Notifications</h3>
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-slate-50 dark:border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                  <Bell size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">App Alerts</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Real-time hub alerts</span>
                </div>
              </div>
              <ToggleSwitch active={settings.notifications.orders} onToggle={handleToggleOrders} />
            </div>
            <div className="flex items-center justify-between p-5 border-b border-slate-50 dark:border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Email Receipts</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Digital confirmation dispatch</span>
                </div>
              </div>
              <ToggleSwitch active={settings.notifications.email} onToggle={handleToggleEmail} />
            </div>
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-sun-50 dark:bg-sun-900/20 text-sun-600 flex items-center justify-center">
                  <Star size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Promotions</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Deals & lifestyle news</span>
                </div>
              </div>
              <ToggleSwitch active={settings.notifications.promos} onToggle={handleTogglePromos} />
            </div>
          </div>
        </div>

        {/* Sync & Offline Status */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Sync Engine</h3>
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 p-5 shadow-sm space-y-4">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isOnline ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                      <RefreshCw size={20} className={isOnline ? 'animate-spin-slow' : ''}/>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Hub Connection</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{isOnline ? 'Real-time Linked' : 'Offline Mode Active'}</span>
                   </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
             </div>
             <div className="pt-4 border-t border-slate-50 dark:border-slate-700/50 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <span>Last Synchronized</span>
                <span className="dark:text-white">{lastSyncTime || 'Never'}</span>
             </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Security</h3>
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
            <button 
              onClick={() => setShowChangePassword(true)}
              className="w-full flex items-center justify-between p-5 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-500 flex items-center justify-center group-hover:bg-sun-500 group-hover:text-white transition-all">
                  <Lock size={20} />
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Change Password</span>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-sun-600 group-hover:translate-x-1 transition-all" />
            </button>
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Two-Factor Auth</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Enhanced login safety</span>
                </div>
              </div>
              <ToggleSwitch active={settings.security.twoFactor} onToggle={handleToggle2FA} />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] px-4">Danger Zone</h3>
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-red-100 dark:border-red-900/30 overflow-hidden shadow-sm">
             <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-between p-5 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center">
                  <Trash2 size={20} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-red-600">Delete Account</span>
                  <span className="text-[9px] text-red-400 font-bold uppercase tracking-widest">Permanent data purge</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-red-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: Change Password */}
      {showChangePassword && (
        <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-sm:w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in duration-500 max-h-[90dvh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <KeyRound size={20} className="text-sun-500" />
                <h3 className="text-lg font-black dark:text-white uppercase tracking-tight leading-none">Security Update</h3>
              </div>
              <button onClick={() => setShowChangePassword(false)} className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-400 active:scale-90 transition-transform">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto flex-1 scrollbar-hide">
              {passUpdated ? (
                <div className="py-10 text-center space-y-4 animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white shadow-xl shadow-green-500/20 ring-8 ring-green-500/10">
                    <CheckCircle size={40} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black dark:text-white uppercase tracking-tight">Handshake Complete</h4>
                    <p className="text-xs text-slate-500 font-medium">Your hub password has been updated across the business centre.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {errorMsg && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 animate-in shake-x">
                        <AlertTriangle size={14} /> {errorMsg}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showPass ? "text" : "password"} 
                        value={passwords.current}
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                        className="w-full p-5 pr-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-sun-500 outline-none font-bold text-base dark:text-white transition-all shadow-inner"
                        placeholder="••••"
                      />
                      <button 
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 p-2"
                      >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={handleUpdatePassword}
                    disabled={!isPasswordValid || isUpdatingPass}
                    className="w-full bg-slate-900 dark:bg-sun-600 text-white py-6 rounded-[2.2rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl shadow-sun-500/20 mt-4 disabled:opacity-50 disabled:grayscale transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    {isUpdatingPass ? (
                      <><Loader2 className="animate-spin" size={18} /> Syncing Hub...</>
                    ) : "Update Credentials"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Delete Account Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-red-950/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50 dark:ring-red-900/10">
                <AlertTriangle size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Manifest Purge</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Proceeding will permanently delete your **SunRewards Points**, your booking manifest history, and current wallet capital. This purge is irreversible.
                </p>
              </div>
              <div className="space-y-3 pt-4">
                <button 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-500/30 flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  {isDeleting ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> PURGING...</span> : "CONFIRM PURGE"}
                </button>
                <button onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting} className="w-full text-slate-400 font-black text-[9px] uppercase tracking-[0.4em] py-3">ABORT DELETE</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}} />
    </div>
  );
};
