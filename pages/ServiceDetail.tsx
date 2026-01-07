
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MOCK_STAFF, SERVICE_CATEGORIES } from '../constants';
import { ServiceType, ServiceItem, Staff } from '../types';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, Clock, Calendar, CheckCircle, Info, UserCircle, Loader2, 
  Star, ShieldCheck, Sparkles, Zap, Package, Award, ChevronRight, X
} from 'lucide-react';

export const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { services, addBooking } = useApp();
  
  const category = SERVICE_CATEGORIES.find(c => c.id === id);
  const serviceList = services[id as string] || [];
  
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Scheduling State
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");

  const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM", "06:30 PM"];

  const filteredStaff = useMemo(() => {
    return MOCK_STAFF.filter(s => s.role === id || s.role === 'SALON');
  }, [id]);

  useEffect(() => {
    if (location.state?.rebookData) {
      const data = location.state.rebookData;
      const service = serviceList.find(s => s.id === data.serviceId);
      if (service) {
        setSelectedService(service);
        const staff = filteredStaff.find(s => s.name === data.staffName) || null;
        if (staff) setSelectedStaff(staff);
      }
    }
  }, [location.state, serviceList, filteredStaff]);

  if (!category) return <div className="p-24 text-center font-black uppercase text-slate-400 text-lg">Service manifest not found</div>;

  const handleFinalizeBooking = () => {
    if (selectedService && selectedStaff && date && time) {
        setIsRedirecting(true);
        const bookingPayload = {
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
            serviceId: selectedService.id,
            serviceName: selectedService.name,
            category: id as ServiceType,
            date,
            time,
            status: 'PENDING' as const,
            depositPaid: false,
            price: selectedService.price,
            staffName: selectedStaff.name,
            location: 'Main Hub Center'
        };
        setTimeout(() => {
          navigate('/payment', { state: { pendingBooking: bookingPayload, totalAmount: selectedService.price } });
        }, 1000);
    }
  };

  const relatedAddons = useMemo(() => {
    if (!selectedService?.relatedServices) return [];
    return serviceList.filter(s => selectedService.relatedServices?.includes(s.id));
  }, [selectedService, serviceList]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-36">
      <div className="relative h-64">
        <img src={category.image} alt={category.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
        <button onClick={() => navigate(-1)} className="absolute top-7 left-7 bg-white/20 backdrop-blur-md p-3 rounded-full text-white transition-transform active:scale-90 border border-white/20">
          <ArrowLeft size={24} />
        </button>
        <div className="absolute bottom-12 left-8 text-white pr-8 animate-in slide-in-from-left duration-500">
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-sun-500 text-slate-950 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">Premium Service</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight uppercase leading-none">{category.title}</h1>
            <p className="text-xs opacity-70 font-bold mt-2 uppercase tracking-[0.25em]">{selectedService ? selectedService.name : 'Select node from manifest'}</p>
        </div>
      </div>

      <div className="p-7 -mt-8 relative z-10 bg-slate-50 dark:bg-slate-900 rounded-t-[3.5rem] min-h-[60vh] shadow-2xl space-y-9">
        {/* PROGRESS BAR */}
        <div className="flex gap-2">
            {[1,2,3].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-sun-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
            ))}
        </div>

        {step === 1 && (
            <div className="space-y-8 animate-in fade-in">
                <div className="space-y-4">
                    <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-[0.3em] px-1">Select Service Node</h3>
                    <div className="grid gap-4">
                        {serviceList.map(service => (
                            <div 
                                key={service.id}
                                onClick={() => setSelectedService(service)}
                                className={`p-6 rounded-[2.5rem] border-2 flex justify-between items-center cursor-pointer transition-all group ${
                                    selectedService?.id === service.id 
                                    ? 'border-sun-500 bg-sun-50 dark:bg-sun-900/10' 
                                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-sun-200 shadow-sm'
                                }`}
                            >
                                <div className="flex gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${selectedService?.id === service.id ? 'bg-sun-500 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                                      <Sparkles size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-slate-800 dark:text-white text-lg leading-tight uppercase truncate max-w-[150px]">{service.name}</h4>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{service.durationMin} mins duration</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-black text-sun-600 text-xl tracking-tighter leading-none">₦{service.price.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {selectedService && (
                   <div className="bg-slate-950 p-8 rounded-[3rem] text-white space-y-6 shadow-2xl relative overflow-hidden border border-white/5 animate-in slide-in-from-bottom-5">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-sun-500 rounded-full blur-[80px] opacity-10" />
                      <div className="relative z-10">
                        <h4 className="text-[10px] font-black text-sun-500 uppercase tracking-[0.3em] mb-3">Service Intel</h4>
                        <p className="text-sm font-bold text-slate-400 leading-relaxed uppercase tracking-tight italic">"{selectedService.description || "Premium hub service protocol active."}"</p>
                        
                        {relatedAddons.length > 0 && (
                          <div className="mt-8 space-y-4">
                            <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5 pb-2">Recommended Optimization Bundles</h5>
                            {relatedAddons.map(addon => (
                              <button key={addon.id} className="w-full flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sun-400"><Zap size={14}/></div>
                                   <span className="text-[10px] font-black uppercase tracking-widest">{addon.name}</span>
                                </div>
                                <span className="text-[10px] font-black text-sun-500 group-hover:underline">+₦{addon.price.toLocaleString()}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button onClick={() => setStep(2)} className="w-full bg-sun-500 text-slate-950 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all">Select Professional</button>
                   </div>
                )}
            </div>
        )}

        {step === 2 && (
            <div className="space-y-9 animate-in slide-in-from-right duration-300">
                <div className="space-y-4">
                    <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-[0.3em] px-1">Assign Operator</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {filteredStaff.map(staff => (
                            <div 
                                key={staff.id} 
                                onClick={() => setSelectedStaff(staff)}
                                className={`p-6 rounded-[2.5rem] border-2 flex items-center justify-between cursor-pointer transition-all active:scale-[0.98] ${
                                    selectedStaff?.id === staff.id 
                                    ? 'border-sun-500 bg-sun-50 dark:bg-sun-900/10' 
                                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800'
                                }`}
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-16 h-16 rounded-3xl overflow-hidden border-2 shadow-inner transition-colors ${selectedStaff?.id === staff.id ? 'border-sun-500' : 'border-slate-100 dark:border-slate-700'}`}>
                                         <img src={`https://picsum.photos/seed/${staff.id}/150`} alt={staff.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="space-y-1">
                                      <h4 className={`text-lg font-black uppercase leading-none ${selectedStaff?.id === staff.id ? 'text-sun-600' : 'dark:text-white'}`}>{staff.name}</h4>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{staff.specialization || 'Hub Professional'}</p>
                                      <div className="flex items-center gap-2 mt-2">
                                         <div className="flex items-center gap-1 bg-sun-50 dark:bg-sun-900/20 px-2 py-0.5 rounded-lg text-sun-600">
                                            <Star size={10} fill="currentColor" />
                                            <span className="text-[10px] font-black">{staff.rating}</span>
                                         </div>
                                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{staff.ratingCount}+ logs</span>
                                      </div>
                                    </div>
                                </div>
                                {selectedStaff?.id === staff.id && <div className="w-8 h-8 rounded-full bg-sun-500 text-white flex items-center justify-center shadow-lg animate-in zoom-in"><CheckCircle size={20} /></div>}
                            </div>
                        ))}
                    </div>
                </div>

                {selectedStaff && (
                   <div className="pt-4 animate-in slide-in-from-bottom-5">
                      <button onClick={() => setStep(3)} className="w-full bg-slate-900 dark:bg-sun-500 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all">Schedule Manifest</button>
                      <button onClick={() => setStep(1)} className="w-full text-slate-400 font-black text-[9px] uppercase tracking-[0.4em] py-5">Change Service Node</button>
                   </div>
                )}
            </div>
        )}

        {step === 3 && (
            <div className="space-y-9 animate-in slide-in-from-right duration-300">
                 <div className="space-y-6">
                    <div className="space-y-3 px-1">
                      <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-[0.3em]">Execution Date</h3>
                      <div className="relative group">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-sun-500" size={20} />
                        <input 
                            type="date" 
                            min={today}
                            value={date} 
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full pl-14 pr-5 py-6 rounded-[2rem] bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 font-black text-sm dark:text-white outline-none focus:border-sun-500 shadow-inner" 
                        />
                      </div>
                    </div>

                    <div className="space-y-3 px-1">
                      <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-[0.3em]">Execution Window</h3>
                      <div className="grid grid-cols-3 gap-3">
                         {timeSlots.map(slot => (
                           <button 
                             key={slot} 
                             onClick={() => setTime(slot)}
                             className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border-2 ${time === slot ? 'bg-sun-500 border-sun-500 text-white shadow-xl scale-105' : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-800 text-slate-400'}`}
                           >
                              {slot}
                           </button>
                         ))}
                      </div>
                    </div>
                 </div>

                 <div className="bg-slate-950 p-10 rounded-[3.5rem] space-y-8 text-white shadow-3xl relative overflow-hidden border border-white/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sun-500 rounded-full blur-[80px] opacity-10" />
                    <div className="space-y-6 relative z-10">
                       <div className="flex justify-between items-center border-b border-white/5 pb-6">
                          <div className="space-y-1">
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Investment</span>
                             <h4 className="text-4xl font-black text-sun-500 tracking-tighter leading-none">₦{selectedService?.price.toLocaleString()}</h4>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-lg"><Award size={32} className="text-sun-500"/></div>
                       </div>
                       
                       <div className="grid gap-5">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                             <span className="text-slate-500">Service</span>
                             <span className="truncate max-w-[150px]">{selectedService?.name}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                             <span className="text-slate-500">Operator</span>
                             <span>{selectedStaff?.name}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                             <span className="text-slate-500">Schedule</span>
                             <span>{date} @ {time || 'Select Time'}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-5">
                    <button 
                        onClick={handleFinalizeBooking} 
                        disabled={!time || isRedirecting} 
                        className="w-full bg-sun-500 text-slate-950 py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30 border-b-4 border-sun-700"
                    >
                        {isRedirecting ? <><Loader2 className="animate-spin" size={24} /> Syncing...</> : 'Authorize manifest'}
                    </button>
                    <button onClick={() => setStep(2)} className="w-full text-slate-400 font-black text-[9px] uppercase tracking-[0.4em] py-3">Change Operator</button>
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};
