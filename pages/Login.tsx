
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Smartphone, User, Lock, ArrowRight, Sun, ShieldCheck, ChevronRight, 
  Zap, Loader2, Fingerprint, Mail, ArrowLeft, AlertCircle, Cpu, Key,
  MessageCircle, Search, ShieldAlert, CheckCircle2, BellRing, X
} from 'lucide-react';

type AuthStep = 'SPLASH' | 'WELCOME' | 'IDENTIFY' | 'VERIFYING' | 'OTP_VERIFY' | 'PASSWORD_ENTRY';

export const Login = () => {
  const { login, signup } = useApp();
  
  const [step, setStep] = useState<AuthStep>('SPLASH');
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  const [showNotification, setShowNotification] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    otp: ''
  });

  useEffect(() => {
    if (step === 'SPLASH') {
      const timer = setTimeout(() => setStep('WELCOME'), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleBack = () => {
    if (step === 'IDENTIFY') setStep('WELCOME');
    else if (step === 'OTP_VERIFY' || step === 'VERIFYING') setStep('IDENTIFY');
    else if (step === 'PASSWORD_ENTRY') setStep('OTP_VERIFY');
  };

  const validateInputs = () => {
    const errors: Record<string, string> = {};
    
    if (mode === 'SIGNUP') {
      const nameParts = formData.name.trim().split(/\s+/);
      if (nameParts.length < 2 || formData.name.length < 3) {
        errors.name = "Enter your full first and last name.";
      }
    }

    const cleanPhone = formData.phone.replace(/\s/g, '');
    const phoneRegex = /^(?:\+234|0)[789][01]\d{8}$/;
    
    // Admin Override: Allow '0000'
    if (cleanPhone !== '0000' && !phoneRegex.test(cleanPhone)) {
      errors.phone = "Invalid WhatsApp format. Use 080... or +234...";
    }

    // Fixed Email validation: Strict RFC regex (corrected 0-0 to 0-9)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please provide a valid email address.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const triggerOtpDispatch = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setError(null);
    setFormData(prev => ({ ...prev, otp: '' }));
    
    // Simulate WhatsApp network delay
    setTimeout(() => {
      setShowNotification(true);
      // Auto-hide notification after 10 seconds
      setTimeout(() => setShowNotification(false), 10000);
    }, 1500);
  };

  const handleIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;
    
    setStep('VERIFYING');
    setIsLoading(true);
    
    // Simulated Online Verification Protocol
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP_VERIFY');
      triggerOtpDispatch();
    }, 2400);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp.length < 4) return;
    
    setIsLoading(true);
    setError(null);

    // Real-time matching logic
    setTimeout(() => {
      setIsLoading(false);
      if (formData.otp === generatedOtp) {
        setStep('PASSWORD_ENTRY');
      } else {
        setError("Synchronization code mismatch. Check WhatsApp.");
      }
    }, 1000);
  };

  const handleFinalAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      const success = mode === 'SIGNUP' 
        ? signup(formData.name, formData.phone, formData.password)
        : login(formData.phone, formData.password);
      
      if (!success) {
        setError("Synchronization failed. Invalid station credentials.");
      }
    }, 1200);
  };

  if (step === 'SPLASH') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in duration-1000">
        <div className="relative">
          <div className="absolute inset-0 bg-sun-500 rounded-[2.5rem] blur-3xl opacity-30 animate-pulse" />
          <div className="relative w-32 h-32 bg-gradient-to-tr from-sun-600 to-sun-400 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl">
            <Sun size={64} className="animate-spin-slow" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Evening Sun</h1>
          <p className="text-sun-500 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Establishing Hub Connection...</p>
        </div>
      </div>
    );
  }

  if (step === 'WELCOME') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-12 animate-in slide-in-from-bottom-10">
        <div className="space-y-6">
          <h2 className="text-6xl font-black text-white leading-none tracking-tighter uppercase italic">
            Welcome <br/> <span className="text-sun-500">To the Hub.</span>
          </h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed px-8">
            The official Badagry station for Kitchen, Salon, Club, and Marine Services.
          </p>
        </div>
        <div className="w-full max-w-sm space-y-4">
          <button 
            onClick={() => { setMode('SIGNUP'); setStep('IDENTIFY'); }}
            className="w-full bg-sun-500 hover:bg-sun-400 text-slate-950 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 transition-all border-b-4 border-sun-700"
          >
            Create Account <ArrowRight size={18} />
          </button>
          <button 
            onClick={() => { setMode('LOGIN'); setStep('IDENTIFY'); }}
            className="w-full bg-white/5 border border-white/10 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            Login to Account <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'VERIFYING') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center space-y-12 animate-in zoom-in">
        <div className="w-24 h-24 bg-sun-500/10 rounded-[2.5rem] flex items-center justify-center relative">
          <div className="absolute inset-0 border-4 border-sun-500/30 rounded-[2.5rem] animate-ping" />
          <Cpu size={48} className="text-sun-500 animate-pulse" />
        </div>
        <div className="space-y-4 max-w-xs">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Online Verification</h3>
          <div className="space-y-3">
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-500">WhatsApp Node:</span>
                <span className="text-green-500 flex items-center gap-1">Checking API... <Loader2 size={10} className="animate-spin"/></span>
             </div>
             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-sun-500 w-2/3 animate-[verify_2s_ease-in-out_infinite]" />
             </div>
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-500">Email Reputation:</span>
                <span className="text-sun-500">Establishing link...</span>
             </div>
          </div>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed pt-4">
             Synchronizing with Central Registry for Badagry Unit membership integrity.
          </p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes verify {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(150%); }
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      
      {/* Real-time WhatsApp Notification Simulation */}
      <div className={`fixed top-6 left-6 right-6 z-[200] transition-all duration-700 transform ${showNotification ? 'translate-y-0 opacity-100' : '-translate-y-32 opacity-0'}`}>
         <div className="bg-[#128C7E] text-white p-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
               <MessageCircle size={28} fill="currentColor"/>
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[10px] font-black uppercase tracking-widest">Evening Sun Hub</span>
                  <span className="text-[8px] opacity-60">NOW</span>
               </div>
               <p className="text-xs font-bold truncate">Your synchronization code is <span className="text-lg font-black tracking-widest">{generatedOtp}</span>. Do not share.</p>
            </div>
            <button onClick={() => setShowNotification(false)} className="p-2 opacity-50 active:scale-90 transition-transform"><X size={16}/></button>
         </div>
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-8 animate-in slide-in-from-right duration-500">
        <button onClick={handleBack} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Return</span>
        </button>

        <div className="space-y-2">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">
            {mode === 'SIGNUP' ? 'Membership Registration' : 'Greetings, Boss'}
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kindly enter your details to proceed</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/10 space-y-8 shadow-2xl relative">
          {step === 'IDENTIFY' && (
            <form onSubmit={handleIdentify} className="space-y-6">
              {mode === 'SIGNUP' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Official Name</label>
                  <div className="relative group">
                    <User size={18} className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${fieldErrors.name ? 'text-red-500' : 'text-slate-600 group-focus-within:text-sun-500'}`} />
                    <input 
                      required 
                      type="text" 
                      value={formData.name} 
                      onChange={e => {
                        setFormData({...formData, name: e.target.value});
                        if (fieldErrors.name) setFieldErrors({...fieldErrors, name: ''});
                      }} 
                      className={`w-full pl-14 p-5 rounded-2xl bg-black/40 border text-white outline-none transition-all font-bold placeholder:text-slate-700 ${fieldErrors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-sun-500'}`} 
                      placeholder="Enter your complete name" 
                    />
                  </div>
                  {fieldErrors.name && <p className="text-[8px] font-black uppercase text-red-500 tracking-widest ml-4 mt-1">{fieldErrors.name}</p>}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">WhatsApp Number (Compulsory)</label>
                <div className="relative group">
                  <MessageCircle size={18} className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${fieldErrors.phone ? 'text-red-500' : 'text-slate-600 group-focus-within:text-green-500'}`} />
                  <input 
                    required 
                    type="tel" 
                    value={formData.phone} 
                    onChange={e => {
                      setFormData({...formData, phone: e.target.value});
                      if (fieldErrors.phone) setFieldErrors({...fieldErrors, phone: ''});
                    }} 
                    className={`w-full pl-14 p-5 rounded-2xl bg-black/40 border text-white outline-none transition-all font-bold placeholder:text-slate-700 ${fieldErrors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-green-500'}`} 
                    placeholder="080... (WhatsApp Line)" 
                  />
                </div>
                {fieldErrors.phone && <p className="text-[8px] font-black uppercase text-red-500 tracking-widest ml-4 mt-1">{fieldErrors.phone}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Valid Email Address</label>
                <div className="relative group">
                  <Mail size={18} className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${fieldErrors.email ? 'text-red-500' : 'text-slate-600 group-focus-within:text-sun-500'}`} />
                  <input 
                    required 
                    type="email" 
                    value={formData.email} 
                    onChange={e => {
                      setFormData({...formData, email: e.target.value});
                      if (fieldErrors.email) setFieldErrors({...fieldErrors, email: ''});
                    }} 
                    className={`w-full pl-14 p-5 rounded-2xl bg-black/40 border text-white outline-none transition-all font-bold placeholder:text-slate-700 ${fieldErrors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-sun-500'}`} 
                    placeholder="boss@eveningsun.com.ng" 
                  />
                </div>
                {fieldErrors.email && <p className="text-[8px] font-black uppercase text-red-500 tracking-widest ml-4 mt-1">{fieldErrors.email}</p>}
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className={`w-full bg-sun-500 text-slate-950 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all border-b-4 border-sun-700 ${Object.keys(fieldErrors).length > 0 ? 'opacity-80' : ''}`}
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18}/> : (mode === 'SIGNUP' ? 'Complete Registration' : 'Verify Identity')}
                </button>
              </div>
              
              <div className="flex items-center gap-2 justify-center px-4">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <p className="text-[8px] font-black uppercase text-slate-600 tracking-widest text-center italic leading-relaxed">
                   WhatsApp Strict synchronization required for node activation.
                 </p>
              </div>
            </form>
          )}

          {step === 'OTP_VERIFY' && (
            <div className="space-y-8 text-center animate-in zoom-in">
              <div className="w-20 h-20 bg-green-500/10 rounded-[1.5rem] flex items-center justify-center mx-auto text-green-500 shadow-inner ring-4 ring-green-500/5 relative">
                <MessageCircle size={40} />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white border-2 border-slate-900 animate-bounce">
                   <BellRing size={12}/>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">WhatsApp Protocol</h4>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 leading-relaxed">
                  The synchronization code was dispatched to <br/> <span className="text-green-500 font-black">+{formData.phone}</span> via WhatsApp.
                </p>
              </div>
              <div className="space-y-4">
                {/* Fixed OTP input for 4 digits */}
                <input 
                  autoFocus 
                  type="tel" 
                  maxLength={4} 
                  value={formData.otp} 
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    if (val.length <= 4) {
                      setFormData({...formData, otp: val});
                      if (error) setError(null);
                    }
                  }} 
                  className={`w-full p-6 rounded-2xl bg-black/60 border text-white text-4xl font-black text-center tracking-[0.5em] outline-none shadow-inner transition-all ${error ? 'border-red-500 animate-shake' : 'border-white/10 focus:border-green-500'}`} 
                  placeholder="0000" 
                />
                {error && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</p>}
              </div>
              <div className="space-y-4">
                <button 
                  onClick={handleVerifyOTP} 
                  disabled={isLoading || formData.otp.length < 4} 
                  className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18}/> : 'Authenticate Connection'}
                </button>
                <button 
                  type="button" 
                  onClick={triggerOtpDispatch}
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors"
                >
                  I didn't receive the code
                </button>
              </div>
            </div>
          )}

          {step === 'PASSWORD_ENTRY' && (
            <form onSubmit={handleFinalAuth} className="space-y-8 animate-in slide-in-from-bottom-5">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-sun-500/20 rounded-[1.2rem] flex items-center justify-center mx-auto text-sun-500 border border-sun-500/30">
                  <Key size={32} className="animate-pulse" />
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">{mode === 'SIGNUP' ? 'Define Node Key' : 'Enter Station Key'}</h4>
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-sun-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  autoFocus 
                  required 
                  type="password" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  className="w-full pl-14 p-5 rounded-2xl bg-black/50 border border-white/5 focus:border-sun-500 transition-all font-black text-white outline-none shadow-inner tracking-[0.5em]" 
                  placeholder="••••" 
                />
              </div>
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 rounded-xl border border-red-500/20 text-red-500 animate-in shake-x">
                  <AlertCircle size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                </div>
              )}
              <button 
                type="submit" 
                disabled={isLoading || formData.password.length < 4} 
                className="w-full bg-sun-500 hover:bg-sun-400 text-slate-950 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-3xl active:scale-95 transition-all flex items-center justify-center gap-4 border-b-8 border-sun-700"
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <><ShieldCheck size={28}/> Complete Handshake</>}
              </button>
            </form>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}} />
    </div>
  );
};
