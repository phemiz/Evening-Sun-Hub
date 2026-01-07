import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, Presentation, Zap, Users, ShieldCheck, CheckCircle, TrendingUp, Calendar, Loader2
} from 'lucide-react';
import { ServiceType, ServiceItem } from '../types';

export const MeetingHall = () => {
  const navigate = useNavigate();
  const { services, getDynamicPrice } = useApp();
  const halls = services[ServiceType.MEETING_HALL] || [
    { id: 'h1', name: 'VIP Room A', price: 25000, durationMin: 60, capacityOptions: ['12-15'], description: 'Executive VIP space with 4K display and surround audio.' },
    { id: 'h2', name: 'Conference Room 1', price: 50000, durationMin: 60, capacityOptions: ['50-100'], description: 'Large space for workshops and seminars.' }
  ];

  const [selectedHall, setSelectedHall] = useState<ServiceItem | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationCount, setDurationCount] = useState(2);
  const [isSyncing, setIsSyncing] = useState(false);

  const dynamicPricing = useMemo(() => {
    if (!selectedHall) return { price: 0, surgeFactor: 1, isPeak: false };
    return getDynamicPrice(selectedHall.id, selectedHall.price);
  }, [selectedHall, getDynamicPrice]);

  const totalInvestment = dynamicPricing.price * durationCount;

  const handleBooking = () => {
    if (!selectedHall) return;
    setIsSyncing(true);
    const booking = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        serviceId: selectedHall.id,
        serviceName: selectedHall.name,
        category: ServiceType.MEETING_HALL,
        date,
        time: "09:00 AM",
        status: 'PENDING' as const,
        depositPaid: false,
        price: totalInvestment,
        isDynamicPriced: dynamicPricing.isPeak,
        surgeFactor: dynamicPricing.surgeFactor
    };
    setTimeout(() => {
      navigate('/payment', { state: { pendingBooking: booking, totalAmount: totalInvestment } });
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-500">
      <header className="flex flex-col gap-6 px-1">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
            <ArrowLeft size={24} className="dark:text-white" />
          </button>
          <div>
            <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase leading-none">Event Center</h2>
            <p className="text-[10px] font-black text-sun-600 uppercase tracking-[0.3em] mt-2">Space Reservation Point</p>
          </div>
        </div>
      </header>

      <div className={`p-8 rounded-[3rem] shadow-xl text-white relative overflow-hidden group ${dynamicPricing.isPeak ? 'bg-orange-600' : 'bg-green-600'}`}>
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
         <div className="relative z-10 flex justify-between items-center">
            <div className="space-y-2">
               <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-80">Pricing Record V2.1</span>
               <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{dynamicPricing.isPeak ? 'Peak Activity' : 'Revenue Total'}</h3>
               <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 italic">{dynamicPricing.isPeak ? 'Dynamic surge 1.25x applied' : 'Optimal hub pricing active'}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
               {dynamicPricing.isPeak ? <TrendingUp size={32} /> : <Zap size={32} />}
            </div>
         </div>
      </div>

      <div className="grid gap-6">
        {halls.map(hall => (
          <button 
            key={hall.id}
            onClick={() => setSelectedHall(hall)}
            className={`w-full p-8 rounded-[3rem] border-2 text-left transition-all relative overflow-hidden group ${selectedHall?.id === hall.id ? 'border-sun-500 bg-sun-50/10 shadow-xl' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'}`}
          >
             <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 group-hover:text-sun-500 transition-colors shadow-inner">
                   <Presentation size={32}/>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hourly Rate</p>
                   <p className="text-2xl font-black text-sun-600 italic">₦{getDynamicPrice(hall.id, hall.price).price.toLocaleString()}<span className="text-xs">/hr</span></p>
                </div>
             </div>
             <div className="space-y-3">
                <h4 className="text-xl font-black dark:text-white uppercase tracking-tight">{hall.name}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">"{hall.description}"</p>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                   <div className="flex items-center gap-2">
                      <Users size={14} className="text-slate-400"/>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{hall.capacityOptions?.[0]} Pax</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-green-500"/>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Safe Station</span>
                   </div>
                </div>
             </div>
             {selectedHall?.id === hall.id && <div className="absolute top-6 right-6"><CheckCircle size={24} className="text-sun-500 animate-in zoom-in"/></div>}
          </button>
        ))}
      </div>

      {selectedHall && (
        <div className="bg-slate-950 p-10 rounded-[3.5rem] space-y-8 text-white shadow-3xl relative overflow-hidden border border-white/5 animate-in slide-in-from-bottom-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-sun-500 rounded-full blur-[100px] opacity-10 -mr-20 -mt-20" />
            <div className="relative z-10 space-y-8">
               <div className="flex justify-between items-center px-1">
                  <div className="space-y-1">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Magnitude (Hours)</span>
                     <div className="flex items-center gap-6 pt-2">
                        <button onClick={() => setDurationCount(Math.max(1, durationCount - 1))} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-sun-400 border border-white/10 active:scale-90 transition-all">-</button>
                        <span className="text-4xl font-black">{durationCount}</span>
                        <button onClick={() => setDurationCount(durationCount + 1)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-sun-400 border border-white/10 active:scale-90 transition-all">+</button>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Total Service Cost</span>
                     <h4 className="text-4xl font-black text-sun-500 tracking-tighter italic leading-none">₦{totalInvestment.toLocaleString()}</h4>
                  </div>
               </div>

               <div className="flex items-center gap-4 p-5 bg-white/5 rounded-[2rem] border border-white/10">
                  <Calendar size={20} className="text-sun-500" />
                  <input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)}
                    className="bg-transparent text-sm font-black uppercase text-white outline-none flex-1"
                  />
               </div>

               <button 
                onClick={handleBooking}
                disabled={isSyncing}
                className="w-full bg-sun-500 text-slate-950 py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 border-b-4 border-sun-700"
               >
                  {isSyncing ? <><Loader2 className="animate-spin" /> Syncing...</> : 'Launch Reserve'}
               </button>
            </div>
        </div>
      )}
    </div>
  );
};
