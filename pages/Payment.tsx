
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, CreditCard, ShieldCheck, Wallet, Landmark, CheckCircle, Loader2, X,
  Smartphone, Receipt, Zap, Sparkles, Lock, Globe, ArrowRight, Shield, Copy, Timer,
  Smartphone as MobileIcon, Banknote, Info, BadgeCheck, Star, Hash, Mail, Tag, Ticket
} from 'lucide-react';
import { Booking } from '../types';

export const Payment = () => {
  const { cart, clearCart, addBooking, balance, updateBalance, loyaltyPoints, redeemPoints, addPoints, rewardPercentage, addTransaction, settings, addNotification, vouchers } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const pendingBooking = location.state?.pendingBooking as Booking | undefined;

  const [selectedMethod, setSelectedMethod] = useState('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGateway, setShowGateway] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string, discount: number, type: 'FIXED' | 'PERCENT' } | null>(null);
  const [voucherError, setVoucherError] = useState("");
  const [selectedUssdBank, setSelectedUssdBank] = useState('GTBank');
  const [timer, setTimer] = useState(600);

  const PAYMENT_HUBS = [
    { id: 'wallet', name: 'Hub Wallet', desc: 'Use your wallet balance', icon: Wallet, color: 'text-sun-500', bgColor: 'bg-sun-500', brand: 'W' },
    { id: 'paystack', name: 'Paystack', desc: 'Pay with Card', icon: ShieldCheck, color: 'text-blue-500', bgColor: 'bg-blue-600', brand: 'P' },
    { id: 'monnify', name: 'Bank Transfer', desc: 'Transfer to virtual account', icon: Landmark, color: 'text-amber-600', bgColor: 'bg-amber-600', brand: 'M' },
    { id: 'ussd', name: 'USSD Dial', desc: 'Pay with USSD code', icon: Hash, color: 'text-purple-500', bgColor: 'bg-purple-600', brand: 'U' },
    { id: 'opay', name: 'OPay Hub', desc: 'Pay with OPay app', icon: Smartphone, color: 'text-green-500', bgColor: 'bg-green-600', brand: 'O' }
  ];

  const subtotal = pendingBooking
    ? (pendingBooking.price || 0)
    : cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const deliveryFee = pendingBooking ? 0 : 1000;

  const handleApplyVoucher = () => {
    setVoucherError("");
    const v = vouchers.find(x => x.code.toUpperCase() === voucherCode.toUpperCase() && x.isActive);
    if (v) {
      setAppliedVoucher(v);
      setVoucherCode("");
    } else {
      setVoucherError("Invalid or expired voucher code.");
    }
  };

  const voucherDiscount = appliedVoucher
    ? (appliedVoucher.type === 'PERCENT' ? (subtotal * (appliedVoucher.discount / 100)) : appliedVoucher.discount)
    : 0;

  const pointsDiscount = usePoints ? Math.min(subtotal - voucherDiscount, loyaltyPoints) : 0;
  const total = Math.max(0, subtotal + deliveryFee - voucherDiscount - pointsDiscount);

  useEffect(() => {
    let interval: number;
    if (showGateway && (selectedMethod === 'monnify' || selectedMethod === 'ussd')) {
      interval = window.setInterval(() => {
        setTimer(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showGateway, selectedMethod]);

  const handleProcessPayment = () => {
    if (selectedMethod === 'wallet' && balance < total) {
      alert("Insufficient Hub Wallet balance.");
      return;
    }

    setIsProcessing(true);
    if (usePoints) redeemPoints(pointsDiscount);

    if (selectedMethod === 'wallet') {
      setTimeout(() => {
        updateBalance(-total);
        completeCheckout();
      }, 1500);
    } else {
      setTimeout(() => {
        setIsProcessing(false);
        setShowGateway(true);
      }, 1200);
    }
  };

  const completeCheckout = () => {
    setIsProcessing(false);
    setPaymentSuccess(true);

    addTransaction({
      title: pendingBooking ? pendingBooking.serviceName : 'Order',
      amount: -total,
      type: pendingBooking ? (pendingBooking.category as any) : 'EATERY',
      channel: PAYMENT_HUBS.find(h => h.id === selectedMethod)?.name || 'Portal'
    });

    const earnedPoints = Math.floor(total * (rewardPercentage / 100));
    addPoints(earnedPoints);

    if (pendingBooking) {
      addBooking({ ...pendingBooking, status: 'CONFIRMED', depositPaid: true });
    } else {
      clearCart();
    }

    if (settings.notifications.email) {
      addNotification({
        title: 'Receipt Sent',
        message: 'A digital copy of your receipt has been sent to your registered email.',
        type: 'SUCCESS'
      });
    }
  };

  const handleGatewayAuthorize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setShowGateway(false);
      completeCheckout();
    }, 2000);
  };

  const currentHub = PAYMENT_HUBS.find(h => h.id === selectedMethod) || PAYMENT_HUBS[0];
  const currentBankCode = USSD_BANKS.find(b => b.name === selectedUssdBank)?.code || '*737*';

  if (paymentSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] flex items-center justify-center text-white mb-6 shadow-xl shadow-green-500/20"><CheckCircle size={48} /></div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight uppercase leading-none">Payment Successful</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-4 max-w-xs mx-auto font-medium leading-relaxed uppercase text-[10px] tracking-widest">Your payment has been verified via {currentHub.name}.</p>

        {settings.notifications.email && (
          <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6">
            <Mail size={14} />
            <span>Email Receipt Sent</span>
          </div>
        )}

        <div className="bg-sun-50 dark:bg-sun-900/10 p-4 rounded-2xl mb-12 border border-sun-100 dark:border-sun-800/30">
          <p className="text-sun-600 text-[10px] font-black uppercase tracking-widest">You earned {Math.floor(total * (rewardPercentage / 100))} SunPoints!</p>
        </div>
        <button onClick={() => navigate('/')} className="w-full max-w-xs bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95">Go to Home</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-40 animate-in fade-in duration-300">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><ArrowLeft size={20} className="dark:text-white" /></button>
        <h2 className="text-xl font-black dark:text-white tracking-tight uppercase text-[10px] tracking-[0.2em]">Checkout</h2>
      </div>

      <div className="bg-slate-950 text-white p-8 rounded-[3rem] relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sun-500 rounded-full blur-[60px] opacity-10" />
        <div className="relative z-10 space-y-4">
          <div>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-0.3em mb-2">Total Amount</p>
            <h3 className="text-4xl font-black tracking-tighter">₦{total.toLocaleString()}</h3>
          </div>
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            {voucherDiscount > 0 && (
              <div className="flex justify-between text-[10px] font-bold text-green-500 uppercase tracking-widest">
                <span>Voucher Discount</span>
                <span>-₦{voucherDiscount.toLocaleString()}</span>
              </div>
            )}
            {pointsDiscount > 0 && (
              <div className="flex justify-between text-[10px] font-bold text-green-500 uppercase tracking-widest">
                <span>Points Used</span>
                <span>-₦{pointsDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Service & Delivery</span>
              <span>₦{deliveryFee.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* VOUCHER & POINTS HUB */}
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sun-50 dark:bg-sun-900/20 text-sun-600 flex items-center justify-center shadow-inner"><Sparkles size={20} /></div>
              <div>
                <h4 className="text-xs font-black dark:text-white uppercase tracking-widest">Use Loyalty Points</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{loyaltyPoints.toLocaleString()} Points Available</p>
              </div>
            </div>
            <button
              onClick={() => setUsePoints(!usePoints)}
              className={`w-12 h-6 rounded-full transition-all duration-300 relative ${usePoints ? 'bg-sun-500 shadow-inner' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${usePoints ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center shadow-inner"><Ticket size={20} /></div>
            <h4 className="text-xs font-black dark:text-white uppercase tracking-widest">Use Voucher</h4>
          </div>
          {appliedVoucher ? (
            <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-2xl border border-green-100 dark:border-green-800/30 flex justify-between items-center animate-in zoom-in">
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">{appliedVoucher.code} APPLIED</span>
              </div>
              <button onClick={() => setAppliedVoucher(null)} className="text-green-600 hover:text-red-500"><X size={16} /></button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={voucherCode}
                onChange={e => setVoucherCode(e.target.value.toUpperCase())}
                placeholder="Enter Voucher Code..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-xs font-black uppercase outline-none focus:ring-2 focus:ring-sun-500 dark:text-white"
              />
              <button
                onClick={handleApplyVoucher}
                className="bg-slate-950 dark:bg-sun-500 text-white px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95"
              >
                Apply
              </button>
            </div>
          )}
          {voucherError && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest text-center mt-1">{voucherError}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] px-2">Payment Methods</h3>
        <div className="grid grid-cols-1 gap-3">
          {PAYMENT_HUBS.map(hub => (
            <button
              key={hub.id}
              onClick={() => setSelectedMethod(hub.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-[2.2rem] border-2 transition-all relative ${selectedMethod === hub.id ? 'border-sun-500 bg-white dark:bg-slate-900 shadow-xl' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm opacity-60'}`}
            >
              <div className={`w-12 h-12 rounded-2xl ${hub.bgColor} text-white flex items-center justify-center shadow-md`}>
                {React.createElement(hub.icon as any, { size: 24 })}
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight">{hub.name}</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{hub.desc}</p>
              </div>
              {selectedMethod === hub.id && <div className="absolute top-4 right-4"><CheckCircle size={16} className="text-sun-500" /></div>}
              {hub.id === 'wallet' && (
                <div className="text-right pr-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">BALANCE</span>
                  <span className="text-xs font-black dark:text-white">₦{balance.toLocaleString()}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-t border-slate-100 dark:border-slate-800 p-6 z-[60] shadow-2xl">
        <button onClick={handleProcessPayment} disabled={isProcessing} className="w-full max-w-md mx-auto bg-slate-900 dark:bg-sun-500 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-black/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
          {isProcessing ? <><Loader2 className="animate-spin" size={24} /> <span className="uppercase text-sm tracking-widest">Processing...</span></> : `Pay ₦${total.toLocaleString()}`}
        </button>
      </div>

      {/* SECURE GATEWAY OVERLAY (Unchanged) */}
      {showGateway && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-20 duration-500 border border-white/5">
            <div className={`p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 ${currentHub.bgColor} text-white`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-xs">{currentHub.brand}</div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black tracking-widest uppercase">{currentHub.name} Secure Payment</span>
                  <span className="text-[8px] font-bold opacity-80 uppercase tracking-widest">PAYMENT GATEWAY</span>
                </div>
              </div>
              <button onClick={() => setShowGateway(false)} className="text-white/60 hover:text-white p-1"><X size={20} /></button>
            </div>

            <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto scrollbar-hide">
              <div className="text-center space-y-1">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Amount</p>
                <h4 className="text-4xl font-black dark:text-white tracking-tighter">₦{total.toLocaleString()}</h4>
              </div>

              {selectedMethod === 'monnify' ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                  <div className="bg-sun-50 dark:bg-sun-900/10 p-7 rounded-[2.5rem] border border-sun-100 dark:border-sun-800/30 text-center space-y-4 shadow-inner">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-sun-600 uppercase tracking-widest">Transfer to this Bank Account</p>
                      <h5 className="text-2xl font-black dark:text-white select-all">0123456789</h5>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Evening Sun - Hub Account</p>
                    </div>
                    <div className="flex items-center justify-center gap-4 pt-2">
                      <button onClick={() => { navigator.clipboard.writeText("0123456789"); alert("Account Copied"); }} className="flex items-center gap-1.5 text-[10px] font-black text-sun-600 uppercase tracking-widest bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-sun-100 dark:border-sun-800/50"><Copy size={14} /> Copy Acc.</button>
                      <div className="flex items-center gap-1.5 text-slate-400"><Timer size={14} /> <span className="text-[10px] font-black font-mono">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span></div>
                    </div>
                  </div>
                  <button onClick={handleGatewayAuthorize} className="w-full bg-sun-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-lg flex items-center justify-center gap-2">I have Sent the Money <ArrowRight size={16} /></button>
                </div>
              ) : selectedMethod === 'ussd' ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Bank</label>
                    <div className="grid grid-cols-2 gap-2">
                      {USSD_BANKS.map(bank => (
                        <button
                          key={bank.name}
                          onClick={() => setSelectedUssdBank(bank.name)}
                          className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${selectedUssdBank === bank.name ? 'border-purple-500 bg-purple-500/10 text-purple-600' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                        >
                          {bank.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[2.2rem] text-center space-y-2 border border-slate-100 dark:border-slate-700">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Dial Code</p>
                    <p className="text-2xl font-black dark:text-white tracking-[0.1em]">{currentBankCode}1*{total}*88#</p>
                  </div>
                  <button onClick={handleGatewayAuthorize} disabled={isProcessing} className="w-full bg-purple-600 text-white py-6 rounded-[2.2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-2">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <><Smartphone size={18} /> Pay Now</>}
                  </button>
                </div>
              ) : selectedMethod === 'opay' ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 text-center">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-400 border border-slate-200 dark:border-slate-700 shadow-inner"><MobileIcon size={40} /></div>
                  <div className="space-y-2">
                    <h5 className="text-lg font-black dark:text-white tracking-tight uppercase leading-none">Authorize OPay Payment</h5>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-4">An authorization request has been sent to your OPay app. Please confirm to complete.</p>
                  </div>
                  <button onClick={handleGatewayAuthorize} className={`w-full ${currentHub.bgColor} text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3`}><Smartphone size={20} /> Open OPay App</button>
                </div>
              ) : (
                <div className="space-y-5 animate-in slide-in-from-bottom-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Details</label>
                    <div className="relative">
                      <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input type="text" placeholder="4242 4242 4242 4242" className="w-full pl-12 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-sun-500 outline-none text-sm font-mono tracking-widest dark:text-white transition-all shadow-inner" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry</label>
                      <input type="text" placeholder="MM/YY" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-sun-500 outline-none text-sm font-black dark:text-white transition-all shadow-inner text-center" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Code</label>
                      <input type="password" placeholder="***" maxLength={3} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-sun-500 outline-none text-sm font-black dark:text-white transition-all shadow-inner text-center" />
                    </div>
                  </div>
                  <button onClick={handleGatewayAuthorize} disabled={isProcessing} className={`w-full ${currentHub.bgColor} text-white py-6 rounded-[2.2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3`}>
                    {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                    {isProcessing ? 'Processing...' : `Pay ₦${total.toLocaleString()}`}
                  </button>
                  <div className="flex justify-center items-center gap-2 opacity-30 pt-2">
                    <div className="flex items-center gap-1.5"><Shield size={10} className="text-green-500" /> <span className="text-[7px] font-black uppercase tracking-widest">Secure Payment Guaranteed</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const USSD_BANKS = [
  { name: 'GTBank', code: '*737*' },
  { name: 'Zenith', code: '*966*' },
  { name: 'Access', code: '*901*' },
  { name: 'UBA', code: '*919*' },
  { name: 'FirstBank', code: '*894*' }
];
