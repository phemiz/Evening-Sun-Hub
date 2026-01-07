
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChefHat, Clock, CheckCircle2, Package, MapPin, Phone, Info, QrCode, Zap, ShoppingBag, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrderTracking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { bookings, updateBookingStatus } = useApp();
  const order = bookings.find(b => b.id === id);

  const [step, setStep] = useState(1); 

  useEffect(() => {
    if (!order) return;
    
    // Auto status progression simulation tailored for Supermarket vs Eatery
    const isMarket = order.category === 'SUPERMARKET';
    const timers = [
      setTimeout(() => { setStep(2); updateBookingStatus(order.id, isMarket ? 'PICKED' : 'PREPARING'); }, 5000),
      setTimeout(() => { setStep(3); updateBookingStatus(order.id, isMarket ? 'PACKED' : 'READY'); }, 12000),
      setTimeout(() => { setStep(4); updateBookingStatus(order.id, 'READY'); }, 18000),
    ];
    
    return () => timers.forEach(t => clearTimeout(t));
  }, [order]);

  if (!order) return <div className="p-20 text-center uppercase font-black text-slate-400">Order not found</div>;

  const steps = order.category === 'SUPERMARKET' ? [
    { id: 1, label: 'Order Confirmed', icon: CheckCircle2, sub: 'Inventory reserved' },
    { id: 2, label: 'Items Picked', icon: ShoppingBag, sub: 'Shelf syncing complete' },
    { id: 3, label: 'Manifest Packed', icon: Package, sub: 'Sealed for hand-off' },
    { id: 4, label: order.orderType === 'DELIVERY' ? 'In Transit' : 'Ready for Pickup', icon: order.orderType === 'DELIVERY' ? Truck : Zap, sub: 'Final node reach' }
  ] : [
    { id: 1, label: 'Handshake Confirmed', icon: CheckCircle2, sub: 'Kitchen node received' },
    { id: 2, label: 'Chef Preparing', icon: ChefHat, sub: 'Crafting your meal' },
    { id: 3, label: order.orderType === 'DINE_IN' ? 'Served' : 'Ready for Pickup', icon: Package, sub: 'Service complete' }
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-300 pb-32">
      <div className="flex items-center gap-4 px-1">
        <button onClick={() => navigate('/')} className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
          <ArrowLeft size={24} className="dark:text-white" />
        </button>
        <div>
          <h2 className="text-2xl font-black dark:text-white tracking-tighter uppercase leading-none">Live Status</h2>
          <p className="text-[10px] font-black text-sun-600 uppercase tracking-[0.3em] mt-2">Node #{order.id}</p>
        </div>
      </div>

      {/* QR Code Identification */}
      <div className="bg-slate-950 p-8 rounded-[3rem] text-white flex items-center justify-between relative overflow-hidden border border-white/5">
         <div className="relative z-10 space-y-2">
            <h4 className="text-xl font-black uppercase tracking-tight">Handshake QR</h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest max-w-[150px]">Show this to our staff for {order.orderType === 'DELIVERY' ? 'Safe Delivery' : 'Pickup Verification'}.</p>
         </div>
         <div className="relative z-10 w-20 h-20 bg-white p-2 rounded-2xl">
            <QrCode size={64} className="text-slate-950" />
         </div>
         <div className="absolute top-0 right-0 w-32 h-32 bg-sun-500 rounded-full blur-[60px] opacity-10" />
      </div>

      {/* Tracker Stepper */}
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-12">
         {steps.map((s, idx) => (
           <div key={s.id} className="flex gap-6 items-start relative">
              {idx < steps.length - 1 && (
                <div className={`absolute left-6 top-12 w-0.5 h-12 ${step > s.id ? 'bg-sun-500' : 'bg-slate-100 dark:bg-slate-800'}`} />
              )}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all ${step >= s.id ? 'bg-sun-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-300'}`}>
                 <s.icon size={24} className={step === s.id ? 'animate-bounce' : ''} />
              </div>
              <div className="flex-1">
                 <h4 className={`text-sm font-black uppercase tracking-tight leading-none mb-1 ${step >= s.id ? 'dark:text-white' : 'text-slate-300'}`}>{s.label}</h4>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.sub}</p>
              </div>
              {step > s.id && <CheckCircle2 size={16} className="text-sun-500 mt-2" />}
           </div>
         ))}
      </div>

      {/* Order Details Mini-Card */}
      <div className="space-y-4 px-1">
         <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Manifest Items</h3>
         <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm font-bold dark:text-white">
                 <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-[10px] font-black">{item.quantity}x</span>
                    <span className="truncate max-w-[150px]">{item.name}</span>
                 </div>
                 <span className="text-sun-600">₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics: {order.orderType}</span>
               <span className="text-xl font-black dark:text-white">₦{order.price?.toLocaleString()}</span>
            </div>
         </div>
      </div>

      <button onClick={() => navigate('/')} className="w-full bg-slate-950 dark:bg-white dark:text-slate-950 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all">Return to Dashboard</button>
    </div>
  );
};
