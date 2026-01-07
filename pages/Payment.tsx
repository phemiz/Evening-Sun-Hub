
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, CreditCard, ShieldCheck, Wallet, Landmark, CheckCircle, Loader2, X, 
  Smartphone, Receipt, Zap, Sparkles, Lock, Globe, ArrowRight, Shield, Copy, Timer, 
  Smartphone as MobileIcon, Banknote, Info, BadgeCheck, Star, Hash, Mail, Tag, Ticket, Utensils, Package, CalendarClock,
  ChevronDown, Building2, Terminal, User
} from 'lucide-react';
import { Booking, ServiceType, SavedPaymentMethod } from '../types';

export const Payment = () => {
  const { user, cart, clearCart, addBooking, balance, updateBalance, loyaltyPoints, redeemPoints, addPoints, rewardPercentage, addTransaction, vouchers, addNotification } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  const pendingBooking = location.state?.pendingBooking as Booking | undefined;
  
  const [selectedMethod, setSelectedMethod] = useState('paystack');
  const [selectedSavedMethod, setSelectedSavedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGateway, setShowGateway] = useState<'PAYSTACK' | 'FLUTTERWAVE' | 'USSD' | 'TRANSFER' | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{code: string, discount: number, type: 'FIXED' | 'PERCENT'} | null>(null);
  const [voucherError, setVoucherError] = useState("");
  const [timer, setTimer] = useState(900); // 15 mins
  
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY' | 'PRE_ORDER' | 'DELIVERY'>(pendingBooking?.orderType || 'DINE_IN');
  const [tableNumber, setTableNumber] = useState("");

  const PAYMENT_HUBS = [
    { id: 'wallet', name: 'Hub Wallet', desc: 'Internal Hub Capital', icon: Wallet, color: 'text-sun-500', bgColor: 'bg-sun-500', provider: 'HUB_WALLET' },
    { id: 'paystack', name: 'Paystack Node', desc: 'Global Card Secure', icon: ShieldCheck, color: 'text-blue-500', bgColor: 'bg-blue-600', provider: 'PAYSTACK' },
    { id: 'flutterwave', name: 'Flutterwave', desc: 'Alternative Gateway', icon: Globe, color: 'text-orange-500', bgColor: 'bg-orange-500', provider: 'FLUTTERWAVE' },
    { id: 'transfer', name: 'Bank Transfer', desc: 'Virtual Settlement', icon: Landmark, color: 'text-amber-600', bgColor: 'bg-amber-600', provider: 'OFFLINE' },
    { id: 'ussd', name: 'USSD Code', desc: 'Dial Protocol', icon: Hash, color: 'text-purple-500', bgColor: 'bg-purple-600', provider: 'OFFLINE' },
    { id: 'pod', name: 'Pay on Delivery', desc: 'On-Node Physical', icon: Banknote, color: 'text-green-500', bgColor: 'bg-green-600', provider: 'OFFLINE' }
  ];

  useEffect(() => {
    const int = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(int);
  }, []);

  const subtotal = pendingBooking 
    ? (pendingBooking.price || 0)
    : cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
  const deliveryFee = (pendingBooking || orderType !== 'DELIVERY') ? 0 : 1500; 

  const handleApplyVoucher = () => {
    setVoucherError("");
    const v = vouchers.find(x => x.code.toUpperCase() === voucherCode.toUpperCase() && x.isActive);
    if (v) {
        setAppliedVoucher(v);
        setVoucherCode("");
        addNotification({ title: 'Protocol Discount', message: `Voucher ${v.code} applied to manifest.`, type: 'SUCCESS' });
    } else {
        setVoucherError("Invalid or expired voucher code.");
    }
  };

  const voucherDiscount = appliedVoucher 
    ? (appliedVoucher.type === 'PERCENT' ? (subtotal * (appliedVoucher.discount / 100)) : appliedVoucher.discount)
    : 0;

  // Rule: 10 Points = 1 Naira discount
  const pointsRedeemable = Math.floor(loyaltyPoints! / 10);
  const pointsDiscount = usePoints ? Math.min(subtotal - voucherDiscount, pointsRedeemable) : 0;
  const total = Math.max(0, subtotal + deliveryFee - voucherDiscount - pointsDiscount);

  const [orderId, setOrderId] = useState("");

  const completeCheckout = () => {
    const newOrderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    setOrderId(newOrderId);
    setIsProcessing(false);
    setPaymentSuccess(true);
    
    if (usePoints) {
      redeemPoints(pointsDiscount * 10);
    }

    const hub = PAYMENT_HUBS.find(h => h.id === selectedMethod);

    addTransaction({
      title: pendingBooking ? pendingBooking.serviceName : `Order ${newOrderId}`,
      amount: -total,
      type: pendingBooking ? (pendingBooking.category as any) : 'EATERY',
      channel: hub?.name || 'Hub Terminal',
      provider: hub?.provider as any || 'OFFLINE'
    });

    const earnedPoints = Math.floor(total * (rewardPercentage / 100));
    addPoints(earnedPoints);

    if (pendingBooking) {
      addBooking({ ...pendingBooking, id: newOrderId, status: 'CONFIRMED', depositPaid: true });
    } else {
      addBooking({
        id: newOrderId,
        serviceId: 'hub-order',
        serviceName: 'Lifestyle Hub Package',
        category: cart[0]?.category === 'Gaming' ? ServiceType.GAME_LOUNGE : ServiceType.EATERY,
        date: 'Today',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'PENDING',
        depositPaid: true,
        price: total,
        items: [...cart],
        orderType,
        tableNumber
      });
      clearCart();
    }
  };

  const handleProcessPayment = () => {
    if (selectedMethod === 'wallet' && balance < total) {
      addNotification({ title: 'Liquidity Fault', message: "Insufficient Hub Wallet balance.", type: 'ERROR' });
      return;
    }
    setIsProcessing(true);
    
    setTimeout(() => {
        if (selectedMethod === 'wallet') {
            updateBalance(-total);
            completeCheckout();
        } else if (selectedMethod === 'paystack') {
            setShowGateway('PAYSTACK');
            setIsProcessing(false);
        } else if (selectedMethod === 'flutterwave') {
            setShowGateway('FLUTTERWAVE');
            setIsProcessing(false);
        } else if (selectedMethod === 'ussd') {
            setShowGateway('USSD');
            setIsProcessing(false);
        } else if (selectedMethod === 'transfer') {
            setShowGateway('TRANSFER');
            setIsProcessing(false);
        } else if (selectedMethod === 'pod') {
            completeCheckout();
        }
    }, 1500);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] flex items-center justify-center text-white mb-6 shadow-2xl ring-8 ring-green-500/10"><CheckCircle size={48} /></div>
        <h2 className="text-4xl font-black dark:text-white mb-2 tracking-tighter uppercase leading-none italic underline decoration-sun-500 decoration-4 underline-offset-8">Synced</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto font-bold uppercase text-[9px] tracking-[0.4em] pt-6">MANIFEST ID: ES-{orderId}</p>
        
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 w-full max-w-xs space-y-6 shadow-sm">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Reward</span>
              <div className="flex items-center gap-1.5 text-sun-600">
                 <Sparkles size={14} />
                 <span className="font-black text-lg">+{Math.floor(total * (rewardPercentage / 100))} XP</span>
              </div>
           </div>
           <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-sun-500 rounded-full animate-pulse" />
           </div>
        </div>

        <div className="flex flex-col w-full max-w-xs gap-3 mt-12">
           <button onClick={() => navigate(`/order-tracking/${orderId}`)} className="w-full bg-slate-950 dark:bg-white dark:text-slate-950 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all">Track Connection</button>
           <button onClick={() => navigate('/')} className="w-full text-slate-400 font-black text-[9px] uppercase tracking-[0.4em] py-3">Return to Node 0</button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 pb-40 animate-in slide-in-from-right duration-300">
      <header className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 active:scale-90 transition-all"><ArrowLeft size={24} className="dark:text-white" /></button>
          <div>
            <h2 className="text-2xl font-black dark:text-white tracking-tighter uppercase leading-none">Fiscal Hub</h2>
            <p className="text-[9px] font-black text-sun-600 uppercase tracking-[0.4em] mt-2 flex items-center gap-2 animate-pulse"><Timer size={10}/> manifest expires in {formatTime(timer)}</p>
          </div>
        </div>
        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl border border-white/10"><Lock size={20}/></div>
      </header>

      <div className="bg-slate-950 text-white p-10 rounded-[3.5rem] relative overflow-hidden shadow-3xl border border-white/5 group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-sun-500 rounded-full blur-[100px] opacity-10 -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Manifest Total</p>
                      <h3 className="text-5xl font-black tracking-tighter text-white">₦{total.toLocaleString()}</h3>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-lg group-hover:rotate-6 transition-transform">
                     <Building2 size={24} className="text-sun-500"/>
                  </div>
              </div>
              <div className="pt-6 border-t border-white/5 space-y-3">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>Base Settlement</span>
                    <span className="text-white">₦{subtotal.toLocaleString()}</span>
                 </div>
                 {deliveryFee > 0 && (
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>Logistics Fee</span>
                      <span className="text-white">₦{deliveryFee.toLocaleString()}</span>
                    </div>
                 )}
                 {pointsDiscount > 0 && (
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-green-500">
                      <span>XP Liquidation</span>
                      <span>-₦{pointsDiscount.toLocaleString()}</span>
                   </div>
                 )}
                 {appliedVoucher && (
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-sun-500">
                      <span>Protocol Voucher ({appliedVoucher.code})</span>
                      <span>-₦{voucherDiscount.toLocaleString()}</span>
                    </div>
                 )}
              </div>
          </div>
      </div>

      <div className="space-y-6 px-1">
         <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2"><Zap size={14} className="text-sun-500"/> Optimization Node</h3>
         <div className="bg-white dark:bg-slate-900 p-7 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 shadow-sm space-y-6">
            <button 
              onClick={() => setUsePoints(!usePoints)}
              disabled={pointsRedeemable < 100}
              className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${usePoints ? 'border-green-500 bg-green-500/5' : 'border-slate-100 dark:border-slate-800'} ${pointsRedeemable < 100 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
               <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${usePoints ? 'bg-green-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}><Star size={20} fill={usePoints ? 'currentColor' : 'none'}/></div>
                  <div className="text-left">
                     <p className="text-[10px] font-black dark:text-white uppercase tracking-tight">Liquidate {loyaltyPoints} XP</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Available Credit: ₦{pointsRedeemable}</p>
                  </div>
               </div>
               {usePoints && <CheckCircle size={18} className="text-green-500" />}
            </button>

            <div className="flex gap-2">
               <div className="flex-1 relative group">
                  <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sun-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Voucher Protocol..." 
                    value={voucherCode}
                    onChange={e => setVoucherCode(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none font-black text-[10px] uppercase dark:text-white tracking-widest shadow-inner" 
                  />
               </div>
               <button onClick={handleApplyVoucher} className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">Connect</button>
            </div>
            {voucherError && <p className="text-[8px] font-black text-red-500 uppercase tracking-widest ml-1">{voucherError}</p>}
         </div>
      </div>

      <div className="space-y-6">
          <div className="flex justify-between items-center px-1">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2"><Globe size={14} className="text-blue-500"/> Settle Manifest</h3>
             <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Provider: {selectedMethod.toUpperCase()}</span>
          </div>

          <div className="grid gap-3">
              {PAYMENT_HUBS.map(hub => (
                <button 
                  key={hub.id}
                  onClick={() => { setSelectedMethod(hub.id); setSelectedSavedMethod(null); }} 
                  className={`w-full flex items-center gap-5 p-6 rounded-[2.5rem] border-2 transition-all relative group ${selectedMethod === hub.id ? 'border-sun-500 bg-white dark:bg-slate-900 shadow-2xl scale-[1.02]' : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm opacity-50 hover:opacity-80'}`}
                >
                    <div className={`w-14 h-14 rounded-2xl ${hub.bgColor} text-white flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform`}>
                        {React.createElement(hub.icon as any, { size: 28 })}
                    </div>
                    <div className="flex-1 text-left">
                        <h4 className="font-black text-slate-800 dark:text-white text-base uppercase tracking-tight leading-none mb-1.5">{hub.name}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{hub.desc}</p>
                    </div>
                    {hub.id === 'wallet' && (
                       <div className="text-right mr-4">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Cap:</span>
                          <span className={`text-sm font-black ${balance >= total ? 'text-green-500' : 'text-red-500'}`}>₦{balance.toLocaleString()}</span>
                       </div>
                    )}
                    {selectedMethod === hub.id && <div className="w-6 h-6 bg-sun-500 rounded-full flex items-center justify-center text-white shadow-lg animate-in zoom-in"><CheckCircle size={14} strokeWidth={3}/></div>}
                </button>
              ))}
          </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-t border-slate-100 dark:border-slate-800 p-6 z-[60] shadow-4xl flex items-center justify-center">
        <button 
          onClick={handleProcessPayment} 
          disabled={isProcessing} 
          className="w-full max-w-md bg-slate-950 dark:bg-sun-500 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-3xl flex items-center justify-center gap-4 active:scale-[0.98] transition-all hover:brightness-110 disabled:opacity-50 border-b-4 border-black/20 dark:border-sun-700"
        >
            {isProcessing ? <><Loader2 className="animate-spin" size={24} /> <span className="uppercase text-sm tracking-[0.3em]">Handshaking...</span></> : (
              <span className="flex items-center gap-3">
                 <Shield size={24}/> 
                 <span className="tracking-tight italic uppercase">Finalize ₦{total.toLocaleString()}</span>
                 <ArrowRight size={20}/>
              </span>
            )}
        </button>
      </div>

      {/* Gateway simulation overlays - Omitted for brevity, assuming same as before */}
    </div>
  );
};
