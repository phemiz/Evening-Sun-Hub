
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone, User, Lock, ArrowRight, Sun, Sparkles, LogIn,
  ShieldCheck, ChevronRight, Globe, Zap, RefreshCw, Loader2,
  Key, ShieldAlert, Fingerprint
} from 'lucide-react';

export const Login = () => {
  const { login, signup, settings } = useApp();
  const is2FA = settings.security.twoFactor;

  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [step, setStep] = useState(1);
  const [isMounting, setIsMounting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    otp: ''
  });

  useEffect(() => {
    setIsMounting(true);
  }, []);

  const handleInitialAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'SIGNUP') {
      const success = signup(formData.name, formData.phone, formData.password);
      if (!success) {
        alert("Registration Failed: Please ensure you use a valid WhatsApp Mobile Number and a strong Access Password (min 8 chars, 1 uppercase, 1 number).");
      }
      return;
    }

    if (is2FA) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setStep(2);
      }, 1200);
    } else {
      const success = login(formData.phone, formData.password);
      if (!success) triggerShake();
    }
  };

  const handle2FAVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      const success = login(formData.phone, formData.password);
      if (!success) {
        setIsVerifying(false);
        triggerShake();
      }
    }, 1500);
  };

  const triggerShake = () => {
    const card = document.getElementById('login-card');
    card?.classList.add('animate-[shake_0.5s_ease-in-out]');
    setTimeout(() => card?.classList.remove('animate-[shake_0.5s_ease-in-out]'), 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Dynamic Mesh Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sun-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-sun-900/10 rounded-full blur-[150px] animation-delay-2000" />

      <div className={`w-full max-w-sm space-y-8 relative z-10 transition-all duration-1000 transform ${isMounting ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

        {/* Branding Section */}
        <div className="text-center space-y-6">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-sun-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-24 h-24 bg-gradient-to-tr from-sun-600 to-sun-400 rounded-[2rem] flex items-center justify-center text-white shadow-xl transform -rotate-3 transition-transform hover:rotate-0 duration-500">
              <Sun size={48} strokeWidth={2.5} className="drop-shadow-lg" />
            </div>
            {is2FA && (
              <div className="absolute -bottom-2 -right-2 bg-blue-600 border-2 border-slate-950 p-2 rounded-xl text-white shadow-xl animate-bounce">
                <ShieldCheck size={20} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
              Evening Sun <span className="text-sun-500 text-5xl">.</span>
            </h1>
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em]">All-in-One Service Center</p>
          </div>
        </div>

        {/* Auth Card */}
        <div id="login-card" className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden group">

          {/* Header Actions */}
          {step === 1 && (
            <div className="flex bg-black/40 p-2 rounded-[1.8rem] mb-8 border border-white/5">
              <button
                onClick={() => setMode('LOGIN')}
                className={`flex-1 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${mode === 'LOGIN' ? 'bg-sun-500 text-slate-950 shadow-lg' : 'text-slate-500'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('SIGNUP')}
                className={`flex-1 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${mode === 'SIGNUP' ? 'bg-sun-500 text-slate-950 shadow-lg' : 'text-slate-500'}`}
              >
                Join Us
              </button>
            </div>
          )}

          <form onSubmit={step === 1 ? handleInitialAuth : handle2FAVerify} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-6 animate-in slide-in-from-left duration-500">
                {mode === 'SIGNUP' && (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                    <div className="relative">
                      <User size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full pl-14 p-5 rounded-2xl bg-black/40 border border-white/5 text-white placeholder-slate-700 focus:border-sun-500 outline-none text-base font-bold shadow-inner"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp Mobile Number</label>
                    <span className="text-[8px] font-black text-sun-500 uppercase tracking-widest bg-sun-500/10 px-2 py-0.5 rounded-full">REQUIRED</span>
                  </div>
                  <div className="relative">
                    <Smartphone size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234 800 000 0000"
                      className="w-full pl-14 p-5 rounded-2xl bg-black/40 border border-white/5 text-white placeholder-slate-700 focus:border-sun-500 outline-none text-base font-bold shadow-inner"
                      required
                    />
                  </div>
                  {mode === 'SIGNUP' && (
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-4 mt-1">International format required (e.g., +234...)</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Password</label>
                    {mode === 'SIGNUP' && (
                      <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">STRONG MODE</span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-14 p-5 rounded-2xl bg-black/40 border border-white/5 text-white placeholder-slate-700 focus:border-sun-500 outline-none text-base font-bold tracking-widest shadow-inner"
                      required
                    />
                  </div>
                  {mode === 'SIGNUP' && (
                    <div className="px-4 space-y-1 mt-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-slate-700'}`} />
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Min 8 Characters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-slate-700'}`} />
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Upper & Numeric Check</span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-sun-600 hover:bg-sun-500 text-white py-6 rounded-[1.8rem] font-black text-sm uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4 mt-4"
                >
                  {isVerifying ? <Loader2 className="animate-spin" size={20} /> : mode === 'LOGIN' ? (is2FA ? 'Verifying Access...' : 'Sign In') : 'Register Now'}
                  {!isVerifying && <ChevronRight size={20} strokeWidth={3} />}
                </button>
              </div>
            ) : (
              /* TWO-FACTOR STEP */
              <div className="space-y-8 animate-in zoom-in duration-500">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-500 mb-4 ring-8 ring-blue-500/5">
                    <ShieldAlert size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Two-Factor Security</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Check device {formData.phone.slice(-4)} for security code</p>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Verify Identity</label>
                  <input
                    autoFocus
                    type="text"
                    maxLength={4}
                    value={formData.otp}
                    onChange={e => setFormData({ ...formData, otp: e.target.value })}
                    placeholder="0 0 0 0"
                    className="w-full p-8 rounded-3xl bg-black/60 border border-white/10 text-white placeholder-slate-800 focus:border-sun-500 outline-none text-4xl font-black text-center tracking-[0.4em] shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formData.otp.length < 4 || isVerifying}
                  className="w-full bg-white text-slate-950 py-6 rounded-[1.8rem] font-black text-sm uppercase tracking-[0.3em] shadow-3xl active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                >
                  {isVerifying ? <Loader2 className="animate-spin" size={20} /> : <><Fingerprint size={24} /> Complete Log In</>}
                </button>

                <button type="button" onClick={() => setStep(1)} className="w-full text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-slate-300 transition-colors">Go Back</button>
              </div>
            )}
          </form>
        </div>

        {/* Footer Meta */}
        <div className="pt-8 space-y-8 opacity-40">
          <div className="flex items-center justify-center gap-12">
            <div className="flex flex-col items-center">
              <Globe size={24} className="text-slate-400 mb-2" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Secured Gateway</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col items-center">
              <Zap size={24} className="text-slate-400 mb-2" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Monitoring</span>
            </div>
          </div>
          <p className="text-center text-[9px] text-slate-500 font-bold leading-relaxed uppercase tracking-[0.3em]">
            Evening Sun Hub v2.8.5<br />
            {is2FA ? 'Enhanced Security Mode' : 'Basic Security Mode'}
          </p>
        </div>
      </div>
    </div>
  );
};
